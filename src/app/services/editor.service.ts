import { Injectable } from '@angular/core';
import { GameConfigService } from './game-config.service';
import { AreaEditor } from '../models/editor/area-editor';
import { LocationEditor } from '../models/editor/location-editor';
import { Observable, map, of } from 'rxjs';
import { ArrayHelper } from '../helpers/array-helper';
import { GameInfo } from '../models/game-info';
import { DefaultConfigOption } from '../enumerations/default-config-option';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  //The area editor with sub info
  public areas: AreaEditor[] = [];

  //The info about the game
  public gameInfo: GameInfo = new GameInfo();

  //Loads services need for component
  constructor(private _configService: GameConfigService) { 
  }

  //Async: Loads a configuration based on the currently loaded service.
  //Returns an AreaEditor based on service 
  public loadConfigFromService(): Observable<AreaEditor[]>{
    if(!this._configService.isLoaded){
      return this._configService.loadDefault(DefaultConfigOption.Stalker)
        .pipe<AreaEditor[]>(map(_ => {
          this.loadEditorService();
          return this.areas;
        }));
    }
    else{
      this.loadEditorService();
      return of(this.areas);
    }
  }

  //Adds a new Area
  public newArea(): void{
    this.areas.push(new AreaEditor(ArrayHelper.nextId(this.areas), "New Area", [], []));
  }

  //Adds a new location based on AreaId
  public newLocation(areaId: number){
    let area = ArrayHelper.selectById(this.areas, areaId);
    if(area != null){
      area.locations.push(new LocationEditor(ArrayHelper.nextId(area.locations), "New Location"));
    }
  }

  //Removes a location based on Id
  public removeLocation(locationId: number){
    this.areas.forEach(a => {
      ArrayHelper.removeById(a.locations, locationId);
    })
  }

  //Removes an Area and given Adjacent Areas based on Id
  public removeArea(areaId: number){
    this.areas.forEach(a => {
      ArrayHelper.removeFromArray(a.adjacentAreas, areaId);
    })
    ArrayHelper.removeById(this.areas, areaId);
  }

  //Adds an Adjacent Area based on AreaId and other (Adajacent) AreaId
  public addAdjacentArea(areaId: number, adjacentAreaId: number): void{
    let area = ArrayHelper.selectById(this.areas, areaId);
    let exists = area?.adjacentAreas.find(a => a == adjacentAreaId) != undefined;
    if(area != null && !exists){
      area.adjacentAreas.push(adjacentAreaId);
    }
  }

  //Removes Area based on AreaId and AdjacentAreaId
  public removeAdjacentArea(areaId: number, adjacentAreaId: number): boolean{
    let area = ArrayHelper.selectById(this.areas, areaId);
    if(area != null){
      return ArrayHelper.removeFromArray(area.adjacentAreas, adjacentAreaId);
    }
    return false;
  }

  //Saves the current config to the loaded config
  public saveToConfig(): void{
    this._configService.saveFromEditor(this.areas, this.gameInfo);
  }

  //Downloads the current config as a json file
  public download(): void{
    this._configService.download();
  }

  //Loads a config from a JSON file
  public loadFromJson(sJson: string) {
    this._configService.loadFromJson(sJson);
  }

  public getJson(): string{
    return this._configService.getJson();
  }

  //Loads the editor service based on the currently loaded config
  private loadEditorService(): void{
    let areaEditors: AreaEditor[] = [];
    let areas = this._configService.getAreas;
    for(var i = 0; i < areas.length; i++){
      let area = areas[i];
      let locations = this._configService.getLocationsByAreaId(area.id);
      let locationEditors: LocationEditor[] = [];
      for(var j = 0; j < locations.length; j++){
        let location = locations[j];
        let locationEditor = new LocationEditor(location.id, location.name);
        locationEditors.push(locationEditor);
      }
      let adjacentAreas = this._configService.getAdjacentAreasByAreaId(area.id).map(aa => aa.adjacentAreaId);
      areaEditors.push(new AreaEditor(area.id, area.name, locationEditors, adjacentAreas));
    }
    this.areas = areaEditors;
    this.gameInfo = this._configService.getGameInfo;
  }
}
