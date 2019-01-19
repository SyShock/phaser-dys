var currentMenu = "menu";
function displayOptions(menuId){
	var duration = 250;
	var outDoc = document.getElementById(currentMenu);
	var inDoc = document.getElementById(menuId);

	var opacity;

	if(outDoc){
		fadeOut(outDoc);
	}
	else{
		fadeIn(inDoc);
	}

	currentMenu = menuId;


	function fadeOut(doc)
	{
		opacity = 1;
		var fadeOutInterval = setInterval(function(){
			outDoc.style.opacity = opacity;
			outDoc.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
					opacity -= 0.2;
					if (opacity <= 0){
						outDoc.style.display = "none";
						if(inDoc){
							fadeIn(inDoc);
						}
						clearInterval(fadeOutInterval);

					}
					},10);
			}


			function fadeIn(doc){
				opacity = 0;
				doc.style.display = "block";
				doc.style.opacity = 0;
				var fadeInInterval = setInterval(function(){
					doc.style.opacity = opacity;
					doc.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
							opacity += 0.2;
							if (opacity >= 1){
								clearInterval(fadeInInterval);
							}
							},10);
					}
					}





					function showHelp() {
						displayOptions("menuHelp");

						var canvas = document.getElementById("menuHelp");
						canvas.onclick = function(){
							displayOptions("menu");
							canvas.onclick = null;
						};
					}




