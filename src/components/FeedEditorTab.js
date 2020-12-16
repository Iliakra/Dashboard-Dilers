import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


class FeedEditorTab extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
      let textareaArray = [];
      let textareaContent = this.props.value;
      let label = this.props.searchTab;

      for (let i=0; i<textareaContent.length; i++){
        textareaArray.push(
          <div className="textarea-container" index={i} key={i}>
            {label}
            <TextareaAutosize className="textarea" aria-label="minimum height" rowsMin={3} key={i} placeholder="Minimum 3 rows" value={textareaContent[i]}/>
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