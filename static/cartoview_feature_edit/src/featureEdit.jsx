import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/RaisedButton';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
// import FeatureTable from '@boundlessgeo/sdk/components/FeatureTable';
import AttachmentDrawer from './components/attachments.jsx'
import FeatureTable from './components/FeatureTable'
import './map'
import {IntlProvider} from 'react-intl';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import Select from '@boundlessgeo/sdk/components/Select';
import Header from '@boundlessgeo/sdk/components/Header';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import DrawFeature from '@boundlessgeo/sdk/components/DrawFeature';
import EditPopup from '@boundlessgeo/sdk/components/EditPopup';
import '@boundlessgeo/sdk/dist/css/components.css'
import './app.css';
injectTapEventPlugin();
class FeatureEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      errorOpen: false,
      openAttachments:false
    };
  }

  componentWillMount() {
    this.updateMap(this.props);
  }

  getChildContext() {
    return {muiTheme: getMuiTheme(CustomTheme)};
  }

  componentWillReceiveProps(props) {
    this.updateMap(props);
  }

  updateMap(props) {
    if (props.config) {
      var tileServices = [];
      var errors = [];
      var filteredErrors = [];
      if (props.zoomToLayer && props.config.map.layers[props.config.map.layers.length - 1].bbox) {
        this._extent = props.config.map.layers[props.config.map.layers.length - 1].bbox;
      }
      MapConfigService.load(MapConfigTransformService.transform(props.config, errors, tileServices), map, this.props.proxy);
      for (var i = 0, ii = errors.length; i < ii; ++i) {
        if (errors[i].layer.type !== 'OpenLayers.Layer' && errors[i].msg !== 'Unable to load layer undefined') {
          if (window.console && window.console.warn) {
            window.console.warn(errors[i]);
          }
          filteredErrors.push(errors[i]);
        }
      }
      this.setState({errors: filteredErrors, errorOpen: true, tileServices: tileServices});
    }
  }

  _handleRequestClose() {
    this.setState({errorOpen: false});
  }

  _handleRequestCloseModal() {
    this.setState({addLayerModalOpen: false});
  }
  _handleBaseMapCloseModal() {
    this.setState({baseMapModalOpen: false});
  }

  componentDidMount() {}

  _toggle(el) {
    if (el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
  handleToggle(){
    let {openAttachments}=this.state
    this.setState({openAttachments:!openAttachments})
  }
  render() {
    const actions = [< RaisedButton label = "Cancel" primary = {
        true
      }
      onTouchTap = {
        this.handleInfoClose
      } />]
    var error;
    if (this.state.errors.length > 0) {
      var msg = '';
      for (var i = 0, ii = this.state.errors.length; i < ii; i++) {
        msg += this.state.errors[i].msg + '. ';
      }
      error = (<Snackbar autoHideDuration={10000} open={this.state.errorOpen} message={msg} onRequestClose={this._handleRequestClose.bind(this)}/>);
    }
    const selection = <Select toggleGroup='navigation' map={map}/>
    const navigation = <Navigation secondary={true} toggleGroup='navigation' toolId='nav'/>
    const appToolbar = <Header showLeftIcon={false} title='Feature Edit'>
      <Navigation toggleGroup='nav' secondary={true}/>
      <DrawFeature toggleGroup='nav' map={map}/>
    </Header>;
    return (
      <div id='content'>
        {error}

        <MapPanel id='map' map={map}>
          <div id='editpopup' className='ol-popup'><EditPopup toggleGroup='nav' map={map}/></div>
          {appToolbar}
          <div className="FTable">
            <FeatureTable handle={this.handleToggle.bind(this)} refreshRate={250} ref='table' map={map}/>
          </div>
        </MapPanel>
        <AttachmentDrawer open={this.state.openAttachments} handle={this.handleToggle.bind(this)} ></AttachmentDrawer>
      </div>
    );
  }
}
FeatureEdit.props = {
  config: PropTypes.object,
  proxy: PropTypes.string,
  mode: PropTypes.string,
  server: PropTypes.string
};
FeatureEdit.childContextTypes = {
  muiTheme: PropTypes.object
};
export default FeatureEdit;
