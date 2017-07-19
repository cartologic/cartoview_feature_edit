/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import classNames from 'classnames';
import AppDispatcher from '@boundlessgeo/sdk/dispatchers/AppDispatcher';
import WFSService from '@boundlessgeo/sdk/services/WFSService';
import debounce from 'debounce';
import ReactTable from 'react-table'
import Button from '@boundlessgeo/sdk/components/Button';
import ToolActions from '@boundlessgeo/sdk/actions/ToolActions';
import DrawIcon from 'material-ui/svg-icons/content/create';
import FileAttachment from 'material-ui/svg-icons/file/attachment';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FeatureStore from '@boundlessgeo/sdk/stores/FeatureStore';
import SelectActions from '@boundlessgeo/sdk/actions/SelectActions';
import LayerSelector from '@boundlessgeo/sdk/components/LayerSelector';
import {Toolbar} from 'material-ui/Toolbar';
import {ToolbarGroup} from 'material-ui/Toolbar';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Snackbar from 'material-ui/Snackbar';
import FilterService from '@boundlessgeo/sdk/services/FilterService';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ToolUtil from '@boundlessgeo/sdk/toolutil';
import FilterHelp from '@boundlessgeo/sdk/components/FilterHelp';
import LayerStore from '@boundlessgeo/sdk/stores/LayerStore';
import '@boundlessgeo/sdk/components/react-table.css';
import '@boundlessgeo/sdk/components/FeatureTable.css';

const messages = defineMessages({
  optionslabel: {
    id: 'featuretable.optionslabel',
    description: 'Label for the collapsble options',
    defaultMessage: 'Options'
  },
  errormsg: {
    id: 'featuretable.errormsg',
    description: 'Error message to show when filtering fails',
    defaultMessage: 'There was an error filtering your features. ({msg})'
  },
  loaderrormsg: {
    id: 'featuretable.loaderrormsg',
    description: 'Error message to show when loading fails',
    defaultMessage: 'There was an error loading your features. ({msg})'
  },
  layerlabel: {
    id: 'featuretable.layerlabel',
    description: 'Label for the layer select',
    defaultMessage: 'Layer'
  },
  zoombuttontitle: {
    id: 'featuretable.zoombuttontitle',
    description: 'Title for the zoom button',
    defaultMessage: 'Zoom to selected'
  },
  zoombuttontext: {
    id: 'featuretable.zoombuttontext',
    description: 'Text for the zoom button',
    defaultMessage: 'Zoom'
  },
  clearbuttontitle: {
    id: 'featuretable.clearbuttontitle',
    description: 'Title for the clear button',
    defaultMessage: 'Clear selected'
  },
  clearbuttontext: {
    id: 'featuretable.clearbuttontext',
    description: 'Text for the clear button',
    defaultMessage: 'Clear'
  },
  onlyselected: {
    id: 'featuretable.onlyselected',
    description: 'Label for the show selected features only checkbox',
    defaultMessage: 'Only show selected'
  },
  filterplaceholder: {
    id: 'featuretable.filterplaceholder',
    description: 'Placeholder for filter expression input field',
    defaultMessage: 'Type filter expression'
  },
  filterhelptext: {
    id: 'featuretable.filterhelptext',
    description: 'filter help text',
    defaultMessage: 'ATTRIBUTE == "Value"'
  },
  filterlabel: {
    id: 'featuretable.filterlabel',
    description: 'Label for the filter expression input field',
    defaultMessage: 'Filter'
  },
  filterbuttontext: {
    id: 'featuretable.filterbuttontext',
    description: 'Text for the filter button',
    defaultMessage: 'Filter results based on your criteria'
  },
  deletemsg: {
    id: 'featuretable.deletemsg',
    description: 'Error message to show when delete fails',
    defaultMessage: 'There was an issue deleting the feature.'
  }
});

/**
 * A table to show features. Allows for selection of features.
 *
 * ```javascript
 * var selectedLayer = map.getLayers().item(2);
 * ```
 *
 * ```xml
 * <FeatureTable ref='table' layer={selectedLayer} map={map} />
 * ```
 *
 * ![Feature Table](../FeatureTable.png)
 */
