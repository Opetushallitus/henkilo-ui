// @flow
import React from 'react';
import Button from "../button/Button";
import {SpinnerInButton} from "../icons/SpinnerInButton";
import OphModal from "./OphModal";

type Props = {
    disabled: boolean,
    buttonText: string,
    children?: React$Element<any>,
}

type State = {
    visible: boolean,
}

/**
 * Näyttää ja piilottaa lapsena annetun modalin. Välittää piilottamistoiminnon tälle modalille.
 */
class SelectModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            visible: false
        };
    }

    render() {
        return <React.Fragment>
            <Button disabled={this.props.disabled}
                    action={this._onOpen}>
                <SpinnerInButton show={this.props.disabled}/> { this.props.buttonText }
            </Button>
            { this.state.visible
                ? <OphModal onClose={this._onClose}>
                    {this.props.children
                        ? React.cloneElement(this.props.children, { onClose: this._onClose.bind(this) })
                        : null}
                </OphModal>
                : null }
        </React.Fragment>
    }

    _onOpen = (event: SyntheticEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        this.setState({visible: true});
    };

    _onClose = (event?: SyntheticEvent<HTMLButtonElement>): void => {
        if (event) {
            event.preventDefault();
        }
        this.setState({visible: false});
    };

}

export default SelectModal;