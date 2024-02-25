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

  public midDestinations: number = 1;

  constructor(private _gameConfigService: GameConfigService, 
    private _gameRouteService: GameRouteService){}

  generateRound() {
    this._gameRouteService.generateRoute(this.midDestinations);
  }

  loadGame(configOption: DefaultConfigOption) {
    this._gameConfigService.loadDefault(configOption).subscribe();
  }

  public get defaultConfigOption(): typeof DefaultConfigOption {
    return DefaultConfigOption;
  }
}
