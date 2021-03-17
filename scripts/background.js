import {getConfig, send_ad} from "./comm_handler.js";

var current_ad_number = 0;
var config_ver = 1; //stores the current config version
var id = -1;
var config = {
  label_sponsor: 'a[aria-label="Gesponsert"], a[aria-label="Sponsored"]',
  label_pagelet: 'div[data-pagelet]',
  label_role: 'div[role="article"]',
  label_name: 'a[class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl oo9gr5id gpro0wi8 lrazzd5p"]',
  label_likes: 'span[class="pcp91wgn"]',
  label_text: 'div[style="text-align: start;"]',
  label_content: 'div[class="l9j0dhe7"]',
  label_link: 'a[class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl oo9gr5id gpro0wi8 lrazzd5p"]'
}



chrome.runtime.onMessage.addListener((message) => {
  if (message.command === "send_ads") {
    console.log("got ads");
    var ad = message.ad;
    //version storage
    if(current_ad_number == 0){
      chrome.storage.local.set({[current_ad_number]:ad});
      current_ad_number++;
      chrome.storage.local.set({number:current_ad_number});
    } else {
      chrome.storage.local.get(null, (res)=>{
        var dupe = false;
        for(var j = 0; j < current_ad_number; j++){
          if(ad.localeCompare(res[""+j])==0){
            dupe = true;
          }
        }
        console.log("new ad is duplicate: " + dupe);
        if(!dupe){
          chrome.storage.local.set({[current_ad_number]:ad});
          current_ad_number++;
          chrome.storage.local.set({number:current_ad_number});
        }
      });
      //version immediate sending
      /*
      send_ads(ad)
      */
  };}

  else if(message.command === "send_checked") {
    send_sublist_storage(message.list)
  }


  else if (message.command === "popup_ready") {
    console.log("popup ready")
    for(var i = 0; i<current_ad_number; i++){
      chrome.storage.local.get(""+i, (res) => {
        chrome.runtime.sendMessage({
          command: "show_ads",
          id: i,
          ad: Object.entries(res)[0][1]
        })
      });
    };
  }


  else if (message.command === "alarm") {
    chrome.alarms.getAll(function(alarms){
      if(alarms.length === 0){
        chrome.alarms.create("grabbing_time", {
          delayInMinutes: 0.1,
          periodInMinutes: 1
        });
      } else {
        chrome.alarms.clearAll();
      }
    })
  }

  else if(message.command === "alarm_active"){
    chrome.alarms.getAll(function(alarms){
      var active = true;
      if(alarms.length === 0){
        active = false;
      }
      chrome.runtime.sendMessage({
        command: "answer_alarm_active",
        alarm_active: active
      })
    });
  }

  else if(message.command === "ID"){
    id = message.id;
    chrome.storage.local.set({id:id});
  }

  else if(message.command == "request_grab"){
    chrome.tabs.query({}, function(tabs){
      tabs.forEach(tb => {
        if(tb.url.includes("facebook")){
          chrome.tabs.sendMessage(tb.id, {
            command:"config&grab",
            config:config
          })
        }
      });
    })
  }
});
// gets the data from the storage and updates it
chrome.storage.local.get("number", (res)=>{
  if(!(Object.keys(res).length === 0 && res.constructor === Object)){
    current_ad_number = res.number;
  }
})

chrome.storage.local.get("id", (res)=>{
  if(!(Object.keys(res).length === 0 && res.constructor === Object)){
    id = res.id;
  }
})

chrome.storage.local.get("config", (res)=>{
  if(!(Object.keys(res).length === 0 && res.constructor === Object)){
    config = res.config;
  }
})
chrome.storage.local.get("config_ver", (res)=>{
  if(!(Object.keys(res).length === 0 && res.constructor === Object)){
    config_ver = res.config_ver;
  }
  //getConfig(); //requests config AFTER getting the last local version, to avoid overhead
})



chrome.alarms.create("grabbing_time", {
  delayInMinutes: 0.1,
  periodInMinutes: 1
});
chrome.alarms.onAlarm.addListener(function(alarm){
  if(alarm.name == "grabbing_time"){
    chrome.tabs.query({}, function(tabs){
      tabs.forEach(tb => {
        if(tb.url.includes("facebook")){
          chrome.tabs.sendMessage(tb.id, {
            command:"config&grab",
            config:config
          })
        }
      });
    })
  }
})
//this function will send all ads in storage and clear them
function send_all_storage(){
  console.log("starting");
  chrome.storage.local.get(null, (res)=>{
    console.log(res);
    for(var run_var = 0; run_var < current_ad_number; run_var++){
      console.log(res[run_var])
      send_ad(res[run_var], id)
      chrome.storage.local.remove(""+run_var)
    }
    current_ad_number = 0;
    chrome.storage.local.set({number:0});
  });
}

//sends the sublist selected and clears complete storage
function send_sublist_storage(list){
  chrome.storage.local.get(null, (res)=>{
    for(var run_var in list){
      send_ad(res[run_var], id)
      chrome.storage.local.remove(""+run_var)
    }
    current_ad_number = 0;
    chrome.storage.local.set({number:0});
  });
}
console.log("bg runs");
// send_all_storage();
//chrome.storage.local.clear();
