var socket = io('http://localhost:3000');
var who;
var started = false;
var amount = 1;
var speed = 1;
var delay = 1;

var points = 0;
var life = 10;

var wave = 1;
var waveD = 0;

$(document).ready(function(){

    who = document.getElementById('game').dataset.playing;

    updatePoints();

    if(who === "thwomp"){
        var div = document.createElement("div");
        div.className = "play";
        document.body.appendChild(div);

        div.onclick = function(){
            socket.emit('start');
            started = true;
            socket.emit('new wave', {
                amount: amount,
                speed: speed,
                delay: delay
            });
            WaveControler.init(amount, speed, delay);
            $( ".play" ).hide();
        }

    }else{

        var div = document.createElement("div");
        div.className = "waiting";
        document.body.appendChild(div);

        socket.on('start', function(data){
            started = true;
            $( ".waiting" ).hide();
        });

    }   

});

$(document).keypress(function(event) {
    if ( event.which == 32 ) {
        if(who == "thwomp"){
            if(started){
                socket.emit('thwomp move');
                thwomp_move();
            }
        }
    }
});

function sleep(ms){
    var waitUntil = new Date().getTime() + ms; 
    while(new Date().getTime() < waitUntil) true;
}

socket.on('thwomp move', function(data){
    thwomp_move();
}); 

socket.on('new wave', function(data){
    WaveControler.init(data.amount, data.speed, data.delay);
});

socket.on('points', function(data){
    console.log(data)
    points = data.points;
    life = data.life;  
    updatePoints();
    if(life <= 0){
        socket.emit('game end');
        alert("END"); 
    }
    if(wave == 1){
        newWave();
        wave = wave +1;
    }else{
        if(waveD == amount){
            waveD = 0;
            wave = wave +1;
            newWave();
        }else{
            waveD = waveD +1;
        }
    }
    
});

socket.on('game end', function(data){
    //data.points
    alert("END");
});

function thwomp_move(){
    var el = document.getElementById("thwomp");
    el.className = "thwomp thwomp_anim";
    setTimeout(function(){ el.className = "thwomp"; }, 6000);
    // for(var i = 70; i < 390; i++){
    //     el.style.top = i+"px";
    //     sleep(20);
    // }
}
 
window.setInterval(function(){
    if(started){
        WaveControler.walk(socket, (who === "thwomp"), document.getElementById("thwomp"));        
    }
}, 20);

function updatePoints(){
    document.getElementById("points").innerHTML = points;
    document.getElementById("life").innerHTML = life;
}

socket.on('remove mario', function(data){
    removeMario(data.id);
});

function removeMario(id){
    var el = document.getElementById("mario_"+id);
    el.parentNode.removeChild(el);
    if(marios[i] != null){
        delete marios[i];
    }
}

function newWave(){
    amount = amount+1;
    speed = speed+1;
    delay = delay;
    socket.emit('new wave', {
        amount: amount,
        speed: speed,
        delay: delay
    });
    // \/ Useless \/
    // WaveControler.init(amount, speed, delay);
}

function intersectRect(r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}