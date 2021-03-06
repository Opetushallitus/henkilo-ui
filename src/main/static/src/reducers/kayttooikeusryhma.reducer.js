// @flow
import {
    FETCH_ALL_KAYTTOOIKEUSRYHMA_ANOMUS_FOR_HENKILO_FAILURE,
    FETCH_ALL_KAYTTOOIKEUSRYHMA_ANOMUS_FOR_HENKILO_REQUEST,
    FETCH_ALL_KAYTTOOIKEUSRYHMA_ANOMUS_FOR_HENKILO_SUCCESS,
    FETCH_ALL_KAYTTOOIKEUSRYHMAS_FOR_HENKILO_REQUEST,
    FETCH_ALL_KAYTTOOIKEUSRYHMAS_FOR_HENKILO_SUCCESS,
    FETCH_ALLOWED_KAYTTOOIKEUS_FOR_ORGANISATION_SUCCESS,
    FETCH_GRANTABLE_REQUEST,
    FETCH_GRANTABLE_SUCCESS,
    FETCH_ALL_KAYTTOOIKEUSRYHMA_SUCCESS,
    FETCH_ALL_KAYTTOOIKEUSRYHMA_FAILURE,
    FETCH_ALL_KAYTTOOIKEUSRYHMA_REQUEST,
    FETCH_KAYTTOOIKEUSRYHMA_BY_ID_REQUEST,
    FETCH_KAYTTOOIKEUSRYHMA_BY_ID_SUCCESS,
    FETCH_KAYTTOOIKEUSRYHMA_BY_ID_FAILURE,
    FETCH_PALVELUROOLI_BY_KAYTTOOIKEUSRYHMA_ID_REQUEST,
    FETCH_PALVELUROOLI_BY_KAYTTOOIKEUSRYHMA_ID_SUCCESS,
    FETCH_PALVELUROOLI_BY_KAYTTOOIKEUSRYHMA_ID_FAILURE,
    FETCH_KAYTTOOIKEUSRYHMA_SLAVES_FAILURE,
    FETCH_KAYTTOOIKEUSRYHMA_SLAVES_SUCCESS,
    FETCH_KAYTTOOIKEUSRYHMA_SLAVES_REQUEST,
    FETCH_ALLOWED_KAYTTOOIKEUS_FOR_ORGANISATION_REQUEST, FETCH_ALLOWED_KAYTTOOIKEUS_FOR_ORGANISATION_FAILURE
} from "../actions/actiontypes";
import type {Kayttooikeusryhma, MyonnettyKayttooikeusryhma} from "../types/domain/kayttooikeus/kayttooikeusryhma.types";
import type {PalveluRooli} from "../types/domain/kayttooikeus/PalveluRooli.types";

export type AllowedKayttooikeus = Array<MyonnettyKayttooikeusryhma>;

export type KayttooikeusAnomus = {
    kayttoOikeusRyhma: {
        id: number,
    },
    anomus: {
        organisaatioOid: string,
        henkilo: {
            oid: string,
        },
    }
}

export type KayttooikeusRyhmaState = {
    +kayttooikeusAnomus: Array<KayttooikeusAnomus>,
    +kayttooikeusAnomusLoading: boolean,
    +kayttooikeus: Array<MyonnettyKayttooikeusryhma>,
    +kayttooikeusLoading: boolean,
    +grantableKayttooikeus: {},
    +grantableKayttooikeusLoading: boolean,
    +allowedKayttooikeus: {[string]: AllowedKayttooikeus, loading: boolean},
    +kayttooikeusryhma: ?Kayttooikeusryhma,
    +kayttooikeusryhmaSlaves: Array<Kayttooikeusryhma>,
    +palvelutRoolit: Array<PalveluRooli>,
    +allKayttooikeusryhmas: Array<Kayttooikeusryhma>,
    +allKayttooikeusryhmasLoading: boolean,
}

export const getEmptyKayttooikeusRyhmaState = (): KayttooikeusRyhmaState => {
    return {
        kayttooikeusLoading: true,
        kayttooikeus: [],
        kayttooikeusAnomusLoading: true,
        kayttooikeusAnomus: [],
        allowedKayttooikeus: {loading: false},
        grantableKayttooikeus: {},
        grantableKayttooikeusLoading: true,
        allKayttooikeusryhmas: [],
        allKayttooikeusryhmasLoading: false,
        kayttooikeusryhma: null,
        kayttooikeusryhmaLoading: false,
        palvelutRoolit: [],
        palvelutRoolitLoading: true,
        kayttooikeusryhmaSlaves: [],
        kayttooikeusryhmaSlavesLoading: false,
    };
};

