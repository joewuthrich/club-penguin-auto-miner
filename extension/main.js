//TODO: THIS MAY BE IMPOSSIBLE - NOT SURE IF YOU CAN ACTUALLY SEND CLICKS

class Controller {
  constructor() {
    this.pos1 = [0, 0];
    this.pos2 = [0, 0];
    this.loop = false;
  }

  setCoordinates() {
    const posTwoListener = (e) => {
      this.setPos2(e);
      this.click(1838, 1000);
      this.removeCoordinateListener(posTwoListener);
    };

    console.log("Click and drag to select an area to mine in.");
    document.addEventListener("mousedown", this.setPos1);
    document.addEventListener("mouseup", posTwoListener);
  }

  setPos1(e) {
    this.pos1 = [e.clientX, e.clientY];
    console.log([e.clientX, e.clientY]);
  }

  setPos2(e) {
    this.pos2 = [e.clientX, e.clientY];
    console.log([e.clientX, e.clientY]);
  }

  removeCoordinateListener(listener) {
    document.removeEventListener("mousedown", this.setPos1);
    document.removeEventListener("mouseup", listener);
  }

  click(x, y) {
    console.log("clicking at " + x + "," + y);
    var ev = new MouseEvent("mouseup", {
      view: window,
      button: 0,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    });

    console.log(ev.clientX);

    document.getElementById("cpr_client").dispatchEvent(ev);
  }
}

const remote = new Controller();
remote.setCoordinates();
