import { Injectable } from '@angular/core';
import { GameConfigService } from './game-config.service';
import { AreaEditor } from '../models/editor/area-editor';
import { LocationEditor } from '../models/editor/location-editor';
import { Observable, map, of } from 'rxjs';
import { ArrayHelper } from '../helpers/array-helper';
import { GameInfo } from '../models/game-info';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  public areas: AreaEditor[] = [];
  public gameInfo: GameInfo = new GameInfo();

  constructor(private _configService: GameConfigService) { 
  }

  public loadConfigFromService(): Observable<AreaEditor[]>{
    console.log(this._configService.isLoaded);
    if(this._configService.isLoaded){
      this.loadEditorService();
      return of(this.areas);
    }
    return this._configService.configLoaded$.pipe<AreaEditor[]>(map(_ => 
      {
        this.loadEditorService();
        return this.areas;
      }));
  }

  public newArea(): void{
    this.areas.push(new AreaEditor(ArrayHelper.nextId(this.areas), "New Area", [], []));
  }

  public newLocation(areaId: number){
    let area = ArrayHelper.selectById(this.areas, areaId);
    if(area != null){
      area.locations.push(new LocationEditor(ArrayHelper.nextId(area.locations), "New Location"));
    }
  }

  public removeLocation(locationId: number){
    this.areas.forEach(a => {
      ArrayHelper.removeById(a.locations, locationId);
    })
  }

  public removeArea(areaId: number){
    this.areas.forEach(a => {
      ArrayHelper.removeFromArray(a.adjacentAreas, areaId);
    })
    ArrayHelper.removeById(this.areas, areaId);
  }

  public addAdjacentArea(areaId: number, adjacentAreaId: number): void{
    let area = ArrayHelper.selectById(this.areas, areaId);
    let exists = area?.adjacentAreas.find(a => a == adjacentAreaId) != undefined;
    if(area != null && !exists){
      area.adjacentAreas.push(adjacentAreaId);
    }
  }

  public removeAdjacentArea(areaId: number, adjacentAreaId: number): boolean{
    let area = ArrayHelper.selectById(this.areas, areaId);
    if(area != null){
      return ArrayHelper.removeFromArray(area.adjacentAreas, adjacentAreaId);
    }
    return false;
  }

  public saveToConfig(): void{
    this._configService.saveFromEditor(this.areas, this.gameInfo);
  }

  public download(): void{
    this._configService.download();
  }

  public loadFromJson(sJson: string) {
    this._configService.loadFromJson(sJson);
  }

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
