//runs insde web pages that users visit so that they can access web page content
//a content script's activity is limited to the page but can send and recieve data from the background vis messages
// content.js
console.log("💥 Hello from content.js");
var videoDict = {};
var channelsDict = {};
var linkDict ={}

$(document).ready(async()=>{
    console.log(`💥 The page title is ${document.title}`);
    var potential = await document.getElementsByTagName("ytd-text-header-renderer");
    console.log(potential)
    this.setTimeout(async()=>{
        console.log(potential.length)
        let arr = Array.from(potential)
        if (arr[0].innerText == 'Watch history'){
            // let dates = document.querySelectorAll("ytd-video-renderer h3");
            // console.log("these are dates");
            // console.log(dates[0]);
            let videos = document.querySelectorAll("ytd-video-renderer h3 a");
            console.log("these are videos");
            console.log(videos[0].href);
            let newarr = Array.from(videos)
            for (let i = 0; i < newarr.length; i++){
                if (newarr[i].title in videoDict){
                    videoDict[newarr[i].title] = videoDict[newarr[i].title] + 1;
                }
                else{
                    videoDict[newarr[i].title] = 1;
                    linkDict[newarr[i].title] = newarr[i].href
                }
            }
            let numbers = ['0','1','2','3','4','5','6','7','8','9']
            let temp = newarr[1].ariaLabel.split('by');
            let string = null;
            for (let j = 0; j < temp[1].length; j++){
                if (numbers.includes(temp[1][j]) && temp[1][j-1] == " "){
                    string = temp[1].substring(0,j);
                    break;
                }
            }
            console.log("channel frequency");
            console.log(channelsDict);
            for (let i = 0; i < newarr.length; i++){
                let temp = newarr[i].ariaLabel.split('by');
                let channelName;
                for (let j = 0; j < temp[1].length; j++){
                    if (numbers.includes(temp[1][j]) && temp[1][j-1] == " "){
                        channelName = temp[1].substring(0,j);
                        break;
                    }
                }
                
                if (channelsDict.hasOwnProperty(channelName)){
                    channelsDict[channelName] = (channelsDict[channelName]) + 1;
                }
                else{
                    channelsDict[channelName] = 1;
                }
            }
            console.log("channel frequency");
            console.log(channelsDict);
            console.log("video frequency");
            console.log(videoDict);
            chrome.runtime.sendMessage({"channelsDict": channelsDict, "videoDict": videoDict, "linksDict" : linkDict});
        }

    },5000)

})

// export default {videoDict, ChannelsDict};
// make webserver-clean
// DYLD_LIBRARY_PATH=net ./webserver 4000