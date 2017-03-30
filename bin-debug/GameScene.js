/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
    }
    var d = __define,c=GameScene,p=c.prototype;
    p.init = function () {
        BGMPlayer._i().play(SoundName.gamebgm);
        this.showbg();
    };
    /**
     * 显示背景
     */
    p.showbg = function () {
        this.intervalarr = [];
        var gamebg = new MyBitmap(RES.getRes('gamebg_jpg'), 0, 0);
        gamebg.setanchorOff(0, 0);
        gamebg.width = this.mStageW;
        gamebg.height = this.mStageH;
        this.addChild(gamebg);
        /**创建敌人容器 */
        this.enemyContain = new egret.DisplayObjectContainer();
        this.addChild(this.enemyContain);
        /**创建玩家 */
        //this.player = new Player();
        //this.addChild(this.player);
        /**创建时间 */
        // var timetextstyle: Object = { 'x': GameUtil.absposx(100), 'y': 40, 'size': 35, 'color': 0xffffff };
        // this.gametime = new TimePanel();
        // this.gametime.initdata(TimeType.ADDTIME, 0, true, timetextstyle);
        // this.addChild(this.gametime);
        // this.gametime.start();
        /**创建控制器 */
        // this.addChild(new ControlPanel());
        this.gameinterval();
    };
    /**游戏定时器 */
    p.gameinterval = function () {
        GameUtil.trace('interval');
        this.intervalarr.push(egret.setInterval(this.createEnemy, this, 3000));
        this.intervalarr.push(egret.setInterval(this.updateGamelevel, this, 30000));
    };
    /**游戏等级提升 */
    p.updateGamelevel = function () {
        //console.log('updategamelevel');
        GameData._i().GameLevel++;
    };
    /**获取玩家类 */
    // public getPlayer(): Player {
    //     //return this.player;
    // }
    /**获取当前游戏时间 */
    // public getcurTime(): number {
    //     return this.gametime.getCurTime();
    // }
    /**创建敌人 */
    p.createEnemy = function () {
        if (GameData._i().GamePause) {
            return;
        }
        // //console.log('createEnemy');
        // var lastdir: number = -1;
        // for (var i: number = 0; i <= GameUtil.MIN(Math.floor(GameData._i().GameLevel / 3), 4); i++) {
        //     var enemysp: EnemySprite = new EnemySprite();
        //     var dir: number = RandomUtils.limitInteger(0, 5);
        //     if (lastdir != dir) {
        //         lastdir = dir;
        //     } else {
        //         lastdir++;
        //         lastdir = lastdir % 5;
        //     }
        //     enemysp.initdata(EnemyType.SOLDIER, lastdir);
        //     this.enemyContain.addChild(enemysp);
        //     enemysp.start();
        // }
    };
    /**游戏结束 */
    p.gameover = function () {
        GameUtil.trace('gameover');
        //this.gametime.stop();
        egret.Tween.removeAllTweens();
        GameData._i().GameOver = true;
        this.clearinter();
        this.addChild(new GameOverPageShow());
    };
    /**重置游戏数据 */
    p.reset = function () {
        this.enemyContain.removeChildren();
        this.gameinterval();
        // this.player.reset();
        // this.gametime.start();
    };
    /**清除定时器 */
    p.clearinter = function () {
        GameUtil.clearinterval(this.intervalarr);
        // for (var i: number = 0; i < this.enemyContain.numChildren; i++) {
        //     var enemysp: EnemySprite = <EnemySprite>this.enemyContain.getChildAt(i);
        //     GameUtil.clearinterval(enemysp.intervalarr);
        // }
    };
    return GameScene;
}(GameUtil.BassPanel));
egret.registerClass(GameScene,'GameScene');
//# sourceMappingURL=GameScene.js.map