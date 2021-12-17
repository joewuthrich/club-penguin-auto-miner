class Controller {
  constructor() {
    this.pos1 = [0, 0];
    this.pos2 = [0, 0];
    this.currentPos = [0, 0];
    this.loop = false;
    this.selecting = false;
  }

  setNewCoordinates() {
    const posOneListener = (e) => {
      document.querySelector("body").append(this.getHighlightObject());

      this.pos1 = [e.clientX, e.clientY];
      this.selecting = true;
    };

    const posTwoListener = (e) => {
      this.selecting = false;
      this.pos2 = [e.clientX, e.clientY];
      this.removeCoordinateListener(posOneListener, posTwoListener);
      var maxX = Math.max(this.pos1[0], this.pos2[0]);
      var minX = Math.min(this.pos1[0], this.pos2[0]);
      var maxY = Math.max(this.pos1[1], this.pos2[1]);
      var minY = Math.min(this.pos1[1], this.pos2[1]);

      this.currentPos = this.pos2;
      this.pos1 = [minX, minY];
      this.pos2 = [maxX, maxY];

      document.getElementById("drag-highlight").remove();

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
    const div = this.getHighlightObject();
    document.querySelector("body").append(div);
    this.setHighlightObject(div);

    setTimeout(() => {
      browser.runtime.sendMessage({
        action: "startMining",
      });
      this.loopFunction();
    }, 1200);
  }

  sleep(min, max) {
    var ms = this.getRandomRange(min * 1000, max * 1000);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loopFunction() {
    if (!this.loop) {
      browser.runtime.sendMessage({
        action: "stopMining",
      });
      return;
    }

    var innerX = [this.currentPos[0] - 24, this.currentPos[0] + 24];
    var innerY = [this.currentPos[1] - 1, this.currentPos[1] + 41];

    var newPos = [
      this.getRandomRangeInterval(...innerX, 4),
      this.getRandomRangeInterval(...innerY, 4),
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
        this.getRandomRangeInterval(...innerX, 7),
        this.getRandomRangeInterval(...innerY, 7),
      ];
      counter++;
    }

    this.currentPos = newPos;

    this.click(...this.currentPos);
    await this.sleep(0.25, 0.32);
    var random = Math.random();
    if (random < 0.004) {
      this.pressKey(83, 115); // s
      await this.sleep(0.2, 0.3);
    } else if (random < 0.008) {
      this.pressKey(87, 119); // w
      await this.sleep(0.2, 0.3);
    }
    this.pressKey(68, 100); // d
    if (random > 0.995) {
      await this.sleep(0.4, 0.7);
      this.pressKey(72, 104); // h
      await this.sleep(0.2, 0.4);
    }

    await this.sleep(3.4, 3.8);

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

  getRandomRangeInterval(innerMin, innerMax, range) {
    var point = this.getRandomRange(0, range);

    if (point < range / 2) point = innerMin - point;
    else point = innerMax + point;

    return point;
  }

  stopLoop() {
    if (!this.loop) return;
    this.loop = false;
    if (document.getElementById("drag-highlight"))
      document.getElementById("drag-highlight").remove();
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

  getHighlightObject() {
    var div = document.createElement("div");
    div.id = "drag-highlight";
    div.style.position = "absolute";
    div.style.backgroundColor = "transparent";
    div.style.opacity = "0.4";
    div.style.zIndex = 3;
    div.style.pointerEvents = "none";
    div.style.border = "5px dashed red";
    return div;
  }

  setHighlightObject(div) {
    div.style.left = this.pos1[0];
    div.style.top = this.pos1[1];
    div.style.width = this.pos2[0] - this.pos1[0];
    div.style.height = this.pos2[1] - this.pos1[1];
  }
}

const remote = new Controller();
browser.runtime.sendMessage({
  action: "stopMining",
});

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

document.addEventListener("mousemove", (event) => {
  if (remote.selecting) {
    var div = document.getElementById("drag-highlight");
    div.style.left = Math.min(remote.pos1[0], event.clientX);
    div.style.top = Math.min(remote.pos1[1], event.clientY);
    div.style.width = Math.abs(event.clientX - remote.pos1[0]);
    div.style.height = Math.abs(event.clientY - remote.pos1[1]);
  }
});

function setHighlightObject() {}
