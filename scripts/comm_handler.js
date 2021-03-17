//import * as axios from "./node_modules/axios/dist/axios.js";
//import axios from '/axios';

const path = {
  protokoll : "https://", //or http://
  baseURL : "your.server.url",
  //port : ":8080", if neccessary
  parent : "/exact/sub/path",
};

const local_path = {
  protokoll : "http://",
  baseURL : "localhost",
  port : ":1234",
  parent : "/sub/path/",
};

const url = path.protokoll + path.baseURL + path.parent;
// const url = local_path.protokoll + local_path.baseURL + local_path.port + local_path.parent;

function geturl(){
  return url;
}

// Requests the current config from server
export function getConfig(){
  axios.get(url + "getConfigUrl").then(function(response) {
    // Verarbeitet die Antwort des Servers zu einer normalen Studienliste und weist popup.js an sie zu aktualisieren
    if(response.data.convig_ver > config_ver){
      config_ver = response.data.config_ver;
      config = response.data.config;
      chrome.storage.local.set({convig_ver:convig_ver});
      chrome.storage.local.set({config:config});
    }
  })
  .catch(function(error){
    alert("the following error occured during the config request: ", error);
  });
};

//sends an ad to the server together with the id, expects no answer
export function send_ad(ad, id){
  axios.post(url + "send_ad", {
    ad: ad,
    id: id
  },{timeout: 10000}).then(function(response){
    console.log(response)
  })
  .catch(function(error){
    alert("the following error occured during sending of an ad: ", error);
  });
};


// expects some data for the server, and expects an ID with the name "id" in return
export function get_ID(data){
  axios.post(url + "get_id", data,{timeout: 10000}).then(function(response){
    chrome.runtime.sendMessage({
      command: "ID",
      id: response.data.id;
    })
  })
  .catch(function(error){
    alert("the following error occured during the request of an id: ", error);
  });
};
