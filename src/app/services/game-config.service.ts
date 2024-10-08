import { Injectable } from '@angular/core';
import { DefaultConfigOption } from '../enumerations/default-config-option';
import { GameConfig } from '../models/configurations/game-config';
import { AdjacentArea } from '../models/adjacent-area';
import { Location } from '../models/location';
import { Area } from '../models/area';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, switchMap } from 'rxjs';
import { AreaEditor } from '../models/editor/area-editor';
import { GameInfo } from '../models/game-info';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
//Service used for getting info about the current configuration of the game
export class GameConfigService {
  private configLoadedObservable = new Subject<GameConfig>();
  public configLoaded$ = this.configLoadedObservable.asObservable();
  public ConfigKey: string = "Destinations.Configuration";

  private readonly _currentConfigVersion: number = 0;
  
  private _config: GameConfig | null = null;
  
  //Returns all info about the game
  public get getGameInfo(): GameInfo{
    if(this._config == null){
      return new GameInfo();
    }
    return this._config.gameInfo;
  }

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
    return this._config.gameInfo.name;
  }

  //Returns if the configuration is a cycle
  public get getIsCycle(): boolean{
    if(this._config == null){
      return false;
    }
    return this._config.gameInfo.isCycle;
  }

  //Returns the number of step counts
  public get getStepCount(): number{
    if(this._config == null || this._config.gameInfo.stepCount < 0){
      return 0;
    }
    return this._config.gameInfo.stepCount;
  }

  //Returns the tag of the configuration
  public get getTag(): string{
    if(this._config == null){
      return "";
    }
    return this._config.gameInfo.gameTag;
  }

  //Gets the nomenclature for the starting location
  public get getStartNomenclature(): string{
    if(this._config == null){
      return "";
    }
    return this._config.gameInfo.startNomenclature;
  }

  //Gets the nomenclature for the intermediate locations
  public get getStepNomenclature(): string{
    if(this._config == null){
      return "";
    }
    return this._config.gameInfo.stepNomenclature;
  }

  //Gets the nomenclature for the last location
  public get getEndNomenclature(): string{
    if(this._config == null){
      return "";
    }
    return this._config.gameInfo.endNomenclature;
  }

  //Returns if the configuration is loaded
  public isLoaded: boolean = false;

  constructor(private _httpClient: HttpClient, private _fileService: FileService) { }

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
      case DefaultConfigOption.CityWalk:
        path = "assets/game-configurations/city-walk.json";
        break;
      default:
        throw Error("Not a valid default configuration");
    }
    //Perform request the configuration
    return this._httpClient.get<GameConfig>(path)
          .pipe(switchMap((config) => {
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

  public loadFromJson(sJson: string): void {
    let config: GameConfig = JSON.parse(sJson);
    if(config != null)
    {
      this._config = config;
      this.isLoaded = true;
      this.configLoadedObservable.next(config);
      localStorage.setItem(this.ConfigKey, sJson);
    }
  }

  public saveFromEditor(areaEditors: AreaEditor[], gameInfo: GameInfo){
    console.log(areaEditors);
    let areas: Area[] = [];
    let locations: Location[] = [];
    let adjacentAreas: AdjacentArea[] = [];
    let version: number = this._currentConfigVersion;

    let areaIdMapping: [number, number][] = [];
    let locationIdMapping: [number, number][] = [];
    
    let j: number = 0;
    for(var i = 0; i < areaEditors.length; i++){
      areaIdMapping.push([areaEditors[i].id, i]);
      areaEditors[i].locations.forEach(le => {
        locationIdMapping.push([le.id, j]);
        j++;
      })
    }

    j = 0;
    areaEditors.forEach(ae => {
      let areaMapping = areaIdMapping.find(m => m[0] == ae.id);
      if(areaMapping == undefined){
        throw Error("Mapping was not found");
      }
      areas.push(new Area(areaMapping[1], ae.name));
      ae.locations.forEach(le => {
        let locationMapping = locationIdMapping.find(m => m[0] == le.id);
        let areaMapping = areaIdMapping.find(m => m[0] == ae.id);
        if(locationMapping == undefined || areaMapping == undefined){
          throw Error("Mapping was not found");
        }
        locations.push(new Location(locationMapping[1], areaMapping[1], le.name));
      });
      ae.adjacentAreas.forEach(aa => {
        let adjacentMapping = areaIdMapping.find(m => m[0] == aa);
        let areaMapping = areaIdMapping.find(m => m[0] == ae.id);
        if(adjacentMapping == undefined || areaMapping == undefined){
          throw Error("Mapping was not found")
        }
        adjacentAreas.push(new AdjacentArea(j, areaMapping[1], adjacentMapping[1]));
        j++;
      });
    })

    let gameConfig = new GameConfig;
    gameConfig.areas = areas;
    gameConfig.locations = locations;
    gameConfig.adjacentAreas = adjacentAreas;
    gameConfig.gameInfo = gameInfo;
    gameConfig.version = version;

    this._config = gameConfig;
    localStorage.setItem(this.ConfigKey, JSON.stringify(this._config));
    console.log(gameConfig);
    this.configLoadedObservable.next(gameConfig);
  }

  public download(): void{
    if(this._config != null)
      this._fileService.downloadJson(this._config);
  }

  public getLocationsByAreaId(areaId: number): Location[] {
    return this.getLocations.filter(l => l.areaId == areaId);
  }

  public getAdjacentAreasByAreaId(areaId: number): AdjacentArea[] {
    return this.getAdjacentAreas.filter(l => l.areaId == areaId);
  }

  public getJson(): string {
    return JSON.stringify(this._config);
  }

  public loadSavedConfig(): boolean {
    let rawData = localStorage.getItem(this.ConfigKey);
    if(rawData != null)
    {
      this.loadFromJson(rawData);
      return true;
    }
    return false;
  }
}
