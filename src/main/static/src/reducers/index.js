import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import { l10n } from './l10n.reducer';
import { frontProperties } from './frontProperties.reducer';
import { kutsuList } from './kutsuList.reducer';
import {henkilo} from "./henkilo.reducer";
import {koodisto} from "./koodisto.reducer";
import {naviState} from "./navigation.reducer";
import {prequels} from "./prequels.reducer";
import {omattiedot} from "./omattiedot.reducer";
import {kutsuminenOrganisaatios} from './kutsuminen.reducer';

const rootReducer = combineReducers({
    routing,
    kutsuList,
    frontProperties,
    l10n,
    henkilo,
    koodisto,
    naviState,
    prequels,
    omattiedot,
    kutsuminenOrganisaatios
});

export default rootReducer;
