Addon.AddMenuPref = function()
{
	var title = function()
	{
		var div = document.createElement('div');
		div.className = 'title ' + Addon.colorTextPre + Addon.colorBlue;
		div.textContent = 'Addon Options';
		return div;
	}
	var frag = document.createDocumentFragment();
	frag.appendChild(title());
}
Addon.AddMenuStats = function()
{
	var title = function()
	{
		var div = document.createElement('div');
		div.className = 'title ' + Addon.colorTextPre + Addon.colorRed;
		div.textContent = 'Addon Stats';
		return div;
	}
	var frag = document.createDocumentFragment();
	frag.appendChild(title());
}
Addon.AddMenu = function()
{
	if (Game.onMenu == 'prefs')
		Addon.AddMenuPref();
	else if (Game.onMenu == 'stats')
		Addon.AddMenuStats();
}
Addon.AddCCMenu = Game.UpdateMenu;
Game.UpdateMenu = function()
{
	Addon.AddCCMenu();
	Addon.AddMenu();
}
