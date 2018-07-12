import React from 'react'
import {connect} from 'react-redux'
import AnomusPage from './AnomusPage'
import {clearHaetutKayttooikeusryhmat, fetchHaetutKayttooikeusryhmat} from '../../actions/anomus.actions'
import {fetchAllOrganisaatios, fetchAllRyhmas} from '../../actions/organisaatio.actions'
import {updateHaettuKayttooikeusryhmaInAnomukset, clearHaettuKayttooikeusryhma} from '../../actions/kayttooikeusryhma.actions'
import PropertySingleton from '../../globals/PropertySingleton'
import {fetchOmattiedotOrganisaatios} from '../../actions/omattiedot.actions'
import { addGlobalNotification } from "../../actions/notification.actions";

class AnomusPageContainer extends React.Component {
    render() {
        const L = this.props.l10n[this.props.locale];
        return (
          <div className="wrapper">
            <span className="oph-h2 oph-bold">{L['HENKILO_AVOIMET_KAYTTOOIKEUDET_OTSIKKO']}</span>
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
        kayttooikeusAnomusLoading: state.haetutKayttooikeusryhmat.isLoading,
        organisaatioCache: state.organisaatio.cached,
        haetutKayttooikeusryhmatLoading: state.haetutKayttooikeusryhmat.isLoading,
        organisaatiot: state.organisaatio.organisaatiot.organisaatiot,
        rootOrganisaatioOid: PropertySingleton.getState().rootOrganisaatioOid,
        isAdmin: state.omattiedot.isAdmin,
    };
};

export default connect(mapStateToProps, {
    fetchHaetutKayttooikeusryhmat,
    fetchAllOrganisaatios,
    fetchAllRyhmas,
    updateHaettuKayttooikeusryhmaInAnomukset,
    clearHaettuKayttooikeusryhma,
    clearHaetutKayttooikeusryhmat,
    fetchOmattiedotOrganisaatios,
    addGlobalNotification
})(AnomusPageContainer);
