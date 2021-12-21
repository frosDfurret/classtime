//the below url parameter is brought to you by the following stackOverflow post:
//https://stackoverflow.com/a/8486188
//thank you, i'm way too lazy to figure out how to write it myself
function getJsonFromUrl(url) {
	if (!url) url = location.href;
	var question = url.indexOf("?");
	var hash = url.indexOf("#");
	if (hash == -1 && question == -1) return {};
	if (hash == -1) hash = url.length;
	var query = question == -1 || hash == question + 1 ? url.substring(hash) :
		url.substring(question + 1, hash);
	var result = {};
	query.split("&")
		.forEach(function(part) {
			if (!part) return;
			part = part.split("+")
				.join(" ");
			var eq = part.indexOf("=");
			var key = eq > -1 ? part.substr(0, eq) : part;
			var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
			var from = key.indexOf("[");
			if (from == -1) result[decodeURIComponent(key)] = val;
			else {
				var to = key.indexOf("]", from);
				var index = decodeURIComponent(key.substring(from + 1, to));
				key = decodeURIComponent(key.substring(0, from));
				if (!result[key]) result[key] = [];
				if (!index) result[key].push(val);
				else result[key][index] = val;
			}
		});
	return result;
}

//ok begin my code
var error = false;

var urlParams = getJsonFromUrl("?" + document.URL.substr(document.URL.indexOf("?") + 1))

var periodTimes = [];
var periodTitles = [];
var periodColors = [];
var periodIcons = [];
const colorDefs = ["rgba(249,65,68,0.333)","rgba(243,114,44,0.333)","rgba(248,150,30,0.333)","rgba(249,199,79,0.333)","rgba(144,190,109,0.333)","rgba(67,170,139,0.333)","rgba(44,119,186,0.333)","rgba(0,0,0,0.333)","rgba(0,0,0,0.1)"];
var nextPeriod = null;
var currentPeriod = null;

var currentDate = new Date;
var msLeft = null;

var htmlTime = document.getElementById("time")
var htmlPeriod = document.getElementById("current-period")
var htmlTitle = document.getElementById("period-title")
var htmlPeriodContainer = document.getElementById("period-container")

var timerHours = null
var timerMinutes = null;
var timerSeconds = null;

//check if params even exist
if (urlParams["pn"] == undefined) {
	error = true
}

//sets periods as local variables
if (error == false) {
	var periodNumber = urlParams["pn"]
	for (var i = 0; i < periodNumber; i++) {
		periodTimes.push(urlParams["p" + i])
    periodTitles.push(atob(urlParams["d" + i]))
  }
} else {
  //below are example times and stuff
	var periodNumber = 16
	periodTimes = ["0727","0824","0830","0927","0933","1030","1045","1051","1151","1157","1254","1324","1330","1427","1433","1530"]
  periodTitles = ["Zero Period","Passing Period 1","First Period","Passing Period 2","Second Period","Brunch","Passing Period 3","Third Period","Passing Period 4","Fourth Period","Lunch","Passing Period 5","Fifth Period","Passing Period 6","Sixth Period","School's Out"]
  periodColors = [0,7,1,7,2,7,7,3,7,4,7,7,5,7,6,8]
  periodIcons = ["0","P","1","P","2","🍟","P","3","P","4","🥪","P","5","P","6","👋"]
  	alert("Welcome to Classtime!")
}

function getHM(p, ad) {
	return Number(periodTimes[p].charAt(0 + ad) + periodTimes[p].charAt(1 + ad))
}

//I GIVE UP ON COMMENTING GOODBYE WORLD

var tomorrow = false

function findNextPeriod() {
	var currentDate = new Date;
	let isItNeg = true
	let period = 0
	while (isItNeg == true) {
		var nextPeriodDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), getHM(period, 0), getHM(period, 2), 0)
		if (Math.abs(nextPeriodDate - currentDate) == nextPeriodDate - currentDate) {
			isItNeg = false
			tomorrow = false
		} else {
			period += 1
			if (period > periodNumber - 1) {
				period = 0
				isItNeg = false
				tomorrow = true
			}
		}

	}
	nextPeriod = period
}

function findCurrentPeriod() {
	currentPeriod = nextPeriod
	if (currentPeriod < 1) {
		currentPeriod = periodNumber
	}
}



setInterval(function() {
	currentDate = new Date;
	findNextPeriod()
	findCurrentPeriod()
	var nextPeriodDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), getHM(nextPeriod, 0), getHM(nextPeriod, 2), 0)
	if (tomorrow == true) {
		nextPeriodDate.setDate(nextPeriodDate.getDate() + 1)
	}
	msLeft = nextPeriodDate - currentDate
	timerHours = Math.floor(msLeft / 1000 / 60 / 60)
	timerMinutes = Math.floor((msLeft / 1000 / 60 / 60 - Math.floor(msLeft / 1000 / 60 / 60)) / (1 + (2 / 3)) * 100)
	timerSeconds = Math.floor((msLeft / 1000 / 60 - Math.floor(msLeft / 1000 / 60)) / (1 + (2 / 3)) * 100)
	timerHours = String(timerHours)
	timerMinutes = String(timerMinutes)
	timerSeconds = String(timerSeconds)
	if (timerSeconds.length == 1) {
		timerSeconds = "0" + timerSeconds
	}
	if (timerHours == "0") {
		timerHours = "";
	} else {
		timerHours = timerHours + ":"
    if (timerMinutes.length == 1) {
      timerMinutes = "0" + timerMinutes
    }
	}
  document.title = periodIcons[currentPeriod-1] + " | " + timerHours + timerMinutes + ":" + timerSeconds
	htmlTime.innerHTML = timerHours + timerMinutes + ":" + timerSeconds
	htmlPeriod.innerHTML = periodIcons[currentPeriod-1]
  htmlTitle.innerHTML = periodTitles[currentPeriod-1]
  htmlPeriodContainer.style.backgroundColor = colorDefs[periodColors[currentPeriod-1]]
}, 1000)

/*
date is current date in ms, stupid is future date in ms

get seconds
Math.floor(((stupid - date)/1000/60 - Math.floor((stupid - date)/1000/60))/(1+(2/3))*100)

get minutes
Math.floor((stupid - date)/1000/60)
*/