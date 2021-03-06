// @flow
import * as React from 'react';
import {TypedNotification} from "./TypedNotification";
import type {NotificationType} from "../../../types/notification.types";


type LocalNotificationProps = {
    type: NotificationType,
    title: string,
    toggle?: boolean,
    onClose?: () => void,
    children?: React.Element<any> | Array<React.Element<any>> | string,
}

type State = {
    show: boolean, // Internally handled visibility. TRUE by default and set to FALSE when close action is run.
    toggle: () => boolean // Visibility by prop. Notification can be hidden and shown multiple times
}

/*
 * Local notification (handles its visibility internally).
 * If toggle is undefined at start automatically handles hiding of whole element according to if children are defined.
 *
 * @param type: Notification type ALERT, INFO, SUCCESS, WARNING
 * @param title: Title for notification.
 * @param show: Is notification visible
 * @param onClose: Optional function to run when notification is closed
 * @param children: Optional content to be added after title https://opetushallitus.github.io/virkailija-styles/styleguide/src__modules__alerts.css.html
 */
export class LocalNotification extends React.Component<LocalNotificationProps, State> {

    constructor(props: LocalNotificationProps) {
        super(props);

        this.state = {
            show: true,
            toggle: this.props.toggle === true || this.props.toggle === false
                ? () => this.props.toggle === true
                : () => this._childrenIsValid(),
        };
    }

    render() {
        return this.state.show && this.state.toggle() ?
            <TypedNotification type={this.props.type}
                               title={this.props.title}
                               closeAction={() => this.closeAction()}>{this.props.children}</TypedNotification>
            : null;
    }

    closeAction = () => {
        this.setState({show: false});
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    _childrenIsValid(): boolean {
        return Array.isArray(this.props.children)
            ? this.props.children.every(child => this._childIsValid(child))
            : this._childIsValid(this.props.children);
    }

    _childIsValid(child: ?React.Element<any> | string) {
        return !!(child && typeof child !== 'string' && child.type === 'ul' && child.props && child.props.children);
    }
}
