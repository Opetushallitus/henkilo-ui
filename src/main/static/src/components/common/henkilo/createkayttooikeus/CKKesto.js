import React from 'react'
import dateformat from 'dateformat'

const CKKesto = ({alkaaPvmAction, alkaaInitValue, paattyyPvmAction, paattyyInitValue, L}) =>
    <tr key="kayttooikeusKestoField">
        <td>
            <span className="oph-bold">{L['HENKILO_LISAA_KAYTTOOIKEUDET_KESTO']}</span>:
        </td>
        <td>
            <div className="kayttooikeus-input-container">
                <span className="oph-h5">{L['HENKILO_LISAA_KAYTTOOIKEUDET_ALKAA']}</span>
                <input className="oph-input" defaultValue={dateformat(alkaaInitValue, L['PVM_FORMAATTI'])}
                       onChange={alkaaPvmAction} />
            </div>
            <div className="kayttooikeus-input-container">
                <span className="oph-h5">{L['HENKILO_LISAA_KAYTTOOIKEUDET_PAATTYY']}</span>
                <input className="oph-input" defaultValue={dateformat(paattyyInitValue, L['PVM_FORMAATTI'])}
                       onChange={paattyyPvmAction} />
            </div>
        </td>
        <td/>
    </tr>;

CKKesto.propTypes = {
    alkaaPvmAction: React.PropTypes.func,
    paattyyPvmAction: React.PropTypes.func,
    alkaaInitValue: React.PropTypes.object,
    paattyyInitValue: React.PropTypes.object,
    L: React.PropTypes.object,
};

export default CKKesto;