export const kayttooikeus = (state: KayttooikeusRyhmaState = getEmptyKayttooikeusRyhmaState(),
                             action: any): KayttooikeusRyhmaState => {
    switch (action.type) {
        case FETCH_ALL_KAYTTOOIKEUSRYHMAS_FOR_HENKILO_REQUEST:
            return Object.assign({}, state, {kayttooikeusLoading: true});
        case FETCH_ALL_KAYTTOOIKEUSRYHMAS_FOR_HENKILO_SUCCESS:
            return Object.assign({}, state, {kayttooikeusLoading: false, kayttooikeus: action.kayttooikeus});
        case FETCH_ALL_KAYTTOOIKEUSRYHMA_ANOMUS_FOR_HENKILO_REQUEST:
            return Object.assign({}, state, {kayttooikeusAnomusLoading: true});
        case FETCH_ALL_KAYTTOOIKEUSRYHMA_ANOMUS_FOR_HENKILO_SUCCESS:
            return Object.assign({}, state, {
                kayttooikeusAnomusLoading: false,
                kayttooikeusAnomus: action.kayttooikeusAnomus
            });
        case FETCH_ALL_KAYTTOOIKEUSRYHMA_ANOMUS_FOR_HENKILO_FAILURE:
            return Object.assign({}, state, {kayttooikeusAnomusLoading: false, kayttooikeusAnomus: []});
        case FETCH_ALLOWED_KAYTTOOIKEUS_FOR_ORGANISATION_REQUEST:
            return {...state, allowedKayttooikeus: {...state.allowedKayttooikeus, loading: true}};
        case FETCH_ALLOWED_KAYTTOOIKEUS_FOR_ORGANISATION_SUCCESS:
            return Object.assign({}, state, {
                allowedKayttooikeus: {
                    ...state.allowedKayttooikeus,
                    [action.oidHenkilo]: [...action.allowedKayttooikeus],
                    loading: false,
                }
            });
        case FETCH_ALLOWED_KAYTTOOIKEUS_FOR_ORGANISATION_FAILURE:
            return {...state, allowedKayttooikeus: {...state.allowedKayttooikeus, loading: false}};
        case FETCH_GRANTABLE_REQUEST:
            return Object.assign({}, state, {grantableKayttooikeusLoading: true,});
        case FETCH_GRANTABLE_SUCCESS:
            return Object.assign({}, state, {grantableKayttooikeusLoading: false, grantableKayttooikeus: action.data});
        case FETCH_ALL_KAYTTOOIKEUSRYHMA_REQUEST:
            return {...state, allKayttooikeusryhmasLoading: true};
        case FETCH_ALL_KAYTTOOIKEUSRYHMA_SUCCESS:
            return {...state, allKayttooikeusryhmas: action.data, allKayttooikeusryhmasLoading: false};
        case FETCH_ALL_KAYTTOOIKEUSRYHMA_FAILURE:
            return {...state, allKayttooikeusryhmasLoading: false};
        case FETCH_KAYTTOOIKEUSRYHMA_BY_ID_REQUEST:
            return {...state, kayttooikeusryhmaLoading: true};
        case FETCH_KAYTTOOIKEUSRYHMA_BY_ID_SUCCESS:
            return {...state, kayttooikeusryhmaLoading: false, kayttooikeusryhma: action.payload};
        case FETCH_KAYTTOOIKEUSRYHMA_BY_ID_FAILURE:
            return {...state, kayttooikeusryhmaLoading: false};
        case FETCH_PALVELUROOLI_BY_KAYTTOOIKEUSRYHMA_ID_REQUEST:
            return {...state, palvelutRoolitLoading: true};
        case FETCH_PALVELUROOLI_BY_KAYTTOOIKEUSRYHMA_ID_SUCCESS:
            return {...state, palvelutRoolitLoading: false, palvelutRoolit: action.payload};
        case FETCH_PALVELUROOLI_BY_KAYTTOOIKEUSRYHMA_ID_FAILURE:
            return {...state, palvelutRoolitLoading: false};
        case FETCH_KAYTTOOIKEUSRYHMA_SLAVES_REQUEST:
            return {...state, kayttooikeusryhmaSlavesLoading: true};
        case FETCH_KAYTTOOIKEUSRYHMA_SLAVES_SUCCESS:
            return {...state, kayttooikeusryhmaSlavesLoading: false, kayttooikeusryhmaSlaves: action.payload};
        case FETCH_KAYTTOOIKEUSRYHMA_SLAVES_FAILURE:
            return {...state, kayttooikeusryhmaSlavesLoading: false};
        default:
            return state;
    }
};
