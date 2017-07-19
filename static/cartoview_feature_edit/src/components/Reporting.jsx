import React, {Component} from 'react';
import t from 'tcomb-form';
const mapConfig = t.struct({
  showInfoPopup: t.Boolean,
  showPrint: t.Boolean,
  showExportImage: t.Boolean,
  showAbout: t.Boolean,
  showGeoCoding: t.Boolean,
});
const Form = t.form.Form;
export default class Reporting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultconf: {
        showInfoPopup: this.props.config
          ? this.props.config.showInfoPopup
          : true,
        showPrint: this.props.config
          ? this.props.config.showPrint
          : true,
        showExportImage: this.props.config
          ? this.props.config.showExportImage
          : true,
        showAbout: this.props.config
          ? this.props.config.showAbout
          : true,
        showGeoCoding: this.props.config
          ? this.props.config.showGeoCoding
          : true,
      }
    }
  }
  componentDidMount() {}
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
            <h4>{'Reporting'}</h4>
          </div>

          <div className="col-xs-4 col-sm-4 col-md-2 col-lg-2">
            <button
              className="btn btn-primary pull-right"
              onClick={() => this.props.onPrevious()}>Previous</button>
          </div>
        </div>
        <hr></hr>
        <Form ref="form" value={this.state.defaultconf} type={mapConfig}/>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <button className="btn btn-primary pull-right" onClick={this.save.bind(this)}>Submit</button>
          </div>
          {this.props.id&&<div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <a className="btn btn-primary" href={this.props.urls.view}>View</a>
          </div>}
      </div>
    )
  }
}
