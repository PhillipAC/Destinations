import { Injectable } from '@angular/core';
import { GameConfig } from '../models/configurations/game-config';
import { Area } from '../models/area';
import { GameRoute } from '../models/game-route';
import { Location } from '../models/location';
import { AdjacentArea } from '../models/adjacent-area';
import { GameConfigService } from './game-config.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//Service used for generate routes based on loaded configuration
export class GameRouteService {

  private newRouteCreatedObserver = new Subject<GameRoute>();

  //Published any time a new route is generated
  public newRouteCreated$ = this.newRouteCreatedObserver.asObservable();

  constructor(private _gameConfigService: GameConfigService) { }

  // Creates a new route based on the loaded configuration
  // param(steps): the number of destinations between the start and end location
  public generateRoute(steps: number): GameRoute{
    //If no configuration is loaded throw an error
    if(!this._gameConfigService.isLoaded){
      throw new Error("No configuration has been loaded");
    }
    else{
      //An array to store the areas to visit
      let targetAreas: Area[] = [];
      //An array to store non-selected areas
      let areas: Area[] = [];

      //Determine the sequence of Areas to move between
      for(var i = 0; i < steps+2; i++){
        //If there are no areas to select from reset the list of areas
        if(areas.length == 0){
          //Create a copy of the areas so we can manipulate it without editing the source
          areas = Array.from(this._gameConfigService.getAreas);
        }
        //Make an array to store areas that are options to choose from
        let optionalAreas: Area[] = [];
        //If this is the first area let any area be an option for starting
        //Else determine what are valid areas to choose between
        if(targetAreas.length == 0){
          optionalAreas = areas;
        }
        else{
          //Determine what the last area to visit is
          let lastArea: Area = targetAreas[targetAreas.length -1];
          //Find all the IDs of areas that are adjacent to the last area visited
          let adjacentAreaIds = this._gameConfigService.getAdjacentAreas
            .filter(aa => aa.areaId == lastArea.id)
            .map(aa => aa.adjacentAreaId);
          //Find all areas whose IDs do not exist in the list of adjacent areas
          optionalAreas = areas
            .filter(a => adjacentAreaIds.findIndex(id => id == a.id) == -1 && a.id != lastArea.id);
          //If there are no valid options chooose from all areas that have not been chosen
          if(optionalAreas.length == 0){
              optionalAreas = areas;
          }
        }
        //Select a random area from the optional areas
        let targetArea: Area = this.selectRandomElement<Area>(optionalAreas);
        //Remove the selected area from the list of future available areas
        areas = areas.filter(a => a.id != targetArea.id);
        //Add the area to the areas to visit
        targetAreas.push(targetArea);
      }

      //Create an array to store the locations to visit
      let targetLocations = [];

      //Loop over every area in order
      for(var i = 0; i < targetAreas.length; i++){
        //Find all locations in that area
        let optionalLocations = this._gameConfigService.getLocations.filter(l => l.areaId == targetAreas[i].id);
        //Select a random location
        targetLocations.push(this.selectRandomElement<Location>(optionalLocations));
      }

      //Get the first location for the starting area
      let start = targetLocations.shift();
      //Get the last location for the ending area
      let stop = targetLocations.pop();

      //Validate that you at least had two locations
      if(start == undefined || stop == undefined){
        throw Error("Issue with creating route occured");
      }

      //Bundle the new route
      let gameRoute = new GameRoute(start, targetLocations, stop);

      //Publish the new route
      this.newRouteCreatedObserver.next(gameRoute);

      //Return the route
      return new GameRoute(start, targetLocations, stop);
    }
  }

  //Selects a random element from an array
  //param(T): The type of elements in the array
  //param(array): The array to choose a random element of
  private selectRandomElement<T>(array: T[]): T{
    let index = Math.floor(Math.random()*array.length);
    return array[index];
  }
}
