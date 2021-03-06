// @flow
import {
    SET_PALVELUKAYTTAJAT_CRITERIA,
    FETCH_PALVELUKAYTTAJAT_REQUEST,
    FETCH_PALVELUKAYTTAJAT_SUCCESS,
    FETCH_PALVELUKAYTTAJAT_FAILURE
} from '../actions/actiontypes'
import type { PalvelukayttajaRead, PalvelukayttajaCriteria } from '../types/domain/kayttooikeus/palvelukayttaja.types'

export type PalvelukayttajatState = {
    dirty: boolean,
    loading: boolean,
    criteria: PalvelukayttajaCriteria,
    data: Array<PalvelukayttajaRead>,
}

const initialState: PalvelukayttajatState = {
    dirty: false,
    loading: false,
    criteria: {
        subOrganisation: true,
        passivoitu: false,
        nameQuery: '',
        organisaatioOids: null,
    },
    data: [],
}

export const palvelukayttajat = (state: PalvelukayttajatState = initialState, action: any) => {
    switch (action.type) {
        case SET_PALVELUKAYTTAJAT_CRITERIA:
            const dirty = action.criteria.nameQuery !== '' || !!action.criteria.organisaatioOids
            return { ...state, criteria: action.criteria, dirty };
        case FETCH_PALVELUKAYTTAJAT_REQUEST:
            return { ...state, loading: true };
        case FETCH_PALVELUKAYTTAJAT_SUCCESS:
            return { ...state, loading: false, data: action.data };
        case FETCH_PALVELUKAYTTAJAT_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};
