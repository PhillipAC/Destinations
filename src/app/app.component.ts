import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameRoute } from './models/game-route';
import { GameRouteService } from './services/game-route.service';
import { NgFor, NgIf } from '@angular/common';
import { GameConfigService } from './services/game-config.service';
import { DefaultConfigOption } from './enumerations/default-config-option';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            NgFor,
            NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  title: string = 'Destinations';
  tag: string = 'Places to go to';
  route: GameRoute | undefined;

  constructor(private _gameConfigService: GameConfigService, 
    private _gameRouteService: GameRouteService){}

  ngOnInit(){
    this._gameConfigService.loadDefault(DefaultConfigOption.Stalker)
      .subscribe(_ => {
        this.title = this._gameConfigService.getName;
        this.tag = this._gameConfigService.getTag;
        this.route = this._gameRouteService.generateRoute(1);
      });
  }
}
