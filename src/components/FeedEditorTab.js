import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  list: {
    height: "65vh",
    overflow: "auto",
  },
};


class FeedEditorTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      textareaValue: this.props.feedContent,
      options: this.props.options,
      searchTab: this.props.searchTab
    }
    this.classes = this.props.classes;
    this.className = this.props.className;

    this.onChangeTextareaValue = this.onChangeTextareaValue.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.feedContent !== prevProps.feedContent) {
      this.setState({
        ...this.state,
        textareaValue:  this.props.feedContent
      })
    }
  }

  onChangeTextareaValue(event) {
    let index = event.target.id;
    let newValue = event.target.value;
    let newFeedContent = this.props.feedContent;
    newFeedContent[index] = newValue;
    this.setState({
      ...this.state,
      textareaValue: newFeedContent
    })
  }


  render() {

    let textareaArray = [];

    let textareaContent = this.state.textareaValue;

    let optionsArray = this.state.options;
    
    let i=0;

    for (let key in textareaContent) {

      if (key === 'id') {

        textareaArray.push(
          <ListItem className="textarea-container" key="id-textarea">
            <p className="textarea-label">{key}</p>
            <TextareaAutosize className="textarea" aria-label="minimum height" rowsMin={3} id={key} placeholder="Minimum 3 rows" value={textareaContent[key]} onChange={this.onChangeTextareaValue}>
            </TextareaAutosize>
          </ListItem>
        ) 

      } else if (i < optionsArray.length) {

        if (typeof optionsArray[i]['editable'] !== 'undefined') {

          if (optionsArray[i]['editable'] === true || optionsArray[i]['editable'] === 'yes' || optionsArray[i]['editable'] === 1) {

            textareaArray.push(
              <ListItem className="textarea-container" key={i}>
                <p className="textarea-label">{typeof optionsArray[i]['label'] !== 'undefined' &&  optionsArray[i]['label'] !== ''? optionsArray[i].label : key}</p>
                <TextareaAutosize className="textarea" aria-label="minimum height" rowsMin={3} id={key} placeholder="Minimum 3 rows" value={textareaContent[key]} onChange={this.onChangeTextareaValue}>
                </TextareaAutosize>
              </ListItem>
            )  
            i++

          } else {

            i++

          }
        } else {

          i++

        }
      }  
    }

    return (
      <List className={clsx(this.classes.list, this.className)}>
        {textareaArray}   
      </List>  
    );
  }
}


export default withStyles(styles)(FeedEditorTab)