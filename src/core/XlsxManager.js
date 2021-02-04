import XLSX from 'xlsx';
import dirtyJson from 'dirty-json';

class XlsxManager {

  constructor() {
  }

  load(url,callback) {
    let oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = (e) => {
      let arraybuffer = oReq.response;
      let data = arraybuffer;
      let wb;
      let arr = this.fixXlsx(data);
      let btoaValue=btoa(arr);
      wb = XLSX.read(btoaValue, {type: 'base64'});
      callback(this.convertSheetsToTables(wb.Sheets));
    }
    oReq.send();
  }

  fixXlsx(data) {
    let o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    return o;
  }

  convertSheetsToTables(data) {
    let result={};
    for (let id in data) {

      if ((id.indexOf("<")===0)&&(id.indexOf(">")===id.length-1)) {
        continue;
      }
      let rows=[];
      let cells=data[id];
      console.log(cells);
      for (let cellId in cells) {
        let y=cellId.substr(1)-1;
        let x=cellId.substr(0,1);//cellId.charCodeAt(0)-("A").charCodeAt(0);
        if (rows[y]==null) {
          rows[y]=[]
        }
        rows[y][x]=cells[cellId].v;
      }
      
      rows.splice(0,1);
      let options = rows[0];
      rows.splice(0,1);
    
      let optionsArray = Object.values(options);
      optionsArray.splice(0,1);
      let finalOptionsData = [];
      if (optionsArray) {
        for (let i=0; i < optionsArray.length; i++) {
          let optionsItem=optionsArray[i].replace(/,\s*\}/gi,"}").replace(/,\s*\]/gi,"]");
          try {
            optionsItem = dirtyJson.parse(optionsItem);
            finalOptionsData.push(optionsItem);
          } catch (e) {
            // console.log();
          }
        }
      }
    
      if (rows.length>1) {
        let indexRow=(rows[0]);
        let indexRowKeys = Object.keys(indexRow);
        let lines=[];
      
        for (let i = 1; i < indexRowKeys.length; i++) {
          for (let j=1; j<rows.length; j++) {
            if (!(indexRowKeys[i] in rows[j])) {
              rows[j][indexRowKeys[i]] = '';
            }
          }         
        }

        for (let i = 1; i < rows.length; i++) {
          let row=rows[i];
          let fields={};
          for (let fieldId in row) {
            fields[indexRow[fieldId]]=row[fieldId];
          }
          lines.push(fields);
        }
        lines.push(finalOptionsData);
        result[id]=lines;
      }
    }
    
    return result;
  }

  write(url,data) {
    let dataJson = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log('OK');
      } 
    };
    xhr.send(dataJson);
  }

}
export default XlsxManager;
