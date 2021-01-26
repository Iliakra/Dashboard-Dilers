import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


class FeedEditorTab extends Component {
    constructor(props) {
      super(props);
      this.state = {
        textareaValue: this.props.feedContent,
        options: this.props.options,
        searchTab: this.props.searchTab
      }
      this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidUpdate(prevProps) {
      if (this.props.feedContent !== prevProps.feedContent) {
        this.setState({
          ...this.state,
          textareaValue:  this.props.feedContent
        })
      }
    }

    handleOnChange(event) {
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
      console.log(textareaContent);
      let optionsArray = this.state.options;
      console.log(optionsArray);
      let i=0;

      for (let key in textareaContent) {
        if (key === 'id') {
          textareaArray.push(
            <div className="textarea-container" key={i}>
              <p className="textarea-label">{key}</p>
              <TextareaAutosize className="textarea" aria-label="minimum height" rowsMin={3} id={key} placeholder="Minimum 3 rows" value={textareaContent[key]} onChange={this.handleOnChange}>
              </TextareaAutosize>
            </div>
          ) 
        } else if (i < optionsArray.length) {
          if (typeof optionsArray[i]['editable'] !== 'undefined') {
            if (optionsArray[i]['editable'] === true || optionsArray[i]['editable'] === 'yes' || optionsArray[i]['editable'] === 1) {
              textareaArray.push(
                <div className="textarea-container" key={i}>
                  <p className="textarea-label">{typeof optionsArray[i]['label'] !== 'undefined' &&  optionsArray[i]['label'] !== ''? optionsArray[i].label : key}</p>
                  <TextareaAutosize className="textarea" aria-label="minimum height" rowsMin={3} id={key} placeholder="Minimum 3 rows" value={textareaContent[key]} onChange={this.handleOnChange}>
                  </TextareaAutosize>
                </div>
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
          <Box className="textarea-containers-box">
            {textareaArray}   
          </Box>  
        );
    }
  }


export default FeedEditorTab