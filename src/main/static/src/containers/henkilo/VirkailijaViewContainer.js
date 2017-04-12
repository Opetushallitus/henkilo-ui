import React from 'react'
import {connect} from 'react-redux';
import VirkailijaViewPage from "../../components/henkilo/VirkailijaViewPage";
import {
    fetchHenkilo, fetchHenkiloOrgs, fetchKayttajatieto, passivoiHenkilo, passivoiHenkiloOrg, updateHenkiloAndRefetch,
    updateAndRefetchKayttajatieto,
    updatePassword, yksiloiHenkilo
} from "../../actions/henkilo.actions";
import {
    fetchKansalaisuusKoodisto, fetchKieliKoodisto, fetchSukupuoliKoodisto, fetchYhteystietotyypitKoodisto,
} from "../../actions/koodisto.actions";
import {updateNavigation} from "../../actions/navigation.actions";
import {virkailijaNavi} from "../../configuration/navigationconfigurations";
import AbstractViewContainer from "./AbstractViewContainer";
import {
    fetchAllKayttooikeusAnomusForHenkilo,
    fetchAllKayttooikeusryhmasForHenkilo
} from "../../actions/kayttooikeusryhma.actions";


class VirkailijaViewContainer extends AbstractViewContainer {
    componentDidMount() {
        this.props.updateNavigation(virkailijaNavi(this.props.oid), '/henkilo');

        this.props.fetchHenkilo(this.props.oid);
        this.props.fetchHenkiloOrgs(this.props.oid);
        this.props.fetchKieliKoodisto();
        this.props.fetchKansalaisuusKoodisto();
        this.props.fetchSukupuoliKoodisto();
        this.props.fetchKayttajatieto(this.props.oid);
        this.props.fetchYhteystietotyypitKoodisto();
        this.props.fetchAllKayttooikeusryhmasForHenkilo(this.props.oid);
        this.props.fetchAllKayttooikeusAnomusForHenkilo(this.props.oid);

    };

    render() {
        const props = {...this.props, L: this.L, locale: this.props.locale, isUserContentLoading: this._isUserContentLoading,
            isOrganisationContentLoading: this._isOrganisationContentLoading, createBasicInfo: this._createBasicInfo,
            createBasicInfo2: this._createBasicInfo2, createLoginInfo: this._createLoginInfo, readOnlyButtons: this._readOnlyButtons,
            editButtons: this._editButtons, createNotifications: this._createNotifications.bind(this),
            _createPopupErrorMessage: this._createPopupErrorMessage.bind(this), myonnaButton: this.createMyonnaConfirmButton.bind(this),
            hylkaaButton: this.createHylkaaConfirmButton.bind(this), };
        return <VirkailijaViewPage {...props} />;
    };

    constructor(props) {
        super(props);
        this.L = this.props.l10n[this.props.locale];
        this._isUserContentLoading = () => this.props.henkilo.henkiloLoading || this.props.koodisto.kieliKoodistoLoading
        || this.props.koodisto.kansalaisuusKoodistoLoading || this.props.koodisto.sukupuoliKoodistoLoading
        || this.props.henkilo.kayttajatietoLoading ||this.props.koodisto.yhteystietotyypitKoodistoLoading;
        this._isOrganisationContentLoading = () => this.props.henkilo.henkiloOrgsLoading;

        // Basic info box content
        this._createBasicInfo = () => [
            this.createSukunimiFieldWithAutofocus(),
            this.createEtunimetField(),
            this.createKutsumanimiField(),
            this.createAsiointikieliField(),
        ];
        this._createBasicInfo2 = (henkiloUpdate) => ([
            this.createOppijanumeroField(),
            this.createTyosahkopostiField(henkiloUpdate),
            this.createTyopuhelinField(henkiloUpdate),
        ]);
        this._createLoginInfo = () => [
            this.createKayttajanimiField(),
        ];
        // Basic info default buttons
        this._readOnlyButtons = (edit) => [
            this.createEditButton(edit),
            this.createPassivoiButton(),
            this.createHakaButton(),
            this.createPasswordButton(),
        ];

    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        path: ownProps.location.pathname,
        oid: ownProps.params['oid'],
        henkilo: state.henkilo,
        l10n: state.l10n.localisations,
        koodisto: state.koodisto,
        locale: state.locale,
        kayttooikeus: state.kayttooikeus,
    };
};

export default connect(mapStateToProps, {fetchHenkilo, fetchHenkiloOrgs, fetchKieliKoodisto,
    fetchKansalaisuusKoodisto, fetchSukupuoliKoodisto, fetchYhteystietotyypitKoodisto, updateHenkiloAndRefetch, fetchKayttajatieto,
    updatePassword, passivoiHenkilo, yksiloiHenkilo, updateAndRefetchKayttajatieto, updateNavigation,
    passivoiHenkiloOrg, fetchAllKayttooikeusryhmasForHenkilo, fetchAllKayttooikeusAnomusForHenkilo})(VirkailijaViewContainer);
