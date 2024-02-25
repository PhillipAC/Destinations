import { Injectable } from '@angular/core';
import { DefaultConfigOption } from '../enumerations/default-config-option';
import { GameConfig } from '../models/configurations/game-config';
import { AdjacentArea } from '../models/adjacent-area';
import { Location } from '../models/location';
import { Area } from '../models/area';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//Service used for getting info about the current configuration of the game
export class GameConfigService {
  
  private configLoadedObservable = new Subject<GameConfig>();
  public configLoaded$ = this.configLoadedObservable.asObservable();

  private _config: GameConfig | null = null;

  //Returns all adjancent areas
  public get getAdjacentAreas(): AdjacentArea[]{
    if(this._config == null){
      return [];
    }
    return this._config.adjacentAreas;
  }

  //Returns all locations
  public get getLocations(): Location[]{
    if(this._config == null){
      return [];
    }
    return this._config.locations;
  }

  //Returns all areas
  public get getAreas(): Area[]{
    if(this._config == null){
      return [];
    }
    return this._config.areas
  }

  //Returns the name of the configuration
  public get getName(): string{
    if(this._config == null){
      return "";
    }
    return this._config.name;
  }

  //Returns the tag of the configuration
  public get getTag(): string{
    if(this._config == null){
      return "";
    }
    return this._config.gameTag;
  }

  //Gets the nomenclature for the starting location
  public get getStartNomenclature(): string{
    if(this._config == null){
      return "";
    }
    return this._config.startNomenclature;
  }

  //Gets the nomenclature for the intermediate locations
  public get getStepNomenclature(): string{
    if(this._config == null){
      return "";
    }
    return this._config.stepNomenclature;
  }

  //Gets the nomenclature for the last location
  public get getEndNomenclature(): string{
    if(this._config == null){
      return "";
    }
    return this._config.endNomenclature;
  }

  //Returns if the configuration is loaded
  public isLoaded: boolean = false;

  constructor(private _httpClient: HttpClient) { }

  //Loads a new configuration into the system
  public loadDefault(option: DefaultConfigOption): Observable<boolean>{
    //Create a default 
    let path = "";
    //Determine the path based on what configuration was selected
    switch(option){
      case DefaultConfigOption.Stalker:
        path = "assets/game-configurations/stalker-indoors.json";
        break;
      case DefaultConfigOption.Tag:
        path = "assets/game-configurations/tag.json";
        break;
      default:
        throw Error("Not a valid default configuration");
    }
    //Perform request the configuration
    return this._httpClient.get<GameConfig>(path)
          .pipe(switchMap((config) => {
            //Load area info for each location
            config.locations.map<Location>(l => {
              l.area = config.areas.find(a => a.id == l.areaId);
              return l;
            });
            //Set the configuration
            this._config = config;
            //Set that a configuration has been loaded to true
            this.isLoaded = true;
            //publish that a new configuration has been loaded
            this.configLoadedObservable.next(this._config);
            //return that something has been loaded
            return of(true);
          }));
  }

  public getLocationsByAreaId(areaId: number): Location[] {
    return this.getLocations.filter(l => l.areaId == areaId);
  }

  public getAdjacentAreasByAreaId(areaId: number): AdjacentArea[] {
    return this.getAdjacentAreas.filter(l => l.areaId == areaId);
  }
}
