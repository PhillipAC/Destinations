import { Component, OnInit } from '@angular/core';
import { AreaEditor } from '../../models/editor/area-editor';
import { NgFor } from '@angular/common';
import { BaseId } from '../../models/base/base-id';
import { LocationEditor } from '../../models/editor/location-editor';
import { FormsModule } from '@angular/forms';
import { GameConfigService } from '../../services/game-config.service';
import { EditorService } from '../../services/editor.service';
import { ArrayHelper } from '../../helpers/array-helper';
import { GameInfo } from '../../models/game-info';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    NgFor,
    FormsModule
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit{
  private _file: any = undefined;

  public get gameInfo(): GameInfo{
    return this._editorService.gameInfo
  }

  public get areas(): AreaEditor[]{
    return this._editorService.areas
  }

  public get arrayHelper(): typeof ArrayHelper {
    return ArrayHelper;
  }

  constructor(private _editorService: EditorService){}

  public ngOnInit(): void {
    this._editorService.loadConfigFromService().subscribe();
  }

  public hasFile() {
    return this._file != undefined;
  }

  public handleAdjacentAreaToggle(event: Event, areaId: number, adjacentAreaId: number): void{
    let removed = this._editorService.removeAdjacentArea(areaId, adjacentAreaId);
    if(!removed){
      this._editorService.addAdjacentArea(areaId, adjacentAreaId);
    }
  }

  public newLocation(areaId: number) {
    this._editorService.newLocation(areaId);
  }

  public removeLocation(locationId: number) {
    this._editorService.removeLocation(locationId);
  }

  public removeArea(areaId: number) {
    this._editorService.removeArea(areaId);
  }

  public newArea() {
    this._editorService.newArea();
  }

  public save(){
    this._editorService.saveToConfig();
  }

  public saveAndDownload(){
    this._editorService.saveToConfig();
    this._editorService.download();
  }

  public fileChanged($event: any) {
    this._file = $event.target.files[0]
  }

  public uploadConfig(){
    let fileReader: FileReader = new FileReader();
    fileReader.onload = (e) => {
      let sJson: any = fileReader.result;
      if(typeof(sJson) == 'string')
        this._editorService.loadFromJson(sJson);
        this.save();
    }
    fileReader.readAsText(this._file);
  }
}
