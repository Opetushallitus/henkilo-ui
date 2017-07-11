import React from 'react'
import {connect} from 'react-redux'
import AnomusPage from '../components/anomus/AnomusPage'
import {clearHaetutKayttooikeusryhmat, fetchHaetutKayttooikeusryhmat} from '../actions/anomus.actions'
import {fetchAllOrganisaatios} from '../actions/organisaatio.actions'
import {updateHaettuKayttooikeusryhmaInAnomukset} from '../actions/kayttooikeusryhma.actions'
import PropertySingleton from '../globals/PropertySingleton'

class AnomusPageContainer extends React.Component {
    render() {
        return (
          <div className="header">
            <AnomusPage {...this.props}/>
          </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        l10n: state.l10n.localisations,
        locale: state.locale,
        kayttooikeusAnomus: state.haetutKayttooikeusryhmat.data,
        organisaatioCache: state.organisaatio.cached,
        haetutKayttooikeusryhmatLoading: state.haetutKayttooikeusryhmat.loading,
        organisaatiot: state.organisaatio.organisaatiot.organisaatiot,
        rootOrganisaatioOid: PropertySingleton.getState().rootOrganisaatioOid,
        isAdmin: state.omattiedot.isAdmin,
    };
};

export default connect(mapStateToProps, {
    fetchHaetutKayttooikeusryhmat,
    fetchAllOrganisaatios,
    updateHaettuKayttooikeusryhmaInAnomukset,
    clearHaetutKayttooikeusryhmat,
})(AnomusPageContainer);
