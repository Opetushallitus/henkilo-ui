// @flow

import React from 'react';
import type {Locale} from "../../types/locale.type";
import type {L} from "../../types/localisation.type";
import type {Henkilo} from "../../types/domain/oppijanumerorekisteri/henkilo.types";
import {http} from "../../http";
import {urls} from 'oph-urls-js';
import Button from "../common/button/Button";
import type {YhteystietoRyhma} from "../../types/domain/oppijanumerorekisteri/yhteystietoryhma.types";
import {EmailVerificationList} from "./EmailVerificationList";
import {clone} from 'ramda';
import {
    notEmptyYhteystiedotRyhmaEmailCount,
    validateYhteystiedotRyhmaEmails
} from "../../utilities/yhteystietoryhma.util";
import type {Yhteystieto} from "../../types/domain/oppijanumerorekisteri/yhteystieto.types";

type Props = {
    locale: Locale,
    L: L,
    henkilo: Henkilo,
    loginToken: string
}

type State = {
    validForm: boolean,
    henkilo: Henkilo,
    emailFieldCount: number
}

/*
 * Virkailijan sähköpostin varmentamisen käyttöliittymä
 */
export class EmailVerificationPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            validForm: false,
            henkilo: props.henkilo,
            emailFieldCount: notEmptyYhteystiedotRyhmaEmailCount(props.henkilo.yhteystiedotRyhma)
        }
    }

    componentDidMount() {
        // Lisätään käyttäjän yhteystietoihin tyhjä sähköpostiosoite, jos sellaista ei löydy
        if(this.state.emailFieldCount === 0) {
            const yhteystiedotRyhma = clone(this.state.henkilo.yhteystiedotRyhma);
            const emptyEmailYhteystieto: Yhteystieto = {
                yhteystietoTyyppi: 'YHTEYSTIETO_SAHKOPOSTI',
                yhteystietoArvo: ''
            };

            // Jos käyttäjällä on muita kuin sähköposti-yhteystietoja, tehdään uusi yhteystietoryhmä
            if(this.state.henkilo.yhteystiedotRyhma[0].yhteystieto.length >= 1) {
                const yhteystietoRyhma: YhteystietoRyhma = {
                    ryhmaAlkuperaTieto: 'alkupera2',
                    ryhmaKuvaus: 'yhteystietotyyppi2',
                    yhteystieto: [emptyEmailYhteystieto]
                };
                yhteystiedotRyhma.push(yhteystietoRyhma);
            } else {
                // Jos käyttäjällä ei ole mitään yhteystietoja, lisätään tyhjä sähköpostiosoite tyhjään listaan
                yhteystiedotRyhma[0].yhteystieto.push(emptyEmailYhteystieto);
            }

            this.setState({henkilo: { ...this.state.henkilo, yhteystiedotRyhma }}, () => {console.log(this.state.henkilo)})
        }
    }

    render() {
        return <div className="infoPageWrapper" id="email-verification-page">
            <h2 className="oph-h2 oph-bold">{this.props.L['SAHKOPOSTI_VARMENNUS_OTSIKKO']}</h2>
            <p style={{textAlign: 'left'}}>{this.props.L[this.state.emailFieldCount > 0 ? 'SAHKOPOSTI_VARMENNUS_OHJE' : 'SAHKOPOSTI_VARMENNUS_EI_OSOITTEITA']}</p>
            <EmailVerificationList yhteystiedotRyhma={this.state.henkilo.yhteystiedotRyhma}
                                   onEmailChange={this.emailChangeEvent.bind(this)}
                                   L={this.props.L}></EmailVerificationList>

            <div style={{textAlign: 'center'}}>
                <Button action={this.verifyEmailAddresses}
                        isButton
                        disabled={!this.state.validForm}
                        big>{this.props.L['SAHKOPOSTI_VARMENNUS_JATKA']}</Button>
            </div>
        </div>
    }

    async verifyEmailAddresses() {
        try {
            const url = urls.url('kayttooikeus-service.cas.emailverification', this.props.loginToken);
            const redirectUrl = await http.put(url);
            window.location.replace(redirectUrl);
        } catch (error) {
            throw error;
        }
    }

    emailChangeEvent(yhteystiedotRyhmaIndex: number, yhteystietoIndex: number, value: string) {
        let yhteystiedotRyhma: Array<YhteystietoRyhma> = this.state.henkilo.yhteystiedotRyhma;
        console.log(yhteystiedotRyhmaIndex, yhteystietoIndex, value);
        console.log(yhteystiedotRyhma);
        yhteystiedotRyhma[yhteystiedotRyhmaIndex].yhteystieto[yhteystietoIndex].yhteystietoArvo = value;
        const validForm = validateYhteystiedotRyhmaEmails(yhteystiedotRyhma);
        this.setState({henkilo: { ...this.state.henkilo, yhteystiedotRyhma }, validForm });
    }



}