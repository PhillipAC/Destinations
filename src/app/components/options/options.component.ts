import { Component } from '@angular/core';
import { DefaultConfigOption } from '../../enumerations/default-config-option';
import { GameConfigService } from '../../services/game-config.service';
import { GameRouteService } from '../../services/game-route.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent {

  //The amount of middle destinations one has to go between
  public midDestinations: number = 1;

  //Loads services need for component
  constructor(private _gameConfigService: GameConfigService, 
    private _gameRouteService: GameRouteService){}

  //Creates a new route to move between
  public generateRound(): void {
    this._gameRouteService.generateRoute(this.midDestinations);
  }

  //Loads the game based on the configuration provided
  public loadGame(configOption: DefaultConfigOption): void {
    this._gameConfigService.loadDefault(configOption).subscribe();
  }

  //Returns a reference the the DefaultConfigOption enum
  public get defaultConfigOption(): typeof DefaultConfigOption {
    return DefaultConfigOption;
  }
}
