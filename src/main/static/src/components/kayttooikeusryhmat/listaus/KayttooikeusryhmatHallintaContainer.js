// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchAllKayttooikeusryhma} from '../../../actions/kayttooikeusryhma.actions';
import Loader from "../../common/icons/Loader";
import KayttooikeusryhmatHallintaPage from "./KayttooikeusryhmatHallintaPage";
import type {Locale} from "../../../types/locale.type";
import type {L} from "../../../types/localisation.type";
import {updateEmptyNavigation} from "../../../actions/navigation.actions";
import { hasAnyPalveluRooli } from '../../../utilities/organisaatio.util'


type Props = {
    updateNavigation: (Array<any>, ?string, ?string) => any,
    muokkausoikeus: boolean,
    kayttooikeusryhmat: any,
    updateEmptyNavigation: () => void,
    fetchAllKayttooikeusryhma: (boolean) => void,
    locale: Locale,
    L: L,
    router: any,
    updateEmptyNavigation: () => void,
}

class KayttooikeusryhmatContainer extends React.Component<Props> {

    componentDidMount() {
        this.props.updateEmptyNavigation();

        this.props.fetchAllKayttooikeusryhma(true);
    }

    render() {
        const kayttooikeusryhmat: any = this.props.kayttooikeusryhmat.allKayttooikeusryhmas;
        return <div className="wrapper">
            {this.props.kayttooikeusryhmat.allKayttooikeusryhmasLoading ? <Loader/> :
                <KayttooikeusryhmatHallintaPage {...this.props}
                                                kayttooikeusryhmat={kayttooikeusryhmat}/>
            }
        </div>
    }

}

const mapStateToProps = (state, ownProps) => ({
    muokkausoikeus: hasAnyPalveluRooli(state.omattiedot.organisaatiot, ['KOOSTEROOLIENHALLINTA_CRUD', 'HENKILONHALLINTA_OPHREKISTERI', 'KAYTTOOIKEUS_REKISTERINPITAJA']),
    kayttooikeusryhmat: state.kayttooikeus,
    locale: state.locale,
    L: state.l10n.localisations[state.locale]
});

export default connect(mapStateToProps, {fetchAllKayttooikeusryhma, updateEmptyNavigation})(KayttooikeusryhmatContainer)