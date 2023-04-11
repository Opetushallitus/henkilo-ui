import { FETCH_FRONTPROPERTIES_REQUEST, FETCH_FRONTPROPERTIES_SUCCESS } from './actiontypes';
import frontUrls from '../henkilo-ui-virkailija-oph';
import { urls } from 'oph-urls-js';
import { fetchL10n } from './l10n.actions';
import { fetchPrequels } from './prequel.actions';
import { fetchLocale, fetchOmattiedot } from './omattiedot.actions';
import PropertySingleton from '../globals/PropertySingleton';
import { AppDispatch } from '../store';

const requestFrontProperties = () => ({ type: FETCH_FRONTPROPERTIES_REQUEST });
const receivedFrontProperties = () => ({
    type: FETCH_FRONTPROPERTIES_SUCCESS,
    receivedAt: Date.now(),
});
export const fetchFrontProperties = () => async (dispatch: AppDispatch) => {
    dispatch(requestFrontProperties());
    urls.addProperties(frontUrls);
    urls.addCallerId(PropertySingleton.getState().opintopolkuCallerId);
    await urls.load({ overrides: '/henkilo-ui/config/frontProperties' });
    dispatch(receivedFrontProperties());
    // Fetch localisations
    dispatch<any>(fetchL10n());
    // Do prequel requests to external services that require authentication so CAS session is opened
    await dispatch<any>(fetchPrequels());
    // Fetch locale for current user
    dispatch<any>(fetchLocale());
    // Fetch other info from /cas/me
    dispatch<any>(fetchOmattiedot());
};
