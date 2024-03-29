import { AnyAction } from '@reduxjs/toolkit';
import {
    FETCH_KANSALAISUUSKOODISTO_REQUEST,
    FETCH_KANSALAISUUSKOODISTO_SUCCESS,
    FETCH_KIELIKOODISTO_REQUEST,
    FETCH_KIELIKOODISTO_SUCCESS,
    FETCH_SUKUPUOLIKOODISTO_REQUEST,
    FETCH_SUKUPUOLIKOODISTO_SUCCESS,
    FETCH_YHTEYSTIETOTYYPITKOODISTO_REQUEST,
    FETCH_YHTEYSTIETOTYYPITKOODISTO_SUCCESS,
    FETCH_MAATJAVALTIOTKOODISTO_REQUEST,
    FETCH_MAATJAVALTIOTKOODISTO_SUCCESS,
    FETCH_OPPILAITOSTYYPIT_REQUEST,
    FETCH_OPPILAITOSTYYPIT_SUCCESS,
    FETCH_OPPILAITOSTYYPIT_FAILURE,
    FETCH_ORGANISAATIOTYYPIT_REQUEST,
    FETCH_ORGANISAATIOTYYPIT_SUCCESS,
    FETCH_ORGANISAATIOTYYPIT_FAILURE,
} from '../actions/actiontypes';
import { Koodi, Koodisto } from '../types/domain/koodisto/koodisto.types';

export type KoodistoStateKoodi = {
    koodiUri: string;
    value: string;
    [kieli: string]: string;
};

const mapKoodistoValuesByLocale = (koodisto: Koodisto): KoodistoStateKoodi[] =>
    koodisto.map((koodi: Koodi) => ({
        koodiUri: koodi.koodiUri,
        value: koodi.koodiArvo.toLowerCase(),
        ...Object.fromEntries(koodi.metadata.map((k) => [k.kieli.toLowerCase(), k.nimi])),
    }));

export type KoodistoState = {
    kieliKoodistoLoading: boolean;
    kansalaisuusKoodistoLoading: boolean;
    sukupuoliKoodistoLoading: boolean;
    yhteystietotyypitKoodistoLoading: boolean;
    yhteystietotyypit: Array<KoodistoStateKoodi>;
    kieli: Array<KoodistoStateKoodi>;
    kieliKoodisto: Koodisto;
    kansalaisuus: Array<KoodistoStateKoodi>;
    kansalaisuusKoodisto: Koodisto;
    sukupuoli: Array<KoodistoStateKoodi>;
    sukupuoliKoodisto: Koodisto;
    oppilaitostyypitLoading: boolean;
    oppilaitostyypit: Array<KoodistoStateKoodi>;
    organisaatiotyyppiKoodistoLoading: boolean;
    organisaatiotyyppiKoodisto: Koodisto;
    maatjavaltiot1KoodistoLoading: boolean;
    maatjavaltiot1: Array<KoodistoStateKoodi>;
};

const koodisto = (
    state: Readonly<KoodistoState> = {
        kieliKoodistoLoading: true,
        kansalaisuusKoodistoLoading: true,
        sukupuoliKoodistoLoading: false,
        yhteystietotyypitKoodistoLoading: true,
        kieli: [],
        kieliKoodisto: [],
        kansalaisuus: [],
        kansalaisuusKoodisto: [],
        sukupuoli: [],
        sukupuoliKoodisto: [],
        yhteystietotyypit: [],
        maatjavaltiot1KoodistoLoading: true,
        maatjavaltiot1: [],
        oppilaitostyypitLoading: false,
        oppilaitostyypit: [],
        organisaatiotyyppiKoodistoLoading: false,
        organisaatiotyyppiKoodisto: [],
    },
    action: AnyAction
): KoodistoState => {
    switch (action.type) {
        case FETCH_KANSALAISUUSKOODISTO_REQUEST:
            return { ...state, kansalaisuusKoodistoLoading: true };
        case FETCH_KANSALAISUUSKOODISTO_SUCCESS:
            return {
                ...state,
                kansalaisuusKoodistoLoading: false,
                kansalaisuus: mapKoodistoValuesByLocale(action.kansalaisuus),
                kansalaisuusKoodisto: action.kansalaisuus,
            };
        case FETCH_KIELIKOODISTO_REQUEST:
            return { ...state, kieliKoodistoLoading: true };
        case FETCH_KIELIKOODISTO_SUCCESS:
            return {
                ...state,
                kieliKoodistoLoading: false,
                kieli: mapKoodistoValuesByLocale(action.kieli),
                kieliKoodisto: action.kieli,
            };
        case FETCH_SUKUPUOLIKOODISTO_REQUEST:
            return { ...state, sukupuoliKoodistoLoading: true };
        case FETCH_SUKUPUOLIKOODISTO_SUCCESS:
            return {
                ...state,
                sukupuoliKoodistoLoading: false,
                sukupuoli: mapKoodistoValuesByLocale(action.sukupuoli),
                sukupuoliKoodisto: action.sukupuoli,
            };
        case FETCH_YHTEYSTIETOTYYPITKOODISTO_REQUEST:
            return { ...state, yhteystietotyypitKoodistoLoading: true };
        case FETCH_YHTEYSTIETOTYYPITKOODISTO_SUCCESS:
            return {
                ...state,
                yhteystietotyypitKoodistoLoading: false,
                yhteystietotyypit: mapKoodistoValuesByLocale(action.yhteystietotyypit),
            };
        case FETCH_MAATJAVALTIOTKOODISTO_REQUEST:
            return { ...state, maatjavaltiot1KoodistoLoading: true };
        case FETCH_MAATJAVALTIOTKOODISTO_SUCCESS:
            return {
                ...state,
                maatjavaltiot1KoodistoLoading: false,
                maatjavaltiot1: mapKoodistoValuesByLocale(action.maatjavaltiot1),
            };
        case FETCH_OPPILAITOSTYYPIT_REQUEST:
            return { ...state, oppilaitostyypitLoading: true };
        case FETCH_OPPILAITOSTYYPIT_SUCCESS:
            return {
                ...state,
                oppilaitostyypitLoading: false,
                oppilaitostyypit: mapKoodistoValuesByLocale(action.oppilaitostyypit),
            };
        case FETCH_OPPILAITOSTYYPIT_FAILURE:
            return { ...state, oppilaitostyypitLoading: false };
        case FETCH_ORGANISAATIOTYYPIT_REQUEST:
            return { ...state, organisaatiotyyppiKoodistoLoading: true };
        case FETCH_ORGANISAATIOTYYPIT_SUCCESS:
            return {
                ...state,
                organisaatiotyyppiKoodistoLoading: false,
                organisaatiotyyppiKoodisto: action.organisaatiotyyppiKoodisto,
            };
        case FETCH_ORGANISAATIOTYYPIT_FAILURE:
            return { ...state, organisaatiotyyppiKoodistoLoading: false };
        default:
            return state;
    }
};

export default koodisto;
