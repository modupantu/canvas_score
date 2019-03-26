// component/canvas_score.js
Component({
  /**
   * 组件的属性列表
   */
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      wx.showLoading({
        title: '',
      })
    }
  },
  properties: {
    data: Object,
    scoreLevel: Number,//评分等级
    scoreUpdateTime:String,//时间
    totalScore: Number//信用分
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    canvasWidth: 0,
    canvasHeight: 0
  },
  ready() {
    let that = this;
    const query = this.createSelectorQuery()
    query.select('.credit-canvas').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        canvasWidth:res[0].width,
        canvasHeight: res[0].height
      })
    })
    setTimeout(() => {
      this.drawCredit(this.data.scoreLevel, this.data.scoreUpdateTime, this.data.totalScore)
    }, 800)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toCompany(){
      wx.navigateTo({
        url: '/Me/pages/aboutmy/aboutmy'
      })
    },
    // scoreLevel: a==评分等级
    // scoreUpdateTime: b==时间
    // totalScore: c==信用分
    drawCredit(a,b,c) {
      const that = this;
      const ctx = wx.createCanvasContext('canvasID', this);
      // 圆弧半径
      const radius = this.data.canvasWidth * 2 / 9;
      // 内圆宽度
      const sweepInWidth = 3;
      // 外圆宽度
      const sweepOutWidth = 2;
      // 圆弧初始的弧度
      const startAngle = 0.9 * Math.PI;
      // 圆弧结束的弧度
      const endAngle = 2.1 * Math.PI;
      // 圆弧扫过的弧度
      const sweepAngle = 1.2 * Math.PI;
      // 信用分值
      let currentNum = c

      ctx.translate(this.data.canvasWidth / 2, this.data.canvasHeight * 3 / 4);
      // 画内外圆弧
      function drawRound() {
        ctx.save();
        // 画外圆
        ctx.beginPath()
        ctx.setLineWidth(sweepOutWidth);
        ctx.setStrokeStyle('rgba(52, 192, 229, 0.2)')
        ctx.arc(0, 0, radius + 10, startAngle, endAngle);
        ctx.stroke();
        // 还原画布
        ctx.restore();
      }

      function drawScale() {
        // 画刻度
        const startNum = 300;
        // 画布旋转弧度
        const angle = 4 * Math.PI / 180;
        ctx.save();
        ctx.rotate((-1.5 *
          Math.PI) + startAngle)
        for (let i = 0; i <= 54; i++) {
          ctx.beginPath()
          ctx.setLineWidth(0.5)
          ctx.setStrokeStyle('rgba(255, 255, 255, 0.6)')
          ctx.moveTo(0, -radius - sweepInWidth / 2);
          ctx.lineTo(0, -radius + sweepInWidth / 2);
          ctx.stroke()
          ctx.rotate(angle)
        }
        // 还原画布
        ctx.restore();
      }

      function drawIndicator() {

        ctx.save();
        let sweep = 0;
        if (currentNum <= 100) {
          sweep = 0;
        } else if (currentNum <= 800 && currentNum > 100) {
          sweep = (currentNum - 100) * sweepAngle / 800;
        } else if (currentNum > 800 && currentNum <= 1000) {
          sweep = (5 * sweepAngle / 6) + ((currentNum - 800) * sweepAngle / 1200);
        } else {
          sweep = sweepAngle;
        }

        // 画指示点圆弧
        const grd = ctx.createLinearGradient(0, 0, 200, 0)
        grd.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
        grd.addColorStop(1, 'rgba(255, 255, 255, 0.8)')
        ctx.beginPath()
        ctx.setStrokeStyle(grd)
        ctx.setLineWidth(3);
        ctx.arc(0, 0, radius + 10, startAngle, startAngle + sweep);
        ctx.stroke()
        // 画指示点
        let x = (radius + 10) * Math.cos(startAngle + sweep)
        let y = (radius + 10) * Math.sin(startAngle + sweep)
        ctx.beginPath()
        // ctx.setStrokeStyle('white')
        ctx.setFillStyle('white')
        ctx.arc(x, y, 2.5, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        // 还原画布
        ctx.restore();
      }

      function drawCenterText(a,b,c) {
        ctx.save();
        //设置文字画笔
        ctx.beginPath();
        ctx.setFontSize(35)
        ctx.setTextAlign('center')
        ctx.setFillStyle('white')
        // 绘制信用分值
        ctx.setFontSize(35)
        ctx.fillText(c, 0, -25)
        // ctx.fillText(c, 0, -radius / 3)

        // 绘制信用评估
        let content = "信用";
        const creditLeverText = ["一般", "良好", "优秀"];
        let tLeverText = a ? a : 1

        ctx.setFontSize(12)

        ctx.fillText(creditLeverText[tLeverText - 1], 0, radius / 30)

        // 服 务 信 用 分
        ctx.setFontSize(11)
        ctx.setFillStyle('#b3dde9')
        ctx.fillText('评估时间：' + b, 0, radius / 3)
        ctx.restore();
      }

      function title() {
        ctx.save();
        let img = '/images/315/border.png'
        ctx.drawImage(img, -radius * 2, (-radius - 5) * 4 / 3, 75, 2);
        ctx.restore();
        ctx.save();
        ctx.rotate(180 * Math.PI / 180);
        ctx.drawImage(img, (-radius + 6) * 5 / 4, (radius + 2) * 4 / 3, -75, 2);
        ctx.restore();
        ctx.save();
        ctx.setFontSize(12)
        ctx.setFillStyle('#ffffff');
        ctx.fillText('新智数信服务者品牌计划 >', -70, -radius * 4 / 3)
        ctx.restore();
      };

      title()
      drawRound();
      drawScale();
      drawIndicator();
      drawCenterText(a,b,c);

      ctx.draw()
      wx.hideLoading()
    },
  }
})
