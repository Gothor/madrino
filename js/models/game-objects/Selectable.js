class Selectable extends Button {

  constructor(content, value, x, y, w, h, callback, parent) {
    super(content, x, y, w, h, callback, parent);
    this.value = value;
    this.selected = false;
    this.onClick = () => {
      this.select();
      if (callback) {
        callback();
      }
    };
  }

  select() {
    this.selected = true;
    this.emit('select');
  }

  deselect() {
    this.selected = false;
    this.emit('deselect');
  }

  toggle() {
    this.selected = !this.selected;
  }

}