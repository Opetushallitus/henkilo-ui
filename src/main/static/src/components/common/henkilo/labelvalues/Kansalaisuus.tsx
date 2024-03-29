import React from 'react';
import { connect } from 'react-redux';
import type { RootState } from '../../../../store';
import LabelValue from './LabelValue';
import StaticUtils from '../../StaticUtils';
import { HenkiloState } from '../../../../reducers/henkilo.reducer';
import { Locale } from '../../../../types/locale.type';
import { Henkilo } from '../../../../types/domain/oppijanumerorekisteri/henkilo.types';
import type { Options } from 'react-select';

type OwnProps = {
    henkiloUpdate: Henkilo;
    readOnly: boolean;
    updateModelFieldAction: (arg0: any) => void;
};

type StateProps = {
    henkilo: HenkiloState;
    koodisto: {
        kansalaisuus: Options<string>;
    };
    locale: Locale;
};

type Props = OwnProps & StateProps;

const Kansalaisuus = (props: Props) => {
    const kansalaisuus = props.henkiloUpdate.kansalaisuus || [];
    const disabled = StaticUtils.hasHetuAndIsYksiloity(props.henkilo);
    return (
        <div>
            <LabelValue
                readOnly={props.readOnly}
                updateModelFieldAction={(newOption) => {
                    if (newOption === null) {
                        props.updateModelFieldAction({
                            optionsName: 'kansalaisuus',
                            value: [kansalaisuus],
                        });
                    } else {
                        props.updateModelFieldAction({
                            optionsName: 'kansalaisuus',
                            value: newOption.map((kansalaisuusOption) => ({
                                kansalaisuusKoodi: kansalaisuusOption.value,
                            })),
                        });
                    }
                }}
                values={{
                    label: 'HENKILO_KANSALAISUUS',
                    data: props.koodisto.kansalaisuus.map((koodi) => ({
                        value: koodi.value,
                        label: koodi[props.locale],
                        optionsName: 'kansalaisuus',
                    })),
                    selectValue: kansalaisuus.map((item) => item.kansalaisuusKoodi),
                    disabled: disabled,
                    clearable: false,
                    multiselect: true,
                }}
            />
        </div>
    );
};

const mapStateToProps = (state: RootState): StateProps => ({
    henkilo: state.henkilo,
    koodisto: state.koodisto,
    locale: state.locale,
});

export default connect<StateProps, object, OwnProps, RootState>(mapStateToProps)(Kansalaisuus);
