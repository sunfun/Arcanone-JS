/**
 * Created by dwliv on 21.01.2016.
 */

(function(w){
    w.arcgame=null;
    w.qqadres=window.location.search.replace('?arcid=','').toString();
})(window);
var arcanone=function(apikey,contr){
    this.server='ws://arcserver.elasticbeanstalk.com';
    this.conn=false;
    this.contr=contr;
    this.apikey=apikey;
    var ws=new WebSocket(this.server);
    (function(callback){
        ws.onmessage=function(message){
            var event=JSON.parse(message.data);
            callback(event);
        };

    }(function(answer){
        this.arcgame.online=answer.gameonline;
          switch (answer.type) {
            case 'initstr':
                if(!this.arcgame.contr) {
                    this.arcgame.initmessage = answer;
                    this.arcgame.oninit(answer);
                }
                break;
            case 'move':
                if(!this.arcgame.contr) {
                    this.arcgame.movemessage = answer;
                    this.arcgame.onmove(answer);
                }
                break;
            case 'initcontroller':
                if(!this.arcgame.contr) {
                    this.arcgame.controllermessage = answer;
                    this.arcgame.oninitcontr(answer);
                }
                break;
        }
    }));

    (function(apikey,contr){
        waitForSocketConnection(ws, function () {
            if(!contr) {
                ws.send(JSON.stringify({
                    type: 'init',
                    gameid: apikey
                }));

            }else
            {
                this.contrid=randstr(6);
                ws.send (JSON.stringify ({
                    type: 'initcontroller',
                    str:window.qqadres,
                    pos:0,
                    id:this.contrid
                }));
            }

            this.arcgame.conn=true;
        });
    }(this.apikey,this.contr));
    this.initmessage=null;
    this.movemessage=null;
    this.online=null;
    this.controllermessage=null;
    this.move=function(callback){
        this.onmove=callback;
    }
    //this.oninit=function(){};
    this.init=function(callback){
        this.oninit=callback;
    }
    this.addcontroll=function(callback){
        this.oninitcontr=callback;
    }
    this.controllersend=function(x,y,color,size,action){
        ws.send(JSON.stringify({
            type:'controller',
            str:window.qqadres,
            id:this.contrid,
            posx:x,
            posy:y,
            color:color,
            size:size,
            action:action
        }));
    }

};
function randstr(n){  // [ 3 ] random words and digits by the wocabulary
    var s ='', abd ='abcdefghijklmnopqrstuvwxyz0123456789', aL = abd.length;
    while(s.length < n)
        s += abd[Math.random() * aL|0];
    return s;
}
function waitForSocketConnection(socket, callback) {
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("conn=1")
                if (callback != null) {
                    callback();
                }
                return;
            } else {
                console.log("conn=0")
                waitForSocketConnection(socket, callback);
            }
        }, 5); // wait 5 milisecond for the connection...
}