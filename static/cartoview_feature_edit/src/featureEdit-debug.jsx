import React from 'react';
import PropTypes from 'prop-types';
import FeatureEdit from './FeatureEdit';

class FeatureEditDebug extends React.Component {
    constructor(props) {
        super(props);
        this.state = {config: this.props.config};
        this.config = JSON.stringify(this.props.config);
        const qry = this.uriVars();

        this.fetchConfigFromUrl(configURL);
        this.configUrl = configURL;

    }

    proxyUrl(url) {
        return url;
        // return ('https://cors-anywhere.herokuapp.com/'+url);
    }

    uriVars(str) {
        let vars = {};
        str = str || window.location.href;
        var hashes = str.slice(str.indexOf('?') + 1).split('&');
        for (var i = 0, len = hashes.length; i < len; i++) {
            var hash = hashes[i].split('=');
            vars[hash[0]] = decodeURIComponent(hash[1]);
        }
        return vars;
    }

    fetchConfigFromUrl(url) {
        fetch(url).then((response) => {
            if (response.status == 200) {
                return response.json();
            }
        }).then((json) => {
            if (json) {
                this.setState({config: json});
            }
        });
    }

    render() {
        return (
            <div>
                <FeatureEdit config={this.state.config} proxy={PROXY_URL}/>
            </div>
        )
    }
}
FeatureEdit.props = {
    config: PropTypes.object.isRequired
};
export default FeatureEditDebug;
