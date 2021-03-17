(function(){
var essential_list = [];
var send_up_to = 0;
var label_sponsor;
var label_pagelet;
var label_role;
var label_name;
var label_likes;
var label_shares_and_comments;
var label_content;
var label_text;
var label_link;
function grab_ad() {
  //this will get all sponsered posts, i.e. all ads
  var list = document.querySelectorAll(label_sponsor);
  console.log("content: original content length: " + list.length);
  var new_list = [];
  // the following will go upwards in the html object to find the parent object, which encompasses the entire ad
  for(var i = 0; i < list.length; i++ ){
    new_list.push(list.item(i).closest(label_pagelet));
    if(new_list[i] === null){
      new_list.pop()
      new_list.push(list.item(i).closest(label_role));
    }
  }
  var essential;
  var current;
  var finding;
  //this will get all interesting information from each found ad
  for(i = 0; i < new_list.length; i++){
    essential = "<div> Name: ";
    current = new_list[i];
    finding =  current.querySelector(label_name);
    if(finding != null){
      essential = essential + finding.innerText;
      finding = null;
    }
    essential = essential + "<br/> Interactions: "
    finding = current.querySelector(label_likes);
    if(finding != null){
      essential = essential + finding.innerHTML;
      essential = essential + " likes"
      finding = null;
    }
    essential = essential + "<br/>"
    finding = current.querySelector(label_text);
    if(finding != null){
      essential = essential + finding.innerHTML;
      finding = null;
    }
    essential = essential + "<br/>"
    finding = current.querySelector(label_link);
    if(finding != null){
        essential = essential + finding.outerHTML;
        finding = null;
    }
    finding = current.querySelector(label_content);
    finding = finding.querySelector('img');
    if(finding != null){
      if(finding.alt != "play"){
        essential = essential + finding.outerHTML;
        finding = null;
      } else {
        finding = current.querySelector('video');
        essential = essential + finding.outerHTML;
        finding = null;
      }
    }
    essential = essential + "<br/>"
    essential = essential + "<br/>"
    essential = essential + "</div>"
    if(!essential_list.includes(essential)){
      essential_list.push(essential)
    }
  }
  console.log(essential_list);
  console.log("content: list length: " + essential_list.length);
  console.log("content has sent: " + send_up_to);
  // sends each ad to the background script
  for(send_up_to; send_up_to < essential_list.length; send_up_to++ ){
    setTimeout(function(ad) {
      chrome.runtime.sendMessage({
        command: "send_ads",
        ad: ad
      });
    }, 1000, essential_list[send_up_to])
  }
}

// this listener awaits a configutation update and starting signal
chrome.runtime.onMessage.addListener((message) => {
  console.log(message);
    if (message.command === "config&grab") {
      console.log("content starts");
      label_sponsor = message.config.label_sponsor;
      label_pagelet = message.config.label_pagelet;
      label_role = message.config.label_role;
      label_name = message.config.label_name;
      label_likes = message.config.label_likes;
      label_content = message.config.label_content;
      label_text = message.config.label_text;
      label_link = message.config.label_link;
      grab_ad()
    }
});
})();
