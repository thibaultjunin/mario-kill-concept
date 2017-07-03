var amount = 0;
var speed = 0;
var marios = {}
class WaveControler{

    static init(number, fast, delay){
        
        amount = number;
        speed = fast;
        this.spawn(delay);
    }

    static spawn(delay){
        var i = 0;
        while(i < amount){
            console.log(i);
            marios[i] = {
                x: 0,
                y: 0
            }
            this.addMario(i);
            // this.walk();
            // this.sleep(delay);
            i = i +1;
        }
        // for(var i= 0; i < amount; i++){
            
        // }
    }

    static addMario(id){
        var img = document.createElement("img");
        img.src = "mario.gif";
        img.id = "mario_"+id;
        img.className = "mario";
        img.style.position = "absolute";
        img.style.top = "525px";
        img.style.left = "0px";
        img.style.width = "110px";
        document.body.appendChild(img);
    }
 
    static walk(socket, main, el2){
        for(var i in marios){
            var el = document.getElementById("mario_"+i);
            if(el != null){
                el.style.left = parseInt(el.style.left.replace("px", "")) + speed+"px";
                if(main){
                    this.checkPos(parseInt(el.style.left.replace("px", "")), socket, el, i, el2);
                }
            }
        }
    }

    static sleep(ms){
        var waitUntil = new Date().getTime() + ms;
        while(new Date().getTime() < waitUntil) true; 
    }

    static checkPos(posY, socket, el, i, el2){
        if(posY > window.innerWidth){
            el.parentNode.removeChild(el);
            delete marios[i];
            socket.emit('mario kill', {
                game: true,
                id: i
            });
        }else{
            // rectangle 1 -> Mario -> el
            // rectangle 2 -> thwomp -> el2
           if(intersectRect(this.getBounds(el), this.getBounds(el2))){
                el.parentNode.removeChild(el);
                delete marios[i];
                socket.emit('mario kill', {
                    game: false,
                    id: i
                });
            } 
        }
    }

    static intersectRect(r1, r2) {
        return !(r2.left > r1.right || 
                r2.right < r1.left || 
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
    }

    static getBounds(element){
        var top = element.offsetLeft + (element.offsetWidth/2);
        var bottom = top + element.offsetHeight;
        var left = element.offsetTop + (element.offsetHeight/2);
        var right = left + element.offsetWidth;
        return {
            top: top,
            left: left,
            right: right,
            bottom: bottom,
        }
    }

}