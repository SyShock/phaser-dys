/*
*   Dynamically load files 
*
*/



var filesadded=""; //list of files already added, string type


function dynamicLoad(filename, filetype,notifyElementId){
    if (filesadded.indexOf("["+filename+"]")==-1){
        loadFile(filename, filetype);
        filesadded+="["+filename+"]";
        displayError("Success!") ;
    }
    else
        displayError(filename +  " already loaded...") ;
}



function loadFile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
        fileref.setAttribute("id", filename);
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

function dynamicUnload(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" ;
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" 
    var allsuspects=document.getElementsByTagName(targetelement);
    for (var i=allsuspects.length; i>=0; i--){ 
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
            allsuspects[i].parentNode.removeChild(allsuspects[i]) ;
            filesadded = filesadded.replace(filename, ""); 
            displayError("Successfully unloaded.") ;
        }
    }
}


var i = 0;
var notificationResetTimer = 0;



function displayError(msg, newInstance){


        var newSpawn = document.createElement("div"); 
        var text = document.createTextNode(msg); 
        newSpawn.id = "notify"; 
        newSpawn.appendChild(text);                                          
        document.body.appendChild(newSpawn);
    //}
    newSpawn.style.display= "block";
    newSpawn.style.opacity = 0.7;
    newSpawn.style.top = i * 3 + "%";
    i++;

    setTimeout(function(){
       var timer = setInterval(function(){
        newSpawn.style.opacity -= 0.05;
        if (newSpawn.style.opacity <= 0){
            document.body.removeChild(newSpawn); 
            clearInterval(timer);
        }
    },10);

   },3000);

    if (!notificationResetTimer){
        notificationResetTimer =
        setTimeout(function(){
            i=0;
            notificationResetTimer = 0;
        },10000);
    }
}
