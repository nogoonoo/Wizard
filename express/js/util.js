let dialogBoxId=document.getElementById("dialogBox");
let isLocalHost =  window.location.href.indexOf('localhost:3000')>-1;

function showDialog(id){
    clickedRemove = id;
    dialogBoxId.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
        }
    });
    dialogBoxId.showModal();
}

function closeDialog(){
    dialogBoxId.close(); 
}

function populateQR(){
    if(window.location.href.indexOf('localhost:3000')>-1){
        let qrImage = document.createElement('img');
        qrImage.id = "qr-code";
        qrImage.src = "http://localhost:3000/qrcode?path="+window.location.pathname;
        //document.getElementById('qr-code').setAttribute("src","http://localhost:3000/qrcode?path="+window.location.pathname);
        let qrParent = document.getElementById('qrParent');
        qrParent.innerText = "Scan for Settings"
        qrParent.appendChild(qrImage);
        let divInfo = document.createElement('div');
        divInfo.id = "qrinfo";
        //divInfo.innerText = "Scan, or open browser to";
        let divHostName = document.createElement('div');
        divHostName.id = "hostnameInfo";
        divHostName.innerText = "greenscreen:3000"+window.location.pathname;
        qrParent.appendChild(divInfo);
        qrParent.appendChild(divHostName);
        qrParent.classList.remove("hidden");
        /*IP().then((res)=>{
            document.getElementById('hostnameInfo').innerText = window.location.protocol +"//"+res.ip + ':' +res.port + window.location.pathname;
        })*/
    }
}
async function IP(){
    const response = await fetch('/ip');
    let IP = await response.json();
    return IP;
}

async function refreshMM(){
    fetch('/refreshmmf5'); 
}
function init(){
    if(!isLocalHost && document.getElementById('refreshbutton')){
        document.getElementById('refreshbutton').innerText = 'Refresh Greenscreen';
        document.getElementById("refreshbutton").classList.add("hidden");

    }
    if(!isLocalHost){
        if(document.querySelector('.formField.spacer'))
            document.querySelector('.formField.spacer').classList.remove('spacer');
    }
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('result');
    const isIframe = urlParams.get('iframed');
    //console.log(myParam);
    if(myParam&&myParam.toLowerCase()=="success"){
        if(isIframe){
           // document.getElementById("status").innerHTML = "Greenscreen settings saved.  Please wait while the screen refreshes..."
           // fetch('/refreshmm'); 
        }
        else{
            document.getElementById("status").innerHTML = "Greenscreen settings saved.  Return to Greenscreen to see your changes"
            document.getElementById("refreshbutton").classList.remove("hidden");
        }
    }
    if(myParam&&myParam.toLowerCase()=="success" && !isLocalHost){
        document.getElementById("status").innerHTML = "Greenscreen settings updated.  Click 'Refresh Greenscreen' to view your changes"
    }
    if(myParam&&myParam.toLowerCase()=="sent"){
        document.getElementById("status").innerHTML = "Thank you for submitting a message.  If you've included your email address, we'll respond as quickly as possible."
    }
    if(isIframe){
       /*document.querySelector('h2').classList.add("hidden");
        document.body.style.backgroundImage = "none";
        document.getElementById('refreshbutton').style.display = "none";*/
    }
    if(!isIframe){
        populateQR();
    }
   
    attachInfoEventListeners();

}


function toggleMenu(x) {
    x.classList.toggle("change");
    let sideBar = document.getElementById('sidebar');
    if((sideBar.style.display == '' && window.screen.width<700) || sideBar.classList.contains("hidden")){
        sideBar.style.display = "block";
        sideBar.classList.remove("hidden");
        sideBar.classList.add("show");
    }
    else{
        sideBar.classList.add("hidden");
    }
  }

function openMM(obj){
    if(obj){
        obj.innerText = 'Opening...'
    }
    fetch('/openmm'); 
}

function closeWizard(){
    fetch('/closewizard'); 
}
function launchWizard(page){
    fetch('/openwizard?page='+page);
}
function refreshAndLaunchWizard(page){
    fetch('/refreshwizard?page='+page);
}


function attachInfoEventListeners(){
    let infoIcons = document.querySelectorAll('span[data-info]');
    for(var i = 0; i<infoIcons.length; i++){
        let infoID = infoIcons[i].getAttribute('data-info');
        infoIcons[i].addEventListener("click", function (e) {
            populateModal(infoID);
        });
    }
}

