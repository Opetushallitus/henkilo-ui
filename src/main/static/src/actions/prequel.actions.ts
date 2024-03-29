import { FETCH_PREQUEL_REQUEST, FETCH_PREQUEL_SUCCESS } from './actiontypes';
import { http } from '../http';
import { urls } from 'oph-urls-js';
import { AppDispatch } from '../store';

const requestKayttooikeusPrequel = () => ({ type: FETCH_PREQUEL_REQUEST });
const receivedKayttooikeusPrequel = () => ({ type: FETCH_PREQUEL_SUCCESS });
const requestOppijanumerorekisteriPrequel = () => ({
    type: FETCH_PREQUEL_REQUEST,
});
const receiveOppijanumerorekisteriPrequel = () => ({
    type: FETCH_PREQUEL_SUCCESS,
});

export const fetchPrequels = () => async (dispatch: AppDispatch) => {
    return Promise.all([fetchOppijanumerorekisteriPrequel(dispatch), fetchKayttooikeusPrequel(dispatch)]);
};

const fetchOppijanumerorekisteriPrequel = async (dispatch: AppDispatch) => {
    dispatch(requestOppijanumerorekisteriPrequel());
    await http.get(urls.url('oppijanumerorekisteri-service.prequel'));
    dispatch(receiveOppijanumerorekisteriPrequel());
};

const fetchKayttooikeusPrequel = async (dispatch: AppDispatch) => {
    dispatch(requestKayttooikeusPrequel());
    await http.get(urls.url('kayttooikeus-service.prequel'));
    dispatch(receivedKayttooikeusPrequel());
};
