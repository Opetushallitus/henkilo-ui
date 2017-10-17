import {
    CLEAR_HENKILOHAKU,
    HENKILOHAKU_FAILURE, HENKILOHAKU_REQUEST, HENKILOHAKU_SUCCESS,
    UPDATE_HENKILOHAKU_FILTERS
} from "../actions/actiontypes";

export const henkilohakuState = (state = { filters: {}, henkilohakuLoading: false, result: [],}, action) => {
    switch (action.type) {
        case HENKILOHAKU_REQUEST:
            return Object.assign({}, state, {henkilohakuLoading: true, filters: action.filters, });
        case HENKILOHAKU_SUCCESS:
            return Object.assign({}, state, {
                henkilohakuLoading: false,
                result: [...state.result, ...action.data],
            });
        case HENKILOHAKU_FAILURE:
            return Object.assign({}, state, {henkilohakuLoading: false, });
        case UPDATE_HENKILOHAKU_FILTERS:
            return Object.assign({}, state, {filters: action.filters,});
        case CLEAR_HENKILOHAKU:
            return Object.assign({}, state, {result: []});
        default:
            return state;
    }
};