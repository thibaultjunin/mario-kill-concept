var io = require('socket.io')();

var life = 10;
var points = 0;
var started = false;

io.on('connection', function(client){

    client.on('thwomp move', function(data){
        client.broadcast.emit('thwomp move');
    });

    client.on('start', function(data){
        client.broadcast.emit('start');
    });

    client.on('pirana position', function(data){
        client.broadcast.emit('pirana position', {
            x: data.x,
            y: data.y
        });
    });

    client.on('cannon position', function(data){
        client.broadcast.emit('cannon position', {
            x: data.x,
            y: data.y
        });
    });

    client.on('game end', function(data){
        client.broadcast.emit('game end', {
            points: points
        });
        points = 0;
        life = 10;
        started = false;
    });

    client.on('new wave', function(data){
        client.broadcast.emit('new wave', {
            amount: data.amount,
            speed: data.speed,
            delay: data.delay
        });
    });

    client.on('mario kill', function(data){
        console.log(data);
        if(data.game){
            life = life - 1;
        }else{
            points = points + 1;
        }
        io.sockets.emit('points', {
            life: life,
            points: points, 
        });
        client.broadcast.emit('remove mario', {
            id: data.id+""
        })
    });

    client.on('disconnect', function(){

    });

});

io.listen(3000);