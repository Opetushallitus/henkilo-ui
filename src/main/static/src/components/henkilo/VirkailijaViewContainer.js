import React from 'react'
import {connect} from 'react-redux';
import HenkiloViewPage from "../../components/henkilo/HenkiloViewPage";
import {
    fetchHenkilo, fetchHenkiloOrgs, fetchKayttajatieto, clearHenkilo
} from "../../actions/henkilo.actions";
import {
    fetchKansalaisuusKoodisto, fetchKieliKoodisto, fetchSukupuoliKoodisto, fetchYhteystietotyypitKoodisto,
} from "../../actions/koodisto.actions";
import {updateHenkiloNavigation} from "../../actions/navigation.actions";
import {henkiloViewTabs} from "../navigation/NavigationTabs";
import {
    fetchAllKayttooikeusAnomusForHenkilo,
    fetchAllKayttooikeusryhmasForHenkilo, getGrantablePrivileges,
} from "../../actions/kayttooikeusryhma.actions";
import {fetchOmattiedotOrganisaatios} from "../../actions/omattiedot.actions";

class VirkailijaViewContainer extends React.Component {
    componentDidMount() {
        this.props.clearHenkilo();
        if (this.props.oidHenkilo === this.props.ownOid) {
            this.props.router.push('/omattiedot');
        }
        if (this.props.isAdmin) {
            this.props.router.push('/admin/' + this.props.oidHenkilo);
        }
        else {
            const tabs = henkiloViewTabs(this.props.oidHenkilo, this.props.henkilo, 'virkailija');
            this.props.updateHenkiloNavigation(tabs);

            this.props.fetchHenkilo(this.props.oidHenkilo);
            this.props.fetchHenkiloOrgs(this.props.oidHenkilo);
            this.props.fetchHenkiloSlaves(this.props.oidHenkilo);
            this.props.fetchKieliKoodisto();
            this.props.fetchKansalaisuusKoodisto();
            this.props.fetchSukupuoliKoodisto();
            this.props.fetchKayttajatieto(this.props.oidHenkilo);
            this.props.fetchYhteystietotyypitKoodisto();
            this.props.fetchAllKayttooikeusryhmasForHenkilo(this.props.oidHenkilo);
            this.props.fetchAllKayttooikeusAnomusForHenkilo(this.props.oidHenkilo);
            this.props.fetchOmattiedotOrganisaatios();

            this.props.getGrantablePrivileges(this.props.oidHenkilo);
        }
    };


    componentWillReceiveProps(nextProps) {
        const tabs = henkiloViewTabs(this.props.oidHenkilo, nextProps.henkilo, 'virkailija');
        this.props.updateHenkiloNavigation(tabs);
    }

    render() {
        const props = {...this.props, L: this.L, locale: this.props.locale, createBasicInfo: this._createBasicInfo,
            readOnlyButtons: this._readOnlyButtons,
        };
        return <HenkiloViewPage {...props} view="VIRKAILIJA" />;
    };

    constructor(props) {
        super(props);

        this.L = this.props.l10n[this.props.locale];
    };
}

const mapStateToProps = (state, ownProps) => {
    return {
        path: ownProps.location.pathname,
        oidHenkilo: ownProps.params['oid'],
        henkiloType: ownProps.params['henkiloType'],
        henkilo: state.henkilo,
        l10n: state.l10n.localisations,
        koodisto: state.koodisto,
        locale: state.locale,
        kayttooikeus: state.kayttooikeus,
        organisaatioCache: state.organisaatio.cached,
        notifications: state.notifications,
        isAdmin: state.omattiedot.isAdmin,
        ownOid: state.omattiedot.data.oid,
    };
};

export default connect(mapStateToProps, {
    fetchHenkilo,
    fetchHenkiloOrgs,
    fetchKieliKoodisto,
    fetchKansalaisuusKoodisto,
    fetchSukupuoliKoodisto,
    fetchYhteystietotyypitKoodisto,
    fetchKayttajatieto,
    updateHenkiloNavigation,
    fetchAllKayttooikeusryhmasForHenkilo,
    fetchAllKayttooikeusAnomusForHenkilo,
    fetchOmattiedotOrganisaatios,
    getGrantablePrivileges,
    clearHenkilo})(VirkailijaViewContainer);
