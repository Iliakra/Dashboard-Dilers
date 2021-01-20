import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import dirtyJson from 'dirty-json';


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
      let i = 0;
      let labelJson = textareaContent.options;
      
      if (labelJson) {
        labelJson=labelJson.replace(/,\s*\}/gi,"}").replace(/,\s*\]/gi,"]");
        try {
          labelJson = dirtyJson.parse(labelJson);
          console.log('options',labelJson[0].value[1].value);
        } catch (e) {
          // console.log(); 
        }

        let optionsLength = Object.keys(labelJson).length;

        for (let key in textareaContent) {
          if (optionsLength > 0 && labelJson[i].value !== null && labelJson[i].value.length > 1) {
            let editable = false;
            if (labelJson[i].value[1].key === 'editable' && labelJson[i].value[1].value === true) {
                editable = true;
            }
            textareaArray.push(
              <div className="textarea-container" index={i} key={i}>
                <p className="textarea-label">{labelJson[i].value[0].key === 'label' ? labelJson[i].value[0].value : key}</p>
                <TextareaAutosize className="textarea" aria-label="minimum height" rowsMin={3} key={i} id={key} placeholder="Minimum 3 rows" value={editable ? textareaContent[key] : ''} onChange={this.handleOnChange}>
                </TextareaAutosize>
              </div>
            )
            i++;
          } else {
            textareaArray.push(
              <div className="textarea-container" index={i} key={i}>
                <p className="textarea-label">{key}</p>
                <TextareaAutosize className="textarea" aria-label="minimum height" rowsMin={3} key={i} id={key} placeholder="Minimum 3 rows" value={textareaContent[key]} onChange={this.handleOnChange}>
                </TextareaAutosize>
              </div>
            )
            i++;
          }        
        }  
      }

        return (
          <Box >
            {textareaArray}
          </Box>  
        );
    }
  }


export default FeedEditorTab

//labelJson[i].value[1] && labelJson[i].value[1].key === 'editable' && labelJson[i].value[1].value === true ? 