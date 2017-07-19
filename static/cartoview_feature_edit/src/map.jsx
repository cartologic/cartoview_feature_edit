import ol from 'openlayers';
let map = new ol.Map({
    controls: [new ol.control.Attribution({collapsible: false})],
    layers: [
        new ol.layer.Tile({title: 'OSM Streets', type: 'base', source: new ol.source.OSM()})
    ],
    view: new ol.View({
        center: [0, 0], zoom: 3, minZoom: 3, maxZoom: 19
    })
});
global.map = map;
