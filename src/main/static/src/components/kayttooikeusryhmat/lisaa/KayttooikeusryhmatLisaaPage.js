// @flow
import React from 'react';
import './KayttooikeusryhmatLisaaPage.css';
import KayttooikeusryhmanOrganisaatiorajoite from './KayttooikeusryhmanOrganisaatiorajoite';
import type {PalveluJaKayttooikeusSelection, NewKayttooikeusryhma} from '../kayttooikeusryhmat.types';
import KayttooikeusryhmatNimi from './KayttooikeusryhmatNimi';
import KayttooikeusryhmatKuvaus from './KayttooikeusryhmatKuvaus';
import MyonnettavatKayttooikeusryhmat from './MyonnettavatKayttooikeusryhmat';
import KayttooikeusryhmatPalvelutJaKayttooikeudet from './KayttooikeusryhmatPalvelutJaKayttooikeudet';
import type {Locale} from '../../../types/locale.type';
import type {ReactSelectOption} from '../../../types/react-select.types';
import type {PalvelutState} from "../../../reducers/palvelut.reducer";
import type {KayttooikeusState} from "../../../reducers/kayttooikeus.reducer";

type Props = {
    L: any,
    omattiedot: any,
    koodisto: any,
    kayttooikeus: any,
    kayttooikeusState: KayttooikeusState,
    palvelutState: PalvelutState,
    locale: Locale,
    fetchPalveluKayttooikeus: (palveluName: string) => void
}

type State = {
    newKayttooikeusryhma: NewKayttooikeusryhma,
    palvelutSelection: ReactSelectOption | void,
    palveluKayttooikeusSelection: ReactSelectOption | void
};

export default class KayttooikeusryhmatLisaaPage extends React.Component<Props, State> {

    state = {
        newKayttooikeusryhma: {
            name: {fi: '', sv: '', en: ''},
            description: {fi: '', sv: '', en: ''},
            organisaatioSelections: [],
            oppilaitostyypitSelections: [],
            ryhmaRajoite: false,
            kayttooikeusryhmaSelections: [],
            palveluJaKayttooikeusSelections: [],
        },
        palvelutSelection: undefined,
        palveluKayttooikeusSelection: undefined
    };

    render() {
        return <form className="wrapper">

            <KayttooikeusryhmatNimi {...this.props}
                                    name={this.state.newKayttooikeusryhma.name}
                                    setName={this._setName}></KayttooikeusryhmatNimi>

            <KayttooikeusryhmatKuvaus {...this.props}
                                      description={this.state.newKayttooikeusryhma.description}
                                      setDescription={this._setDescription}></KayttooikeusryhmatKuvaus>

            <KayttooikeusryhmanOrganisaatiorajoite {...this.props}
                                            ryhmaRajoite={this.state.newKayttooikeusryhma.ryhmaRajoite}
                                               toggleRyhmaRajoite={this._toggleRyhmaRajoite}
                                           organisaatioSelectAction={this._onOrganisaatioSelection}
                                           organisaatioSelections={this.state.newKayttooikeusryhma.organisaatioSelections}
                                           removeOrganisaatioSelectAction={this._onRemoveOrganisaatioSelect}
                                           oppilaitostyypitSelectAction={this._onOppilaitostyypitSelection}
                                           oppilaitostyypitSelections={this.state.newKayttooikeusryhma.oppilaitostyypitSelections}
                                           removeOppilaitostyypitSelectionAction={this._onRemoveOppilaitostyypitSelect}></KayttooikeusryhmanOrganisaatiorajoite>

            <MyonnettavatKayttooikeusryhmat {...this.props}
                                            kayttooikeusryhmaSelectAction={this._onKayttooikeusryhmaSelection}
                                            kayttooikeusryhmaSelections={this.state.newKayttooikeusryhma.kayttooikeusryhmaSelections}
                                            removeKayttooikeusryhmaSelectAction={this._onRemoveKayttooikeusryhmaSelect}
            ></MyonnettavatKayttooikeusryhmat>

            <KayttooikeusryhmatPalvelutJaKayttooikeudet {...this.props}
                                                        palvelutSelection={this.state.palvelutSelection}
                                                        palvelutSelectAction={this._onPalvelutSelection}

                                                        palveluKayttooikeusSelectAction={this._onPalveluKayttooikeusSelection}
                                                        palveluKayttooikeusSelection={this.state.palveluKayttooikeusSelection}
                                                        lisaaPalveluJaKayttooikeusAction={this._onLisaaPalveluJaKayttooikeus}

                                                        palveluJaKayttooikeusSelections={this.state.newKayttooikeusryhma.palveluJaKayttooikeusSelections}
                                                        removePalveluJaKayttooikeus={this._onRemovePalveluJaKayttooikeus}
            ></KayttooikeusryhmatPalvelutJaKayttooikeudet>

            <div className="kayttooikeusryhmat-lisaa-page-buttons">
                <button disabled={!this._validateKayttooikeusryhmaInputs()} className="oph-button oph-button-primary" onClick={() => {} }>{this.props.L['TALLENNA']}</button>
                <button className="oph-button oph-button-cancel" onClick={() => {} }>{this.props.L['PERUUTA']}</button>
            </div>

        </form>
    }

