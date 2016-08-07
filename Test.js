Addon = {};

Addon.AddMenu = function()
{
	var str = '';
	if (Game.onMenu == 'prefs')
	{
		str += '<div class="title">Addon</div>'
	}
	l('menu').innerHTML += str;
}
Addon.CCMenu = Game.UpdateMenu;
Game.UpdateMenu = function()
{
	Addon.CCMenu();
	Addon.AddMenu();
}
