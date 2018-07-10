const defaultConfig = {
  width: 500,
  height: 300,
  style: {
    backgroundColor: '#fff',
    zIndex: 1,
    border: 'none'
  }
};

const ZOOM_FACTOR = 1.1;

export class Scene {
  constructor(config = defaultConfig) {
    this.mousePushed = false;
    this.objects = [];
    this.width = config.width;
    this.height = config.height;
    this.scale = 1;
    this.originX = 0;
    this.originY = 0;
    this.dataSet = null;

    this.mouse = {
      clicked: false,
      x: 0,
      y: 0,
      zoom: 1
    };

    this.lastX = 0;

    this.handleMouseDown = this.onMouseDown.bind(this);
    this.handleMouseUp = this.onMouseUp.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleMouseWheel = this.onMouseWheel.bind(this);

    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    canvas.style.backgroundColor = config.style.backgroundColor;
    canvas.style.zIndex = config.style.zIndex;
    canvas.style.border = config.style.border;

    this.context = canvas.getContext('2d');
    this.context.translate(0, canvas.height);
    this.context.scale(1, -1);

    canvas.addEventListener('mousedown', this.handleMouseDown);
    canvas.addEventListener('mouseup', this.handleMouseUp);
    canvas.addEventListener('mousewheel', this.handleMouseWheel);
  }

  getMousePosition(event) {
    const rect = this.context.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    return {
      x: x,
      y: y
    }
  }

  onMouseDown(e) {
    let pos = this.getMousePosition(e);
    this.mouse = {
      clicked: true,
      x: e.offsetX,
      y: e.offsetY
    };

    this.lastX = e.offsetX;
    this.context.canvas.style.cursor = 'move';
    this.context.canvas.addEventListener('mousemove', this.handleMouseMove);
  }

  onMouseUp(e) {
    this.mouse.clicked = false;
    this.context.canvas.style.cursor = 'default';
    this.context.canvas.removeEventListener('mousemove', this.handleMouseMove);
  }

  onMouseMove(e) {
    if (this.mouse.clicked) {
      let pos = this.getMousePosition(e);
      let delta = e.offsetX - this.lastX;

      this.originX += delta / this.scale;
      this.lastX = e.offsetX;

      if (this.dataSet) {
        this.dataSet.updateOriginX(this.originX);
      }

      this.render();
    }
  }

  onMouseWheel(e) {
    const { x: mouseX, y: mouseY } = this.getMousePosition(e);
    const delta = e.wheelDelta / 120;
    const factor = Math.pow(1 + Math.abs(delta) / 2, delta > 0 ? 1 : -1);
    let { originX, originY, scale } = this;

    console.log(delta, factor);

    scale *= factor;

    this.zoom(originX, originY, scale);
    this.render();
  }

  zoom(x, y, scale) {
    this.originX = x;
    this.originY = y;
    this.scale = scale;

    if (this.dataSet) {
      this.dataSet.updateScale(scale);
    }
  }

  addObject(object) {
    this.objects.push(object);
  }

  setData(dataSet) {
    this.dataSet = dataSet;
  }

  appendTo(element) {
    if (element && element.appendChild) {
      element.appendChild(this.context.canvas);
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  render() {
    this.clear();

    if (this.dataSet) {
      this.context.save();
      this.context.translate(this.originX * this.scale, 0);
      this.context.scale(this.scale, 1);
      this.dataSet.draw(this.context);
      this.context.restore();
    }
  }
}

function getRndColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
