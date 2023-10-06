import * as React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import type { Moment } from 'moment';
import DatePicker from 'react-datepicker';
import { urls } from 'oph-urls-js';

import Table from '../table/Table';
import StaticUtils from '../StaticUtils';
import MyonnaButton from './buttons/MyonnaButton';
import Button from '../button/Button';
import { http } from '../../../http';
import { toLocalizedText } from '../../../localizabletext';
import PopupButton from '../button/PopupButton';
import AnomusHylkaysPopup from '../../anomus/AnomusHylkaysPopup';
import PropertySingleton from '../../../globals/PropertySingleton';
import { Localisations, L10n } from '../../../types/localisation.type';
import { Locale } from '../../../types/locale.type';
import { HaettuKayttooikeusryhma } from '../../../types/domain/kayttooikeus/HaettuKayttooikeusryhma.types';
import { OmattiedotState } from '../../../reducers/omattiedot.reducer';
import { AnojaKayttooikeusryhmat } from '../../anomus/AnojaKayttooikeusryhmat';
import { MyonnettyKayttooikeusryhma } from '../../../types/domain/kayttooikeus/kayttooikeusryhma.types';
import { localize, localizeTextGroup } from '../../../utilities/localisation.util';
import './HenkiloViewOpenKayttooikeusanomus.css';
import { TableCellProps, TableHeading } from '../../../types/react-table.types';
import { KAYTTOOIKEUDENTILA } from '../../../globals/KayttooikeudenTila';
import { KayttooikeusAnomus, KayttooikeusRyhmaState } from '../../../reducers/kayttooikeusryhma.reducer';
import { OrganisaatioCache } from '../../../reducers/organisaatio.reducer';
import AccessRightDetails, { AccessRight, AccessRightDetaisLink } from './AccessRightDetails';
import { HenkilonNimi } from '../../../types/domain/kayttooikeus/HenkilonNimi';
import { RootState } from '../../../store';
import {
    fetchAllKayttooikeusAnomusForHenkilo,
    updateHaettuKayttooikeusryhma,
} from '../../../actions/kayttooikeusryhma.actions';

export type KayttooikeusryhmaData = {
    voimassaPvm: string;
    organisaatioNimi: string;
    kayttooikeusryhmaNimi: string;
};

export type AnojaKayttooikeusryhmaData = {
    anojaOid: string;
    kayttooikeudet: Array<KayttooikeusryhmaData>;
    error: boolean;
};

type State = {
    dates: Array<{ alkupvm: Moment; loppupvm: Moment }>;
    kayttooikeusRyhmatByAnoja: Array<AnojaKayttooikeusryhmaData>;
    showHylkaysPopup: boolean;
    disabledHylkaaButtons: {
        [key: number]: boolean;
    };
    disabledMyonnettyButtons: {
        [key: number]: boolean;
    };
    accessRight: AccessRight | null;
};

type OwnProps = {
    isOmattiedot: boolean;
    isAnomusView?: boolean;
    manualSortSettings?: {
        manual: boolean;
        defaultSorted: Array<any>;
        onFetchData: (arg0: any) => void;
    };
    fetchMoreSettings?: {
        fetchMoreAction?: () => void;
        isActive?: boolean;
    };
    tableLoading?: boolean;
    striped?: boolean;
    piilotaOtsikko?: boolean;
    kayttooikeus: KayttooikeusRyhmaState;
    updateHaettuKayttooikeusryhmaAlt?: (
        arg0: number,
        arg1: string,
        arg2: string,
        arg3: string,
        arg4: HenkilonNimi,
        arg5: string
    ) => void;
};

type StateProps = {
    l10n: L10n;
    locale: Locale;
    omattiedot: OmattiedotState;
    organisaatioCache: OrganisaatioCache;
};

type DispatchProps = {
    updateHaettuKayttooikeusryhma: (
        arg0: number,
        arg1: string,
        arg2: string,
        arg3: string,
        arg4: HenkilonNimi,
        arg5: string
    ) => void;
    fetchAllKayttooikeusAnomusForHenkilo: (arg0: string) => void;
};

