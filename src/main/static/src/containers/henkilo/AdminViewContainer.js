import React from 'react'
import {connect} from 'react-redux';
import AdminViewPage from "../../components/henkilo/AdminViewPage";
import {
    fetchHenkilo, fetchHenkiloOrgs, fetchKayttajatieto, passivoiHenkilo, updateHenkiloAndRefetch, updateAndRefetchKayttajatieto,
    updatePassword, yksiloiHenkilo
} from "../../actions/henkilo.actions";
import {
    fetchKansalaisuusKoodisto, fetchKieliKoodisto, fetchSukupuoliKoodisto,
    fetchYhteystietotyypitKoodisto
} from "../../actions/koodisto.actions";
import {updateNavigation} from "../../actions/navigation.actions";
import {adminNavi} from "../../configuration/navigationconfigurations";


const AdminViewContainer = React.createClass({
    componentDidMount: function() {
        this.props.updateNavigation(adminNavi(this.props.oid), '/henkilo');

        this.props.fetchHenkilo(this.props.oid);
        this.props.fetchHenkiloOrgs(this.props.oid);
        this.props.fetchYhteystietotyypitKoodisto();
        this.props.fetchKieliKoodisto();
        this.props.fetchKansalaisuusKoodisto();
        this.props.fetchSukupuoliKoodisto();
        this.props.fetchKayttajatieto(this.props.oid);
    },
    render: function() {
        return <AdminViewPage {...this.props} />;
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        path: ownProps.location.pathname,
        oid: ownProps.params['oid'],
        henkilo: state.henkilo,
        l10n: state.l10n.localisations,
        koodisto: state.koodisto,
    };
};

export default connect(mapStateToProps, {fetchHenkilo, fetchHenkiloOrgs, fetchYhteystietotyypitKoodisto, fetchKieliKoodisto,
fetchKansalaisuusKoodisto, fetchSukupuoliKoodisto, updateHenkiloAndRefetch, fetchKayttajatieto, updatePassword, passivoiHenkilo,
    yksiloiHenkilo, updateAndRefetchKayttajatieto, updateNavigation})(AdminViewContainer)