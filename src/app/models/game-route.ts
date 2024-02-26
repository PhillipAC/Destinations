import { Destination } from './destination';

export class GameRoute {
    constructor(public startLocation: Destination, public steps: Destination[], 
        public finalDestination: Destination){}
}
