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
var nextPeriod = null;
var currentPeriod = null;

var currentDate = new Date;
var msLeft = null;

var htmlTime = document.getElementById("time")
var htmlPeriod = document.getElementById("current-period")

var timerHours = null
var timerMinutes = null;
var timerSeconds = null;

//check if params even exist
if (urlParams["pn"] == undefined) {
	error = true
	alert("Error in URL! Omg you need to generate again")
}

//sets periods as local variables
if (error == false) {
	var periodNumber = urlParams["pn"]
	for (var i = 0; i < periodNumber; i++) {
		periodTimes.push(urlParams["p" + i])
	}
	//another error prevention thing
	for (var i = 0; i < periodNumber; i++) {

		if (error == false) {
			if (periodTimes[i] == undefined) {
				error = true;
				alert('Error in URL! Omg you need to generate again')
			}
		}
	}
} else {
	var periodNumber = 7
	periodTimes = ["0830", "0933", "1051", "1157", "1330", "1433", "1530"]
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
  document.title = String(currentPeriod) + " | " + timerHours + timerMinutes + ":" + timerSeconds
	htmlTime.innerHTML = timerHours + timerMinutes + ":" + timerSeconds
	htmlPeriod.innerHTML = currentPeriod
}, 1000)

/*
date is current date in ms, stupid is future date in ms

get seconds
Math.floor(((stupid - date)/1000/60 - Math.floor((stupid - date)/1000/60))/(1+(2/3))*100)

get minutes
Math.floor((stupid - date)/1000/60)
*/