    _toggleRyhmaRajoite = () => {
        this.setState({newKayttooikeusryhma: {...this.state.newKayttooikeusryhma,
            ryhmaRajoite: !this.state.newKayttooikeusryhma.ryhmaRajoite}});

    };

    _onOrganisaatioSelection = (selection: ReactSelectOption): void => {
        const currentOrganisaatioSelections: Array<ReactSelectOption> = this.state.newKayttooikeusryhma.organisaatioSelections;
        if (!currentOrganisaatioSelections.some(organisaatio => organisaatio.value === selection.value)) {
            this.setState({
                newKayttooikeusryhma: {
                    ...this.state.newKayttooikeusryhma,
                    organisaatioSelections: [...currentOrganisaatioSelections, selection]
                }
            });
        }
    };

    _onRemoveOrganisaatioSelect = (selection: ReactSelectOption): void => {
        const newOrganisaatioSelections: Array<ReactSelectOption> = this.state.newKayttooikeusryhma.organisaatioSelections
            .filter(organisaatio => selection.value !== organisaatio.value);
        this.setState({
            newKayttooikeusryhma: {
                ...this.state.newKayttooikeusryhma,
                organisaatioSelections: newOrganisaatioSelections
            }
        });
    };

    _onOppilaitostyypitSelection = (selection: ReactSelectOption): void => {
        const currentOppilaitostyypitSelections: Array<ReactSelectOption> = this.state.newKayttooikeusryhma.oppilaitostyypitSelections;
        if (!currentOppilaitostyypitSelections.some((oppilaitostyyppi: ReactSelectOption) => oppilaitostyyppi.value === selection.value)) {
            this.setState({
                newKayttooikeusryhma: {
                    ...this.state.newKayttooikeusryhma,
                    oppilaitostyypitSelections: [...currentOppilaitostyypitSelections, selection]
                }
            });
        }
    };

    _onRemoveOppilaitostyypitSelect = (selection: ReactSelectOption): void => {
        const newOppilaitostyypitSelections: Array<ReactSelectOption> = this.state.newKayttooikeusryhma.oppilaitostyypitSelections
            .filter((oppilaitostyyppi: ReactSelectOption) => selection.value !== oppilaitostyyppi.value);
        this.setState({
            newKayttooikeusryhma: {
                ...this.state.newKayttooikeusryhma,
                oppilaitostyypitSelections: newOppilaitostyypitSelections
            }
        });
    };

    _setName = (languageCode: string, value: string): void => {
        this.setState({
            newKayttooikeusryhma:
                {
                    ...this.state.newKayttooikeusryhma,
                    name: {...this.state.newKayttooikeusryhma.name, [languageCode]: value}
                }
        })
    };

    _setDescription = (languageCode: string, value: string): void => {
        this.setState({
            newKayttooikeusryhma:
                {
                    ...this.state.newKayttooikeusryhma,
                    description: {...this.state.newKayttooikeusryhma.description, [languageCode]: value}
                }
        })
    };

