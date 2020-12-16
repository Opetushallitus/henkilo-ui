const urlConfig = {
    "cas.baseUrl": "/",
    "cas.login": "cas/login",
    "cas.me": "cas/me",
    "cas.haka": "service-provider-app/saml/login/alias/hakasp",

    "henkilo-ui.baseUrl": "/",
    "henkilo-ui.l10n": "henkilo-ui/l10n",

    "lokalisointi.baseUrl": "/",
    "lokalisointi.localisation": "lokalisointi/cxf/rest/v1/localisation",

    "kayttooikeus-service.baseUrl": "/",
    "kayttooikeus-service.l10n.languages":
        "kayttooikeus-service/l10n/languages",
    "kayttooikeus-service.kutsu": "kayttooikeus-service/kutsu",
    "kayttooikeus-service.peruutaKutsu": "kayttooikeus-service/kutsu/$1",
    "kayttooikeus-service.renewKutsu": "kayttooikeus-service/kutsu/$1/renew",
    "kayttooikeus-service.kutsu.by-token":
        "kayttooikeus-service/kutsu/token/$1",
    "kayttooikeus-service.buildversion":
        "kayttooikeus-service/buildversion.txt",
    "kayttooikeus-service.henkilo.byOid": "kayttooikeus-service/henkilo/$1",
    "kayttooikeus-service.henkilo.organisaatios":
        "kayttooikeus-service/henkilo/$1/organisaatio",
    "kayttooikeus-service.henkilo.organisaatiohenkilos":
        "kayttooikeus-service/henkilo/$1/organisaatiohenkilo",
    "kayttooikeus-service.henkilo.hakatunnus":
        "kayttooikeus-service/henkilo/$1/hakatunnus",
    "kayttooikeus-service.henkilo.sahkopostitunniste":
        "kayttooikeus-service/henkilo/$1/sahkopostitunniste",
    "kayttooikeus-service.henkilo.henkilohaku":
        "kayttooikeus-service/henkilo/henkilohaku",
    "kayttooikeus-service.henkilo.anomusilmoitus":
        "kayttooikeus-service/henkilo/$1/anomusilmoitus",
    "kayttooikeus-service.henkilo.henkilohakucount":
        "kayttooikeus-service/henkilo/henkilohakucount",
    "kayttooikeus-service.organisaatiohenkilo.passivoi":
        "kayttooikeus-service/organisaatiohenkilo/$1/$2",
    "kayttooikeus-service.henkilo.poista-kayttajatunnus":
        "kayttooikeus-service/henkilo/$1/passivoi",
    "kayttooikeus-service.henkilo.kayttajatieto":
        "kayttooikeus-service/henkilo/$1/kayttajatiedot",
    "kayttooikeus-service.henkilo.anomus-list":
        "kayttooikeus-service/kayttooikeusanomus/$1",
    "kayttooikeus-service.henkilo.kayttooikeus-myonto":
        "kayttooikeus-service/kayttooikeusanomus/$1/$2",
    "kayttooikeus-service.henkilo.kaytto-oikeus-anomus":
        "kayttooikeus-service/kayttooikeusanomus",
    "kayttooikeus-service.henkilo.uusi.kayttooikeusanomus":
        "kayttooikeus-service/kayttooikeusanomus/$1",
    "kayttooikeus-service.henkilo.kayttooikeus-remove":
        "kayttooikeus-service/kayttooikeusanomus/$1/$2/$3",
    "kayttooikeus-service.henkilo.kayttooikeus-list-grantable":
        "kayttooikeus-service/kayttooikeusanomus/henkilo/current/$1/canGrant",
    "kayttooikeus-service.henkilo.password":
        "kayttooikeus-service/henkilo/$1/password",
    "kayttooikeus-service.henkilo.current.omattiedot":
        "kayttooikeus-service/henkilo/current/omattiedot",

    "kayttooikeus-service.virkailija": "kayttooikeus-service/virkailija",
    "kayttooikeus-service.palvelukayttaja":
        "kayttooikeus-service/palvelukayttaja",
    "kayttooikeus-service.omattiedot.anomus.muokkaus":
        "kayttooikeus-service/kayttooikeusanomus/peruminen/currentuser",
    "kayttooikeus-service.kayttooikeusryhma":
        "kayttooikeus-service/kayttooikeusryhma",
    "kayttooikeus-service.kayttooikeusryhma.all":
        "kayttooikeus-service/kayttooikeusryhma",
    "kayttooikeus-service.kayttooikeusryhma.id":
        "kayttooikeus-service/kayttooikeusryhma/$1",
    "kayttooikeus-service.kayttooikeusryhma.id.passivoi":
        "kayttooikeus-service/kayttooikeusryhma/$1/passivoi",
    "kayttooikeus-service.kayttooikeusryhma.id.aktivoi":
        "kayttooikeus-service/kayttooikeusryhma/$1/aktivoi",
    "kayttooikeus-service.kayttooikeusryhma.slaves":
        "kayttooikeus-service/kayttooikeusryhma/$1/sallitut",
    "kayttooikeus-service.kayttooikeusryhma.forHenkilo.inOrganisaatio":
        "kayttooikeus-service/kayttooikeusryhma/$1/$2",
    "kayttooikeus-service.kayttooikeusryhma.henkilo.oid":
        "kayttooikeus-service/kayttooikeusryhma/henkilo/$1",
    "kayttooikeus-service.kayttooikeusryhma.henkilo.current":
        "kayttooikeus-service/kayttooikeusryhma/henkilo/current",
    "kayttooikeus-service.kayttooikeusryhma.organisaatio":
        "kayttooikeus-service/kayttooikeusryhma/organisaatio/$1",
    "kayttooikeus-service.kayttooikeusryhma.palvelurooli":
        "kayttooikeus-service/kayttooikeusryhma/$1/kayttooikeus",
    "kayttooikeus-service.kayttooikeusryhma.by-kayttooiokeus":
        "kayttooikeus-service/kayttooikeusryhma/ryhmasByKayttooikeus",
    "kayttooikeus-service.virkailija-ui.basePath":
        "kayttooikeus-service/virkailija",
    "kayttooikeus-service.prequel": "kayttooikeus-service/cas/prequel",
    "kayttooikeus-service.palvelu.listaus": "kayttooikeus-service/palvelu",
    "kayttooikeus-service.kayttooikeus.listaus":
        "kayttooikeus-service/kayttooikeus/$1",
    "kayttooikeus-service.anomus.haetut-kayttooikeusryhmat":
        "kayttooikeus-service/kayttooikeusanomus/haettuKayttoOikeusRyhma",
    "kayttooikeus-service.cas.uudelleenrekisterointi":
        "kayttooikeus-service/cas/uudelleenrekisterointi",
    "kayttooikeus-service.cas.henkilo.bylogintoken":
        "kayttooikeus-service/cas/henkilo/loginToken/$1",
    "kayttooikeus-service.cas.emailverification":
        "kayttooikeus-service/cas/emailverification/$1",
    "kayttooikeus-service.cas.emailverification.loginToken.validation":
        "kayttooikeus-service/cas/emailverification/loginTokenValidation/$1",
    "kayttooikeus-service.cas.logintoken.redirectToFrontpage":
        "kayttooikeus-service/cas/emailverification/redirectByLoginToken/$1",
    "kayttooikeus-service.henkilo.linkitykset":
        "kayttooikeus-service/henkilo/$1/linkitykset",
    "kayttooikeus-service.organisaatio": "kayttooikeus-service/organisaatio",
    "kayttooikeus-service.organisaatio.root":
        "kayttooikeus-service/organisaatio/root",
    "kayttooikeus-service.organisaatio.by-oid":
        "kayttooikeus-service/organisaatio/$1",

    "oppijanumerorekisteri-service.baseUrl": "/",
    "oppijanumerorekisteri-service.henkilo.oid":
        "oppijanumerorekisteri-service/henkilo/$1",
    "oppijanumerorekisteri-service.henkilo.slaves":
        "oppijanumerorekisteri-service/henkilo/$1/slaves",
    "oppijanumerorekisteri-service.henkilo.master":
        "oppijanumerorekisteri-service/henkilo/$1/master",
    "oppijanumerorekisteri-service.henkilo.link":
        "oppijanumerorekisteri-service/henkilo/$1/link",
    "oppijanumerorekisteri-service.henkilo.unlink":
        "oppijanumerorekisteri-service/henkilo/$1/unlink/$2",
    "oppijanumerorekisteri-service.henkilo.hakemukset":
        "oppijanumerorekisteri-service/henkilo/$1/hakemukset",
    "oppijanumerorekisteri-service.henkilo.duplicates":
        "oppijanumerorekisteri-service/henkilo/$1/duplicates",
    "oppijanumerorekisteri-service.henkilo.duplikaatit":
        "oppijanumerorekisteri-service/henkilo/duplikaatit?etunimet=$1&kutsumanimi=$2&sukunimi=$3",
    "oppijanumerorekisteri-service.henkilo":
        "oppijanumerorekisteri-service/henkilo",
    "oppijanumerorekisteri-service.henkilo.delete":
        "oppijanumerorekisteri-service/henkilo/$1",
    "oppijanumerorekisteri-service.henkilo.yksiloi":
        "oppijanumerorekisteri-service/henkilo/$1/yksiloi",
    "oppijanumerorekisteri-service.henkilo.yksiloihetuton":
        "oppijanumerorekisteri-service/henkilo/$1/yksiloihetuton",
    "oppijanumerorekisteri-service.henkilo.yksiloi.pura":
        "oppijanumerorekisteri-service/henkilo/$1/purayksilointi",
    "oppijanumerorekisteri-service.henkilo.yksilointitiedot":
        "oppijanumerorekisteri-service/henkilo/$1/yksilointitiedot",
    "oppijanumerorekisteri-service.henkilo.yksilointitiedot.yliajayksiloimaton":
        "oppijanumerorekisteri-service/henkilo/$1/yksilointitiedot/yliajayksiloimaton",
    "oppijanumerorekisteri-service.henkilo.current.asiointikieli":
        "oppijanumerorekisteri-service/henkilo/current/asiointiKieli",
    "oppijanumerorekisteri-service.henkilo.identification":
        "oppijanumerorekisteri-service/henkilo/$1/identification",
    "oppijanumerorekisteri-service.henkilo.identification.remove":
        "oppijanumerorekisteri-service/henkilo/$1/identification/$2/$3",
    "oppijanumerorekisteri-service.oppija.yhteenveto":
        "oppijanumerorekisteri-service/oppija/yhteenveto",
    "oppijanumerorekisteri-service.oppija":
        "oppijanumerorekisteri-service/oppija",
    "oppijanumerorekisteri-service.prequel":
        "oppijanumerorekisteri-service/cas/prequel",

    "koodisto-service.baseUrl": "/",
    "koodisto-service.koodisto.kieli": "koodisto-service/rest/json/kieli/koodi",
    "koodisto-service.koodisto.kansalaisuus":
        "koodisto-service/rest/json/maatjavaltiot2/koodi",
    "koodisto-service.koodisto.sukupuoli":
        "koodisto-service/rest/json/sukupuoli/koodi",
    "koodisto-service.koodisto.yhteystietotyypit":
        "koodisto-service/rest/json/yhteystietotyypit/koodi",
    "koodisto-service.koodisto.maatjavaltiot1":
        "koodisto-service/rest/json/maatjavaltiot1/koodi",
    "koodisto-service.koodisto.oppilaitostyypit":
        "koodisto-service/rest/codeelement/codes/oppilaitostyyppi/1",
    "koodisto-service.koodisto.organisaatiotyypit":
        "koodisto-service/rest/codeelement/codes/organisaatiotyyppi/3",

    "shibboleth.baseUrl": "/",
    "shibboleth.identification": "shibbolethVirkailija/virkailija$1",
    "shibboleth.kayttooikeus-service.cas.tunnistus":
        "kayttooikeus-service/cas/tunnistus",

    "virkailija-raamit.baseUrl": "/",
    "virkailija-raamit.raamit.js": "virkailija-raamit/apply-raamit.js",
    "virkailija-raamit.raamit.css": "virkailija-raamit/apply-raamit.css",
}

export default urlConfig;