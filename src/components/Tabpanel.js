import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

class Tabpanel extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.state = {tabValue: 0};
        this.value = this.props.value;
        this.children = this.props.children;
        this.index = this.props.index;
    }

    componentDidMount() {
      this.unsubscribe=this.store.subscribe(()=>{this.onStoreChange()});
      this.mounted=true;
    }
  
    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.mounted=false;
    }
  
    onStoreChange() {
      if (this.mounted) {
          let state=this.store.getState();
          this.setState(state);
      }
    }
    
    render() {
        return (
            <div
              role="tabpanel"
              hidden={this.state.tabValue !== this.index}
              id={`simple-tabpanel-${this.index}`}
              aria-labelledby={`simple-tab-${this.index}`}
            >
              {this.state.tabValue === this.index && (
                <Box p={3}>
                  <Typography>{this.children}</Typography>
                </Box>
              )}
            </div>
          );
    }
}


export default Tabpanel