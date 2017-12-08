// @flow
import React from 'react';
import {connect} from 'react-redux';
import ConfirmButton from "../../button/ConfirmButton";
import type {HenkiloState} from "../../../../reducers/henkilo.reducer";

type Props = {
    henkilo: HenkiloState,
    L: any,
    yksiloiAction: (string) => any,
    disabled?: boolean
}

const YksiloiHetutonButton = (props: Props) =>
    !props.henkilo.henkilo.yksiloityVTJ && !props.henkilo.henkilo.hetu && !props.henkilo.henkilo.yksiloity
        ? <ConfirmButton key="yksilointi"
                         action={() => props.yksiloiAction(props.henkilo.henkilo.oidHenkilo)}
                         normalLabel={props.L['YKSILOI_LINKKI']}
                         confirmLabel={props.L['YKSILOI_LINKKI_CONFIRM']}
                         disabled={props.disabled}
                         id="yksilointi" />
        : null;

const mapStateToProps = state => ({
    henkilo: state.henkilo,
    L: state.l10n.localisations[state.locale],
});

export default connect(mapStateToProps, {})(YksiloiHetutonButton);
