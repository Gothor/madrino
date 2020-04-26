class Button extends Clickable {

  constructor(content, x, y, w, h, callback, parent) {
    super(x, y, w, h, parent);
    this.dimensions = new p5.Vector(w, h);
    this.onClick = callback;
    this.hovered = false;

    // Text
    if (typeof(content) === "string") {
      let rectangle = new Rectangle(0, 0, w, h);
      this.addComponent(rectangle);

      let text = new Text(content, w / 2, h / 2, CENTER, CENTER);
      this.addComponent(text);
    }
    // Sprite
    else if (content instanceof Sprite) {
      let image = new ImageComponent(content, 0, 0, w, h);
      this.addComponent(image);
    }
    // Error
    else {
      throw "Content type not supported";
    }
  }
  
  setDimensions(w, h) {
    this.dimensions.x = w;
    this.dimensions.y = h;

    let collider = this.getComponent(Collider);
    collider.dimensions.x = w;
    collider.dimensions.y = h;

    let imageContent = this.getComponent(ImageComponent);
    if (imageContent) {
      imageContent.dimensions.x = w;
      imageContent.dimensions.y = h;
    }
  }

  onMove(x, y) {
    if (this.getComponent(Collider).collides(x, y)) {
      this.hovered = true;
    } else {
      this.hovered = false;
    }
  }

  draw() {
    let content = this.getComponent(Text) || this.getComponent(ImageComponent);

    if (content instanceof Text) {
      this.getComponent(Rectangle).draw();
    }
    content.draw();

    if (this.hovered) {
      setCursor("pointer");
    }
  }

}