type Props = OwnProps & StateProps & DispatchProps;

class HenkiloViewOpenKayttooikeusanomus extends React.Component<Props, State> {
    L: Localisations;
    headingList: Array<TableHeading>;
    tableHeadings: Array<TableHeading>;
    _rows: Array<any>;

    constructor(props: Props) {
        super(props);
        this.L = this.props.l10n[this.props.locale];
        this.headingList = [
            { key: 'ANOTTU_PVM', Cell: (cellProps) => cellProps.value.format() },
            {
                key: 'HENKILO_KAYTTOOIKEUS_NIMI',
                hide: !this.props.isAnomusView,
                notSortable: this.props.isAnomusView,
            },
            {
                key: 'HENKILO_KAYTTOOIKEUS_ORGANISAATIO',
                minWidth: 220,
                notSortable: this.props.isAnomusView,
            },
            {
                key: 'HENKILO_KAYTTOOIKEUSANOMUS_ANOTTU_RYHMA',
                minWidth: 220,
                notSortable: this.props.isAnomusView,
                Cell: (cellProps: TableCellProps) => (
                    <AccessRightDetaisLink
                        cellProps={cellProps}
                        clickHandler={(kayttooikeusRyhma) => this.showAccessRightGroupDetails(kayttooikeusRyhma)}
                    />
                ),
            },
            {
                key: 'HENKILO_KAYTTOOIKEUSANOMUS_PERUSTELU',
                minWidth: 70,
                notSortable: true,
            },
            {
                key: 'HENKILO_KAYTTOOIKEUS_ALKUPVM',
                notSortable: this.props.isAnomusView,
                Cell: (cellProps) => cellProps.value.format(),
            },
            {
                key: 'HENKILO_KAYTTOOIKEUS_LOPPUPVM',
                localizationKey: 'HENKILO_KAYTTOOIKEUS_LOPPUPVM',
                hide: !this.props.isOmattiedot,
                notSortable: this.props.isAnomusView,
                Cell: (cellProps) => cellProps.value.format(),
            },
            {
                key: 'HENKILO_KAYTTOOIKEUS_LOPPUPVM_MYONTO',
                localizationKey: 'HENKILO_KAYTTOOIKEUS_LOPPUPVM',
                hide: this.props.isOmattiedot,
                notSortable: true,
            },
            {
                key: 'HENKILO_KAYTTOOIKEUSANOMUS_TYYPPI',
                minWidth: 50,
                notSortable: this.props.isAnomusView,
            },
            { key: 'EMPTY_PLACEHOLDER', minWidth: 165, notSortable: true },
        ];

        this.tableHeadings = this.headingList.map((heading) => ({
            ...heading,
            label: this.L[heading.localizationKey ? heading.localizationKey : heading.key],
        }));

        this.state = {
            dates: this._getKayttooikeusAnomukset(this.props).map(() => ({
                alkupvm: moment(),
                loppupvm: moment().add(1, 'years'),
            })),
            kayttooikeusRyhmatByAnoja: [],
            showHylkaysPopup: false,
            disabledHylkaaButtons: {},
            disabledMyonnettyButtons: {},
            accessRight: null,
        };
    }

