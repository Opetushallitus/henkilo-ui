// @flow
import {
    mainNavigation,
    oppijaNavi,
    palvelukayttajaNavigation
} from "./navigationconfigurations";
import {henkiloViewTabs} from "./NavigationTabs";
import type {HenkiloState} from "../../reducers/henkilo.reducer";

export const ophLightGray = '#f6f4f0';

export const updateDefaultNavigation = () => mainNavigation;

export const updatePalvelukayttajaNavigation = () => palvelukayttajaNavigation;

export const updateHenkiloNavigation = (oidHenkilo: string, henkiloState: HenkiloState, henkiloType: string) => henkiloViewTabs(oidHenkilo, henkiloState, henkiloType);

export const updateOppijaNavigation = (oidHenkilo: string) => oppijaNavi(oidHenkilo);
