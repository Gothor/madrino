class ImageComponent extends Component {

  constructor(sprite, x, y, w, h) {
    super("ImageComponent");
    this.sprite = sprite;
    this.localPosition = new p5.Vector(x, y);
    this.dimensions = new p5.Vector(w, h);
  }

  draw() {
    fill(255, 0, 0);
    stroke(0);
    this.sprite.draw(0, 0, this.dimensions.x, this.dimensions.y);
  }

}