// @flow
import { connect } from 'react-redux';
import BasicInfoForm from './BasicinfoForm';
import React from 'react';
import KutsuOrganisaatios from './KutsuOrganisaatios';
import { fetchOmattiedotOrganisaatios } from '../../actions/omattiedot.actions';
import { fetchAllRyhmas } from '../../actions/organisaatio.actions';
import { kutsuAddOrganisaatio } from '../../actions/kutsuminen.actions';
import KutsuConfirmation from './KutsuConfirmation';
import Loader from '../common/icons/Loader';
import type {KutsuOrganisaatio} from "../../types/domain/kayttooikeus/OrganisaatioHenkilo.types";
import type {Henkilo} from "../../types/domain/oppijanumerorekisteri/henkilo.types";
import type {Localisations, L10n} from "../../types/localisation.type";
import ValidationMessageButton from "../common/button/ValidationMessageButton";
import type {ValidationMessage} from "../../types/validation.type";
import StaticUtils from "../common/StaticUtils";
import { fetchHenkilo } from '../../actions/henkilo.actions'
import { LocalNotification } from '../common/Notification/LocalNotification';
import type {OrganisaatioState} from "../../reducers/organisaatio.reducer";
import type {KutsuBasicInfo} from "../../types/KutsuBasicInfo.types";
import { validateEmail } from '../../validation/EmailValidator';

type OwnProps = {
    ryhmaState: any,
    location: any,
}

type Props = {
    ...OwnProps,
    fetchOmattiedotOrganisaatios: () => void,
    fetchAllRyhmas: () => void,
    L: Localisations,
    l10n: L10n,
    locale: string,
    addedOrgs: Array<KutsuOrganisaatio>,
    kutsuAddOrganisaatio: (KutsuOrganisaatio) => void,
    kayttajaOid: string,
    fetchHenkilo: (oid: string) => Promise<*>,
    henkilo: Henkilo,
    organisaatioState: OrganisaatioState,
    omattiedotLoading: boolean,
    henkiloLoading: boolean,
    ryhmasLoading: boolean
}

type State = {
    confirmationModalOpen: boolean,
    basicInfo: KutsuBasicInfo,
    validationMessages: {organisaatioKayttooikeus: ValidationMessage, allFilled: ValidationMessage, sahkoposti: ValidationMessage},
}

class KutsuminenPage extends React.Component<Props, State>  {

    initialBasicInfo = {
        etunimi: '',
        sukunimi: '',
        email: '',
        languageCode: '',
        saate: ''
    };

    initialValidationMessages: {organisaatioKayttooikeus: ValidationMessage, allFilled: ValidationMessage, sahkoposti: ValidationMessage};

    constructor (props: Props) {
        super(props);

        this.initialValidationMessages = {
            organisaatioKayttooikeus: {
                id: 'organisaatioKayttooikeus',
                labelLocalised: this.props.L['VIRKAILIJAN_LISAYS_VALITSE_VAH_ORGANISAATIO_JA_YKSI_OIKEUS'],
                isValid: false,
            },
            allFilled: {
                id: 'allFilled',
                labelLocalised: this.props.L['VIRKAILIJAN_LISAYS_TAYTA_KAIKKI_KENTAT'],
                isValid: false,
            },
            sahkoposti: {
                id: 'sahkoposti',
                labelLocalised: this.props.L['VIRKAILIJAN_LISAYS_SAHKOPOSTI_VIRHEELLINEN'],
                isValid: true,
            },
        };

        this.state = {
            confirmationModalOpen: false,
            basicInfo: {...this.initialBasicInfo},
            validationMessages: {...this.initialValidationMessages},
        };
    }

    async componentDidMount() {
        this.props.fetchOmattiedotOrganisaatios();
        this.props.fetchAllRyhmas();
        await this.fetchKayttaja(this.props.kayttajaOid)
    }

    async componentWillReceiveProps(nextProps: Props) {
        if (this.props.kayttajaOid !== nextProps.kayttajaOid) {
            await this.fetchKayttaja(nextProps.kayttajaOid)
        }
        this.updateOrganisaatioValidation(nextProps.addedOrgs);
    }

    async fetchKayttaja(oid: string) {
        await this.props.fetchHenkilo(oid)
    }

