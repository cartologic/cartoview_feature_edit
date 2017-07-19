import React, {Component} from 'react';
import './css/app.css'

import Navigator from './components/Navigator.jsx';

import ResourceSelector from './components/ResourceSelector.jsx'

import MapBasicConfig from './components/MapBasicConfig.jsx'
import BasicConfig from './components/BasicConfig.jsx'
import MapTools from './components/MapTools.jsx'
import Reporting from './components/Reporting.jsx'

import EditService from './services/editService.jsx'


export default class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      config: {},
      selectedResource: this.props.config.instance ? this.props.config.instance.map:undefined
    }
    this.editService = new EditService({baseUrl: '/'})
  }


  goToStep(step) {
    this.setState({step});
  }

  onPrevious(){
    let {step} = this.state;
    this.goToStep(step-=1)
  }


  render() {
    var {step} = this.state
    const steps = [{
        label: "Select Map",
        component: ResourceSelector,
        props: {
          resourcesUrl: this.props.config.urls.resources_url,
          instance: this.state.selectedResource,
          username:this.props.username,
          selectMap: (resource) => {
            this.setState({selectedResource: resource})
          },
          limit: this.props.config.limit,
          onComplete: () => {
            var {step} = this.state;
            this.setState({
              config: Object.assign(this.state.config, {map: this.state.selectedResource.id})
            })
            this.goToStep(++step)
          }
        }
      },{
        label: "General ",
        component: MapBasicConfig,
        props: {
          instance: this.state.selectedResource,
          config: this.props.config.instance ? this.props.config.instance.config : undefined,
          onComplete: (basicConfig) => {
            let {step} = this.state;
            this.setState({
              config: Object.assign(this.state.config, basicConfig)
            })
            this.goToStep(++step)
          },
          onPrevious: () => {this.onPrevious()}
        }
      },{
        label: "Map Navigation Tools",
        component: BasicConfig,
        props: {
          instance: this.state.selectedResource,
          config: this.props.config.instance ? this.props.config.instance.config : undefined,
          onComplete: (basicConfig) => {
            var {step} = this.state;

            this.setState({
              config: Object.assign(this.state.config, basicConfig)
            })
            this.goToStep(++step)
          },
          onPrevious: () => {this.onPrevious()}
        }
      },{
        label: "Map Assistive Tools",
        component: MapTools,
        props: {
          instance: this.state.selectedResource,
          config: this.props.config.instance ? this.props.config.instance.config : undefined,
          onComplete: (basicConfig) => {
            var {step,config} = this.state;
            let newConfig=Object.assign(config.config, basicConfig)
            config.config=newConfig
            this.setState({
              config: Object.assign(this.state.config, config)
            },()=>{
              console.log(this.state.config);
            })
            this.goToStep(++step)
          },
          onPrevious: () => {this.onPrevious()}
        }
      },{
        label: "Reporting",
        component: Reporting,
        props: {
          instance: this.state.selectedResource,
          config: this.props.config.instance ? this.props.config.instance.config : undefined,
          id:this.props.config.instance ? this.props.config.instance.id:undefined,
          urls:this.props.config.urls,
          onComplete: (basicConfig) => {
            console.log(this.props.instance ? this.props.config.instance.id:undefined);
            var {step,config} = this.state;
            let newConfig=Object.assign(config.config, basicConfig)
            config.config=newConfig
            this.setState({
              config: Object.assign(this.state.config, config)
            },()=>{
              this.editService.save(this.state.config,this.props.config.instance ? this.props.config.instance.id : undefined).then((res)=>window.location.href="/apps/cartoview_geonode_viewer/"+res.id+"/view")
            })
          },
          onPrevious: () => {this.onPrevious()}
        }
      }

    ]
    return (
      <div className="wrapping">
        <Navigator steps={steps} step={step} onStepSelected={(step) => this.goToStep(step)}/>
        <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel">
          {steps.map((s, index) => index == step && <s.component key={index} {...s.props}/>)}
        </div>
      </div>
    )
  }
}
