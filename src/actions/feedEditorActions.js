export const openFeedEditor = () => {
    return {
      type: 'FEED_EDITOR_OPEN',
      data: {openDialog: true},
    }
  }
  
  export const changeFeedEditorTab = (newValue) => {
    return {
      type: 'FEED_EDITOR_CHANGE_TABS',
      data: {value: newValue},
    }
  }
  
  export const closeFeedEditor = () => {
    return {
      type: 'FEED_EDITOR_CLOSE',
    }
  }
  
  export const deleteFeedEditorTab = () => {
    return {
      type: 'FEED_EDITOR_DELETE_TAB',
    }
  }
  
  export const addFeedEditorTab = (activeTab) => {
    return {
      type: 'FEED_EDITOR_ADD_TAB',
      data: {
        index_1: activeTab
      }
    }
  }