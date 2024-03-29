import React, { useMemo } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
    getSortedRowModel,
} from '@tanstack/react-table';

import PropertySingleton from '../../../globals/PropertySingleton';
import './AccessRightsReportData.css';
import { useLocalisations } from '../../../selectors';
import OphTable from '../../OphTable';
import { AccessRightsReportRow } from '../../../api/kayttooikeus';

type Props = {
    report: AccessRightsReportRow[];
};

const formatDate = (d: string) => moment(d).format(PropertySingleton.state.PVM_MOMENT_FORMAATTI);

export const AccessRightsReport = ({ report }: Props) => {
    const { L } = useLocalisations();

    const columns = useMemo<ColumnDef<AccessRightsReportRow, AccessRightsReportRow>[]>(
        () => [
            {
                accessorFn: (row) => row.personName,
                header: () => L['HENKILO_NIMI'],
                id: 'personName',
            },
            {
                accessorFn: (row) => row,
                header: () => L['HENKILO_OPPIJANUMERO'],
                cell: ({ getValue }) => (
                    <Link to={`/virkailija/${getValue().personOid}`} target="_blank">
                        {getValue().personOid}
                    </Link>
                ),
                sortingFn: (a, b) => a.original.personOid.localeCompare(b.original.personOid),
                id: 'personOid',
            },
            {
                accessorFn: (row) => row.organisationName,
                header: () => L['HENKILO_KAYTTOOIKEUS_ORGANISAATIO_TEHTAVA'],
                id: 'organisationName',
            },
            {
                accessorFn: (row) => row.organisationOid,
                header: () => L['OID'],
                id: 'organisationOid',
            },
            {
                accessorFn: (row) => row.accessRightName,
                header: () => L['HENKILO_KAYTTOOIKEUS_KAYTTOOIKEUS'],
                id: 'accessRightName',
            },
            {
                accessorFn: (row) => row,
                header: () => L['HENKILO_KAYTTOOIKEUS_ALKUPVM'],
                cell: ({ getValue }) => <div className="right">{formatDate(getValue().startDate)}</div>,
                sortingFn: (a, b) => a.original.startDate.localeCompare(b.original.startDate),
                id: 'startDate',
            },
            {
                accessorFn: (row) => row,
                header: () => L['HENKILO_KAYTTOOIKEUS_LOPPUPVM'],
                cell: ({ getValue }) => <div className="right">{formatDate(getValue().endDate)}</div>,
                sortingFn: (a, b) => a.original.endDate.localeCompare(b.original.endDate),
                id: 'endDate',
            },
        ],
        [report]
    );

    const table = useReactTable({
        data: report,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="reportScroll">
            <div className="henkilohakuTableWrapper reportWrapper">
                <OphTable table={table} isLoading={false} />
            </div>
        </div>
    );
};

export default AccessRightsReport;
