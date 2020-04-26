class Eventable {

  constructor() {
    this.listeners = [];
  }

  on(event, callback) {
    let handler = evt => {
      callback(evt);
    };
    this.listeners.push({ event, handler });

    return handler;
  }

  off(event, handler) {
    for (let i = 0; i < this.listeners.length; i++) {
      let listener = this.listeners[i];
      if (listener.event === event && listener.handler === handler) {
        this.listeners.splice(i, 1);
        return;
      }
    }
  }

  emit(event, data) {
    for (let listener of this.listeners) {
      if (listener.event !== event) continue;
      listener.handler({ target: this, data});
    }
  }
  
}