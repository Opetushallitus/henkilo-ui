import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCommonOptions } from '../http';
import { OrganisaatioHenkilo } from '../types/domain/kayttooikeus/OrganisaatioHenkilo.types';
import { Omattiedot } from '../types/domain/kayttooikeus/Omattiedot.types';
import { FETCH_OMATTIEDOT_ORGANISAATIOS_SUCCESS, FETCH_OMATTIEDOT_SUCCESS } from '../actions/actiontypes';
import { Locale } from '../types/locale.type';

type MfaSetupResponse = {
    secretKey: string;
    qrCodeDataUri: string;
};

type MfaEnableRequest = string;
type MfaDisableRequest = void;
type MfaPostResponse = boolean;

export const kayttooikeusApi = createApi({
    reducerPath: 'kayttooikeusApi',
    baseQuery: fetchBaseQuery({
        ...getCommonOptions(),
        headers: { ...getCommonOptions().headers, 'Content-Type': 'application/json; charset=utf-8' },
        baseUrl: '/kayttooikeus-service/',
    }),
    tagTypes: ['omattiedot', 'organisaatiot'],
    endpoints: (builder) => ({
        getOmattiedot: builder.query<Omattiedot, void>({
            query: () => 'henkilo/current/omattiedot',
            async onQueryStarted(_oid, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch({ type: FETCH_OMATTIEDOT_SUCCESS, omattiedot: data });
            },
            providesTags: ['omattiedot'],
        }),
        getOmatOrganisaatiot: builder.query<OrganisaatioHenkilo[], { oid: string; locale: Locale }>({
            query: ({ oid }) => `henkilo/${oid}/organisaatio?piilotaOikeudettomat=true`,
            async onQueryStarted({ locale }, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch({ type: FETCH_OMATTIEDOT_ORGANISAATIOS_SUCCESS, organisaatios: data, locale });
            },
            providesTags: ['organisaatiot'],
        }),
        getMfaSetup: builder.query<MfaSetupResponse, void>({
            query: () => 'mfasetup/gauth/setup',
        }),
        postMfaEnable: builder.mutation<MfaPostResponse, MfaEnableRequest>({
            query: (token) => ({
                url: 'mfasetup/gauth/enable',
                method: 'POST',
                body: `"${token}"`,
            }),
            invalidatesTags: ['omattiedot'],
        }),
        postMfaDisable: builder.mutation<MfaPostResponse, MfaDisableRequest>({
            query: () => ({
                url: 'mfasetup/gauth/disable',
                method: 'POST',
            }),
            invalidatesTags: ['omattiedot'],
        }),
    }),
});

export const {
    useGetOmattiedotQuery,
    useGetOmatOrganisaatiotQuery,
    useGetMfaSetupQuery,
    usePostMfaEnableMutation,
    usePostMfaDisableMutation,
} = kayttooikeusApi;
