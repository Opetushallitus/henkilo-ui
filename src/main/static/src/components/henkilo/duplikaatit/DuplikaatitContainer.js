
import VirkailijaDuplikaatitPage from './DuplikaatitPage';
import React from 'react';
import {connect} from 'react-redux';
import {fetchHenkilo, fetchHenkiloDuplicates, linkHenkilos} from '../../../actions/henkilo.actions';
import {fetchOmattiedot} from '../../../actions/omattiedot.actions';
import { fetchMaatJaValtiotKoodisto, fetchKieliKoodisto } from '../../../actions/koodisto.actions';
import {updateHenkiloNavigation} from "../../../actions/navigation.actions";
import {duplikaatitNavi} from "../../../configuration/navigationconfigurations";
import {removeNotification} from "../../../actions/notifications.actions";

class VirkailijaDuplikaatitContainer extends React.Component {

    static propTypes = {  };

    async componentDidMount() {
        this.props.updateHenkiloNavigation(duplikaatitNavi(this.props.oidHenkilo, this.props.henkiloType));

        this.props.fetchHenkilo(this.props.oidHenkilo);
        this.props.fetchOmattiedot();
        this.props.fetchHenkiloDuplicates(this.props.oidHenkilo);
        this.props.fetchMaatJaValtiotKoodisto();
        this.props.fetchKieliKoodisto();
    }

    render() {
        return <VirkailijaDuplikaatitPage {...this.props} />
    }

}

const mapStateToProps = (state, ownProps) => ({
    oidHenkilo: ownProps.params['oid'],
    henkiloType: ownProps.params['henkiloType'],
    l10n: state.l10n.localisations,
    locale: state.locale,
    omattiedot: state.omattiedot,
    henkilo: state.henkilo,
    koodisto: state.koodisto,
    notifications: state.notifications.duplicatesNotifications,
});

export default connect(mapStateToProps, {fetchHenkilo, fetchOmattiedot, fetchHenkiloDuplicates,
    fetchMaatJaValtiotKoodisto, fetchKieliKoodisto, linkHenkilos, updateHenkiloNavigation, removeNotification})(VirkailijaDuplikaatitContainer);