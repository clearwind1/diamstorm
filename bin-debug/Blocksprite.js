/**
 * Created by pior on 16/9/1.
 */
var Blocksprite = (function (_super) {
    __extends(Blocksprite, _super);
    function Blocksprite(blockid, posx, posy) {
        var texname = 'diam' + blockid + '_';
        _super.call(this, texname, 8, 100, GameConfig.getSW() / 2 - 235 + posx * GameConfig.DICBW, GameConfig.getSH() / 2 - 235 + posy * GameConfig.DICBW);
        this.blockid = blockid;
        this.posx = posx;
        this.posy = posy;
    }
    var d = __define,c=Blocksprite,p=c.prototype;
    p.setscale = function (sc) {
        this.$setScaleX(sc);
        this.$setScaleY(sc);
    };
    return Blocksprite;
}(Animation));
egret.registerClass(Blocksprite,'Blocksprite');
//# sourceMappingURL=Blocksprite.js.map