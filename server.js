const express = require('express');
const cors = require('cors');
const app = express();
const expbs = require('express-handlebars');
let fs = require('fs');
const nodeFetch = require('node-fetch');

let videos = {};
let topVideo;
let channels = {};
let channelList = [];
let links={};
let topChannelFreq;
let topChannel;
// let frequencies = [];
let linkList = [];
let topLink; 
let topFrequency;
app.use(express.json());
// app.engine('handlebars', expbs.engine({
//     defaultLayout: "main"
// }));

app.use(express.static(__dirname + '/public'))
   .use(cors());

app.set('view engine', 'handlebars');

app.engine('handlebars', expbs.engine({
    defaultLayout: "main"
}));


app.get('/',(req,res)=>{
    res.render('index',{
        style: 'index.css'
    });
})
app.get('/instructions',(req,res)=>{
    res.render('instructions',{
        style: 'instructions.css'
    })
})

app.get('/loading',(req,res)=>{
    res.render('loading',{
        style: 'loading.css'
    })
})

app.get('/videos',async(req,res)=>{
    // await feauxDB();
    // videoOrgo();
    let data1 = await nodeFetch('http://localhost:3000/videos.json')
    .then(
        data=> data.json()
    )
    .then(
        j => {
            videos = j
            console.log(j)
        }
    )
    let data2 = await nodeFetch('http://localhost:3000/links.json')
    .then(
        data=> data.json()
    )
    .then(
        j => {
            links = j
            console.log(j)
        }
    )
    videoOrgo();
    console.log("link list")
    console.log(linkList)
    

    // console.log(linkList);
    res.render('videos',{
        style: 'videos.css',
        // firstLink: linkList[0],
        links: linkList
    });
})
app.get('/topVideo',async (req,res)=>{
    let data1 = await nodeFetch('http://localhost:3000/videos.json')
    .then(
        data=> data.json()
    )
    .then(
        j => {
            videos = j
            console.log(j)
        }
    )
    let data2 = await nodeFetch('http://localhost:3000/links.json')
    .then(
        data=> data.json()
    )
    .then(
        j => {
            links = j
            console.log(j)
        }
    )
    videoOrgo();



    res.render('topvideo',{
        style: 'topvideo.css',
        topLink: topLink,
        topFrequency: topFrequency
    });
})
app.get('/channels', async (req, res)=>{
    console.log("channels")
    let data3 = await nodeFetch('http://localhost:3000/channels.json')
    .then(
        data=> data.json()
    )
    .then(
        j => {
            channels = j
            console.log(j)
        }
    )
    channelOrgo();
    console.log(channelList);
    res.render('channels',{
        style: 'channels.css',
        channel1: channelList[0],
        channel2: channelList[1],
        channel3: channelList[2],
        channel4: channelList[3],
        channel5: channelList[4]
    });

})
app.get('/intro-page', (req,res)=>{
    res.render('intro-page',{
        style: 'intro-page.css'
    });
})
app.post('/submit-data', (req,res)=>{
    console.log("_____________")
    let body = req.body.message
    videos = body.videoDict;
    channels = body.channelsDict;
    links = body.linksDict;
    fs.writeFile('./videos.json', JSON.stringify(videos),'utf-8',(err)=>{
        if (err){
            throw(err);
        }
        else{
            console.log("success");
        }
    });
    fs.writeFile('./channels.json', JSON.stringify(channels), 'utf-8',(err)=>{
        if (err){
            throw(err);
        }
        else{
            console.log("success")
        }
    });
    fs.writeFile('./links.json', JSON.stringify(links), 'utf-8',(err)=>{
        if (err){
            throw(err);
        }
        else{
            console.log("success")
        }
    });
    res.json({
        "message":"123"
    })
})

function channelOrgo(){
    let frequencies = Object.values(channels);
    let channelNames = Object.keys(channels)
    frequencies.sort()
    frequencies.reverse()
    // let linkList = []

    for (let i = 0; i < frequencies.length; i++){
        for (let j = 0; j < channelNames.length; j++){
            if (channels[channelNames[j]] == frequencies[i]){
                if (i == 0){
                    topChannel = channelNames[j];
                }
                channelList.push(channelNames[j]);
                channels[channelNames[j]] = '-1';
                if (channelList.length > 5){
                    break;
                }
            }

        }
        if (channelList.length > 5){
            break;
        }  
    }  
    console.log("channelList", channelList)

    topChannelFreq = frequencies[0];
    topChannel = channelList[0];
    
}

function videoOrgo(){
    // console.log("data orgo links object");
    // console.log(links)
    let videoLinkNames = Object.keys(links);
    shorterLink(videoLinkNames);
    console.log("in data orgo function")
    console.log(links)


    let frequencies = Object.values(videos);
    frequencies.sort()
    frequencies.reverse()
    // let linkList = []

    for (let i = 0; i < frequencies.length; i++){
        for (let j = 0; j < videoLinkNames.length; j++){
            if (videos[videoLinkNames[j]] == frequencies[i]){
                if (i == 0){
                    topVideo = videoLinkNames[j];
                }
                linkList.push(links[videoLinkNames[j]]);
                videos[videoLinkNames[j]] = '-1';
                if (linkList.length > 5){
                    break;
                }
            }

        }
        if (linkList.length > 5){
            break;
        }  
    }  
    console.log("LinkList", linkList)

    topFrequency = frequencies[0];
    // topLink = links[topVideo];
    topLink = linkList[0];
    // return linkList

}

function shorterLink(videoLinkNames){
    // console.log("parameter");
    // console.log(videoLinkNames)
    for (let i = 0; i < videoLinkNames.length; i++){ 
        let link = links[videoLinkNames[i]];
        let newLink;
        if (link.includes('=')){
            newLink = link.split('=');
        }
        else{
            newLink = link.split('shorts/');
        }
        links[videoLinkNames[i]] = newLink[1].substring(0, newLink[1].length);
    }

}

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})

module.exports = app