let gameObjects = [];

let registerGlobalGameObject = object => {
  if (gameObjects.indexOf(object) < 0) {
    gameObjects.push(object);
  }
};

let unregisterGlobalGameObject = object => {
  let i = gameObjects.indexOf(object);
  if (i >= 0) {
    gameObjects.splice(i, 1);
  }
}

class GameObject extends Eventable {

  constructor(x, y, parent) {
    super();
    this.setParent(parent);
    this.localPosition = new p5.Vector(x, y);
    this.rotation = 0;
    this.scale = new p5.Vector(1, 1);
    this.components = [];
    this.children = [];
    this.active = true;
  }

  get globalPosition() {
    if (!this.parent) {
      return new p5.Vector(this.localPosition.x, this.localPosition.y);
    }

    return p5.Vector.add(this.parent.globalPosition, this.localPosition);
  }
  
  addChild(child) {
    child.setParent(null);
    
    child.parent = this;
    this.children.push(child);
    unregisterGlobalGameObject(child);
  }
  
  removeChild(child) {
    let i = this.children.indexOf(child);
    if (i < 0) return;
    
    child.parent = null;
    this.children.splice(i, 1);
    registerGlobalGameObject(child);
  }
  
  setParent(parent) {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    
    if (parent) {
      parent.addChild(this);
    } else {
      registerGlobalGameObject(this);
    }
  }

  addComponent(component) {
    this.components.push(component);
    component.setObject(this);
  }
  
  setPosition(x, y) {
    this.localPosition.x = x;
    this.localPosition.y = y;
  }
  
  _draw() {
    if (!this.active) return;

    push();
    translate(this.localPosition.x, this.localPosition.y);
    
    this.draw();
    
    for (let child of this.children) {
      child._draw();
    }

    pop();
  }

  draw() {
    throw "Method not implemented";
  }

  getComponentByName(name) {
    return this.components.find(c => c.name === name);
  }

  getComponent(type) {
    if (typeof(type) !== "function") {
      return this.components.find(c => typeof(c) === type);
    }

    return this.components.find(c => c instanceof type);
  }

  _onClick(x, y) {
    if (!this.active) return;

    for (let child of this.children) {
      child._onClick(x, y);
    }
  }

  _onMove(x, y) {
    if (!this.active) return;

    if (this.onMove) {
      this.onMove(x, y);
    }

    for (let child of this.children) {
      if (child._onMove) child._onMove(x, y);
    }
  }

}