browser.runtime.onMessage.addListener((data) => {
  if (data.action == "updateStorage") {
    browser.storage.sync.set({
      pos1: data.pos1,
      pos2: data.pos2,
    });
  }
  if (data.action == "startMining") {
    browser.browserAction.setIcon({ path: "icon.png" });
    browser.storage.sync.set({
      mining: true,
    });

    const popup = browser.extension.getViews({
      type: "popup",
    })[0];

    popup[0].document.getElementById("stop").classList.remove("disabled");
  }
  if (data.action == "stopMining") {
    browser.browserAction.setIcon({ path: "icon-disabled.png" });
    browser.storage.sync.set({
      mining: false,
    });
    popup[0].document.getElementById("start").classList.remove("disabled");
  }
});
