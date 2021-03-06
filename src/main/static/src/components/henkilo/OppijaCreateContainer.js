// @flow
import React from 'react'
import {connect} from 'react-redux'
import {http} from '../../http'
import {urls} from 'oph-urls-js'
import {
    fetchKieliKoodisto,
    fetchSukupuoliKoodisto,
    fetchKansalaisuusKoodisto,
} from '../../actions/koodisto.actions'
import type {Locale} from '../../types/locale.type'
import type {Koodisto} from '../../types/domain/koodisto/koodisto.types'
import OppijaCreateForm from './OppijaCreateForm'
import type {HenkiloCreate} from '../../types/domain/oppijanumerorekisteri/henkilo.types'
import type {HenkiloDuplicate} from '../../types/domain/oppijanumerorekisteri/HenkiloDuplicate'
import type {Localisations} from "../../types/localisation.type";
import OppijaCreateDuplikaatit from './OppijaCreateDuplikaatit'
import {addGlobalNotification} from "../../actions/notification.actions";
import {NOTIFICATIONTYPES} from "../common/Notification/notificationtypes";
import type {GlobalNotificationConfig} from '../../types/notification.types';

type OwnProps = {
    router: any,
}

type Props = {
    ...OwnProps,
    locale: Locale,
    L: Localisations,
    fetchSukupuoliKoodisto: () => void,
    sukupuoliKoodisto: Koodisto,
    fetchKieliKoodisto: () => void,
    kieliKoodisto: Koodisto,
    fetchKansalaisuusKoodisto: () => void,
    kansalaisuusKoodisto: Koodisto,
    addGlobalNotification: (payload: GlobalNotificationConfig) => void,
}

type State = {
    oppija: HenkiloCreate,
    naytaDuplikaatit: boolean,
    duplikaatit: Array<HenkiloDuplicate>,
    loading: boolean,
}

/**
 * Oppijan luonti -näkymä.
 */
class OppijaCreateContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            oppija: {},
            naytaDuplikaatit: false,
            duplikaatit: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.props.fetchSukupuoliKoodisto();
        this.props.fetchKieliKoodisto();
        this.props.fetchKansalaisuusKoodisto()
    }

    render() {
        return (
            <div className="wrapper">
                <span className="oph-h2 oph-bold">{this.props.L['OPPIJAN_LUONTI_OTSIKKO']}</span>
                {this.state.naytaDuplikaatit === false
                    ? <OppijaCreateForm
                        tallenna={this.tallenna}
                        locale={this.props.locale}
                        L={this.props.L}
                        sukupuoliKoodisto={this.props.sukupuoliKoodisto}
                        kieliKoodisto={this.props.kieliKoodisto}
                        kansalaisuusKoodisto={this.props.kansalaisuusKoodisto}
                    />
                    : <OppijaCreateDuplikaatit
                        locale={this.props.locale}
                        L={this.props.L}
                        tallenna={this.luoOppijaJaNavigoi}
                        peruuta={this.peruuta}
                        oppija={this.state.oppija}
                        duplikaatit={this.state.duplikaatit}
                    />
                }
            </div>
        )
    }

    tallenna = async (oppija: HenkiloCreate) => {
        try {
            // tarkistetaan ennen luontia duplikaatit
            const duplikaatit = await this.haeDuplikaatit(oppija);
            if (duplikaatit.length > 0) {
                this.setState({oppija: oppija, naytaDuplikaatit: true, duplikaatit: duplikaatit})
            }
            else {
                // luodaan oppija
                this.luoOppijaJaNavigoi(oppija)
            }
        } catch (error) {
            this.props.addGlobalNotification({key: 'HENKILON_LUONTI_VIRHE', type: NOTIFICATIONTYPES.ERROR, title: this.props.L['HENKILON_LUONTI_EPAONNISTUI']});
            throw error
        }
    };

    luoOppijaJaNavigoi = async (oppija: HenkiloCreate): Promise<void> => {
        const oid = await this.luoOppija(oppija);
        this.props.router.push(`/oppija/${oid}`)
    };

    peruuta = () => {
        window.location.reload()
    };

    haeDuplikaatit = async (oppija: HenkiloCreate): Promise<Array<HenkiloDuplicate>> => {
        const url = urls.url('oppijanumerorekisteri-service.henkilo.duplikaatit', oppija.etunimet, oppija.kutsumanimi, oppija.sukunimi);
        return await http.get(url)
    };

    luoOppija = async (oppija: HenkiloCreate): Promise<string> => {
        const url = urls.url('oppijanumerorekisteri-service.oppija');
        return await http.post(url, oppija) // palauttaa oid
    }

}

const mapStateToProps = (state) => {
    return {
        locale: state.locale,
        L: state.l10n.localisations[state.locale],
        sukupuoliKoodisto: state.koodisto.sukupuoliKoodisto,
        kieliKoodisto: state.koodisto.kieliKoodisto,
        kansalaisuusKoodisto: state.koodisto.kansalaisuusKoodisto,
    }
};

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, {
    fetchKieliKoodisto,
    fetchSukupuoliKoodisto,
    fetchKansalaisuusKoodisto,
    addGlobalNotification
})(OppijaCreateContainer)
