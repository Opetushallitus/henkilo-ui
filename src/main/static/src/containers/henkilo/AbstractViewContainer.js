import React from 'react'
import Button from "../../components/common/button/Button";
import locale from '../../configuration/locale'
import dateformat from 'dateformat';
import ConfirmButton from "../../components/common/button/ConfirmButton";

class AbstractViewContainer extends React.Component {

    _editButtons(discard, update) {
        return [
            <Button key="discard" big cancel action={discard}>{this.L['PERUUTA_LINKKI']}</Button>,
            <Button key="update" big action={update}>{this.L['TALLENNA_LINKKI']}</Button>
        ];
    }

    _createNotifications(position) {
        return this.props.henkilo.notifications.filter(notification => notification.position === position)
            .map((notification, idx) => <div key={idx}>{this.L[notification.notL10nMessage]}</div>);
    };

    _createPopupErrorMessage(notificationKey) {
        const notification = this.props.henkilo.buttonNotifications[notificationKey];
        return {errorTopic: notification && this.L[notification.notL10nMessage],
            errorText: notification && this.L[notification.notL10nText]};
    };

    _creatableYhteystietotyypit() {
        return this.props.koodisto.yhteystietotyypit
            .filter(yhteystietotyyppi => ['yhteystietotyyppi4', 'yhteystietotyyppi10', 'yhteystietotyyppi5', 'yhteystietotyyppi9',
                'yhteystietotyyppi12', 'yhteystietotyyppi18', 'yhteystietotyyppi11', 'yhteystietotyyppi8']
                .indexOf(yhteystietotyyppi.value) === -1);
    };

    /*
    * Fields
    * */

    createKansalaisuusField() {
        return this.props.henkilo.henkilo.kansalaisuus && this.props.henkilo.henkilo.kansalaisuus.length
            ? this.props.henkilo.henkilo.kansalaisuus.map((values, idx) =>
                ({
                    label: 'HENKILO_KANSALAISUUS',
                    data: this.props.koodisto.kansalaisuus.map(koodi => ({id: koodi.value, text: koodi[locale]})),
                    value: this.props.koodisto.kansalaisuus
                        .filter(kansalaisuus => kansalaisuus.value === values.kansalaisuusKoodi)[0][locale],
                    inputValue: 'kansalaisuus.' + idx + '.kansalaisuusKoodi',
                    selectValue: values.kansalaisuusKoodi
                })).reduce((a,b) => a.concat(b))
            : { label: 'HENKILO_KANSALAISUUS',
                data: this.props.koodisto.kansalaisuus.map(koodi => ({id: koodi.value, text: koodi[locale]})),
                inputValue: 'kansalaisuus.0.kansalaisuusKoodi',
                value: null };
    };

    createAidinkieliField() {
        return {label: 'HENKILO_AIDINKIELI',
            data: this.props.koodisto.kieli.map(koodi => ({id: koodi.value, text: koodi[locale]})),
            inputValue: 'aidinkieli.kieliKoodi',
            value: this.props.henkilo.henkilo.aidinkieli && this.props.koodisto.kieli.filter(kieli =>
        kieli.value === this.props.henkilo.henkilo.aidinkieli.kieliKoodi)[0][locale],
            selectValue: this.props.henkilo.henkilo.aidinkieli && this.props.henkilo.henkilo.aidinkieli.kieliKoodi};
    };

    createSukunimiFieldWithAutofocus() {
        return {label: 'HENKILO_SUKUNIMI', value: this.props.henkilo.henkilo.sukunimi, inputValue: 'sukunimi', autoFocus: true};
    };

    createEtunimetField() {
        return {label: 'HENKILO_ETUNIMET', value: this.props.henkilo.henkilo.etunimet, inputValue: 'etunimet'};
    }

    createSyntymaaikaField() {
        return {label: 'HENKILO_SYNTYMAAIKA', inputValue: 'syntymaaika', date: true,
            value: dateformat(new Date(this.props.henkilo.henkilo.syntymaaika), this.L['PVM_FORMAATTI']), };
    };

    createHetuField() {
        return {label: 'HENKILO_HETU', value: this.props.henkilo.henkilo.hetu, inputValue: 'hetu'};
    };

    createKutsumanimiField() {
        return  {label: 'HENKILO_KUTSUMANIMI', value: this.props.henkilo.henkilo.kutsumanimi, inputValue: 'kutsumanimi'};
    };

    createOppijanumeroField() {
        return {label: 'HENKILO_OPPIJANUMERO', value: this.props.henkilo.henkilo.oidHenkilo, inputValue: 'oidHenkilo', readOnly: true,};
    };

    createAsiointikieliField() {
        return {label: 'HENKILO_ASIOINTIKIELI',
            data: this.props.koodisto.kieli
                .filter(koodi => ['fi', 'sv', 'en'].indexOf(koodi.value) !== -1)
                .map(koodi => ({id: koodi.value, text: koodi[locale]})),
            inputValue: 'asiointiKieli.kieliKoodi',
            value: this.props.henkilo.henkilo.asiointiKieli && this.props.koodisto.kieli
                .filter(kieli => kieli.value === this.props.henkilo.henkilo.asiointiKieli.kieliKoodi)[0][locale],
            selectValue: this.props.henkilo.henkilo.asiointiKieli && this.props.henkilo.henkilo.asiointiKieli.kieliKoodi};
    };

