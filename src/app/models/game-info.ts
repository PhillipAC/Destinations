export class GameInfo {
    public name: string = "";
    public startNomenclature: string = "";
    public endNomenclature: string = "";
    public stepNomenclature: string = "";
    public gameTag: string = "";

    constructor(){
        this.name = "New Game";
        this.gameTag = "Tag for the game";
        this.startNomenclature = "Start";
        this.stepNomenclature = "Destination";
        this.endNomenclature = "Finish";
    }
}
