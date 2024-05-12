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
            console.log(res);
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

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('result');
    const isIframe = urlParams.get('iframed');
    console.log(myParam);
    if(myParam&&myParam.toLowerCase()=="success"){
        document.getElementById("status").innerHTML = "Greenscreen settings updated.  Relaunch Greenscreen to see your changes"
        document.getElementById("refreshbutton").classList.remove("hidden");
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

function openMM(){
    fetch('/openmm');
}
function launchWizard(page){
    fetch('/openwizard?page='+page);
}
function refreshAndLaunchWizard(page){
    fetch('/refreshwizard?page='+page);
}
const info = [
    {
        id:"message",
        content:`<div>You can add a custom image to your GreenScreen display.  <img src="/img/info/placeholder.jpg">More stuff</div>`
    },
    {
        id:"msg-placement",
        content:`<div>Goes either on the side or middle</div>`
    }
   
];

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