import {
    DELETE_KUTSU_SUCCESS, DELETE_KUTSU_REQUEST, FETCH_KUTSU_REQUEST, FETCH_KUTSU_SUCCESS,
    FETCH_KUTSUBYTOKEN_REQUEST, FETCH_KUTSUBYTOKEN_SUCCESS, FETCH_KUTSUBYTOKEN_FAILURE, CREATE_HENKILOBYTOKEN_FAILURE,
    CREATE_HENKILOBYTOKEN_SUCCESS, CREATE_HENKILOBYTOKEN_REQUEST, LOGIN_FAILED, CLEAR_KUTSU_LIST
} from './actiontypes';

import {http} from "../http";
import {urls} from 'oph-urls-js';
import {fetchOmattiedot} from "./omattiedot.actions";

const requestDeleteKutsu = (id) => ({type: DELETE_KUTSU_REQUEST, id});
const receiveDeleteKutsu = (id, json) => ({type: DELETE_KUTSU_SUCCESS, id, receivedAt: Date.now()});
export const deleteKutsu = (id) => (dispatch => {
    dispatch(requestDeleteKutsu(id));
    const url = urls.url('kayttooikeus-service.peruutaKutsu', id);
    http.delete(url).then(json => dispatch(receiveDeleteKutsu(id, json)));
});

const requestKutsus = () => ({type: FETCH_KUTSU_REQUEST});
const receiveKutsus = (json) => ({type: FETCH_KUTSU_SUCCESS, kutsus: json, receivedAt: Date.now()});
export const fetchKutsus = (payload, offset, amount) => dispatch => {
    dispatch(requestKutsus());
    const url = urls.url('kayttooikeus-service.kutsu', payload, offset, amount);
    http.get(url).then(json => {dispatch(receiveKutsus(json))});
};

export const clearKutsuList = () => (dispatch) => dispatch({type: CLEAR_KUTSU_LIST});

const kutsuByTokenRequest = () => ({type: FETCH_KUTSUBYTOKEN_REQUEST});
const kutsuByTokenSuccess = (kutsu) => ({type: FETCH_KUTSUBYTOKEN_SUCCESS, kutsu, receivedAt: Date.now()});
const kutsuByTokenFailure = () => ({type: FETCH_KUTSUBYTOKEN_FAILURE, receivedAt: Date.now()});
export const fetchKutsuByToken = (temporaryToken) => dispatch => {
    dispatch(kutsuByTokenRequest());
    const url = urls.url('kayttooikeus-service.kutsu.by-token', temporaryToken);
    http.get(url)
        .then(json => {dispatch(kutsuByTokenSuccess({...json, temporaryToken}))})
        .catch(() => dispatch(kutsuByTokenFailure()));
};

const createHenkiloByTokenRequest = () => ({type: CREATE_HENKILOBYTOKEN_REQUEST});
const createHenkiloByTokenSuccess = (authToken) => ({type: CREATE_HENKILOBYTOKEN_SUCCESS, authToken, receivedAt: Date.now()});
const createHenkiloByTokenFailure = () => ({type: CREATE_HENKILOBYTOKEN_FAILURE, receivedAt: Date.now()});
export const createHenkiloByToken = (temporaryToken, payload) => (dispatch, getState) => {
    dispatch(createHenkiloByTokenRequest());
    const url = urls.url('kayttooikeus-service.kutsu.by-token', temporaryToken);
    http.post(url, payload)
        .then(authToken => {
            dispatch(createHenkiloByTokenSuccess(authToken));
            const casUrl = urls.url('cas.login', {authToken,});
            http.get(casUrl).then(async loginPage => {
                // Login failed
                if(loginPage.indexOf('Log In Successful') === -1) {
                    dispatch({type: LOGIN_FAILED});
                }
                else {
                    // Wait until user data has been synced to ldap
                    do {
                        if(!getState().omattiedot.omattiedotLoading) {
                            dispatch(fetchOmattiedot());
                        }
                        await new Promise(resolve => setTimeout(resolve, 4000));
                    } while (getState().omattiedot.data === undefined);
                    // Redirect to opintopolku root page
                    window.location = window.location.origin;
                }
            });
        })
        .catch(() => dispatch(createHenkiloByTokenFailure()));
};

