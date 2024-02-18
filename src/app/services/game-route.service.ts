import { Injectable } from '@angular/core';
import { GameConfig } from '../models/configurations/game-config';
import { Area } from '../models/area';
import { GameRoute } from '../models/game-route';
import { Location } from '../models/location';
import { AdjacentArea } from '../models/adjacent-area';

@Injectable({
  providedIn: 'root'
})
export class GameRouteService {

  private _config: GameConfig | null = null;
  private _areas: Area[] | null = null;
  private _locations: Location[] | null = null;
  private _adjacentAreas: AdjacentArea[] | null = null;
  

  constructor() { }

  loadConfig(config: GameConfig){
    this._config = config;
  }


  generateRoute(steps: number): GameRoute{
    if(this._config == null){
      throw new Error("No configuration has been loaded");
    }
    else{
      //An array to store the areas to visit
      let targetAreas: Area[] = [];
      //An array to store non-selected areas
      let areas: Area[] = [];

      //Determine the sequence of Areas to move between
      for(var i = 0; i < steps; i++){
        //If there are no areas to select from reset the list of areas
        if(areas.length == 0){
          //Create a copy of the areas so we can manipulate it without editing the source
          areas = Array.from(this._config.areas);
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
          let adjacentAreaIds = this._config.adjacentAreas
            .filter(aa => aa.areaId == lastArea.id)
            .map(aa => aa.adjacentAreaId);
          console.log(adjacentAreaIds);
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
        let optionalLocations = this._config.locations.filter(r => r.areaId == targetAreas[i].id);
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

      //Return the route
      return new GameRoute(start, targetLocations, stop);
    }
  }

  private selectRandomElement<T>(array: T[]): T{
    let index = Math.floor(Math.random()*array.length);
    return array[index];
  }
}
