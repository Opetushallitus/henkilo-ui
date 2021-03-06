// @flow
import React from 'react'

import AddedOrganization from './AddedOrganization';
import type {KutsuOrganisaatio} from "../../types/domain/kayttooikeus/OrganisaatioHenkilo.types";

type Props = {
    addedOrgs: Array<KutsuOrganisaatio>,
}

export const AddedOrganizations = (props: Props) =>
    <div>{props.addedOrgs.map((organization, index) =>
        <AddedOrganization
            key={index}
            index={index}
            addedOrgs={props.addedOrgs}
            addedOrg={organization}
        />)}
    </div>;