// @flow
import React from 'react'
import type {Koodisto} from '../../../types/domain/koodisto/koodisto.types'
import type {Kielisyys} from '../../../types/domain/oppijanumerorekisteri/kielisyys.types'
import KoodistoSelect from './KoodistoSelect'

type KielisyysSelectProps = {
    className?: string,
    placeholder: string,
    koodisto: Koodisto,
    value: ?Kielisyys,
    onChange: (?Kielisyys) => void,
}

/**
 * Komponentti kielisyyden valitsemiseen.
 */
class KielisyysSelect extends React.Component<KielisyysSelectProps> {

    render() {
        return (
            <KoodistoSelect
                className={this.props.className}
                placeholder={this.props.placeholder}
                koodisto={this.props.koodisto}
                value={this.props.value ? this.props.value.kieliKoodi : null}
                onChange={this.onChange}
                />
        );
    }

    onChange = (value: ?string) => {
        this.props.onChange(value ? {kieliKoodi: value} : null)
    };

}

export default KielisyysSelect
