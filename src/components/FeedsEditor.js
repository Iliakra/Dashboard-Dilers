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
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { closeFeedEditor } from '../actions/feedEditorActions';
import dirtyJson from 'dirty-json';

const styles = {
  appBar: {
    width: 800,
  },
  tabs: {
    display: "flex",
    position: "relative",
    backgroundColor: "white", 
    color: "black",
  },
  tab: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    textTransform: "none",
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
    //margin: 25, 
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
      feedsContent: {all: 
        [
          {id: "lact", t1: "Любите кофе с&nbsp;молоком?", t2: "А живот против?<sup style='vertical-align:0.3em; font-size:70%;'>*</sup>", icon1: "coffee.png", options: "{}"},
          {id: "office", t1: "Презентация?Совещание?", t2: "А живот против?<sup style='vertical-align:0.3em; font-size:70%;'>*</sup>", icon1: "case.png", options: "{label: 'Текст вверху'},{label: 'Текст внизу'}, {}, {label: 'Текст слева', editable: false},{label: 'static', abc: 'abc'}"},
          {id: "esp", t1: "", t2: "", icon1: "", options: "{label: 'Текст вверху'},{label: 'Текст внизу'}, {label: 'Текст вверху'},{},{position: 'static'}"}
        ]
      },//null,
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
            this.setState({
              ...this.state,
              //feedsContent:data,
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
    let content = feedsContent.all;
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
    let newFeedsArray = feedsContent.all;
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
      feedsContent: {all: finalFeedsArray},
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
    let newFeedsArray = feedsContent.all;
    let index = this.state.tabValue;

    newFeedsArray.splice(index, 1);

    this.setState({
      ...this.state,
      feedsContent: {all: newFeedsArray},
      tabValue: 0,
      deleteTab: null,
      openDeleteDialog: false,
    });

  }


  
  render() {
    let dialogChildren = [];
    console.log(this.state.feedsContent);

    if (
      (this.state.feedsContent)&&
      (this.state.sheet)
    ) {
      let tabsChildren = [];
      
      let feedsContent = this.state.feedsContent;

      let content = feedsContent.all;

      let finalContent = content.map((item) => {
        let keyArray = ['t1','t2', 'icon1'];
        for (let i=0; i<keyArray.length; i++){
          if (keyArray[i] in item === false) {
            item[keyArray[i]] = '';
          }
        }
        return item
      })

      //---------------------------------
      /*
      finalContent[0].options = '{}';
      finalContent[1].options = '{label: "Текст вверху"},{label: "Текст внизу"}, {},{label: "Текст слева", editable: false},{position: "static", abc: "abc"}';
      finalContent[2].options = '{label: "Текст вверху"},{label: "Текст внизу"}, {label: "Текст вверху"},{},{position: "static"}';
      finalContent[3].options = '{label: "Текст вверху"},{label: "Текст внизу"}, {label: "Текст вверху"},{gert: "tre"},{position: "static"}';
      finalContent[4].options = '{position: "static"},{label: "Текст внизу"}, {label: "Текст вверху"},{label: "t5"},{position: "static"}';
      */
      //---------------------------------

     
      let actualTabs = this.generateTabsArray();
      
      for (let i=0; i<actualTabs.length; i++) {
        tabsChildren.push(<Tab label={actualTabs[i]} key={i} className={clsx(this.classes.tab, this.className)}{...this.a11yProps(i)} />);
      }

      

      dialogChildren.push (
        <AppBar position="static" key="AppBar" className={clsx(this.classes.appBar, this.className)}>
          <Tabs value={this.state.tabValue} onChange={this.handleChange} aria-label="simple tabs example" key="Tabs" className={clsx(this.classes.tabs, this.className)} variant="scrollable"  scrollButtons="auto">
            {tabsChildren}
          </Tabs>
        </AppBar>
      );

      let searchTab = this.state.tabValue;
      
      let feedContent = finalContent[searchTab];
   
      dialogChildren.push(
        <FeedEditorTab value={feedContent} searchTab={searchTab} key="FeedEditorTab"/>
      );
    }


    dialogChildren.push(
      <div
        id="buttonPanel"
        key="buttonPanel"
        className={clsx(this.classes.buttonPanel, this.className)}>

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

      </div>
    )

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

        <Dialog
          open={this.state.feedsEditorisActive}
          maxWidth={false}
          scroll='paper'
          aria-labelledby="form-dialog-title"
          key="changeFeedContentDialog"
          className={clsx(this.classes.dialog, this.className)}>

          <Button size="small" key="closeFeedDialogButton" className={clsx(this.classes.closeButton, this.className)} onClick={this.handleCloseFeedEditor}>
            <CloseIcon key="closeFeedDialogIcon"/>
          </Button>

          {dialogChildren}

        </Dialog>
      </div>
    );
  }
}


export default withStyles(styles)(FeedsEditor)

/*

{all: [{id: "lact", t1: "Любите кофе с&nbsp;молоком?", t2: "А живот против?<sup style="vertical-align:0.3em; font-size:70%;">*</sup>", icon1: "coffee.png", options: "{}"},
  {id: "office", t1: "Презентация?
↵Совещание?", t2: "А живот против?<sup style="vertical-align:0.3em; font-size:70%;">*</sup>", icon1: "case.png", options: "{label: "Текст вверху"},{label: "Текст внизу"}, {}…editable: false},{position: "static", abc: "abc"}"},
id: "esp", t1: "", t2: "", icon1: "", options: "{label: "Текст вверху"},{label: "Текст внизу"}, {label: "Текст вверху"},{},{position: "static"}"]}
*/