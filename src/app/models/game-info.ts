export class GameInfo {

    constructor(
        public name: string = "New Game",
        public gameTag: string = "Tag for the game",
        public startNomenclature: string = "Start",
        public stepNomenclature: string = "Destination",
        public endNomenclature: string = "Finish",
        public stepCount: number = 1,
        public isCycle: boolean = false,
        public startUseSeed: boolean = false,
        public endUseSeed: boolean = false,
        public stepUseSeed: boolean = false
    ){}
}
