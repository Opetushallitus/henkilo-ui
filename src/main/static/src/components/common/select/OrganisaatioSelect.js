// @flow
import React from 'react';
import type {Locale} from "../../../types/locale.type";
import type {L} from "../../../types/localisation.type";
import type {OrganisaatioSelectObject} from "../../../types/organisaatioselectobject.types";
import './OrganisaatioSelect.css';
import * as R from 'ramda';
import {List} from 'react-virtualized';

type Props = {
    locale: Locale,
    L: L,
    organisaatiot: Array<OrganisaatioSelectObject>,
    onSelect: (organisaatio: OrganisaatioSelectObject) => void,
}

type State = {
    searchWord: string,
    allOrganisaatiot: Array<OrganisaatioSelectObject>,
    organisaatiot: Array<OrganisaatioSelectObject>
}

export class OrganisaatioSelect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const allOrganisaatiot = this._sortAlphabetically(this.props.organisaatiot);
        this.state = {
            searchWord: '',
            allOrganisaatiot: allOrganisaatiot,
            organisaatiot: [...allOrganisaatiot]
        };
    }

    render() {
        return <div className="organisaatio-select">
            <p className="oph-h3">{this.props.L['OMATTIEDOT_ORGANISAATIO_VALINTA']}</p>
            <input
                className="oph-input"
                placeholder={this.props.L['OMATTIEDOT_RAJAA_LISTAUSTA']}
                type="text"
                value={this.state.searchWord}
                onChange={this.onFilter.bind(this)}
            />
            <List className={"organisaatio-select-list"}
                  rowCount={this.state.organisaatiot.length}
                  rowRenderer={this._renderRow}
                  width={630}
                  height={700}
                  rowHeight={70}></List>
        </div>
    }

    _renderRow = (renderParams: any) => {
        const organisaatio: OrganisaatioSelectObject = this.state.organisaatiot[renderParams.index];
        return <div className="organisaatio" onClick={this.makeSelection.bind(this, organisaatio)}
                    style={renderParams.style} key={organisaatio.oid}>
            {this._renderParents(organisaatio)}
            {this._renderOrganisaatioNimi(organisaatio)}
        </div>;
    };

    makeSelection = (organisaatio: OrganisaatioSelectObject): void => {
        this.props.onSelect(organisaatio);
    };

    _renderOrganisaatioNimi = (organisaatio: OrganisaatioSelectObject) => {
        return <div
            className="organisaatio-nimi">{organisaatio.name} {this._renderOrganisaatioTyypit(organisaatio)}</div>;
    };

    _renderOrganisaatioTyypit = (organisaatio: OrganisaatioSelectObject) => {
        return organisaatio.organisaatiotyypit && organisaatio.organisaatiotyypit.length > 0 ? `(${organisaatio.organisaatiotyypit.toString()})` : null;
    };

    _renderParents = (organisaatio: OrganisaatioSelectObject) => {
        return organisaatio.parentNames.map((parent: string, index: number) =>
            <span key={index} className="parent">{parent} > </span>);
    };

    onFilter(event: SyntheticEvent<HTMLInputElement>) {
        const currentSearchWord: string = event.currentTarget.value;
        const previousSearchWord = this.state.searchWord;

        if (previousSearchWord.length > currentSearchWord.length) {
            if (this.state.allOrganisaatiot.length !== this.state.organisaatiot.length) {
                const organisaatiot = this._filterAndSortOrganisaatios(this.state.allOrganisaatiot, currentSearchWord);
                this.setState({searchWord: currentSearchWord, organisaatiot});
            } else {
                this.setState({searchWord: currentSearchWord});
            }
        } else {
            // optimize filtering if the new search searchword starts with the previous
            const organisaatiot = this._filterAndSortOrganisaatios(this.state.organisaatiot, currentSearchWord);
            this.setState({searchWord: currentSearchWord, organisaatiot});
        }
    }

    _filterAndSortOrganisaatios(organisaatiot: Array<OrganisaatioSelectObject>, searchWord: string): Array<OrganisaatioSelectObject> {
        const containsSearchword = (organisaatio: OrganisaatioSelectObject) => organisaatio.name.toLowerCase().includes(searchWord.toLowerCase());
        const startsWithSearchWord = (organisaatio: OrganisaatioSelectObject) => organisaatio.name.toLowerCase().startsWith(searchWord.toLowerCase());
        const notStartingWithSearchWord = (organisaatio: OrganisaatioSelectObject) => !organisaatio.name.toLowerCase().startsWith(searchWord.toLowerCase());

        const organisaatioFilteredBySearchword = this._organisaatiotFilteredBy(organisaatiot, containsSearchword);
        const organisaatiotStartingWithSearchword = this._organisaatiotFilteredBy(organisaatioFilteredBySearchword, startsWithSearchWord);
        const organisaatiotStartingWithSearchwordSortedByParentName = this._sortOrganisaatiotByParentName(organisaatiotStartingWithSearchword);
        const organisaatiotNotStartingWithSearchword = this._organisaatiotFilteredBy(organisaatioFilteredBySearchword, notStartingWithSearchWord);

        return [...organisaatiotStartingWithSearchwordSortedByParentName, ...organisaatiotNotStartingWithSearchword];
    };

    _sortAlphabetically(organisaatiot: Array<OrganisaatioSelectObject>): Array<OrganisaatioSelectObject> {
        return R.sortBy(R.compose(R.toLower, R.prop('name')))(organisaatiot);
    }

    _organisaatiotFilteredBy(organisaatiot: Array<OrganisaatioSelectObject>, func: (organisaatio: OrganisaatioSelectObject) => boolean): Array<OrganisaatioSelectObject> {
        return organisaatiot.filter(func);
    }

    _sortOrganisaatiotByParentName(organisaatiot: Array<any>): Array<OrganisaatioSelectObject> {
        const hasParent = (organisaatio: OrganisaatioSelectObject) => organisaatio.parentNames && organisaatio.parentNames.length > 0;
        const noParent = (organisaatio: OrganisaatioSelectObject) => !organisaatio.parentNames || organisaatio.parentNames.length === 0;

        const organisaatiotHavingParents: any = this._organisaatiotFilteredBy(organisaatiot, hasParent);
        const organisaatiotNotHavingParents = this._organisaatiotFilteredBy(organisaatiot, noParent);

        return [...organisaatiotNotHavingParents, ...R.sortBy(R.compose(R.toLower, R.last, R.prop('parentNames')))(organisaatiotHavingParents)];
    }


}