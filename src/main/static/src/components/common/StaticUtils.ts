import { HenkiloState } from '../../reducers/henkilo.reducer';
import { Localisations, L10n } from '../../types/localisation.type';
import { Henkilo } from '../../types/domain/oppijanumerorekisteri/henkilo.types';
import { Locale } from '../../types/locale.type';
import type { Option } from 'react-select';
import { Kayttaja } from '../../types/domain/kayttooikeus/kayttaja.types';
import { TextGroup } from '../../types/domain/kayttooikeus/textgroup.types';

class StaticUtils {
    static ddmmyyyyToDate(date: string) {
        const from = date.split('.');
        return new Date(Number(from[2]), Number(from[1]) - 1, Number(from[0]));
    }

    // Example fieldpath: organisaatio.nimet.0.nimiValue
    static updateFieldByDotAnnotation<T>(obj: T, event: Option<string> & React.SyntheticEvent<HTMLInputElement>): T {
        let value;
        let fieldpath;
        if (event === null) {
            return null;
        }
        if (event.optionsName) {
            value = event.value;
            fieldpath = event.optionsName;
        } else {
            value = (event.currentTarget || (event.target as HTMLInputElement)).value;
            fieldpath = (event.currentTarget || (event.target as HTMLInputElement)).name;
        }

        let schema = obj; // a moving reference to internal objects within obj
        const pList = fieldpath.split('.');
        const len = pList.length;
        for (let i = 0; i < len - 1; i++) {
            const elem = pList[i];
            if (!schema[elem]) {
                schema[elem] = {};
            }
            schema = schema[elem];
        }

        schema[pList[len - 1]] = value;

        return obj;
    }

    static findOrCreateYhteystiedotRyhmaFlat(
        henkiloUpdate: Henkilo,
        ryhmakuvaus: string,
        yhteystietotyyppi: string,
        label: string
    ) {
        let yhteystiedotRyhmaIndex = null;
        let yhteystietoIndex = null;
        let yhteystietoRyhma = henkiloUpdate.yhteystiedotRyhma.filter((yhteystiedotRyhma, idx) => {
            const yhteystietoByTyyppi = yhteystiedotRyhma.yhteystieto.filter(
                (yhteystieto) => yhteystieto.yhteystietoTyyppi === yhteystietotyyppi
            )[0];
            if (
                yhteystiedotRyhmaIndex === null &&
                yhteystiedotRyhma.ryhmaKuvaus === ryhmakuvaus &&
                yhteystietoByTyyppi &&
                yhteystietoByTyyppi.yhteystietoArvo &&
                yhteystietoByTyyppi.yhteystietoArvo !== ''
            ) {
                yhteystiedotRyhmaIndex = idx;
                return true;
            }
            return false;
        })[0];
        let yhteystieto = yhteystietoRyhma
            ? yhteystietoRyhma.yhteystieto.filter((yhteystieto, idx) => {
                  if (yhteystietoIndex === null && yhteystieto.yhteystietoTyyppi === yhteystietotyyppi) {
                      yhteystietoIndex = idx;
                      return true;
                  }
                  return false;
              })[0]
            : null;
        if (yhteystiedotRyhmaIndex === null) {
            yhteystiedotRyhmaIndex = henkiloUpdate.yhteystiedotRyhma.length;
            yhteystietoRyhma = {
                // readOnly: false, // TODO: not defined in type -- ensure that it's legit
                ryhmaAlkuperaTieto: 'alkupera2', // Virkailija
                ryhmaKuvaus: ryhmakuvaus,
                yhteystieto: [],
            };
            henkiloUpdate.yhteystiedotRyhma.push(yhteystietoRyhma);
        }

        if (yhteystietoIndex === null) {
            yhteystietoIndex = henkiloUpdate.yhteystiedotRyhma[yhteystiedotRyhmaIndex].yhteystieto.length;
            yhteystieto = {
                yhteystietoTyyppi: yhteystietotyyppi,
                yhteystietoArvo: '',
            };
            henkiloUpdate.yhteystiedotRyhma[yhteystiedotRyhmaIndex].yhteystieto.push(yhteystieto);
        }
        return {
            label: label,
            value: yhteystieto && yhteystieto.yhteystietoArvo,
            inputValue:
                'yhteystiedotRyhma.' + yhteystiedotRyhmaIndex + '.yhteystieto.' + yhteystietoIndex + '.yhteystietoArvo',
        };
    }

    static hasHetuAndIsYksiloity(henkilo: HenkiloState) {
        return !!henkilo.henkilo.hetu && henkilo.henkilo.yksiloityVTJ;
    }

    static flatArray(arr: Array<string>) {
        return arr && arr.length ? arr.filter((item) => item).reduce((type1, type2) => type1.concat(', ', type2)) : '';
    }

    static getOrganisaatiotyypitFlat(tyypit: Array<string>, L: Localisations, uppercase?: boolean) {
        return tyypit && tyypit.length
            ? '(' +
                  tyypit
                      .map((tyyppi) => L[tyyppi.toUpperCase() + (uppercase ? '_ISO' : '')] || tyyppi)
                      .reduce((type1, type2) => type1.concat(', ', type2)) +
                  ')'
            : '';
    }

    static defaultOrganisaatio = (organisaatioOid: string, l10n?: L10n) => ({
        oid: organisaatioOid,
        nimi: {
            fi: (l10n && l10n['fi'] && l10n['fi']['ORGANISAATIO_NIMI_EI_LOYDY']) || organisaatioOid,
            sv: (l10n && l10n['sv'] && l10n['sv']['ORGANISAATIO_NIMI_EI_LOYDY']) || organisaatioOid,
            en: (l10n && l10n['en'] && l10n['en']['ORGANISAATIO_NIMI_EI_LOYDY']) || organisaatioOid,
        },
        tyypit: [],
    });

    static getLocalisedText(description: TextGroup | null | undefined, locale: Locale) {
        return description ? description.texts.filter((text) => text.lang.toLowerCase() === locale)[0].text : '';
    }

    static stringIsNotEmpty(entity: string | null | undefined) {
        return entity && entity !== '';
    }

    static getKayttooikeusKestoVuosissa(kayttaja: Kayttaja) {
        return kayttaja.kayttajaTyyppi === 'PALVELU' ? null : 1;
    }
}

export default StaticUtils;