    render() {
        const confirmationProps = {
            l10n: this.props.l10n,
            locale: this.props.locale,
            addedOrgs: this.props.addedOrgs,
            modalCloseFn: this.closeConfirmationModal.bind(this),
            modalOpen: this.state.confirmationModalOpen,
            basicInfo: this.state.basicInfo,
            clearBasicInfo: this.clearBasicInfo.bind(this),
        };
        const {basicInfo} = this.state;

        if (this.props.omattiedotLoading || this.props.henkiloLoading || this.props.ryhmasLoading) {
            return (<div className="wrapper"><Loader /></div>);
        }
        else {
            const disabled = this.isDisabled(this.props.henkilo);
            return (
                <div>
                    <form className="wrapper">
                        <p className="oph-h2 oph-bold">{this.props.L['VIRKAILIJAN_LISAYS_OTSIKKO']}</p>
                        <LocalNotification type="error" title={this.props.L['KUTSU_ESTETTY']} toggle={disabled}>
                            {this.props.L['KUTSU_ESTETTY_SYY']}
                        </LocalNotification>
                        <BasicInfoForm L={this.props.L}
                                       disabled={disabled}
                                       basicInfo={basicInfo}
                                       setBasicInfo={this.setBasicInfo.bind(this)}
                                       locale={this.props.locale}>
                        </BasicInfoForm>
                        <KutsuOrganisaatios L={this.props.L}
                                            addedOrgs={this.props.addedOrgs}
                                            henkilo={this.props.henkilo}
                                            locale={this.props.locale}
                                            addOrganisaatio={this.props.kutsuAddOrganisaatio}
                        />

                        <div className="kutsuFormFooter row">
                            <ValidationMessageButton buttonAction={this.openConfirmationModal.bind(this)}
                                                     validationMessages={this.state.validationMessages}>
                                {this.props.L['VIRKAILIJAN_LISAYS_TALLENNA']}
                            </ValidationMessageButton>
                        </div>
                        <KutsuConfirmation {...confirmationProps} />
                    </form>
                </div>
            )
        }
    }

    isDisabled(henkilo: Henkilo) {
        return !henkilo.hetu || !henkilo.yksiloityVTJ
    }

    static isValid(basicInfo: KutsuBasicInfo): boolean {
        const { email, etunimi, sukunimi, languageCode } = basicInfo;
        return !!email && !!etunimi && !!sukunimi && !!languageCode;
    }

    isOrganizationsValid(newAddedOrgs: Array<KutsuOrganisaatio>): boolean {
        return newAddedOrgs.length > 0
            && newAddedOrgs
                .every(org => StaticUtils.stringIsNotEmpty(org.oid) && org.selectedPermissions.length > 0);
    }

    setBasicInfo(basicInfo: KutsuBasicInfo) {
        this.setState({
            basicInfo,
            validationMessages: {
                ...this.state.validationMessages,
                allFilled: {
                    ...this.state.validationMessages.allFilled,
                    isValid: KutsuminenPage.isValid(basicInfo),
                },
                sahkoposti: {
                    ...this.state.validationMessages.sahkoposti,
                    isValid: !basicInfo.email || validateEmail(basicInfo.email),
                },
            },
        });
    }

    updateOrganisaatioValidation(newAddedOrgs: Array<KutsuOrganisaatio>) {
        this.setState({
            validationMessages: {
                ...this.state.validationMessages,
                organisaatioKayttooikeus: {
                    ...this.state.validationMessages.organisaatioKayttooikeus,
                    isValid: this.isOrganizationsValid(newAddedOrgs),
                },
            },
        });
    }

    clearBasicInfo() {
        this.setBasicInfo({...this.initialBasicInfo});
    }

    openConfirmationModal(e: Event) {
        e.preventDefault();
        this.setState({
            confirmationModalOpen: true,
        })
    }

    closeConfirmationModal(e: Event) {
        e.preventDefault();
        this.setState({
            confirmationModalOpen: false,
        })
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        path: ownProps.location.pathname,
        l10n: state.l10n.localisations,
        L: state.l10n.localisations[state.locale],
        omattiedotLoading: state.omattiedot.omattiedotLoading,
        kayttajaOid: state.omattiedot.data.oid,
        henkiloLoading: state.henkilo.henkiloLoading,
        henkilo: state.henkilo.henkilo,
        addedOrgs: state.kutsuminenOrganisaatios,
        locale: state.locale,
        organisaatioState: state.organisaatio,
        ryhmasLoading: state.ryhmatState.ryhmasLoading
    };
};

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, {fetchOmattiedotOrganisaatios, kutsuAddOrganisaatio, fetchHenkilo, fetchAllRyhmas})(KutsuminenPage);
