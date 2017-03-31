import './HenkiloViewUserContent.css'
import React from 'react'
import Columns from 'react-columns'
import dateformat from 'dateformat'
import Field from '../common/field/Field';

const HenkiloViewUserContent = React.createClass({
    propTypes: {
        l10n: React.PropTypes.object.isRequired,
        henkilo: React.PropTypes.shape({
            kayttajatieto: React.PropTypes.object.isRequired,
            henkilo: React.PropTypes.object.isRequired
        }).isRequired,
        readOnly: React.PropTypes.bool.isRequired,
        showPassive: React.PropTypes.bool,
        locale: React.PropTypes.string.isRequired,
        koodisto: React.PropTypes.shape({
            sukupuoli: React.PropTypes.array,
            kieli: React.PropTypes.array,
            kansalaisuus: React.PropTypes.kansalaisuus
        }).isRequired,
        updatePassword: React.PropTypes.func.isRequired,
        passivoiHenkilo: React.PropTypes.func.isRequired,
        yksiloiHenkilo: React.PropTypes.func.isRequired,
        updateHenkiloAndRefetch: React.PropTypes.func.isRequired,

        basicInfo: React.PropTypes.func.isRequired,
        basicInfo2: React.PropTypes.func.isRequired,
        loginInfo: React.PropTypes.func.isRequired,
        readOnlyButtons: React.PropTypes.func.isRequired,
        editButtons: React.PropTypes.func.isRequired,
    },
    getInitialState: function() {
        this.henkiloUpdate = this.props.henkilo.henkilo;
        this.kieliKoodis = this.props.koodisto.kieli;
        this.kansalaisuusKoodis = this.props.koodisto.kansalaisuus;
        this.sukupuoliKoodis = this.props.koodisto.sukupuoli;

        return {
            readOnly: this.props.readOnly,
            showPassive: false,
        }
    },
    render: function() {
        const L = this.props.l10n[this.props.locale];
        return (
            <div className="henkiloViewUserContentWrapper">
                    <div>
                        <div className="header">
                            <h2>{L['HENKILO_PERUSTIEDOT_OTSIKKO']}</h2>
                        </div>
                        <Columns columns={3}>
                            <div className="henkiloViewContent">
                                {this.props.basicInfo().map((values, idx) =>
                                !values.showOnlyOnWrite || !this.state.readOnly
                                    ? <div key={idx} id={values.label}>
                                        <Columns columns={2}>
                                            <span className="strong">{L[values.label]}</span>
                                            <Field inputValue={values.inputValue} changeAction={!values.date ? this._updateModelField : this._updateDateField}
                                                   readOnly={this.state.readOnly} data={values.data}
                                                   selectValue={values.selectValue} autoFocus={values.autoFocus}>
                                                {values.value}
                                            </Field>
                                        </Columns>
                                    </div>
                                    : null
                                )}
                            </div>
                            <div className="henkiloViewContent">
                                {this.props.basicInfo2().map((values, idx) =>
                                !values.showOnlyOnWrite || !this.state.readOnly
                                    ? <div key={idx} id={values.label}>
                                        <Columns columns={2}>
                                            <span className="strong">{L[values.label]}</span>
                                            <Field inputValue={values.inputValue} changeAction={this._updateModelField}
                                                   readOnly={this.state.readOnly} data={values.data}
                                                   selectValue={values.selectValue}>
                                                {values.value}
                                            </Field>
                                        </Columns>
                                    </div>
                                    : null
                                )}
                            </div>
                            <div className="henkiloViewContent">
                                {this.props.loginInfo().map((values, idx) =>
                                !values.showOnlyOnWrite || !this.state.readOnly
                                    ? <div key={idx} id={values.label}>
                                        <Columns columns={2}>
                                            <span className="strong">{L[values.label]}</span>
                                            <Field inputValue={values.inputValue} changeAction={this._updateModelField}
                                                   readOnly={this.state.readOnly} data={values.data}
                                                   selectValue={values.selectValue} password={values.password}>
                                                {values.value}
                                            </Field>
                                        </Columns>
                                    </div>
                                    : null
                                )}
                            </div>
                        </Columns>
                    </div>
                {this.state.readOnly
                    ? <div className="henkiloViewButtons">
                        {this.props.readOnlyButtons(this._edit)}
                    </div>
                    : <div className="henkiloViewEditButtons">
                        {this.props.editButtons(this._discard, this._update)}
                    </div>
                }
            </div>
        )
    },
    _edit: function () {
        this.setState({readOnly: false});
        this._preEditData = {
            basicInfo: Object.assign({}, this.state.basicInfo),
            basicInfo2: Object.assign({}, this.state.basicInfo2),
            henkiloUpdate: JSON.parse(JSON.stringify(this.henkiloUpdate)), // deep copy
        }
    },
    _discard: function () {
        this.henkiloUpdate = this._preEditData.henkiloUpdate;
        this.setState({
            readOnly: true,
        });
    },
    _update: function () {
        this.props.updateHenkiloAndRefetch(this.henkiloUpdate);
        if(this.henkiloUpdate.password && this.henkiloUpdate.password === this.henkiloUpdate.passwordAgain) {
            this.props.updatePassword(this.henkiloUpdate.oidHenkilo, this.henkiloUpdate.password);
            this.henkiloUpdate.password = this.henkiloUpdate.passwordAgain = null;
        }
        if(this._preEditData.henkiloUpdate.kayttajanimi === undefined && this.henkiloUpdate.kayttajanimi !== undefined) {
            this.props.updateKayttajatieto(this.henkiloUpdate.oidHenkilo, this.henkiloUpdate.kayttajanimi);
        }
        this.setState({readOnly: true});
    },
    _updateModelField: function (event) {
        const value = event.target.value;
        const fieldpath = event.target.name;
        this._updateFieldByDotAnnotation(this.henkiloUpdate, fieldpath, value);
    },
    _updateDateField: function(event) {
        const value = event.target.value;
        const fieldpath = event.target.name;
        this._updateFieldByDotAnnotation(this.henkiloUpdate, fieldpath,
            dateformat(new Date(value), this.props.l10n['PVM_DBFORMAATTI']));
    },
    _updateFieldByDotAnnotation: function(obj, path, value) {
        let schema = obj;  // a moving reference to internal objects within obj
        const pList = path.split('.');
        const len = pList.length;
        for(let i = 0; i < len-1; i++) {
            let elem = pList[i];
            if( !schema[elem] ) {
                schema[elem] = {};
            }
            schema = schema[elem];
        }

        schema[pList[len-1]] = value;
    }
});

export default HenkiloViewUserContent
