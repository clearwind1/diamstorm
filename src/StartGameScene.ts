/**
 * Created by pior on 16/9/9.
 */

class StartGameScene extends GameUtil.BassPanel {
    
    public constructor() {
        super();
    }

    public init() {
        BGMPlayer._i().play(SoundName.startgamebgm);
        var param: Object = {
            clickopenid: '1'
        }
        GameUtil.Http.getinstance().send(param, "/" + GameConfig.SERVERNAME + "/getuserid", this.show, this);
    }
    private show(data:any)
    {
        if (data['code'] == 1) {
            this.showbg();
            //PlayerData._i().UserInfo.ID = data['userid'];
            //console.log('PlayerData._i().UserInfo.ID=========', PlayerData._i().UserInfo.ID);
        }
        else {
            GameUtil.trace(data['msg']);
        }
    }
    /**显示背景界面 */
    private showbg() {
       //http://h5.sxd55.com/config/moregamename.json
        GameUtil.getText();

        
        var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 1, 0xf5b440);
        this.addChild(shap);
        var bg: MyBitmap = new MyBitmap(RES.getRes('startgamebg_jpg'), this.mStageW / 2, this.mStageH / 2);
        this.addChild(bg);

        //界面按钮
        var btnname: string[] = ['startgamebtn_png', 'rankbtn_png', 'helpbtn_png', 'settingbtn_png', 'sharebtn_png','moregamebtn_png'];
        var fun: Function[] = [this.startgame, this.gamerank, this.gamehelp, this.setting, this.share,this.moregame];
        var btnpox: number[] = [375, 257, 375, 385, 508, 375];
        var btnpoy: number[] = [580, 1022, 712, 1022, 1022, 845];
        for (var i: number = 0; i < btnname.length; i++) {
            var btn: GameUtil.Menu = new GameUtil.Menu(this, btnname[i], btnname[i], fun[i]);
            btn.setScaleMode();
            this.addChild(btn);
            btn.setBtnSound(GameData._i().gamesound[SoundName.click]);
            GameUtil.relativepos(btn, bg, btnpox[i], btnpoy[i]);
        }

        if (!GameConfig.DEBUG) {
            //分享游戏
            if (GameUtil.getQueryString('shareopenid')) {
                this.getshare();
            }
            else {
                SharePage._i().getSignPackage();
                //SharePage._i().setNewUrl('http://' + GameConfig.GAMENAME + '.h5.gamexun.com/?shareopenid=' + PlayerData._i().UserInfo.openid);
            }
        }
    }

    private getshare() {
        var param: Object = {
            shareopenid: GameUtil.getQueryString('shareopenid'),
            //clickopenid: PlayerData._i().UserInfo.openid
        }
        GameUtil.Http.getinstance().send(param, "/" + GameConfig.SERVERNAME + "/updatesharedata", this.setshareresult, this);
    }
    private setshareresult(data: any) {
        if (data['code'] == 1) {
            SharePage._i().getSignPackage();
            //SharePage._i().setNewUrl('http://' + GameConfig.GAMENAME + '.h5.gamexun.com/?shareopenid=' + PlayerData._i().UserInfo.openid);
        }
        else {
            GameUtil.trace(data['msg']);
        }
    }
    /**开始游戏 */
    private startgame() {
        GameUtil.trace('startgame');
        GameUtil.GameScene.runscene(new GameScene());
    }
    /**游戏排行榜 */
    private gamerank() {
        GameUtil.trace('gamerank');
        this.addChild(new GameRankPageShow());
    }
    /**游戏帮助 */
    private gamehelp() {
        GameUtil.trace('gamehelp');
        this.addChild(new GameHelpPageShow());
    }
    /**游戏设置，音乐与音效 */
    private setting() {
        GameUtil.trace('setting');
        this.addChild(new GameSetting());
    }
    /**游戏分享 */
    private share() {
        GameUtil.trace('share');
         if (!GameUtil.isSomeType(GameConfig.WeiXinstr)) {
            this.addChild(new GameUtil.TipsPanel(null, '请在微信中打开', true));
         } else {
             this.addChild(new SharePageShow());
        }
    }
    /**更多游戏 */
    private moregame() {
        this.addChild(new MoreGamePage());
    }
}