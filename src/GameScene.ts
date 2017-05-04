/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
enum KEYCODE { LEFT = 37, UP, RIGHT, DOWN };
class GameScene extends GameUtil.BassPanel {

    private intervalarr: number[];

    private blockdispcont: egret.DisplayObjectContainer;
    private touchlayer: egret.Shape;

    private beginpointx: number;
    private beginpointy: number;

    private recordisempy: number[];
    private blockarr: Blocksprite[];

    private moveoncetag: boolean = false;

    private hightscore: number;
    private curscore: number;
    private scoreText: GameUtil.MyTextField;
    private lvimg: MyBitmap;

    public constructor() {
        super();
    }
    public init() {
        BGMPlayer._i().play(SoundName.gamebgm);
        //window['stopaudio']();
        this.initdata();
        this.showbg();
        var posx: number = (Math.floor(Math.random() * 10)) % 4;
        var posy: number = (Math.floor(Math.random() * 10)) % 4;
        this.createblock(0, posx, posy);

        //test        
        //this.gameover();
    }
    private initdata() {
        this.hightscore = 2;
        this.curscore = 2;
        GameData._i().gamescore = 0;
        this.beginpointx = 0;
        this.beginpointy = 0;
        this.recordisempy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    /**
     * 显示背景
     */
    private showbg() {
        this.intervalarr = [];

        this.blockarr = [];
        for (var i: number = 0; i < 16; i++) {
            this.blockarr[i] = null;
        }

        this.touchlayer = GameUtil.createRect(0, 0, this.mStageW, this.mStageH);
        this.touchlayer.alpha = 0;
        this.addChild(this.touchlayer);
        this.touchlayer.touchEnabled = true;
        this.touchlayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchbegin, this);
        this.touchlayer.addEventListener(egret.TouchEvent.TOUCH_END, this.touchend, this);

        var self: any = this;
        window.addEventListener('keydown', function (e) {
            // console.log(e.keyCode);
            if (GameData._i().GamePause) {
                return;
            }
            self.moveoncetag = true;
            switch (e.keyCode) {
                case KEYCODE.DOWN:
                    self.movedown(self);
                    break;
                case KEYCODE.LEFT:
                    self.moveleft(self);
                    break;
                case KEYCODE.RIGHT:
                    self.moveright(self);
                    break;
                case KEYCODE.UP:
                    self.moveup(self);
                    break;
            }
        }, false);


        var gamebg: MyBitmap = new MyBitmap(RES.getRes('gamebg_jpg'), 0, 0);
        gamebg.setanchorOff(0, 0);
        gamebg.width = this.mStageW;
        gamebg.height = this.mStageH;
        this.addChild(gamebg);

        var diamcont: MyBitmap = new MyBitmap(RES.getRes('diamcont_png'), this.mStageW / 2, this.mStageH / 2);
        this.addChild(diamcont);

        this.scoreText = new GameUtil.MyTextField(54, diamcont.y - diamcont.height / 2 - 70, 60, 0, 0.5);
        this.scoreText.setText('得分:' + GameData._i().gamescore);
        this.addChild(this.scoreText);

        var lv: GameUtil.MyTextField = new GameUtil.MyTextField(this.mStageW - 154, diamcont.y - diamcont.height / 2 - 70, 60, 1, 0.5);
        lv.setText('等级:');
        this.addChild(lv);
        this.lvimg = new MyBitmap(RES.getRes('diam2_1_png'), lv.x + 60, lv.y - 20);
        this.addChild(this.lvimg);

        var exitgamebtn: GameUtil.Menu = new GameUtil.Menu(this, 'returnbtn_png', 'returnbtn_png', this.exitgame);
        exitgamebtn.setScaleMode();
        exitgamebtn.x = 54;
        exitgamebtn.y = 53;
        this.addChild(exitgamebtn);

        var restartbtn: GameUtil.Menu = new GameUtil.Menu(this, 'restartbtn_png', 'restartbtn_png', this.restartask);
        restartbtn.setScaleMode();
        restartbtn.x = this.mStageW - 54;
        restartbtn.y = 53;
        this.addChild(restartbtn);

        this.blockdispcont = new egret.DisplayObjectContainer();
        this.addChild(this.blockdispcont);

        this.gameinterval();
    }
    /**游戏定时器 */
    private gameinterval() {
        GameUtil.trace('interval');
        //this.gameover();
    }

