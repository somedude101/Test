Addon = {};

Addon.AddMenu = function()
{
	var str2 = '';
	if (Game.onMenu == 'prefs')
	{
		str2 += '<div class="subsection">'+
		'<div class="title">Addon</div>'+
		'<div style="padding-bottom:128px;"></div>'
	}
	l('menu').innerHTML = str2;
}
Addon.CCMenu = Game.UpdateMenu;
Game.UpdateMenu = function()
{
	Addon.CCMenu();
	Addon.AddMenu();
}
