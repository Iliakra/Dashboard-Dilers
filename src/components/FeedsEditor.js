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
import { openFeedEditor, closeFeedEditor } from '../actions/feedEditorActions';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { relative } from 'path';


const styles = {

  mainContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },

  backGroundContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "grey",
    opacity: 0.7,
  },

  gridBox: {
    width: "40%",
    position: "absolute",
    left: "30%",
    top: "25%",
    backgroundColor: "white",
  },

  middleGridItem: {
    width: "100%",
  },

  tabs: {
    backgroundColor: "white",
    color: "black",
  },

  bottomPanel: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: "2%",
    paddingRight: "2%",
    overflow: "auto"
  },

  cancelButton: {
    fontSize: "90%",
    marginTop: "1%",
    marginBottom: "1%",
  },

  deleteFeedButton: {
    marginTop: "1%",
    marginBottom: "1%",
  },

  addFeedButton: {
    fontSize: "1.5em",
    color: "white",
    backgroundColor: "grey",
    marginTop: "1%",
    marginBottom: "1%",
  },

  saveButton: {
    fontSize: "90%",
    marginTop: "1%",
    marginBottom: "1%",
    marginLeft: 10,
    color: "white",
    backgroundColor: "red"
  },

  buttonText: {
    display: "block",
  }

};


class FeedsEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      contentReady: false,
      feedsContent: null,
      optionsContent: null,
      sheet: null,
      wrongContent:false,
      openDeletionDialog: false,
    };

    this.store = this.props.store;
    this.tabs_changeHandler=this.tabs_changeHandler.bind(this);

    this.closeFeedsEditor = this.closeFeedsEditor.bind(this);
    this.openFeedDeletionDialog = this.openFeedDeletionDialog.bind(this);
    this.addFeed = this.addFeed.bind(this);
    this.generateTabsArray = this.generateTabsArray.bind(this);
    this.cancelFeedDeletion = this.cancelFeedDeletion.bind(this);
    this.deleteFeed = this.deleteFeed.bind(this);

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
      if (!modifyFeeds[0].sheet) {
        return "default";
      }
      return modifyFeeds[0].sheet;
    }
    return null;
  }


  onStoreChange() {
    if (this.mounted) {
      let state=this.store.getState();

      let newSource=this.getFeedSource(state.modifyFeeds);
      let newSheet=this.getFeedSheet(state.modifyFeeds);
      //console.log('newSheet',newSheet);

      if (newSource!==this.source) {
        this.source=newSource;
        if (this.source!=null) {
          let loadUrl="../"+this.source;

          if (settings.isDev) {
            loadUrl=this.source;
          }

          this.xlsxManager.load(loadUrl,(data)=>{
            let feedsContentData = data.all;//data[newSheet];
            if (feedsContentData) {
              let optionsData = feedsContentData[feedsContentData.length-1];
              feedsContentData.pop();
              this.setState({
                ...this.state,
                feedsContent: feedsContentData,
                optionsContent: optionsData,
                sheet:newSheet,
                contentReady: true,
                wrongContent:false
              });           
            } else {
              this.setState({
                ...this.state,
                wrongContent: true,
              });
            }
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

  closeFeedsEditor() {
    this.store.dispatch(
      closeFeedEditor()
    )
  }


  tabs_changeHandler(event, newValue) {
    this.setState({
      ...this.state,
      tabValue:newValue,
    });
  };


  addFeed() {
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


  openFeedDeletionDialog() {
    let activeTab = this.state.tabValue;
    let actualTabs = this.generateTabsArray();
    let deleteTab = actualTabs[activeTab];

    this.setState({
      ...this.state,
      deleteTab: deleteTab,
      openDeletionDialog: true,
    });

  };


  cancelFeedDeletion() {
    this.setState({
      ...this.state,
      deleteTab: null,
      openDeletionDialog: false,
    });
  }


  deleteFeed() {
    let feedsContent = this.state.feedsContent;
    let newFeedsArray = feedsContent;
    let index = this.state.tabValue;

    newFeedsArray.splice(index, 1);

    this.setState({
      ...this.state,
      feedsContent: newFeedsArray,
      tabValue: 0,
      deleteTab: null,
      openDeletionDialog: false,
    });

  }



  render() {

    let children = [];
    children.push(this.props.children);
    
    if (this.state.contentReady) {
      let dialogChildren = [];
      let actualTabs = this.generateTabsArray();
      let tabsChildren = [];
      for (let i=0; i<actualTabs.length; i++) {
        tabsChildren.push(<Tab label={actualTabs[i]} key={i} {...this.a11yProps(i)} />);
      }
      dialogChildren.push (
        <Grid item xs={12} key="topGridItem">
          <AppBar position="static" key="AppBar">
            <Tabs value={this.state.tabValue} onChange={this.tabs_changeHandler} aria-label="simple tabs example" key="Tabs" className={clsx(this.classes.tabs, this.className)} variant="scrollable" scrollButtons="auto">
              {tabsChildren}
            </Tabs>
          </AppBar>
        </Grid>
        
      );

      dialogChildren.push(
        <Grid
          key="middleGridItem"
          className={clsx(this.classes.middleGridItem, this.className)}
        >
          <FeedEditorTab feedContent={this.state.feedsContent[this.state.tabValue]} options={this.state.optionsContent} searchTab={this.state.tabValue} key="FeedEditorTab"/>
        </Grid>
      );


      dialogChildren.push (
        <Grid item xs={12} key="bottomGridItem">
          <Box
          key="bottomPanel"
          boxShadow={4}
          className={clsx(this.classes.bottomPanel, this.className)}
        >
            <Button size="small" key="closeFeedDialogButton" className={clsx(this.classes.cancelButton, this.className)} onClick={this.closeFeedsEditor}>
              Отмена
            </Button>
            <IconButton aria-label="delete" key="deleteFeedButton" className={clsx(this.classes.deleteFeedButton, this.className)} onClick={this.openFeedDeletionDialog}>
              <DeleteIcon fontSize="default" key="deleteIcon"/>
            </IconButton>
            <Button
              id="AddFeedButton"
              key="AddFeedButton"
              size="small"
              className={clsx(this.classes.addFeedButton, this.className)}
              onClick={this.addFeed}>
                +
            </Button>
            <Button size="small" key="saveButton" className={clsx(this.classes.saveButton, this.className)}>
              <p className={clsx(this.classes.buttonText, this.className)}>Сохранить</p>
            </Button>
          </Box>
        </Grid>
      );

      if (this.state.openDeletionDialog) {
        dialogChildren.push(
          <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            key="deleteDialog"
          >
            <DialogTitle id="alert-dialog-title" key="dialogTitle">{`Удаление фида ${this.state.deleteTab}`}</DialogTitle>
            <DialogContent key="dialogContent">
              <DialogContentText id="alert-dialog-description" key="dialogContentText">
              Вы действительно хотите удалить фид {this.state.deleteTab} ?
              </DialogContentText>
            </DialogContent>
            <DialogActions key="dialogActions">
              <Button color="primary" key="cancelDeletionButton" onClick={this.cancelFeedDeletion}>
              Отменить
              </Button>
              <Button color="primary" key="deletionButton" onClick={this.deleteFeed} autoFocus>
              Удалить
              </Button>
            </DialogActions>
          </Dialog>
        )
      }

      children.push(
        <Box
          open={true}
          key="mainContainer"
          className={clsx(this.classes.mainContainer, this.className)}>
          <Box className={clsx(this.classes.backGroundContainer, this.className)}></Box>
          <Box className={clsx(this.classes.gridBox, this.className)}>
            <Grid container spacing={0}>            
              {dialogChildren}            
            </Grid>
          </Box>
        </Box>
      );

    } else {
      if (this.state.wrongContent) {
        children.push(
          <div key="error">
          ОШИБКА
          </div>
        );
      } else {
        children.push(
          <div className="loader-overlay" key="preloader">
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          </div>
        );
      }

    }


    return children;
  }
}


export default withStyles(styles)(FeedsEditor)
