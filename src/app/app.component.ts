import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameConfig } from './models/configurations/game-config';
import { GameRoute } from './models/game-route';
import { GameRouteService } from './services/game-route.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Location } from './models/location';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            HttpClientModule,
            CommonModule,
            NgFor,
            NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  title: string = 'Destinations';
  tag: string = 'Places to go to';
  route: GameRoute | undefined;

  constructor(private _httpClient: HttpClient, private _gameRouteService: GameRouteService){}

  ngOnInit(){
    this._httpClient.get<GameConfig>("../assets/game-configurations/stalker-indoors.json")
      .subscribe((config) => {
        config.locations.map<Location>(l => {
          l.area = config.areas.find(a => a.id == l.areaId);
          return l;
        });
        this.title = config.name;
        this.tag = config.gameTag;
        this._gameRouteService.loadConfig(config);
        this.route = this._gameRouteService.generateRoute(3);
      });
  }
}
