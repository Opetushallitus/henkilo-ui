import './HenkiloViewContactContent.css'
import React from 'react'
import Columns from 'react-columns'
import Field from '../field/Field';
import Button from "../button/Button";
import Select2 from '../select/Select2';

const HenkiloViewContactContent = React.createClass({
    propTypes: {
        l10n: React.PropTypes.object.isRequired,
        henkilo: React.PropTypes.shape({henkilo: React.PropTypes.object.isRequired,}).isRequired,
        readOnly: React.PropTypes.bool.isRequired,
        locale: React.PropTypes.string.isRequired,
        koodisto: React.PropTypes.shape({yhteystietotyypit: React.PropTypes.array}).isRequired,
        updateHenkiloAndRefetch: React.PropTypes.func.isRequired,
        editButtons: React.PropTypes.func.isRequired,
        creatableYhteystietotyypit: React.PropTypes.func.isRequired,
    },
    getInitialState: function() {
        this.henkiloUpdate = JSON.parse(JSON.stringify(this.props.henkilo.henkilo)); // deep copy
        this.contactInfoTemplate = [
            {label: 'YHTEYSTIETO_SAHKOPOSTI', value: null, inputValue: null},
            {label: 'YHTEYSTIETO_PUHELINNUMERO', value: null, inputValue: null},
            {label: 'YHTEYSTIETO_MATKAPUHELINNUMERO', value: null, inputValue: null},
            {label: 'YHTEYSTIETO_KATUOSOITE', value: null, inputValue: null},
            {label: 'YHTEYSTIETO_POSTINUMERO', value: null, inputValue: null},
            {label: 'YHTEYSTIETO_KUNTA', value: null, inputValue: null},
        ];

        return {
            readOnly: this.props.readOnly,
            showPassive: false,
            contactInfo: this._updateYhteystiedot(this),
        }
    },
    render: function() {
        const L = this.props.l10n[this.props.locale];
        return (
            <div className="henkiloViewUserContentWrapper">
                <Columns columns={1}>
                    <div>
                        <div className="right">
                            { !this.state.readOnly
                                ? <div>
                                    <Select2 data={this.props.creatableYhteystietotyypit().map((yhteystietotyyppi, idx) =>
                                        ({id: yhteystietotyyppi.value, text:yhteystietotyyppi[this.props.locale]}))}
                                             onSelect={this._createYhteystiedotRyhma}
                                             options={{placeholder:L['HENKILO_LUOYHTEYSTIETO']}} />
                                </div>
                                : null
                            }
                        </div>
                        <div className="header">
                            <p className="oph-h2 oph-bold">{L['HENKILO_YHTEYSTIEDOT_OTSIKKO']}</p>
                        </div>
                        <div className="henkiloViewContent">
                            <Columns queries={[{columns: 3, query: 'min-width: 200px'}]} gap="10px" >
                                {this.state.contactInfo.map((yhteystiedotRyhmaFlat, idx) =>
                                        <div key={idx}>
                                            <p className="oph-h3 oph-bold midHeader">{yhteystiedotRyhmaFlat.name}</p>
                                            { yhteystiedotRyhmaFlat.value.map((yhteystietoFlat, idx2) =>
                                                <div key={idx2} id={yhteystietoFlat.label}>
                                                    { (!this.state.readOnly && !yhteystiedotRyhmaFlat.readOnly) || yhteystietoFlat.value
                                                        ? <Columns columns={2} className="labelValue">
                                                            <span className="oph-bold">{L[yhteystietoFlat.label]}</span>
                                                            <Field inputValue={yhteystietoFlat.inputValue} changeAction={this._updateModelField}
                                                                   readOnly={yhteystiedotRyhmaFlat.readOnly || this.state.readOnly}>
                                                                {yhteystietoFlat.value}
                                                            </Field>
                                                        </Columns>
                                                        : null}
                                                </div>
                                            ) }
                                        </div>
                                )}
                            </Columns>
                        </div>
                    </div>
                </Columns>
                {this.state.readOnly
                    ? <div className="henkiloViewButtons">
                        <Button key="contactEdit" big action={this._edit}>{L['MUOKKAA_LINKKI']}</Button>
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
            contactInfo: this.state.contactInfo,
        }
    },
    _discard: function () {
        this.henkiloUpdate = JSON.parse(JSON.stringify(this.props.henkilo.henkilo)); // deep copy
        this.setState({
            readOnly: true,
            contactInfo: this._preEditData.contactInfo,
        });
    },
    _update: function () {
        this.props.updateHenkiloAndRefetch(this.henkiloUpdate);
    },
    _updateModelField: function (event) {
        const value = event.target.value;
        const fieldpath = event.target.name;
        this._updateFieldByDotAnnotation(this.henkiloUpdate, fieldpath, value);
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
    },
    _createYhteystiedotRyhma: function (event) {
        this.henkiloUpdate.yhteystiedotRyhma.push({
            readOnly: false,
            ryhmaAlkuperaTieto: "alkupera2", // Virkailija
            ryhmaKuvaus: event.target.value,
            yhteystieto: []
        });
        const contactInfo = this._updateYhteystiedot(this);
        this.setState({
            contactInfo: contactInfo
        });
    },

    _updateYhteystiedot: _this =>
        _this.henkiloUpdate.yhteystiedotRyhma.map((yhteystiedotRyhma, idx) => {
            const yhteystietoList = yhteystiedotRyhma.yhteystieto;
            const YhteystietoFlatList = {
                value: _this.contactInfoTemplate.map(((template, idx2) => (
                    {label: template.label, value: yhteystietoList.filter(yhteystieto => yhteystieto.yhteystietoTyyppi === template.label)[0]
                    && yhteystietoList.filter(yhteystieto => yhteystieto.yhteystietoTyyppi === template.label)[0].yhteystietoArvo,
                        inputValue: 'yhteystiedotRyhma.' + idx + '.yhteystieto.' + idx2 + '.yhteystietoArvo'}
                ))),
                name: yhteystiedotRyhma.ryhmaKuvaus && _this.props.koodisto.yhteystietotyypit.filter(kieli =>
                kieli.value === yhteystiedotRyhma.ryhmaKuvaus)[0][_this.props.locale],
                readOnly: yhteystiedotRyhma.readOnly,
            };
            yhteystiedotRyhma.yhteystieto = YhteystietoFlatList.value.map(yhteystietoFlat => (
                {
                    yhteystietoTyyppi: yhteystietoFlat.label,
                    yhteystietoArvo: yhteystietoFlat.value,
                }
            ));
            return YhteystietoFlatList;
        }),
});

export default HenkiloViewContactContent
