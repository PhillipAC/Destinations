import { AdjacentArea } from "../adjacent-area";
import { Area } from "../area";
import { GameInfo } from "../game-info";
import { Location } from "../location";

export class GameConfig {
    public gameInfo: GameInfo = new GameInfo();
    public version: number = 0;
    public areas: Area[] = [];
    public adjacentAreas: AdjacentArea[] = [];
    public locations: Location[] = [];
}
