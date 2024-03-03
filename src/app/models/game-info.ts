export class GameInfo {
    public name: string = "";
    public startNomenclature: string = "";
    public endNomenclature: string = "";
    public stepNomenclature: string = "";
    public gameTag: string = "";
    public stepCount: number = 1;
    public isCycle: boolean = false;

    constructor(){
        this.name = "New Game";
        this.gameTag = "Tag for the game";
        this.startNomenclature = "Start";
        this.stepNomenclature = "Destination";
        this.endNomenclature = "Finish";
        this.stepCount = 1;
        this.isCycle = false;
    }
}
