const defaultConfig = {
  width: 500,
  height: 300,
  style: {
    color: '#e1ecf2',
    lineWidth: 1
  }
}

export class Grid {
  constructor(config = defaultConfig) {
    this.width = config.width;
    this.height = config.height;
    this.style = config.style;

    this.verticalPoints = [];
    this.horizontalPoints = [];
  }

  setPoints(vertical = [], horizontal = []) {
    this.verticalPoints = vertical.map(p => p);
    this.horizontalPoints = horizontal.map(p => p);
  }

  draw(context) {
    const { verticalPoints, horizontalPoints, width, height, style } = this;

    context.beginPath();
    context.strokeStyle = style.color;
    context.lineWidth = style.lineWidth;

    verticalPoints.forEach(p => {
      context.moveTo(p + 0.5, 0);
      context.lineTo(p + 0.5, height);
    });

    horizontalPoints.forEach(p => {
      context.moveTo(0, p + 0.5);
      context.lineTo(width, p + 0.5);
    });

    context.stroke();
  }
}
