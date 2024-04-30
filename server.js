
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { exec } = require('child_process');
const { config } = require('process');
const NodeGeocoder = require('node-geocoder');
//const imageThumbnail = require('image-thumbnail');
const multer  = require('multer');
const sharp = require('sharp');
var qr = require('qr-image');
const { Server } = require('http')
const { networkInterfaces } = require('os');
global.IP = ""; //IP object for QR code
const { isInternetAvailable, InternetAvailabilityService } = require('is-internet-available');
const {envVars}  = require('./env/config.js')

console.log(envVars.age);

setIPAddr();

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(express.static(__dirname + '/express'));
app.use('/static',express.static(envVars.local_image_path));

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors());

/*------------------------- Launchers ----------------------------*/
app.get('/openmm', function(req,res){
  execSync('pm2 start mm');
});
app.get('/openwizard', function(req,res){
  execSync('pm2 start wizard-client -- calendar');
});
app.get('/refreshwizard', function(req,res){
  res.sendFile(path.join(__dirname+'/express/start.html'));
});

/*------------------------- Welcome ----------------------------*/
app.get('/start', function(req,res){
  res.sendFile(path.join(__dirname+'/express/start.html'));
});
app.get('/step1', function(req,res){
  res.sendFile(path.join(__dirname+'/express/step1.html'));
});
app.get('/step2', function(req,res){
  res.sendFile(path.join(__dirname+'/express/step2.html'));
});
app.get('/step3', function(req,res){
  res.sendFile(path.join(__dirname+'/express/step3.html'));
});
app.get('/lookingfornetworks', function(req,res){
  res.sendFile(path.join(__dirname+'/express/lookingfornetworks.html'));
});
/*app.get('/keyboard-show', function(req,res){
  exec('./scripts/show-keyboard.sh', console.log);
  res.send('done'); 
});
app.get('/keyboard-hide', function(req,res){
  exec('./scripts/hide-keyboard.sh', console.log);
  res.send('done');
});*/
app.get('/apcheck', function(req,res){
  let connection = new Object();
  let isConnected = false;
  checkConnection("localhost", 80).then(function() {
    console.log("AP IS RUNNING");
    isConnected = true;
    connection.isConnected = isConnected?"1":"0";
    res.send(connection);
}, function(err) {
  console.log("AP IS NOT RUNNING");
  isConnected = false;
  connection.isConnected = isConnected?"1":"0";
    res.send(connection);
}
)
  
});
app.get('/wificheck', function(req,res){
  let connection = new Object();
  let isConnected = false;
  isInternetAvailable().then((resp)=>{
    if (!resp) {
      console.log("No connection");
     // isConnected = false;
   } else {
     isConnected = true;
     if(getIPAddr().length==0)
       setIPAddr();
     //console.log(getIPAddr());
     // console.log("Connected");
   }
    console.log(resp);
    connection.isConnected = isConnected?"1":"0";
  res.send(connection);
  });
});

app.post('/step2', (req, res) =>{
  
  let response = writeWakeCronJob(req);

  for(var key in req.body) {
    if(key.toLowerCase().startsWith('timezone')){
      let timezone = req.body[key];
     //*****FOR LOCAL MACHINE TESTING, COOMMENT OUT THIS LINE */
     if(!envVars.isdev) 
      execSync('sudo timedatectl set-timezone '+timezone);
      //console.log(result);
      response = "success";
    }
    if(key.toLowerCase().startsWith('timeformat')){//time_12or24_start
      let timeformat = req.body[key];
      console.log("timeformat: "+ timeformat);
      time_format_snippet = "\ttimeFormat:"+timeformat+",\n"; //timeFormat:12,
    }
  }
  console.log('writing time to config')
  writeToTemplate('time_12or24.txt','time_12or24',time_format_snippet); //writes to template file 
 
  res.sendFile(path.join(__dirname+'/express/step3.html'));
  res.redirect('/step3?result='+response);

});

function checkConnection(host, port, timeout) {
  return new Promise(function(resolve, reject) {
      timeout = timeout || 5000;     // default of 10 seconds
      let socket, timer;
      timer = setTimeout(function() {
          reject(new Error(`timeout trying to connect to host ${host}, port ${port}`));
          //socket.end();
      }, timeout);
      socket = net.createConnection(port, host, function() {
          clearTimeout(timer);
          resolve();
          //socket.end();
      });
      socket.on('error', function(err) {
          clearTimeout(timer);
          reject(err);
      });
  });
}
/*------------------------- Message ----------------------------*/

app.get('/message', function(req,res){
  res.sendFile(path.join(__dirname+'/express/message.html'));
});

