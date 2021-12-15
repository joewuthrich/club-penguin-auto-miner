document
  .getElementById("cprminer-button-start")
  .addEventListener("click", () => {
    document.getElementById("cprminer-button-start").innerHTML = "Select Area";
    browser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(sendMessageToTabs)
      .catch(onError);
  });

function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(tab.id, "STARTMINING").catch(onError);
  }
}