    _getKayttooikeusAnomukset = (props: Props): Array<KayttooikeusAnomus> => {
        return props.kayttooikeus?.kayttooikeusAnomus ? props.kayttooikeus.kayttooikeusAnomus : [];
    };

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            dates: this._getKayttooikeusAnomukset(nextProps).map(() => ({
                alkupvm: moment(),
                loppupvm: moment().add(1, 'years'),
            })),
        });
    }

    loppupvmAction(value: Date, idx: number) {
        const dates = [...this.state.dates];
        dates[idx].loppupvm = moment(value);
        this.setState({
            dates: dates,
        });
    }

    createRows() {
        const headingList = this.headingList.map((heading) => heading.key);
        this._rows = this._getKayttooikeusAnomukset(this.props).map(
            (haettuKayttooikeusRyhma: KayttooikeusAnomus, idx: number) => ({
                kayttooikeusRyhma: haettuKayttooikeusRyhma.kayttoOikeusRyhma,
                [headingList[0]]: moment(haettuKayttooikeusRyhma.anomus.anottuPvm),
                [headingList[1]]:
                    haettuKayttooikeusRyhma.anomus.henkilo.etunimet +
                    ' ' +
                    haettuKayttooikeusRyhma.anomus.henkilo.sukunimi,
                [headingList[2]]:
                    toLocalizedText(
                        this.props.locale,
                        this.props.organisaatioCache[haettuKayttooikeusRyhma.anomus.organisaatioOid].nimi
                    ) +
                    ' ' +
                    StaticUtils.getOrganisaatiotyypitFlat(
                        this.props.organisaatioCache[haettuKayttooikeusRyhma.anomus.organisaatioOid].tyypit,
                        this.L
                    ),
                [headingList[3]]: toLocalizedText(
                    this.props.locale,
                    haettuKayttooikeusRyhma.kayttoOikeusRyhma.nimi,
                    haettuKayttooikeusRyhma.kayttoOikeusRyhma.tunniste
                ),
                [headingList[4]]: this.createSelitePopupButton(haettuKayttooikeusRyhma.anomus.perustelut),
                [headingList[5]]: this.state.dates[idx].alkupvm,
                [headingList[6]]: this.state.dates[idx].loppupvm,
                [headingList[7]]: (
                    <DatePicker
                        className="oph-input"
                        onChange={(value) => this.loppupvmAction(value, idx)}
                        selected={this.state.dates[idx].loppupvm.toDate()}
                        showYearDropdown
                        showWeekNumbers
                        disabled={this.hasNoPermission(
                            haettuKayttooikeusRyhma.anomus.organisaatioOid,
                            haettuKayttooikeusRyhma.kayttoOikeusRyhma.id
                        )}
                        filterDate={(date) => moment(date).isBefore(moment().add(1, 'years'))}
                        dateFormat={PropertySingleton.getState().PVM_DATEPICKER_FORMAATTI}
                    />
                ),
                [headingList[8]]: this.L[haettuKayttooikeusRyhma.anomus.anomusTyyppi],
                [headingList[9]]: this.props.isOmattiedot
                    ? this.anomusHandlingButtonsForOmattiedot(haettuKayttooikeusRyhma)
                    : this.anomusHandlingButtonsForHenkilo(haettuKayttooikeusRyhma, idx),
            })
        );
    }

    createSelitePopupButton(perustelut: string) {
        return (
            <PopupButton
                popupClass={'oph-popup-default oph-popup-bottom'}
                popupButtonWrapperPositioning={'absolute'}
                popupArrowStyles={{ marginLeft: '10px' }}
                popupButtonClasses={'oph-button oph-button-ghost'}
                popupStyle={{
                    left: '-20px',
                    width: '20rem',
                    padding: '30px',
                    position: 'absolute',
                }}
                simple={true}
                disabled={!perustelut}
                popupContent={<p>{perustelut}</p>}
            >
                {this.L['AVAA']}
            </PopupButton>
        );
    }

    anomusHandlingButtonsForOmattiedot(haettuKayttooikeusRyhma: KayttooikeusAnomus) {
        return (
            <div>
                <div style={{ display: 'table-cell', paddingRight: '10px' }}>
                    <Button action={this.cancelAnomus.bind(this, haettuKayttooikeusRyhma)}>
                        {this.L['HENKILO_KAYTTOOIKEUSANOMUS_PERU']}
                    </Button>
                </div>
            </div>
        );
    }

    anomusHandlingButtonsForHenkilo(haettuKayttooikeusRyhma: KayttooikeusAnomus, idx: number) {
        const noPermission = this.hasNoPermission(
            haettuKayttooikeusRyhma.anomus.organisaatioOid,
            haettuKayttooikeusRyhma.kayttoOikeusRyhma.id
        );
        const henkilo = haettuKayttooikeusRyhma.anomus.henkilo;

        return (
            <div>
                <div className="anomuslistaus-myonnabutton" style={{ display: 'table-cell', paddingRight: '10px' }}>
                    <MyonnaButton
                        myonnaAction={() =>
                            this.updateHaettuKayttooikeusryhma(
                                haettuKayttooikeusRyhma.id,
                                KAYTTOOIKEUDENTILA.MYONNETTY,
                                idx,
                                henkilo
                            )
                        }
                        L={this.L}
                        disabled={noPermission || this.state.disabledMyonnettyButtons[haettuKayttooikeusRyhma.id]}
                    />
                </div>
                <div style={{ display: 'table-cell' }}>
                    <PopupButton
                        popupClass={'oph-popup-default oph-popup-bottom'}
                        popupTitle={
                            <span className="oph-h3 oph-strong">
                                {this.L['HENKILO_KAYTTOOIKEUSANOMUS_HYLKAA_HAKEMUS']}
                            </span>
                        }
                        popupArrowStyles={{ marginLeft: '230px' }}
                        popupButtonClasses={'oph-button oph-button-cancel oph-button-small'}
                        popupStyle={{
                            right: '0px',
                            width: '20rem',
                            padding: '30px',
                            position: 'absolute',
                        }}
                        toggle={this.state.showHylkaysPopup}
                        disabled={noPermission || this.state.disabledHylkaaButtons[haettuKayttooikeusRyhma.id]}
                        popupContent={
                            <AnomusHylkaysPopup
                                L={this.L}
                                kayttooikeusryhmaId={haettuKayttooikeusRyhma.id}
                                index={idx}
                                henkilo={henkilo}
                                action={this.updateHaettuKayttooikeusryhma}
                            ></AnomusHylkaysPopup>
                        }
                    >
                        {this.L['HENKILO_KAYTTOOIKEUSANOMUS_HYLKAA']}
                    </PopupButton>
                </div>
            </div>
        );
    }

    updateHaettuKayttooikeusryhma = (
        id: number,
        tila: string,
        idx: number,
        henkilo: HenkilonNimi,
        hylkaysperuste?: string
    ) => {
        const dates = this.state.dates[idx];
        const alkupvm: string = dates.alkupvm.format(PropertySingleton.state.PVM_DBFORMAATTI);
        const loppupvm: string = dates.loppupvm.format(PropertySingleton.state.PVM_DBFORMAATTI);
        if (this.props.updateHaettuKayttooikeusryhmaAlt) {
            this.props.updateHaettuKayttooikeusryhmaAlt(id, tila, alkupvm, loppupvm, henkilo, hylkaysperuste || '');
        } else if (this.props.updateHaettuKayttooikeusryhma) {
            this.props.updateHaettuKayttooikeusryhma(id, tila, alkupvm, loppupvm, henkilo, hylkaysperuste || '');
        }
        const disabledMyonnettyButtons = {
            ...this.state.disabledMyonnettyButtons,
        };
        const disabledHylkaaButtons = { ...this.state.disabledHylkaaButtons };
        if (tila === KAYTTOOIKEUDENTILA.MYONNETTY) {
            disabledMyonnettyButtons[id] = true;
        }
        if (tila === KAYTTOOIKEUDENTILA.HYLATTY) {
            disabledHylkaaButtons[id] = true;
        }
        this.setState({
            showHylkaysPopup: false,
            disabledMyonnettyButtons,
            disabledHylkaaButtons,
        });
    };

    async cancelAnomus(haettuKayttooikeusRyhma: HaettuKayttooikeusryhma) {
        const url = urls.url('kayttooikeus-service.omattiedot.anomus.muokkaus');
        await http.put(url, haettuKayttooikeusRyhma.id);
        if (this.props.fetchAllKayttooikeusAnomusForHenkilo && this.props.omattiedot) {
            this.props.fetchAllKayttooikeusAnomusForHenkilo(this.props.omattiedot.data.oid);
        }
    }

    // If grantableKayttooikeus not loaded allow all. Otherwise require it to be in list.
    hasNoPermission(organisaatioOid: string, kayttooikeusryhmaId: number) {
        return (
            !this.props.kayttooikeus.grantableKayttooikeusLoading &&
            !(
                this.props.kayttooikeus.grantableKayttooikeus[organisaatioOid] &&
                this.props.kayttooikeus.grantableKayttooikeus[organisaatioOid].includes(kayttooikeusryhmaId)
            )
        );
    }

    fetchKayttooikeusryhmatByAnoja(row: any): React.ReactNode {
        const anojaOid: string = this._getAnojaOidByRowIndex(row.index);

        if (!this._hasAnojaKayttooikeusData(anojaOid)) {
            this._parseAnojaKayttooikeusryhmat(anojaOid);
        }

        return <AnojaKayttooikeusryhmat data={this._findAnojaKayttooikeusData(anojaOid)} />;
    }

    _getAnojaOidByRowIndex = (index: number): string => {
        return this.props.kayttooikeus.kayttooikeusAnomus[index].anomus.henkilo.oid;
    };

    _parseAnojaKayttooikeusryhmat(anojaOid: string): void {
        const url = urls.url('kayttooikeus-service.kayttooikeusryhma.henkilo.oid', anojaOid);
        http.get<MyonnettyKayttooikeusryhma[]>(url)
            .then((myonnettyKayttooikeusryhmat: MyonnettyKayttooikeusryhma[]) => {
                const kayttooikeudet: KayttooikeusryhmaData[] = myonnettyKayttooikeusryhmat
                    .filter(
                        (myonnettyKayttooikeusryhma) => myonnettyKayttooikeusryhma.tila !== KAYTTOOIKEUDENTILA.ANOTTU
                    )
                    .map(this._parseAnojaKayttooikeus);
                const anojaKayttooikeusryhmat = {
                    anojaOid,
                    kayttooikeudet: kayttooikeudet,
                    error: false,
                };
                const kayttooikeusRyhmatByAnoja = this.state.kayttooikeusRyhmatByAnoja;
                kayttooikeusRyhmatByAnoja.push(anojaKayttooikeusryhmat);
                this.setState({
                    kayttooikeusRyhmatByAnoja: kayttooikeusRyhmatByAnoja,
                });
            })
            .catch(() => {
                const anojaKayttooikeusryhmat = {
                    anojaOid,
                    kayttooikeudet: [],
                    error: true,
                };
                const kayttooikeusRyhmatByAnoja = this.state.kayttooikeusRyhmatByAnoja;
                kayttooikeusRyhmatByAnoja.push(anojaKayttooikeusryhmat);
                this.setState({
                    kayttooikeusRyhmatByAnoja: kayttooikeusRyhmatByAnoja,
                });
                console.error(`Anojan ${anojaOid} käyttöoikeuksien hakeminen epäonnistui`);
            });
    }

    _parseAnojaKayttooikeus = (myonnettyKayttooikeusryhma: MyonnettyKayttooikeusryhma): KayttooikeusryhmaData => {
        const kayttooikeusryhmaNimiTexts =
            myonnettyKayttooikeusryhma.ryhmaNames && myonnettyKayttooikeusryhma.ryhmaNames.texts;
        const kayttooikeusryhmaNimi = kayttooikeusryhmaNimiTexts
            ? localizeTextGroup(kayttooikeusryhmaNimiTexts, this.props.locale) || ''
            : '';
        const organisaatioNimi = this._parseOrganisaatioNimi(myonnettyKayttooikeusryhma);
        return {
            voimassaPvm: this._parseVoimassaPvm(myonnettyKayttooikeusryhma),
            organisaatioNimi: organisaatioNimi,
            kayttooikeusryhmaNimi: kayttooikeusryhmaNimi,
        };
    };

    _parseOrganisaatioNimi = (myonnettyKayttooikeusryhma: MyonnettyKayttooikeusryhma): string => {
        const organisaatio = this.props.organisaatioCache[myonnettyKayttooikeusryhma.organisaatioOid];
        return organisaatio && organisaatio.nimi
            ? organisaatio.nimi[this.props.locale] ||
                  organisaatio.nimi['fi'] ||
                  organisaatio.nimi['en'] ||
                  organisaatio.nimi['sv'] ||
                  organisaatio.oid
            : localize('HENKILO_AVOIMET_KAYTTOOIKEUDET_ORGANISAATIOTA_EI_LOYDY', this.props.l10n, this.props.locale);
    };

    _parseVoimassaPvm = (myonnettyKayttooikeusryhma: MyonnettyKayttooikeusryhma): string => {
        const noLoppupvm = localize('HENKILO_AVOIMET_KAYTTOOIKEUDET_EI_LOPPUPVM', this.props.l10n, this.props.locale);
        if (!myonnettyKayttooikeusryhma.voimassaPvm) {
            return noLoppupvm;
        } else if (myonnettyKayttooikeusryhma.tila !== KAYTTOOIKEUDENTILA.SULJETTU) {
            return myonnettyKayttooikeusryhma.voimassaPvm
                ? moment(new Date(myonnettyKayttooikeusryhma.voimassaPvm)).format()
                : noLoppupvm;
        }
        return new Date(myonnettyKayttooikeusryhma.kasitelty).toString();
    };

    _hasAnojaKayttooikeusData = (anojaOid: string): boolean => {
        return this.state.kayttooikeusRyhmatByAnoja.some(
            (anojaKayttooikeusryhmaData: AnojaKayttooikeusryhmaData) => anojaKayttooikeusryhmaData.anojaOid === anojaOid
        );
    };

    _findAnojaKayttooikeusData = (anojaOid: string): AnojaKayttooikeusryhmaData | undefined => {
        return this.state.kayttooikeusRyhmatByAnoja.find((ryhma) => ryhma.anojaOid === anojaOid);
    };

    showAccessRightGroupDetails(kayttooikeusRyhma) {
        const accessRight: AccessRight = {
            name: localizeTextGroup(kayttooikeusRyhma.nimi.texts, this.props.locale),
            description: localizeTextGroup(
                [...(kayttooikeusRyhma.kuvaus?.texts || []), ...kayttooikeusRyhma.nimi.texts],
                this.props.locale
            ),
            onClose: () => this.setState(() => ({ accessRight: null })),
        };
        this.setState(() => ({ accessRight }));
    }

    render() {
        this.createRows();
        return (
            <div className="henkiloViewUserContentWrapper">
                {this.state.accessRight && <AccessRightDetails {...this.state.accessRight} />}
                <div>
                    {!this.props.piilotaOtsikko && (
                        <div className="header">
                            <p className="oph-h2 oph-bold">{this.L['HENKILO_AVOIMET_KAYTTOOIKEUDET_OTSIKKO']}</p>
                        </div>
                    )}
                    <div>
                        <Table
                            getTdProps={() => ({ style: { textOverflow: 'unset' } })}
                            headings={this.tableHeadings}
                            data={this._rows}
                            noDataText={this.L['HENKILO_KAYTTOOIKEUS_AVOIN_TYHJA']}
                            {...this.props.manualSortSettings}
                            fetchMoreSettings={this.props.fetchMoreSettings}
                            isLoading={this.props.tableLoading}
                            striped={this.props.striped}
                            subComponent={
                                this.props.isAnomusView ? this.fetchKayttooikeusryhmatByAnoja.bind(this) : undefined
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    l10n: state.l10n.localisations,
    locale: state.locale,
    omattiedot: state.omattiedot,
    organisaatioCache: state.organisaatio.cached,
});

export default connect<StateProps, DispatchProps, OwnProps, RootState>(mapStateToProps, {
    updateHaettuKayttooikeusryhma,
    fetchAllKayttooikeusAnomusForHenkilo,
})(HenkiloViewOpenKayttooikeusanomus);
