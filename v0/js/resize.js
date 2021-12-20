const time = document.getElementById('time')
const period = document.getElementsByClassName('period')

setInterval(function(){
if(window.innerWidth < 500) {
  time.style.fontSize = "17vw"
  for (var i = 0; i < period.length; i++) {
    period[i].fontSize = "4vw"
  }
} else {
  time.style.fontSize = "15vh"
  for (var i = 0; i < period.length; i++) {
    period[i].fontSize = "4vh"
  }
}
},10)