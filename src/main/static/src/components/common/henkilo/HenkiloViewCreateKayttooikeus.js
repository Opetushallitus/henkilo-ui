// @flow
import './HenkiloViewCreateKayttooikeus.css';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import scrollToComponent from 'react-scroll-to-component';
import CKKohde from "./createkayttooikeus/CKKohde";
import CKKesto from "./createkayttooikeus/CKKesto";
import CKKayttooikeudet from "./createkayttooikeus/CKKayttooikeudet";
import CKHaeButton from "./createkayttooikeus/CKHaeButton";
import {
    addKayttooikeusToHenkilo,
    fetchAllowedKayttooikeusryhmasForOrganisation
} from "../../../actions/kayttooikeusryhma.actions";
import type {Localisations} from "../../../types/localisation.type";
import type {Locale} from "../../../types/locale.type";
import type {ValidationMessage} from "../../../types/validation.type";
import PropertySingleton from "../../../globals/PropertySingleton";
import type { ValittuKayttooikeusryhma } from './createkayttooikeus/CKKayttooikeudet'
import type {KayttooikeusRyhmaState} from "../../../reducers/kayttooikeusryhma.reducer";
import type {OrganisaatioHenkilo} from '../../../types/domain/kayttooikeus/OrganisaatioHenkilo.types';

type OwnProps = {
    vuosia: number,
    kayttooikeus: KayttooikeusRyhmaState,
    existingKayttooikeusRef: {},
    oidHenkilo: string,
    isPalvelukayttaja: boolean,
}

type Props = {
    ...OwnProps,
    organisaatios: Array<OrganisaatioHenkilo>,
    fetchAllowedKayttooikeusryhmasForOrganisation: (string, string) => void,
    L: Localisations,
    locale: Locale,
    oidHenkilo: string,
    addKayttooikeusToHenkilo: (string, string, Array<{id: number, kayttoOikeudenTila: string, alkupvm: string, loppupvm: string}>) => void,
};

type KayttooikeusModel = {
    kayttokohdeOrganisationOid: string,
    myonnettavatOikeudet: Array<{}>,
    alkupvm: moment,
    loppupvm: moment,
};

type State  = {
    selectedList: Array<ValittuKayttooikeusryhma>,
    validationMessages: {[key: string]: ValidationMessage},
    kayttooikeusData: Array<{}>,
    kayttooikeusModel: KayttooikeusModel,
    organisaatioSelection: string
};

class HenkiloViewCreateKayttooikeus extends React.Component<Props, State> {
    initialKayttooikeusModel: () => KayttooikeusModel;
    initialState: State;
    organisationAction: (any) => void;
    close: (number) => void;
    kayttooikeudetAction: (ValittuKayttooikeusryhma) => void;
    createKayttooikeusAction: () => void;
    kestoAlkaaAction: (moment) => void;
    kestoPaattyyAction: (moment) => void;

