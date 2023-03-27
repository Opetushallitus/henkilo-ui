import React from 'react';
import { connect } from 'react-redux';
import type { RootState } from '../../../../reducers';
import PopupButton from '../../button/PopupButton';
import MpassidPopupContent from '../../button/MpassidPopupContent';
import { Localisations } from '../../../../types/localisation.type';

type OwnProps = {
    oidHenkilo: string;
    styles: any;
    disabled?: boolean;
};

type StateProps = {
    L: Localisations;
};
type Props = OwnProps & StateProps;

const MpassidButton = (props: Props) => (
    <PopupButton
        popupStyle={props.styles}
        popupTitle={
            <span className="oph-h3 oph-strong" style={{ textAlign: 'left' }}>
                {props.L['MPASSID_TUNNISTEET'] || 'MPASSID_TUNNISTEET'}
            </span>
        }
        popupClass={'oph-popup-default oph-popup-bottom'}
        disabled={props.disabled}
        popupButtonWrapperPositioning={'relative'}
        popupContent={<MpassidPopupContent henkiloOid={props.oidHenkilo} L={props.L} />}
    >
        {props.L['MPASSID_LISAA_TUNNISTE'] || 'MPASSID_LISAA_TUNNISTE'}
    </PopupButton>
);

const mapStateToProps = (state: RootState): StateProps => ({
    L: state.l10n.localisations[state.locale],
});

export default connect<StateProps, {}, OwnProps, RootState>(mapStateToProps, {})(MpassidButton);
