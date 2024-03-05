import { Component, OnInit } from '@angular/core';
import { GameRoute } from '../../models/game-route';
import { GameConfigService } from '../../services/game-config.service';
import { GameRouteService } from '../../services/game-route.service';
import { DefaultConfigOption } from '../../enumerations/default-config-option';
import { NgFor, NgIf } from '@angular/common';
import { OptionsComponent } from '../options/options.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor,
            NgIf,
            FormsModule,
            RouterLink,
            OptionsComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  title: string = 'Destinations';
  tag: string = 'Places to go to';
  startNomenclature: string = "Start";
  stepNomenclature: string = "Step";
  endNomenclature: string = "Finish";
  route: GameRoute | undefined;
  round: number = 0;
  seed: string = "A3C2F8";

  //The amount of middle destinations one has to go between
  public midDestinations: number = 1;

  constructor(private _gameConfigService: GameConfigService, 
    private _gameRouteService: GameRouteService){}

  ngOnInit(){
    this._gameRouteService.newRouteCreated$.subscribe((route) => this.route = route);
    if(!this._gameConfigService.isLoaded){
      this._gameConfigService.loadDefault(DefaultConfigOption.Stalker)
        .subscribe(_ => this.loadGameData());
    }
    else{
      this.loadGameData();
    }
  }

  loadGameData(){
    this.title = this._gameConfigService.getName;
      this.tag = this._gameConfigService.getTag;
      this.startNomenclature = this._gameConfigService.getStartNomenclature;
      this.stepNomenclature = this._gameConfigService.getStepNomenclature;
      this.endNomenclature = this._gameConfigService.getEndNomenclature;
      this.generateRound();
  }

  //Creates a new route to move between
  public generateRound(): void {
    console.log(this.seed + this.round);
    this._gameRouteService.generateRoute(this.midDestinations, this.seed + this.round);
    this.round++;
  }
}
