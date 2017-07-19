import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';


export default class AttachmentDrawer extends React.Component {

  constructor(props) {
    super(props);
  }
  handleToggle(){
    this.props.handle()
  }
  render() {
    return (
      <div>
        <Drawer width={500} openSecondary={true} open={this.props.open} >
          <AppBar title="Attachments" iconElementLeft={<IconButton iconClassName="fa fa-times" onTouchTap={this.handleToggle.bind(this)}></IconButton>} />

        </Drawer>
      </div>
    );
  }
}
