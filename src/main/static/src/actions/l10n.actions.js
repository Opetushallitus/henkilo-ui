// @flow
import {FETCH_LOCALISATIONS_REQUEST, FETCH_LOCALISATIONS_SUCCESS} from './actiontypes';
import {http} from "../http";
import {urls} from 'oph-urls-js';
import type {L10n} from "../types/localisation.type";

const mapLocalisationsByLocale = (localisations: Array<any>): L10n => {
    const result = { fi: {}, sv: {}, en: {} };
    localisations.forEach( (localisation: any) => {
        result[localisation.locale][localisation.key] = localisation.value;
    });
    return result;
};

const requestLocalisations = () => ({type: FETCH_LOCALISATIONS_REQUEST});
const receiveLocalisations = (payload: any) => ({ type: FETCH_LOCALISATIONS_SUCCESS, localisations: payload });

export const fetchL10n = () => async (dispatch: any) => {
    dispatch(requestLocalisations());

    try {
        const henkiloUiLocalisations = await http.get(urls.url('henkilo-ui.l10n'));
        dispatch(receiveLocalisations(henkiloUiLocalisations));

        const localisationPalveluLocalisations = await http.get(urls().url('lokalisointi.localisation', {category: "henkilo-ui"}));
        const localisationsByLocale = mapLocalisationsByLocale(localisationPalveluLocalisations);
        dispatch(receiveLocalisations(localisationsByLocale));

    } catch (error) {
        throw error;
    }

};
