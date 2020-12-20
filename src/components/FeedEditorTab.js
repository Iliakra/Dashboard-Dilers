import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


class FeedEditorTab extends Component {
    constructor(props) {
      super(props);
      this.state = {
        textareaValue: this.props.value,
      }
      this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidUpdate(prevProps) {
      if (this.props.value !== prevProps.value) {
        this.setState({
          ...this.state,
          textareaValue:  this.props.value
        })
      }
    }

    handleOnChange(event) {
      let index = event.target.id;
      let newValue = event.target.value;
      let feedsContent = this.props.value;
      feedsContent[index] = newValue;
      this.setState({
        ...this.state,
        textareaValue: feedsContent
      })
    }


    render() {
      let textareaArray = [];
      let textareaContent = this.state.textareaValue;
      let label = this.props.searchTab;

      for (let i=0; i<textareaContent.length; i++){
        textareaArray.push(
          <div className="textarea-container" index={i} key={i}>
            {label}
            <TextareaAutosize className="textarea" aria-label="minimum height" rowsMin={3} key={i} id={i} placeholder="Minimum 3 rows" value={textareaContent[i]} onChange={this.handleOnChange}>
            </TextareaAutosize>
          </div>
        )
      }  

        return (
          <Box >
            {textareaArray}
          </Box>  
        );
    }
  }


export default FeedEditorTab