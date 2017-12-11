// @flow
import React from 'react';
import {connect} from 'react-redux';
import AbstractUserContent from "./AbstractUserContent";
import Sukunimi from "../labelvalues/Sukunimi";
import Etunimet from "../labelvalues/Etunimet";
import Kutsumanimi from "../labelvalues/Kutsumanimi";
import Oppijanumero from "../labelvalues/Oppijanumero";
import Asiointikieli from "../labelvalues/Asiointikieli";
import EditButton from "../buttons/EditButton";
import type {Henkilo} from "../../../../types/domain/oppijanumerorekisteri/henkilo.types";
import type {HenkiloState} from "../../../../reducers/henkilo.reducer";
import type {L} from "../../../../types/localisation.type";
import type {Locale} from "../../../../types/locale.type";
import {fetchHenkiloSlaves, yksiloiHenkilo} from "../../../../actions/henkilo.actions";
import Loader from "../../icons/Loader";
import Kayttajanimi from "../labelvalues/Kayttajanimi";
import LinkitetytHenkilot from "../labelvalues/LinkitetytHenkilot";
import MasterHenkilo from "../labelvalues/MasterHenkilo";
import HakaButton from "../buttons/HakaButton";
import PasswordButton from "../buttons/PasswordButton";

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
}

type State = {

}

class VirkailijaUserContent extends React.Component<Props, State> {
    render() {
        return this.props.henkilo.henkiloLoading
        || this.props.koodisto.kieliKoodistoLoading
        || this.props.koodisto.kansalaisuusKoodistoLoading
        || this.props.koodisto.sukupuoliKoodistoLoading
        || this.props.henkilo.kayttajatietoLoading
        || this.props.koodisto.yhteystietotyypitKoodistoLoading
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
                <Sukunimi
                    autofocus={true}
                    {...props}
                />,
                <Etunimet {...props} />,
                <Kutsumanimi {...props} />,
                <Asiointikieli {...props} />,
            ],
            [
                <Oppijanumero {...props} />,
            ],
            [
                <Kayttajanimi {...props}
                              disabled={true}
                />,
                <LinkitetytHenkilot />,
                <MasterHenkilo oidHenkilo={this.props.oidHenkilo} />
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
            <HakaButton
                oidHenkilo={this.props.oidHenkilo}
                styles={{left: '0px', top: '3rem', width: '15rem', padding: '30px'}}
                disabled={duplicate || passivoitu}
            />,
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

export default connect(mapStateToProps, {yksiloiHenkilo, fetchHenkiloSlaves})(VirkailijaUserContent);
