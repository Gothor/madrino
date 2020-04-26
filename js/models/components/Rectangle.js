class Rectangle extends Component {

  constructor(x, y, w, h) {
    super("Rectangle");
    this.localPosition = new p5.Vector(x, y);
    this.dimensions = new p5.Vector(w, h);
  }

  get globalPosition() {
    if (!this.parent) {
      return new p5.Vector(this.localPosition.x, this.localPosition.y);
    }

    return p5.Vector.add(this.parent.globalPosition, this.localPosition);
  }

  draw() {
    stroke(0);
    fill(150);
    rect(pos.x, pos.y, this.dimensions.x, this.dimensions.y);
  }

}