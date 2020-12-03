import settings from './../configuration/Settings'
import ReactDOM from 'react'

let mainReducerController = (state={}, action) => {

    // console.log("mainReducer",action);

    switch (action.type) {

      case 'APP_INIT': {
        return {
          ...state,
          ...settings.defaultState,
          passStatus:{},
        }
      }

      // case 'APP_LOADING': {
      //   return {
      //     ...state,
      //   }
      // }
      //
      // case 'APP_START': {
      //   return {
      //     ...state,
      //   }
      // }
      case 'WAITING_FOR_RELOAD_STORE_DATA':
      case 'STORAGE_DATA_SAVED':
      case 'SAVE_STORAGE_DATA':
      case 'SET_STORAGE_DATA':
      case 'LOAD_STORE_DATA_ERROR':
      case 'RELOAD_STORE_DATA':
      case 'SET_STORE_DATA':
      case 'WINDOW_ACTIVATED':
      case 'WINDOW_DEACTIVATED':{
        return {
          ...state,
          ...action.data,
        }
      }

      case 'CHANGE_VIEW_MODE':
      case 'SET_CURRENT_FRAME':
      case 'SET_FORMAT':
      case 'SET_SECTION':
      case 'SET_PUBLISHER':
      case 'SET_PLATFORM':
      case 'SET_FEED':
      case 'SET_STATUS':
      case 'SET_PASSED_VIEW':
      case 'SET_SORT_MODE':{
        let viewStatus={
          ...state.viewStatus,
          ...action.data,
        }
        return {
          ...state,
          dataForStorageChanged:true,
          viewStatus,
        }
      }

      case 'CLEAR_FILTERS':{
        let viewStatus={
          ...state.viewStatus,
          format:"all",
          section:"all",
          publisher:"all",
          platform:"all",
          feed:"all",
          status:"all",
          passedView:"all",
        }
        return {
          ...state,
          dataForStorageChanged:true,
          viewStatus,
        }
      }

      case 'PASS_CREATIVE': {
        let passStatus=state.passStatus;
        passStatus[action.data.name]=action.data.passed;
        return {
          ...state,
          dataForStorageChanged:true,
          passStatus,
        }
      }

      case 'DILER_FORM_ACTIVATED': {
        //let hidden = action.data.hidden;
        let open = action.data.openDialog;
        return {
          ...state,
          setOpen: open,
        };
      }

      case 'CHANGE_DILER_TABS':{
        let value = action.data.value;
        return {
          ...state,
          tabValue: value,
        }
      }

      case 'DILER_FORM_CLOSE':{
        return {
          ...state,
          setOpen: false,
        }
      }

      case 'DELETE_TEXTAREA':{
        let index = action.data.index;
        let activeTab = action.data.activeTab;
        let feedsContent = state.feedsContent.slice();
        feedsContent[activeTab].splice(index,1);
        return {
          ...state,
          feedsContent
        }
      }

      case 'ADD_TEXTAREA':{
        let feedsContent = state.feedsContent.slice();
        feedsContent[action.data.index_1].push("njnj");
        return {
          ...state,
          feedsContent
        }
      }

      default:
        return state
    }
}

const mainReducer = (state={}, action) => {

  if (action.extraAction) {
    state = mainReducer(state,action.extraAction);
  }

  state = mainReducerController(state,action);

  return state;
}


export default mainReducer
