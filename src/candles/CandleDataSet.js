const CANDLE_WIDTH = 10;
const CANDLE_OFFSET_X = 20;
const COLOR_GREEN = '#52b987';
const COLOR_RED = '#eb4e5c';

export class CandleDataSet {
  constructor(items, canvasWidth, canvasHeight) {
    this.items = items;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    const { min, max } = this.getBoundaryValues();
    this.minValue = min;
    this.maxValue = max;
    this.xStep = canvasHeight  / items.length / 2;
    this.candleOffsetX = 2 * this.xStep;
    this.scale = 1;

    this.viewRect = {
      x: 0,
      y: 0,
      h: canvasHeight / this.scale,
      w: canvasWidth / this.scale
    };
  }

  updateScale(scale) {
    this.scale = scale;
  }

  updateOriginX(originX) {
    this.viewRect = {
      x: originX * -1,
      y: 0,
      h: this.canvasHeight / this.scale,
      w: (this.canvasWidth - originX) / this.scale
    };

    console.log('viewport', this.viewRect);
  }

  getBoundaryValues() {
    let [timestamp, open, close, min, max] = this.items[0];

    this.items.forEach(item => {
      let [timestamp, open, close, itemMin, itemMax] = item;

      if (itemMin < min) {
        min = itemMin;
      }

      if (itemMax > max) {
        max = itemMax;
      }
    });

    return {
      min,
      max
    };
  }

  getYPositionByValue(value) {
    return (value - this.minValue) * this.canvasHeight / (this.maxValue - this.minValue);
  }

  isPositive(candle) {
    const [timestamp, openPrice, closePrice] = candle;
    return (closePrice > openPrice);
  }

  draw(context) {
    const vp = this.viewRect;

    context.save();

    context.rect(vp.x, vp.y, vp.h, vp.w);
    context.fill();

    this.items.forEach((item, index) => {
        const [timestamp, openPrice, closePrice, minPrice, maxPrice] = item;
        // const xPosition = (index + 1) * CANDLE_OFFSET_X;
        const xPosition = (index + this.xStep) * this.candleOffsetX;
        const minRectY = this.getYPositionByValue(Math.min(openPrice, closePrice));
        const maxRectY = this.getYPositionByValue(Math.max(openPrice, closePrice));
        const rectHeight = maxRectY - minRectY;
        const candleColor = this.isPositive(item) ? COLOR_GREEN : COLOR_RED;

        if (xPosition > vp.x && (xPosition + (this.xStep * 2)) < (vp.x + vp.w)) {
          context.beginPath();
          context.fillStyle = candleColor;
          context.strokeStyle = candleColor;
          context.lineWidth = 1 / this.scale;

          context.moveTo(xPosition, this.getYPositionByValue(minPrice));
          context.lineTo(xPosition, this.getYPositionByValue(maxPrice));

          context.fillRect(xPosition - this.xStep/2, minRectY, this.xStep, rectHeight);
          context.stroke();
        }
    });

    context.restore();
  }
}