    private createblock(newid: number = 0, posx: number = 1, posy: number = 2, ischeck: boolean = false, isrestart: boolean = false) {
        GameData._i().GamePause = true;
        if (newid != 0) {
            //console.log('GameData._i().gamesound[SoundName.comble]===', GameData._i().gamesound[SoundName.comble]);
            GameData._i().gamesound[SoundName.comble].play();
        }
        var id: number = (newid == 0) ? (1 + Math.floor(Math.random() * 100) % 2) * 2 : newid;
        var block: Blocksprite = new Blocksprite(id, posx, posy);
        this.blockdispcont.addChild(block);
        block.setscale(0);
        //console.log('block ====',block);
        var self: any = this;
        var tw: egret.Tween = egret.Tween.get(block);
        tw.to({ scaleX: 1, scaleY: 1 }, 300).call(self.checkgameover, self, [ischeck]);
        if (isrestart) {
            block.setscale(1);
            GameData._i().GamePause = false;
        }

        //this.recordisempy[1+2*4] = 1;
        this.blockarr[posx + posy * 4] = block;

        this.updatascore(id);
    }

    private checkgameover(ischeck) {
        GameData._i().GamePause = false;
        //console.log('blockdispcontchild====', this.blockdispcont.numChildren);
        if (ischeck && this.blockdispcont.numChildren == 16 && this.jugeisgameover()) {
            console.log('gameover');
            this.gameover();
        }
    }

    private updatascore(score: number) {
        GameData._i().gamescore += score;
        if (score > this.curscore) {
            this.curscore = score;
            this.hightscore = this.curscore > this.hightscore ? this.curscore : this.hightscore;
        }
        var texname = 'diam' + this.hightscore + '_1_png';
        this.lvimg.setNewTexture(RES.getRes(texname));
        this.scoreText.setText('得分:' + GameData._i().gamescore);
    }
    private touchbegin(evt: egret.TouchEvent) {
        //console.log('gamepause-=====', GameData._i().GamePause);
        if (GameData._i().GamePause) {
            return;
        }
        this.moveoncetag = true;
        this.beginpointx = evt.localX;
        this.beginpointy = evt.localY;
    }

    private touchend(evt: egret.TouchEvent) {
        if (GameData._i().GamePause) {
            return;
        }
        var self: any = evt.currentTarget.parent;

        var ex: number = evt.localX;
        var ey: number = evt.localY;

        if (Math.abs(ex - this.beginpointx) > Math.abs(ey - this.beginpointy)) {
            if (ex - this.beginpointx > 100) {
                GameData._i().gamesound[SoundName.move].play();
                this.moveright(self);
            }
            else if (ex - this.beginpointx < -100) {
                GameData._i().gamesound[SoundName.move].play();
                this.moveleft(self);
            }
        }
        else {
            if (ey - this.beginpointy > 100) {
                GameData._i().gamesound[SoundName.move].play();
                this.movedown(self);
            }
            else if (ey - this.beginpointy < -100) {
                GameData._i().gamesound[SoundName.move].play();
                this.moveup(self);
            }
        }
    }

