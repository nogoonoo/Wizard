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
    console.log(myParam);
    if(myParam&&myParam.toLowerCase()=="success")
        document.getElementById("status").innerHTML = "Your updates were successful"

    populateQR();
}
