import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

export default class AttachmentDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true
    }

  }
  loadComments(layerName,featureId) {
    fetch("/REST/attachments/comment/?layer_name="+layerName+"&feature_exact="+featureId).then((response) => response.json()).then((data) => {
      this.setState({comments: data.objects, loading: false})
    }).catch((error) => {
      console.error(error);
    });
  }
  handleToggle() {
    this.props.handle(this.props.layer,this.props.featureId)
  }
  componentDidMount() {
    let layerName=this.props.layer ? this.props.layer.get('name') : null;
    let featureId=this.props.featureId
    if (layerName && featureId) {
      console.log(layerName);
      this.loadComments(layerName,featureId)
    }
  }
  avatar(comment) {
    return <Avatar src={comment.user.avatar}/>
  }
  componentWillReceiveProps(nextProps) {
    let layer=nextProps.layer
    let featureId=nextProps.featureId
    if (layer !== this.props.layer || featureId!= this.props.featureId) {
      this.loadComments(layer.get('name'),featureId)
    }
  }
  render() {
    console.log(!this.state.loading && this.state.comments.length == 0);
    return (

      <div>
        <Drawer width={500} openSecondary={true} open={this.props.open}>
          <AppBar title="Attachments" iconElementLeft={< IconButton iconClassName = "fa fa-times" onTouchTap = {
            this.handleToggle.bind(this)
          } > </IconButton>}/>
          <List>
            <Subheader>Comments</Subheader>
            {!this.state.loading && this.state.comments.length > 0 && this.state.comments.map((comment,i) => {
              return <div key={i}>
                <ListItem leftAvatar={< Avatar src = {
                  comment.user.avatar
                } />} primaryText={comment.user.username} secondaryText={< p > {
                  comment.comment
                } < /p>}></ListItem>
                <Divider inset={true}/>

                </div>

            })}
            {!this.state.loading && this.state.comments.length == 0 && <div>
              {"No Comments"}
              <Divider inset={true}/>

              </div>}

          </List>
        </Drawer>
      </div>
    );
  }
}
