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
  loadComments(layerName) {
    fetch("/REST/attachments/comment/?layer_name=hisham").then((response) => response.json()).then((data) => {
      this.setState({comments: data.objects, loading: false})
    }).catch((error) => {
      console.error(error);
    });
  }
  handleToggle() {
    this.props.handle(this.props.layer)
  }
  componentDidMount() {
    if (this.props.layer) {
      console.log(this.props.layer.get('name'));
      this.loadComments(this.props.layer.get('name'))
    }
  }
  avatar(comment) {
    return <Avatar src={comment.user.avatar}/>
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.layer !== this.props.layer) {
      this.loadComments(nextProps.layer.get('name'))
    }
  }
  render() {

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
                } < /p>} secondaryTextLines={2}></ListItem>
                <Divider inset={true}/>

                </div>

            })}

          </List>
        </Drawer>
      </div>
    );
  }
}