app.post('/message', (req, res) =>{
  let response = "";
  let showmsg = false;
  let show_msg_snippet = "";
  let messageText = "";
  let messagePlacement = "";
  let css_string = "";
  try{
    for(var key in req.body) {
  
      if(key.toLowerCase().startsWith('showmsg')){
        showmsg = true
      }
      if(key.toLowerCase()=='msgtxt'){
        messageText = req.body[key];
        messageText = messageText.replace(/"/g, "");
      }
      if(key.toLowerCase()=='msgplace'){
        messagePlacement = req.body[key];
        if(messagePlacement=="center")
          css_string = `div.module.helloworld {color:#444;background-color:white; position: fixed;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);width: 40vw;height: auto;padding: 50px;margin: 10px;line-height: 1.8;border-radius: 10px;font-family: sans-serif;font-weight: 400;z-index:10000;}`;
        else
          css_string = `div.module.helloworld{color:#FFF;background: rgba(0, 0, 0,.1);width:500px;border-radius:10px;padding:20px;}`;
      }
    }
    show_msg_snippet = 	`{module: "helloworld",position: "bottom_left", config:{text:"${messageText}",placement:"${messagePlacement}"}},\n`;

    if(!showmsg){
      show_msg_snippet = `//`+show_msg_snippet
    }
    
    writeToTemplate('msg.txt','msg',show_msg_snippet);
    writeToCSS(css_string,envVars.message_css); //write css to either show center or left
    response = "success";
  }
  catch(err){
    response="error";
    console.log(err);
  }
  finally{
    res.sendFile(path.join(__dirname+'/express/message.html'));
    if(req.headers.referer.indexOf('iframed')>-1)
      response += "&iframed=1";
    res.redirect('/message?result='+response);
  }
});
app.get('/fetchmsg', (req, res) =>{

  try{
    readMsgConfig().then((response)=>{
      res.send(response);
    })
  }
  catch(err){
    console.log("readMsgConfig error: "+err)
  }
  finally{
  }
});
async function readMsgConfig(){
  let msgData = new Object();
  try{
    const configData = fs.readFileSync(envVars.configPath,'utf8');
   
    let msgPrefix = "//msg_start";
    let msgSuffix = "//msg_end";
    let msg = configData.substring(configData.indexOf(msgPrefix)+msgPrefix.length,configData.indexOf(msgSuffix));
    msgData.showmsg = !msg.trim().startsWith(`//`);

    let msgTextPrefix = 'config:{text:"';
    let msgTextSuffix = '",placement:';
    let msgText = msg.substring(msg.indexOf(msgTextPrefix)+msgTextPrefix.length,msg.indexOf(msgTextSuffix));

    let placementPrefix = ',placement:"';
    let placementSuffix = '"}';
    let placement = msg.substring(msg.indexOf(placementPrefix)+placementPrefix.length,msg.indexOf(placementSuffix));

    msgData.placement = placement;
    msgData.msgText = msgText;
    
  }
  catch(err){
    console.log("Error reading message config: "+err);
  }
  return msgData;
}
/*------------------------- Advanced ----------------------------*/

app.get('/advanced', function(req,res){
  res.sendFile(path.join(__dirname+'/express/advanced.html'));
});

app.get('/fetchadvanced', (req, res) =>{

  try{
    readAdvancedConfig().then((response)=>{
      res.send(response);
    })
  }
  catch(err){
    console.log("readAdvancedConfig error: "+err)
  }
  finally{
  }
});

async function readAdvancedConfig(){
  let advancedData = new Object();
  try{


  
      // Exec output contains both stderr and stdout outputs
      const stdOut = execSync('crontab -l -u pi');
  console.log('stdout: ' + stdOut);
    

   console.log("running crontab")

    let cronData = stdOut+'';
    //const cronData = fs.readFileSync(envVars.cronPath,'utf8');
    let onTimePrefix = "#power_on";
    let onTimeSuffix = "#power_off";
    let onTimeString = cronData.substring(cronData.indexOf(onTimePrefix)+onTimePrefix.length,cronData.indexOf(onTimeSuffix)).trim();
    let onHour = onTimeString.substring(onTimeString.indexOf(" ")+1, onTimeString.indexOf("*")).trim();
    let onMinute = onTimeString.substring(0, onTimeString.indexOf(" ")).trim();
    //console.log(onTimeString); //00 07 * * * pi vcgencmd display_power 1
    advancedData.onTime = onHour +":"+onMinute;

    let offTimePrefix = "#power_off";
    let offTimeSuffix = "#power_end";
    let offTimeString = cronData.substring(cronData.indexOf(offTimePrefix)+offTimePrefix.length,cronData.indexOf(offTimeSuffix)).trim();
    let offHour = offTimeString.substring(offTimeString.indexOf(" ")+1, offTimeString.indexOf("*")).trim();
    let offMinute = offTimeString.substring(0, offTimeString.indexOf(" ")).trim();
    //console.log(offTimeString); //00 22 * * * pi vcgencmd display_power 0
    advancedData.offTime = offHour +":"+offMinute;
  }
  catch(err){
    console.log("Error reading crontab: "+err);
  }
  return advancedData;
}
function writeWakeCronJob(req){
  let response = "";
  let start_hour = "";
  let start_minute = "";
  let end_hour = "";
  let end_minute = "";
  //console.log(req.body);
  try{
    for(var key in req.body) {
      if(key.toLowerCase().startsWith('starttime')){
        let start = req.body[key];
       // console.log(start);
        start_hour = start.substring(0,start.indexOf(":"));
        start_minute = start.substring(start.indexOf(":")+1);
      }
      if(key.toLowerCase()=='endtime'){
        let end = req.body[key];
        //console.log(end);
        end_hour = end.substring(0,end.indexOf(":"));
        end_minute = end.substring(end.indexOf(":")+1);
      }
    }
    let full_snippet = `#!/bin/bash 

    crontab -r 
    
    line="#power_start
    #power_on
    ${start_minute} ${start_hour} * * * vcgencmd display_power 1
    #power_off
    ${end_minute} ${end_hour} * * *  vcgencmd display_power 0
    #power_end" 
     
    echo "$line" | crontab -u pi -
    `;

    writeToCron(envVars.cronPath,full_snippet); //writes to template file  //setTimeout(function(){

    response = "success";
  }
  catch(err){
    response="error";
    console.log(err);
  }
  return response;
}
app.post('/advanced', (req, res) =>{
  
    let response = writeWakeCronJob(req);
    res.sendFile(path.join(__dirname+'/express/advanced.html'));
    if(req.headers.referer.indexOf('iframed')>-1)
      response += "&iframed=1";
    res.redirect('/advanced?result='+response);
  
});
async function writeToCron(filename, content){
  let fileContent = content;
 // console.log("----------------------------/n"+fileContent);
  let retVal = "error"

  fs.writeFile(filename, fileContent, err => { /* write to script, then run script */
    if (err) {
      console.error(err);
    } else {
     execSync('./'+filename, console.log)
      console.error("success");    
      retVal = "success";
   }
  });
  return retVal;
}

app.post('/screen-reboot', (req, res) =>{
  try{
    execSync('sudo reboot');
    response = "success";
  }
  catch(err){
    response="error";
    console.log(err);
  }
  finally{
    res.sendFile(path.join(__dirname+'/express/rebooting.html'));
  }
});

app.post('/screen-shutdown', (req, res) =>{
  try{
    execSync('sudo shutdown -h now');
    response = "success";
  }
  catch(err){
    response="error";
    console.log(err);
  }
  finally{
    res.sendFile(path.join(__dirname+'/express/rebooting.html'));
  }
});




/*------------------------- QR Code ----------------------------*/
app.get('/qrcode', (req, res) =>{
let params = req.query;

  try{
    let page = "";
    for(var key in params) {
      if(key.toLowerCase().startsWith('path')){
        page = params[key];
      }
    }
    var qr_svg = qr.imageSync(`http://${IP}:3000${page}`, { type: 'png' });
    res.send(qr_svg);
  }
  catch(err){
    console.log("readExtrasConfig error: "+err)
  }
  finally{
  }
});
app.get('/ip', (req, res) =>{
  let response = new Object();
  //console.log(IP);
  response.ip = IP;
  response.port = port;
    res.send(response);
});
/*------------------------- background ----------------------------*/

app.post('/background', (req, res) =>{
  let source = "stock";
  let icloudURL = "";
  let color = "";
  let interval = 1800000;
  let brightness = 50

  let source_snippet = "";
  let color_CSS_snippet = "";
  let interval_snippet = "";
  let background_snippet = "";

  try{
    for(var key in req.body) {
      if(key.toLowerCase()=='source'){
        let tmpSrc = req.body[key];
        switch(tmpSrc){
          case("icloud")://icloud:<album id>
            source = 'icloud';
          break;
          case("local")://local:local_image_path
            source = `local:/home/pi/MagicMirror/modules/media/uploaded`
          break;   
          case("color")://local:local_image_path
            source = `local:/home/pi/MagicMirror/modules/media/blank`
          break;  
          case("none"):
            source = `none`
          break;  
          case("bing")://bing
            source = 'bing';
          break;
          case("stock"): //stock
            source = 'chromecast';
          break;  
        }
      }
      if(key.toLowerCase()=='icloudurl'){
        icloudURL = req.body[key];
      }
      if(key.toLowerCase()=='color'){
        color = req.body[key];
      }
      if(key.toLowerCase()=='interval'){
        interval = req.body[key];
      }
      if(key.toLowerCase()=='brightness'){

        brightness = req.body[key]/100;
      }
    }
   if(source=="icloud")
      source += ":"+icloudURL.substring(icloudURL.indexOf('#')+1);

    if(source.indexOf("/modules/media/blank")){ //transparent gif so we can show color
      //color_CSS_snippet = `.MMM-Wallpaper img {background:${color} !important;filter: none !important;}`;
      color_CSS_snippet = `.MMM-Wallpaper img {background:${color} !important;}`;
      writeToCSS(color_CSS_snippet,envVars.wallpaper_css);
    }
    //{module: "MMM-Wallpaper",position: "fullscreen_below",config:{source:"icloud:https://www.icloud.com/sharedalbum/#B0c5qXGF1DfeOm",color:"#123456",crossfade:false,icloudURL:"https://www.icloud.com/sharedalbum/#B0c5qXGF1DfeOm",shuffle:true,slideInterval:3600000}},
    background_snippet = `{module: "MMM-Wallpaper",position: "fullscreen_below",config:{source:"${source}",color:"${color}",crossfade:false,icloudURL:"${icloudURL}",shuffle:true,filter:"brightness(${brightness})",caption:false,slideInterval:${interval}}},\n`
    
    writeToTemplate('background.txt','background',background_snippet);
    
    response = "success";
  }
  catch(err){
    response="error";
    console.log(err);
  }
  finally{
    res.sendFile(path.join(__dirname+'/express/background.html'));
    if(req.headers.referer.indexOf('iframed')>-1)
      response += "&iframed=1";
    res.redirect('/background?result='+response);
  }
});

app.get('/fetchwallpaper', (req, res) =>{

  try{
    readWallpaperConfig().then((response)=>{
      console.log(response)
      res.send(response);
    })
  }
  catch(err){
    console.log("readExtrasConfig error: "+err)
  }
  finally{
  }
});

async function readWallpaperConfig(){
  let wallPaperData = new Object();
  let hasFeeds = false;
  try{
    const configData = fs.readFileSync(envVars.configPath,'utf8');
   
    let wallPaperPrefix = "//background_start";
    let wallPaperSuffix = "//background_end";
    let wallPaper = configData.substring(configData.indexOf(wallPaperPrefix)+wallPaperPrefix.length,configData.indexOf(wallPaperSuffix));

    if(wallPaper.length>0){
      //{module: "MMM-Wallpaper",position: "fullscreen_below",config:{source:"icloud:https://www.icloud.com/sharedalbum/#B0c5qXGF1DfeOm",color:"#123456",crossfade:false,icloudURL:"https://www.icloud.com/sharedalbum/#B0c5qXGF1DfeOm",shuffle:true,slideInterval:3600000}},
    
      let interval = 60*1000;
      let sourcePrefix = `config:{source:"`;
      let sourceSuffix = `",crossfade:`;
      
      let source = wallPaper.substring(wallPaper.indexOf(sourcePrefix)+sourcePrefix.length,wallPaper.indexOf(sourceSuffix));
      let intervalPrefix = `,slideInterval:`;
      let intervalSuffix = `}},`;
      interval = wallPaper.substring(wallPaper.indexOf(intervalPrefix)+intervalPrefix.length,wallPaper.indexOf(intervalSuffix));
      
      let colorPrefix = `",color:"`;
      let colorSuffix = `",crossfade:`;
      let color = wallPaper.substring(wallPaper.indexOf(colorPrefix)+colorPrefix.length,wallPaper.indexOf(colorSuffix));
    
      let icloudURLPrefix = `,icloudURL:"`;
      let icloudURLSuffix = `",shuffle:`;
      let icloudURL = wallPaper.substring(wallPaper.indexOf(icloudURLPrefix)+icloudURLPrefix.length,wallPaper.indexOf(icloudURLSuffix));
      
      //shuffle:true,filter:"brightness(0.5)",caption:false
      let brightnessPrefix = `:"brightness(`;
      let brightnessSrefix = `)",caption:`;
      let brightness = wallPaper.substring(wallPaper.indexOf(brightnessPrefix)+brightnessPrefix.length,wallPaper.indexOf(brightnessSrefix));

      console.log(source);
      console.log(interval);
    
      switch(true){
        case(source.indexOf('icloud')>-1)://icloud:<album id>
          wallPaperData.source = 'icloud';
        break;
        case(source.indexOf('/modules/media/uploaded')>-1)://local:local_image_path
          wallPaperData.source = 'local';
        break;     
        case(source.indexOf('bing')>-1)://bing
          wallPaperData.source = 'bing';
        break;
        case(source.indexOf('chromecast')>-1): //stock
          wallPaperData.source = 'stock';
        break;
        case(source.indexOf('none')>-1)://won't write to my guy
          wallPaperData.source = 'none';
        break;
        case(source.indexOf('/modules/media/blank')>-1)://local:/home/pi/MagicMirror/modules/media/blank
          wallPaperData.source = 'color'; 
        break;
      }
      
      wallPaperData.icloudURL = icloudURL;
      wallPaperData.color = color;
      wallPaperData.interval = parseInt(interval);
      wallPaperData.brightness = parseFloat(brightness)*100;
      
    
  }
    /*
    ////run my backup script to see if everything is saved...it didn't look like it saved all my module changes, just media
    */
    
  }
  catch(err){
    console.log("Error reading extras config: "+err);
  }
  return wallPaperData;
}


//prep acceptance of image files & thumbnail generation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, envVars.local_image_path);
  },
  filename: (req, file, cb) => {
      let r = generateString(5);

      cb(null, r + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  //might need tiff, heif, bmp?
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
    //cb(new Error('I don\'t have a clue!'))
      cb(null, false);
  }
}
//const upload = multer({ storage: storage, fileFilter: fileFilter });
const upload = multer({ storage: storage, fileFilter: fileFilter}).array('my-files');

