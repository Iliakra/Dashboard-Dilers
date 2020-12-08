export const appInit = () => {
  return {
    type: 'APP_INIT',
  }
}

export const setStoreData = (data) => {
  return {
    type: 'SET_STORE_DATA',
    data:{
      ...data,
      dataLoaded:true,
      reloadData:false,
      loadDataError:false,
    },
  }
}

export const loadStoreDataError = (data) => {
  return {
    type: 'LOAD_STORE_DATA_ERROR',
    data:{
      ...data,
      dataLoaded:false,
      reloadData:false,
      loadDataError:true,
    },
  }
}

export const reloadStoreData = () => {
  return {
    type: 'RELOAD_STORE_DATA',
    data:{
      dataLoaded:false,
      reloadData:true,
      loadDataError:false,
    },
  }
}

export const waitingForReloadStoreData = () => {
  return {
    type: 'WAITING_FOR_RELOAD_STORE_DATA',
    data:{
      dataLoaded:false,
    },
  }
}
export const changeViewMode = (mode) => {
  return {
    type: 'CHANGE_VIEW_MODE',
    data:{
      mode,
    },
  }
}

export const setAppData = (data) => {
  return {
    type: 'SET_APP_DATA',
    data,
  }
}

export const setCurrenFrame = (index) => {
  return {
    type: 'SET_CURRENT_FRAME',
    data:{
      currentFrame:index,
    }
  }
}

export const setFormat = (format) => {
  return {
    type: 'SET_FORMAT',
    data:{
      format,
    }
  }
}

export const setSection = (section) => {
  return {
    type: 'SET_SECTION',
    data:{
      section,
    }
  }
}

export const setPublisher = (publisher) => {
  return {
    type: 'SET_PUBLISHER',
    data:{
      publisher,
    }
  }
}

export const setPlatform = (platform) => {
  return {
    type: 'SET_PLATFORM',
    data:{
      platform,
    }
  }
}

export const setFeed = (feed) => {
  return {
    type: 'SET_FEED',
    data:{
      feed,
    }
  }
}

export const setStatus = (status) => {
  return {
    type: 'SET_STATUS',
    data:{
      status,
    }
  }
}

export const setPassedView = (passedView) => {
  return {
    type: 'SET_PASSED_VIEW',
    data:{
      passedView,
    }
  }
}

export const setSortMode = (sortMode) => {
  return {
    type: 'SET_SORT_MODE',
    data:{
      sortMode,
    }
  }
}

export const clearFilters = () => {
  return {
    type: 'CLEAR_FILTERS',
    data:{
    }
  }
}



export const passCreative = (passed,name) => {
  return {
    type: 'PASS_CREATIVE',
    data:{
      passed,
      name,
    }
  }
}


export const setStorageData = (data) => {
  return {
    type: 'SET_STORAGE_DATA',
    data,
  }
}

export const saveStorageData = () => {
  return {
    type: 'SAVE_STORAGE_DATA',
    data:{
      saveStorageData:true,
      dataForStorageChanged:null,
    }
  }
}

export const storageDataSaved = () => {
  return {
    type: 'STORAGE_DATA_SAVED',
    data:{
      saveStorageData:false,
    }
  }
}

export const windowActivated = (hiddenTime) => {
  return {
    type: 'WINDOW_ACTIVATED',
    data:{
      windowIsVisible:true,
      hiddenTime,
      //Запустим процесс загрузки данных (он отключается если таб неактивен)
      dataLoaded:false,
      reloadData:true,
      loadDataError:false,
    }
  }
}

export const windowDeactivated = () => {
  return {
    type: 'WINDOW_DEACTIVATED',
    data:{
      windowIsVisible:false,
      hiddenTime:0,
    }
  }
}
