/**
 * Created by pior on 16/9/1.
 */
class Blocksprite extends Animation
{

    private dicbw: number;

    public blockid: number;
    public posx: number;
    public posy: number;

    public constructor(blockid:number,posx:number,posy:number)
    {
        var texname = 'diam' + blockid+'_';
        super(texname, 8, 100, GameConfig.getSW() / 2 - 235 + posx * GameConfig.DICBW, GameConfig.getSH() / 2 - 235 + posy * GameConfig.DICBW);
        this.blockid = blockid;
        this.posx = posx;
        this.posy = posy;
    }

    public setscale(sc) {
        this.$setScaleX(sc);
        this.$setScaleY(sc);
    }

}