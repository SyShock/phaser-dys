/*
*   Dynamically load files 
*
*/



var filesadded="" //list of files already added, string type


function dynamicLoad(filename, filetype,notifyElementId){
    if (filesadded.indexOf("["+filename+"]")==-1){  //indexOf selects specific key in list
        loadFile(filename, filetype)
        filesadded+="["+filename+"]" //List of files added in the form "[filename1],[filename2],etc"
        displayError("Success!") 
    }
    else
        //alert(notifyElementId)
    displayError(filename +  " already loaded...") 
}



function loadFile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}









/*
*
*   Display message

    instance number
    instance remove
    unless refreshed

    fadeout unless hovered on
    fadeout on click
*
*/




var i = 0;
var notificationResetTimer = 0;



function displayError(msg, newInstance){

    //if (!newInstance){    

        let newSpawn = document.createElement("div"); 
        let text = document.createTextNode(msg); 
        newSpawn.id = "notify"; 
        newSpawn.appendChild(text);                                          
        document.body.appendChild(newSpawn);
    //}
         newSpawn.style.display= "block"
         newSpawn.style.opacity = 0.7;
         newSpawn.style.top = i * 3 + "%";
         i++;

        // setTimeout(function(){
        //     timer[1] = setInterval(function(){
        //         newSpawn.style.opacity = newSpawn.style.opacity + 0.005;
        //         if (newSpawn.style.opacity >= 0.7){
        //             clearInterval(timer[1]);
        //         }},10);
        //         i++;
        //         //alert(newSpawn.style.opacity);
        // },100);

        setTimeout(function(){
             let timer = setInterval(function(){
                newSpawn.style.opacity -= 0.005;
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
