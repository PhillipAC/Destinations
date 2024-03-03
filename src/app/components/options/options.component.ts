import { Component } from '@angular/core';
import { DefaultConfigOption } from '../../enumerations/default-config-option';
import { GameConfigService } from '../../services/game-config.service';
import { GameRouteService } from '../../services/game-route.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent {

  //Loads services need for component
  constructor(private _gameConfigService: GameConfigService){}

  //Loads the game based on the configuration provided
  public loadGame(configOption: DefaultConfigOption): void {
    this._gameConfigService.loadDefault(configOption).subscribe();
  }

  //Returns a reference the the DefaultConfigOption enum
  public get defaultConfigOption(): typeof DefaultConfigOption {
    return DefaultConfigOption;
  }
}
