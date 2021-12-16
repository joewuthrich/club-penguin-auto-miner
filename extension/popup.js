var pos1, pos2;

function checkStorage() {
  pos1 = browser.storage.sync.get("pos1");
  pos2 = browser.storage.sync.get("pos2");

  pos1.then((res1) => {
    pos2.then((res2) => {
      if (res1 && res2) {
        pos1 = res1.pos1;
        pos2 = res2.pos2;
        document.getElementById("start").classList.remove("disabled");
        document.getElementById("stop").classList.remove("disabled");
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

document.getElementById("start").addEventListener("mouseup", () => {
  if (document.getElementById("start").classList.contains("disabled")) return;

  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
      for (let tab of tabs) {
        console.log(pos1);
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

document.getElementById("stop").addEventListener("mouseup", () => {
  if (document.getElementById("start").classList.contains("disabled")) return;

  browser.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
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
