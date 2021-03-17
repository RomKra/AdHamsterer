/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
var bkg = chrome.extension.getBackgroundPage();
function listenForClicks() {
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("ad")) {
      chrome.runtime.sendMessage({
        command: "request_grab"
      });
    } else if (e.target.classList.contains("popup")) {
      chrome.windows.create({
        type: 'popup',
        url : "popup.html",
        width: 600,
        height: 800
      })
    } else if (e.target.classList.contains("alarm")) {
      var button = document.getElementById("alarm_button");
      if(button.innerHTML.includes("Start")){
        button.innerHTML = "Stop the automated ad-grabbing"
      } else {
        button.innerHTML = "Start the automated ad-grabbing";
      }
      chrome.runtime.sendMessage({
        command: "alarm"
      })
    }
});
}
// bkg.console.log(document.getElementById("test").closest('body > div').innerHTML);
listenForClicks();
chrome.runtime.sendMessage({
  command: "alarm_active"
});
chrome.runtime.onMessage.addListener((message) => {
  if(message.command === "answer_alarm_active"){
    var button = document.getElementById("alarm_button");
    if(message.alarm_active === true){
      button.innerHTML === "Stop the automated ad-grabbing"
    } else {
      button.innerHTML = "Start the automated ad-grabbing";
    }
  }
});
