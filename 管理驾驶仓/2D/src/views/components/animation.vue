<template>
  <canvas id="canvas"></canvas>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    var can = document.getElementById("canvas");
    var cxt = can.getContext("2d");

    var w = (can.width = window.innerWidth);
    var h = (can.height = window.innerHeight);

    var num = 200; //生成点的个数
    var data = []; //定义一个数组，准备用来存坐标
    var move = {};
    var liuXY = [];
    var k = -1;
    var range = Math.atan(k);
    var length = 200;

    //生成num个点，并且存储初始坐标
    for (var i = 0; i < num; i++) {
      data[i] = {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 8 + 3,
      };
      Cricle(data[i].x, data[i].y, data[i].r);
    }

    !(function draw() {
      cxt.clearRect(0, 0, w, h);
      for (var i = 0; i < num; i++) {
        data[i].r += Math.random() * 2 - 1;
        data[i].r = Math.max(0, data[i].r);
        data[i].r = Math.min(12, data[i].r);
        Cricle(data[i].x, data[i].y, data[i].r);
      }
      if (liuXY.length) {
        for (var i in liuXY) {
          liuXY[i].cX -= 10;
          liuX(liuXY[i].cX, liuXY[i].y, liuXY[i].x);
          if (
            liuXY[i].cX < 0 ||
            getY(liuXY[i].cX, liuXY[i].y, liuXY[i].x) > h
          ) {
            liuXY.splice(i, 1);
          }
        }
      }
      if (Math.random() > 0.98) {
        var a = Math.random() * (w - 400) + 400;
        liuXY.push({
          x: a,
          y: 0,
          cX: a,
        });
      }
      window.requestAnimationFrame(draw);
    })();
  },
  methods: {
    liuX(x, sX, sY) {
      cxt.save();
      var y = getY(x, sY, sX);
      var r = 15;
      var wX = x + Math.cos(range) * length;
      var wY = y + Math.sin(range) * length;

      var x1 = x + 3;
      var y1 = y;
      var x2 = x;
      var y2 = y - 3;

      var rad = cxt.createRadialGradient(x, y, 0, x, y, r);
      rad.addColorStop(0, "rgba(255,255,255,0.8)");
      rad.addColorStop(0.1, "rgba(255,255,255,0.8)");
      rad.addColorStop(0.2, "rgba(255,255,255,0.08)");
      rad.addColorStop(1, "rgba(255,255,255,0)");
      cxt.fillStyle = rad;
      cxt.beginPath();
      cxt.arc(x, y, r, 0, 2 * Math.PI, true);
      cxt.closePath();
      cxt.fill();
      cxt.restore();

      cxt.save();
      var rad2 = cxt.createRadialGradient(x, y, 0, x, y, length);
      rad2.addColorStop(0, "rgba(255,255,255,0.1)");
      rad2.addColorStop(1, "rgba(255,255,255,0)");
      cxt.fillStyle = rad2;
      cxt.beginPath();
      cxt.moveTo(x1, y1);
      cxt.lineTo(x2, y2);
      cxt.lineTo(wX, wY);
      cxt.closePath();
      cxt.fill();
      cxt.restore();
    },
    getY(x, startY, startX) {
      return k * x + startY - k * startX;
    },
    Cricle(x, y, r) {
      cxt.save();
      var rad = cxt.createRadialGradient(x, y, 0, x, y, r);
      rad.addColorStop(0, "rgba(255,255,255,0.8)");
      rad.addColorStop(0.1, "rgba(255,255,255,0.8)");
      rad.addColorStop(0.2, "rgba(255,255,255,0.08)");
      rad.addColorStop(1, "rgba(255,255,255,0)");
      cxt.fillStyle = rad;
      cxt.beginPath();
      cxt.arc(x, y, r, 0, 2 * Math.PI, true);
      cxt.closePath();
      cxt.fill();
      cxt.restore();
    },
  },
};
</script>

<style lang="scss" scoped></style>