app.get('/background', function(req,res){
  res.sendFile(path.join(__dirname+'/express/background.html'));
});
/*app.post('/image-upload', upload.array('my-files'), function (req, res, next) {
  // req.files is array of `profile-files` files
  // req.body will contain the text fields, if there were any
  console.log(res);
  for(var i=0;i<req.files.length;i++){
    createThumbnail(req.files[i])
  }
  return res.send("OK!")
})*/

app.post('/image-upload', function (req, res) {
  let goodFiles = "";
  let badFiles = "";
  upload(req, res, function (err){
    console.log("You tried to upload this many files: "+req.files.length);
    //console.log(res);
    if (err instanceof multer.MulterError) {
      console.log("ERRORS!");
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log("MORE ERRORS!!"+ err);

    }
    let numComplete = 0;
    for(var i=0;i<req.files.length;i++){
      //console.log('trying to resize...'+req.files[i].originalname);
      createThumbnail(req.files[i]);
    }
    return res.send("OK!")
    // Everything went fine.

  });
})



async function createThumbnail(file){
  let path = file.path;
  let fileName = file.filename;
  let returnValue = false;
  //console.log('resizing...');
  try{
  sharp(path).resize(200, 200).toFile(envVars.local_image_path+'/thumbnails/' + 't-' + fileName, (err, resizeImage) => {
    if (err) {
      console.log("there was an error");
         console.log(err);
    } else {
         returnValue = true;
    }
});
  }
  catch(err){
    console.log(err)
  }
}