    _onKayttooikeusryhmaSelection = (selection: ReactSelectOption): void => {
        const currentKayttooikeusryhmaSelections: Array<ReactSelectOption> = this.state.newKayttooikeusryhma.kayttooikeusryhmaSelections;
        if (!currentKayttooikeusryhmaSelections.some((kayttooikeusryhma: ReactSelectOption) => kayttooikeusryhma.value === selection.value)) {
            this.setState({
                newKayttooikeusryhma: {
                    ...this.state.newKayttooikeusryhma,
                    kayttooikeusryhmaSelections: [...currentKayttooikeusryhmaSelections, selection]
                }
            });
        }
    };

    _onRemoveKayttooikeusryhmaSelect = (selection: ReactSelectOption): void => {
        const newKayttooikeusryhmaSelections: Array<ReactSelectOption> = this.state.newKayttooikeusryhma.kayttooikeusryhmaSelections
            .filter((kayttooikeusryhma: ReactSelectOption) => kayttooikeusryhma.value !== selection.value);
        this.setState({
            newKayttooikeusryhma: {
                ...this.state.newKayttooikeusryhma,
                kayttooikeusryhmaSelections: newKayttooikeusryhmaSelections
            }
        });
    };

    _onPalvelutSelection = (selection: ReactSelectOption): void => {
        this.setState({palvelutSelection: selection, palveluKayttooikeusSelection: undefined});
        this.props.fetchPalveluKayttooikeus(selection.value);
    };

    _onPalveluKayttooikeusSelection = (selection: ReactSelectOption): void => {
        this.setState({palveluKayttooikeusSelection: selection});
    };

    _onLisaaPalveluJaKayttooikeus = (): void => {
        const {palvelutSelection, palveluKayttooikeusSelection}: any = this.state;
        const newKayttoikeusSelection: PalveluJaKayttooikeusSelection = {
            palvelu: palvelutSelection,
            kayttooikeus: palveluKayttooikeusSelection
        };
        const currentKayttooikeusSelections = this.state.newKayttooikeusryhma.palveluJaKayttooikeusSelections;
        if (!currentKayttooikeusSelections.some((kayttooikeusSelection: PalveluJaKayttooikeusSelection) =>
                (kayttooikeusSelection.palvelu.value === newKayttoikeusSelection.palvelu.value &&
                    kayttooikeusSelection.kayttooikeus.value === newKayttoikeusSelection.kayttooikeus.value))) {
            this.setState({
                newKayttooikeusryhma: {
                    ...this.state.newKayttooikeusryhma,
                    palveluJaKayttooikeusSelections: [...currentKayttooikeusSelections, newKayttoikeusSelection]
                },
                palveluKayttooikeusSelection: undefined
            })
        }
    };

    _onRemovePalveluJaKayttooikeus = (removeItem: PalveluJaKayttooikeusSelection): void => {
        const newPalveluJaKayttooikeusSelections = this.state.newKayttooikeusryhma.palveluJaKayttooikeusSelections.filter(
            (currentItem: PalveluJaKayttooikeusSelection) => !(removeItem.kayttooikeus.value === currentItem.kayttooikeus.value) && (removeItem.palvelu.value === currentItem.palvelu.value));
        this.setState({
            newKayttooikeusryhma:{
                    ...this.state.newKayttooikeusryhma,
                    palveluJaKayttooikeusSelections: newPalveluJaKayttooikeusSelections
                }
        });
    };

    _validateKayttooikeusryhmaInputs = (): boolean => {
        const newKayttooikeusryhma = this.state.newKayttooikeusryhma;
        const name = newKayttooikeusryhma.name;
        const description = newKayttooikeusryhma.description;
        const palveluJaKayttooikeusSelections = newKayttooikeusryhma.palveluJaKayttooikeusSelections;
        return palveluJaKayttooikeusSelections.length > 0
            && description.fi.length > 0 && description.sv.length > 0 && description.en.length > 0
            && name.fi.length > 0 && name.sv.length > 0 && name.en.length > 0;
    };

    async createNewKayttooikeusryhma() {
        console.log(this.state);
    }

}