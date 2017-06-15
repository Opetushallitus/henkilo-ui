import './HenkiloViewCreateKayttooikeus.css'
import React from 'react'
import moment from 'moment';
import scrollToComponent from 'react-scroll-to-component'
import CKKohde from "./createkayttooikeus/CKKohde";
import CKKesto from "./createkayttooikeus/CKKesto";
import CKKayttooikeudet from "./createkayttooikeus/CKKayttooikeudet";
import CKHaeButton from "./createkayttooikeus/CKHaeButton";

class HenkiloViewCreateKayttooikeus extends React.Component {
    static propTypes = {
        l10n: React.PropTypes.object.isRequired,
        locale: React.PropTypes.string.isRequired,
        henkilo: React.PropTypes.shape({henkiloOrganisaatios: React.PropTypes.array.isRequired,}),
        kayttooikeus: React.PropTypes.shape({allowedKayttooikeus: React.PropTypes.object}),
        existingKayttooikeusRef: React.PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.L = this.props.l10n[this.props.locale];
        this.initialKayttooikeusModel = () => ({
            kayttokohdeOrganisationOid: '',
            myonnettavatOikeudet: [],
            alkupvm: moment(),
            loppupvm: moment().add(1, 'years'),
        });
        this.initialState = {
            selectedList: [],
            validationMessages: [{id: 'organisation', label: 'HENKILO_LISAA_KAYTTOOIKEUDET_ORGANISAATIO_VALID'},
                {id: 'kayttooikeus', label: 'HENKILO_LISAA_KAYTTOOIKEUDET_KAYTTOOIKEUS_VALID'}],
            kayttooikeusData: [],
            kayttooikeusModel: this.initialKayttooikeusModel(),
        };

        this.organisationAction = (value) => {
            this.setState({
                validationMessages: this.state.validationMessages.filter(
                    validationMessage => validationMessage.id !== 'organisation'),
                kayttooikeusModel: {
                    ...this.state.kayttooikeusModel,
                    kayttokohdeOrganisationOid: value.value,
                }

            });
            this.props.fetchAllowedKayttooikeusryhmasForOrganisation(this.props.oidHenkilo, value.value);
        };

        this.kayttooikeudetAction = (value) => {
            if(value.value !== '') {
                this.setState({
                    selectedList: [...this.state.selectedList, value],
                });
            }
            this.setState({
                validationMessages: this.state.validationMessages.filter(
                    validationMessage => validationMessage.id !== 'kayttooikeus'),
            });
        };

        this.close = (kayttooikeusId) => {
            const selectedList = this.state.selectedList.filter(selected => selected.value !== kayttooikeusId);
            const id = 'kayttooikeus';
            const label = 'HENKILO_LISAA_KAYTTOOIKEUDET_KAYTTOOIKEUS_VALID';
            let newState = { selectedList, };
            if(this.state.validationMessages.filter(validationMessage => validationMessage.id === id)[0] === undefined
                && !selectedList.length) {
                newState = Object.assign(newState, { validationMessages: [...this.state.validationMessages, {id, label}],});
            }
            this.setState(newState);
        };

        this.kestoAlkaaAction = (value) => {
            this.setState({
                kayttooikeusModel: {
                    ...this.state.kayttooikeusModel,
                    alkupvm: value,
                }
            });
        };

        this.kestoPaattyyAction = (value) => {
            this.setState({
                kayttooikeusModel: {
                    ...this.state.kayttooikeusModel,
                    loppupvm: value,
                }
            });
        };

        this.createKayttooikeusAction = () => {
            this.props.addKayttooikeusToHenkilo(this.props.oidHenkilo, this.state.kayttooikeusModel.kayttokohdeOrganisationOid,
                this.state.selectedList.map(selected => ({
                    id: selected.value,
                    kayttoOikeudenTila: 'MYONNA',
                    alkupvm: moment(this.state.kayttooikeusModel.alkupvm).format(this.L['PVM_DBFORMAATTI']),
                    loppupvm: moment(this.state.kayttooikeusModel.loppupvm).format(this.L['PVM_DBFORMAATTI']),
                })));
            // clear
            this.setState(this.initialState);
            // Scroll
            scrollToComponent(this.props.existingKayttooikeusRef, {align: 'top'});
        };

        this.state = this.initialState;
    };

    render() {
        return (
            <div className="henkiloViewUserContentWrapper">
                <div className="add-kayttooikeus-container">
                    <div className="header">
                        <p className="oph-h2 oph-bold">{this.L['HENKILO_LISAA_KAYTTOOIKEUDET_OTSIKKO']}</p>
                    </div>
                    <div>
                        <table>
                            <colgroup>
                                <col span={1} style={{width: "30%"}} />
                                <col span={1} style={{width: "60%"}} />
                                <col span={1} style={{width: "10%"}} />
                            </colgroup>
                            <tbody>
                            <CKKohde L={this.L}
                                     locale={this.props.locale}
                                     organisationValue={this.state.kayttooikeusModel.kayttokohdeOrganisationOid}
                                     organisationAction={this.organisationAction}
                                     organisationData={this.props.henkilo.henkiloOrganisaatios} />
                            <CKKesto L={this.L}
                                     alkaaInitValue={this.state.kayttooikeusModel.alkupvm}
                                     paattyyInitValue={this.state.kayttooikeusModel.loppupvm}
                                     alkaaPvmAction={this.kestoAlkaaAction}
                                     paattyyPvmAction={this.kestoPaattyyAction} />
                            <CKKayttooikeudet L={this.L}
                                              locale={this.props.locale}
                                              kayttooikeusData={this.props.kayttooikeus.allowedKayttooikeus[this.props.oidHenkilo]}
                                              selectedList={this.state.selectedList}
                                              close={this.close}
                                              kayttooikeusAction={this.kayttooikeudetAction} />
                            <CKHaeButton L={this.L}
                                         validationMessages={this.state.validationMessages}
                                         haeButtonAction={this.createKayttooikeusAction} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };
}

export default HenkiloViewCreateKayttooikeus;
