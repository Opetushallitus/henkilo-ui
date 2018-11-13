// @flow
import React from 'react';
import type {YhteystietoRyhma} from "../../types/domain/oppijanumerorekisteri/yhteystietoryhma.types";
import type {Yhteystieto} from "../../types/domain/oppijanumerorekisteri/yhteystieto.types";
import {validateEmail} from "../../validation/EmailValidator";
import type {L} from "../../types/localisation.type";

type Props = {
    yhteystiedotRyhma: Array<YhteystietoRyhma>,
    onEmailChange: (number, number, string) => void,
    L: L
}

/*
 * Yhteystietoryhma-listan sähköpostiosoitteet input-kenttinä
 */
export class EmailVerificationList extends React.Component<Props> {

    render() {
        return <React.Fragment>
            {this.props.yhteystiedotRyhma.map((yhteystietoryhma: YhteystietoRyhma, ryhmaIndex: number) => {
                return yhteystietoryhma.yhteystieto
                    .map((yhteystieto: Yhteystieto, yhteystietoIndex: number) => {
                        if(yhteystieto.yhteystietoTyyppi === 'YHTEYSTIETO_SAHKOPOSTI') {
                            const validEmail = yhteystieto.yhteystietoArvo ? validateEmail(yhteystieto.yhteystietoArvo) : false;
                            const classNames = validEmail ? 'oph-input' : 'oph-input oph-input-has-error';
                            return <input key={`${ryhmaIndex}-${yhteystietoIndex}`}
                                          style={{marginBottom: '20px'}}
                                          className={classNames}
                                          value={yhteystieto.yhteystietoArvo}
                                          type="text"
                                          placeholder={this.props.L['HENKILO_TYOSAHKOPOSTI']}
                                          onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.props.onEmailChange(ryhmaIndex, yhteystietoIndex, event.currentTarget.value)}/>;
                        }

                        return null;
                    })
            })}
        </React.Fragment>
    }

}