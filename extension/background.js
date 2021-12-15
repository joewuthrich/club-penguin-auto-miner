browser.runtime.onMessage.addListener((data) => {
  if (data.action == "updateIcon") {
    browser.browserAction.setIcon({ path: data.path });
  }
});
