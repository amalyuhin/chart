export class Cursor {
  constructor(options = { x: 100, y: 100 }) {
    this.options = options;
    this.context = undefined;
  }

  followToMouse() {
    if (!this.context) {
      return;
    }

    const canvas = this.context.canvas;

    canvas.addEventListener('mousemove', (e) => {
      this.options.x = e.pageX - 10;
      this.options.y = canvas.height - e.pageY + 7;

      if (this.options.x < 0) {
        this.options.x = 0;
      } else if (this.options.x > canvas.width) {
        this.options.x = canvas.width;
      }

      if (this.options.y < 0) {
        this.options.y = 0;
      } else if (this.options.y > canvas.height) {
        this.options.y = canvas.height;
      }

      this.draw(this.context);
    });
  }

  draw(context) {
    this.context = context;
    if (!this.context) {
      return false;
    }

    const ctx = this.context;
    const x = this.options.x;
    const y = this.options.y;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.save();
    ctx.setLineDash([5, 5]);/*dashes are 5px and spaces are 3px*/
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.strokeStyle = 'gray';
    ctx.stroke();
    ctx.restore();
  }
}
