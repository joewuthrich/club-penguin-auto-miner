class Controller {
  constructor() {
    this.pos1 = [0, 0];
    this.pos2 = [0, 0];
    this.loop = false;
  }

  setCoordinates() {
    const posTwoListener = (e) => {
      this.setPos2(e);
      this.click(687, 583);
      this.removeCoordinateListener(posTwoListener);
    };

    console.log("Click and drag to select an area to mine in.");
    document.addEventListener("mousedown", this.setPos1);
    document.addEventListener("mouseup", posTwoListener);
  }

  setPos1(e) {
    this.pos1 = [e.offsetX, e.offsetY];
    console.log([e.offsetX, e.offsetY]);
  }

  setPos2(e) {
    this.pos2 = [e.offsetX, e.offsetY];
    console.log([e.offsetX, e.offsetY]);
  }

  removeCoordinateListener(listener) {
    document.removeEventListener("mousedown", this.setPos1);
    document.removeEventListener("mouseup", listener);
  }

  click(x, y) {
    console.log("clicking at " + x + "," + y);
    var ev = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientX: y,
    });

    var el = document.elementFromPoint(x, y);
    console.log(el);
    console.log(el.dispatchEvent(ev));
  }
}

const remote = new Controller();
remote.setCoordinates();
