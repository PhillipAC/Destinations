import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameRoute } from './models/game-route';
import { GameRouteService } from './services/game-route.service';
import { NgFor, NgIf } from '@angular/common';
import { GameConfigService } from './services/game-config.service';
import { DefaultConfigOption } from './enumerations/default-config-option';
import { OptionsComponent } from './options/options.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            NgFor,
            NgIf,
            OptionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  title: string = 'Destinations';
  tag: string = 'Places to go to';
  startNomenclature: string = "Start";
  stepNomenclature: string = "Step";
  endNomenclature: string = "Finish";
  route: GameRoute | undefined;

  constructor(private _gameConfigService: GameConfigService, 
    private _gameRouteService: GameRouteService){}

  ngOnInit(){
    this._gameRouteService.newRouteCreated$.subscribe((route) => this.route = route);
    this._gameConfigService.configLoaded$.subscribe((config) => {
      this.title = this._gameConfigService.getName;
        this.tag = this._gameConfigService.getTag;
        this.startNomenclature = this._gameConfigService.getStartNomenclature;
        this.stepNomenclature = this._gameConfigService.getStepNomenclature;
        this.endNomenclature = this._gameConfigService.getEndNomenclature;
        this._gameRouteService.generateRoute(1);
    })
    this._gameConfigService.loadDefault(DefaultConfigOption.Stalker)
      .subscribe(_ => this._gameRouteService.generateRoute(1));
  }
}