    createKayttajanimiField() {
        return {
            label: 'HENKILO_KAYTTAJANIMI',
            value: this.props.henkilo.kayttajatieto.username,
            inputValue: 'kayttajanimi'
        };
    };

    createTyosahkopostiField(henkiloUpdate) {
        return this._findOrCreateYhteystiedotRyhmaFlat(henkiloUpdate, 'yhteystietotyyppi2', 'YHTEYSTIETO_SAHKOPOSTI', 'HENKILO_TYOSAHKOPOSTI');
    };

    createTyopuhelinField(henkiloUpdate) {
        return this._findOrCreateYhteystiedotRyhmaFlat(henkiloUpdate, 'yhteystietotyyppi2', 'YHTEYSTIETO_PUHELINNUMERO', 'HENKILO_TYOPUHELIN');
    }

    _findOrCreateYhteystiedotRyhmaFlat(henkiloUpdate, ryhmakuvaus, yhteystietotyyppi, label) {
        let yhteystiedotRyhmaIndex = null;
        let yhteystietoIndex = null;
        let tyosahkopostiRyhma = henkiloUpdate.yhteystiedotRyhma
            .filter((yhteystiedotRyhma, idx) => {
                if(!yhteystiedotRyhmaIndex && yhteystiedotRyhma.ryhmaKuvaus === ryhmakuvaus) {
                    yhteystiedotRyhmaIndex = idx;
                    return true;
                }
                return false;
            })[0];
        let tyosahkoposti = tyosahkopostiRyhma
            ? tyosahkopostiRyhma.yhteystieto.filter((yhteystieto, idx) => {
                if(yhteystietoIndex === null && yhteystieto.yhteystietoTyyppi === yhteystietotyyppi) {
                    yhteystietoIndex = idx;
                    return true;
                }
                return false;
            })[0]
            : null;
        if(yhteystiedotRyhmaIndex === null) {
            yhteystiedotRyhmaIndex = henkiloUpdate.yhteystiedotRyhma.length;
            tyosahkopostiRyhma = {
                readOnly: false,
                ryhmaAlkuperaTieto: "alkupera2", // Virkailija
                ryhmaKuvaus: ryhmakuvaus,
                yhteystieto: []
            };
            henkiloUpdate.yhteystiedotRyhma.push(tyosahkopostiRyhma);
        }

        if(yhteystietoIndex === null) {
            yhteystietoIndex = henkiloUpdate.yhteystiedotRyhma[yhteystiedotRyhmaIndex].yhteystieto.length;
            tyosahkoposti = {yhteystietoTyyppi: yhteystietotyyppi, yhteystietoArvo: ''};
            henkiloUpdate.yhteystiedotRyhma[yhteystiedotRyhmaIndex].yhteystieto.push(tyosahkoposti);
        }
        return { label: label,
            value: tyosahkoposti && tyosahkoposti.yhteystietoArvo,
            inputValue: 'yhteystiedotRyhma.'+yhteystiedotRyhmaIndex+'.yhteystieto.'+yhteystietoIndex+'.yhteystietoArvo',
        };
    }

    /*
    * Buttons
    * */

    createEditButton(edit) {
        return <Button key="edit" big action={edit}>{this.L['MUOKKAA_LINKKI']}</Button>;
    };

    createYksilointiButton() {
        return <ConfirmButton key="yksilointi" big action={() => this.props.yksiloiHenkilo(this.props.henkilo.henkilo.oidHenkilo)}
                       normalLabel={this.L['YKSILOI_LINKKI']} confirmLabel={this.L['YKSILOI_LINKKI_CONFIRM']}
                       errorMessage={this._createPopupErrorMessage('yksiloi')} />;
    };

    createPassivoiButton() {
        return this.props.henkilo.henkilo.passivoitu
            ? <Button key="passivoi" big disabled action={() => {}}>{this.L['PASSIVOI_PASSIVOITU']}</Button>
            : <ConfirmButton key="passivoi" big action={() => this.props.passivoiHenkilo(this.props.henkilo.henkilo.oidHenkilo)}
                             normalLabel={this.L['PASSIVOI_LINKKI']} confirmLabel={this.L['PASSIVOI_LINKKI_CONFIRM']}
                             errorMessage={this._createPopupErrorMessage('passivoi')} />;
    };

    createHakaButton() {
        return <Button key="haka" big action={() => {}}>{this.L['LISAA_HAKA_LINKKI']}</Button>;
    };

    createPasswordButton() {
        return <Button key="password" big action={() => {}}>{this.L['SALASANA_ASETA']}</Button>;
    };

    static createLoader() {
        return <div className="oph-spinner">
            <div className="oph-bounce oph-bounce1"/>
            <div className="oph-bounce oph-bounce2"/>
            <div className="oph-bounce oph-bounce3"/>
        </div>;
    };
}

export default AbstractViewContainer;