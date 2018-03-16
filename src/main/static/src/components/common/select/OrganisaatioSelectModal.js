// @flow
import React, {Fragment} from 'react';
import type {Locale} from "../../../types/locale.type";
import type {L} from "../../../types/localisation.type";
import {OrganisaatioSelect} from "./OrganisaatioSelect";
import OphModal from "../modal/OphModal";
import {SpinnerInButton} from "../icons/SpinnerInButton";
import type {OrganisaatioSelectObject} from "../../../types/organisaatioselectobject.types";

type Props = {
    locale: Locale,
    L: L,
    organisaatiot: Array<OrganisaatioSelectObject>,
    onSelect: (organisaatio: OrganisaatioSelectObject) => void,
    disabled: boolean,
    buttonTextKey?: string
}

type State = {
    visible: boolean
}

/*
 * Organisaation valinta modalissa
 */
export class OrganisaatioSelectModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            visible: false
        }
    }

    render() {
        return <Fragment>
            <button type="button"
                    className="oph-button oph-button-primary organisaatio-select-button"
                    onClick={this.onOpen}
                    disabled={this.props.disabled}>
                <SpinnerInButton show={this.props.disabled}></SpinnerInButton> { this.props.buttonTextKey ? this.props.L[this.props.buttonTextKey] : this.props.L['OMATTIEDOT_VALITSE_ORGANISAATIO'] }
            </button>
            {this.state.visible ? <OphModal onClose={this.onClose}>
            <OrganisaatioSelect
                locale={this.props.locale}
                L={this.props.L}
                organisaatiot={this.props.organisaatiot}
                onSelect={(organisaatio) => {this.props.onSelect(organisaatio); this.onClose.call(this)}}
            />
        </OphModal> : null}
        </Fragment>
    }

    onOpen = (event: SyntheticEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        this.setState({visible: true});
    };

    onClose = (event?: SyntheticEvent<HTMLButtonElement>): void => {
        if(event) {
            event.preventDefault();
        }
        this.setState({visible: false});
    };

}