import {
    ADD_KAYTTOOIKEUS_TO_HENKILO_FAILURE, ADD_KAYTTOOIKEUS_TO_HENKILO_SUCCESS, DELETE_HENKILOORGS_FAILURE, NOTIFICATION_REMOVED, PASSIVOI_HENKILO_FAILURE,
    VTJ_OVERRIDE_HENKILO_FAILURE, YKSILOI_HENKILO_FAILURE, CREATE_HENKILOBYTOKEN_FAILURE
} from "../actions/actiontypes";


const rekisteroidyErrors = {
    UsernameAlreadyExistsException: {
        notL10nMessage: 'REKISTEROIDY_USERNAMEEXISTS_OTSIKKO',
        notL10nText: 'REKISTEROIDY_USERNAMEEXISTS_TEKSTI',
    },
    PasswordException: {
        notL10nMessage: 'REKISTEROIDY_PASSWORDEXCEPTION_OTSIKKO',
        notL10nText: 'REKISTEROIDY_PASSWORDEXCEPTION_TEKSTI',
    },
    IllegalArgumentException: {
        notL10nMessage: 'REKISTEROIDY_ILLEGALARGUMENT_OTSIKKO',
        notL10nText: 'REKISTEROIDY_ILLEGALARGUMENT_TEKSTI',
    },
};

const createButtonNotification = (type, buttonNotification) => ({
    type: type,
    notL10nMessage: buttonNotification.notL10nMessage,
    notL10nText: buttonNotification.notL10nText,
    id: buttonNotification.position,
    errorType: buttonNotification.errorType,
});

export const notifications = (state={existingKayttooikeus: [], buttonNotifications: [], updatePassword: [],
    henkilohakuNotifications: [], duplicatesNotifications: []}, action) => {
    switch (action.type) {
        case ADD_KAYTTOOIKEUS_TO_HENKILO_SUCCESS:
            return {
                ...state,
                existingKayttooikeus: [...state.existingKayttooikeus, {
                    type: 'ok',
                    notL10nMessage: 'NOTIFICATION_LISAA_KAYTTOOIKEUS_ONNISTUI',
                    organisaatioOid: action.organisaatioOid,
                    ryhmaIdList: action.ryhmaIdList,
                }],
            };
        case ADD_KAYTTOOIKEUS_TO_HENKILO_FAILURE:
            return {
                ...state,
                existingKayttooikeus: [...state.existingKayttooikeus, {
                    type: 'error',
                    notL10nMessage: action.notL10nMessage || 'NOTIFICATION_LISAA_KAYTTOOIKEUS_EPAONNISTUI',
                    id: action.id,
                }],
            };
        case NOTIFICATION_REMOVED:
            let removeNotifications;
            // For button notifications (remove all)
            removeNotifications = state[action.group].filter(notification => notification.id === action.id);
            // For kayttooikeus table notifications (remove single one)
            if (removeNotifications.length === 0) {
                removeNotifications  = action.id
                    ? [state[action.group].filter(notification => action.id === notification.organisaatioOid + notification.ryhmaIdList.join(''))[0]]
                    : [state[action.group].filter(notification => notification.type === action.status)[0]];
            }
            return Object.assign({}, state, {[action.group]: state[action.group].filter(notification => removeNotifications.indexOf(notification) === -1)});
        case PASSIVOI_HENKILO_FAILURE:
        case YKSILOI_HENKILO_FAILURE:
        case DELETE_HENKILOORGS_FAILURE:
        case VTJ_OVERRIDE_HENKILO_FAILURE:
            return {
                ...state,
                buttonNotifications: [...state.buttonNotifications, createButtonNotification('error', action.buttonNotification)],
            };
        case CREATE_HENKILOBYTOKEN_FAILURE:
            const error = rekisteroidyErrors[action.error.errorType];
            return {
                ...state,
                buttonNotifications: [...state.buttonNotifications, createButtonNotification('error', {
                    notL10nMessage: error.notL10nMessage,
                    notL10nText: error.notL10nText,
                    position: 'rekisteroidyPage',
                    errorType: action.error.errorType,
                })],
            };
        default:
            return state;
    }
};
