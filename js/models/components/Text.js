class Text extends Component {

  constructor(text, x, y, horizontalAlignment, verticalAlignment) {
    super("Text");
    this.text = text;
    this.localPosition = new p5.Vector(x, y);
    this.horizontalAlignment = horizontalAlignment;
    this.verticalAlignment = verticalAlignment;
  }

  get globalPosition() {
    if (!this.parent) {
      return new p5.Vector(this.localPosition.x, this.localPosition.y);
    }

    return p5.Vector.add(this.parent.globalPosition, this.localPosition);
  }

  draw() {
    noStroke();
    fill(0);
    textSize(24);
    textAlign(this.horizontalAlignment, this.verticalAlignment);
    text(this.text, 0, 0);
  }

}