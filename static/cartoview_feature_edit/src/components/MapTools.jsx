import React, {Component} from 'react';
import t from 'tcomb-form';
const mapConfig = t.struct({
  showAddLayerModal: t.Boolean,
  showLoadingPanel: t.Boolean,
  showMeasure: t.Boolean,
  showAttributesTable: t.Boolean
});
const Form = t.form.Form;


export default class MapTools extends Component {
  constructor(props) {
    super(props)
    console.log(this.props);
    this.state = {
      defaultconf: {
        showAddLayerModal: this.props.config
          ? this.props.config.showAddLayerModal
          : true,
        showLoadingPanel: this.props.config
          ? this.props.config.showLoadingPanel
          : true,
        showMeasure: this.props.config
          ? this.props.config.showMeasure
          : true,
        showAttributesTable: this.props.config
          ? this.props.config.showAttributesTable
          : true
      }
    }
  }


  save() {
    var basicConfig = this.refs.form.getValue();
    if (basicConfig) {
      this.props.onComplete(basicConfig)
    }
  }


  render() {
    return (
      <div className="row">
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <h4>{'Map Assistive Tools'}</h4>
          </div>

          <div className="col-xs-4 col-sm-4 col-md-2 col-lg-2">
            <button
              className="btn btn-primary pull-right"
              onClick={() => this.props.onPrevious()}>Previous</button>
          </div>

          <div className="col-xs-4 col-sm-4 col-md-2 col-lg-2">
            <button className="btn btn-primary pull-right" onClick={this.save.bind(this)}>Next</button>
          </div>

        </div>
        <hr></hr>
        <Form ref="form" value={this.state.defaultconf} type={mapConfig}/>
      </div>
    )
  }
}
