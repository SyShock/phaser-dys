   // create our virtual game controller buttons 
   function virtualButtons() {




    buttonjump = game.add.button(600, 500, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    buttonjump.fixedToCamera = true;  //our buttons should stay on the same place  
    buttonjump.events.onInputOver.add(function(){jump=true;});
    buttonjump.events.onInputOut.add(function(){jump=false;});
    buttonjump.events.onInputDown.add(function(){jump=true;});
    buttonjump.events.onInputUp.add(function(){jump=false;});

    buttonfire = game.add.button(700, 500, 'buttonfire', null, this, 0, 1, 0, 1);
    buttonfire.fixedToCamera = true;
    buttonfire.events.onInputOver.add(function(){});
    buttonfire.events.onInputOut.add(function(){playerStats.grappleMode=true;});
    buttonfire.events.onInputDown.add(function(){});
    buttonfire.events.onInputUp.add(function(){playerStats.grappleMode=true;});        

    buttonleft = game.add.button(0, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){playerStats.left=true;});
    buttonleft.events.onInputOut.add(function(){playerStats.left=false;});
    buttonleft.events.onInputDown.add(function(){playerStats.left=true;});
    buttonleft.events.onInputUp.add(function(){playerStats.left=false;});

    buttonbottomleft = game.add.button(32, 536, 'buttondiagonal', null, this, 6, 4, 6, 4);
    buttonbottomleft.fixedToCamera = true;
    buttonbottomleft.events.onInputOver.add(function(){left=true;duck=true;});
    buttonbottomleft.events.onInputOut.add(function(){left=false;duck=false;});
    buttonbottomleft.events.onInputDown.add(function(){left=true;duck=true;});
    buttonbottomleft.events.onInputUp.add(function(){left=false;duck=false;});

    buttonright = game.add.button(160, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){playerStats.right=true;});
    buttonright.events.onInputOut.add(function(){playerStats.right=false;});
    buttonright.events.onInputDown.add(function(){playerStats.right=true;});
    buttonright.events.onInputUp.add(function(){playerStats.right=false;});

    buttonbottomright = game.add.button(160, 536, 'buttondiagonal', null, this, 7, 5, 7, 5);
    buttonbottomright.fixedToCamera = true;
    buttonbottomright.events.onInputOver.add(function(){right=true;duck=true;});
    buttonbottomright.events.onInputOut.add(function(){right=false;duck=false;});
    buttonbottomright.events.onInputDown.add(function(){right=true;duck=true;});
    buttonbottomright.events.onInputUp.add(function(){right=false;duck=false;});

    buttondown = game.add.button(96, 536, 'buttonvertical', null, this, 0, 1, 0, 1);
    buttondown.fixedToCamera = true;
    buttondown.events.onInputOver.add(function(){cancelGrapple();});
    buttondown.events.onInputOut.add(function(){});
    buttondown.events.onInputDown.add(function(){cancelGrapple();});
    buttondown.events.onInputUp.add(function(){});
}