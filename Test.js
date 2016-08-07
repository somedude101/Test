Addon = {};

Addon.AddMenu = function()
{
	var str = '';
	if (Game.onMenu == 'prefs')
	{
		str += '<div class="subsection">'+
		'<div class="title">Addon</div>'+
		'<div style="padding-bottom:128px;"></div>';
	}
	l('menu').innerHTML += str;
}
Addon.CCMenu = Game.UpdateMenu;
Game.UpdateMenu = function()
{
	Addon.CCMenu();
	Addon.AddMenu();
}
