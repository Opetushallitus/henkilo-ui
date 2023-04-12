import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { urls } from 'oph-urls-js';

import { getCommonOptions } from '../http';
import { addGlobalNotification } from '../actions/notification.actions';
import { NOTIFICATIONTYPES } from '../components/common/Notification/notificationtypes';
import { Localisations } from '../types/localisation.type';

type LinkHenkilosRequest = {
    masterOid: string;
    force: boolean;
    selectedDuplicates: string[];
    L: Localisations;
};

export const oppijanumerorekisteriApi = createApi({
    reducerPath: 'oppijanumerorekisteriApi',
    baseQuery: fetchBaseQuery({
        ...getCommonOptions(),
        headers: { ...getCommonOptions().headers, 'Content-Type': 'application/json; charset=utf-8' },
    }),
    endpoints: (builder) => ({
        postLinkHenkilos: builder.mutation<void, LinkHenkilosRequest>({
            query: ({ masterOid, selectedDuplicates, force }) => ({
                url: urls.url(
                    force
                        ? 'oppijanumerorekisteri-service.henkilo.forcelink'
                        : 'oppijanumerorekisteri-service.henkilo.link',
                    masterOid
                ),
                method: 'POST',
                body: selectedDuplicates,
            }),
            async onQueryStarted({ L }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(
                        addGlobalNotification({
                            key: 'LINKED_DUPLICATES_SUCCESS',
                            type: NOTIFICATIONTYPES.SUCCESS,
                            title: L['DUPLIKAATIT_NOTIFICATION_ONNISTUI'],
                            autoClose: 10000,
                        })
                    );
                } catch (err) {
                    dispatch(
                        addGlobalNotification({
                            key: 'LINKED_DUPLICATES_FAILURE',
                            type: NOTIFICATIONTYPES.ERROR,
                            title: L['DUPLIKAATIT_NOTIFICATION_EPAONNISTUI'],
                            autoClose: 10000,
                        })
                    );
                }
            },
        }),
    }),
});

export const { usePostLinkHenkilosMutation } = oppijanumerorekisteriApi;
