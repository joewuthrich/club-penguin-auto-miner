class Controller {
  constructor() {
    this.pos1 = [0, 0];
    this.pos2 = [0, 0];
    this.currentPos = [0, 0];
    this.loop = false;
  }

  setCoordinates() {
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

    console.log("Click and drag to select an area to mine in.");
    document.addEventListener("mousedown", posOneListener);
    document.addEventListener("mouseup", posTwoListener);
  }

  removeCoordinateListener(listener1, listener2) {
    document.removeEventListener("mousedown", listener1);
    document.removeEventListener("mouseup", listener2);
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
    -document.getElementById("cpr_client").dispatchEvent(event);

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

  startLoop(pos1, pos2) {
    if (this.loop) return;
    this.loop = true;

    this.pos1 = pos1;
    this.pos2 = pos2;

    //  BAD PRACTICE NOT TO WAIT FOR ERROR
    browser.runtime.sendMessage({
      action: "updateIcon",
      path: "./icon.png",
    });

    const keydownEventListener = (event) => {
      if (event.key == "Escape") {
        this.stopLoop();
        document.removeEventListener("keydown", keydownEventListener);
      }
    };

    document.addEventListener("keydown", keydownEventListener);

    console.log("Starting automatic loop");
    this.loopFunction();
  }

  sleep(min, max) {
    var ms = this.getRandomRange(min * 1000, max * 1000);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loopFunction() {
    if (!this.loop) {
      console.log("Automatic loop stopped.");
      //  BAD PRACTICE NOT TO WAIT FOR ERROR
      browser.runtime.sendMessage({
        action: "updateIcon",
        path: "./icon-disabled.png",
      });
      return;
    }

    var innerX = [this.currentPos[0] - 27, this.currentPos[0] + 27];
    var innerY = [this.currentPos[1] - 1, this.currentPos[1] + 45];

    var newPos = [
      this.getRandomRangeInterval(...innerX),
      this.getRandomRangeInterval(...innerY),
    ];

    while (
      newPos[0] < this.pos1[0] ||
      newPos[0] > this.pos2[0] ||
      newPos[0] == this.currentPos[0] ||
      newPos[1] < this.pos1[1] ||
      newPos[1] > this.pos2[1] ||
      newPos[1] == this.currentPos[1]
    ) {
      var newPos = [
        this.getRandomRangeInterval(...innerX),
        this.getRandomRangeInterval(...innerY),
      ];
    }

    // var random = Math.random();
    // var places = [];
    // if (
    //   this.isInsideRange(
    //     [this.currentPos[0] - 35, this.currentPos[1] + 50],
    //     [this.currentPos[0] + 30, this.currentPos[1] + 55]
    //   )
    // ) {
    //   // top + left
    //   places.push[0];
    // }

    // if (
    //   this.isInsideRange(
    //     [this.currentPos[0] + 30, this.currentPos[1] - 1],
    //     [this.currentPos[0] + 35, this.currentPos[1] + 55]
    //   )
    // ) {
    //   // right + top
    //   places.push[1];
    // }

    // if (
    //   this.isInsideRange(
    //     [this.currentPos[0] - 30, this.currentPos[1] - 1],
    //     [this.currentPos[0] + 35, this.currentPos[1] - 6]
    //   )
    // ) {
    //   // bottom + right
    //   places.push[2];
    // }

    // if (
    //   this.isInsideRange(
    //     [this.currentPos[0] - 35, this.currentPos[1] - 30],
    //     [this.currentPos[0] - 6, this.currentPos[1] + 50]
    //   )
    // ) {
    //   // left + bottom
    //   places.push[3];
    // }

    // if (places.length == 0) {
    //   console.log("IMPOSSIBLE POSITION!");
    //   return;
    // }

    // var location = places[math.round(getRandomRange(0, places.length - 1))];

    // if (location == 0) {
    //   // top + left
    //   this.currentPos = [
    //     this.getRandomRange(this.currentPos[0] - 35, this.currentPos[0] + 30),
    //     this.getRandomRange(this.currentPos[1] + 50, this.currentPos[1] + 55),
    //   ];
    // } else if (location == 1) {
    //   // right + top
    //   this.currentPos = [
    //     this.getRandomRange(this.currentPos[0] + 30, this.currentPos[0] + 35),
    //     this.getRandomRange(this.currentPos[1] - 1, this.currentPos[1] + 55),
    //   ];
    // } else if (location == 2) {
    //   // bottom + right
    //   this.currentPos = [
    //     this.getRandomRange(this.currentPos[0] - 30, this.currentPos[0] + 35),
    //     this.getRandomRange(this.currentPos[1] - 1, this.currentPos[1] - 6),
    //   ];
    // } else if (location == 3) {
    //   // left + bottom
    //   this.currentPos = [
    //     this.getRandomRange(this.currentPos[0] - 35, this.currentPos[0] - 30),
    //     this.getRandomRange(this.currentPos[1] - 6, this.currentPos[1] + 50),
    //   ];
    // } else {
    //   console.log("IMPOSSIBLE POSITION!");
    //   return;
    // }

    this.currentPos = newPos;

    console.log(
      "Moving to " + this.currentPos[0] + ", " + this.currentPos[1] + "."
    );
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
    console.log("Stopping automatic loop.");

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
    remote.setCoordinates();
  }

  if (request.action == "startMining") {
    remote.startLoop(request.pos1, request.pos2);
  }

  if (request.action == "stopMining") {
    remote.stopLoop();
  }
});
