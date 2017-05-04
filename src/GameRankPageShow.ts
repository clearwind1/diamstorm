/**
 * Create by hardy on 16/12/21
 * 游戏排行榜页面
 */

class Ranksprite {
    public constructor() {
        this.init();
    }
    public rankarr: number;
    public sxdid: number;
    private init() {
    }
}

class GameRankPageShow extends Othercontainer {
    public constructor() {
        super();
    }

    private ranklish: Ranksprite[];

    protected show() {
        this.ranklish = [];

        for (var i: number = 0; i < 20; i++) {
            var rd: number = RandomUtils.limitInteger(17894, 8298764);
            this.ranklish[i] = new Ranksprite();
            this.ranklish[i].rankarr = rd;
            this.ranklish[i].sxdid = i + 1;
        }

        var param: Object = {
            'code': 1
        }
        //GameUtil.Http.getinstance().send(param, "/" + GameConfig.SERVERNAME + "/getrank", this.getRank, this);
        this.getRank(param);
    }

    private getRank(rankdata: any) {
        if (rankdata['code'] == 1) {
            //var result = rankdata['result'];

            var rankbg: MyBitmap = new MyBitmap(RES.getRes('rankbg_png'), this.mStageW / 2, this.mStageH / 2);
            this.addChild(rankbg);

            // var textt: string[] = ['序号', 'ID', '总分'];
            // for (var t: number = 0; t < 3; t++) {
            //     var text: GameUtil.MyTextField = new GameUtil.MyTextField(0, 0, 40);
            //     text.setText(textt[t]);
            //     text.textColor = 0x906128;
            //     this.addChild(text);
            //     GameUtil.relativepos(text, rankbg, 108 + t * 190, 111);
            // }

            this.ranklish[19].rankarr = (GameUtil.MAX(GameData._i().currgamescore, 10256));
            this.ranklish.sort(function (a, b) {
                return b.rankarr - a.rankarr;
            });
            var rankcontainsv: GameUtil.ScrollView = new GameUtil.ScrollView(518, 330);
            this.addChild(rankcontainsv);
            GameUtil.relativepos(rankcontainsv, rankbg, 12, 142);
            //console.log('result====', result.length);
            for (var i: number = 0; i < 20; i++) {
                var coverb: MyBitmap = new MyBitmap(RES.getRes('rankcontain' + (i % 7) + '_png'), 259, 26 + i * 64);
                rankcontainsv.putItem(coverb);
                var ranknum: MyBitmap = new MyBitmap(RES.getRes('ranknum_png'), 95, 30 + i * 64);
                rankcontainsv.putItem(ranknum);
                var ranknt: GameUtil.MyTextField = new GameUtil.MyTextField(95, 25 + i * 64, 30);
                ranknt.setText((i + 1) + '');
                ranknt.textColor = 0xa96100;
                rankcontainsv.putItem(ranknt);

                var playname: GameUtil.MyTextField = new GameUtil.MyTextField(235, 26 + i * 64, 40, 0.5);
                playname.setText('sxd-' + this.ranklish[i].sxdid);
                playname.textColor = 0xffffff;
                rankcontainsv.putItem(playname);

                var playscore: GameUtil.MyTextField = new GameUtil.MyTextField(383, 26 + i * 64, 40, 0.5);
                playscore.setText('' + this.ranklish[i].rankarr);
                playscore.textColor = 0xffffff;
                rankcontainsv.putItem(playscore);
            }

            var close: GameUtil.Menu = new GameUtil.Menu(this, 'closebtn_png', 'closebtn_png', this.close);
            this.addChild(close);
            GameUtil.relativepos(close, rankbg, 510, 25);
        }
        else {
            GameUtil.trace(rankdata['msg']);
        }
    }

}