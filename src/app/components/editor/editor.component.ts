import { Component, Input, OnInit } from '@angular/core';
import { AreaEditor } from '../../models/editor/area-editor';
import { NgFor, NgIf } from '@angular/common';
import { BaseId } from '../../models/base/base-id';
import { LocationEditor } from '../../models/editor/location-editor';
import { FormsModule } from '@angular/forms';
import { GameConfigService } from '../../services/game-config.service';
import { EditorService } from '../../services/editor.service';
import { ArrayHelper } from '../../helpers/array-helper';
import { GameInfo } from '../../models/game-info';
import { RouterLink } from '@angular/router';
import { OptionsComponent } from '../options/options.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    OptionsComponent,
    FormsModule
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit{

  private _file: any = undefined;
  
  public jsonConfig: string | null = null;

  //Return the GmaeInfo from the Editor Service
  public get gameInfo(): GameInfo{
    return this._editorService.gameInfo
  }

  //Returns the AreaEditors from the Editor Service
  public get areas(): AreaEditor[]{
    return this._editorService.areas
  }

  //Makes the ArrayHelper public for the UI
  public get arrayHelper(): typeof ArrayHelper {
    return ArrayHelper;
  }

  //Loads services need for component
  constructor(private _editorService: EditorService,
              private _gameConfigService: GameConfigService){}

  //Requests that the current config is loaded
  public ngOnInit(): void {
    this._editorService.loadConfigFromService().subscribe();
    this._gameConfigService.configLoaded$.subscribe(_ => 
      this._editorService.loadConfigFromService().subscribe())
  }

  //Returns if a file has been selected
  public hasFile() {
    return this._file != undefined;
  }

  //Removes or add an adjacent based on the current state of it
  public handleAdjacentAreaToggle(event: Event, areaId: number, adjacentAreaId: number): void{
    let shouldAdd = (event.target as any).checked as boolean;
    if(shouldAdd){
      this._editorService.addAdjacentArea(areaId, adjacentAreaId);
    }
    else{
      this._editorService.removeAdjacentArea(areaId, adjacentAreaId);
    }
  }

  //Adds a new location to an area
  public newLocation(areaId: number) {
    this._editorService.newLocation(areaId);
  }

  //Removes a location from an area
  public removeLocation(locationId: number) {
    this._editorService.removeLocation(locationId);
  }

  //Removes an area
  public removeArea(areaId: number) {
    this._editorService.removeArea(areaId);
  }

  //Adds a new area
  public newArea() {
    this._editorService.newArea();
  }

  //Saves the current configuration
  public save(){
    this._editorService.saveToConfig();
  }

  //Gets the JSON version of the configuration
  public getJSON(){
    this.jsonConfig = this._editorService.getJson();
  }

  //Saves the current configuration and downloads a file version
  public saveAndDownload(){
    this._editorService.saveToConfig();
    this._editorService.download();
  }

  //Fired when the file selected changes
  public fileChanged($event: any): void {
    this._file = $event.target.files[0];
    let fileReader: FileReader = new FileReader();
    fileReader.onload = (e) => {
      let sJson: any = fileReader.result;
      if(typeof(sJson) == 'string')
        this._editorService.loadFromJson(sJson);
        this.save();
    }
    fileReader.readAsText(this._file);
  }

  public loadJSON() 
  {
    if(this.jsonConfig != null)
      this._editorService.loadFromJson(this.jsonConfig);
  }

  //Returns all areas that do not contain the given id
  public adjacentAreaOptions(id: number): AreaEditor[]{
    return this._editorService.areas.filter(a => a.id != id);
  }
}