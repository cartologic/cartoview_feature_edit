import React, {Component} from 'react';
import t from 'tcomb-form';

// const zoomControls = t.struct({
//   duration: t.Number,
//   ZoomInTip: t.String,
//   delta: t.Number,
//   ZoomOutTip: t.String,
// })
//
// const showZoomControls = t.struct({
//   showZoomControl: t.Boolean,
//   zoomControls: zoomControls
// })

const mapConfig = t.struct({
  showZoomControls: t.Boolean,
  showNorth: t.Boolean,
  showMousePostion: t.Boolean,
  showLayerSwitcher: t.Boolean,
  showHome: t.Boolean,
  showGeoLocation: t.Boolean,
  show3D: t.Boolean,
  showBasemapSwitcher: t.Boolean,
  showLegend: t.Boolean,
});


const options = {
  fields: {
    showGeoLocation: {
      label: "Show Geo Location"
    },
    show3D: {
      label: "Show 3D"
    },
    showZoomControls: {
      label: "Show Zoom Buttons"
    },
    showNorth: {
      label: "Show North Button"
    },
    showMousePostion: {
      label: "Show Mouse Location"
    },
    showLayerSwitcher: {
      label: "Show Layer Switcher Button"
    },
    showHome: {
      label: "Show Initial Extent Button"
    },
    showBasemapSwitcher: {
      label: "Show Base Switcher Button"
    },
    showLegend: {
      label: "Show Layer Legend"
    },
  }
};


const Form = t.form.Form;


export default class BasicConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultConfig: {
        showZoomControls: this.props.config
          ? this.props.config.showZoomControls
          : true,
        showNorth: this.props.config
          ? this.props.config.showNorth
          : true,
        showMousePostion: this.props.config
          ? this.props.config.showMousePostion
          : true,
        showHome: this.props.config
          ? this.props.config.showHome
          : true,
        showGeoLocation: this.props.config
          ? this.props.config.showGeoLocation
          : true,
        show3D: this.props.config
          ? this.props.config.show3D
          : true,
        showGeoCoding: this.props.config
          ? this.props.config.showGeoCoding
          : true,
        showLayerSwitcher: this.props.config
          ? this.props.config.showLayerSwitcher
          : true,
        showBasemapSwitcher: this.props.config
          ? this.props.config.showBasemapSwitcher
          : true,
        showLegend: this.props.config
          ? this.props.config.showLegend
          : true
      }
    }
  }


  save() {
    var basicConfig = this.refs.form.getValue();
    if (basicConfig) {
      const properConfig = {
        config: {
          showZoomControls: basicConfig.showZoomControls,
          showNorth: basicConfig.showNorth,
          showMousePostion: basicConfig.showMousePostion,
          showLayerSwitcher: basicConfig.showLayerSwitcher,
          showHome: basicConfig.showHome,
          showGeoLocation: basicConfig.showGeoLocation,
          show3D: basicConfig.show3D,
          showBasemapSwitcher: basicConfig.showBasemapSwitcher,
          showLegend: basicConfig.showLegend,
        }
      }
      this.props.onComplete(properConfig)
    }
  }






  render() {
    return (
      <div className="row">
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <h4>{'Map Navigation '}</h4>
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

        <Form
          ref="form"
          value={this.state.defaultConfig}
          type={mapConfig}
          options={options} />
      </div>
    )
  }
}
