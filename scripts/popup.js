// Diese Funktion erlaubt das erkennen von Nachrichten, und ruft dann die Funktion bekommeNachricht auf
var bkg = chrome.extension.getBackgroundPage();
chrome.runtime.onMessage.addListener((message) => {
  if (message.command === "show_ads") {
    var anchor = document.getElementById("ad_anchor");
    var id = message.id;
    var ad = message.ad.replace('hidden=""','');
    // this part can be removed, if there should be only a visualisation of the ads, and not choice
    ad = '<label for = '+ id + '>' + ad + '</label> <br>'
    ad += '<input type="checkbox" class = "ads" id = + ' + id + ' value =' + id  +'>';

    //end of part
    anchor.innerHTML = ad + anchor.innerHTML;
  }
});

chrome.runtime.sendMessage({command: "popup_ready"})

window.onbeforeunload = function (e) {
  chrome.runtime.sendMessage({command: "popup_closed"})
};

//this handles the submit event of the form, it gets all checked ids and sends them to the background script which then sends them to the sever
const form = document.getElementById("ad_anchor");
form.addEventListener('submit', event => {
  console.log("submit success");
  event.preventDefault();
  var ads = document.getElementsByClassName('ads');
  list = [];
  for(var i=0; ads[i]; ++i){
        if(ads[i].checked){
             list.push(ads[i].value);
        }
  }
  chrome.runtime.sendMessage({
    command: "send_checked",
    list: list
  });
  console.log("sending success");
})

// bkg.console.log("popup runs");
