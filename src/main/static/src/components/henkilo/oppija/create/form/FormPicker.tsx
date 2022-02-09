import React from 'react';
import { connect } from 'react-redux';
import type { FormType } from './types';
import type { Localisations } from '../../../../../types/localisation.type';
import type { RootState } from '../../../../../reducers';
import Button from '../../../../common/button/Button';
import './FormPicker.css';

type Props = {
    setFormType: (type: FormType) => void;
};

type StateProps = {
    L: Localisations;
};

export const FormPicker: React.FC<Props & StateProps> = ({ L, setFormType }) => {
    const translate = (key: string): string => L[key] || key;
    return (
        <div className="wrapper">
            <div className="form-picker">
                <span className="oph-h2 oph-bold">{translate('OPPIJAN_LUONTI_OTSIKKO')}</span>
                <Button action={() => setFormType('ssn')}>{translate('OPPIJAN_LUONTI_SSN')}</Button>
                <Button action={() => setFormType('anonymous')}>{translate('OPPIJAN_LUONTI_ANONYMOUS')}</Button>
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState): StateProps => ({
    L: state.l10n.localisations[state.locale],
});

export default connect(mapStateToProps)(FormPicker) as React.FC<Props>;