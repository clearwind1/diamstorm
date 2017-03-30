/**
 * Create by hardy on 16/12/21
 * 游戏排行榜页面
 */
class GameRankPageShow extends Othercontainer {
    public constructor() {
        super();
    }

    protected show() {
        var param: Object = {
        }
        GameUtil.Http.getinstance().send(param, "/" + GameConfig.SERVERNAME + "/getrank", this.getRank, this);
    }

    private getRank(rankdata: any) {
        if (rankdata['code'] == 1) {
            var result = rankdata['result'];

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

            var rankcontainsv: GameUtil.ScrollView = new GameUtil.ScrollView(518, 330);
            this.addChild(rankcontainsv);
            GameUtil.relativepos(rankcontainsv, rankbg, 12, 142);
            console.log('result====', result.length);
            for (var i: number = 0; i < result.length; i++) {
                var coverb: MyBitmap = new MyBitmap(RES.getRes('rankcontain' + (i % 7) + '_png'), 259, 26 + i * 64);
                rankcontainsv.putItem(coverb);
                var ranknum: MyBitmap = new MyBitmap(RES.getRes('ranknum_png'), 95, 30 + i * 64);
                rankcontainsv.putItem(ranknum);
                var ranknt: GameUtil.MyTextField = new GameUtil.MyTextField(95, 25 + i * 64, 30);
                ranknt.setText((i + 1) + '');
                ranknt.textColor = 0xa96100;
                rankcontainsv.putItem(ranknt);

                var playname: GameUtil.MyTextField = new GameUtil.MyTextField(235, 26 + i * 64, 40, 0.5);
                playname.setText('sxd-' + result[i]['id']);
                playname.textColor = 0xffffff;
                rankcontainsv.putItem(playname);

                var playscore: GameUtil.MyTextField = new GameUtil.MyTextField(383, 26 + i * 64, 40, 0.5);
                playscore.setText('' + result[i]['score']);
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