app.post('/remove-images', function(req,res){ 
  let removed = 0;
  let obj = new Object();
  for(var i=0; i<req.body.names.length; i++) {
    let thumbnailName = req.body.names[i];
    let parentFileName = thumbnailName.substring(thumbnailName.indexOf("t-")+2);
    try{
      fs.unlinkSync(envVars.thumbnail_path+"/"+thumbnailName);
      fs.unlinkSync(envVars.local_image_path+"/"+parentFileName);
      removed++;
    }
    catch(err){
      console.log(err);
    }
  }
  obj.removed = "Removed "+ removed;
  res.send(obj);
});
app.get('/image-count', function(req,res){
  let imageCount = new Object()
  imageCount.count =  fs.readdirSync(envVars.thumbnail_path).length;
  res.send(imageCount);
});
app.get('/images', function(req,res){
  //let images = new Object();
  console.log("I'm HERE");
  let files = [];
  /*fs.readdir(envVars.thumbnail_path, function (err, files) {
    if (err) {return console.log('Unable to scan directory: ' + err);} 
    res.send(files);
  });*/

  fs.readdir(envVars.thumbnail_path, function(err, files){
    files = files.map(function (fileName) {
      return {
        name: fileName,
        time: fs.statSync(envVars.thumbnail_path+"/"+fileName).mtime.getTime()
      };
    })
    .sort(function (a, b) {
      return a.time - b.time; })
    .map(function (v) {
      return v.name; });
      res.send(files);
  }); 
});
/*------------------------- news ----------------------------*/

app.get('/news', function(req,res){
  res.sendFile(path.join(__dirname+'/express/news.html'));
});
app.post('/news', (req, res) =>{
  let response = "";
  let shownews = false;
  let show_news_snippet = "";
  let news_feeds = [];
  let news_snippet = "";
 console.log(req.body);
  try{
    for(var key in req.body) {
  
      if(key.toLowerCase()=='newsfeed'){
        shownews = true
      }
      if(key.toLowerCase().startsWith('name-')){
          //if a news item has a URL but no name, add in "Custom Feed"
        //get name-1 and url-1 (through 3)
     
        news_snippet = "{title:\""+req.body[key]+"\"";
      }
      if(key.toLowerCase().startsWith('url-')){
        news_snippet += ",url:\""+req.body[key]+"\"}";
        news_feeds.push(news_snippet);
    }
      if(key.toLowerCase().indexOf('-hardcode')>-1){
        switch(key){
          case "NYT-HARDCODE":
            news_feeds.push(`{title:"New York Times",url:"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",internalName:"NYT-HARDCODE"}`);
            break;
          case "WSJ-HARDCODE":
            news_feeds.push(`{title:"Wall Street Journal",url:"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",internalName:"WSJ-HARDCODE"}`);
              break;
          case "AP-HARDCODE":
            news_feeds.push(`{title:"Associated Press",url:"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",internalName:"AP-HARDCODE"}`);
              break;
          case "CNN-HARDCODE":
            news_feeds.push(`{title:"CNN",url:"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",internalName:"CNN-HARDCODE"}`);
            break;
        }
      }      
      //{module:"newsfeed",position: "bottom_bar",config:{feeds:[{title:"New York Times",url:"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"}],showSourceTitle:true,showPublishDate:true,broadcastNewsFeeds:true,broadcastNewsUpdates:true}},
     

    
    }
    let parsed_feeds = [];

    news_feeds.forEach((element) => {
      if(element.indexOf(`,url:""}`)==-1){ //has a URL
        if(element.indexOf(`{title:"",`)>-1){ //doesn't have a title
          let newItem = element.replace(`:""`,`:"Custom Source"`);
          parsed_feeds.push(newItem);
        }
        else{ //has URL and title
          parsed_feeds.push(element);
        }
      }
    });
    console.log(parsed_feeds);
    let news_feeds_string = parsed_feeds.join(',');
    
    if (news_feeds_string.charAt(news_feeds_string.length - 1) === ',') {
      news_feeds_string = news_feeds_string.slice(0, -1);
    }

    if(shownews){
      show_news_snippet = `{module:"newsfeed",position: "bottom_bar",config:{feeds:[${news_feeds_string}],showSourceTitle:true,showPublishDate:true,broadcastNewsFeeds:true,broadcastNewsUpdates:true}},\n`
    }
    else{
      show_news_snippet = `//{module:"newsfeed",position: "bottom_bar",config:{feeds:[${news_feeds_string}],showSourceTitle:true,showPublishDate:true,broadcastNewsFeeds:true,broadcastNewsUpdates:true}},\n`
    }
    writeToTemplate('news.txt','news',show_news_snippet);
    //write news
    console.log(show_news_snippet);
    response = "success";
  }
  catch(err){
    response="error";
    console.log(err);
  }
  finally{
    res.sendFile(path.join(__dirname+'/express/news.html'));
    console.log("NEWS:  "+req.headers.referer)
    if(req.headers.referer.indexOf('iframed')>-1)
      response += "&iframed=1";
    res.redirect('/news?result='+response);
  }
});
app.get('/fetchnews', (req, res) =>{
  let params = req.query;
  try{
    readNewsConfig().then((response)=>{
      console.log(response)
      res.send(response);
    })
    //data.timezone =tmpTimeZone;
  }
  catch(err){
    console.log("readExtrasConfig error: "+err)
  }
  finally{
  }
});

