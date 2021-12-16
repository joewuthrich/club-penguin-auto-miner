var pos1, pos2;
var mining = false;

function checkStorage() {
  pos1 = browser.storage.sync.get("pos1");
  pos2 = browser.storage.sync.get("pos2");
  mining = browser.storage.sync.get("mining");

  pos1.then((res1) => {
    pos2.then((res2) => {
      if (res1 && res2) {
        mining.then((res3) => {
          pos1 = res1.pos1;
          pos2 = res2.pos2;
          mining = res3.mining;
          if (!mining)
            document.getElementById("start").classList.remove("disabled");
          else document.getElementById("stop").classList.remove("disabled");
        });
      }
    });
  });
}

checkStorage();

document.getElementById("area").addEventListener("mouseup", () => {
  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(tab.id, { action: "setArea" }).catch(onError);
      }
    })
    .catch(onError);
});

document.getElementById("start").addEventListener("mouseup", function () {
  if (this.classList.contains("disabled")) return;

  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
      for (let tab of tabs) {
        browser.storage.sync.set({
          mining: true,
        });
        this.classList.add("disabled");
        document.getElementById("stop").classList.remove("disabled");
        browser.tabs
          .sendMessage(tab.id, {
            action: "startMining",
            pos1: pos1,
            pos2: pos2,
          })
          .catch(onError);
      }
    })
    .catch(onError);
});

document.getElementById("stop").addEventListener("mouseup", function () {
  if (this.classList.contains("disabled")) return;

  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
      browser.storage.sync.set({
        mining: false,
      });
      this.classList.add("disabled");
      document.getElementById("start").classList.remove("disabled");
      for (let tab of tabs) {
        browser.tabs
          .sendMessage(tab.id, { action: "stopMining" })
          .catch(onError);
      }
    })
    .catch(onError);
});

function onError(error) {
  console.error(`Error: ${error}`);
}
