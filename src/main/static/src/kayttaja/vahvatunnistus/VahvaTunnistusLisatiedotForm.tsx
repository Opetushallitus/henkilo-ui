import React from 'react';
import VahvaTunnistusLisatiedotInputs, { Form } from './VahvaTunnistusLisatiedotInputs';
import { Localisations } from '../../types/localisation.type';

type VahvaTunnistusLisatiedotFormProps = {
    L: Localisations;
    form: Form;
    onChange: (name: string, value: string) => void;
    onSubmit: () => Promise<void>;
};

class VahvaTunnistusLisatiedotForm extends React.Component<VahvaTunnistusLisatiedotFormProps> {
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <VahvaTunnistusLisatiedotInputs
                    L={this.props.L}
                    form={this.props.form}
                    onChange={this.props.onChange}
                />
                <button type="submit" className="oph-button oph-button-primary">
                    {this.props.L['UUDELLEENREKISTEROINTI_TALLENNA_JA_JATKA']}
                </button>
            </form>
        );
    }

    hasErrors = (): boolean => {
        return this.props.form.submitted && this.props.form.errors.length > 0;
    };

    onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onSubmit();
    };
}

export default VahvaTunnistusLisatiedotForm;
