import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCommonOptions } from '../http';

export type MfaSetupResponse = {
    secretKey: string;
    qrCodeDataUri: string;
};

export type MfaEnableRequest = string;
export type MfaEnableResponse = boolean;

export const kayttooikeusApi = createApi({
    reducerPath: 'kayttooikeusApi',
    baseQuery: fetchBaseQuery({
        ...getCommonOptions(),
        headers: { ...getCommonOptions().headers, 'Content-Type': 'application/json; charset=utf-8' },
        baseUrl: '/kayttooikeus-service/',
    }),
    endpoints: (builder) => ({
        getMfaSetup: builder.query<MfaSetupResponse, void>({
            query: () => 'mfasetup/gauth/setup',
        }),
        getTestSuomiFi: builder.query<any, void>({
            query: () => 'mfasetup/gauth/testsuomifi',
        }),
        postMfaEnable: builder.mutation<MfaEnableResponse, MfaEnableRequest>({
            query: (token) => ({
                url: 'mfasetup/gauth/enable',
                method: 'POST',
                body: `"${token}"`,
            }),
        }),
    }),
});

export const { useGetMfaSetupQuery, useGetTestSuomiFiQuery, usePostMfaEnableMutation } = kayttooikeusApi;
