import React from 'react';
import { connect } from 'react-redux';
import type { RootState } from '../../store';
import { LocalNotification } from '../common/Notification/LocalNotification';
import { NOTIFICATIONTYPES } from '../common/Notification/notificationtypes';
import { RouteActions } from 'react-router-redux';

type OwnProps = {
    router: RouteActions;
    params: { oid?: string };
};

type StateProps = {
    oidHenkilo: string;
};

type Props = OwnProps & StateProps;

class AdminRedirect extends React.Component<Props> {
    componentDidMount() {
        this.props.router.replace(`/oppija/${this.props.oidHenkilo}`);
    }

    render() {
        return <LocalNotification type={NOTIFICATIONTYPES.WARNING} title={'HENKILO_SIVU_VIRHE_ADMIN'} toggle={true} />;
    }
}

const mapStateToProps = (_state: RootState, ownProps: OwnProps): StateProps => ({
    oidHenkilo: ownProps.params['oid'],
});

export default connect<StateProps, object, OwnProps, RootState>(mapStateToProps)(AdminRedirect);
