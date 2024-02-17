import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameConfig } from './models/configurations/game-config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  title: string = 'Destinations';
  tag: string = 'Places to go to';

  constructor(private _httpClient: HttpClient){}

  ngOnInit(){
    this._httpClient.get("../assets/game-configurations/stalker-indoors.json")
      .subscribe((config) => {
        let parsedConfig: GameConfig = new GameConfig();
        Object.assign(parsedConfig, config);
        this.title = parsedConfig.name;
        this.tag = parsedConfig.gameTag;
        console.log(parsedConfig);
      });
  }
}
