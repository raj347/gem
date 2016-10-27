import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../../service/DataOperation';
import { ErrorModal } from '../../others/ErrorModal';
import { JsonImport } from './JsonImport';

export class ImportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {
        title: null,
        message: null
      }
    };
    this.settingsObj = null;
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUpdate(jsonInput, selectedType, importType='data') {
    this.settingsObj = {
      analysis: jsonInput
    };
    this.closeError = this.closeError.bind(this);
  }
  handleSubmit() {
    console.log(this.settingsObj);
    dataOperation.ocIndex('_close').done((res) => {
      dataOperation.updateSettings(this.settingsObj).done((res) => {
        dataOperation.ocIndex('_open').done((res) => {
          this.props.getMapping();
          this.props.close();
        }).fail((res) => {
          this.errorShow();
        });    
      }).fail((res) => {
        this.errorShow();
      }); 
    }).fail((res) => {
      this.errorShow();
    });
  }
  errorShow() {
    let error = this.state.error;
    error.title = 'Error';
    error.message = res.responseText;
    this.setState({
      error: error
    });
  }
  closeError() {
    let error = this.state.error;
    error.title = null;
    error.message = null;
    this.setState({
      error: error
    });
  }
  render() {
    return (<div className="row" id="ImportContainer">
      <JsonImport 
        mappings={this.props.mappings} 
        handleUpdate={this.handleUpdate} 
        handleSubmit={this.handleSubmit} 
        />
      <ErrorModal {...this.state.error} closeError={this.closeError} />
    </div>);
  }
}