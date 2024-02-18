import { Injectable } from '@angular/core';
import { DefaultConfigOption } from '../enumerations/default-config-option';
import { GameConfig } from '../models/configurations/game-config';
import { AdjacentArea } from '../models/adjacent-area';
import { Location } from '../models/location';
import { Area } from '../models/area';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  
  private _config: GameConfig | null = null;

  public get getAdjacentAreas(): AdjacentArea[]{
    if(this._config == null){
      return [];
    }
    return this._config.adjacentAreas;
  }

  public get getLocations(): Location[]{
    if(this._config == null){
      return [];
    }
    return this._config.locations;
  }

  public get getAreas(): Area[]{
    if(this._config == null){
      return [];
    }
    return this._config.areas
  }

  public get getName(): string{
    if(this._config == null){
      return "";
    }
    return this._config.name;
  }

  public get getTag(): string{
    if(this._config == null){
      return "";
    }
    return this._config.gameTag;
  }

  isLoaded: boolean = false;

  constructor(private _httpClient: HttpClient) { }

  public loadDefault(option: DefaultConfigOption): Observable<boolean>{
    switch(option){
      default:
        return this._httpClient.get<GameConfig>("assets/game-configurations/stalker-indoors.json")
          .pipe(switchMap((config: GameConfig) => {
            config.locations.map<Location>(l => {
              l.area = config.areas.find(a => a.id == l.areaId);
              return l;
            });
            this._config = config;
            this.isLoaded = true;
            return of(true);
          }));
    }
  }
}
