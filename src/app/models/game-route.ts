import {Location} from '../models/location';

export class GameRoute {
    constructor(public startLocation: Location, public steps: Location[], 
        public finalDestination: Location){}
}
