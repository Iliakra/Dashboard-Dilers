let feedEditorReducer = (state={}, action) => {
  switch (action.type) {

    case 'OPEN_FEED_EDITOR': {
      return {
        ...state,
        feedsEditorisActive: true,
      };
    }

    case 'CLOSE_FEED_EDITOR':{
      return {
        ...state,
        feedsEditorisActive: false,
      }
    }

    default:
    return state
  }

}


export default feedEditorReducer
