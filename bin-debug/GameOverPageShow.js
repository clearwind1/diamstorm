/**
 * Create by hardy on 16/12/21
 * 游戏结束页面
 */
var GameOverPageShow = (function (_super) {
    __extends(GameOverPageShow, _super);
    function GameOverPageShow() {
        _super.call(this);
    }
    var d = __define,c=GameOverPageShow,p=c.prototype;
    p.show = function () {
        var data = {
            'code': 1
        };
        this.showscene(data);
    };
    /**显示 */
    p.showscene = function (data) {
        //console.log('data-====', data['msg']);
        if (data['code'] == 1) {
            console.log('gl:', GameData._i().GameLevel, '-------gs:', GameData._i().gamescore);
            var newcored = GameData._i().GameLevel < GameData._i().gamescore ? true : false;
            var bgname = 'gameoverbg_png';
            if (newcored) {
                GameData._i().GameLevel = GameData._i().gamescore;
                GameUtil.saveLocalData(GameConfig.GAMELEVEL, '' + GameData._i().GameLevel);
                bgname = 'newgameoverbg_png';
            }
            var gameoverbg = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
            this.addChild(gameoverbg);
            /**创建按钮 */
            GameData._i().gamesound[SoundName.newcored].play();
            var scroetext = new GameUtil.MyTextField(gameoverbg.x, gameoverbg.y + 30, 60);
            scroetext.setanchorOff(0.5, 0.5);
            scroetext.$setTextAlign(egret.HorizontalAlign.CENTER);
            scroetext.setText("" + GameData._i().gamescore); //GameData._i().gamescore;
            scroetext.textColor = 0xffffff;
            scroetext.stroke = 5;
            scroetext.strokeColor = 0x73cc97;
            this.addChild(scroetext);
            var btname = ['sharebtn_png', 'restartbtn_png', 'returnbtn_png'];
            var btnfun = [this.share, this.relife, this.turnback];
            for (var i = 0; i < 3; i++) {
                var btn = new GameUtil.Menu(this, btname[i], btname[i], btnfun[i]);
                this.addChild(btn);
                GameUtil.relativepos(btn, gameoverbg, 95 + 160 * i, 320);
            }
        }
        else {
            data['msg'];
        }
    };
    /**分享 */
    p.share = function () {
        if (!GameUtil.isSomeType(GameConfig.WeiXinstr)) {
            this.addChild(new GameUtil.TipsPanel(null, '请在微信中打开', true));
        }
        else {
            this.addChild(new SharePageShow());
        }
    };
    /**返回开始界面 */
    p.turnback = function () {
        // PlayerData._i().initdata();
        GameData._i().currgamescore = GameData._i().gamescore;
        GameData._i().GameOver = false;
        GameData._i().gamescore = 0;
        this.close();
        GameUtil.GameScene.runscene(new StartGameScene());
    };
    /**复活 */
    p.relife = function () {
        //PlayerData._i().initdata();
        GameData._i().GameOver = false;
        GameData._i().gamescore = 0;
        this.parent.restart();
        this.close();
    };
    return GameOverPageShow;
}(Othercontainer));
egret.registerClass(GameOverPageShow,'GameOverPageShow');
//# sourceMappingURL=GameOverPageShow.js.map