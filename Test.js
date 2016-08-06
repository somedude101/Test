Addon = {};

Addon.AddQueue = function()
{
	Addon.Queue = document.createElement('script');
	Addon.Queue.type = 'text/javascript';
	Addon.Queue.setAttribute('src', 'http://aktanusa.github.io/CookieMonster/queue/queue.js');
	document.head.appendChild(Addon.Queue);
}

Addon.AddJscolor = function()
{
	Addon.Jscolor = document.createElement('script');
	Addon.Jscolor.type = 'text/javascript';
	Addon.Jscolor.setAttribute('src', 'http://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(Addon.Jscolor);
}

Addon.Init = function()
{
	Addon.AddQueue();
	Addon.AddJscolor();
}

Addon.colorTextPre = 'CMText';
Addon.colorBackPre = 'CMBack';
Addon.colorBorderPre = 'CMBorder';
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
		div.className = 'title ' + Addon.colorTextPre + Addon.colorRed;
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
		div.className = 'title ' + Addon.colorTextPre + Addon.colorPurple;
		div.textContent = 'Addon Stats';
		return div;
	}
	var stats = document.createElement('div');
	stats.className = 'subsection';
	stats.appendChild(title());
}

Addon.AddMenu = function()
{
	if (Game.onMenu == 'prefs')
		Addon.AddMenuPref();
	else if (Game.onMenu == 'stats')
		Addon.AddMenuStats();
}

Addon.CCMenu = Game.UpdateMenu;
Game.UpdateMenu = function()
{
	Addon.CCMenu();
	Addon.AddMenu();
}

Addon.Init();
