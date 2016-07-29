Game.UpdateMenu=function()
		{
			if (Game.onMenu=='prefs')
			{
				Game.WriteButton('test', 'test', 'on', 'off', 'Game.ToggleFancy();')+'<label>(visual improvements; disabling may improve performance)</label><br>'+
			}
		}
