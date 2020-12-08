import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';



class FeedEditorTab extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.state = {tabValue: 0, feedsContent: [['Текст 1','Текст 2'],['Текст 2'],['Текст 3'],['Текст 4']], modifyFeeds: [{source: 'abc', sheet: 'List1'}], feedsContent: [ 
          { 
            id: 'List1',
            content: [ 
              {feedOne: [ ['Поле 1','Поле 2'] ]}, 
              {feedTwo: [ ['Поле 3','Поле 4'] ]},  
              {feedThree: [ ['Поле 5'] ]}, 
              {feedFour: [ ['Поле 6'] ]},
              ]
          }]};
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
      let textareaArray = [];
      let id = this.state.tabValue;
      let modify = this.state.modifyFeeds;
      let listNumber = modify[0].sheet;
      let feedsContent = this.state.feedsContent;
      let listItem = feedsContent.find(item => item.id === listNumber);
      let listItemContentArray = listItem.content;
      let textareaContent = Object.values(listItemContentArray[id])[0];
      
      for (let i=0; i<textareaContent.length; i++){
        textareaArray.push(
          <div style={{display: "flex", marginBottom: 30}} index={i}>
            {textareaContent[i]}
            <TextareaAutosize aria-label="minimum height" rowsMin={3} placeholder="Minimum 3 rows" style={{width: "50%", marginLeft: 30}}/>
          </div>
        )
      }  
      
      

        return (
            <div
              role="tabpanel"
              hidden={this.index !== this.state.tabValue}
              id={`simple-tabpanel-${this.index}`}
              aria-labelledby={`simple-tab-${this.index}`}
            >
              {this.state.tabValue === this.index && (
                <Box p={3}>
                  <Typography>{textareaArray}</Typography>
                </Box>
              )}
            </div>
          );
    }
}


export default FeedEditorTab