// @flow
import React from 'react';
import { AddedOrganizations } from './AddedOrganizations';
import Button from "../common/button/Button";
import type {KutsuOrganisaatio} from "../../types/domain/kayttooikeus/OrganisaatioHenkilo.types";
import type {Henkilo} from "../../types/domain/oppijanumerorekisteri/henkilo.types";
import type {Localisations} from "../../types/localisation.type";
import moment from 'moment';
import PropertySingleton from '../../globals/PropertySingleton';

type Props = {
    addedOrgs: Array<KutsuOrganisaatio>,
    L: Localisations,
    henkilo: Henkilo,
    addOrganisaatio: (KutsuOrganisaatio) => void,
    locale: string,
}

export default class KutsuOrganisaatios extends React.Component<Props> {

    render() {
        return (
            <fieldset className="add-to-organisation">
                <span className="oph-h2 oph-strong">{this.props.L['VIRKAILIJAN_LISAYS_ORGANISAATIOON_OTSIKKO']}</span>
                <AddedOrganizations addedOrgs={this.props.addedOrgs}/>
                <div className="row">
                    <Button href="#" action={this.addEmptyOrganization.bind(this)}>{this.props.L['VIRKAILIJAN_KUTSU_LISAA_ORGANISAATIO_LINKKI']}</Button>
                </div>
            </fieldset>
        )
    }

    addEmptyOrganization(e: SyntheticEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.props.addOrganisaatio({
            oid: '',
            organisation: {oid: ''},
            voimassaLoppuPvm: moment().add(1, 'years').format(PropertySingleton.state.PVM_DBFORMAATTI),
            selectablePermissions: [],
            selectedPermissions: [],
            isPermissionsLoading: false,
        });
    }

}

