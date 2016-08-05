Addon = {};

Addon.colorTextPre = 'Text';
Addon.colorBackPre = 'Back';
Addon.colorBorderPre = 'Border';
Addon.colorBlue = 'Blue';
Addon.colorGreen = 'Green';
Addon.colorYellow = 'Yellow';
Addon.colorOrange = 'Orange';
Addon.colorRed = 'Red';
Addon.colorPurple = 'Purple';
Addon.colorGray = 'Gray';
Addon.colorPink = 'Pink';
Addon.colorBrown = 'Brown';

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