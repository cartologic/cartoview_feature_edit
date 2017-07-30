import React, { Component } from 'react';
import t from 'tcomb-form';
const mapConfig = t.struct({ showLoadingPanel: t.Boolean });
const options = {
	fields: {
		showLoadingPanel: {
			label: "Loading Panel"
		}
	}
};
const Form = t.form.Form;

export default class MapTools extends Component {
	constructor( props ) {
		super( props )
		this.state = {
			defaultconf: {
				showLoadingPanel: this.props.config
					? this.props.config.showLoadingPanel
					: true
			}
		}
	}

	save( ) {
		var basicConfig = this.refs.form.getValue( );
		if ( basicConfig ) {
			this.props.onComplete( basicConfig )
		}
	}

	render( ) {
		return (
			<div className="row">
				<div className="row">
					<div className="col-xs-5 col-md-4">
						<h4>{'Map Tools '}</h4>
					</div>
					<div className="col-xs-7 col-md-8">
						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className="btn btn-primary btn-sm pull-right"
							onClick={this.save.bind( this )}>{"next >>"}</button>

						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className="btn btn-primary btn-sm pull-right"
							onClick={( ) => this.props.onPrevious( )}>{"<< Previous"}</button>
					</div>
				</div>
				<hr></hr>
				<Form
					ref="form"
					options={options}
					value={this.state.defaultconf}
					type={mapConfig}/>
			</div>
		)
	}
}