class FeatureTable extends React.Component {
  static propTypes = {
    /**
     * The toggleGroup to use. When this tool is activated, all other tools in the same toggleGroup will be deactivated.
     */
    toggleGroup: React.PropTypes.string,
    /**
     * Identifier to use for this tool. Can be used to group tools together.
     */
    toolId: React.PropTypes.string,
    /**
     * The ol3 map in which the source for the table resides.
     */
    map: React.PropTypes.instanceOf(ol.Map).isRequired,
    /**
     * The layer to use initially for loading the table.
     */
    layer: React.PropTypes.instanceOf(ol.layer.Layer),
    /**
     * The zoom level to zoom the map to in case of a point geometry.
     */
    pointZoom: React.PropTypes.number,
    /**
     * Refresh rate in ms that determines how often to resize the feature table when the window is resized.
     */
    refreshRate: React.PropTypes.number,
    /**
     * Css class name to apply on the root element of this component.
     */
    className: React.PropTypes.string,
    /**
     * Style config.
     */
    style: React.PropTypes.object,
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Should we allow for sorting the data?
     */
    sortable: React.PropTypes.bool,
    /**
     * Callback that gets called when the height needs updating of the parent container.
     */
    onUpdate: React.PropTypes.func,
    /**
     * Should we allow edit (modify, delete) from the table? Needs an EditPopup component in the application.
     */
    allowEdit: React.PropTypes.bool,
    /**
     * Style for modify interaction.
     */
    modifyStyle: React.PropTypes.object
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object,
    proxy: React.PropTypes.string,
    requestHeaders: React.PropTypes.object
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    allowEdit: true,
    pointZoom: 16,
    sortable: true,
    refreshRate: 250
  };

