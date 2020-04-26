class Sprite {

  constructor(texture, x, y, width, height) {
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(x, y, width, height) {
    if (width === undefined) width = this.width;
    if (height === undefined) height = this.height;

    push();
    translate(x, y);
    
    image(this.texture, 0, 0, width, height, this.x, this.y, this.width, this.height);

    pop();
  }

}