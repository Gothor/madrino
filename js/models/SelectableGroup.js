class SelectableGroup extends Eventable {

  constructor(items) {
    super();
    this.items = [];
    this.selected = null;

    if (items instanceof Array && items.every(s => s instanceof Selectable)) {
      for (let item of items) {
        this.addItem(item);
      }
    } else if (items instanceof Selectable) {
      this.addItem(items);
    } else if (items) {
      throw "Selectable group can only contain Selectable objects";
    }
  }

  addItem(item) {
    if (item instanceof Selectable) {
      this.items.push(item);
      item.on('select', evt => {
        if (evt.target === this.selected) {
          return;
        }
        for (let item of this.items) {
          if (item !== evt.target) {
            item.selected = false;
          }
        }
        this.selected = evt.target;
        this.emit('change');
      });
    } else {
      throw "Selectable group can only contain Selectable objects";
    }
  }

  getSelected() {
    return this.selected;
  }

  clearSelection() {
    this.selected.deselect();
    this.selected = null;
  }
  
  get value() {
    if (this.selected) {
      return this.selected.value;
    }
    return null;
  }

}