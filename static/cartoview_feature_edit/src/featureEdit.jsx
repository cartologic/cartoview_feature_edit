import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/action/view-list';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
// import FeatureTable from '@boundlessgeo/sdk/components/FeatureTable';
import FeatureTable from './components/FeatureTable';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel';
import Select from '@boundlessgeo/sdk/components/Select';
import Rotate from '@boundlessgeo/sdk/components/Rotate';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import './map'
import { IntlProvider } from 'react-intl';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import Header from '@boundlessgeo/sdk/components/Header';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import DrawFeature from '@boundlessgeo/sdk/components/DrawFeature';
import EditPopup from '@boundlessgeo/sdk/components/EditPopup';
import '@boundlessgeo/sdk/dist/css/components.css'
import './app.css';
injectTapEventPlugin( );
class FeatureEdit extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			errors: [],
			errorOpen: false
		};
	}

	componentWillMount( ) {
		this.updateMap( this.props );
	}

	getChildContext( ) {
		switch ( appConfig.themeColor ) {
			case "#607D8B":
				return {

					muiTheme: getMuiTheme( CustomTheme.grey )
				};

				break;
			case "#009688":
				return {

					muiTheme: getMuiTheme( CustomTheme.teal )
				};
				break;
			case "#3f51B5":
				return {

					muiTheme: getMuiTheme( CustomTheme.indigo )
				};
				break;

			default:
				return {
					muiTheme: getMuiTheme( CustomTheme.blue )
				};
		}
	}

	componentWillReceiveProps( props ) {
		this.updateMap( props );
	}

	updateMap( props ) {
		if ( props.config ) {
			var tileServices = [ ];
			var errors = [ ];
			var filteredErrors = [ ];
			if ( props.zoomToLayer && props.config.map.layers[props.config.map.layers.length - 1].bbox ) {
				this._extent = props.config.map.layers[props.config.map.layers.length - 1].bbox;
			}
			MapConfigService.load( MapConfigTransformService.transform( props.config, errors, tileServices ), map, this.props.proxy );
			for ( var i = 0, ii = errors.length; i < ii; ++i ) {
				if ( errors[i].layer.type !== 'OpenLayers.Layer' && errors[i].msg !== 'Unable to load layer undefined' ) {
					if ( window.console && window.console.warn ) {
						window.console.warn(errors[i]);
					}
					filteredErrors.push(errors[i]);
				}
			}
			this.setState({ errors: filteredErrors, errorOpen: true, tileServices: tileServices });
		}
	}

	_handleRequestClose( ) {
		this.setState({ errorOpen: false });
	}

	_handleRequestCloseModal( ) {
		this.setState({ addLayerModalOpen: false });
	}
	_handleBaseMapCloseModal( ) {
		this.setState({ baseMapModalOpen: false });
	}

	componentDidMount( ) {}

	_toggle( el ) {
		if ( el.style.display === 'block' ) {
			el.style.display = 'none';
		} else {
			el.style.display = 'block';
		}
	}
	_toggleFeatureTable( ) {
		this._toggle(document.getElementById( 'table' ));
	}
	render( ) {
		const actions = [< RaisedButton label = "Cancel" primary = {
				true
			}
			onTouchTap = {
				this.handleInfoClose
			} />]
		var error;
		if ( this.state.errors.length > 0 ) {
			var msg = '';
			for ( var i = 0, ii = this.state.errors.length; i < ii; i++ ) {
				msg += this.state.errors[i].msg + '. ';
			}
			error = ( <Snackbar
				autoHideDuration={10000}
				open={this.state.errorOpen}
				message={msg}
				onRequestClose={this._handleRequestClose.bind( this )}/> );
		}
		const north = appConfig.showNorth
			? <div id="rotate-button">
					<Rotate autoHide={true} map={map}></Rotate>
				</div>
			: "";
		const layerSwitcher = appConfig.showLayerSwitcher
			? <LayerList
					allowFiltering={true}
					showOpacity={true}
					allowStyling={true}
					downloadFormat={'GPX'}
					showDownload={true}
					showGroupContent={true}
					showZoomTo={true}
					allowLabeling={true}
					allowEditing={true}
					allowReordering={true}
					handleResolutionChange={true}
					tooltipPosition={'bottom-left'}
					collapsible={true}
					includeLegend={appConfig.showLegend}
					map={map}/>
			: '';

		const load = appConfig.showLoadingPanel
			? <LoadingPanel map={map}></LoadingPanel>
			: "";
		const zoomControls = appConfig.showZoomControls
			? <div id='zoom-buttons'>
					<Zoom map={map}></Zoom>
				</div>
			: "";
		const tableBtn = <div id='table_btn'>
			<FloatingActionButton
				mini={true}
				onTouchTap={this._toggleFeatureTable.bind( this )}>
				<ContentAdd/>
			</FloatingActionButton>
		</div>
		const selection = <Select toggleGroup='nav' map={map}/>
		const navigation = <Navigation secondary={true} toggleGroup='nav' toolId='nav'/>
		const appToolbar = <Header showLeftIcon={false} title={appConfig.layer.split( ":" )[ 1 ]}>
			{navigation}
			{selection}
			<DrawFeature toggleGroup='nav' map={map}/>
		</Header>;
		return (
			<div id='content'>
				{error}
				<MapPanel id='map' map={map}>
					{appToolbar}
					{load}
					<div
						style={{
						display: 'block',
						position: 'fixed',
						zIndex: 100,
						top: 100,
						right: 20
					}}>
						{layerSwitcher}
						{north}
						{tableBtn}
						{zoomControls}
					</div>
					<div id="table" className="FTable">
						<FeatureTable refreshRate={100} ref='table' map={map}/>
					</div>
				</MapPanel>
				<div id='popup' className='ol-popup'>
					<EditPopup toggleGroup='nav' map={map}/>
				</div>
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
