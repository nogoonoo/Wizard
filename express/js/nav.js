
const pages = [
{
    name:"Calendar",
    url: "calendar"
},
{
    name:"Date/Time",
    url: "clock"
},
{
    name:"Weather",
    url: "weather"
},
{
    name:"Backgrounds",
    url: "background"
},
{
    name:"News",
    url: "news"
},
{
    name:"Extras",
    url: "extras"
},
{
    name:"Advanced",
    url: "advanced"
}
];
function loadNav(){
    let parent = document.getElementById("sidebar");
    pages.forEach(element => {
		let link = document.createElement('a');
		link.href = element.url;
		link.text = element.name;
		if(window.location.pathname.indexOf(element.url)>-1)
			link.className = "active";
		parent.append(link);
	});
}