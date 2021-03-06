//@flow
import React from 'react'
import {connect} from 'react-redux'
import {http} from '../../http'
import {urls} from 'oph-urls-js'
import PalveluCreateForm from './PalveluCreateForm'
import type { PalvelukayttajaCreate, PalvelukayttajaRead } from '../../types/domain/kayttooikeus/palvelukayttaja.types'
import WideRedNotification from '../../components/common/notifications/WideRedNotification'
import type {Localisations} from "../../types/localisation.type";

type OwnProps = {
    router: any,
}

type Props = {
    ...OwnProps,
    L: Localisations,
}

type State = {
    error?: string,
}

/**
 * Palvelukäyttäjän luonti -näkymä.
 */
class PalveluCreateContainer extends React.Component<Props, State> {

    render() {
        return (
            <div className="wrapper">
                {this.state && this.state.error
                    ? <WideRedNotification message={this.state.error} closeAction={() => this.setError()} />
                    : null
                }
                <span className="oph-h2 oph-bold">{this.props.L['PALVELUKAYTTAJAN_LUONTI_OTSIKKO']}</span>
                <PalveluCreateForm onSubmit={this.onSubmit}
                                   L={this.props.L}>
                </PalveluCreateForm>
            </div>
        )
    }

    setError = (error?: string) => {
        this.setState({error: error});
    };

    onSubmit = async (palvelukayttajaCreate: PalvelukayttajaCreate): Promise<void> => {
        try {
            const palvelukayttajaRead = await this.createPalvelukayttaja(palvelukayttajaCreate);
            this.navigateToVirkailija(palvelukayttajaRead.oid);
        } catch (error) {
            this.setError(this.props.L['HENKILON_LUONTI_EPAONNISTUI']);
            throw error
        }
    };

    createPalvelukayttaja = async (palvelukayttaja: PalvelukayttajaCreate): Promise<PalvelukayttajaRead> => {
        const url = urls.url('kayttooikeus-service.palvelukayttaja');
        return await http.post(url, palvelukayttaja);
    };

    navigateToVirkailija = (oid: string) => {
        this.props.router.push(`/virkailija/${oid}`);
    }

}

const mapStateToProps = (state) => {
    return {
        L: state.l10n.localisations[state.locale],
    };
};

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, {})(PalveluCreateContainer);