    private moveright(self: any) {
        //console.log('往右');
        for (var i: number = 15; i >= 0; i--) {
            var block: Blocksprite = self.blockarr[i];
            if (block != null && block.posx != 3) {
                var isameid: boolean = false;
                for (var j: number = block.posx + 1; j <= 3; j++) {
                    //console.log('j===',self.blockarr[j+block.y*4]);
                    if (self.blockarr[j + block.posy * 4] != null) {
                        //console.log('j===',j);
                        if (block.blockid == self.blockarr[j + block.posy * 4].blockid) {
                            isameid = true;
                        }
                        break;
                    }
                }
                var movex: number = isameid ? j : j - 1;
                if (block.posx != movex) {
                    var movedis: number = block.x + GameConfig.DICBW * (movex - block.posx);
                    egret.Tween.get(block).to({ x: movedis }, 100).call(self.moveEnd, self, [block, movex, isameid]);

                    if (isameid) {
                        this.blockarr[block.posx + block.posy * 4] = null;
                        this.blockarr[movex + block.posy * 4].blockid *= 0;
                    }
                    else {
                        this.blockarr[block.posx + block.posy * 4] = null;
                        block.posx = movex;
                        this.blockarr[block.posx + block.posy * 4] = block;
                    }
                }
            }
        }

    }
    private moveleft(self: any) {
        //console.log('往左');
        for (var i: number = 0; i < 16; i++) {
            var block: Blocksprite = self.blockarr[i];
            if (block != null && block.posx != 0) {
                var isameid: boolean = false;
                for (var j: number = block.posx - 1; j >= 0; j--) {
                    //console.log('j===',self.blockarr[j+block.y*4]);
                    if (self.blockarr[j + block.posy * 4] != null) {
                        //console.log('j===',j);
                        if (block.blockid == self.blockarr[j + block.posy * 4].blockid) {
                            isameid = true;
                        }
                        break;
                    }
                }
                var movex: number = isameid ? j : j + 1;
                if (block.posx != movex) {
                    var movedis: number = block.x + GameConfig.DICBW * (movex - block.posx);
                    egret.Tween.get(block).to({ x: movedis }, 100).call(self.moveEnd, self, [block, movex, isameid]);

                    if (isameid) {
                        this.blockarr[block.posx + block.posy * 4] = null;
                        this.blockarr[movex + block.posy * 4].blockid *= 0;
                    }
                    else {
                        this.blockarr[block.posx + block.posy * 4] = null;
                        block.posx = movex;
                        this.blockarr[block.posx + block.posy * 4] = block;
                    }
                }

            }
        }
    }
    private moveup(self: any) {
        //console.log('往上');
        for (var i: number = 0; i < 16; i++) {
            var block: Blocksprite = self.blockarr[i];
            if (block != null && block.posy != 0) {
                var isameid: boolean = false;
                for (var j: number = block.posy - 1; j >= 0; j--) {
                    //console.log('j===',self.blockarr[j+block.y*4]);
                    if (self.blockarr[block.posx + j * 4] != null) {
                        //console.log('j===',j);
                        if (block.blockid == self.blockarr[block.posx + j * 4].blockid) {
                            isameid = true;
                        }
                        break;
                    }
                }
                var movey: number = isameid ? j : j + 1;
                if (block.posy != movey) {
                    var movedis: number = block.y + GameConfig.DICBW * (movey - block.posy);
                    egret.Tween.get(block).to({ y: movedis }, 100).call(self.moveEnd, self, [block, movey, isameid, true]);

                    if (isameid) {
                        this.blockarr[block.posx + block.posy * 4] = null;
                        this.blockarr[block.posx + movey * 4].blockid *= 0;
                    }
                    else {
                        this.blockarr[block.posx + block.posy * 4] = null;
                        block.posy = movey;
                        this.blockarr[block.posx + block.posy * 4] = block;
                    }
                }
            }
        }
    }
    private movedown(self: any) {
        //console.log('往下');
        for (var i: number = 15; i >= 0; i--) {
            var block: Blocksprite = self.blockarr[i];
            if (block != null && block.posy != 3) {
                var isameid: boolean = false;
                for (var j: number = block.posy + 1; j <= 3; j++) {
                    //console.log('j===',self.blockarr[j+block.y*4]);
                    if (self.blockarr[block.posx + j * 4] != null) {
                        //console.log('j===',j);
                        if (block.blockid == self.blockarr[block.posx + j * 4].blockid) {
                            isameid = true;
                        }
                        break;
                    }
                }
                var movey: number = isameid ? j : j - 1;
                if (block.posy != movey) {
                    var movedis: number = block.y + GameConfig.DICBW * (movey - block.posy);
                    egret.Tween.get(block).to({ y: movedis }, 100).call(self.moveEnd, self, [block, movey, isameid, true]);

                    if (isameid) {
                        this.blockarr[block.posx + block.posy * 4] = null;
                        this.blockarr[block.posx + movey * 4].blockid *= 0;
                    }
                    else {
                        this.blockarr[block.posx + block.posy * 4] = null;
                        block.posy = movey;
                        this.blockarr[block.posx + block.posy * 4] = block;
                    }
                }
            }
        }
    }

