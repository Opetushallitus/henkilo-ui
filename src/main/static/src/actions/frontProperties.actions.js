import {FETCH_FRONTPROPERTIES_REQUEST, FETCH_FRONTPROPERTIES_SUCCESS} from './actiontypes';
import frontUrls from '../henkilo-ui-virkailija-oph';
import {urls} from 'oph-urls-js';
import {fetchL10n} from './l10n.actions';

const requestFrontProperties = () => ({type: FETCH_FRONTPROPERTIES_REQUEST});
const receivedFrontProperties = () => ({
    type: FETCH_FRONTPROPERTIES_SUCCESS,
    receivedAt: Date.now()
});
export const fetchFrontProperties = () => (dispatch) => {
    dispatch(requestFrontProperties());
    urls.addProperties(frontUrls);
    urls.load({overrides: '/henkilo-ui/config/frontProperties',})
        .then(() => {
            dispatch(receivedFrontProperties());
            dispatch(fetchL10n());
        });
};