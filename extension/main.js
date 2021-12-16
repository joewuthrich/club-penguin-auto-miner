class Controller {
  constructor() {
    this.pos1 = [0, 0];
    this.pos2 = [0, 0];
    this.currentPos = [0, 0];
    this.loop = false;
  }

  setNewCoordinates() {
    const posOneListener = (e) => {
      this.pos1 = [e.clientX, e.clientY];
    };

    const posTwoListener = (e) => {
      this.pos2 = [e.clientX, e.clientY];
      this.removeCoordinateListener(posOneListener, posTwoListener);
      var maxX = Math.max(this.pos1[0], this.pos2[0]);
      var minX = Math.min(this.pos1[0], this.pos2[0]);
      var maxY = Math.max(this.pos1[1], this.pos2[1]);
      var minY = Math.min(this.pos1[1], this.pos2[1]);

      this.currentPos = this.pos2;
      this.pos1 = [minX, minY];
      this.pos2 = [maxX, maxY];

      browser.runtime.sendMessage({
        action: "updateStorage",
        pos1: this.pos1,
        pos2: this.pos2,
      });
    };

    document.addEventListener("mousedown", posOneListener);
    document.addEventListener("mouseup", posTwoListener);
  }

  removeCoordinateListener(listener1, listener2) {
    document.removeEventListener("mousedown", listener1);
    document.removeEventListener("mouseup", listener2);
  }

  setCoordinates(pos1, pos2) {
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.currentPos = [
      (pos2[0] - pos1[0]) / 2 + pos1[0],
      (pos2[1] - pos1[1]) / 2 + pos1[1],
    ];
  }

  click(x, y) {
    //  MOUSEDOWN AND CLICK ARE JUST BECAUSE THEY MIGHT CHECK FOR IT
    //  IN THE FUTURE, CURRENTLY THEY ONLY CHECK MOUSEUP
    var event = new MouseEvent("mousedown", {
      view: window,
      button: 0,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    });
    document.getElementById("cpr_client").dispatchEvent(event);

    event = new MouseEvent("mouseup", {
      view: window,
      button: 0,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    });

    document.getElementById("cpr_client").dispatchEvent(event);

    var event = new MouseEvent("click", {
      view: window,
      button: 0,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    });

    document.getElementById("cpr_client").dispatchEvent(event);
  }

  startLoop() {
    if (this.loop) return;
    this.loop = true;

    this.click(...this.currentPos);
    console.log(this.currentPos);
    setTimeout(() => {
      //  BAD PRACTICE NOT TO WAIT FOR ERROR
      browser.runtime.sendMessage({
        action: "updateIcon",
        path: "./icon.png",
      });
      this.loopFunction();
    }, 1200);
  }

  sleep(min, max) {
    var ms = this.getRandomRange(min * 1000, max * 1000);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loopFunction() {
    if (!this.loop) return;

    var innerX = [this.currentPos[0] - 27, this.currentPos[0] + 27];
    var innerY = [this.currentPos[1] - 1, this.currentPos[1] + 50];

    var newPos = [
      this.getRandomRangeInterval(...innerX),
      this.getRandomRangeInterval(...innerY),
    ];

    var counter = 0;
    while (
      newPos[0] < this.pos1[0] ||
      newPos[0] > this.pos2[0] ||
      newPos[0] == this.currentPos[0] ||
      newPos[1] < this.pos1[1] ||
      newPos[1] > this.pos2[1] ||
      newPos[1] == this.currentPos[1]
    ) {
      if (counter > 400) break;

      var newPos = [
        this.getRandomRangeInterval(...innerX),
        this.getRandomRangeInterval(...innerY),
      ];
      counter++;
    }

    this.currentPos = newPos;

    this.click(...this.currentPos);
    await this.sleep(0.35, 0.45);
    var random = Math.random();
    if (random < 0.005) this.pressKey(83, 115);
    // s
    else if (random < 0.01) this.pressKey(87, 119);
    // w
    else {
      if (random > 0.995) {
        await this.sleep(0.4, 0.7);
        this.pressKey(72, 104); // h
        await this.sleep(0.2, 0.4);
      } else this.pressKey(68, 100); // d
    }

    await this.sleep(3.3, 3.8);

    this.loopFunction();
  }

  isInsideRange(coord1, coord2) {
    return (
      this.pos1[0] < coord1[0] &&
      coord1[0] < this.pos2[0] &&
      this.pos1[0] < coord2[0] &&
      coord2[0] < this.pos2[0] &&
      this.pos1[1] < coord1[1] &&
      coord1[1] < this.pos2[1] &&
      this.pos1[1] < coord2[1] &&
      coord2[1] < this.pos2[1]
    );
  }

  getRandomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  getRandomRangeInterval(innerMin, innerMax) {
    const range = 10;
    var point = this.getRandomRange(0, range);

    if (point < range / 2) point = innerMin - point;
    else point = innerMax + point;

    return point;
  }

  stopLoop() {
    if (!this.loop) return;

    //  BAD PRACTICE NOT TO WAIT FOR ERROR
    browser.runtime.sendMessage({
      action: "updateIcon",
      path: "./icon-disabled.png",
    });
    this.loop = false;
  }

  pressKey(keyCode, charCode) {
    //  KEYPRESS AND KEYUP ARE JUST BECAUSE THEY MIGHT CHECK FOR IT
    //  IN THE FUTURE, CURRENTLY THEY ONLY CHECK KEYDOWN

    var event = new KeyboardEvent("keydown", {
      keyCode: keyCode,
      bubbles: true,
      cancelable: true,
    });

    document.getElementsByTagName("body")[0].dispatchEvent(event);

    var event = new KeyboardEvent("keypress", {
      charCode: charCode,
      bubbles: true,
      cancelable: true,
    });

    document.getElementsByTagName("body")[0].dispatchEvent(event);

    var event = new KeyboardEvent("keyup", {
      keyCode: keyCode,
      bubbles: true,
      cancelable: true,
    });

    document.getElementsByTagName("body")[0].dispatchEvent(event);
  }
}

const remote = new Controller();

browser.runtime.onMessage.addListener((request) => {
  if (request.action == "setArea") {
    remote.setNewCoordinates();
  }

  if (request.action == "startMining") {
    remote.setCoordinates(request.pos1, request.pos2);
    remote.startLoop();
  }

  if (request.action == "stopMining") {
    remote.stopLoop();
  }
});

document.addEventListener("mouseup", (event) => {
  console.log(event.clientX + " " + event.clientY);
});
