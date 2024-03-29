import React from 'react';
import PropTypes from 'prop-types';

const WideBlueNotification = ({ message, closeAction }) => (
    <div className="oph-alert oph-alert-info">
        <div className="oph-alert-container">
            <div className="oph-alert-title">{message}</div>
            <button
                className="oph-button oph-button-close"
                type="button"
                title="Close"
                aria-label="Close"
                onClick={closeAction}
            >
                <span aria-hidden="true">×</span>
            </button>
        </div>
    </div>
);

WideBlueNotification.propTypes = {
    message: PropTypes.string,
    closeAction: PropTypes.func.isRequired,
};

export default WideBlueNotification;
