import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import {
  changeViewMode,
  setCurrenFrame,
  setFormat,
  setSection,
  setPublisher,
  setPlatform,
  setFeed,
  setStatus,
  setPassedView,
  setSortMode,
  clearFilters,
  reloadStoreData,
} from '../actions/appActions';

import { openFeedsEditor } from '../actions/feedsEditorActions';

import {
  objectIsEmpty,
  exportCreatives,
  makeRequestUrl,
  downloadLink,
} from '../core/helpers.js';

import settings from '../configuration/Settings.js';

import { xls, filesaver } from 'xlszipsave';

class TopMenu extends Component {

  constructor(props) {
    super(props);
    this.state={
      viewStatus:{},

    };
    this.store = this.props.store;
    this.selectMode_changeHandler=this.selectMode_changeHandler.bind(this);
    this.selectFrame_changeHandler=this.selectFrame_changeHandler.bind(this);
    this.selectFormat_changeHandler=this.selectFormat_changeHandler.bind(this);
    this.selectSection_changeHandler=this.selectSection_changeHandler.bind(this);
    this.selectPublisher_changeHandler=this.selectPublisher_changeHandler.bind(this);
    this.selectPlatform_changeHandler=this.selectPlatform_changeHandler.bind(this);
    this.selectFeed_changeHandler=this.selectFeed_changeHandler.bind(this);
    this.selectStatus_changeHandler=this.selectStatus_changeHandler.bind(this);
    this.selectPassedView_changeHandler=this.selectPassedView_changeHandler.bind(this);
    this.selectSortMode_changeHandler=this.selectSortMode_changeHandler.bind(this);
    this.clear_buttonHandler=this.clear_buttonHandler.bind(this);
    this.reload_buttonHandler=this.reload_buttonHandler.bind(this);
    this.download_buttonHandler=this.download_buttonHandler.bind(this);
    this.openFeedsEditor=this.openFeedsEditor.bind(this);

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

  selectMode_changeHandler(event) {
    this.store.dispatch(
      changeViewMode(event.target.value)
    )
  }

  selectFrame_changeHandler(event) {
    this.store.dispatch(
      setCurrenFrame(event.target.value)
    )
  }

  selectFormat_changeHandler(event) {
    this.store.dispatch(
      setFormat(event.target.value)
    )
  }

  selectSection_changeHandler(event) {
    this.store.dispatch(
      setSection(event.target.value)
    )
  }

  selectPublisher_changeHandler(event) {
    this.store.dispatch(
      setPublisher(event.target.value)
    )
  }

  selectPlatform_changeHandler(event) {
    this.store.dispatch(
      setPlatform(event.target.value)
    )
  }

  selectFeed_changeHandler(event) {
    this.store.dispatch(
      setFeed(event.target.value)
    )
  }

  selectStatus_changeHandler(event) {
    this.store.dispatch(
      setStatus(event.target.value)
    )
  }

  selectPassedView_changeHandler(event) {
    if (event.target.value==="toXls") {
      const sheet = {
        data: exportCreatives(this.state.creatives,this.state.passStatus)
      };
      // console.log(sheet);
      xls(sheet).then(blob => {
        filesaver.saveAs(blob, settings.excelFileNameTemplate.replace("$campName$",this.state.name.split("/").join("_")));
      });
    } else {
      this.store.dispatch(
        setPassedView(event.target.value)
      )
    }
  }

  selectSortMode_changeHandler(event) {
    this.store.dispatch(
      setSortMode(event.target.value)
    )
  }

  clear_buttonHandler(event) {
    this.store.dispatch(
      clearFilters()
    )
  }

  reload_buttonHandler(event) {
    this.store.dispatch(
      reloadStoreData()
    )
  }

  download_buttonHandler(event) {
    let campUrl=makeRequestUrl(settings.requestId.download,this.state.name);
    downloadLink(campUrl);
  }

  getSortedItems(itemsObject) {
    let items=[]
    let sum=0
    for (let name in itemsObject) {
      items.push({
        count:itemsObject[name],
        name
      })
      sum+=itemsObject[name];
    }

    items.sort((a,b)=>{
      if (a.name>b.name) return 1;
      return -1;
    })

    return [items, sum];

  }

  openFeedsEditor(event) {
    this.store.dispatch(
      openFeedsEditor()
    )
  }



  render() {
    // let isSelected=false;

    let creativeCount=0;
    if (this.state.creatives) {
      creativeCount = Object.keys(this.state.creatives).length;
    }

    let children = [];
    children.push(this.props.children);

    children.push(
      <select key="SelectMode" value={this.state.viewStatus.mode} onChange={this.selectMode_changeHandler}>
        <option value="frames">Просмотр кадров</option>
        <option value="demo">Просмотр демо</option>
        <option value="backup">Просмотр заглушек</option>
      </select>
    );


    if (this.state.viewStatus.mode==="frames") {
      let options=[];
      for (let i = 0; i < this.state.frameCount; i++) {
        options.push(
            <option key={"Frame"+i} value={i}>Кадр {i+1}</option>
        );
      }
      let select=React.createElement(
        'select',
        {
          key:'SelectFrame',
          id:'SelectFrame',
          value:this.state.viewStatus.currentFrame,
          onChange:this.selectFrame_changeHandler,
        },
        options
      );
      children.push(
        select
      );
    }


    if ((this.state.formats) && (!objectIsEmpty(this.state.formats))) {
      let hasSimple=0;
      let hasRubber=0;

      let hasSquare=0;
      let hasVertical=0;
      let hasHorizontal=0;
      let all=0

      let uniqueFormats={}

      for (let name in this.state.formats) {
        let format=this.state.formats[name];
        let params=format.width+"_"+format.height+"_"+format.isRubber;
        let title=(format.isRubber)?"100%x"+format.height+"("+format.width+")":format.width+"x"+format.height;

        if (uniqueFormats[params]) {
          uniqueFormats[params].count+=format.count;
        } else {
          uniqueFormats[params]={
            ...format,
            params,
            title,
          }
        }
        all+=format.count;
        if (format.isRubber) {
          hasRubber+=format.count;
        } else {
          hasSimple+=format.count;
          let ratio=format.width/format.height;
          if ((ratio>0.7)&&
              (ratio<1.3)) {
            hasSquare+=format.count;
          }
          if (ratio<=0.7) {
            hasVertical+=format.count;
          }
          if (ratio>=1.3) {
            hasHorizontal+=format.count;
          }
        }
      }

      let formats=[]
      for (let params in uniqueFormats) {
        formats.push(uniqueFormats[params]);
      }

      formats.sort((a,b)=>{

        if (a.isRubber>b.isRubber) return 1;
        if (a.isRubber<b.isRubber) return -1;

        if (a.width*a.height>b.width*b.height) return 1;
        if (a.width*a.height<b.width*b.height) return -1;

        if (a.width*a.height>b.width*b.height) return 1;
        if (a.width*a.height<b.width*b.height) return -1;

        if (a.width>b.width) return 1;
        if (a.width<b.width) return -1;
        if (a.height>b.height) return 1;
        if (a.height<b.height) return -1;

        return -1;
      })

      let options=[];
      options.push(
          <option key={"all"} value={"all"}>Все форматы ({formats.length}/{all})</option>
      );

      for (let i = 0; i < formats.length; i++) {
        let format=formats[i];
        options.push(
            <option key={format.params} value={format.params}>{format.title+" ("+format.count+")"}</option>
        );
      }

      if (hasSimple) {
        options.push(
            <option key={"simple"} value={"simple"}>Простые ({hasSimple})</option>
        );
      }
      if (hasSquare) {
        options.push(
            <option key={"square"} value={"square"}>Квадратные ({hasSquare})</option>
        );
      }
      if (hasVertical) {
        options.push(
            <option key={"vertical"} value={"vertical"}>Вертикальные ({hasVertical})</option>
        );
      }
      if (hasHorizontal) {
        options.push(
            <option key={"horizontal"} value={"horizontal"}>Горизонтальные ({hasHorizontal})</option>
        );
      }
      if (hasRubber) {
        options.push(
            <option key={"rubber"} value={"rubber"}>Тянущиеся ({hasRubber})</option>
        );
      }


      let select=React.createElement(
        'select',
        {
          key:'SelectFormat',
          id:'SelectFormat',
          value:this.state.viewStatus.format,
          onChange:this.selectFormat_changeHandler,
        },
        options
      );
      children.push(
        select
      );
    }


    if ((this.state.sections) && (!objectIsEmpty(this.state.sections))) {
      let [sections, numInSections]=this.getSortedItems(this.state.sections);

      let options=[];
      options.push(
          <option key={"all"} value={"all"}>Разделы ({sections.length+1})</option>
      );

      options.push(
          <option key={"main"} value={"main"}>Основной ({creativeCount-numInSections})</option>
      );
      for (let i = 0; i < sections.length; i++) {
        let section=sections[i];
        options.push(
            <option key={section.name} value={section.name}>{section.name+" ("+section.count+")"}</option>
        );
      }
      let select=React.createElement(
        'select',
        {
          key:'SelectSection',
          id:'SelectSection',
          value:this.state.viewStatus.section,
          onChange:this.selectSection_changeHandler,
        },
        options
      );
      children.push(
        select
      );
    }

    if ((this.state.publishers) && (!objectIsEmpty(this.state.publishers))){
      let [publishers,numInPublishers]=this.getSortedItems(this.state.publishers);
      let options=[];
      options.push(
          <option key={"all"} value={"all"}>Площадки ({publishers.length})</option>
      );
      for (let i = 0; i < publishers.length; i++) {
        let publisher=publishers[i];
        options.push(
            <option key={publisher.name} value={publisher.name}>{publisher.name+" ("+publisher.count+")"}</option>
        );
      }
      let select=React.createElement(
        'select',
        {
          key:'SelectPublisher',
          id:'SelectPublisher',
          value:this.state.viewStatus.publisher,
          onChange:this.selectPublisher_changeHandler,
        },
        options
      );
      children.push(
        select
      );
    }


    if ((this.state.platforms) && (!objectIsEmpty(this.state.platforms))) {
      let [platforms,numInPlatforms]=this.getSortedItems(this.state.platforms);
      let options=[];
      options.push(
          <option key={"all"} value={"all"}>Платформы ({platforms.length})</option>
      );
      for (let i = 0; i < platforms.length; i++) {
        let platform=platforms[i];
        options.push(
            <option key={platform.name} value={platform.name}>{platform.name+" ("+platform.count+")"}</option>
        );
      }
      let select=React.createElement(
        'select',
        {
          key:'SelectPlatform',
          id:'SelectPlatform',
          value:this.state.viewStatus.platform,
          onChange:this.selectPlatform_changeHandler,
        },
        options
      );
      children.push(
        select
      );
    }


    if ((this.state.feeds) && (!objectIsEmpty(this.state.feeds))){
      let [feeds,numInFeeds]=this.getSortedItems(this.state.feeds);
      let options=[];
      options.push(
          <option key={"all"} value={"all"}>Фиды ({feeds.length})</option>
      );
      for (let i = 0; i < feeds.length; i++) {
        let feed=feeds[i];
        options.push(
            <option key={feed.name} value={feed.name}>{feed.name+" ("+feed.count+")"}</option>
        );
      }
      let select=React.createElement(
        'select',
        {
          key:'SelectFeed',
          id:'SelectFeed',
          value:this.state.viewStatus.feed,
          onChange:this.selectFeed_changeHandler,
        },
        options
      );
      children.push(
        select
      );
    }

    if ((this.state.statuses) && (!objectIsEmpty(this.state.statuses))){
      children.push(
        <select key="SelectStatus" value={this.state.viewStatus.status} onChange={this.selectStatus_changeHandler}>
          <option value={"all"}>Статусы</option>
          <option value="completed" style={{color:settings.statuses["completed"].color}}>{settings.statuses["completed"].title+" ("+this.state.statuses["completed"]+")"}</option>
          <option value="empty" style={{color:settings.statuses["empty"].color}}>{settings.statuses["empty"].title+" ("+this.state.statuses["empty"]+")"}</option>
          <option value="building" style={{color:settings.statuses["building"].color}}>{settings.statuses["building"].title+" ("+this.state.statuses["building"]+")"}</option>
          <option value="waitingForBuilding" style={{color:settings.statuses["waitingForBuilding"].color}}>{settings.statuses["waitingForBuilding"].title+" ("+this.state.statuses["waitingForBuilding"]+")"}</option>
          <option value="waitingForRebuilding" style={{color:settings.statuses["waitingForRebuilding"].color}}>{settings.statuses["waitingForRebuilding"].title+" ("+this.state.statuses["waitingForRebuilding"]+")"}</option>
          <option value="failed" style={{color:settings.statuses["failed"].color}}>{settings.statuses["failed"].title+" ("+this.state.statuses["failed"]+")"}</option>
          <option value="aborted" style={{color:settings.statuses["aborted"].color}}>{settings.statuses["aborted"].title+" ("+this.state.statuses["aborted"]+")"}</option>
          <option value="paused" style={{color:settings.statuses["paused"].color}}>{settings.statuses["paused"].title+" ("+this.state.statuses["paused"]+")"}</option>
        </select>
      );
    }

    children.push(
      <select key="SelectPassedView" value={this.state.viewStatus.passedView} onChange={this.selectPassedView_changeHandler}>
        <option value="all">Рецензии</option>
        <option value="passed">Только принятые</option>
        <option value="nonpassed">Только непринятые</option>
        <option value="toXls">Экспорт в Excel...</option>
      </select>
    );

    children.push(
      <select key="SelectSortMode" value={this.state.viewStatus.sortMode} onChange={this.selectSortMode_changeHandler}>
        <option value="format">Размер &#x25B2;</option>
        <option value="formatDown">Размер &#x25BC;</option>
        <option value="date">Время &#x25B2;</option>
        <option value="dateDown">Время &#x25BC;</option>
      </select>
    );

    if (!settings.isLocal) {
      children.push(
        <div key="download" className="menu-button" onClick={this.download_buttonHandler}>Скачать</div>
      );
    }

    children.push(
      <div key="clear" className="menu-button" onClick={this.clear_buttonHandler}>Сбросить фильтры</div>
    );

    children.push(
      <div key="reload" className="menu-button" onClick={this.reload_buttonHandler}>Обновить</div>
    );

    if (
      (this.state.modifyFeeds)&&(this.state.modifyFeeds.length>0)&&
      (!settings.isLocal)
    ) {
      children.push(
        <Button
          key="feedEditorButton"
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "grey",
            margin: 5,
            padding: 5,
            fontSize: 12}}
          onClick={this.openFeedsEditor}
        >
        Контент
        </Button>
      )
    }
 


    return React.createElement(
      'div',
      { id:'TopMenu',
      },
      children
      );
  }



}

export default TopMenu;
