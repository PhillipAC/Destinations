import { AdjacentArea } from "../adjacent-area";
import { Area } from "../area";
import { Destination } from "../destination";

export class GameConfig {
    public name: string = "";
    public version: number = 0;
    public gameTag: string = "";
    public areas: Area[] = [];
    public adjacentAreas: AdjacentArea[] = [];
    public destinations: Destination[] = [];
}
