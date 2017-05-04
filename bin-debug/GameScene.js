/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
var KEYCODE;
(function (KEYCODE) {
    KEYCODE[KEYCODE["LEFT"] = 37] = "LEFT";
    KEYCODE[KEYCODE["UP"] = 38] = "UP";
    KEYCODE[KEYCODE["RIGHT"] = 39] = "RIGHT";
    KEYCODE[KEYCODE["DOWN"] = 40] = "DOWN";
})(KEYCODE || (KEYCODE = {}));
;
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
        this.moveoncetag = false;
    }
    var d = __define,c=GameScene,p=c.prototype;
    p.init = function () {
        BGMPlayer._i().play(SoundName.gamebgm);
        //window['stopaudio']();
        this.initdata();
        this.showbg();
        var posx = (Math.floor(Math.random() * 10)) % 4;
        var posy = (Math.floor(Math.random() * 10)) % 4;
        this.createblock(0, posx, posy);
        //test        
        //this.gameover();
    };
    p.initdata = function () {
        this.hightscore = 2;
        this.curscore = 2;
        GameData._i().gamescore = 0;
        this.beginpointx = 0;
        this.beginpointy = 0;
        this.recordisempy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    };
    /**
     * 显示背景
     */
    p.showbg = function () {
        this.intervalarr = [];
        this.blockarr = [];
        for (var i = 0; i < 16; i++) {
            this.blockarr[i] = null;
        }
        this.touchlayer = GameUtil.createRect(0, 0, this.mStageW, this.mStageH);
        this.touchlayer.alpha = 0;
        this.addChild(this.touchlayer);
        this.touchlayer.touchEnabled = true;
        this.touchlayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchbegin, this);
        this.touchlayer.addEventListener(egret.TouchEvent.TOUCH_END, this.touchend, this);
        var self = this;
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
        var gamebg = new MyBitmap(RES.getRes('gamebg_jpg'), 0, 0);
        gamebg.setanchorOff(0, 0);
        gamebg.width = this.mStageW;
        gamebg.height = this.mStageH;
        this.addChild(gamebg);
        var diamcont = new MyBitmap(RES.getRes('diamcont_png'), this.mStageW / 2, this.mStageH / 2);
        this.addChild(diamcont);
        this.scoreText = new GameUtil.MyTextField(54, diamcont.y - diamcont.height / 2 - 70, 60, 0, 0.5);
        this.scoreText.setText('得分:' + GameData._i().gamescore);
        this.addChild(this.scoreText);
        var lv = new GameUtil.MyTextField(this.mStageW - 154, diamcont.y - diamcont.height / 2 - 70, 60, 1, 0.5);
        lv.setText('等级:');
        this.addChild(lv);
        this.lvimg = new MyBitmap(RES.getRes('diam2_1_png'), lv.x + 60, lv.y - 20);
        this.addChild(this.lvimg);
        var exitgamebtn = new GameUtil.Menu(this, 'returnbtn_png', 'returnbtn_png', this.exitgame);
        exitgamebtn.setScaleMode();
        exitgamebtn.x = 54;
        exitgamebtn.y = 53;
        this.addChild(exitgamebtn);
        var restartbtn = new GameUtil.Menu(this, 'restartbtn_png', 'restartbtn_png', this.restartask);
        restartbtn.setScaleMode();
        restartbtn.x = this.mStageW - 54;
        restartbtn.y = 53;
        this.addChild(restartbtn);
        this.blockdispcont = new egret.DisplayObjectContainer();
        this.addChild(this.blockdispcont);
        this.gameinterval();
    };
    /**游戏定时器 */
    p.gameinterval = function () {
        GameUtil.trace('interval');
        //this.gameover();
    };
    p.createblock = function (newid, posx, posy, ischeck, isrestart) {
        if (newid === void 0) { newid = 0; }
        if (posx === void 0) { posx = 1; }
        if (posy === void 0) { posy = 2; }
        if (ischeck === void 0) { ischeck = false; }
        if (isrestart === void 0) { isrestart = false; }
        GameData._i().GamePause = true;
        if (newid != 0) {
            //console.log('GameData._i().gamesound[SoundName.comble]===', GameData._i().gamesound[SoundName.comble]);
            GameData._i().gamesound[SoundName.comble].play();
        }
        var id = (newid == 0) ? (1 + Math.floor(Math.random() * 100) % 2) * 2 : newid;
        var block = new Blocksprite(id, posx, posy);
        this.blockdispcont.addChild(block);
        block.setscale(0);
        //console.log('block ====',block);
        var self = this;
        var tw = egret.Tween.get(block);
        tw.to({ scaleX: 1, scaleY: 1 }, 300).call(self.checkgameover, self, [ischeck]);
        if (isrestart) {
            block.setscale(1);
            GameData._i().GamePause = false;
        }
        //this.recordisempy[1+2*4] = 1;
        this.blockarr[posx + posy * 4] = block;
        this.updatascore(id);
    };
    p.checkgameover = function (ischeck) {
        GameData._i().GamePause = false;
        //console.log('blockdispcontchild====', this.blockdispcont.numChildren);
        if (ischeck && this.blockdispcont.numChildren == 16 && this.jugeisgameover()) {
            console.log('gameover');
            this.gameover();
        }
    };
    p.updatascore = function (score) {
        GameData._i().gamescore += score;
        if (score > this.curscore) {
            this.curscore = score;
            this.hightscore = this.curscore > this.hightscore ? this.curscore : this.hightscore;
        }
        var texname = 'diam' + this.hightscore + '_1_png';
        this.lvimg.setNewTexture(RES.getRes(texname));
        this.scoreText.setText('得分:' + GameData._i().gamescore);
    };
    p.touchbegin = function (evt) {
        //console.log('gamepause-=====', GameData._i().GamePause);
        if (GameData._i().GamePause) {
            return;
        }
        this.moveoncetag = true;
        this.beginpointx = evt.localX;
        this.beginpointy = evt.localY;
    };
    p.touchend = function (evt) {
        if (GameData._i().GamePause) {
            return;
        }
        var self = evt.currentTarget.parent;
        var ex = evt.localX;
        var ey = evt.localY;
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
    };
    p.moveright = function (self) {
        //console.log('往右');
        for (var i = 15; i >= 0; i--) {
            var block = self.blockarr[i];
            if (block != null && block.posx != 3) {
                var isameid = false;
                for (var j = block.posx + 1; j <= 3; j++) {
                    //console.log('j===',self.blockarr[j+block.y*4]);
                    if (self.blockarr[j + block.posy * 4] != null) {
                        //console.log('j===',j);
                        if (block.blockid == self.blockarr[j + block.posy * 4].blockid) {
                            isameid = true;
                        }
                        break;
                    }
                }
                var movex = isameid ? j : j - 1;
                if (block.posx != movex) {
                    var movedis = block.x + GameConfig.DICBW * (movex - block.posx);
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
    };
    p.moveleft = function (self) {
        //console.log('往左');
        for (var i = 0; i < 16; i++) {
            var block = self.blockarr[i];
            if (block != null && block.posx != 0) {
                var isameid = false;
                for (var j = block.posx - 1; j >= 0; j--) {
                    //console.log('j===',self.blockarr[j+block.y*4]);
                    if (self.blockarr[j + block.posy * 4] != null) {
                        //console.log('j===',j);
                        if (block.blockid == self.blockarr[j + block.posy * 4].blockid) {
                            isameid = true;
                        }
                        break;
                    }
                }
                var movex = isameid ? j : j + 1;
                if (block.posx != movex) {
                    var movedis = block.x + GameConfig.DICBW * (movex - block.posx);
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
    };
    p.moveup = function (self) {
        //console.log('往上');
        for (var i = 0; i < 16; i++) {
            var block = self.blockarr[i];
            if (block != null && block.posy != 0) {
                var isameid = false;
                for (var j = block.posy - 1; j >= 0; j--) {
                    //console.log('j===',self.blockarr[j+block.y*4]);
                    if (self.blockarr[block.posx + j * 4] != null) {
                        //console.log('j===',j);
                        if (block.blockid == self.blockarr[block.posx + j * 4].blockid) {
                            isameid = true;
                        }
                        break;
                    }
                }
                var movey = isameid ? j : j + 1;
                if (block.posy != movey) {
                    var movedis = block.y + GameConfig.DICBW * (movey - block.posy);
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
    };
    p.movedown = function (self) {
        //console.log('往下');
        for (var i = 15; i >= 0; i--) {
            var block = self.blockarr[i];
            if (block != null && block.posy != 3) {
                var isameid = false;
                for (var j = block.posy + 1; j <= 3; j++) {
                    //console.log('j===',self.blockarr[j+block.y*4]);
                    if (self.blockarr[block.posx + j * 4] != null) {
                        //console.log('j===',j);
                        if (block.blockid == self.blockarr[block.posx + j * 4].blockid) {
                            isameid = true;
                        }
                        break;
                    }
                }
                var movey = isameid ? j : j - 1;
                if (block.posy != movey) {
                    var movedis = block.y + GameConfig.DICBW * (movey - block.posy);
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
    };
    p.moveEnd = function (block, movex, issameID, dircor) {
        if (dircor === void 0) { dircor = false; }
        if (issameID) {
            //this.blockarr[block.posx+block.posy*4] = null;
            var blockindex = dircor ? (block.posx + movex * 4) : (movex + block.posy * 4);
            this.blockdispcont.removeChild(block);
            this.blockdispcont.removeChild(this.blockarr[blockindex]);
            var newid = block.blockid * 2;
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
            var pos = Math.floor(Math.random() * 100) % 16;
            while (this.jugeishad(pos)) {
                pos = (++pos) > 15 ? 0 : pos;
            }
            var posx = pos % 4;
            var posy = Math.floor(pos / 4);
            this.createblock(0, posx, posy, true);
            this.moveoncetag = false;
        }
    };
    p.jugeishad = function (pos) {
        if (this.blockarr[pos] != null) {
            return true;
        }
        return false;
    };
    p.jugeisgameover = function () {
        for (var i = 0; i < 16; i++) {
            if ((this.blockarr[i] != null && this.blockarr[i + 1] != null && this.blockarr[i + 4] != null) && ((i % 4 != 3 && this.blockarr[i].blockid == this.blockarr[i + 1].blockid) || (Math.floor(i / 4) != 3 && this.blockarr[i].blockid == this.blockarr[i + 4].blockid))) {
                return false;
            }
        }
        return true;
    };
    /**游戏结束 */
    p.gameover = function () {
        GameUtil.trace('gameover');
        //this.gametime.stop();
        //egret.Tween.removeAllTweens();
        GameData._i().GameOver = true;
        this.clearinter();
        this.addChild(new GameOverPageShow());
    };
    /**重置游戏数据 */
    p.reset = function () {
        this.gameinterval();
        this.restart();
    };
    /**清除定时器 */
    p.clearinter = function () {
        GameUtil.clearinterval(this.intervalarr);
        // for (var i: number = 0; i < this.enemyContain.numChildren; i++) {
        //     var enemysp: EnemySprite = <EnemySprite>this.enemyContain.getChildAt(i);
        //     GameUtil.clearinterval(enemysp.intervalarr);
        // }
    };
    p.exitgame = function () {
        GameUtil.GameScene.runscene(new StartGameScene());
    };
    p.restartask = function () {
        var _this = this;
        var askcon = new egret.DisplayObjectContainer();
        this.addChild(askcon);
        askcon.touchEnabled = true;
        var shap = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.6);
        askcon.addChild(shap);
        var bgname = 'restartbg_png';
        var gameoverbg = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
        askcon.addChild(gameoverbg);
        var btname = ['yesbtn_png', 'nobtn_png'];
        var btnfun = [this.restart,];
        for (var i = 0; i < 2; i++) {
            var btn = new GameUtil.Menu(this, btname[i], btname[i], function (id) {
                askcon.parent.removeChild(askcon);
                if (id == 0) {
                    _this.restart();
                }
            }, [i]);
            askcon.addChild(btn);
            GameUtil.relativepos(btn, gameoverbg, 150 + 205 * i, 220);
        }
    };
    p.restart = function () {
        this.blockdispcont.removeChildren();
        for (var i = 0; i < 16; i++) {
            this.blockarr[i] = null;
        }
        GameData._i().gamescore = 0;
        this.curscore = 0;
        this.hightscore = 2;
        this.updatascore(this.curscore);
        this.createblock(0, 1, 2, false, true);
        console.log('restart');
        //this.restart();
    };
    return GameScene;
}(GameUtil.BassPanel));
egret.registerClass(GameScene,'GameScene');
//# sourceMappingURL=GameScene.js.map