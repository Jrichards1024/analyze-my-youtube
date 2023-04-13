// background.js
//loaded just once during installation. 
//operate continuously and they can use certain browser APIs like local storage and connect to APIs or databases
console.log("💥 Hello from background.js");

chrome.runtime.onMessage.addListener(notify);

function notify(message) {
    console.log("this is the message");
    console.log(message);
    let options ={
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({"message": message})
    }
    fetch("https://analyze-my-youtube-isrp2g3ka-jrichards1024.vercel.app/submit-data", options)
    .then(response=>response.json())
    .then(data => {
        console.log(data)
    })
    .catch(err =>{
        console.error(err)
    })
    // browser.notifications.create({
    //   "type": "basic",
    //   "iconUrl": browser.extension.getURL("link.png"),
    //   "title": "You clicked a link!",
    //   "message": message.url
    // });
  }

