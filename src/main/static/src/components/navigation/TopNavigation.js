import React from 'react';
import {Link} from 'react-router';
import classNames from 'classnames/bind';
import ophLogo from '../../img/logo_oph.svg';
import okmLogo from '../../img/logo_okm.png';

import './TopNavigation.css';

const TopNavigation = ({tabs, pathName, backButton, L}) => {
    return (
        <div id="topNavigation">
            { backButton ? <Link className="oph-link oph-link-big" to={backButton} >&#8701; {L['TAKAISIN_LINKKI']}</Link> : null }
            { tabs.length
                ? <ul className="tabs">
                    {tabs
                        .map((data, index) => {
                        const className = classNames({
                            'active': data.path === pathName,
                            'disabled-link': data.disabled
                        });
                        return <li key={index}>
                            <Link className={className} to={data.path} >{data.label}</Link>
                        </li>;
                    }
                    )}
                </ul>
                : !backButton && <div><img src={ophLogo} alt="oph logo" id="ophlogo"/> <img src={okmLogo} alt="okm logo" id="okmlogo"/></div>}
        </div>
    )
};

export default TopNavigation;
