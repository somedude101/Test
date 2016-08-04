Addon.AddMenu = function()
{
  var title = function()
  {
		var div = document.createElement('div');
		div.className = 'title ' + Addon.colorTextPre + Addon.colorBlue;
		div.textContent = 'Addon Options';
		return div;
	}
	if (Game.onMenu == 'prefs')
		Addon.AddMenuPref(title);
	else if (Addon.Stats == 1 && Game.onMenu == 'stats')
		Addon.AddMenuStats(title);
}

Addon.RefreshMenu = function()
{
	if (Game.onMenu == 'stats')
	  Game.UpdateMenu();
}
