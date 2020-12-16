import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FeedEditorTab from './FeedEditorTab';
import settings from '../configuration/Settings.js';
import XlsxManager from '../core/XlsxManager.js';



const styles = {
  tabs: {
    position: "relative",
    backgroundColor: "white", 
    color: "black",
  },
  addButton: {
    width: "10%",
    margin: 25,
    display: "flex",
    alignSelf: "flex-end",
    fontSize: 15,
    color: "white",
    backgroundColor: "grey"
  },
  closeButton: {
    width: "10%",  
    display: "flex",
    alignSelf: "flex-end",
    zIndex: 1,
  },
  dialog: {
    backgroundColor: "white",
  }, 
  deleteButton: {
    width: "10%", 
    margin: 25, 
    display: "flex",
  },
  buttonPanel: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  }
};



class FeedsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      feedsEditorisActive: false,
      newTextareaIndex: null,
      testFeeds: {},
      feedsContent: null,
      sheet:null,
    };
    this.store = this.props.store;
    this.handleChange=this.handleChange.bind(this);
    this.handleCloseFeedEditor = this.handleCloseFeedEditor.bind(this);
    this.handleDeleteFeedEditorTab = this.handleDeleteFeedEditorTab.bind(this);
    this.handleAddFeedEditorTab = this.handleAddFeedEditorTab.bind(this);
    this.classes = this.props.classes;
    this.className = this.props.className;
    this.source="";
    this.xlsxManager=new XlsxManager();
  }

  componentDidMount() {
    this.unsubscribe=this.store.subscribe(()=>{this.onStoreChange()});
    this.mounted=true;
    this.onStoreChange();
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.mounted=false;
  }

  getFeedSource(modifyFeeds) {
    if ((modifyFeeds)&&(modifyFeeds.length>0)) {
      return modifyFeeds[0].src;
    }
    return null;
  }

  getFeedSheet(modifyFeeds) {
    if ((modifyFeeds)&&(modifyFeeds.length>0)) {
      return modifyFeeds[0].sheet;
    }
    return null;
  }

  onStoreChange() {
    if (this.mounted) {
      let state=this.store.getState();

      let newSource=this.getFeedSource(state.modifyFeeds);
      let newSheet=this.getFeedSheet(state.modifyFeeds);

      if (newSource!==this.source) {
        this.source=newSource;
        if (this.source!=null) {
          let loadUrl="../"+this.source;

          if (settings.isDev) {
            loadUrl=this.source;
          }

          this.xlsxManager.load(loadUrl,(data)=>{
            this.setState({
              ...this.state,
              feedsContent:data,
              sheet:newSheet,
            });
          });

        } else {
          this.setState({
            ...this.state,
            feedsContent:[],
            sheet:newSheet,
          });
        }
      } else {
        if (this.state.sheet!==newSheet) {
          this.setState({
            ...this.state,
            sheet:newSheet,
          });
        }
      }
      if (state.feedsEditorisActive) {
        this.setState({
          ...this.state,
          feedsEditorisActive: true,
        });
      }
    }
  }

  a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  handleChange(event, newValue) {
    this.setState({
      ...this.state,
      tabValue:newValue,
    });
  };

  handleCloseFeedEditor(event) {
    this.setState({
      ...this.state,
      feedsEditorisActive: false,
    });
  };

  handleAddFeedEditorTab(event) {
    let activeTab = this.state.tabValue;
    //this.store.dispatch(addFeedEditorTab(activeTab))
  };

  handleDeleteFeedEditorTab(event){
    //this.store.dispatch(deleteFeedEditorTab())
  };

  render() {
    let dialogChildren = [];

    if (
      (this.state.feedsContent)&&
      (this.state.sheet)
    ) {
      let tabsChildren = [];
      let tabs = [];
      let feedsContent = this.state.feedsContent;
      let content = feedsContent.all;
      for (let i=0; i<content.length; i++) {
        for (let key in content[i]) {
          if (tabs.indexOf(key) < 0){
            tabs.push(key);
          }
        }
      }

      for (let i=0; i<tabs.length; i++) {
        tabsChildren.push(<Tab label={tabs[i]} key={i} {...this.a11yProps(i)} />);
      }

      let searchTab = tabs[this.state.tabValue];
      let filteredFeedContent = content.map((item) => {
        if (`${searchTab}` in item){
          return item[searchTab];
        } else {return null}
      }) 

      
     let feedContent = [];
     for (let i=0; i<filteredFeedContent.length; i++) {
       if (filteredFeedContent[i] !== null){
         feedContent.push(filteredFeedContent[i]);
       }
    }

      dialogChildren.push (
          <AppBar position="static" key="AppBar">
            <Tabs value={this.state.tabValue} onChange={this.handleChange} aria-label="simple tabs example" className={clsx(this.classes.tabs, this.className)}>
                {tabsChildren}
            </Tabs>
          </AppBar>
      );

     
      dialogChildren.push(
        <FeedEditorTab value={feedContent} searchTab={searchTab} key="FeedEditorTab"/>
      );
    }


    dialogChildren.push(
      <div
        id="buttonPanel"
        key="buttonPanel"
        className={clsx(this.classes.buttonPanel, this.className)}>

          <IconButton aria-label="delete" className={clsx(this.classes.deleteButton, this.className)} onClick={this.handleDeleteFeedEditorTab}>
            <DeleteIcon fontSize="default" />
          </IconButton>

          <Button
            id="AddFeedButton"
            key="AddFeedButton"
            size="small"
            className={clsx(this.classes.addButton, this.className)}
            onClick={this.handleAddFeedEditorTab}>
              +
          </Button>

      </div>
    )

    return (
      <div style={{color: "black"}}>

        <Dialog
          open={this.state.feedsEditorisActive}
          maxWidth="lg"
          aria-labelledby="form-dialog-title"
          className={clsx(this.classes.dialog, this.className)}>

          <Button size="small" className={clsx(this.classes.closeButton, this.className)} onClick={this.handleCloseFeedEditor}>
            <CloseIcon />
          </Button>

          {dialogChildren}

        </Dialog>
      </div>
    );
  }
}


export default withStyles(styles)(FeedsEditor)
