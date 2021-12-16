browser.runtime.onMessage.addListener((data) => {
  if (data.action == "updateIcon") {
    browser.browserAction.setIcon({ path: data.path });
  }
  if (data.action == "updateStorage") {
    browser.storage.sync.set({
      pos1: data.pos1,
      pos2: data.pos2,
    });
  }
});
