// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import OphSelect from "./OphSelect";
import StaticUtils from "../StaticUtils";
import {fetchAllKayttooikeusryhma} from '../../../actions/kayttooikeusryhma.actions';

type Props = {
    L: {[key: string]: string},
    locale: string,
    fetchAllKayttooikeusryhma: (boolean) => void,
    kayttooikeusRyhmas: Array<{id: number, description: {texts: {fi: string, sv: string, en: string,}}}>,
    kayttooikeusSelectionAction: (number) => void,
};

type State = {
    selectedKayttooikeus: ?number,
};

class KayttooikeusryhmaSingleSelect extends React.Component<Props, State> {
    static propTypes = {
        kayttooikeusSelectionAction: PropTypes.func.isRequired,
    };

    componentDidMount() {
        // Fetches only if not already fetched
        this.props.fetchAllKayttooikeusryhma(false);
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedKayttooikeus: null,
        }
    }

    render() {
        return !this.props.kayttooikeusLoading && this.props.kayttooikeusRyhmas && this.props.kayttooikeusRyhmas.length
            ? <OphSelect id="kayttooikeusryhmaFilter"
                         options={this.props.kayttooikeusRyhmas.map(kayttooikeusryhma => ({
                             value: kayttooikeusryhma.id,
                             label: StaticUtils.getLocalisedText(kayttooikeusryhma.description.texts, this.props.locale)
                         }))}
                         value={this.state.selectedKayttooikeus}
                         placeholder={this.props.L['HENKILOHAKU_FILTERS_KAYTTOOIKEUSRYHMA_PLACEHOLDER']}
                         onChange={(event) => this.props.kayttooikeusSelectionAction(event.value)}/>
            : null;
    }
}

const mapStateToProps = (state, ownProps) => ({
    L: state.l10n.localisations[state.locale],
    locale: state.locale,
    kayttooikeusLoading: state.kayttooikeus.allKayttooikeusryhmasLoading,
    kayttooikeusRyhmas: state.kayttooikeus.allKayttooikeusryhmas,
});

export default connect(mapStateToProps, {fetchAllKayttooikeusryhma})(KayttooikeusryhmaSingleSelect);