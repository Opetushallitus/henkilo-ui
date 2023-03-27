import React from 'react';
import { connect } from 'react-redux';
import type { RootState } from '../../../reducers';
import { urls } from 'oph-urls-js';
import { http } from '../../../http';
import { reject } from 'ramda';
import './HakaPopupContent.css';
import { Localisations } from '../../../types/localisation.type';
import { addGlobalNotification } from '../../../actions/notification.actions';
import { GlobalNotificationConfig } from '../../../types/notification.types';
import { NOTIFICATIONTYPES } from '../Notification/notificationtypes';

type OwnProps = {
    henkiloOid: string;
    L: Localisations;
};

type DispatchProps = {
    addGlobalNotification: (arg0: GlobalNotificationConfig) => any;
};

type Props = OwnProps & DispatchProps;

type State = {
    tunnisteet: string[];
    newTunnisteValue: string;
};

class MpassidPopupContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            tunnisteet: [],
            newTunnisteValue: '',
        };
    }

    async componentDidMount() {
        const tunnisteet = await this.getTunnisteet();
        this.setState({ tunnisteet });
    }

    render() {
        return (
            <div className="hakapopupcontent">
                <p>{this.props.L['MPASSID_TUNNISTE_INFOTEKSTI'] || 'MPASSID_TUNNISTE_INFOTEKSTI'}</p>
                <ul>
                    {this.state.tunnisteet.length > 0 ? (
                        this.state.tunnisteet.map((tunniste) => (
                            <li className="tag" key={tunniste}>
                                <span>{tunniste}</span>{' '}
                                <a className="remove" href="#poista" onClick={() => this.remoteTunniste(tunniste)}>
                                    {this.props.L['POISTA']}
                                </a>
                            </li>
                        ))
                    ) : (
                        <span className="oph-h4 oph-strong hakapopup">
                            {this.props.L['MPASSID_EI_TUNNISTEITA'] || 'MPASSID_EI_TUNNISTEITA'}
                        </span>
                    )}
                </ul>
                <div className="oph-field oph-field-is-required">
                    <input
                        type="text"
                        className="oph-input haka-input"
                        aria-required="true"
                        placeholder="Lisää uusi tunnus"
                        value={this.state.newTunnisteValue}
                        onChange={this.handleChange.bind(this)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                            e.key === 'Enter' ? this.addTunniste() : null
                        }
                    />
                    {this.state.tunnisteet.includes(this.state.newTunnisteValue) ? (
                        <div className="oph-field-text oph-error">
                            {this.props.L['MPASSID_VIRHE_OLEMASSAOLEVA'] || 'MPASSID_VIRHE_OLEMASSAOLEVA'}
                        </div>
                    ) : null}
                    <button
                        className="save oph-button oph-button-primary"
                        disabled={this.state.tunnisteet.includes(this.state.newTunnisteValue)}
                        onClick={() => this.addTunniste()}
                    >
                        {this.props.L['TALLENNA_TUNNUS']}
                    </button>
                </div>
            </div>
        );
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ newTunnisteValue: event.target.value });
    }

    addTunniste() {
        if (this.state.newTunnisteValue.length > 0) {
            const tunnisteet = this.state.tunnisteet.slice(0);
            tunnisteet.push(this.state.newTunnisteValue);
            this.saveTunnisteet(tunnisteet, this.state.newTunnisteValue);
            this.setState({ newTunnisteValue: '' });
        }
    }

    async remoteTunniste(tunniste: string) {
        const filteredTunnisteet = reject((_) => _ === tunniste)(this.state.tunnisteet);
        await this.saveTunnisteet(filteredTunnisteet, tunniste);
    }

    async getTunnisteet() {
        const url = urls.url('kayttooikeus-service.henkilo.idp', this.props.henkiloOid, 'mpassid');
        return await http.get<string[]>(url);
    }

    async saveTunnisteet(newTunnisteet: Array<string>, newTunnisteValue: string) {
        const url = urls.url('kayttooikeus-service.henkilo.idp', this.props.henkiloOid, 'mpassid');
        try {
            const tunnisteet = await http.put<string[]>(url, newTunnisteet);
            this.setState({ tunnisteet });
        } catch (error) {
            if (error.errorType === 'ValidationException' && error.message.indexOf('ovat jo käytössä') !== -1) {
                this.props.addGlobalNotification({
                    key: 'MPASSID_DUPLIKAATTI_TUNNISTE',
                    type: NOTIFICATIONTYPES.ERROR,
                    title: `${
                        this.props.L['MPASSID_TUNNISTE_KAYTOSSA_ALKU'] || 'MPASSID_TUNNISTE_KAYTOSSA_ALKU'
                    } (${newTunnisteValue}) ${
                        this.props.L['MPASSID_TUNNISTE_KAYTOSSA_LOPPU'] || 'MPASSID_TUNNISTE_KAYTOSSA_LOPPU'
                    }`,
                    autoClose: 5000,
                });
            }
            throw error;
        }
    }
}

export default connect<{}, DispatchProps, OwnProps, RootState>(undefined, {
    addGlobalNotification,
})(MpassidPopupContent);