async function readNewsConfig(){
  let newsData = new Object();
  let hasFeeds = false;
  try{
    const configData = fs.readFileSync(envVars.configPath,'utf8');
   
    let newsPrefix = "//news_start";
    let newsSuffix = "//news_end";
    let news = configData.substring(configData.indexOf(newsPrefix)+newsPrefix.length,configData.indexOf(newsSuffix));
    newsData.showNewsfeed = !news.trim().startsWith(`//`);

    let feedsPrefix = '{feeds:[';
    let feedsSuffix = '],showSourceTitle:true';
    let feedsString = news.substring(news.indexOf(feedsPrefix)+feedsPrefix.length,news.indexOf(feedsSuffix));

   console.log(feedsString.length);
   if(feedsString.length>0){
    // `{title:"CNN",url:"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",internalName:"CNN-HARDCODE"}`);
    let feedArray = [];
    let feeds = feedsString.split('},{');//split up the feeds by },{
    Array.prototype.forEach.call(feeds, function(el) {
      let feedString = el;
      feedString = feedString.replace(/{/g, "");
      feedString = feedString.replace(/}/g, "");
      let feedFields = feedString.split(',');
      let feedObj = new Object();
      Array.prototype.forEach.call(feedFields, function(field) {
        let keyName = field.substring(0,field.indexOf(':'));
        let value = field.substring(field.indexOf(':')+1);
        feedObj[keyName] = value.replace(/"/g, "");
      });
      feedArray.push(feedObj);
    });

      newsData.feeds = feedArray;
  }
    /*
    ////run my backup script to see if everything is saved...it didn't look like it saved all my module changes, just media
    */
    
  }
  catch(err){
    console.log("Error reading extras config: "+err);
  }
  return newsData;
}

/*------------------------- extras ----------------------------*/

app.get('/extras', function(req,res){
  res.sendFile(path.join(__dirname+'/express/extras.html'));
});

app.post('/extras', (req, res) =>{
  let response = "";
  let showwotd = false;
  let showcountdown = false;
  let show_wotd_snippet = "";
  let wotd_date = "";
  let wotd_event = "";
  let wotd_completeText = "";
  let show_countdown_snippet = "";
   
  try{
    for(var key in req.body) {
  
      if(key.toLowerCase().startsWith('wotd')){
        showwotd = true
        show_wotd_snippet = "{module: 'MMM-MWWordOfTheDay',position: 'bottom_left',config: {updateInterval: 4320,headerText: \"Today's word is...\"}},\n";
      }
      if(key.toLowerCase()=='countdown'){
        showcountdown = true
      }
      if(key.toLowerCase()=='countdowndate'){
        wotd_date = req.body[key];
        //2024-04-27T09:14
        wotd_date = wotd_date.replace("T"," ")+":00";
      }
      if(key.toLowerCase()=='countdownmsg'){
        wotd_event = req.body[key];
        wotd_event = wotd_event.replace(/"/g, "");
      }
      if(key.toLowerCase()=='completemsg'){
        wotd_completeText = req.body[key];
        wotd_completeText = wotd_completeText.replace(/"/g, "");
      }
      //news
      //{module:"newsfeed",position: "bottom_bar",config:{feeds:[{title:"New York Times",url:"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"}],showSourceTitle:true,showPublishDate:true,broadcastNewsFeeds:true,broadcastNewsUpdates:true}},
     

    
    }
    if(showcountdown){
      show_countdown_snippet = `{module: "MMM-CountDown",position:"top_left",config:{event:"${wotd_event}",date:"${wotd_date}",daysLabel:"&nbsp; days &nbsp;&nbsp; ",hoursLabel: "&nbsp;hours &nbsp;&nbsp; ",minutesLabel:"&nbsp;min &nbsp;&nbsp; ",secondsLabel:"&nbsp;sec",completeText:"${wotd_completeText}"}},\n`
    }
    else{
      show_countdown_snippet = `//{module: "MMM-CountDown",position:"top_left",config:{event:"${wotd_event}",date:"${wotd_date}",daysLabel:"&nbsp; days &nbsp;&nbsp; ",hoursLabel: "&nbsp;hours &nbsp;&nbsp; ",minutesLabel:"&nbsp;min &nbsp;&nbsp; ",secondsLabel:"&nbsp;sec",completeText:"${wotd_completeText}"}},\n`
    }
    
    writeToTemplate('wotd.txt','wotd',show_wotd_snippet);
    writeToTemplate('countdown.txt','countdown',show_countdown_snippet);
    //write news

    response = "success";
  }
  catch(err){
    response="error";
    console.log(err);
  }
  finally{
    res.sendFile(path.join(__dirname+'/express/extras.html'));
    if(req.headers.referer.indexOf('iframed')>-1)
      response += "&iframed=1";
    res.redirect('/extras?result='+response);
  }
});

app.get('/fetchextras', (req, res) =>{
  let params = req.query;
  try{
    readExtrasConfig().then((response)=>{
      console.log(response)
      res.send(response);
    })
    //data.timezone =tmpTimeZone;
  }
  catch(err){
    console.log("readExtrasConfig error: "+err)
  }
  finally{
  }
});

async function readExtrasConfig(){
  let extrasData = new Object();
  try{
    const configData = fs.readFileSync(envVars.configPath,'utf8');
   
    let wotdPrefix = "//wotd_start";
    let wotdSuffix = "//wotd_end";
    let wotd = configData.substring(configData.indexOf(wotdPrefix)+wotdPrefix.length,configData.indexOf(wotdSuffix));
    console.log("length of WOTD: "+wotd.length);
    extrasData.showWOTD = wotd.length>1;

    let countdownPrefix = "//countdown_start";
    let countdownSuffix = "//countdown_end";
    let showCountdown = configData.substring(configData.indexOf(countdownPrefix)+countdownPrefix.length,configData.indexOf(countdownSuffix));
    console.log("length of countdown: "+showCountdown.length);
    console.log(showCountdown.trim().startsWith(`//`));
    extrasData.showCountdown = !showCountdown.trim().startsWith(`//`);//if it starts with a comment, it's hidden.  Else, show it.

    let eventPrefix = `event:"`;
    let eventSuffix = `",date:"`;
    let datePrefix = `",date:"`;
    let dateSuffix = `",daysLabel:"`;
    let completePrefix = `",completeText:"`;
    let completeSuffix = `"}},`;
    let event = showCountdown.substring(showCountdown.indexOf(eventPrefix)+eventPrefix.length,showCountdown.indexOf(eventSuffix)).trim();
    let date = showCountdown.substring(showCountdown.indexOf(datePrefix)+datePrefix.length,showCountdown.indexOf(dateSuffix)).trim();
    let completeText = showCountdown.substring(showCountdown.indexOf(completePrefix)+completePrefix.length,showCountdown.indexOf(completeSuffix)).trim();
    extrasData.countdownEvent = event;
    extrasData.countdownDate = date;
    extrasData.countdownCompleteText = completeText;
    /*
    ////run my backup script to see if everything is saved...it didn't look like it saved all my module changes, just media
    */
    
  }
  catch(err){
    console.log("Error reading extras config: "+err);
  }
  return extrasData;
}

/*------------------------- weather ----------------------------*/

app.get('/weather', function(req,res){
  res.sendFile(path.join(__dirname+'/express/weather.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/fetchweatherconfig', (req, res) =>{
  let params = req.query;
  try{
    readWeatherConfig().then((response)=>{
      console.log(response)
      res.send(response);
    })
    //data.timezone =tmpTimeZone;
  }
  catch(err){
    console.log("readWeatherConfig error: "+err)
  }
  finally{
  }
});

app.get('/fetchweather', (req, res) =>{
  let data = new Object();
  let params = req.query;
  console.log('geocoding...');
  try{
    for(var key in params) {
      if(key.toLowerCase().startsWith('searchterm')){
        let query = params[key];
        geocodeWeather(query).then((response)=>{
          //console.log(response);
          data = response;
          //console.log(data)
          res.send(data);
        }
        );
      }
    }
    //data.timezone =tmpTimeZone;
  }
  catch(err){
    data.location = err;
  }
  finally{
  }
});

app.post('/weather', function(req,res){
  let response = "";
  let weather_coordinates_snippet = "";
  let weather_units_snippet = "";
  let weather_forecast_days_snippet = "";
  let friendlyAddress = "";
  let latitude = "";
  let longitude = "";
  let feelsLike = false;
  let weather_feelslike_snippet = "\tshowFeelsLike:"+feelsLike+",\n";
  let wind_units_snippet = "";
  let units = "imperial";
  let days = 5;
  console.log(req.body);
  try{
    for(var key in req.body) {
      if(key.toLowerCase().startsWith('addresslookup')){
        friendlyAddress = req.body[key];
      }
      if(key.toLowerCase().startsWith('hiddenlocation')){
        let location = req.body[key];
        latitude = location.split(',')[0];
        longitude = location.split(',')[1];
       // console.log("lat: "+latitude);
       // console.log("long: "+longitude);
        weather_coordinates_snippet += "\tlat:"+latitude+",\n\tlon:"+longitude+",\n\tfriendlyLocation:\""+friendlyAddress+"\",\n";
      }
      if(key.toLowerCase().startsWith('days')){//weather_forecast_days_start
        days = req.body[key];
        console.log("Days: "+ days);
        weather_forecast_days_snippet = "\tmaxNumberOfDays:"+days+",\n";
        //maxNumberOfDays:5,
      }
      if(key.toLowerCase().startsWith('units')){//weather_forecast_units_start //weather_current_units_start
        //imperial//metric
        units = req.body[key];
        console.log("Units: "+ units);
        weather_units_snippet = "\ttempUnits:\""+units+"\",\n";
        wind_units_snippet = "\twindUnits:\""+units+"\",\n"; //set wind units to whatever temp is
        //tempUnits: "imperial",
      }
      if(key.toLowerCase().startsWith('feelslike')){//weather_feelslike_start
        feelsLike = true;//only shows up if it's set to true
        console.log("Feelslike: "+ feelsLike);
        weather_feelslike_snippet = "\tshowFeelsLike:true,\n";
      }
    }
    if(friendlyAddress.trim()!='' && latitude.trim()!=''){
      writeToTemplate('weather_current.txt','weather_current',weather_coordinates_snippet); //writes to template file 
      writeToTemplate('weather_forecast.txt','weather_forecast',weather_coordinates_snippet); //writes to template file 
    }
    writeToTemplate('weather_forecast_days.txt','weather_forecast_days',weather_forecast_days_snippet); //writes to template file 
    writeToTemplate('weather_current_units.txt','weather_current_units',weather_units_snippet); //writes to template file 
    writeToTemplate('weather_forecast_units.txt','weather_forecast_units',weather_units_snippet); //writes to template file 
    writeToTemplate('weather_feelslike.txt','weather_feelslike',weather_feelslike_snippet); //writes to template file 
    writeToTemplate('weather_wind_units.txt','weather_wind_units',wind_units_snippet); //writes to template file 

    response = "success";
  }
  catch(err){
    response="error";
    console.log(err);
  }
  finally{
    res.sendFile(path.join(__dirname+'/express/weather.html'));
    if(req.headers.referer.indexOf('iframed')>-1)
      response += "&iframed=1";
    res.redirect('/weather?result='+response);
  }
});

async function geocodeWeather(location){
  let returnValue = "";
  const options = {
    provider: 'locationiq',
    // Optional depending on the providers
    //fetch: customFetchImplementation,
    apiKey: envVars.geoAPIkey, // for Mapquest, OpenCage, APlace, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
  const geocoder = NodeGeocoder(options);
  const res = await geocoder.geocode(location).then((response)=>{
    console.log("GOT RESPONSE FROM LOCATIONIQ");
    console.log(location);
    console.log(response);
    returnValue = response;
  });
  return returnValue;
}
async function readWeatherConfig(){
    let weatherData = new Object();
    try{
      const configData = fs.readFileSync(envVars.configPath,'utf8');
      let coordsPrefix = "//weather_forecast_start";
      let coordsSuffix = "//weather_forecast_end";

      let forecastLine = configData.substring(configData.indexOf(coordsPrefix)+coordsPrefix.length,configData.indexOf(coordsSuffix));
      console.log(forecastLine);
      var locationTmp = forecastLine;
      let startString = "friendlyLocation:\"";
      let nameStart = locationTmp.indexOf(startString)+startString.length;
      let nameEnd = locationTmp.lastIndexOf("\",");
      locationTmp = locationTmp.substring(nameStart,nameEnd);
      weatherData.friendlyLocation = locationTmp;

      let unitsPrefix = "//weather_current_units_start";
      let unitsSuffix = "//weather_current_units_end";
      let units = configData.substring(configData.indexOf(unitsPrefix)+unitsPrefix.length,configData.indexOf(unitsSuffix));
      units = units.substring(units.indexOf(":\"")+2,units.lastIndexOf("\""));
      weatherData.units = units;

      let feelsPrefix = "//weather_feelslike_start";
      let feelsSuffix = "//weather_feelslike_end";
      let feels = configData.substring(configData.indexOf(feelsPrefix)+feelsPrefix.length,configData.indexOf(feelsSuffix));
      feels = feels.substring(feels.indexOf(":")+1,feels.lastIndexOf(","));
      weatherData.showFeelsLike = feels;

      let daysPrefix = "//weather_forecast_days_start";
      let daysSuffix = "//weather_forecast_days_end";
      let days = configData.substring(configData.indexOf(daysPrefix)+daysPrefix.length,configData.indexOf(daysSuffix));
      days = days.substring(days.indexOf(":")+1,days.lastIndexOf(","));
      weatherData.days = days;
      
    }
    catch(err){
      console.log("Error reading weather config: "+err);
    }
    return weatherData;
  }


/*------------------------- time ----------------------------*/


app.get('/clock', function(req,res){
  res.sendFile(path.join(__dirname+'/express/clock.html'));
  //__dirname : It will resolve to your project folder.
});

app.post('/clock', (req, res) =>{
  let response = "";
  let showtime = false;
  let time_showtime_snippet = "\tshowTime:"+showtime+",\n";
  let showseconds = false;
  let time_showseconds_snippet = "\tdisplaySeconds:"+showseconds+",\n"
  let showdate = false;
  let time_showdate_snippet = "\tshowDate:"+showdate+",\n";
  let time_dateformat_snippet = "";
  
  
  try{
    for(var key in req.body) {
      if(key.toLowerCase().startsWith('timezone')){
        let timezone = req.body[key];
       //*****FOR LOCAL MACHINE TESTING, COOMMENT OUT THIS LINE */
       if(!envVars.isdev) 
        execSync('sudo timedatectl set-timezone '+timezone);
        //console.log(result);
        response = "success";
      }
      if(key.toLowerCase().startsWith('showtime')){//time_showtime_start
        showtime = req.body[key];
        console.log("Showtime: "+ showtime);
        time_showtime_snippet = "\tshowTime:"+showtime+",\n"; //showTime:true,
      }
      if(key.toLowerCase().startsWith('timeformat')){//time_12or24_start
        let timeformat = req.body[key];
        console.log("timeformat: "+ timeformat);
        time_format_snippet = "\ttimeFormat:"+timeformat+",\n"; //timeFormat:12,
      }
      if(key.toLowerCase().startsWith('showseconds')){//time_seconds_start
        showseconds = req.body[key];
        console.log("showseconds: "+ showseconds);
        time_showseconds_snippet = "\tdisplaySeconds:"+showseconds+",\n"; //tdisplaySeconds:false,
      }
      if(key.toLowerCase().startsWith('showdate')){//time_showdate_start
        showdate = req.body[key];
        console.log("showdate: "+ showdate);
        time_showdate_snippet = "\tshowDate:"+showdate+",\n"; //	showDate:true,
      }
      if(key.toLowerCase().startsWith('dateformat')){//time_dateformat_start
        let dateformat = req.body[key];
        console.log("dateformat: "+ dateformat);
        time_dateformat_snippet = "\tdateFormat:\""+dateformat+"\",\n"; //dateFormat:"dddd, MMM Do",
      }
    }
    console.log('writing time to config')
    //writeToTemplate('time\/time_showtime.txt','time_showtime',time_showtime_snippet); //writes to template file 
    writeToTemplate('time_showtime.txt','time_showtime',time_showtime_snippet); //writes to template file 
    //./configmagic.sh time_showtime_start time_showtime_end time_showtime.txt /Users/nathangreen/Desktop/config.js
    writeToTemplate('time_12or24.txt','time_12or24',time_format_snippet); //writes to template file 
    writeToTemplate('time_seconds.txt','time_seconds',time_showseconds_snippet); //writes to template file 
    writeToTemplate('time_showdate.txt','time_showdate',time_showdate_snippet); //writes to template file 
    writeToTemplate('time_dateformat.txt','time_dateformat',time_dateformat_snippet); //writes to template file 

   
  }
  catch(err){
    response="error";
    console.log(err);
  }
  finally{
    res.sendFile(path.join(__dirname+'/express/clock.html'));
    if(req.headers.referer.indexOf('iframed')>-1)
      response += "&iframed=1";
    res.redirect('/clock?result='+response);
  }
});

app.get('/fetchclock', (req, res) =>{
  let data = new Object();
  //let obj = new Object();
  //console.log('getting data'+req);
  try{
     let tmpTimeZone = execSync('timedatectl | grep "Time zone"').toString().trim();
     tmpTimeZone = tmpTimeZone.substring(tmpTimeZone.indexOf(':')+2);
     tmpTimeZone = tmpTimeZone.substring(0,tmpTimeZone.indexOf(' ('));
     data.timezone =tmpTimeZone;
     //read clock config file - Coming soon: Date Format, Time Format (12/24), Show Seconds, show date, show time

  }
  catch(err){
    data.timezone = err;
  }
  
  try{
    //fetch config
    const configData = fs.readFileSync(envVars.configPath,'utf8');

    let showTimePrefix = "//time_showtime_start";
    let showTimeSuffix = "//time_showtime_end";
    let showtime = configData.substring(configData.indexOf(showTimePrefix)+showTimePrefix.length,configData.indexOf(showTimeSuffix));
    showtime = showtime.substring(showtime.indexOf(":")+1,showtime.lastIndexOf(","));
    data.showtime = showtime;

    let timeformatPrefix = "//time_12or24_start";
    let timeformatSuffix = "//time_12or24_end";
    let timeformat = configData.substring(configData.indexOf(timeformatPrefix)+timeformatPrefix.length,configData.indexOf(timeformatSuffix));
    timeformat = timeformat.substring(timeformat.indexOf(":")+1,timeformat.lastIndexOf(","));
    data.timeformat = timeformat;

    let showsecondsPrefix = "//time_seconds_start";
    let showsecondsSuffix = "//time_seconds_end";
    let showseconds = configData.substring(configData.indexOf(showsecondsPrefix)+showsecondsPrefix.length,configData.indexOf(showsecondsSuffix));
    showseconds = showseconds.substring(showseconds.indexOf(":")+1,showseconds.lastIndexOf(","));
    data.showseconds = showseconds;

    let showdatePrefix = "//time_showdate_start";
    let showdateSuffix = "//time_showdate_end";
    let showdate = configData.substring(configData.indexOf(showdatePrefix)+showdatePrefix.length,configData.indexOf(showdateSuffix));
    showdate = showdate.substring(showdate.indexOf(":")+1,showdate.lastIndexOf(","));
    data.showdate = showdate;

    let dateformatPrefix = "//time_dateformat_start";
    let dateformatSuffix = "//time_dateformat_end";
    let dateformat = configData.substring(configData.indexOf(dateformatPrefix)+dateformatPrefix.length,configData.indexOf(dateformatSuffix));
    dateformat = dateformat.substring(dateformat.indexOf(":\"")+2,dateformat.lastIndexOf("\""));
    data.dateformat = dateformat;    

  }
  catch(err){

  }

  //console.log(data)

  res.send(data);
});


/*------------------------- calendar ----------------------------*/

app.get('/calendar', function(req,res){
  res.sendFile(path.join(__dirname+'/express/calendar.html'));
  //__dirname : It will resolve to your project folder.
});

//Route that handles login logic
app.post('/calendar', (req, res) =>{
  try{
    let internalName = "";
    let name = "";
    let ics = "";
    let color = "";
    let calendar_ical_snippet = "";
    let calendar_name_snippet = "";
    let name_count = 0;
    let calendar_css_snippet = "";

    for(var key in req.body) {
      if(req.body.hasOwnProperty(key)){
        if(key.toLowerCase().startsWith('name')){
          internalName = key;
          name = req.body[key];

          name = name.replace(/"/g, "");
          //calendar_name_snippet += (name_count>0?",":"")+"\""+name+"\"";
          calendar_name_snippet += (name_count>0?",":"")+"\""+internalName+"\"";
          name_count++;
        }
        if(key.toLowerCase().startsWith('ics')){
          ics = req.body[key];
          ics = ics.replace(/"/g, "%22");
          //calendar_ical_snippet += "\n{\n\tname:\""+internalName+"\",\n\turl:\""+ics+"\",\n\tinternalName:\""+name+"\",\n},";
        }
        if(key.toLowerCase().startsWith('color')){
          color = req.body[key];
          calendar_css_snippet +="div.event[data-calendar-name=\""+internalName+"\"] {\n\tbackground: linear-gradient(0deg, "+color+" 99%, #000 1%);\n\tcolor:white !important;\n}\n";
          calendar_ical_snippet += "\n{\n\tname:\""+internalName+"\",\n\turl:\""+ics+"\",\n\tinternalName:\""+name+"\",\n\tcolor:\""+color+"\",\n},";
        }
      }
    }
    //wrap calendar name and URLs in 'calendars' wrapper
    calendar_ical_snippet = "calendars : ["+ calendar_ical_snippet+ "\n],";
    calendar_name_snippet = "calendars:["+ calendar_name_snippet + "],\n";

  writeToTemplate('calname.txt','cal_name',calendar_name_snippet); //writes to template file  //setTimeout(function(){
  writeToTemplate('ics.txt','cal_ics',calendar_ical_snippet); //writes to template file          //},3000);
  writeToCSS(calendar_css_snippet,envVars.calendar_css);
    //write JSON to the text file 'calname.txt', and ics.txt
    //call configmagic.sh
    //done!
    //update CSS
    //verify change
    res.sendFile(path.join(__dirname+'/express/calendar.html'));
    if(req.headers.referer.indexOf('iframed')>-1)
      response += "&iframed=1";
    res.redirect('/calendar?result=success');
  }
  catch(err){
    res.send('Looks like there was a problem saving your changes:\n\n'+err)
  }
 
  
})

app.get('/fetchcalendar', (req, res) =>{
 // console.log('getting data'+req);
  
  res.send(readCalendarConfig());
})
function readCalendarConfig(){
//read existing calendar info from config and css and return to client to populate HTML
  let cals = [];
  try{
    const configData = fs.readFileSync(envVars.configPath,'utf8');
    let icsData = configData.substring(configData.indexOf("//cal_ics_start")+15,configData.indexOf("//cal_ics_end"));
    let obj = new Object();

    let continueParsing = true;
    while(continueParsing){
      obj = new Object();
      //console.log("icsData: "+ icsData);
      var nameTmp = icsData;
      let nameStart = nameTmp.indexOf("name:\"")+6;
      let nameEnd = nameTmp.indexOf("\",");
     // console.log(nameStart+","+nameEnd);
      nameTmp = nameTmp.substring(nameStart,nameEnd);
     // console.log('nameTmp: '+nameTmp);

      var icsTmp = icsData.substring(nameEnd+2);
      let icsStart = icsTmp.indexOf("url:\"")+5;
      let icsEnd = icsTmp.indexOf("\",");
      //console.log(icsStart+","+icsEnd);
      icsTmp = icsTmp.substring(icsStart,icsEnd);
      //console.log("-----------");
      //console.log('icsTemp: '+icsTmp);

      let internalStart = icsData.indexOf("internalName:\"");
      var internalNameTmp = icsData.substring(internalStart+2);
      let internalEnd = internalNameTmp.indexOf(",")-1;
      internalNameTmp = internalNameTmp.substring(internalNameTmp.indexOf("\"")+1,internalEnd)

      //console.log(internalNameTmp);
      //console.log("------------------")
      //console.log(internalStart+","+internalEnd);
      
      let colorStart = icsData.indexOf("color:\"");
      var colorTemp = icsData.substring(colorStart+2);
     // console.log(colorTemp);
      let colorEnd = colorTemp.indexOf(",")-1;
      colorTemp = colorTemp.substring(colorTemp.indexOf("\"")+1,colorEnd)


      obj.name = nameTmp;
      obj.ics = icsTmp;
      obj.internalName = internalNameTmp;
      obj.color = colorTemp;
      cals.push(obj);
      //resize string
      icsData = icsData.substring(icsData.indexOf("},")+2);
      continueParsing = icsData.indexOf("name:\"")>-1;
    }
    //console.log(cals);

  }
  catch(err){
    console.log("Error reading config: "+err);
  }
  return cals;
}

/*------------------------- shared ----------------------------*/

async function writeToTemplate(filename, delimiter, content){
  let fileContent = "//"+delimiter +"_start\n"+ content +"//"+ delimiter+"_end";
  //console.log(fileContent);
  let retVal = "error"
  //let tmpFilename = 'time/time_showtime.txt';
  //if(filename.indexOf('')) //  \\\/
  //writeToTemplate('time\\\/time_showtime.txt','time_showtime',time_showtime_snippet); //writes to template file 

  //fs.writeFile('temp/'+tmpFilename, fileContent, err => {
  fs.writeFile('temp/'+filename, fileContent, err => {
    if (err) {
      console.error(err);
    } else {
      //using execSync so it completes before finishing
      console.log('./configmagic.sh '+delimiter+'_start '+delimiter+'_end '+filename+' '+envVars.configPath);
      execSync('./scripts/configmagic.sh '+delimiter+'_start '+delimiter+'_end '+filename+' '+envVars.configPath, console.log);
      //exec('./configmagic.sh '+delimiter+'_start '+delimiter+'_end ics.txt', console.log)
      console.error("success");    
      retVal = "success";
   }
  });
  return retVal;
}



async function writeToCSS(content, destinationFilename){
  console.log(content);
  let retVal = "error"
  fs.writeFile(destinationFilename, content, err => {
    if (err) {
      console.error(err);
    } else {
      retVal = "success";
   }
  });
  return retVal;
}

const characters ='abcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


function setIPAddr(){
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object
  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
          const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
          if (net.family === familyV4Value && !net.internal) {
              if (!results[name]) {
                  results[name] = [];
              }
              results[name].push(net.address);
              //console.log("setting IP..."+ net.address);
              global.IP = net.address;
          }
      }
  }
}

function getIPAddr(){
  return global.IP;
}

//Start your server on a specified port
const server = app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`)
})
