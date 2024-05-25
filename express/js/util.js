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
        document.getElementById('qr-code').setAttribute("src","http://localhost:3000/qrcode?path="+window.location.pathname);
        document.getElementById('qrParent').classList.remove("hidden");
        IP().then((res)=>{
            //console.log(res);
            document.getElementById('hostnameInfo').innerText = window.location.protocol +"//"+res.ip + ':' +res.port + window.location.pathname;
            
            //<span class="qrCode hidden" id="qrParent"><div id="">Scan to edit on your phone</div><img id="qr-code" src=""><div>Or go to </div><div id="hostnameInfo"></div></span>

        })
    }
}
async function IP(){
    const response = await fetch('/ip');
    let IP = await response.json();
    return IP;
}

function init(){
    if(!isLocalHost){
        document.getElementById('refreshbutton').innerText = 'Refresh Greenscreen';
        document.getElementById("refreshbutton").classList.add("hidden");

    }
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('result');
    const isIframe = urlParams.get('iframed');
    //console.log(myParam);
    if(myParam&&myParam.toLowerCase()=="success"){
        document.getElementById("status").innerHTML = "Greenscreen settings updated.  Return to Greenscreen to see your changes"
        document.getElementById("refreshbutton").classList.remove("hidden");
    }
    if(myParam&&myParam.toLowerCase()=="success" && !isLocalHost){
        document.getElementById("status").innerHTML = "Greenscreen settings updated.  Click 'Refresh Greenscreen' to view your updated settings"
    }
    if(myParam&&myParam.toLowerCase()=="sent"){
        document.getElementById("status").innerHTML = "Thank you for submitting a message.  If you've included your email address, we'll respond as quickly as possible."
    }
    if(isIframe){
        document.querySelector('h2').classList.add("hidden");
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
    let infoIcons = document.querySelectorAll('.info');
    for(var i = 0; i<infoIcons.length; i++){
        let infoID = infoIcons[i].getAttribute('data-info');
        infoIcons[i].addEventListener("click", function (e) {
            populateModal(infoID);
        });
    }
}

function populateModal(id){
    let obj = getInfoContent(id);
    let title = document.querySelector('[data-info="'+id+'"]').innerText;
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
        content:`<div>You can add a custom image to your GreenScreen display.  <img src="/img/info/placeholder.jpg">More stuff</div>`
    },
    {
        id:"msg-placement",
        content:`Message to show to the left or center of screen`
    },
    {
        id:"about-cals",
        content:`Show animated gif of cals`
    },
    {
        id:"about-datetime",
        content:`Show animated gif of dates`
    },
    {
        id:"about-datetime",
        content:`Show animated gif of dates`
    },
    {
        id:"about-weather",
        content:`Show animated gif of dates`
    },
    {
        id:"about-bgs",
        content:`Show animated gif of dates`
    },
    {
        id:"about-news",
        content:`Show animated gif of news`
    },
    {
        id:"about-others",
        content:`Show animated gif of extras`
    },
     {
        id:"weatherdeets",
        content:`Toggle this on to show additional weather information (like wind speed, etc)`
    },
    {
        id:"bgbright",
        content:`Lower the brightness to make text easier to read`
    },
    {
        id:"bgsources",
        content:`Different sources`
    },
    {
        id:"bgrotate",
        content:`How often we rotate`
    },
    {
        id:"preconfig-news",
        content:`Greenscreen comes with a few setup`
    },
    {
        id:"custom-news",
        content:`Add custom RSS feeds`
    },
    {
        id:"wotd",
        content:`Word of the day`
    },
    {
        id:"countdown",
        content:`You can countdown to something`
    },
    {
        id:"countdown-date",
        content:`The date to countdown to`
    },
    {
        id:"countdown-msg",
        content:`The mssage to show`
    },
    {
        id:"countdown-after",
        content:`Once its sountedown, shows this`
    },
    {
        id:"sys-power",
        content:`You can turn the screen off and on at your blah`
    },
    {
        id:"sys-updates",
        content:`Greenscreen periodically checks itself for updates, but you can force a check`
    },
    {
        id:"cal-help",
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