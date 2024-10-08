
const pages = [
{
    name:"Calendar",
    url: "calendar",
    icon:`<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF"><path d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 10V6C3 4.89543 3.89543 4 5 4H7" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 2V6" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 10V6C21 4.89543 20.1046 4 19 4H18.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
},
{
    name:"Date/Time",
    url: "clock",
    icon: `<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF"><path d="M12 6L12 12L18 12" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
},
{
    name:"Weather",
    url: "weather",
    icon: `<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF"><path d="M12 4C6 4 6 8 6 10C4.33333 10 1 11 1 15C1 19 4.33333 20 6 20H18C19.6667 20 23 19 23 15C23 11 19.6667 10 18 10C18 8 18 4 12 4Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"></path></svg>`
},
{
    name:"Backgrounds",
    url: "background",
    icon: `<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF"><path d="M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 16L10 13L21 18" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8C18 9.10457 17.1046 10 16 10Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
},
{
    name:"News",
    url: "news",
    icon: `<svg fill="#FFFFFF" height="24" width="24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 442 442" xml:space="preserve" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M171,336H70c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.523,0,10-4.477,10-10S176.523,336,171,336z"></path> <path d="M322,336H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,336,322,336z"></path> <path d="M322,86H70c-5.523,0-10,4.477-10,10s4.477,10,10,10h252c5.522,0,10-4.477,10-10S327.522,86,322,86z"></path> <path d="M322,136H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,136,322,136z"></path> <path d="M322,186H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,186,322,186z"></path> <path d="M322,236H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,236,322,236z"></path> <path d="M322,286H221c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.522,0,10-4.477,10-10S327.522,286,322,286z"></path> <path d="M171,286H70c-5.523,0-10,4.477-10,10s4.477,10,10,10h101c5.523,0,10-4.477,10-10S176.523,286,171,286z"></path> <path d="M171,136H70c-5.523,0-10,4.477-10,10v101c0,5.523,4.477,10,10,10h101c5.523,0,10-4.477,10-10V146 C181,140.477,176.523,136,171,136z M161,237H80v-81h81V237z"></path> <path d="M422,76h-30V46c0-11.028-8.972-20-20-20H20C8.972,26,0,34.972,0,46v320c0,27.57,22.43,50,50,50h342c27.57,0,50-22.43,50-50 V96C442,84.972,433.028,76,422,76z M422,366c0,16.542-13.458,30-30,30H50c-16.542,0-30-13.458-30-30V46h352v305 c0,13.785,11.215,25,25,25c5.522,0,10-4.477,10-10s-4.478-10-10-10c-2.757,0-5-2.243-5-5V96h30V366z"></path> </g> </g></svg>`
},
{
    name:"Extras",
    url: "extras",
    icon:`<svg height="24" width="24" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="6" height="6" rx="1" transform="matrix(1 0 0 -1 14 10)" stroke="#ffffff" stroke-linecap="round"></rect> <path d="M10 14H14C14.9428 14 15.4142 14 15.7071 14.2929C16 14.5858 16 15.0572 16 16V18C16 18.9428 16 19.4142 15.7071 19.7071C15.4142 20 14.9428 20 14 20H10V14Z" stroke="#ffffff" stroke-linecap="round"></path> <path d="M10 10C10 9.05719 10 8.58579 9.70711 8.29289C9.41421 8 8.94281 8 8 8H6C5.05719 8 4.58579 8 4.29289 8.29289C4 8.58579 4 9.05719 4 10V14H10V10Z" stroke="#ffffff" stroke-linecap="round"></path> <path d="M10 20H6C5.05719 20 4.58579 20 4.29289 19.7071C4 19.4142 4 18.9428 4 18V14H10V20Z" stroke="#ffffff" stroke-linecap="round"></path> </g></svg>`
},
{
    name:"Message",
    url: "message",
    icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 512 512" fill="#FFFFFF"><path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"/></svg>`
},
{
    name:"System",
    url: "advanced",
    icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
},
{
    name:"Help/Support",
    url: "help",
    icon:`<svg width="24px" height="24px"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" stroke-width="2"></path> <path d="M10.5 8.67709C10.8665 8.26188 11.4027 8 12 8C13.1046 8 14 8.89543 14 10C14 10.9337 13.3601 11.718 12.4949 11.9383C12.2273 12.0064 12 12.2239 12 12.5V12.5V13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 16H12.01" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
}
];
function loadNav(){
    //if(window.location.href.indexOf('iframed')==-1){
        let parent = document.getElementById("sidebar");
        pages.forEach(element => {
            let link = document.createElement('a');
            link.href = element.url;
            link.innerHTML = element.icon + element.name;
            link.id = element.name+"-link";
            //link.text = element.name;
            if(window.location.pathname.indexOf(element.url)>-1)
                link.className = "active";
            parent.append(link);
        });
   /* }  
    else{
        document.querySelector('div.menu-container').remove();
        document.querySelector('div.sidebar').remove();
        document.querySelector('div.content').setAttribute('style','margin-left:0px');
    }*/
}