  constructor(props, context) {
    super(props);
    LayerStore.bindMap(this.props.map);
    this._dispatchToken = ToolUtil.register(this);
    this._proxy = context.proxy;
    this._requestHeaders = context.proxy;
    this._onChange = debounce(this._onChange, 100).bind(this);
    FeatureStore.bindMap(this.props.map, this._proxy);
    this._selectedOnly = false;
    this._pagesLoaded = {};
    this.state = {
      layers: [],
      pages: -1,
      errorOpen: false,
      error: false,
      muiTheme: context.muiTheme || getMuiTheme(),
      features: null,
      selected: null,
      help: false
    };

  }
  componentWillMount() {
    this._onChangeLayersCb = this._onChangeLayers.bind(this);
    LayerStore.addChangeListener(this._onChangeLayersCb);
    FeatureStore.addChangeListener(this._onChange);
    this._onChange();
    this._onChangeLayers();
    this.setDimensionsOnState = debounce(this.setDimensionsOnState, this.props.refreshRate).bind(this);
  }
  componentDidMount() {
    this._element = ReactDOM.findDOMNode(this).parentNode;
    this._formNode = ReactDOM.findDOMNode(this.refs.form);
    this._attachResizeEvent();
    if (this.props.layer) {
      this._setLayer(this.props.layer);
      if (this.props.onUpdate) {
        this.props.onUpdate();
      }
    }
  }
  componentWillUnmount() {
    AppDispatcher.unregister(this._dispatchToken);
    FeatureStore.removeChangeListener(this._onChange);
    LayerStore.removeChangeListener(this._onChangeLayersCb);
    global.removeEventListener('resize', this.setDimensionsOnState);
  }
  activate(interactions) {
    ToolUtil.activate(this, interactions);
  }
  deactivate() {
    ToolUtil.deactivate(this);
  }
  _attachResizeEvent() {
    global.addEventListener('resize', this.setDimensionsOnState);
  }
  setDimensionsOnState() {
    // force a re-render
    this.setState({});
  }
  _setLayer(layer) {
    this._layer = layer;
    if (layer !== null) {
      FeatureStore.addLayer(layer, this._selectedOnly, this._proxy, this._requestHeaders);
      if (!this._layer.get('numberOfFeatures')) {
        this._layer.once('change:numberOfFeatures', function() {
          this.setState({
            pages: Math.ceil(this._layer.get('numberOfFeatures') / this._pageSize)
          });
        }, this);
      }
    }
  }
  _onLayerSelectChange(layer) {
    // TODO add clearing filter back
    //ReactDOM.findDOMNode(this.refs.filter).value = '';
    this._setLayer(layer);
  }
  _onChangeLayers() {
    var flatLayers = LayerStore.getState().flatLayers;
    var layers = [];
    for (var i = 0, ii = flatLayers.length; i < ii; ++i) {
      var lyr = flatLayers[i];
      if (lyr.getVisible() && lyr.get('title') !== null && (lyr instanceof ol.layer.Vector || lyr.get('wfsInfo') !== undefined)) {
        if (!this._layer) {
          this._layer = lyr;
        }
        layers.push(lyr);
      }
    }
    this.setState({layers: layers});
  }
  _onChange() {
    if (this._layer) {
      var state = FeatureStore.getState(this._layer);
      if (!state) {
        delete this._layer;
        return;
      }
      this.setState(state);
    }
  }
  _filter(evt, isInputChecked) {
    this._selectedOnly = isInputChecked;
    this._updateStoreFilter();
  }
  _updateStoreFilter() {
    var lyr = this._layer;
    if (this._selectedOnly === true) {
      FeatureStore.setSelectedAsFilter(lyr);
    } else {
      if (!this._filtered) {
        FeatureStore.restoreOriginalFeatures(lyr);
      } else {
        FeatureStore.setFilter(lyr, this._filteredRows);
      }
    }
  }
  _clearSelected() {
    if (this.state.selected.length > 0) {
      var lyr = this._layer;
      SelectActions.clear(lyr, this._selectedOnly);
    }
  }
  _zoomSelected() {
    var selected = this.state.selected;
    var len = selected.length;
    if (len > 0) {
      var extent = ol.extent.createEmpty();
      for (var i = 0; i < len; ++i) {
        extent = ol.extent.extend(extent, selected[i].getGeometry().getExtent());
      }
      var map = this.props.map;
      if (extent[0] === extent[2]) {
        map.getView().setCenter([extent[0], extent[1]]);
        map.getView().setZoom(this.props.pointZoom);
      } else {
        map.getView().fit(extent, map.getSize());
      }
    }
  }
  _filterByText(evt) {
    const {formatMessage} = this.props.intl;
    var filterBy = evt.target.value;
    var state = FeatureStore.getState(this._layer);
    var rows = this._selectedOnly
      ? state.selected
      : state.features.getFeatures();
    var selected = this._selectedOnly
      ? []
      : state.selected;
    var filteredSelected = [];
    var filteredRows = [];
    var queryFilter;
    if (filterBy !== '') {
      try {
        queryFilter = FilterService.filter(filterBy.replace(/'/g, '"'));
      } catch (e) {
        this.setState({
          errorOpen: true,
          error: true,
          msg: formatMessage(messages.errormsg, {msg: e.message})
        });
        queryFilter = null;
      }
      if (queryFilter !== null) {
        this.setState({errorOpen: false, error: false});
        var i,
          ii,
          properties,
          row;
        for (i = 0, ii = selected.length; i < ii; ++i) {
          row = selected[i];
          properties = row.getProperties();
          if (queryFilter(properties)) {
            filteredSelected.push(row);
          }
        }
        for (i = 0, ii = rows.length; i < ii; ++i) {
          row = rows[i];
          if (row) {
            properties = row.getProperties();
            if (queryFilter(properties)) {
              filteredRows.push(row);
            }
          }
        }
      }
    } else {
      filteredRows = rows;
    }
    this._filtered = (rows.length !== filteredRows.length);
    this._filteredRows = filteredRows;
    FeatureStore.setFilter(this._layer, filteredRows);
    if (filteredSelected.length !== selected.length) {
      // we need to filter the selection as well
      FeatureStore.setSelection(this._layer, filteredSelected, true);
    }
  }
  _handleRequestClose() {
    this.setState({errorOpen: false});
  }
  _onSelect(props) {
    SelectActions.toggleFeature(this._layer, props.row);
  }
  _onTableChange(state, instance) {
    if (!this._layer) {
      return;
    }
    const {formatMessage} = this.props.intl;
    this.setState({loading: true});
    var start = state.page * state.pageSize;
    var clear = false;
    var sortingInfo = state.sorting.length > 0
      ? state.sorting[0]
      : {};
    if (sortingInfo.id !== this._id || sortingInfo.asc !== this._asc) {
      clear = true;
    }
    if (state.sorting.length > 0) {
      this._asc = state.sorting[0].asc;
      this._id = state.sorting[0].id;
    } else {
      delete this._asc;
      delete this._id;
    }
    FeatureStore.loadFeatures(this._layer, start, state.pageSize, state.sorting, function() {
      this.setState({
        page: state.page,
        pageSize: state.pageSize,
        pages: this._layer.get('numberOfFeatures')
          ? Math.ceil(this._layer.get('numberOfFeatures') / state.pageSize)
          : undefined,
        loading: false
      });
    }, function(xmlhttp, msg) {
      this.setState({
        error: true,
        errorOpen: true,
        msg: formatMessage(messages.loaderrormsg, {
          msg: msg || (xmlhttp.status + ' ' + xmlhttp.statusText)
        }),
        loading: false
      });
    }, this, this._proxy, this._requestHeaders, clear);
  }
  _redraw() {
    this._layer.getSource().updateParams({'_olSalt': Math.random()});
  }
  _onEditFeature(feature) {
    if (!this._modifyCollection) {
      this._modifyCollection = new ol.Collection();
    }
    if (!this._modifyLayer) {
      this._modifyLayer = new ol.layer.Vector({
        title: null,
        zIndex: 1000,
        style: this.props.modifyStyle,
        source: new ol.source.Vector({features: this._modifyCollection})
      });
      this.props.map.addLayer(this._modifyLayer);
    }
    this._modifyCollection.clear();
    if (!this._modify) {
      this._modify = new ol.interaction.Modify({features: this._modifyCollection, wrapX: false});
    }
    this.activate(this._modify);
    this._geom = feature.getGeometry().clone();
    this._modifyCollection.push(feature);
    var me = this;
    ToolActions.showEditPopup(feature, this._layer, function(cancel) {
      if (cancel) {
        feature.setGeometry(me._geom);
        delete me._geom;
      }
      me._modifyCollection.clear();
      me.deactivate();
    });
  }
  _onFeatureAttachments(feature) {
    var me = this;
    this.props.handle()

  }
  _onDelete(feature) {
    var me = this;
    const {formatMessage} = this.props.intl;
    if (this._layer.get('wfsInfo')) {
      WFSService.deleteFeature(this._layer, feature, function() {
        FeatureStore.removeFeature(me._layer, feature);
        var source = me._layer.getSource();
        if (source instanceof ol.source.Vector) {
          source.removeFeature(feature);
        } else {
          me._redraw();
        }
      }, function(xmlhttp, msg) {
        msg = msg || formatMessage(messages.deletemsg) + xmlhttp.status + ' ' + xmlhttp.statusText;
        me.setState({errorOpen: true, error: true, msg: msg});
      });
    } else {
      FeatureStore.removeFeature(me._layer, feature);
      me._layer.getSource().removeFeature(feature);
    }
  }
  render() {
    const {formatMessage} = this.props.intl;
    var schema,
      id;
    if (this._layer) {
      schema = FeatureStore.getSchema(this._layer);
      id = this._layer.get('id');
    }
    var error;
    if (this.state.error === true) {
      error = (<Snackbar autoHideDuration={5000} style={{
        transitionProperty: 'none'
      }} bodyStyle={{
        lineHeight: '24px',
        height: 'auto'
      }} open={this.state.errorOpen} message={this.state.msg} onRequestClose={this._handleRequestClose.bind(this)}/>);
    }
    var me = this;
    var sortable = this.props.sortable;
    var columns = [
      {
        id: 'selector',
        header: '',
        width: 40,
        sortable: false,
        render: function(props) {
          var selected = me.state.selected.indexOf(props.row) !== -1;
          return (<Checkbox disableTouchRipple={true} checked={selected} onCheck={me._onSelect.bind(me, props)}/>);
        }
      }
    ];
    if (this.props.allowEdit && (this._layer && this._layer.get('disableEdit') !== true)) {
      columns.push({
        id: 'delete',
        header: '',
        width: 40,
        sortable: false,
        render: function(props) {
          return (<ActionDelete style={{
            cursor: 'pointer'
          }} onTouchTap={me._onDelete.bind(me, props.row)}/>);
        }
      }, {
        id: 'edit',
        header: '',
        width: 40,
        sortable: false,
        render: function(props) {
          return (<DrawIcon style={{
            cursor: 'pointer'
          }} onTouchTap={me._onEditFeature.bind(me, props.row)}/>);
        }
      }, {
        id: 'attachments',
        header: '',
        width: 40,
        sortable: false,
        render: function(props) {
          return (<FileAttachment style={{
            cursor: 'pointer'
          }} onTouchTap={me._onFeatureAttachments.bind(me, props.row)}/>);
        }
      });
    }
    for (var key in schema) {
      if (schema[key] === 'link') {
        columns.push({
          id: key,
          header: key,
          sortable: sortable,
          render: (function(props) {
            return (
              <a href={props.row.get(this)}>{props.row.get(this)}</a>
            );
          }).bind(key)
        });
      } else {
        columns.push({
          id: key,
          header: key,
          sortable: sortable,
          accessor: (function(d) {
            return d.get(this);
          }).bind(key)
        });
      }
    }
    var table;
    var checkToCreateTable = this._element && columns.length > 0 && this.state.features !== null;
    if (checkToCreateTable) {
      if (!this._pageSize && this._formNode && this._element.offsetHeight > 0) {
        var row = document.querySelector('.rt-td');
        var rowHeight = row
          ? row.offsetHeight
          : 42;
        var header = document.querySelector('.rt-th');
        var headerHeight = header
          ? header.offsetHeight
          : 29;
        var footer = document.querySelector('.-pagination');
        var footerHeight = footer
          ? footer.offsetHeight
          : 39;
        this._pageSize = Math.floor((this._element.offsetHeight - this._formNode.offsetHeight - headerHeight - footerHeight) / rowHeight);
      }
      var data;
      if (this._filtered || this._selectedOnly) {
        data = this.state.filter;
      } else {
        if (this._layer instanceof ol.layer.Vector) {
          data = this.state.features.getFeatures();
        } else {
          data = FeatureStore.getFeaturesPerPage(this._layer, this.state.page, this._pageSize);
        }
      }
      table = (<ReactTable ref='table' loading={this.state.loading} pages={this._layer instanceof ol.layer.Vector
        ? undefined
        : this.state.pages} data={data} manual={!(this._layer instanceof ol.layer.Vector)} showPageSizeOptions={false} onChange={(this._layer instanceof ol.layer.Vector)
        ? undefined
        : this._onTableChange.bind(this)} showPageJump={false} pageSize={this._pageSize} columns={columns}/>);
    }
    var style = Object.assign({
      marginLeft: 10,
      marginRight: 10
    }, this.props.style);
    return (
      <Paper zDepth={0} className={classNames('sdk-component featureTable', this.props.className)} style={style}>
        <Toolbar ref='form' className="featureTableToolbar">
          <ToolbarGroup firstChild={true}>
            <LayerSelector {...this.props} id='table-layerSelector' disabled={!this._layer} ref='layerSelector' onChange={this._onLayerSelectChange.bind(this)} layers={this.state.layers} value={id}/>
          </ToolbarGroup>
          <ToolbarGroup>
            <TextField floatingLabelFixed={true} floatingLabelText={formatMessage(messages.filterlabel)} id='featuretable-filter' disabled={!this._layer} ref='filter' onChange={this._filterByText.bind(this)} hintText={formatMessage(messages.filterplaceholder)}/>
            <FilterHelp intl={this.props.intl}/>
            <Button buttonType='Icon' disabled={!this._layer} iconClassName='ms ms-crosshair' tooltip={formatMessage(messages.zoombuttontitle)} onTouchTap={this._zoomSelected.bind(this)}/>
            <IconMenu anchorOrigin={{
              horizontal: 'right',
              vertical: 'top'
            }} targetOrigin={{
              horizontal: 'right',
              vertical: 'top'
            }} iconButtonElement={< Button buttonType = 'Icon' iconClassName = 'fa fa-ellipsis-v' />}>
              <MenuItem primaryText={formatMessage(messages.clearbuttontitle)} disabled={!this._layer} onTouchTap={this._clearSelected.bind(this)}/>
              <MenuItem primaryText={< Toggle label = {
                formatMessage(messages.onlyselected)
              }
              disabled = {
                !this._layer
              }
              defaultToggled = {
                this._selectedOnly
              }
              onToggle = {
                this._filter.bind(this)
              } />}/>
            </IconMenu>
          </ToolbarGroup>
          {error}
        </Toolbar>
        <Paper>
          {table}
        </Paper>
      </Paper>
    );
  }
}

export default injectIntl(FeatureTable, {withRef: true})