function populateModal(id){
    let obj = getInfoContent(id);
    let title = obj[0].title;//document.querySelector('[data-info="'+id+'"]').innerText;
    document.getElementById('info-modal-title').innerText = title;
    document.getElementById('info-modal-content').innerHTML = obj[0].content;
    MicroModal.show('info-modal');
    let dropdowns = document.querySelectorAll('div.accordian');
    for(i=0;i<dropdowns.length;i++){
        //('appending stuff')
        dropdowns[i].addEventListener("click", function (e) {
            this.querySelector('div.hiddenContent').classList.toggle('open')
            this.querySelector('div.hiddenContent').classList.toggle('closed')
            this.querySelector('span.caret').classList.toggle('right')
            this.querySelector('span.caret').classList.toggle('down')
        });  
    }
}

function getInfoContent(id) {
    return info.filter(
        function(info){ return info.id == id }
    );
}

function disableSave(){
    let saveButton = document.getElementById("savebutton");
    saveButton.disabled = true;
    saveButton.innerText = "saving...";
}

/**Help Modals */
const info = [
    {
        id:"message",
        title:"Custom Messages",
        content:`Need to remind yourself or a family member of an important event?  Maybe you just want to leave a thoughtful message? You can show a message in a couple of 
        different locations on your Greenscreen`
    },
    {
        id:"msg-placement",
        title:"Message Placement",
        content:` You can place a message in the sidebar <img src="/img/info/msgside.jpg">
        or make it stand out more and place it in the middle of the screen<img src="/img/info/msgcenter.jpg">`
    },
    {
        id:"about-cals",
        title:"Calendars",
        content:`Show animated gif of cals`
    },
    {
        id:"about-datetime",
        title:"Date and Time",
        content:`Show animated gif of dates`
    },
    {
        id:"about-weather",
        title:"Weather",
        content:`Show animated gif of dates`
    },
    {
        id:"about-bgs",
        title:"Backgrounds",
        content:`Show animated gif of dates`
    },
    {
        id:"about-news",
        title:"Newsfeed",
        content:`Show animated gif of news`
    },
    {
        id:"about-others",
        title:"Extra",
        content:`Show animated gif of extras`
    },
     {
        id:"weatherdeets",
        title:"Weather Details",
        content:`Toggle this on to show additional weather information<ul><li>Wind Speed and Direction</li><li>Sunrise/Sunset</li><li>'Feels Like'</li></ul><img src="/img/info/weather3.jpg">`
    },
    {
        id:"weatherforecast",
        title:"Weather Forecast",
        content:`Greenscreen will display a forecast up to 7 days from today<img src="/img/info/weather2.jpg">`
    },
    
    {
        id:"bgbright",
        title:"Background Brightness",
        content:`The background image brightness can be increased or decreased.  Decreasing the brighness makes text easier to read.<br/><br/>Lower brightness<img style="width:40%" src="/img/info/bg-dark.jpg">Higher brightness<img  style="width:40%" src="/img/info/bg-bright.jpg">`
    },
    {
        id:"bgsources",
        title:"Background Image Sources",
        content:`Greenscreen can display and rotate between backgrounds from a variety of sources:<ul>
        <li><b>Stock Images</b>: A curated selection of hundreds of landscape and nature images.</li><br/>
        <li><b>iCloud Shared Albums</b>: Use a shared iCloud photo albums from your iPhone, iPad, or Mac</li><br/>
        <li><b>Bing Wallpapers</b>: Bing Wallpaper includes a collection of beautiful images from around the world that have been featured on the Bing homepage</li><br/>
        <li><b>Upload your own images</b>: You can upload your own images directly to Greenscreen from your phone or other device</li><br/>
        <li><b>Solid Color</b>: Want something more simple?  Specify one of millions of colors to use as your background.</li>
        </ul>`
    },
    {
        id:"bgrotate",
        title:"Image Rotation Interval",
        content:`Greenscreen can rotate through images at different intervals, including every:<ul><li>1 minute</li><li>5 minutes</li><li>15 minutes</li><li>30 minutes</li><li>1 hour</li><li>2 hours</li><li>4 hours</li><li>8 hours</li><li>12 hours</li></ul> `
    },
    {
        id:"bg-placement",
        title:"Background Placement",
        content:`Greenscreen can display background images on the sidebar <img src="/img/info/bg-side.jpg"> or fullscreen<img src="/img/info/bg-full.jpg">`
    },
    
    {
        id:"preconfig-news",
        title:"Preconfigured News Sources",
        content:`Greenscreen comes with several preconfigured news feeds, including:
        <ul>
        <li>Associated Press</li>
        <li>CNN</li>
        <li>Fox News</li>
        <li>The New York Times</li>
        <li>The Wall Street Journal </li>
        </ul>
        You can select multiple news sources to cycle through your Greenscreen newsfeed. Remember, you can click on the articles as they cycle through and display the full article on your screen.`
    },
    {
        id:"custom-news",
        title:"Custom News Sources",
        content:`Greenscreen allows you to add custom news feeds, known as RSS feeds.  Most online news sources provide an RSS feed, which can usually be found with a Google search. 
        RSS are in the form of a URL.  Here's a few examples:<ul><li>https://gizmodo.com/rss</li><li>https://feeds.nbcnews.com/nbcnews/public/world</li><li>https://www.engadget.com/rss.xml</li></ul>
        You can enter in a name and the URL for up to 3 custom news sources. Remember, you can click on the articles as they cycle through and display the full article on your screen.`
    },
    {
        id:"rotate-news",
        title:"News Rotation Frequency",
        content:`Greenscreen will rotate through articles from your selected news sources.  The rotation interval can be set to <ul><li>10 seconds</li><li>20 seconds</li><li>30 seconds</li><li>1 minute</li></ul>`
    },
    {
        id:"wotd",
        title:"Word of the Day",
        content:`Build your vocabulary with Merriam-Webster's Word of the Day! Each day a Merriam-Webster editor offers insight into a fascinating new word.
        <img src="/img/info/wotd.jpg">`
    },
    {
        id:"countdown",
        title:"Countdown Clock",
        content:`Build excitement by counting down to an important anniversary, holiday, birthday, or any other custom day and time<img src="/img/info/countdown1.jpg">Once the countdown is reached, it will display a customized message<img src="/img/info/countdown2.jpg">`
    },
    {
        id:"rotate-widgets",
        title:"How often to rotate between widgets",
        content:`You can rotate between the Word of the Day and the Countdown widget every <ul><li>5 seconds</li><li>10 seconds</li><li>20 seconds</li><li>30 seconds</li><li>1 minute</li></ul>
        If you select 'don't rotate', the widgets will stack on top of one another<img src="/img/info/norotateimage.jpg">`
    },
    {
        id:"countdown-date",
        title:"Countdown Date",
        content:`The date to countdown to.  The clock will display how many days, hours, minutes, and seconds until the date you specify.<img src="/img/info/countdown-date.jpg">`
    },
    {
        id:"countdown-msg",
        title:"Countdown Label Message",
        content:`This is the prefixed message to show above the countdown clock<img src="/img/info/countdown-msg.jpg">`
    },
    {
        id:"countdown-after",
        title:"Countdown Complete Message",
        content:`Once the date has been reached, you can specify what message to show<img src="/img/info/countdown-complete.jpg">`
    },
    {
        id:"sys-power",
        title:"Standby Schedule",
        content:`It wouldn't be a 'green' screen if you couldn't put the display in standby once in a while, right?  Schedule your Greenscreen to go into standby in the evening and wake up in the morning.`
    },
    {
        id:"sys-updates",
        title:"System Updates",
        content:`Greenscreen will periodically check for updates.  Click the 'Check for Updates' button to check for and install updates now`
    },
    {
        id:"sys-options",
        title:"Power Functions",
        content:`There are several device options you can choose from: <ul><li><b>Standby</b> - This will put the monitor to sleep until the next scheduled wake time.  This option is only available when accessing setting from another device. <br/><br/> <i>*Note* You can only wake the screen back up by using another device, not directly on Greenscreen.  Alternatively, and not recommended, you can unplug Greenscreen and plug it back in to turn the screen back on.</i></li><br/>
        <li><b>Wake from Standby</b> - This will wake the monitor up. This option is only available when accessing setting from another device.</li><br/>
        <li><b>Reboot</b> - Rebooting your Greenscreen may help resolve occational issues.</li><br/>
        <li><b>Shutdown</b> - Shutting down your Greenscreen is safer than just unplugging the power cable.</li>`
    },
    {
        id:"sys-reset",
        title:"Erase Settings",
        content:`Resetting your Greenscreen will erase the following customizations: <div class='dialogDeets'><ul><li>saved calendars</li><li>weather location</li><li>newsfeeds</li><li>countdown clocks</li><li>messages</li><li>background settings (not including uploaded images)</li></ul></div>The following settings will not be affected:<div class='dialogDeets'><ul><li>Screen power on/off schedule</li><li>uploaded images</li><li>network connections</li></ul></div><br/>.`
    },
    {
        id:"cal-help",
        title:"How do I add my Calendars?",
        content:`<div>Most online calendars provide data in the form of an iCal feed. Greenscreen uses this to display your events.  To get your calendar's URL, start by selecting your calendar type:<br/><br/>
        <div class="accordian">Google Calendar <span class="caret right"></span>
        <div class="hiddenContent closed">
        <ol>
        <li>Start by logging into https://calendar.google.com using a web browser on a phone, tablet, or computer.</li>
        <li>Click the three dots next to the calendar you want to add:<img src="/img/info/calStep1.jpg"></li>
        <li>Click 'Settings and Sharing':<img src="/img/info/calStep2.jpg"></li>
        <li>Scroll down and find the 'Secret address in iCal format' URL under the Integrate Calendar section. Click on the Copy button:<img src="/img/info/calStep3.jpg" style="width:90%">
        </li>
        <li>Paste the link in the Calendar URL field of the Calendar Settings page and click the 'Update Greenscreen' button</li>
        </div>
        </div>
        
        <div class="accordian">Apple iCloud <span class="caret right"></span>
        <div class="hiddenContent closed">
        You can get your calendar URL for an iCloud calendar through an iPhone/iPad, on your Mac, or via your iCloud account in a web browser
        <br/>
        <h3>Using an iPhone/iPad</h3>
        <ol>
        <li>Open the iOS Calendar app and tap Calendars:<img src="/img/info/iosStep1.jpg" style="width:40%"></li>
        <li>Tap the 'info' icon next to the iCloud calendar you want to use <img src="/img/info/iosStep2.jpg" style="width:40%"></li>
        <li>Tap the Public Calendar toggle <img src="/img/info/iosStep3.jpg" style="width:40%"></li>
        <li> Tap the 'Share Link' button to copy the calendar's URL  <img src="/img/info/iosStep4.jpg" style="width:40%"></li>
        <li> Tap the 'Share Link' button to copy the calendar's URL  <img src="/img/info/iosStep4.jpg" style="width:40%"></li>
        <li>Paste the link in the Calendar URL field of the Calendar Settings page and click the 'Update Greenscreen' button</li>
        </ol>
        <h3>Using a Mac</h3>
        <ol>
        <li>Open the Calendar app on your Mac<img src="/img/info/macOSstep1.jpg"></li>
        <li>Click the 'share' icon next to the calendar name<img src="/img/info/macOSstep2.jpg"></li>
        <li>Select Public Calendar and you'll see a calendar URL appear below<img src="/img/info/macOSstep4.jpg"></li>
        <li>Right-click the URL and select 'Copy' to get the calendar URL<img src="/img/info/macOSstep5.jpg"></li>
        <li>Paste the link in the Calendar URL field of the Calendar Settings page and click the 'Update Greenscreen' button</li>
        </ol>
        <h3>Using iCloud on a Web Browser</h3>
        <ol>
        <li>Log in to your iCloud account and click on the Calendar app <img src="/img/info/icloudStep1.jpg"></li>
        <li>Click on the sharing icon next to the calendar you want to use <img src="/img/info/icloudStep2.jpg"></li>
        <li>Make sure the 'Public Calendar' toggle is on <img src="/img/info/icloudStep3.jpg"></li>
        <li>Click the 'Copy' button <img src="/img/info/icloudStep4.jpg"></li>
        <li>Paste the link in the Calendar URL field of the Calendar Settings page and click the 'Update Greenscreen' button</li>
        </ol>
        </div>
        </div>
        
        <div class="accordian">Microsoft Office 365 <span class="caret right"></span>
        <div class="hiddenContent closed">
        <ol>
        <li>Login to your Microsoft 365 account. Navigate to Outlook and click the calendar on the left side of the screen<img src="/img/info/365step1.jpg" style="width:30%"></li>
        <li>From the calendar page click on the gear icon in the upper right<img src="/img/info/365step2.jpg" style="width:10%"></li>
        <li>Click 'Calendar' then click 'Shared calendars' <img src="/img/info/365step3.jpg"></li>
        <li>Under the 'Publish a calendar' section, use the dropdown to select your calendar <img src="/img/info/365step4.jpg" style="width:70%"></li>
        <li>Select the permission 'Can view all details' then click Publish to generate the URL<img src="/img/info/365step5.jpg" style="width:70%"></li>
        <li>Highlight and copy the ICS URL that appears<img src="/img/info/365step6.jpg" style="width:70%"></li>
        <li>Paste the link in the Calendar URL field of the Calendar Settings page and click the 'Update Greenscreen' button</li>
        </div>
        </div>
        
        </div>`
    }
   
];