import React from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import classNames from 'classnames';
import type { ExistenceCheckRequest, ExistenceCheckState } from '../../../../../reducers/existence.reducer';
import Button from '../../../../common/button/Button';
import { SpinnerInButton } from '../../../../common/icons/SpinnerInButton';
import StatusNotification from './StatusNotification';
import './DetailsForm.css';

type Props = ExistenceCheckState & {
    translate: (key: string) => string;
    clearExistenceCheck: () => void;
    doExistenceCheck: (payload: ExistenceCheckRequest) => void;
    cache: (payload: ExistenceCheckRequest) => void;
    create: () => void;
};

export const schema = Joi.object({
    hetu: Joi.string()
        .trim(true)
        .regex(/^\d{6}[ABCDEFYXWVU+-]\d{3}[0123456789ABCDEFHJKLMNPRSTUVWXY]$/)
        .required(),
    etunimet: Joi.string().trim(true).required(),
    kutsumanimi: Joi.string()
        .trim(true)
        .custom((kutsumanimi, { state }) => {
            const firstnames = state.ancestors[0]['etunimet']
                .split(/\s/)
                .flatMap((s: string) => [s, ...s.split('-')])
                .map((s: string) => s.toLowerCase())
                .filter((value: string, index: number, arr: string[]) => arr.indexOf(value) === index);
            if (firstnames.includes(kutsumanimi.toLowerCase())) return kutsumanimi;
            throw new Error();
        })
        .required(),
    sukunimi: Joi.string().trim(true).required(),
});

type FormField = {
    name: keyof ExistenceCheckRequest;
    localizationKey: string;
};

const formFields: FormField[] = [
    {
        name: 'hetu',
        localizationKey: 'HENKILO_HETU',
    },
    {
        name: 'etunimet',
        localizationKey: 'HENKILO_ETUNIMET',
    },
    {
        name: 'kutsumanimi',
        localizationKey: 'HENKILO_KUTSUMANIMI',
    },
    {
        name: 'sukunimi',
        localizationKey: 'HENKILO_SUKUNIMI',
    },
];

const formFieldErrors: Record<string, string> = {
    'string.empty': 'LOMAKE_PAKOLLINEN_TIETO',
    'any.custom': 'HENKILO_KUTSUMANIMI_VALIDOINTI',
};

const resolveErrorKey = (key: string): string => formFieldErrors[key] || 'LOMAKE_KENTTA_SISALTAA_VIRHEITA';

const DetailsForm: React.FC<Props> = ({
    translate,
    clearExistenceCheck,
    doExistenceCheck,
    cache,
    create,
    loading,
    status,
    oid,
    msgKey,
}) => {
    React.useEffect(() => {
        clearExistenceCheck();
        cache(undefined);
    }, [clearExistenceCheck, cache]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<ExistenceCheckRequest>({ resolver: joiResolver(schema), mode: 'onChange' });

    const onSubmit = (data: ExistenceCheckRequest): void => {
        cache(data);
        doExistenceCheck(data);
    };

    return (
        <>
            <StatusNotification {...{ translate, create, status, oid, msgKey }} />
            <form>
                {formFields.map((field) => (
                    <div className="oph-field oph-field-is-required" key={field.name}>
                        <label className="oph-label">{translate(field.localizationKey)}</label>
                        <input
                            className={classNames('oph-input', {
                                'oph-input-has-error': !!errors[field.name],
                            })}
                            placeholder={translate(field.localizationKey)}
                            type="text"
                            {...register(field.name)}
                            onFocus={clearExistenceCheck}
                        />
                        {!!errors[field.name] && (
                            <div className="oph-field-text oph-error">
                                {translate(resolveErrorKey(errors[field.name].type))}
                            </div>
                        )}
                    </div>
                ))}
                <div className="oph-field">
                    <Button action={handleSubmit(onSubmit)} disabled={!isValid || loading}>
                        <SpinnerInButton show={loading} />
                        {translate('KUTSUTUT_VIRKAILIJAT_HAKU_HENKILO')}
                    </Button>
                    <Button
                        className="margin-left"
                        action={() => {
                            clearExistenceCheck();
                            cache(undefined);
                            reset();
                        }}
                        disabled={loading}
                    >
                        {translate('TYHJENNA')}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default DetailsForm;
