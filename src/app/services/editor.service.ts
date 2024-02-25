import { Injectable } from '@angular/core';
import { GameConfigService } from './game-config.service';
import { AreaEditor } from '../models/editor/area-editor';
import { LocationEditor } from '../models/editor/location-editor';
import { Observable, flatMap, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TmplAstInteractionDeferredTrigger } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  public areas: AreaEditor[] = [];

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
        console.log("test");
        this.loadEditorService();
        return this.areas;
      }));
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
    console.log(areas);
  }
}
