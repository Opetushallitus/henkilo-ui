// @flow
import React from 'react';
import {connect} from 'react-redux';
import AbstractUserContent from "./AbstractUserContent";
import Sukunimi from "../labelvalues/Sukunimi";
import EditButton from "../buttons/EditButton";
import type {Henkilo} from "../../../../types/domain/oppijanumerorekisteri/henkilo.types";
import type {HenkiloState} from "../../../../reducers/henkilo.reducer";
import type {L} from "../../../../types/localisation.type";
import type {Locale} from "../../../../types/locale.type";
import {fetchHenkiloSlaves, fetchKayttajatieto, yksiloiHenkilo} from "../../../../actions/henkilo.actions";
import Loader from "../../icons/Loader";
import Kayttajanimi from "../labelvalues/Kayttajanimi";
import PasswordButton from "../buttons/PasswordButton";
import * as R from 'ramda';
import PassivoiButton from "../buttons/PassivoiButton";

type Props = {
    readOnly: boolean,
    discardAction: () => void,
    updateAction: () => void,
    updateModelAction: () => void,
    updateDateAction: () => void,
    edit: () => void,
    henkiloUpdate: Henkilo,
    henkilo: HenkiloState,
    koodisto: any,
    L: L,
    locale: Locale,
    yksiloiHenkilo: () => void,
    isAdmin: boolean,
    oidHenkilo: string,
    fetchKayttajatieto: (string) => void,
}

type State = {

}

class PalveluUserContent extends React.Component<Props, State> {
    componentDidMount() {
        if (!this.props.henkilo.kayttajatieto.username && !this.props.henkilo.kayttajatietoLoading) {
            this.props.fetchKayttajatieto(this.props.oidHenkilo);
        }
    }

    render() {
        return this.props.henkilo.henkiloLoading
        || this.props.henkilo.kayttajatietoLoading
            ? <Loader />
            : <AbstractUserContent
                readOnly={this.props.readOnly}
                discardAction={this.props.discardAction}
                updateAction={this.props.updateAction}
                basicInfo={this.createBasicInfo()}
                readOnlyButtons={this.createReadOnlyButtons()}
            />;
    }

    createBasicInfo = () => {
        const props = {
            readOnly: this.props.readOnly,
            updateModelFieldAction: this.props.updateModelAction,
            updateDateFieldAction: this.props.updateDateAction,
            henkiloUpdate: this.props.henkiloUpdate,
        };

        // Basic info box content
        return [
            [
                <Sukunimi autofocus={true}
                          label="HENKILO_PALVELUN_NIMI"
                          {...props}
                />,
            ],
            [
                <Kayttajanimi disabled={!!R.path(['kayttajatieto', 'username'], this.props.henkilo)}
                              {...props}
                />,
            ],
        ];
    };

    // Basic info default buttons
    createReadOnlyButtons = () => {
        const duplicate = this.props.henkilo.henkilo.duplicate;
        const passivoitu = this.props.henkilo.henkilo.passivoitu;
        return [
            <EditButton
                editAction={this.props.edit}
                disabled={duplicate || passivoitu}
            />,
            this.props.isAdmin ? <PassivoiButton disabled={duplicate || passivoitu} /> : null,
            <PasswordButton
                oidHenkilo={this.props.oidHenkilo}
                styles={{top: '3rem', left: '0', width: '18rem'}}
                disabled={duplicate || passivoitu}
            />,
        ];
    };

}

const mapStateToProps = state => ({
    henkilo: state.henkilo,
    koodisto: state.koodisto,
    L: state.l10n.localisations[state.locale],
    locale: state.locale,
    isAdmin: state.omattiedot.isAdmin,
});

export default connect(mapStateToProps, {yksiloiHenkilo, fetchHenkiloSlaves, fetchKayttajatieto})(PalveluUserContent);
