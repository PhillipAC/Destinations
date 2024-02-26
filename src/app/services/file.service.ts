import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  public downloadJson(obj: any){
    const sJson = JSON.stringify(obj);
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/json;charset=UTF-8,${encodeURIComponent(sJson)}`);
    element.setAttribute('download', 'game-config.dest');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
