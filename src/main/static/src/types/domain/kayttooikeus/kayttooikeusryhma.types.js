// @flow

import type {TextGroup} from "./textgroup.types";
import type {PalveluRooliModify} from "./PalveluRooliModify.types";
import type {OrganisaatioViite} from "./organisaatioviite.types";

export type Kayttooikeusryhma = {
    id: number,
    tunniste: string,
    nimi: TextGroup,
    kuvaus: ?TextGroup,
    organisaatioViite: Array<OrganisaatioViite>,
}

export type KayttooikeusRyhmaModify = {
    nimi: TextGroup,
    kuvaus: TextGroup,
    palvelutRoolit: Array<PalveluRooliModify>,
    organisaatioTyypit: Array<string>,
    rooliRajoite: string,
    slaveIds: Array<number>,
    passivoitu: boolean,
    ryhmaRestriction: boolean
}
