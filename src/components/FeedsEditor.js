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
import FeedEditorTab from './FeedEditorTab';
import settings from '../configuration/Settings.js';
import XlsxManager from '../core/XlsxManager.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { closeFeedEditor } from '../actions/feedEditorActions';
import dirtyJson from 'dirty-json';
import Box from '@material-ui/core/Box';
import { relative } from 'path';


const styles = {
  appTabBar: {
    position: "fixed",
    width: "40vw",
  },
  tabs: {
    display: "flex",
    position: "relative",
    backgroundColor: "white", 
    color: "black",
  },
  tab: {
    display: "flex",
    //height: "0.5vw",
    //flexGrow: 1,
    //flexShrink: 1,
    textTransform: "none",
    fontSize: "0.9vw"
  },
  dialog: {
    position: "relative",
    backgroundColor: "transparent",
  }, 
  bottomPanel: {
    width: "40vw",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: "5vh",
    zIndex: 1,
  },
  cancelButton: {
    width: "1%",  
    display: "flex",
    fontSize: "0.6vw",
    margin: "1%",
    marginLeft: "5%",
  },
  deleteButton: {
    width: "10%",  
    display: "flex",
  },
  addButton: {
    width: "10%",
    margin: "2%",
    display: "flex",
    fontSize: "80%",
    color: "white",
    backgroundColor: "grey"
  },
  saveButton: {
    width: "10%",
    margin: "2%",
    display: "flex",
    fontSize: "0.6vw",
    color: "white",
    backgroundColor: "red",
    marginRight: "5%"
  },
  feedEditorTabContainer: {
    position: "relative",
    width: "40vw",
    height: "20vw",
    marginTop: "10vh",
    marginBottom: "7vh"
  },
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
      optionsContent: null,
      sheet: null,
      openDeleteDialog: false,
      deleteTab: null,
    };
    this.store = this.props.store;
    this.handleChange=this.handleChange.bind(this);
    this.handleCloseFeedEditor = this.handleCloseFeedEditor.bind(this);
    this.openDeleteFeedDialog = this.openDeleteFeedDialog.bind(this);
    this.handleAddFeedEditorTab = this.handleAddFeedEditorTab.bind(this);
    this.generateTabsArray = this.generateTabsArray.bind(this);
    this.cancelFeedDeletion = this.cancelFeedDeletion.bind(this);
    this.startFeedDeletion = this.startFeedDeletion.bind(this);
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
            let feedsContentData = data.all;
            let optionsData = feedsContentData[feedsContentData.length-1];
            let finalOptionsData = [];
            if (optionsData) {
              for (let i=0; i < optionsData.length; i++) {
                let optionsItem=optionsData[i].replace(/,\s*\}/gi,"}").replace(/,\s*\]/gi,"]");
                try {
                  optionsItem = dirtyJson.parse(optionsItem);
                  finalOptionsData.push(optionsItem);
                } catch (e) {
                  // console.log(); 
                }
              }            
            }
            feedsContentData.pop();
            this.setState({
              ...this.state,
              feedsContent: feedsContentData,
              optionsContent:finalOptionsData,
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

  
  generateTabsArray() {
    let tabs = [];
    let feedsContent = this.state.feedsContent;
    let content = feedsContent;
    for (let i=0; i<content.length; i++) {
        let idName = content[i].id;
          tabs.push(idName);
    }
    return tabs
  }

  
  handleChange(event, newValue) {
    this.setState({
      ...this.state,
      tabValue:newValue,
    });
  };

  
  handleCloseFeedEditor(event) {
    this.store.dispatch(
      closeFeedEditor()
    )
  };

  
  handleAddFeedEditorTab(event) {
    let feedsContent = this.state.feedsContent;
    let newFeedsArray = feedsContent;
    let index = this.state.tabValue;
    let itemToAdd = Object.assign({}, newFeedsArray[index]);
    let itemtoAddId = itemToAdd.id;

    newFeedsArray.push(itemToAdd);
    let similarFeeds =[];
   
    for (let i=0; i < newFeedsArray.length; i++) {
      let testPart = newFeedsArray[i].id.slice(0, itemtoAddId.length);
      if (itemtoAddId === testPart){
        similarFeeds.push(1);
      }
    }

    let finalFeedsArray = newFeedsArray.map((item, index) => {
      if (index === newFeedsArray.length-1 && item.id === itemtoAddId) {
        item.id = `${itemtoAddId}_${similarFeeds.length-1}`;
      }
      return item
    })

    this.setState({
      ...this.state,
      feedsContent: finalFeedsArray,
      tabValue: finalFeedsArray.length-1,
    });
  };

  
  openDeleteFeedDialog(event) {
    let activeTab = this.state.tabValue;
    let actualTabs = this.generateTabsArray();
    let deleteTab = actualTabs[activeTab];

    this.setState({
      ...this.state,
      deleteTab: deleteTab,
      openDeleteDialog: true,
    });

  };

  
  cancelFeedDeletion(event) {
    this.setState({
      ...this.state,
      deleteTab: null,
      openDeleteDialog: false,
    });
  }

  
  startFeedDeletion(event) {
    let feedsContent = this.state.feedsContent;
    let newFeedsArray = feedsContent;
    let index = this.state.tabValue;

    newFeedsArray.splice(index, 1);

    this.setState({
      ...this.state,
      feedsContent: newFeedsArray,
      tabValue: 0,
      deleteTab: null,
      openDeleteDialog: false,
    });

  }


  
  render() {
    let dialogChildren = [];
    
    if (
      (this.state.feedsContent)&&
      (this.state.sheet)
    ) {
      let tabsChildren = [];
      
      let feedsContent = this.state.feedsContent;

      let content = feedsContent;

      let finalContent = content.map((item) => {
        let keyArray = ['t1','t2', 'icon1'];
        for (let i=0; i<keyArray.length; i++){
          if (keyArray[i] in item === false) {
            item[keyArray[i]] = '';
          }
        }
        return item
      })

      let actualTabs = this.generateTabsArray();
      
      for (let i=0; i<actualTabs.length; i++) {
        tabsChildren.push(<Tab label={actualTabs[i]} key={i} className={clsx(this.classes.tab, this.className)}{...this.a11yProps(i)} />);
      }

      

      dialogChildren.push (
        <AppBar position="static" key="AppBar" className={clsx(this.classes.appTabBar, this.className)}>
          <Tabs value={this.state.tabValue} onChange={this.handleChange} aria-label="simple tabs example" key="Tabs" className={clsx(this.classes.tabs, this.className)} variant="scrollable"  scrollButtons="auto">
            {tabsChildren}
          </Tabs>
        </AppBar>
      );

      let searchTab = this.state.tabValue;
      
      let feedContent = finalContent[searchTab];
   
      dialogChildren.push(
        <div className={clsx(this.classes.feedEditorTabContainer, this.className)} >
          <FeedEditorTab feedContent={feedContent} options={this.state.optionsContent} searchTab={searchTab} key="FeedEditorTab"/>    
        </div>
      );
    }

    dialogChildren.push(
      <Dialog
        open={this.state.openDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        key="deleteDialog"
      >
        <DialogTitle id="alert-dialog-title" key="dialogTitle">{`Удаление фида ${this.state.deleteTab}`}</DialogTitle>
        <DialogContent key="dialogContent">
          <DialogContentText id="alert-dialog-description">
            Вы действительно хотите удалить фид {this.state.deleteTab} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions key="dialogActions">
          <Button color="primary" key="cancelDeletionButton" onClick={this.cancelFeedDeletion}>
            Отменить
          </Button>
          <Button color="primary" key="deletionButton" onClick={this.startFeedDeletion} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    )

    return (
      <div style={{color: "black"}}>
        {this.state.feedsEditorisActive} ? 
          (
            <Dialog
              open={this.state.feedsEditorisActive}
              maxWidth={false}
              scroll='paper'
              aria-labelledby="form-dialog-title"
              key="changeFeedContentDialog"
              className={clsx(this.classes.dialog, this.className)}>
              
              {dialogChildren}

              <Box key="bottomPanel" boxShadow={3} className={clsx(this.classes.bottomPanel, this.className)}>
                <Button size="small" key="closeFeedDialogButton" className={clsx(this.classes.cancelButton, this.className)} onClick={this.handleCloseFeedEditor}>
                  Отмена
                </Button>
        
                <IconButton aria-label="delete" key="deleteIconButton" className={clsx(this.classes.deleteButton, this.className)} onClick={this.openDeleteFeedDialog}>
                  <DeleteIcon fontSize="default" key="deleteIcon"/>
                </IconButton>
        
                <Button
                  id="AddFeedButton"
                  key="AddFeedButton"
                  size="small"
                  className={clsx(this.classes.addButton, this.className)}
                  onClick={this.handleAddFeedEditorTab}>
                    +
                </Button>
                <Button size="small" key="saveButton" className={clsx(this.classes.saveButton, this.className)}>
                  Сохранить
                </Button>
              </Box>

            </Dialog>
          ) : (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
            )
      </div>
    );
  }
}


export default withStyles(styles)(FeedsEditor)