    constructor(props: Props) {
        super(props);

        this.initialKayttooikeusModel = () => ({
            kayttokohdeOrganisationOid: '',
            myonnettavatOikeudet: [],
            alkupvm: moment(),
            loppupvm: moment().add(this.props.vuosia, 'years'),
        });
        this.initialState = {
            selectedList: [],
            validationMessages: {
                organisation: {
                    id: 'organisation',
                    labelLocalised: this.props.L['HENKILO_LISAA_KAYTTOOIKEUDET_ORGANISAATIO_VALID'],
                    isValid: false
                },
                kayttooikeus: {
                    id: 'kayttooikeus',
                    labelLocalised: this.props.L['HENKILO_LISAA_KAYTTOOIKEUDET_KAYTTOOIKEUS_VALID'],
                    isValid: false
                },
            },
            organisaatioSelection: '',
            kayttooikeusData: [],
            kayttooikeusModel: this.initialKayttooikeusModel(),
        };

        this.organisationAction = (value) => {
            const isOrganisaatio = value.hasOwnProperty('oid');
            const oid = isOrganisaatio ? value.oid : value.value;

            // ryhmaName -muuttujaa ei näytetä missään. Sitä käytetään vain käyttöoikeuden valintamodalin enablointiin
            const ryhmaName: string = !isOrganisaatio && oid ? 'Ryhmävalinta' : '';
            this.setState({
                validationMessages: {
                    ...this.state.validationMessages,
                    organisation: {
                        ...this.state.validationMessages.organisation,
                        isValid: true,
                    }
                },
                kayttooikeusModel: {
                    ...this.state.kayttooikeusModel,
                    kayttokohdeOrganisationOid: oid,
                },
                organisaatioSelection: isOrganisaatio ? value.name : ryhmaName
            });
            this.props.fetchAllowedKayttooikeusryhmasForOrganisation(this.props.oidHenkilo, oid);
        };

        this.kayttooikeudetAction = (value: ValittuKayttooikeusryhma) => {
            if (value.value) {
                this.setState({
                    selectedList: [...this.state.selectedList, value],
                });
            }
            this.setState({
                validationMessages: {
                    ...this.state.validationMessages,
                    kayttooikeus: {
                        ...this.state.validationMessages.kayttooikeus,
                        isValid: true,
                    }
                },
            });
        };

        this.close = (kayttooikeusId: number) => {
            const selectedList = this.state.selectedList.filter(selected => selected.value !== kayttooikeusId);
            const id = 'kayttooikeus';
            const labelLocalised = this.props.L['HENKILO_LISAA_KAYTTOOIKEUDET_KAYTTOOIKEUS_VALID'];
            let newState: State = Object.assign({}, this.state, { selectedList: selectedList, });
            if (this.state.validationMessages[id] === undefined
                && !selectedList.length) {
                newState = Object.assign(newState, {
                    validationMessages: {
                        ...this.state.validationMessages,
                        kayttooikeus: {id, labelLocalised, isValid: false,}},
                });
            }
            this.setState(newState);
        };

        this.kestoAlkaaAction = (value: moment) => {
            this.setState({
                kayttooikeusModel: {
                    ...this.state.kayttooikeusModel,
                    alkupvm: value,
                }
            });
        };

        this.kestoPaattyyAction = (value: moment) => {
            this.setState({
                kayttooikeusModel: {
                    ...this.state.kayttooikeusModel,
                    loppupvm: value,
                }
            });
        };

        this.createKayttooikeusAction = () => {
            this.props.addKayttooikeusToHenkilo(this.props.oidHenkilo, this.state.kayttooikeusModel.kayttokohdeOrganisationOid,
                this.state.selectedList.map(selected => ({
                    id: selected.value,
                    kayttoOikeudenTila: 'MYONNA',
                    alkupvm: moment(this.state.kayttooikeusModel.alkupvm).format(PropertySingleton.state.PVM_DBFORMAATTI),
                    loppupvm: moment(this.state.kayttooikeusModel.loppupvm).format(PropertySingleton.state.PVM_DBFORMAATTI),
                })));
            // clear
            this.setState(this.initialState);
            // Scroll
            scrollToComponent(this.props.existingKayttooikeusRef, {align: 'top'});
        };

        this.state = this.initialState;
    };

    render() {
        return (
            <div className="henkiloViewUserContentWrapper">
                <div className="add-kayttooikeus-container">
                    <div className="header">
                        <p className="oph-h2 oph-bold">{this.props.L['HENKILO_LISAA_KAYTTOOIKEUDET_OTSIKKO']}</p>
                    </div>
                    <div>
                        <table>
                            <colgroup>
                                <col span={1} style={{width: "30%"}} />
                                <col span={1} style={{width: "60%"}} />
                                <col span={1} style={{width: "10%"}} />
                            </colgroup>
                            <tbody>
                            <CKKohde L={this.props.L}
                                     locale={this.props.locale}
                                     organisationValue={this.state.kayttooikeusModel.kayttokohdeOrganisationOid}
                                     organisationAction={this.organisationAction}
                                     organisationData={this.props.organisaatios}
                                     selection={this.state.organisaatioSelection}/>
                            <CKKesto L={this.props.L}
                                     vuosia={this.props.vuosia}
                                     alkaaInitValue={this.state.kayttooikeusModel.alkupvm}
                                     paattyyInitValue={this.state.kayttooikeusModel.loppupvm}
                                     alkaaPvmAction={this.kestoAlkaaAction}
                                     paattyyPvmAction={this.kestoPaattyyAction} />
                            <CKKayttooikeudet L={this.props.L}
                                              locale={this.props.locale}
                                              kayttooikeusData={this.props.kayttooikeus.allowedKayttooikeus[this.props.oidHenkilo]}
                                              selectedList={this.state.selectedList}
                                              close={this.close}
                                              kayttooikeusAction={this.kayttooikeudetAction}
                                              loading={this.props.kayttooikeus.allowedKayttooikeus.loading}
                                              selectedOrganisationOid={this.state.organisaatioSelection}
                                              isPalvelukayttaja={this.props.isPalvelukayttaja}
                            />
                            <CKHaeButton L={this.props.L}
                                         validationMessages={this.state.validationMessages}
                                         haeButtonAction={this.createKayttooikeusAction} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };
}

const mapStateToProps = (state, ownProps) => ({
    L: state.l10n.localisations[state.locale],
    locale: state.locale,
    organisaatios: state.omattiedot.organisaatios,
});

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, {
    fetchAllowedKayttooikeusryhmasForOrganisation,
    addKayttooikeusToHenkilo,
})(HenkiloViewCreateKayttooikeus);
