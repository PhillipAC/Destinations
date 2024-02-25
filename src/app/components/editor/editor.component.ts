import { Component, OnInit } from '@angular/core';
import { AreaEditor } from '../../models/editor/area-editor';
import { NgFor } from '@angular/common';
import { BaseId } from '../../models/base/base-id';
import { LocationEditor } from '../../models/editor/location-editor';
import { FormsModule } from '@angular/forms';
import { GameConfigService } from '../../services/game-config.service';
import { EditorService } from '../../services/editor.service';
import { ArrayHelper } from '../../helpers/array-helper';

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
  public gameName: string = "New Game";
  public gameTag: string = "Tag for the game";
  public areas: AreaEditor[] = [
    new AreaEditor(0, "Upstairs", [new LocationEditor(0, "Bedroom"), new LocationEditor(1, "Bathroom")], [1]),
    new AreaEditor(1, "Ground Floor", [new LocationEditor(2, "Front Bedroom"), new LocationEditor(3, "Front Bathroom"), new LocationEditor(4, "Kitchen")], [])
  ];

  public get arrayHelper(): typeof ArrayHelper {
    return ArrayHelper;
  }

  constructor(private _editorService: EditorService){}

  public ngOnInit(): void {
    this._editorService.loadConfigFromService().subscribe(_ => {
      console.log(this._editorService.areas);
      this.areas = this._editorService.areas;
    });
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

  public handleAdjacentAreaToggle(event: Event, areaId: number, adjacentAreaId: number): void{
    let removed = this.removeAdjacentArea(areaId, adjacentAreaId);
    console.log(removed);
    if(!removed){
      this.addAdjacentArea(areaId, adjacentAreaId);
    }
  }

  public post(){
    console.log(this.areas);
  }
}
