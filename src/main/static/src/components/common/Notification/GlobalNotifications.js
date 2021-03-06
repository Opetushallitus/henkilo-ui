// @flow
import React from 'react';
import {TypedNotification} from "./TypedNotification";
import './GlobalNotifications.css';
import type {GlobalNotificationConfig} from "../../../types/notification.types";

type GlobalNotificationsProps = {
    notificationList: Array<GlobalNotificationConfig>,
    removeGlobalNotification: (key: string) => void
}

/*
 * Global notifications ( stored in redux state )
 *
 * @param notificationlist: Array of unique keys from redux state - YOU DON'T HAVE TO PROVIDE THIS
 * @param removeGlobalNotification: Action that cleans given notification key from redux state - YOU DON'T HAVE TO PROVIDE THIS
 */
export class GlobalNotifications extends React.Component<GlobalNotificationsProps> {

    render() {
        return <div id="global-notifications">
            {this.props.notificationList.map( (globalNotification: GlobalNotificationConfig) => {
                if(globalNotification.autoClose) {
                    setTimeout(() => {
                        this.props.removeGlobalNotification(globalNotification.key);
                    }, globalNotification.autoClose);
                }

                    return <TypedNotification type={globalNotification.type}
                                              title={globalNotification.title}
                                              key={globalNotification.key}
                                              closeAction={() => this.props.removeGlobalNotification(globalNotification.key)}
                    />;
            }

            )}
        </div>

    }
}

