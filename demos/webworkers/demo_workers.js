var i=0;

timedCount();
function timedCount()
{
    i=i+1;
    
    sleep(3000);
    
    postMessage(i);
    setTimeout("timedCount()",500);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}