    private moveEnd(block: Blocksprite, movex: number, issameID: boolean, dircor: boolean = false) {
        if (issameID) {
            //this.blockarr[block.posx+block.posy*4] = null;
            var blockindex: number = dircor ? (block.posx + movex * 4) : (movex + block.posy * 4);
            this.blockdispcont.removeChild(block);
            this.blockdispcont.removeChild(this.blockarr[blockindex]);
            var newid: number = block.blockid * 2;
            //this.updatascore(newid);
            if (dircor) {
                this.createblock(newid, block.posx, movex);
            }
            else {
                this.createblock(newid, movex, block.posy);
            }

        }

        if (this.moveoncetag) {
            //console.log('createnew');
            var pos: number = Math.floor(Math.random() * 100) % 16;
            while (this.jugeishad(pos)) {
                pos = (++pos) > 15 ? 0 : pos;
            }
            var posx: number = pos % 4;
            var posy: number = Math.floor(pos / 4);
            this.createblock(0, posx, posy, true);

            this.moveoncetag = false;
        }

    }

    private jugeishad(pos): boolean {
        if (this.blockarr[pos] != null) {
            return true;
        }

        return false;
    }

    private jugeisgameover(): boolean {
        for (var i: number = 0; i < 16; i++) {
            if ((this.blockarr[i] != null && this.blockarr[i + 1] != null && this.blockarr[i + 4] != null) && ((i % 4 != 3 && this.blockarr[i].blockid == this.blockarr[i + 1].blockid) || (Math.floor(i / 4) != 3 && this.blockarr[i].blockid == this.blockarr[i + 4].blockid))) {
                return false;
            }
        }
        return true;
    }
    /**游戏结束 */
    public gameover() {
        GameUtil.trace('gameover');
        //this.gametime.stop();
        //egret.Tween.removeAllTweens();
        GameData._i().GameOver = true;
        this.clearinter();
        this.addChild(new GameOverPageShow());
    }
    /**重置游戏数据 */
    public reset() {
        this.gameinterval();
        this.restart();
    }
    /**清除定时器 */
    private clearinter() {
        GameUtil.clearinterval(this.intervalarr);
        // for (var i: number = 0; i < this.enemyContain.numChildren; i++) {
        //     var enemysp: EnemySprite = <EnemySprite>this.enemyContain.getChildAt(i);
        //     GameUtil.clearinterval(enemysp.intervalarr);
        // }
    }

    private exitgame() {
        GameUtil.GameScene.runscene(new StartGameScene());
    }

    private restartask() {
        var askcon: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        this.addChild(askcon);
        askcon.touchEnabled = true;
        var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.6);
        askcon.addChild(shap);

        var bgname: string = 'restartbg_png';
        var gameoverbg: MyBitmap = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
        askcon.addChild(gameoverbg);

        var btname: string[] = ['yesbtn_png', 'nobtn_png'];
        var btnfun: Function[] = [this.restart,];
        for (var i: number = 0; i < 2; i++) {
            var btn: GameUtil.Menu = new GameUtil.Menu(this, btname[i], btname[i], (id) => {
                askcon.parent.removeChild(askcon);
                if (id == 0) {
                    this.restart();
                }
            }, [i]);
            askcon.addChild(btn);
            GameUtil.relativepos(btn, gameoverbg, 150 + 205 * i, 220);
        }
    }
    public restart() {
        this.blockdispcont.removeChildren();
        for (var i: number = 0; i < 16; i++) {
            this.blockarr[i] = null;
        }
        GameData._i().gamescore = 0;
        this.curscore = 0;
        this.hightscore = 2;
        this.updatascore(this.curscore);
        this.createblock(0, 1, 2, false, true);
        console.log('restart');
        //this.restart();
    }
}