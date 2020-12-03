import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tabpanel from './Tabpanel';
import {changeDilerTabs, closeDilerForm, deleteTextarea, addTextarea} from '../actions/appActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';


class DilerTabsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {hiddenForm: true, tabValue: 0, newTextareaIndex: null, feeds: {}, feedsContent: []};
        this.store = this.props.store;
        this.handleChange=this.handleChange.bind(this);
        this.handleCloseTabsForm = this.handleCloseTabsForm.bind(this);
        this.handleDeleteTextarea = this.handleDeleteTextarea.bind(this);
        this.handleAddTextarea = this.handleAddTextarea.bind(this);
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

    a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }
    
    handleChange(event, newValue) {
        this.store.dispatch(changeDilerTabs(newValue)
        )
    };

    handleCloseTabsForm(event) {
      this.store.dispatch(closeDilerForm()
      )
    };

    handleDeleteTextarea(event){
      let activeTab = this.state.tabValue;
      let textArea = event.currentTarget;
      let index = textArea.parentElement.index;
      this.store.dispatch(deleteTextarea(index, activeTab)
      )
    };

    handleAddTextarea(event){
      let activeTab = this.state.tabValue;
      this.store.dispatch(addTextarea(activeTab)
      )
    }


    render() {

        let dialogChildren = [];
        
        let feedsArray = Object.keys(this.state.feeds);
        let tabsChildren = [];

        dialogChildren.push (
          <AppBar position="static">
            <Tabs value={this.state.tabValue} onChange={this.handleChange} aria-label="simple tabs example" style={{backgroundColor: "white", color: "black"}}>
              {tabsChildren}
            </Tabs>
          </AppBar>
        );
        
        for (let i=0; i<feedsArray.length; i++) {
          tabsChildren.push(<Tab label={feedsArray[i]} {...this.a11yProps(i)} />);
          let textareaArray = [];
          let feedsContArray = this.state.feedsContent[i];
          for (let j=0; j<feedsContArray.length; j++) {
            textareaArray.push(
              <div style={{display: "flex", marginBottom: 30}} index={j}>
                {feedsContArray[j]}
                <TextareaAutosize aria-label="minimum height" rowsMin={3} placeholder="Minimum 3 rows" style={{width: "50%", marginLeft: 30}}/>
                <IconButton aria-label="delete" onClick={this.handleDeleteTextarea}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )
          }
          dialogChildren.push(
            <Tabpanel store={this.store} value={i} index={i}>
              {textareaArray}
            </Tabpanel>
          )
        }
        
        dialogChildren.push(
          <Button size="small" style={{width: "10%", marginRight: 25, display: "flex", alignSelf: "flex-end", fontSize: 15, color: "white", backgroundColor: "grey"}} onClick={this.handleAddTextarea}>
                +
          </Button>
        );

        dialogChildren.push(
          <Button size="small" style={{width: "10%", margin: 25, display: "flex", alignSelf: "flex-end"}} onClick={this.handleCloseTabsForm}>
            Закрыть
          </Button>
        )

        return (
            <div style={{color: "black"}}>
              <Dialog open={this.state.setOpen} maxWidth={true} aria-labelledby="form-dialog-title" style={{backgroundColor: "white"}}>
                {dialogChildren}  
              </Dialog>
            </div>
        );
    }
}


export default DilerTabsForm
