import {
    FETCH_HENKILO_REQUEST, FETCH_HENKILO_SUCCESS, FETCH_HENKILOORGS_REQUEST,
    FETCH_HENKILOORGS_SUCCESS, FETCH_KAYTTAJATIETO_FAILURE, FETCH_KAYTTAJATIETO_REQUEST, FETCH_KAYTTAJATIETO_SUCCESS,
    PASSIVOI_HENKILO_SUCCESS
} from "../actions/actiontypes";

const mapOrgHenkilosWithOrganisations = (henkiloOrgs, organisations) => {
    const orgOids = organisations.map(organisation => organisation.oid);
    return henkiloOrgs.filter(henkiloOrg => orgOids.indexOf(henkiloOrg.organisaatioOid) !== -1)
        .map(henkiloOrg => Object.assign({}, henkiloOrg, organisations.filter(org => org.oid === henkiloOrg.organisaatioOid)[0]));
};

export const henkilo = (state = {henkiloLoading: true, henkiloOrgsLoading: true, kayttajatietoLoading: true,
                            henkilo: {}, henkiloOrgs: [], kayttajatieto: {}, notifications: []}, action) => {
    switch (action.type) {
        case FETCH_HENKILO_REQUEST:
            return Object.assign({}, state, {henkiloLoading: true});
        case FETCH_HENKILO_SUCCESS:
            // TODO deep copy needed?
            return Object.assign({}, state, {henkiloLoading: false, henkilo: action.henkilo});
        case FETCH_KAYTTAJATIETO_REQUEST:
            return Object.assign({}, state, {kayttajatietoLoading: true});
        case FETCH_KAYTTAJATIETO_SUCCESS:
        case FETCH_KAYTTAJATIETO_FAILURE:
            return Object.assign({}, state, {kayttajatietoLoading: false, kayttajatieto: action.kayttajatieto});
        case FETCH_HENKILOORGS_REQUEST:
            return Object.assign({}, state, {henkiloOrgsLoading: true});
        case FETCH_HENKILOORGS_SUCCESS:
            return Object.assign({}, state, {
                henkiloOrgsLoading: false,
                henkiloOrgs: mapOrgHenkilosWithOrganisations(action.henkiloOrgs, action.organisations),
            });
        case PASSIVOI_HENKILO_SUCCESS:
            const newState = Object.assign({}, state);
            newState.notifications.push(action.notification);
            return newState;
        default:
            return state;
    }
};
