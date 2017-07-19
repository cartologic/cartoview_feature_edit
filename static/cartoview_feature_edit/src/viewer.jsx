import React from 'react';
import ReactDOM from 'react-dom';
import CartoviewViewerDebug from './FeatureEdit-debug';
import {IntlProvider} from 'react-intl';
class Viewer {
    constructor(domId, config) {
        this.domId = domId;
        this.mapConfig = config;
    }

    set config(value) {
        this.mapConfig = config;
    }

    view() {
        ReactDOM.render(<IntlProvider locale='en'>
            <CartoviewViewerDebug config={this.mapConfig}/>
        </IntlProvider>, document.getElementById(this.domId));
    }
}
module.exports = Viewer;
let viewer = new Viewer('main');
viewer.view();
