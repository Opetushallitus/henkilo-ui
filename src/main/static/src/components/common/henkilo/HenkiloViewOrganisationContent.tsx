import './HenkiloViewOrganisationContent.css';
import React from 'react';
import { connect } from 'react-redux';
import type { RootState } from '../../../store';
import Columns from 'react-columns';
import { Locale } from '../../../types/locale.type';
import PassivoiOrganisaatioButton from './buttons/PassivoiOrganisaatioButton';
import StaticUtils from '../StaticUtils';
import { Localisations } from '../../../types/localisation.type';
import { toLocalizedText } from '../../../localizabletext';
import { passivoiHenkiloOrg } from '../../../actions/henkilo.actions';
import { HenkiloState } from '../../../reducers/henkilo.reducer';
import { KayttooikeusRyhmaState } from '../../../reducers/kayttooikeusryhma.reducer';
import { StoreOrganisaatio } from '../../../types/domain/organisaatio/organisaatio.types';

type OwnProps = {
    readOnly: boolean;
};

type StateProps = {
    L: Localisations;
    locale: Locale;
    henkilo: HenkiloState;
    kayttooikeus: KayttooikeusRyhmaState;
};

type DispatchProps = {
    passivoiHenkiloOrg: (henkiloOid: string, organisaatioOid: string) => void;
};

type Props = OwnProps & StateProps & DispatchProps;

type State = {
    readOnly: boolean;
    showPassive: boolean;
};

type OrganisaatioFlat = {
    name: string;
    typesFlat: string;
    passive: boolean;
    id: string;
};

class HenkiloViewOrganisationContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            readOnly: this.props.readOnly,
            showPassive: false,
        };
    }

    render() {
        return (
            <div className="henkiloViewUserContentWrapper">
                <div>
                    <div className="header">
                        <p className="oph-h2 oph-bold">{this.props.L['HENKILO_ORGANISAATIOT_OTSIKKO']}</p>
                    </div>
                    <label className="oph-checkable" htmlFor="showPassive">
                        <input
                            id="showPassive"
                            type="checkbox"
                            className="oph-checkable-input"
                            onChange={() =>
                                this.setState({
                                    showPassive: !this.state.showPassive,
                                })
                            }
                        />
                        <span className="oph-checkable-text"> {this.props.L['HENKILO_NAYTA_PASSIIVISET_TEKSTI']}</span>
                    </label>
                    <div className="organisationContentWrapper">
                        <Columns queries={[{ columns: 3, query: 'min-width: 200px' }]} gap="10px">
                            {this.flatOrganisations(this.props.henkilo.henkiloOrgs).map((values, idx) =>
                                !values.passive || this.state.showPassive ? (
                                    <div key={idx}>
                                        <div>
                                            <span className="oph-bold">
                                                {values.name} {values.typesFlat}
                                            </span>
                                        </div>
                                        <div className="labelValue">
                                            <span className="oph-bold">{this.props.L['HENKILO_ORGTUNNISTE']}:</span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span>{values.id}</span>
                                        </div>
                                        <div className="labelValue">
                                            <PassivoiOrganisaatioButton
                                                passive={values.passive}
                                                id={values.id}
                                                L={this.props.L}
                                                passivoiOrgAction={this.passivoiHenkiloOrganisation.bind(this)}
                                            />
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </Columns>
                    </div>
                </div>
            </div>
        );
    }

    passivoiHenkiloOrganisation(organisationOid: string) {
        this.props.passivoiHenkiloOrg(this.props.henkilo.henkilo.oidHenkilo, organisationOid);
    }

    flatOrganisations(organisations: Array<StoreOrganisaatio>): Array<OrganisaatioFlat> {
        return organisations.map((organisation) => {
            const typesFlat = organisation.tyypit ? this.organisationTypesFlat(organisation.tyypit) : '';
            return {
                name: toLocalizedText(this.props.locale, organisation.nimi),
                typesFlat: typesFlat,
                passive: organisation.passivoitu,
                id: organisation.oid,
            };
        });
    }

    organisationTypesFlat(tyypit: string[]) {
        return tyypit.length ? '(' + StaticUtils.flatArray(tyypit) + ')' : '';
    }
}

const mapStateToProps = (state: RootState): StateProps => ({
    henkilo: state.henkilo,
    L: state.l10n.localisations[state.locale],
    locale: state.locale,
    kayttooikeus: state.kayttooikeus,
});

export default connect<StateProps, DispatchProps, OwnProps, RootState>(mapStateToProps, {
    passivoiHenkiloOrg,
})(HenkiloViewOrganisationContent);
