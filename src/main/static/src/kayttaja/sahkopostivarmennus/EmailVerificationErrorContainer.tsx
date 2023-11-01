import React from 'react';
import { connect } from 'react-redux';
import { RouteActions } from 'react-router-redux';

import type { KayttajaRootState } from '../store';
import { Localisations } from '../../types/localisation.type';
import { Locale } from '../../types/locale.type';
import VirhePage from '../../components/common/page/VirhePage';
import { urls } from 'oph-urls-js';
import Button from '../../components/common/button/Button';
import { http } from '../../http';

type OwnProps = {
    params: { locale?: Locale; loginToken?: string; virhekoodi?: string };
    router: RouteActions;
};

type StateProps = {
    virhekoodi: string;
    L: Localisations;
    locale: Locale;
    loginToken: string;
};

type Props = OwnProps & StateProps;

class EmailVerificationErrorContainer extends React.Component<Props> {
    render() {
        const virhekoodi = this.props.virhekoodi;

        if (virhekoodi === 'TOKEN_KAYTETTY') {
            return (
                <VirhePage
                    theme="virhe"
                    topic="SAHKOPOSTI_VARMENNUS_TOKEN_KAYTETTY_OTSIKKO"
                    text="SAHKOPOSTI_VARMENNUS_TOKEN_KAYTETTY_TEKSTI"
                    buttonText="SAHKOPOSTI_VARMENNUS_KIRJAUTUMISSIVULLE"
                />
            );
        } else if (virhekoodi === 'TOKEN_VANHENTUNUT') {
            return (
                <VirhePage
                    theme="virhe"
                    topic="SAHKOPOSTI_VARMENNUS_TOKEN_VANHENTUNUT_OTSIKKO"
                    text="SAHKOPOSTI_VARMENNUS_TOKEN_VANHENTUNUT_TEKSTI"
                    buttonText="SAHKOPOSTI_VARMENNUS_KIRJAUTUMISSIVULLE"
                />
            );
        } else if (virhekoodi === 'TOKEN_EI_LOYDY') {
            return (
                <VirhePage
                    theme="virhe"
                    topic="SAHKOPOSTI_VARMENNUS_TOKEN_EI_LOYDY_OTSIKKO"
                    text="SAHKOPOSTI_VARMENNUS_TOKEN_EI_LOYDY_TEKSTI"
                    buttonText="SAHKOPOSTI_VARMENNUS_KIRJAUTUMISSIVULLE"
                />
            );
        } else if (virhekoodi === 'UNKNOWN') {
            // Tähän ohjataan, jos redirectToFrontPage-metodi päätyy virheeseen
            return (
                <VirhePage
                    theme="virhe"
                    topic="SAHKOPOSTI_VARMENNUS_TOKEN_YLEINEN_VIRHE_OTSIKKO"
                    text="SAHKOPOSTI_VARMENNUS_TOKEN_YLEINEN_VIRHE_TEKSTI"
                    buttonText="SAHKOPOSTI_VARMENNUS_KIRJAUTUMISSIVULLE"
                />
            );
        } else {
            return (
                <div className="virhePageVirheWrapperGray" id="virhePageVirhe">
                    <p className="oph-h2 oph-bold oph-red">
                        {this.props.L['SAHKOPOSTI_VARMENNUS_TOKEN_YLEINEN_VIRHE_OTSIKKO']}
                    </p>
                    <p className="oph-bold">{this.props.L['SAHKOPOSTI_VARMENNUS_TOKEN_YLEINEN_VIRHE_TEKSTI']}</p>
                    <Button action={() => this.redirectToFrontPage.bind(this)}>
                        {this.props.L['SAHKOPOSTI_VARMENNUS_JATKA_PALVELUUN']}
                    </Button>
                </div>
            );
        }
    }

    redirectToFrontPage = async () => {
        try {
            const url = urls.url('kayttooikeus-service.cas.logintoken.redirectToFrontpage', this.props.loginToken);
            const redirectParams = await http.get(url);
            const redirectUrl = urls.url('cas.login', redirectParams);
            window.location.replace(redirectUrl);
        } catch (error) {
            this.props.router.push(`/sahkopostivarmistus/virhe/${this.props.locale}/${this.props.loginToken}/UNKNOWN`);
        }
    };
}

const mapStateToProps = (state: KayttajaRootState, ownProps: OwnProps): StateProps => ({
    L: state.l10n.localisations[ownProps.params['locale'].toLowerCase()],
    virhekoodi: ownProps.params['virhekoodi'],
    locale: ownProps.params['locale'],
    loginToken: ownProps.params['loginToken'],
});

export default connect<StateProps, object, OwnProps, KayttajaRootState>(mapStateToProps)(
    EmailVerificationErrorContainer
);