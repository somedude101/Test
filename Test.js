/**********
 * Header *
 **********/

Addon = {};

Addon.Backup = {};

Addon.Cache = {};

Addon.Config = {};

Addon.ConfigData = {};

Addon.Data = {};

Addon.Disp = {};

Addon.Sim = {};

/*********
 * Cache *
 *********/
 
Addon.AddQueue = function() {
	Addon.Queue = document.createElement('script');
	Addon.Queue.type = 'text/javascript';
	Addon.Queue.setAttribute('src', 'http://aktanusa.github.io/CookieMonster/queue/queue.js');
	document.head.appendChild(Addon.Queue);
}

Addon.NextNumber = function(base) {
	var count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
	while (base == base + count) {
		count = Addon.NextNumber(count);
	}
	return (base + count);
}

Addon.RemakeBuildingsPrices = function() {
	for (var i in Game.Objects) {
		Addon.Objects10[i].price = Addon.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 10);
		Addon.Objects100[i].price = Addon.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 100);
	}
}

Addon.RemakeIncome = function() {
	// Simulate Building Buys for 1 amount
	Addon.BuyBuildings(1, 'Objects');

	// Simulate Upgrade Buys
	Addon.BuyUpgrades();
	
	// Simulate Building Buys for 10 amount
	Addon.BuyBuildings(10, 'Objects10');
	
	// Simulate Building Buys for 100 amount
	Addon.BuyBuildings(100, 'Objects100');
}

Addon.RemakeWrinkBank = function() {
	var totalSucked = 0;
	for (var i in Game.wrinklers) {
		var sucked = Game.wrinklers[i].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[i].type==1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		totalSucked += sucked;
	}
	Addon.WrinkBank = totalSucked;
}

Addon.RemakeBuildingsPP = function() {
	Addon.min = -1;
	Addon.max = -1;
	Addon.mid = -1;
	for (var i in Addon.Objects) {
		//Addon.Objects[i].pp = Game.Objects[i].getPrice() / Addon.Objects[i].bonus;
		Addon.Objects[i].pp = (Math.max(Game.Objects[i].getPrice() - (Game.cookies + Addon.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / Addon.Objects[i].bonus);
		if (Addon.min == -1 || Addon.Objects[i].pp < Addon.min) Addon.min = Addon.Objects[i].pp;
		if (Addon.max == -1 || Addon.Objects[i].pp > Addon.max) Addon.max = Addon.Objects[i].pp;
	}
	Addon.mid = ((Addon.max - Addon.min) / 2) + Addon.min;
	for (var i in Addon.Objects) {
		var color = '';
		if (Addon.Objects[i].pp == Addon.min) color = Addon.colorGreen;
		else if (Addon.Objects[i].pp == Addon.max) color = Addon.colorRed;
		else if (Addon.Objects[i].pp > Addon.mid) color = Addon.colorOrange;
		else color = Addon.colorYellow;
		Addon.Objects[i].color = color;
	}
}

Addon.RemakeUpgradePP = function() {
	for (var i in Addon.Upgrades) {
		//Addon.Upgrades[i].pp = Game.Upgrades[i].getPrice() / Addon.Upgrades[i].bonus;
		Addon.Upgrades[i].pp = (Math.max(Game.Upgrades[i].getPrice() - (Game.cookies + Addon.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Upgrades[i].getPrice() / Addon.Upgrades[i].bonus);
		if (isNaN(Addon.Upgrades[i].pp)) Addon.Upgrades[i].pp = 'Infinity';
		var color = '';
		if (Addon.Upgrades[i].pp <= 0 || Addon.Upgrades[i].pp == 'Infinity') color = Addon.colorGray;
		else if (Addon.Upgrades[i].pp < Addon.min) color = Addon.colorBlue;
		else if (Addon.Upgrades[i].pp == Addon.min) color = Addon.colorGreen;
		else if (Addon.Upgrades[i].pp == Addon.max) color = Addon.colorRed;
		else if (Addon.Upgrades[i].pp > Addon.max) color = Addon.colorPurple;
		else if (Addon.Upgrades[i].pp > Addon.mid) color = Addon.colorOrange;
		else color = Addon.colorYellow;
		Addon.Upgrades[i].color = color;
	}
}

Addon.RemakeBuildingsOtherPP = function(amount, target) {
	for (var i in Addon.Cache[target]) {
		//Addon.Cache[target][i].pp = Addon.Cache[target][i].price / Addon.Cache[target][i].bonus;
		Addon.Cache[target][i].pp = (Math.max(Addon.Cache[target][i].price - (Game.cookies + Addon.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Addon.Cache[target][i].price / Addon.Cache[target][i].bonus);
		var color = '';
		if (Addon.Cache[target][i].pp <= 0 || Addon.Cache[target][i].pp == 'Infinity') color = Addon.colorGray;
		else if (Addon.Cache[target][i].pp < Addon.min) color = Addon.colorBlue;
		else if (Addon.Cache[target][i].pp == Addon.min) color = Addon.colorGreen;
		else if (Addon.Cache[target][i].pp == Addon.max) color = Addon.colorRed;
		else if (Addon.Cache[target][i].pp > Addon.max) color = Addon.colorPurple;
		else if (Addon.Cache[target][i].pp > Addon.mid) color = Addon.colorOrange;
		else color = Addon.colorYellow;
		Addon.Cache[target][i].color = color;
	}
}

Addon.RemakePP = function() {
	// Buildings for 1 amount
	Addon.RemakeBuildingsPP();
	
	// Upgrades
	Addon.RemakeUpgradePP();
	
	// Buildings for 10 amount
	Addon.RemakeBuildingsOtherPP(10, 'Objects10');

	// Buildings for 100 amount
	Addon.RemakeBuildingsOtherPP(100, 'Objects100');	
}

Addon.RemakeLucky = function() {
	Addon.Lucky = (Addon.NoGoldSwitchCookiesPS * 60 * 15) / 0.15;
	Addon.Lucky /= Addon.getCPSBuffMult();
	Addon.LuckyReward = (Addon.Lucky * 0.15) + 13;
	Addon.LuckyFrenzy = Addon.Lucky * 7;
	Addon.LuckyRewardFrenzy = (Addon.LuckyFrenzy * 0.15) + 13;
}

Addon.MaxChainMoni = function(digit, maxPayout) {
	var chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	var moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
	var nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	while (nextMoni < maxPayout) {
		chain++;
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	}
	return moni;
}

Addon.RemakeChain = function() {
	var maxPayout = Addon.NoGoldSwitchCookiesPS * 60 * 60 * 6;
	maxPayout /= Addon.getCPSBuffMult();
	
	Addon.ChainReward = Addon.MaxChainMoni(7, maxPayout);
	
	Addon.ChainWrathReward = Addon.MaxChainMoni(6, maxPayout);
	
	if (maxPayout < Addon.ChainReward) {
		Addon.Chain = 0;
	}
	else {
		Addon.Chain = Addon.NextNumber(Addon.ChainReward) / 0.25;
	}
	if (maxPayout < Addon.ChainWrathReward) {
		Addon.ChainWrath = 0;
	}
	else {
		Addon.ChainWrath = Addon.NextNumber(Addon.ChainWrathReward) / 0.25;
	}
	
	Addon.ChainFrenzyReward = Addon.MaxChainMoni(7, maxPayout * 7);
	
	Addon.ChainFrenzyWrathReward = Addon.MaxChainMoni(6, maxPayout * 7);
	
	if ((maxPayout * 7) < Addon.ChainFrenzyReward) {
		Addon.ChainFrenzy = 0;
	}
	else {
		Addon.ChainFrenzy = Addon.NextNumber(Addon.ChainFrenzyReward) / 0.25;
	}
	if ((maxPayout * 7) < Addon.ChainFrenzyWrathReward) {
		Addon.ChainFrenzyWrath = 0;
	}
	else {
		Addon.ChainFrenzyWrath = Addon.NextNumber(Addon.ChainFrenzyWrathReward) / 0.25;
	}
}

Addon.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		var val = Game.cookiesPs * 60;
		if (Game.hasBuff('Elder frenzy')) val *= 0.5; // very sorry
		if (Game.hasBuff('Frenzy')) val *= 0.75; // I sincerely apologize		
		Addon.SeaSpec = Math.max(25, val);
		if (Game.Has('Ho ho ho-flavored frosting')) Addon.SeaSpec *= 2;
	}
}

Addon.RemakeSellForChoEgg = function() {
	if (Game.hasAura('Earth Shatterer') || Game.dragonLevel < 9) {
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			sellTotal += Addon.BuildingSell(me.basePrice, me.amount, me.free, me.amount, 0);
		}
	}
	else {
		var highestBuilding = '';
		for (var i in Game.Objects) {
			if (Game.Objects[i].amount > 0) highestBuilding = i;
		}
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			var amount = 0;
			if (i == highestBuilding) {
				amount = me.amount - 1;
			}
			else {
				amount = me.amount;
			}
			sellTotal += Addon.BuildingSell(me.basePrice, amount, me.free, amount, 1);
		}
	}
	Addon.SellForChoEgg = sellTotal;
}

Addon.InitCookiesDiff = function() {
	Addon.CookiesDiff = new Queue();
	Addon.WrinkDiff = new Queue();
	Addon.ChoEggDiff = new Queue();
	Addon.ClicksDiff = new Queue();
}

Addon.UpdateAvgCPS = function() {
	var currDate = Math.floor(Date.now() / 1000);
	if (Addon.lastDate != currDate) {	
		var choEggTotal = Game.cookies + Addon.SellForChoEgg;
		if (Game.cpsSucked > 0) {
			choEggTotal += Addon.WrinkBank;
		}
		choEggTotal *= 0.05;

		if (Addon.lastDate != -1) {
			var timeDiff = currDate - Addon.lastDate
			var bankDiffAvg = Math.max(0, (Game.cookies - Addon.lastCookies)) / timeDiff;
			var wrinkDiffAvg = (Addon.WrinkBank - Addon.lastWrinkCookies) / timeDiff;
			var choEggDiffAvg = Math.max(0,(choEggTotal - Addon.lastChoEgg)) / timeDiff;
			var clicksDiffAvg = (Game.cookieClicks - Addon.lastClicks) / timeDiff;
			for (var i = 0; i < timeDiff; i++) {
				Addon.CookiesDiff.enqueue(bankDiffAvg);
				Addon.WrinkDiff.enqueue(wrinkDiffAvg);
				Addon.ChoEggDiff.enqueue(choEggDiffAvg);
				Addon.ClicksDiff.enqueue(clicksDiffAvg);		
			}
			// Assumes the queues are the same length
			while (Addon.CookiesDiff.getLength() > 1800) {
				Addon.CookiesDiff.dequeue();
				Addon.WrinkDiff.dequeue();
				Addon.ClicksDiff.dequeue();
			}
			
			while (Addon.ClicksDiff.getLength() > 30) {
				Addon.ClicksDiff.dequeue();
			}
		}
		Addon.lastDate = currDate;
		Addon.lastCookies = Game.cookies;
		Addon.lastWrinkCookies = Addon.WrinkBank;
		Addon.lastChoEgg = choEggTotal;
		Addon.lastClicks = Game.cookieClicks;
		
		var totalGainBank = 0;
		var totalGainWrink = 0;
		var totalGainChoEgg = 0;
		var cpsLength = Math.min(Addon.CookiesDiff.getLength(), Addon.times[Addon.AvgCPSHist] * 60);
		// Assumes the queues are the same length 
		for (var i = Addon.CookiesDiff.getLength() - cpsLength; i < Addon.CookiesDiff.getLength(); i++) {
			totalGainBank += Addon.CookiesDiff.get(i);
			totalGainWrink += Addon.WrinkDiff.get(i);
			totalGainChoEgg += Addon.ChoEggDiff.get(i);
		}
		Addon.AvgCPS = (totalGainBank + (Addon.CalcWrink ? totalGainWrink : 0)) / cpsLength;
		
		if ((Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg')) || Addon.CalcWrink == 0) {
			Addon.AvgCPSChoEgg = (totalGainBank + totalGainWrink + totalGainChoEgg) / cpsLength;
		}
		else {
			Addon.AvgCPSChoEgg = Addon.AvgCPS;
		}

		var totalClicks = 0;
		var clicksLength = Math.min(Addon.ClicksDiff.getLength(), Addon.times[Addon.AvgClicksHist]);
		for (var i = Addon.ClicksDiff.getLength() - clicksLength; i < Addon.ClicksDiff.getLength(); i++) {
			totalClicks += Addon.ClicksDiff.get(i);
		}
		Addon.AvgClicks = totalClicks / clicksLength;
	}
}

Addon.min = -1;
Addon.max = -1;
Addon.mid = -1;
Addon.WrinkBank = -1;
Addon.NoGoldSwitchCookiesPS = 0;
Addon.Lucky = 0;
Addon.LuckyReward = 0;
Addon.LuckyFrenzy = 0;
Addon.LuckyRewardFrenzy = 0;
Addon.SeaSpec = 0;
Addon.Chain = 0;
Addon.ChainWrath = 0;
Addon.ChainReward = 0;
Addon.ChainWrathReward = 0;
Addon.ChainFrenzy = 0;
Addon.ChainFrenzyWrath = 0;
Addon.ChainFrenzyReward = 0;
Addon.ChainFrenzyWrathReward = 0;
Addon.CentEgg = 0;
Addon.SellForChoEgg = 0;
Addon.Title = '';
Addon.HadFierHoard = false;
Addon.lastDate = -1;
Addon.lastCookies = -1;
Addon.lastWrinkCookies = -1;
Addon.lastChoEgg = -1;
Addon.lastClicks = -1;
Addon.CookiesDiff;
Addon.WrinkDiff;
Addon.ChoEggDiff;
Addon.ClicksDiff;
Addon.AvgCPS = -1;
Addon.AvgCPSChoEgg = -1;
Addon.AvgClicks = -1;

/**********
 * Config *
 **********/

Addon.SaveConfig = function(config) {
	localStorage.setItem(Addon.ConfigPrefix, JSON.stringify(config));
}

Addon.LoadConfig = function() {
	if (localStorage.getItem(Addon.ConfigPrefix) != null) {
		Addon.Config = JSON.parse(localStorage.getItem(Addon.ConfigPrefix));
		
		// Check values
		var mod = false;
		for (var i in Addon.ConfigDefault) {
			if (typeof Addon.Config[i] === 'undefined') {
				mod = true;
				Addon.Config[i] = Addon.ConfigDefault[i];
			}
			else if (i != 'StatsPref' && i != 'Colors') {
				if (i.indexOf('SoundURL') == -1) {
					if (!(Addon.Config[i] > -1 && Addon.Config[i] < Addon.ConfigData[i].label.length)) {
						mod = true;
						Addon.Config[i] = Addon.ConfigDefault[i];
					}
				}
				else {  // Sound URLs
					if (typeof Addon.Config[i] != 'string') {
						mod = true;
						Addon.Config[i] = Addon.ConfigDefault[i];
					}
				}
			}
			else if (i == 'StatsPref') {
				for (var j in Addon.ConfigDefault.StatsPref) {
					if (typeof Addon.Config[i][j] === 'undefined' || !(Addon.Config[i][j] > -1 && Addon.Config[i][j] < 2)) {
						mod = true;
						Addon.Config[i][j] = Addon.ConfigDefault[i][j];
					}
				}
			}
			else { // Colors
				for (var j in Addon.ConfigDefault.Colors) {
					if (typeof Addon.Config[i][j] === 'undefined' || typeof Addon.Config[i][j] != 'string') {
						mod = true;
						Addon.Config[i][j] = Addon.ConfigDefault[i][j];
					}
				}
			}
		}
		if (mod) Addon.SaveConfig(Addon.Config);
		Addon.Loop(); // Do loop once
		for (var i in Addon.ConfigDefault) {
			if (i != 'StatsPref' && typeof Addon.ConfigData[i].func !== 'undefined') {
				Addon.ConfigData[i].func();
			}
		}
	}
	else { // Default values		
		Addon.RestoreDefault();	
	}
}

Addon.RestoreDefault = function() {
	Addon.Config = {};
	Addon.SaveConfig(Addon.ConfigDefault);
	Addon.LoadConfig();
	Game.UpdateMenu();
}

Addon.ToggleConfig = function(config) {
	Addon.ToggleConfigUp(config);
	if (Addon.ConfigData[config].toggle) {
		if (Addon.Config[config] == 0) {
			l(Addon.ConfigPrefix + config).className = 'option off';
		}
		else {
			l(Addon.ConfigPrefix + config).className = 'option';
		}
	}
}

Addon.ToggleConfigUp = function(config) {
	Addon.Config[config]++;
	if (Addon.Config[config] == Addon.ConfigData[config].label.length) {
		Addon.Config[config] = 0;
	}
	if (typeof Addon.ConfigData[config].func !== 'undefined') {
		Addon.ConfigData[config].func();
	}
	l(Addon.ConfigPrefix + config).innerHTML = Addon.GetConfigDisplay(config);
	Addon.SaveConfig(Addon.Config);
}

Addon.ToggleConfigDown = function(config) {
	Addon.Config[config]--;
	if (Addon.Config[config] < 0) {
		Addon.Config[config] = Addon.ConfigData[config].label.length - 1;
	}
	if (typeof Addon.ConfigData[config].func !== 'undefined') {
		Addon.ConfigData[config].func();
	}
	l(Addon.ConfigPrefix + config).innerHTML = Addon.GetConfigDisplay(config);
	Addon.SaveConfig(Addon.Config);
}

Addon.ToggleStatsConfig = function(config) {
	if (Addon.StatsPref[config] == 0) {
		Addon.StatsPref[config]++;
	}
	else {
		Addon.StatsPref[config]--;
	}
	Addon.SaveConfig(Addon.Config);
}

Addon.BotBar = {label: ['Bottom Bar OFF', 'Bottom Bar ON'], desc: 'Building Information', toggle: true, func: function() {Addon.ToggleBotBar();}};
Addon.TimerBar = {label: ['Timer Bar OFF', 'Timer Bar ON'], desc: 'Timers of Golden Cookie, Season Popup, Frenzy (Normal, Clot, Elder), Click Frenzy', toggle: true, func: function() {Addon.ToggleTimerBar();}};
Addon.TimerBarPos = {label: ['Timer Bar Position (Top Left)', 'Timer Bar Position (Bottom)'], desc: 'Placement of the Timer Bar', toggle: false, func: function() {Addon.ToggleTimerBarPos();}};
Addon.BuildColor = {label: ['Building Colors OFF', 'Building Colors ON'], desc: 'Color code buildings', toggle: true, func: function() {Addon.UpdateBuildings();}};
Addon.BulkBuildColor = {label: ['Bulk Building Colors (Single Buildings Color)', 'Bulk Building Colors (Calculated Color)'], desc: 'Color code bulk buildings based on single buildings color or calculated bulk value color', toggle: false, func: function() {Addon.UpdateBuildings();}};
Addon.UpBarColor = {label: ['Upgrade Bar/Colors OFF', 'Upgrade Bar/Colors ON'], desc: 'Color code upgrades and add a counter', toggle: true, func: function() {Addon.ToggleUpBarColor();}};
Addon.Colors = {desc: {Blue: 'Color Blue.  Used to show better than best PP building, for Click Frenzy bar, and for various labels', Green: 'Color Green.  Used to show best PP building, for Blood Frenzy bar, and for various labels', Yellow: 'Color Yellow.  Used to show between best and worst PP buildings closer to best, for Frenzy bar, and for various labels', Orange: 'Color Orange.  Used to show between best and worst PP buildings closer to worst, for Next Reindeer bar, and for various labels', Red: 'Color Red.  Used to show worst PP building, for Clot bar, and for various labels', Purple: 'Color Purple.  Used to show worse than worst PP building, for Next Cookie bar, and for various labels', Gray: 'Color Gray.  Used to show negative or infinity PP, and for Next Cookie/Next Reindeer bar', Pink: 'Color Pink.  Used for Dragonflight bar', Brown: 'Color Brown.  Used for Dragon Harvest bar'}, func: function() {Addon.UpdateColors();}};
Addon.CalcWrink = {label: ['Calculate with Wrinklers OFF', 'Calculate with Wrinklers ON'], desc: 'Calculate times and average Cookies Per Second with Wrinkers', toggle: true};
Addon.CPSMode = {label: ['Current Cookies Per Second', 'Average Cookies Per Second'], desc: 'Calculate times using current Cookies Per Second or average Cookies Per Second', toggle: false};
Addon.AvgCPSHist = {label: ['Average CPS for past 1m', 'Average CPS for past 5m', 'Average CPS for past 10m', 'Average CPS for past 15m', 'Average CPS for past 30m'], desc: 'How much time average Cookies Per Second should consider', toggle: false};
Addon.AvgClicksHist = {label: ['Average Cookie Clicks for past 1s', 'Average Cookie Clicks for past 5s', 'Average Cookie Clicks for past 10s', 'Average Cookie Clicks for past 15s', 'Average Cookie Clicks for past 30s'], desc: 'How much time average Cookie Clicks should consider', toggle: false};
Addon.ToolWarnCautBon = {label: ['Calculate Tooltip Warning/Caution With Bonus CPS OFF', 'Calculate Tooltip Warning/Caution With Bonus CPS ON'], desc: 'Calculate the warning/caution with or without the bonus CPS you get from buying', toggle: true};
Addon.Flash = {label: ['Flash OFF', 'Flash ON'], desc: 'Flash screen on Golden Cookie/Season Popup', toggle: true};
Addon.Sound = {label: ['Sounds OFF', 'Sounds ON'], desc: 'Play a sound on Golden Cookie/Season Popup', toggle: true};
Addon.Volume = {label: [], desc: 'Volume of the sound'};
for (var i = 0; i < 101; i++) {
	Addon.Volume.label[i] = i + '%';
}
Addon.GCSoundURL = {label: 'Golden Cookie Sound URL:', desc: 'URL of the sound to be played when a Golden Cookie spawns'};
Addon.SeaSoundURL = {label: 'Season Special Sound URL:', desc: 'URL of the sound to be played when a Season Special spawns'};
Addon.GCTimer = {label: ['Golden Cookie Timer OFF', 'Golden Cookie Timer ON'], desc: 'A timer on the Golden Cookie when it has been spawned', toggle: true, func: function() {Addon.ToggleGCTimer();}};
Addon.Title = {label: ['Title OFF', 'Title ON', 'Title Pinned Tab Highlight'], desc: 'Update title with Golden Cookie/Season Popup timers; pinned tab highlight only changes the title when a Golden Cookie/Season Popup spawns', toggle: true};
Addon.Favicon = {label: ['Favicon OFF', 'Favicon ON'], desc: 'Update favicon with Golden/Wrath Cookie', toggle: true, func: function() {Addon.UpdateFavicon();}};
Addon.Tooltip = {label: ['Tooltip Information OFF', 'Tooltip Information ON'], desc: 'Extra information in tooltip for buildings/upgrades', toggle: true};
Addon.TooltipAmor = {label: ['Tooltip Amortization Information OFF', 'Tooltip Amortization Information ON'], desc: 'Add amortization information to buildings tooltip', toggle: true};
Addon.ToolWarnCaut = {label: ['Tooltip Warning/Caution OFF', 'Tooltip Warning/Caution ON'], desc: 'A warning/caution when buying if it will put the bank under the amount needed for max "Lucky!"/"Lucky!" (Frenzy) rewards', toggle: true, func: function() {Addon.ToggleToolWarnCaut();}};
Addon.ToolWarnCautPos = {label: ['Tooltip Warning/Caution Position (Left)', 'Tooltip Warning/Caution Position (Bottom)'], desc: 'Placement of the warning/caution boxes', toggle: false, func: function() {Addon.ToggleToolWarnCautPos();}};
Addon.ToolWrink = {label: ['Wrinkler Tooltip OFF', 'Wrinkler Tooltip ON'], desc: 'Shows the amount of cookies a wrinkler will give when popping it', toggle: true};
Addon.Stats = {label: ['Statistics OFF', 'Statistics ON'], desc: 'Extra Cookie Monster statistics!', toggle: true};
Addon.UpStats = {label: ['Statistics Update Rate (Default)', 'Statistics Update Rate (1s)'], desc: 'Default Game rate is once every 5 seconds', toggle: false};
Addon.TimeFormat = {label: ['Time XXd, XXh, XXm, XXs', 'Time XX:XX:XX:XX:XX'], desc: 'Change the time format', toggle: false};
Addon.SayTime = {label: ['Format Time OFF', 'Format Time ON'], desc: 'Change how time is displayed in statistics', toggle: true, func: function() {Addon.ToggleSayTime();}};
Addon.Scale = {label: ['Game\'s Setting Scale', 'Metric', 'Short Scale', 'Scientific Notation'], desc: 'Change how long numbers are handled', toggle: false, func: function() {Addon.RefreshScale();}};

/********
 * Data *
 ********/

Addon.HalloCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
Addon.ChristCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
Addon.ValCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];

/********
 * Disp *
 ********/

Addon.FormatTime = function(time, format) {
	if (time == 'Infinity') return time;
	if (Addon.TimeFormat) {
		if (time > 3155760000) return 'XX:XX:XX:XX:XX';
		time = Math.ceil(time);
		var y = Math.floor(time / 31557600);
		var d = Math.floor(time % 31557600 / 86400);
		var h = Math.floor(time % 86400 / 3600);
		var m = Math.floor(time % 3600 / 60);
		var s = Math.floor(time % 60);
		var str = '';
		if (y < 10) {
			str += '0';
		}
		str += y + ':';
		if (d < 10) {
			str += '0';
		}
		str += d + ':';
		if (h < 10) {
			str += '0';
		}
		str += h + ':';
		if (m < 10) {
			str += '0';
		}
		str += m + ':';
		if (s < 10) {
			str += '0';
		}
		str += s;
	} else {
		if (time > 777600000) return format ? 'Over 9000 days!' : '>9000d';
		time = Math.ceil(time);
		var d = Math.floor(time / 86400);
		var h = Math.floor(time % 86400 / 3600);
		var m = Math.floor(time % 3600 / 60);
		var s = Math.floor(time % 60);
		var str = '';
		if (d > 0) {
			str += d + (format ? (d == 1 ? ' day' : ' days') : 'd') + ', ';
		}
		if (str.length > 0 || h > 0) {
			str += h + (format ? (h == 1 ? ' hour' : ' hours') : 'h') + ', ';
		}
		if (str.length > 0 || m > 0) {
			str += m + (format ? (m == 1 ? ' minute' : ' minutes') : 'm') + ', ';
		}
		str += s + (format ? (s == 1 ? ' second' : ' seconds') : 's');
	}
	return str;
}

Addon.GetTimeColor = function(price, bank, cps) {
	var color;
	var text;
	if (bank >= price) {
		color = Addon.colorGreen;
		if (Addon.TimeFormat) {
			text = '00:00:00:00:00';
		}
		else {
			text = 'Done!';
		}
	}
	else {
		var time = (price - bank) / cps;
		text = Addon.FormatTime(time);
		if (time > 300) {
			color =  Addon.colorRed;
		}
		else if (time > 60) {
			color =  Addon.colorOrange;
		}
		else {
			color =  Addon.colorYellow;
		}
	}
	return {text: text, color: color};
}

Addon.Beautify = function(num, frac) {
	if (Addon.Scale != 0 && isFinite(num)) {
		var answer = '';
		var negative = false;
		if (num < 0) {
			num = Math.abs(num);
			negative = true;
		}
				
		for (var i = (Addon.shortScale.length - 1); i >= 0; i--) {
			if (i < Addon.metric.length && Addon.Scale == 1) {
				if (num >= Math.pow(1000, i + 2)) {
					answer = (Math.floor(num / Math.pow(1000, i + 1)) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + Addon.metric[i];
					break;
				}
			}
			else if (Addon.Scale > 1) {
				if (num >= Math.pow(1000, i + 2)) {
					answer = (Math.floor(num / Math.pow(1000, i + 1)) / 1000) + (Addon.Scale == 2 ? (' ' + Addon.shortScale[i]) : ('e+' + ((i + 2) * 3)));
					break;
				}
			}
		}
		if (answer == '') {
			answer = Addon.Beautify(num, frac);
		}
		
		if (negative) {
			answer = '-' + answer;
		}
		return answer;
	}
	else {
		return Addon.Beautify(num, frac);
	}
}

Addon.GetWrinkConfigBank = function() {
	if (Addon.CalcWrink)
		return Addon.WrinkBank;
	else
		return 0;
}

Addon.GetCPS = function() {
	if (Addon.CPSMode)
		return Addon.AvgCPS;
	else
		return (Game.cookiesPs * (1 - Game.cpsSucked));
}

Addon.UpdateBackground = function() {
	Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
	Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
	Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
	Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
}

Addon.GetConfigDisplay = function(config) {
	return Addon.ConfigData[config].label[Addon.Config[config]];
}

Addon.AddJscolor = function() {
	Addon.Jscolor = document.createElement('script');
	Addon.Jscolor.type = 'text/javascript';
	Addon.Jscolor.setAttribute('src', 'http://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(Addon.Jscolor);
}

Addon.CreateCssArea = function() {
	Addon.Css = document.createElement('style');
	Addon.Css.type = 'text/css';

	document.head.appendChild(Addon.Css);
}

Addon.CreateBotBar = function() {
	Addon.BotBar = document.createElement('div');
	Addon.BotBar.id = 'CMBotBar';
	Addon.BotBar.style.height = '55px';
	Addon.BotBar.style.width = '100%';
	Addon.BotBar.style.position = 'absolute';
	Addon.BotBar.style.display = 'none';
	Addon.BotBar.style.backgroundColor = '#262224';
	Addon.BotBar.style.backgroundImage = '-moz-linear-gradient(top, #4d4548, #000000)';
	Addon.BotBar.style.backgroundImage = '-o-linear-gradient(top, #4d4548, #000000)';
	Addon.BotBar.style.backgroundImage = '-webkit-linear-gradient(top, #4d4548, #000000)';
	Addon.BotBar.style.backgroundImage = 'linear-gradient(to bottom, #4d4548, #000000)';
	Addon.BotBar.style.borderTop = '1px solid black';
	Addon.BotBar.style.overflow = 'auto';
	Addon.BotBar.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';
	
	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.textAlign = 'center';
	table.style.whiteSpace = 'nowrap';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	var firstCol = function(text, color) {
		var td = document.createElement('td');
		td.style.textAlign = 'right';
		td.className = Addon.colorTextPre + color;
		td.textContent = text;
		return td;
	}
	
	var type = document.createElement('tr');
	type.style.fontWeight = 'bold';
	type.appendChild(firstCol(Addon.VersionMajor + '.' + Addon.VersionMinor, Addon.colorYellow));
	tbody.appendChild(type);
	var bonus = document.createElement('tr');
	bonus.appendChild(firstCol('Bonus Income', Addon.colorBlue));
	tbody.appendChild(bonus);
	var pp = document.createElement('tr');
	pp.appendChild(firstCol('Payback Period', Addon.colorBlue));
	tbody.appendChild(pp);
	var time = document.createElement('tr');
	time.appendChild(firstCol('Time Left', Addon.colorBlue));
	tbody.appendChild(time);
	
	for (var i in Game.Objects) {
		var header = document.createElement('td');
		header.appendChild(document.createTextNode((i.indexOf(' ') != -1 ? i.substring(0, i.indexOf(' ')) : i) + ' ('));
		var span = document.createElement('span');
		span.className = Addon.colorTextPre + Addon.colorBlue;
		header.appendChild(span);
		header.appendChild(document.createTextNode(')'));
		type.appendChild(header);
		bonus.appendChild(document.createElement('td'));
		pp.appendChild(document.createElement('td'));
		time.appendChild(document.createElement('td'));
	
	}
	
	Addon.BotBar.appendChild(table);
	
	l('wrapper').appendChild(Addon.BotBar);
}

Addon.ToggleBotBar = function() {
	if (Addon.BotBar == 1) {
		Addon.BotBar.style.display = '';
		Addon.UpdateBotBarOther();
	}
	else {
		Addon.BotBar.style.display = 'none';
	}
	Addon.UpdateBotTimerBarDisplay();
}

Addon.UpdateBotBarOther = function() {
	if (Addon.BotBar == 1) {
		var count = 0;
	
		for (var i in Addon.Objects) {
			count++;
			Addon.BotBar.firstChild.firstChild.childNodes[0].childNodes[count].childNodes[1].textContent = Game.Objects[i].amount;
			Addon.BotBar.firstChild.firstChild.childNodes[1].childNodes[count].textContent = Beautify(Addon.Objects[i].bonus, 2);
			Addon.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].className = Addon.colorTextPre + Addon.Objects[i].color;
			Addon.BotBar.firstChild.firstChild.childNodes[2].childNodes[count].textContent = Beautify(Addon.Objects[i].pp, 2);
		}
	}
}

Addon.UpdateBotBarTime = function() {
	if (Addon.BotBar == 1) {
		var count = 0;
	
		for (var i in Addon.Objects) {
			count++;
			var timeColor = Addon.GetTimeColor(Game.Objects[i].getPrice(), (Game.cookies + Addon.GetWrinkConfigBank()), Addon.GetCPS());
			Addon.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].className = Addon.colorTextPre + timeColor.color;
			Addon.BotBar.firstChild.firstChild.childNodes[3].childNodes[count].textContent = timeColor.text;
		}
	}
}

Addon.CreateTimerBar = function() {
	Addon.TimerBar = document.createElement('div');
	Addon.TimerBar.id = 'CMTimerBar';
	Addon.TimerBar.style.position = 'absolute';
	Addon.TimerBar.style.display = 'none';
	Addon.TimerBar.style.height = '48px';
	Addon.TimerBar.style.fontSize = '10px';
	Addon.TimerBar.style.fontWeight = 'bold';
	Addon.TimerBar.style.backgroundColor = 'black';
	
	var bar = function(name, bars, time) {
		var div = document.createElement('div');
		div.style.width = '100%';
		div.style.height = '10px';
		div.style.margin = 'auto';
		div.style.position = 'absolute';
		div.style.left = '0px';
		div.style.top = '0px';
		div.style.right = '0px';
		div.style.bottom = '0px';
		
		var type = document.createElement('span');
		type.style.display = 'inline-block';
		type.style.textAlign = 'right';
		type.style.width = '108px';
		type.style.marginRight = '5px';
		type.style.verticalAlign = 'text-top';
		type.textContent = name;
		div.appendChild(type);
		
		for (var i = 0; i < bars.length; i++) {
			var colorBar = document.createElement('span');
			colorBar.id = bars[i].id
			colorBar.style.display = 'inline-block';
			colorBar.style.height = '10px';
			if (bars.length - 1 == i) {
				colorBar.style.borderTopRightRadius = '10px';
				colorBar.style.borderBottomRightRadius = '10px';
			}
			if (typeof bars[i].color !== 'undefined') {
				colorBar.className = Addon.colorBackPre + bars[i].color;
			}
			div.appendChild(colorBar);
		}
		
		var timer = document.createElement('span');
		timer.id = time;
		timer.style.marginLeft = '5px';
		timer.style.verticalAlign = 'text-top';
		div.appendChild(timer);
		return div
	}
	
	Addon.TimerBarGC = document.createElement('div');
	Addon.TimerBarGC.id = 'CMTimerBarGC';
	Addon.TimerBarGC.style.height = '12px';
	Addon.TimerBarGC.style.margin = '0px 10px';
	Addon.TimerBarGC.style.position = 'relative';
	Addon.TimerBarGC.appendChild(bar('Next Cookie', [{id: 'CMTimerBarGCMinBar', color: Addon.colorGray}, {id: 'CMTimerBarGCBar', color: Addon.colorPurple}], 'CMTimerBarGCTime'));
	Addon.TimerBar.appendChild(Addon.TimerBarGC);
	
	Addon.TimerBarRen = document.createElement('div');
	Addon.TimerBarRen.id = 'CMTimerBarRen';
	Addon.TimerBarRen.style.height = '12px';
	Addon.TimerBarRen.style.margin = '0px 10px';
	Addon.TimerBarRen.style.position = 'relative';
	Addon.TimerBarRen.appendChild(bar('Next Reindeer', [{id: 'CMTimerBarRenMinBar', color: Addon.colorGray}, {id: 'CMTimerBarRenBar', color: Addon.colorOrange}], 'CMTimerBarRenTime'));
	Addon.TimerBar.appendChild(Addon.TimerBarRen);
	
	Addon.TimerBarBuff1 = document.createElement('div');
	Addon.TimerBarBuff1.id = 'CMTimerBarBuff1';
	Addon.TimerBarBuff1.style.height = '12px';
	Addon.TimerBarBuff1.style.margin = '0px 10px';
	Addon.TimerBarBuff1.style.position = 'relative';
	Addon.TimerBarBuff1.appendChild(bar('', [{id: 'CMTimerBarBuff1Bar'}], 'CMTimerBarBuff1Time'));
	Addon.TimerBarBuff1.firstChild.firstChild.id = 'CMTimerBarBuff1Type';
	Addon.TimerBar.appendChild(Addon.TimerBarBuff1);
	
	Addon.TimerBarBuff2 = document.createElement('div');
	Addon.TimerBarBuff2.id = 'CMTimerBarBuff2';
	Addon.TimerBarBuff2.style.height = '12px';
	Addon.TimerBarBuff2.style.margin = '0px 10px';
	Addon.TimerBarBuff2.style.position = 'relative';
	Addon.TimerBarBuff2.appendChild(bar('', [{id: 'CMTimerBarBuff2Bar'}], 'CMTimerBarBuff2Time'));
	Addon.TimerBarBuff2.firstChild.firstChild.id = 'CMTimerBarBuff2Type';
	Addon.TimerBar.appendChild(Addon.TimerBarBuff2);
	
	l('wrapper').appendChild(Addon.TimerBar);
}

Addon.ToggleTimerBar = function() {
	if (Addon.TimerBar == 1) {
		Addon.TimerBar.style.display = '';
	}
	else {
		Addon.TimerBar.style.display = 'none';
	}
	Addon.UpdateBotTimerBarDisplay();
}

Addon.ToggleTimerBarPos = function() {
	if (Addon.TimerBarPos == 0) {
		Addon.TimerBar.style.width = '30%';
		Addon.TimerBar.style.bottom = '';
		l('game').insertBefore(Addon.TimerBar, l('sectionLeft'));
	}
	else {
		Addon.TimerBar.style.width = '100%';
		Addon.TimerBar.style.bottom = '0px';
		l('wrapper').appendChild(Addon.TimerBar);
	}
	Addon.UpdateBotTimerBarDisplay();
}

Addon.UpdateTimerBar = function() {
	if (Addon.TimerBar == 1) {
		// label width: 113, timer width: 26, div margin: 20
		var maxWidth = Addon.TimerBar.offsetWidth - 159;
		var count = 0;
		
		if (Game.shimmerTypes['golden'].spawned == 0 && !Game.Has('Golden switch [off]')) {
			Addon.TimerBarGC.style.display = '';
			l('CMTimerBarGCMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes['golden'].minTime - Game.shimmerTypes['golden'].time) * maxWidth / Game.shimmerTypes['golden'].maxTime) + 'px';
			if (Game.shimmerTypes['golden'].minTime == Game.shimmerTypes['golden'].maxTime) {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '10px';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '10px';
			}
			else {
				l('CMTimerBarGCMinBar').style.borderTopRightRadius = '';
				l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '';
			}
			l('CMTimerBarGCBar').style.width = Math.round(Math.min(Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].minTime, Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) * maxWidth / Game.shimmerTypes['golden'].maxTime) + 'px';
			l('CMTimerBarGCTime').textContent = Math.ceil((Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) / Game.fps);
			count++;
		}
		else {
			Addon.TimerBarGC.style.display = 'none';
		}
		
		if (Game.season == 'christmas' && Game.shimmerTypes['reindeer'].spawned == 0) {
			Addon.TimerBarRen.style.display = '';
			l('CMTimerBarRenMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes['reindeer'].minTime - Game.shimmerTypes['reindeer'].time) * maxWidth / Game.shimmerTypes['reindeer'].maxTime) + 'px';
			l('CMTimerBarRenBar').style.width = Math.round(Math.min(Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].minTime, Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) * maxWidth / Game.shimmerTypes['reindeer'].maxTime) + 'px';
			l('CMTimerBarRenTime').textContent = Math.ceil((Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) / Game.fps);
			count++;
		}
		else {
			Addon.TimerBarRen.style.display = 'none';
		}
		
		var buffCount = 0;
		for (var i in Game.buffs) {
			if (Game.buffs[i]) {
				buffCount++;
				Addon.Disp['TimerBarBuff' + buffCount].style.display = '';
				l('CMTimerBarBuff' + buffCount + 'Type').textContent = Game.buffs[i].name;
				var classColor = '';
				if (typeof Addon.buffColors[Game.buffs[i].name] !== 'undefined') {
					classColor = Addon.buffColors[Game.buffs[i].name];
				}
				else {
					classColor = Addon.colorPurple;
				}
				l('CMTimerBarBuff' + buffCount + 'Bar').className = Addon.colorBackPre + classColor;
				l('CMTimerBarBuff' + buffCount + 'Bar').style.width = Math.round(Game.buffs[i].time * maxWidth / Game.buffs[i].maxTime) + 'px';
				l('CMTimerBarBuff' + buffCount + 'Time').textContent = Math.ceil(Game.buffs[i].time / Game.fps);
				count++;
				if (buffCount == 2) {
					break;
				}
			}
		}
		if (buffCount < 2) {
			Addon.TimerBarBuff2.style.display = 'none';
			if (buffCount < 1) {
				Addon.TimerBarBuff1.style.display = 'none';
			}
		}
		
		/*if (Game.frenzy > 0) {
			Addon.TimerBarBuff1.style.display = '';
			if (Game.frenzyPower == 7) {
				l('CMTimerBarBuff1Type').textContent = 'Frenzy';
				l('CMTimerBarBuff1Bar').className = Addon.colorBackPre + Addon.colorYellow;
			}
			else if (Game.frenzyPower == 0.5) {
				l('CMTimerBarBuff1Type').textContent = 'Clot';
				l('CMTimerBarBuff1Bar').className = Addon.colorBackPre + Addon.colorRed;
			}
			else if (Game.frenzyPower == 15) {
				l('CMTimerBarBuff1Type').textContent = 'Dragon Harvest';
				l('CMTimerBarBuff1Bar').className = Addon.colorBackPre + Addon.colorBrown;
			}
			else {
				l('CMTimerBarBuff1Type').textContent = 'Blood Frenzy';
				l('CMTimerBarBuff1Bar').className = Addon.colorBackPre + Addon.colorGreen;
			}
			l('CMTimerBarBuff1Bar').style.width = Math.round(Game.frenzy * maxWidth / Game.frenzyMax) + 'px';
			l('CMTimerBarBuff1Time').textContent = Math.ceil(Game.frenzy / Game.fps);
			count++;
		}
		else {
			Addon.TimerBarBuff1.style.display = 'none';
		}
		
		if (Game.clickFrenzy > 0) {
			Addon.TimerBarBuff2.style.display = '';
			if (Game.clickFrenzyPower == 777) {
				l('CMTimerBarBuff2Type').textContent = 'Click Frenzy';
				l('CMTimerBarBuff2Bar').className = Addon.colorBackPre + Addon.colorBlue;
			}
			else {
				l('CMTimerBarBuff2Type').textContent = 'Dragonflight';
				l('CMTimerBarBuff2Bar').className = Addon.colorBackPre + Addon.colorPink;
			}
			l('CMTimerBarBuff2Bar').style.width = Math.round(Game.clickFrenzy * maxWidth / Game.clickFrenzyMax) + 'px';
			l('CMTimerBarBuff2Time').textContent = Math.ceil(Game.clickFrenzy / Game.fps);
			count++;
		}
		else {
			Addon.TimerBarBuff2.style.display = 'none';
		}*/
		
		if (count != 0) {
			var height = 48 / count;
			Addon.TimerBarGC.style.height = height + 'px';
			Addon.TimerBarRen.style.height = height + 'px';
			Addon.TimerBarBuff1.style.height = height + 'px';
			Addon.TimerBarBuff2.style.height = height + 'px';
		}
	}
}

Addon.UpdateBotTimerBarDisplay = function() {
	if (Addon.BotBar == 1 && Addon.TimerBar == 1 && Addon.TimerBarPos == 1) {
		Addon.BotBar.style.bottom = '48px';
		l('game').style.bottom = '104px';
	}
	else if (Addon.BotBar == 1) {
		Addon.BotBar.style.bottom = '0px';
		l('game').style.bottom = '56px';
	}
	else if (Addon.TimerBar == 1 && Addon.TimerBarPos == 1) {
		l('game').style.bottom = '48px';
	}
	else { // No bars
		l('game').style.bottom = '0px';
	}
	
	if (Addon.TimerBar == 1 && Addon.TimerBarPos == 0) {
		l('sectionLeft').style.top = '48px';
	}
	else {
		l('sectionLeft').style.top = '';
	}
	
	Addon.UpdateBackground();
}

Addon.UpdateBuildings = function() {
	if (Addon.BuildColor == 1 && Game.buyMode == 1) {
		var target = '';
		if (Game.buyBulk == 10 && Addon.BulkBuildColor == 1) {
			target = 'Objects10';
		}
		else if (Game.buyBulk == 100 && Addon.BulkBuildColor == 1) {
			target = 'Objects100';
		}
		else {
			target = 'Objects';
		}
		for (var i in Addon.Cache[target]) {
			l('productPrice' + Game.Objects[i].id).style.color = Addon.Colors[Addon.Cache[target][i].color];
		}
	}
	else {
		for (var i in Addon.Objects) {
			l('productPrice' + Game.Objects[i].id).style.color = '';
		}
	}
}

Addon.CreateUpgradeBar = function() {
	Addon.UpgradeBar = document.createElement('div');
	Addon.UpgradeBar.id = 'CMUpgradeBar';
	Addon.UpgradeBar.style.width = '100%';
	Addon.UpgradeBar.style.backgroundColor = 'black';
	Addon.UpgradeBar.style.textAlign = 'center';
	Addon.UpgradeBar.style.fontWeight = 'bold';
	Addon.UpgradeBar.style.display = 'none';
	Addon.UpgradeBar.onmouseout = function() { Game.tooltip.hide(); };
	
	var placeholder = document.createElement('div');
	var legend = document.createElement('div');
	legend.style.minWidth = '330px';
	legend.style.marginBottom = '4px';
	var title = document.createElement('div');
	title.className = 'name';
	title.style.marginBottom = '4px';
	title.textContent = 'Legend';
	legend.appendChild(title);
	
	var legendLine = function(color, text) {
		var div = document.createElement('div');
		div.style.verticalAlign = 'middle';
		var span = document.createElement('span');
		span.className = Addon.colorBackPre + color;
		span.style.display = 'inline-block';
		span.style.height = '10px';
		span.style.width = '10px';
		span.style.marginRight = '4px';
		div.appendChild(span);
		div.appendChild(document.createTextNode(text));
		return div;
	}
	
	legend.appendChild(legendLine(Addon.colorBlue, 'Better than best PP building'));
	legend.appendChild(legendLine(Addon.colorGreen, 'Same as best PP building'));
	legend.appendChild(legendLine(Addon.colorYellow, 'Between best and worst PP buildings closer to best'));
	legend.appendChild(legendLine(Addon.colorOrange, 'Between best and worst PP buildings closer to worst'));
	legend.appendChild(legendLine(Addon.colorRed, 'Same as worst PP building'));
	legend.appendChild(legendLine(Addon.colorPurple, 'Worse than worst PP building'));
	legend.appendChild(legendLine(Addon.colorGray, 'Negative or infinity PP'));
	placeholder.appendChild(legend);
	
	Addon.UpgradeBar.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML), 'store');};
	
	var upgradeNumber = function(id, color) {
		var span = document.createElement('span');
		span.id = id;
		span.className = Addon.colorTextPre + color;
		span.style.width = '14.28571428571429%';
		span.style.display = 'inline-block';
		span.textContent = '0';
		return span;
	}
	Addon.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarBlue', Addon.colorBlue));
	Addon.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGreen', Addon.colorGreen));
	Addon.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarYellow', Addon.colorYellow));
	Addon.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarOrange', Addon.colorOrange));
	Addon.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarRed', Addon.colorRed));
	Addon.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarPurple', Addon.colorPurple));
	Addon.UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGray', Addon.colorGray));
	
	l('upgrades').parentNode.insertBefore(Addon.UpgradeBar, l('upgrades').parentNode.childNodes[3]);
}

Addon.ToggleUpBarColor = function() {
	if (Addon.UpBarColor == 1) {
		Addon.UpgradeBar.style.display = '';
		Addon.UpdateUpgrades();
	}
	else {
		Addon.UpgradeBar.style.display = 'none';
		Game.RebuildUpgrades();
	}
}

Addon.UpdateUpgrades = function() {
	if (Addon.UpBarColor == 1) {
		var blue = 0;
		var green = 0;
		var yellow = 0;
		var orange = 0;
		var red = 0;
		var purple = 0;
		var gray = 0;

		for (var i in Game.UpgradesInStore) {
			var me = Game.UpgradesInStore[i];
			var addedColor = false;
			for (var j = 0; j < l('upgrade' + i).childNodes.length; j++) {
				if (l('upgrade' + i).childNodes[j].className.indexOf(Addon.colorBackPre) != -1) {
					l('upgrade' + i).childNodes[j].className = Addon.colorBackPre + Addon.Upgrades[me.name].color;
					addedColor = true;
					break;
				}
			}
			if (!addedColor) {
				var div = document.createElement('div');
				div.style.width = '10px';
				div.style.height = '10px';
				div.className = Addon.colorBackPre + Addon.Upgrades[me.name].color;
				l('upgrade' + i).appendChild(div);
			}
			if (Addon.Upgrades[me.name].color == Addon.colorBlue) blue++;
			else if (Addon.Upgrades[me.name].color == Addon.colorGreen) green++;
			else if (Addon.Upgrades[me.name].color == Addon.colorYellow) yellow++;
			else if (Addon.Upgrades[me.name].color == Addon.colorOrange) orange++;
			else if (Addon.Upgrades[me.name].color == Addon.colorRed) red++;
			else if (Addon.Upgrades[me.name].color == Addon.colorPurple) purple++;
			else if (Addon.Upgrades[me.name].color == Addon.colorGray) gray++;
		}

		l('CMUpgradeBarBlue').textContent = blue;
		l('CMUpgradeBarGreen').textContent = green;
		l('CMUpgradeBarYellow').textContent = yellow;
		l('CMUpgradeBarOrange').textContent = orange;
		l('CMUpgradeBarRed').textContent = red;
		l('CMUpgradeBarPurple').textContent = purple;
		l('CMUpgradeBarGray').textContent = gray;
	}
}

Addon.UpdateColors = function() {
	var str = '';
	for (var i = 0; i < Addon.colors.length; i++) {
		str += '.' + Addon.colorTextPre + Addon.colors[i] + ' { color: ' + Addon.Colors[Addon.colors[i]] + '; }\n';
	}
	for (var i = 0; i < Addon.colors.length; i++) {
		str += '.' + Addon.colorBackPre + Addon.colors[i] + ' { background-color: ' + Addon.Colors[Addon.colors[i]] + '; }\n';
	}
	for (var i = 0; i < Addon.colors.length; i++) {
		str += '.' + Addon.colorBorderPre + Addon.colors[i] + ' { border: 1px solid ' + Addon.Colors[Addon.colors[i]] + '; }\n';
	}
	Addon.Css.textContent = str;
	Addon.UpdateBuildings(); // Class has been already set
}

Addon.CreateWhiteScreen = function() {
	Addon.WhiteScreen = document.createElement('div');
	Addon.WhiteScreen.id = 'CMWhiteScreen';
	Addon.WhiteScreen.style.width = '100%';
	Addon.WhiteScreen.style.height = '100%';
	Addon.WhiteScreen.style.backgroundColor = 'white';
	Addon.WhiteScreen.style.display = 'none';
	Addon.WhiteScreen.style.zIndex = '9999999999';
	Addon.WhiteScreen.style.position = 'absolute';
	
	l('wrapper').appendChild(Addon.WhiteScreen);
}

Addon.Flash = function(mode) {
	if ((Addon.Flash == 1 && mode == 3) || mode == 1) {
		Addon.WhiteScreen.style.opacity = '0.5';
		if (mode == 3) {
			Addon.WhiteScreen.style.display = 'inline';
			setTimeout(function() {Addon.Flash(2);}, 1000/Game.fps);
		}
		else {
			setTimeout(function() {Addon.Flash(0);}, 1000/Game.fps);
		}
	}
	else if (mode == 2) {
		Addon.WhiteScreen.style.opacity = '1';
		setTimeout(function() {Addon.Flash(1);}, 1000/Game.fps);
	}
	else if (mode == 0) {
		Addon.WhiteScreen.style.display = 'none';
	}
}

Addon.PlaySound = function(url) {
	if (Addon.Sound == 1) {
		var sound = new realAudio(url);
		sound.volume = Addon.Volume / 100;
		sound.play();
	}
}

/**
 * Needed for some of the functions to use the right object
 */
Addon.FindGoldenShimmer = function() {
	if (Addon.lastGoldenCookieState) {
		for (var i in Game.shimmers) {
			if (Game.shimmers[i].spawnLead && Game.shimmers[i].type == 'golden') {
				Addon.goldenShimmer = Game.shimmers[i];
				break;
			}
		}
	}
}

Addon.CreateFavicon = function() {
	Addon.Favicon = document.createElement('link');
	Addon.Favicon.id = 'CMFavicon';
	Addon.Favicon.rel = 'shortcut icon';
	Addon.Favicon.href = 'http://orteil.dashnet.org/cookieclicker/favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(Addon.Favicon);
}

Addon.UpdateFavicon = function() {
	if (Addon.Favicon == 1 && Addon.lastGoldenCookieState) {
		if (Addon.goldenShimmer.wrath) {
			Addon.Favicon.href = 'http://aktanusa.github.io/CookieMonster/favicon/wrathCookie.ico';
		}
		else {
			Addon.Favicon.href = 'http://aktanusa.github.io/CookieMonster/favicon/goldenCookie.ico';
		}
	}
	else {
		Addon.Favicon.href = 'http://orteil.dashnet.org/cookieclicker/favicon.ico';
	}
}

Addon.CreateGCTimer = function() {
	Addon.GCTimer = document.createElement('div');
	Addon.GCTimer.style.width = '96px';
	Addon.GCTimer.style.height = '96px';
	Addon.GCTimer.style.display = 'none';
	Addon.GCTimer.style.position = 'absolute';
	Addon.GCTimer.style.zIndex = '10000000001';
	Addon.GCTimer.style.textAlign = 'center';
	Addon.GCTimer.style.lineHeight = '96px';
	Addon.GCTimer.style.fontFamily = '\"Kavoon\", Georgia, serif';
	Addon.GCTimer.style.fontSize = '35px';
	Addon.GCTimer.style.cursor = 'pointer';
	Addon.GCTimer.onclick = function () {Addon.goldenShimmer.pop(); Addon.GCTimer.style.display = 'none';};
	Addon.GCTimer.onmouseover = function() {Addon.goldenShimmer.l.style.filter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; Addon.goldenShimmer.l.style.webkitFilter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))';};
	Addon.GCTimer.onmouseout = function() {Addon.goldenShimmer.l.style.filter = ''; Addon.goldenShimmer.l.style.webkitFilter = '';};
		
	l('game').appendChild(Addon.GCTimer);
}

Addon.ToggleGCTimer = function() {
	if (Addon.GCTimer == 1) {
		if (Addon.lastGoldenCookieState) {
			Addon.GCTimer.style.display = 'block';
			Addon.GCTimer.style.left = Addon.goldenShimmer.l.style.left;
			Addon.GCTimer.style.top = Addon.goldenShimmer.l.style.top;
		}
	}
	else {
		Addon.GCTimer.style.display = 'none';
	}
}

Addon.CheckGoldenCookie = function() {
	if (Addon.lastGoldenCookieState != Game.shimmerTypes['golden'].spawned) {
		Addon.lastGoldenCookieState = Game.shimmerTypes['golden'].spawned;
		Addon.FindGoldenShimmer();
		Addon.UpdateFavicon();
		if (Addon.lastGoldenCookieState) {
			if (Addon.GCTimer == 1) {
				Addon.GCTimer.style.display = 'block';
				Addon.GCTimer.style.left = Addon.goldenShimmer.l.style.left;
				Addon.GCTimer.style.top = Addon.goldenShimmer.l.style.top;
			}
			
			Addon.Flash(3);
			Addon.PlaySound(Addon.GCSoundURL);
		}
		else if (Addon.GCTimer == 1) Addon.GCTimer.style.display = 'none';
	}
	else if (Addon.GCTimer == 1 && Addon.lastGoldenCookieState) {
		Addon.GCTimer.style.opacity = Addon.goldenShimmer.l.style.opacity;
		Addon.GCTimer.style.transform = Addon.goldenShimmer.l.style.transform;
		Addon.GCTimer.textContent = Math.ceil(Addon.goldenShimmer.life / Game.fps);
	}
}


Addon.CheckSeasonPopup = function() {
	if (Addon.lastSeasonPopupState != Game.shimmerTypes['reindeer'].spawned) {
		Addon.lastSeasonPopupState = Game.shimmerTypes['reindeer'].spawned;
		if (Addon.lastSeasonPopupState && Game.season=='christmas') {
			// Needed for some of the functions to use the right object
			for (var i in Game.shimmers) {
				if (Game.shimmers[i].spawnLead && Game.shimmers[i].type == 'reindeer') {
					Addon.seasonPopShimmer = Game.shimmers[i];
					break;
				}
			}
			
			Addon.Flash(3);
			Addon.PlaySound(Addon.SeaSoundURL);
		}
	}
}

Addon.UpdateTitle = function() {
	if (Game.OnAscend || Addon.Title == 0) {
		document.title = Addon.Title;
	}
	else if (Addon.Title == 1) {
		var addSP = false;
		
		var titleGC;
		var titleSP;
		if (Addon.lastGoldenCookieState) {
			if (Addon.goldenShimmer.wrath) {
				titleGC = '[W ' +  Math.ceil(Addon.goldenShimmer.life / Game.fps) + ']';
			}
			else {
				titleGC = '[G ' +  Math.ceil(Addon.goldenShimmer.life / Game.fps) + ']';
			}
		}
		else if (!Game.Has('Golden switch [off]')) {
			titleGC = '[' +  Math.ceil((Game.shimmerTypes['golden'].maxTime - Game.shimmerTypes['golden'].time) / Game.fps) + ']';
		}
		else {
			titleGC = '[GS]'
		}
		if (Game.season=='christmas') {
			addSP = true;
			if (Addon.lastSeasonPopupState) {
				titleSP = '[R ' +  Math.ceil(Addon.seasonPopShimmer.life / Game.fps) + ']';
			}
			else {
				titleSP = '[' +  Math.ceil((Game.shimmerTypes['reindeer'].maxTime - Game.shimmerTypes['reindeer'].time) / Game.fps) + ']';
			}
		}
		
		var str = Addon.Title;
		if (str.charAt(0) == '[') {
			str = str.substring(str.lastIndexOf(']') + 1);
		}
		
		document.title = titleGC + (addSP ? titleSP : '') + ' ' + str;
	}
	else if (Addon.Title == 2) {
		var str = '';
		var spawn = false;
		if (Addon.lastGoldenCookieState) {
			spawn = true;
			if (Addon.goldenShimmer.wrath) {
				str += '[W ' +  Math.ceil(Addon.goldenShimmer.life / Game.fps) + ']';
			}
			else {
				str += '[G ' +  Math.ceil(Addon.goldenShimmer.life / Game.fps) + ']';
			}
		}
		if (Game.season=='christmas' && Addon.lastSeasonPopupState) {
			str += '[R ' +  Math.ceil(Addon.seasonPopShimmer.life / Game.fps) + ']';
			spawn = true;
		}
		if (spawn) str += ' - ';
		var title = 'Cookie Clicker';
		if (Game.season == 'fools') title = 'Cookie Baker';
		str += title;
		document.title = str;
	}
}

Addon.CollectWrinklers = function() {
	for (var i in Game.wrinklers) {
		if (Game.wrinklers[i].sucked > 0) {
			Game.wrinklers[i].hp = 0;
		}
	}
}

Addon.CreateTooltip = function(placeholder, text, minWidth) {
	Addon.Disp[placeholder] = document.createElement('div');
	var desc = document.createElement('div');
	desc.style.minWidth = minWidth;
	desc.style.marginBottom = '4px';
	var div = document.createElement('div');
	div.style.textAlign = 'left';
	div.textContent = text;
	desc.appendChild(div);
	Addon.Disp[placeholder].appendChild(desc);
}

Addon.AddMenuPref = function(title) {
	var header = function(text) {
		var div = document.createElement('div');
		div.className = 'listing';
		div.style.padding = '5px 16px';
		div.style.opacity = '0.7';
		div.style.fontSize = '17px';
		div.style.fontFamily = '\"Kavoon\", Georgia, serif';
		div.textContent = text;
		return div;
	}

	var frag = document.createDocumentFragment();
		
	frag.appendChild(title());
		
	var listing = function(config) {
		var div = document.createElement('div');
		div.className = 'listing';
		var a = document.createElement('a');
		if (Addon.ConfigData[config].toggle && Addon.Config[config] == 0) {
			a.className = 'option off';
		}
		else {
			a.className = 'option';
		}
		a.id = Addon.ConfigPrefix + config;
		a.onclick = function() {Addon.ToggleConfig(config);};
		a.textContent = Addon.GetConfigDisplay(config);
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = Addon.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
	
	var url = function(config) {
		var div = document.createElement('div');
		div.className = 'listing';
		var span = document.createElement('span');
		span.className = 'option';
		span.textContent = Addon.ConfigData[config].label + ' ';
		div.appendChild(span);
		var input = document.createElement('input');
		input.id = Addon.ConfigPrefix + config;
		input.className = 'option';
		input.type = 'text';
		input.value = Addon.Config[config];
		input.style.width = '300px';
		div.appendChild(input);
		div.appendChild(document.createTextNode(' '));
		var a = document.createElement('a');
		a.className = 'option';
		a.onclick = function() {Addon.Config[config] = l(Addon.ConfigPrefix + config).value;Addon.SaveConfig(Addon.Config);};
		a.textContent = 'Save';
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = Addon.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
		
	frag.appendChild(header('Bars/Colors'));
	frag.appendChild(listing('BotBar'));
	frag.appendChild(listing('TimerBar'));
	frag.appendChild(listing('TimerBarPos'));
	frag.appendChild(listing('BuildColor'));
	frag.appendChild(listing('BulkBuildColor'));
	frag.appendChild(listing('UpBarColor'));
	for (var i = 0; i < Addon.colors.length; i++) {
		var div = document.createElement('div');
		div.className = 'listing';
		var input = document.createElement('input');
		input.id = Addon.ConfigPrefix + 'Color' + Addon.colors[i];
		input.className = 'option';
		input.style.width = '65px';
		input.value = Addon.Colors[Addon.colors[i]];
		div.appendChild(input);
		eval('var change = function() {Addon.Colors[\'' + Addon.colors[i] + '\'] = l(Addon.ConfigPrefix + \'Color\' + \'' + Addon.colors[i] + '\').value; Addon.UpdateColors(); Addon.SaveConfig(Addon.Config);}');
		var jscolorpicker = new jscolor.color(input, {hash: true, caps: false, pickerZIndex: 1000000, pickerPosition: 'right', onImmediateChange: change});
		var label = document.createElement('label');
		label.textContent = Addon.Colors.desc[Addon.colors[i]];
		div.appendChild(label);
		frag.appendChild(div);
	}
	
	frag.appendChild(header('Calculation'));
	frag.appendChild(listing('CalcWrink'));
	frag.appendChild(listing('CPSMode'));
	frag.appendChild(listing('AvgCPSHist'));
	frag.appendChild(listing('AvgClicksHist'));
	frag.appendChild(listing('ToolWarnCautBon'));

	frag.appendChild(header('Golden Cookie/Season Popup Emphasis'));
	frag.appendChild(listing('Flash'));
	frag.appendChild(listing('Sound'));	
	var volConfig = 'Volume';
	var volume = document.createElement('div');
	volume.className = 'listing';
	var minus = document.createElement('a');
	minus.className = 'option';
	minus.onclick = function() {Addon.ToggleConfigDown(volConfig);};
	minus.textContent = '-';
	volume.appendChild(minus);
	var volText = document.createElement('span');
	volText.id = Addon.ConfigPrefix + volConfig;
	volText.textContent = Addon.GetConfigDisplay(volConfig);
	volume.appendChild(volText);
	var plus = document.createElement('a');
	plus.className = 'option';
	plus.onclick = function() {Addon.ToggleConfigUp(volConfig);};
	plus.textContent = '+';
	volume.appendChild(plus);
	var volLabel = document.createElement('label');
	volLabel.textContent = Addon.ConfigData[volConfig].desc;
	volume.appendChild(volLabel);
	frag.appendChild(volume);
	frag.appendChild(url('GCSoundURL'));
	frag.appendChild(url('SeaSoundURL'));
	frag.appendChild(listing('GCTimer'));
	frag.appendChild(listing('Title'));
	frag.appendChild(listing('Favicon'));
	
	frag.appendChild(header('Tooltip'));
	frag.appendChild(listing('Tooltip'));
	frag.appendChild(listing('TooltipAmor'));
	frag.appendChild(listing('ToolWarnCaut'));
	frag.appendChild(listing('ToolWarnCautPos'));
	frag.appendChild(listing('ToolWrink'));
	
	frag.appendChild(header('Statistics'));
	frag.appendChild(listing('Stats'));
	frag.appendChild(listing('UpStats'));
	frag.appendChild(listing('TimeFormat'));
	frag.appendChild(listing('SayTime'));
	
	frag.appendChild(header('Other'));
	frag.appendChild(listing('Scale'));	
	var resDef = document.createElement('div');
	resDef.className = 'listing';
	var resDefBut = document.createElement('a');
	resDefBut.className = 'option';
	resDefBut.onclick = function() {Addon.RestoreDefault();};
	resDefBut.textContent = 'Restore Default';
	resDef.appendChild(resDefBut);
	frag.appendChild(resDef);
		
	l('menu').childNodes[2].insertBefore(frag, l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1]);
		
	Addon.FormatButtonOnClickBak = l('formatButton').onclick;
	l('formatButton').onclick = function() {Game.Toggle('format', 'formatButton', 'Short numbers OFF', 'Short numbers ON', '1'); PlaySound('snd/tick.mp3'); Addon.RefreshScale();};
}

Addon.AddMenuStats = function(title) {
	var header = function(text, config) {
		var div = document.createElement('div');
		div.className = 'listing';
		div.style.padding = '5px 16px';
		div.style.opacity = '0.7';
		div.style.fontSize = '17px';
		div.style.fontFamily = '\"Kavoon\", Georgia, serif';
		div.appendChild(document.createTextNode(text + ' '));
		var span = document.createElement('span');
		span.style.cursor = 'pointer';
		span.style.display = 'inline-block';
		span.style.height = '14px';
		span.style.width = '14px';
		span.style.borderRadius = '7px';
		span.style.textAlign = 'center';
		span.style.backgroundColor = '#C0C0C0';
		span.style.color = 'black';
		span.style.fontSize = '13px';
		span.style.verticalAlign = 'middle';
		span.textContent = Addon.StatsPref[config] ? '-' : '+';
		span.onclick = function() {Addon.ToggleStatsConfig(config); Game.UpdateMenu();};
		div.appendChild(span);
		return div;
	}
	
	var stats = document.createElement('div');
	stats.className = 'subsection';

	stats.appendChild(title());
	
	var listing = function(name, text) {
		var div = document.createElement('div');
		div.className = 'listing';
		var b = document.createElement('b');
		if (typeof name == 'string') b.appendChild(document.createTextNode(name));
		else b.appendChild(name); // fragment
		b.appendChild(document.createTextNode(' : '));
		div.appendChild(b);
		div.appendChild(text);
		return div;
	}
	
	var listingQuest = function(text, placeholder) {
		var frag = document.createDocumentFragment();
		frag.appendChild(document.createTextNode(text + ' '));
		var span = document.createElement('span');
		span.onmouseout = function() { Game.tooltip.hide(); };
		span.onmouseover = function() {Game.tooltip.draw(this, escape(Addon.Disp[placeholder].innerHTML));};
		span.style.cursor = 'default';
		span.style.display = 'inline-block';
		span.style.height = '10px';
		span.style.width = '10px';
		span.style.borderRadius = '5px';
		span.style.textAlign = 'center';
		span.style.backgroundColor = '#C0C0C0';
		span.style.color = 'black';
		span.style.fontSize = '9px';
		span.style.verticalAlign = 'bottom';
		span.textContent = '?';
		frag.appendChild(span);
		return frag;
	}
	
	stats.appendChild(header('Lucky Cookies', 'Lucky'));
	if (Addon.StatsPref.Lucky) {
		var luckyColor = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.Lucky) ? Addon.colorRed : Addon.colorGreen;
		var luckyTime = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.Lucky) ? Addon.FormatTime((Addon.Lucky - (Game.cookies + Addon.GetWrinkConfigBank())) / Addon.GetCPS()) : '';
		var luckyColorFrenzy = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.LuckyFrenzy) ? Addon.colorRed : Addon.colorGreen;
		var luckyTimeFrenzy = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.LuckyFrenzy) ? Addon.FormatTime((Addon.LuckyFrenzy - (Game.cookies + Addon.GetWrinkConfigBank())) / Addon.GetCPS()) : '';
		var luckyCurBase = Math.min((Game.cookies + Addon.GetWrinkConfigBank()) * 0.15, Addon.NoGoldSwitchCookiesPS * 60 * 15) + 13;
		var luckyRewardMax = Addon.LuckyReward;
		var luckyRewardMaxWrath = Addon.LuckyReward;
		var luckyRewardFrenzyMax = Addon.LuckyRewardFrenzy;
		var luckyRewardFrenzyMaxWrath = Addon.LuckyRewardFrenzy;
		var luckyCur = luckyCurBase;
		var luckyCurWrath = luckyCurBase;
		if (Game.hasAura('Ancestral Metamorphosis')) {
			luckyRewardMax *= 1.1;
			luckyRewardFrenzyMax *= 1.1;
			luckyCur *= 1.1;
		}
		if (Game.hasAura('Unholy Dominion')) {
			luckyRewardMaxWrath *= 1.1;
			luckyRewardFrenzyMaxWrath *= 1.1;
			luckyCurWrath *= 1.1;
		}
		var luckySplit = luckyRewardMax != luckyRewardMaxWrath;
	
		var luckyReqFrag = document.createDocumentFragment();
		var luckyReqSpan = document.createElement('span');
		luckyReqSpan.style.fontWeight = 'bold';
		luckyReqSpan.className = Addon.colorTextPre + luckyColor;
		luckyReqSpan.textContent = Beautify(Addon.Lucky);
		luckyReqFrag.appendChild(luckyReqSpan);
		if (luckyTime != '') {
			var luckyReqSmall = document.createElement('small');
			luckyReqSmall.textContent = ' (' + luckyTime + ')';
			luckyReqFrag.appendChild(luckyReqSmall);
		}
		stats.appendChild(listing(listingQuest('\"Lucky!\" Cookies Required', 'GoldCookTooltipPlaceholder'), luckyReqFrag));
		var luckyReqFrenFrag = document.createDocumentFragment();
		var luckyReqFrenSpan = document.createElement('span');
		luckyReqFrenSpan.style.fontWeight = 'bold';
		luckyReqFrenSpan.className = Addon.colorTextPre + luckyColorFrenzy;
		luckyReqFrenSpan.textContent = Beautify(Addon.LuckyFrenzy);
		luckyReqFrenFrag.appendChild(luckyReqFrenSpan);
		if (luckyTimeFrenzy != '') {
			var luckyReqFrenSmall = document.createElement('small');
			luckyReqFrenSmall.textContent = ' (' + luckyTimeFrenzy + ')';
			luckyReqFrenFrag.appendChild(luckyReqFrenSmall);
		}
		stats.appendChild(listing(listingQuest('\"Lucky!\" Cookies Required (Frenzy)', 'GoldCookTooltipPlaceholder'), luckyReqFrenFrag));
		stats.appendChild(listing(listingQuest('\"Lucky!\" Reward (MAX)' + (luckySplit ? ' (Golden / Wrath)' : ''), 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(luckyRewardMax) + (luckySplit ? (' / ' + Beautify(luckyRewardMaxWrath)) : ''))));
		stats.appendChild(listing(listingQuest('\"Lucky!\" Reward (MAX) (Frenzy)' + (luckySplit ? ' (Golden / Wrath)' : ''), 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(luckyRewardFrenzyMax) + (luckySplit ? (' / ' + Beautify(luckyRewardFrenzyMaxWrath)) : ''))));
		stats.appendChild(listing(listingQuest('\"Lucky!\" Reward (CUR)' + (luckySplit ? ' (Golden / Wrath)' : ''), 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(luckyCur) + (luckySplit ? (' / ' + Beautify(luckyCurWrath)) : ''))));
	}
	
	stats.appendChild(header('Chain Cookies', 'Chain'));
	if (Addon.StatsPref.Chain) {
		var chainColor = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.Chain) ? Addon.colorRed : Addon.colorGreen;
		var chainTime = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.Chain) ? Addon.FormatTime((Addon.Chain - (Game.cookies + Addon.GetWrinkConfigBank())) / Addon.GetCPS()) : '';
		var chainColorFrenzy = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.ChainFrenzy) ? Addon.colorRed : Addon.colorGreen;
		var chainTimeFrenzy = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.ChainFrenzy) ? Addon.FormatTime((Addon.ChainFrenzy - (Game.cookies + Addon.GetWrinkConfigBank())) / Addon.GetCPS()) : '';
		var chainWrathColor = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.ChainWrath) ? Addon.colorRed : Addon.colorGreen;
		var chainWrathTime = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.ChainWrath) ? Addon.FormatTime((Addon.ChainWrath - (Game.cookies + Addon.GetWrinkConfigBank())) / Addon.GetCPS()) : '';
		var chainWrathColorFrenzy = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.ChainFrenzyWrath) ? Addon.colorRed : Addon.colorGreen;
		var chainWrathTimeFrenzy = ((Game.cookies + Addon.GetWrinkConfigBank()) < Addon.ChainFrenzyWrath) ? Addon.FormatTime((Addon.ChainFrenzyWrath - (Game.cookies + Addon.GetWrinkConfigBank())) / Addon.GetCPS()) : '';
		
		var chainRewardMax = Addon.ChainReward;
		var chainWrathRewardMax = Addon.ChainWrathReward;
		var chainFrenzyRewardMax = Addon.ChainFrenzyReward;
		var chainFrenzyWrathRewardMax = Addon.ChainFrenzyWrathReward;
		var chainCurMax = Math.min(Addon.NoGoldSwitchCookiesPS * 60 * 60 * 6, (Game.cookies + Addon.GetWrinkConfigBank()) * 0.25);
		var chainCur = Addon.MaxChainMoni(7, chainCurMax);
		var chainCurWrath = Addon.MaxChainMoni(6, chainCurMax);
		if (Game.hasAura('Ancestral Metamorphosis')) {
			chainRewardMax *= 1.1;
			chainFrenzyRewardMax *= 1.1;
			chainCur *= 1.1;
		}		
		if (Game.hasAura('Unholy Dominion')) {
			chainWrathRewardMax *= 1.1;
			chainFrenzyWrathRewardMax *= 1.1;
			chainCurWrath *= 1.1;
		}
		
		var chainReqFrag = document.createDocumentFragment();
		var chainReqSpan = document.createElement('span');
		chainReqSpan.style.fontWeight = 'bold';
		chainReqSpan.className = Addon.colorTextPre + chainColor;
		chainReqSpan.textContent = Beautify(Addon.Chain);
		chainReqFrag.appendChild(chainReqSpan);
		if (chainTime != '') {
			var chainReqSmall = document.createElement('small');
			chainReqSmall.textContent = ' (' + chainTime + ')';
			chainReqFrag.appendChild(chainReqSmall);
		}
		stats.appendChild(listing(listingQuest('\"Chain\" Cookies Required', 'GoldCookTooltipPlaceholder'), chainReqFrag));
		var chainWrathReqFrag = document.createDocumentFragment();
		var chainWrathReqSpan = document.createElement('span');
		chainWrathReqSpan.style.fontWeight = 'bold';
		chainWrathReqSpan.className = Addon.colorTextPre + chainWrathColor;
		chainWrathReqSpan.textContent = Beautify(Addon.ChainWrath);
		chainWrathReqFrag.appendChild(chainWrathReqSpan);
		if (chainWrathTime != '') {
			var chainWrathReqSmall = document.createElement('small');
			chainWrathReqSmall.textContent = ' (' + chainWrathTime + ')';
			chainWrathReqFrag.appendChild(chainWrathReqSmall);
		}
		stats.appendChild(listing(listingQuest('\"Chain\" Cookies Required (Wrath)', 'GoldCookTooltipPlaceholder'), chainWrathReqFrag));
		var chainReqFrenFrag = document.createDocumentFragment();
		var chainReqFrenSpan = document.createElement('span');
		chainReqFrenSpan.style.fontWeight = 'bold';
		chainReqFrenSpan.className = Addon.colorTextPre + chainColorFrenzy;
		chainReqFrenSpan.textContent = Beautify(Addon.ChainFrenzy);
		chainReqFrenFrag.appendChild(chainReqFrenSpan);
		if (chainTimeFrenzy != '') {
			var chainReqFrenSmall = document.createElement('small');
			chainReqFrenSmall.textContent = ' (' + chainTimeFrenzy + ')';
			chainReqFrenFrag.appendChild(chainReqFrenSmall);
		}
		stats.appendChild(listing(listingQuest('\"Chain\" Cookies Required (Frenzy)', 'GoldCookTooltipPlaceholder'), chainReqFrenFrag));
		var chainWrathReqFrenFrag = document.createDocumentFragment();
		var chainWrathReqFrenFrag = document.createDocumentFragment();
		var chainWrathReqFrenSpan = document.createElement('span');
		chainWrathReqFrenSpan.style.fontWeight = 'bold';
		chainWrathReqFrenSpan.className = Addon.colorTextPre + chainWrathColorFrenzy;
		chainWrathReqFrenSpan.textContent = Beautify(Addon.ChainFrenzyWrath);
		chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSpan);
		if (chainWrathTimeFrenzy != '') {
			var chainWrathReqFrenSmall = document.createElement('small');
			chainWrathReqFrenSmall.textContent = ' (' + chainWrathTimeFrenzy + ')';
			chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSmall);
		}
		stats.appendChild(listing(listingQuest('\"Chain\" Cookies Required (Frenzy) (Wrath)', 'GoldCookTooltipPlaceholder'), chainWrathReqFrenFrag));
		stats.appendChild(listing(listingQuest('\"Chain\" Reward (MAX) (Golden / Wrath)', 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(chainRewardMax) + ' / ' + Beautify(chainWrathRewardMax))));
		stats.appendChild(listing(listingQuest('\"Chain\" Reward (MAX) (Frenzy) (Golden / Wrath)', 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(chainFrenzyRewardMax) + ' / ' + Beautify(chainFrenzyWrathRewardMax))));
		stats.appendChild(listing(listingQuest('\"Chain\" Reward (CUR) (Golden / Wrath)', 'GoldCookTooltipPlaceholder'),  document.createTextNode(Beautify(chainCur) + ' / ' + Beautify(chainCurWrath))));
	}
	
	var choEgg = (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg')); // Needs to be done for the checking below
	
	stats.appendChild(header('Prestige', 'Prestige'));
	if (Addon.StatsPref.Prestige) {
		var possiblePresMax = Math.floor(Game.HowMuchPrestige(Game.cookiesEarned + Game.cookiesReset + Addon.WrinkBank + (choEgg ? Addon.lastChoEgg : 0)));
		var neededCook = Game.HowManyCookiesReset(possiblePresMax + 1) - (Game.cookiesEarned + Game.cookiesReset + Addon.WrinkBank + (choEgg ? Addon.lastChoEgg : 0));

		stats.appendChild(listing(listingQuest('Prestige Level (CUR / MAX)', 'PrestMaxTooltipPlaceholder'),  document.createTextNode(Beautify(Game.prestige) + ' / ' + Beautify(possiblePresMax))));
		var cookiesNextFrag = document.createDocumentFragment();
		cookiesNextFrag.appendChild(document.createTextNode(Beautify(neededCook)));
		var cookiesNextSmall = document.createElement('small');
		cookiesNextSmall.textContent = ' (' + (Addon.FormatTime(neededCook / Addon.AvgCPSChoEgg, 1)) + ')';
		cookiesNextFrag.appendChild(cookiesNextSmall);
		stats.appendChild(listing(listingQuest('Cookies To Next Level', 'NextPrestTooltipPlaceholder'), cookiesNextFrag));
		stats.appendChild(listing(listingQuest('Heavenly Chips (CUR / MAX)', 'HeavenChipMaxTooltipPlaceholder'),  document.createTextNode(Beautify(Game.heavenlyChips) + ' / ' + Beautify((possiblePresMax - Game.prestige) + Game.heavenlyChips))));
		var resetBonus = Addon.ResetBonus(possiblePresMax);
		var resetFrag = document.createDocumentFragment();
		resetFrag.appendChild(document.createTextNode(Beautify(resetBonus)));
		var increase = Math.round(resetBonus / Game.cookiesPs * 10000);
		if (isFinite(increase) && increase != 0) {
			var resetSmall = document.createElement('small');
			resetSmall.textContent = ' (' + (increase / 100) + '% of income)';
			resetFrag.appendChild(resetSmall);
		}
		stats.appendChild(listing(listingQuest('Reset Bonus Income', 'ResetTooltipPlaceholder'), resetFrag));
	}
		
	if (Game.cpsSucked > 0) {
		stats.appendChild(header('Wrinklers', 'Wrink'));			
		if (Addon.StatsPref.Wrink) {
			var popAllFrag = document.createDocumentFragment();
			popAllFrag.appendChild(document.createTextNode(Beautify(Addon.WrinkBank) + ' '));
			var popAllA = document.createElement('a');
			popAllA.textContent = 'Pop All';
			popAllA.className = 'option';
			popAllA.onclick = function() { Addon.CollectWrinklers(); };
			popAllFrag.appendChild(popAllA);
			stats.appendChild(listing('Rewards of Popping',  popAllFrag));
		}
	}
	
	var specDisp = false;
	var halloCook = [];
	for (var i in Addon.HalloCookies) {
		if (!Game.Has(Addon.HalloCookies[i])) {
			halloCook.push(Addon.HalloCookies[i]);
			specDisp = true;
		}
	}
	var christCook = [];
	for (var i in Addon.ChristCookies) {
		if (!Game.Has(Addon.ChristCookies[i])) {
			christCook.push(Addon.ChristCookies[i]);
			specDisp = true;
		}
	}
	var valCook = [];
	for (var i in Addon.ValCookies) {
		if (!Game.Has(Addon.ValCookies[i])) {
			valCook.push(Addon.ValCookies[i]);
			specDisp = true;
		}
	}
	var normEggs = [];
	for (var i in Game.eggDrops) {
		if (!Game.HasUnlocked(Game.eggDrops[i])) {
			normEggs.push(Game.eggDrops[i]);
			specDisp = true;
		}
	}
	var rareEggs = [];
	for (var i in Game.rareEggDrops) {
		if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
			rareEggs.push(Game.rareEggDrops[i]);
			specDisp = true;
		}
	}
	
	var centEgg = Game.Has('Century egg');
	
	if (Game.season == 'christmas' || specDisp || choEgg || centEgg) {
		stats.appendChild(header('Season Specials', 'Sea'));
		if (Addon.StatsPref.Sea) {
			if (specDisp) {
				var createSpecDisp = function(theSpecDisp) {
					var frag = document.createDocumentFragment();
					frag.appendChild(document.createTextNode(theSpecDisp.length + ' '));
					var span = document.createElement('span');
					span.onmouseout = function() { Game.tooltip.hide(); };
					var placeholder = document.createElement('div');
					var missing = document.createElement('div');
					missing.style.minWidth = '140px';
					missing.style.marginBottom = '4px';
					var title = document.createElement('div');
					title.className = 'name';
					title.style.marginBottom = '4px';
					title.style.textAlign = 'center';
					title.textContent = 'Missing';
					missing.appendChild(title);
					for (var i in theSpecDisp) {
						var div = document.createElement('div');
						div.style.textAlign = 'center';
						div.appendChild(document.createTextNode(theSpecDisp[i]));
						missing.appendChild(div);
					}
					placeholder.appendChild(missing);
					span.onmouseover = function() {Game.tooltip.draw(this, escape(placeholder.innerHTML));};
					span.style.cursor = 'default';
					span.style.display = 'inline-block';
					span.style.height = '10px';
					span.style.width = '10px';
					span.style.borderRadius = '5px';
					span.style.textAlign = 'center';
					span.style.backgroundColor = '#C0C0C0';
					span.style.color = 'black';
					span.style.fontSize = '9px';
					span.style.verticalAlign = 'bottom';
					span.textContent = '?';
					frag.appendChild(span);
					return frag;
				}
				if (halloCook.length != 0) stats.appendChild(listing('Halloween Cookies Left to Buy', createSpecDisp(halloCook)));
				if (christCook.length != 0) stats.appendChild(listing('Christmas Cookies Left to Buy',  createSpecDisp(christCook)));
				if (valCook.length != 0) stats.appendChild(listing('Valentine Cookies Left to Buy',  createSpecDisp(valCook)));
				if (normEggs.length != 0) stats.appendChild(listing('Normal Easter Eggs Left to Unlock',  createSpecDisp(normEggs)));
				if (rareEggs.length != 0) stats.appendChild(listing('Rare Easter Eggs Left to Unlock',  createSpecDisp(rareEggs)));
			}

			if (Game.season == 'christmas') stats.appendChild(listing('Reindeer Reward',  document.createTextNode(Beautify(Addon.SeaSpec))));
			if (choEgg) {
				stats.appendChild(listing(listingQuest('Chocolate Egg Cookies', 'ChoEggTooltipPlaceholder'), document.createTextNode(Beautify(Addon.lastChoEgg))));
			}
			if (centEgg) {
				stats.appendChild(listing('Century Egg Multiplier', document.createTextNode((Math.round((Addon.CentEgg - 1) * 10000) / 100) + '%')));
			}				
		}
	}
	
	stats.appendChild(header('Miscellaneous', 'Misc'));
	if (Addon.StatsPref.Misc) {
		stats.appendChild(listing('Average Cookies Per Second (Past ' + Addon.times[Addon.AvgCPSHist] + (Addon.AvgCPSHist == 0 ? ' minute' : ' minutes') + ')', document.createTextNode(Beautify(Addon.AvgCPS, 3))));
		stats.appendChild(listing('Average Cookie Clicks Per Second (Past ' + Addon.times[Addon.AvgClicksHist] + (Addon.AvgClicksHist == 0 ? ' second' : ' seconds') + ')', document.createTextNode(Beautify(Addon.AvgClicks, 1))));
		stats.appendChild(listing('Missed Golden Cookies', document.createTextNode(Beautify(Game.missedGoldenClicks))));
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);
}

Addon.AddMenu = function() {
	var title = function() {
		var div = document.createElement('div');
		div.className = 'title ' + Addon.colorTextPre + Addon.colorBlue;
		div.textContent = 'Cookie Monster Goodies';
		return div;
	}
	
	if (Game.onMenu == 'prefs') {
		Addon.AddMenuPref(title);
	}
	else if (Addon.Stats == 1 && Game.onMenu == 'stats') {
		Addon.AddMenuStats(title);
	}
}

Addon.RefreshMenu = function() {
	if (Addon.UpStats && Game.onMenu == 'stats' && (Game.drawT - 1) % (Game.fps * 5) != 0 && (Game.drawT - 1) % Game.fps == 0) Game.UpdateMenu();
}

Addon.UpdateTooltipLocation = function() {
	if (Game.tooltip.origin == 'store') {
		var warnCautOffset = 0;
		if (Addon.ToolWarnCaut == 1 && Addon.ToolWarnCautPos == 1) warnCautOffset = Addon.TooltipWarnCaut.clientHeight - 4;
		Game.tooltip.tta.style.top = Math.min(parseInt(Game.tooltip.tta.style.top), (l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - warnCautOffset - 46) + 'px';
	}
	// Kept for future possible use if the code changes again
	/*else if (!Game.onCrate && !Game.OnAscend && Addon.TimerBar == 1 && Addon.TimerBarPos == 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(Addon.TimerBar.style.height)) + 'px';
	}*/
}

Addon.CreateTooltipWarnCaut = function() {
	Addon.TooltipWarnCaut = document.createElement('div');
	Addon.TooltipWarnCaut.style.position = 'absolute';
	Addon.TooltipWarnCaut.style.display = 'none';
	Addon.TooltipWarnCaut.style.left = 'auto';
	Addon.TooltipWarnCaut.style.bottom = 'auto';
	
	var create = function(boxId, color, labelTextFront, labelTextBack, deficitId) {
		var box = document.createElement('div');
		box.id = boxId;
		box.style.display = 'none';
		box.style.WebkitTransition = 'opacity 0.1s ease-out';
		box.style.MozTransition = 'opacity 0.1s ease-out';
		box.style.MsTransition = 'opacity 0.1s ease-out';
		box.style.OTransition = 'opacity 0.1s ease-out';
		box.style.transition = 'opacity 0.1s ease-out';
		box.className = Addon.colorBorderPre + color;
		box.style.padding = '2px';
		box.style.background = '#000 url(img/darkNoise.png)';
		var labelDiv = document.createElement('div');
		box.appendChild(labelDiv);
		var labelSpan = document.createElement('span');
		labelSpan.className = Addon.colorTextPre + color;
		labelSpan.style.fontWeight = 'bold';
		labelSpan.textContent = labelTextFront;
		labelDiv.appendChild(labelSpan);
		labelDiv.appendChild(document.createTextNode(labelTextBack));
		var deficitDiv = document.createElement('div');
		box.appendChild(deficitDiv);
		var deficitSpan = document.createElement('span');
		deficitSpan.id = deficitId;
		deficitDiv.appendChild(document.createTextNode('Deficit: '));
		deficitDiv.appendChild(deficitSpan);
		return box;
	}
	Addon.TooltipWarnCaut.appendChild(create('CMDispTooltipWarn', Addon.colorRed, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!"', 'CMDispTooltipWarnText'));
	Addon.TooltipWarnCaut.firstChild.style.marginBottom = '4px';
	Addon.TooltipWarnCaut.appendChild(create('CMDispTooltipCaut', Addon.colorYellow, 'Caution: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)', 'CMDispTooltipCautText'));

	l('tooltipAnchor').appendChild(Addon.TooltipWarnCaut);
}

Addon.ToggleToolWarnCaut = function() {
	if (Addon.ToolWarnCaut == 1) {
		Addon.TooltipWarnCaut.style.display = 'block';
	}
	else {
		Addon.TooltipWarnCaut.style.display = 'none';
	}
}

Addon.ToggleToolWarnCautPos = function() {
	if (Addon.ToolWarnCautPos == 0) {
		Addon.TooltipWarnCaut.style.top = 'auto';
		Addon.TooltipWarnCaut.style.margin = '4px -4px';
		Addon.TooltipWarnCaut.style.padding = '3px 4px';
	}
	else {
		Addon.TooltipWarnCaut.style.right = 'auto';
		Addon.TooltipWarnCaut.style.margin = '4px';
		Addon.TooltipWarnCaut.style.padding = '4px 3px';
	}
}

Addon.AddTooltipBuild = function() {
	Addon.TooltipBuildBack = [];
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		if (l('product' + me.id).onmouseover != null) {
			Addon.TooltipBuildBack[i] = l('product' + me.id).onmouseover;
			eval('l(\'product\' + me.id).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return Addon.Tooltip(\'b\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}');
		}
	}
}

Addon.AddTooltipUpgrade = function() {
	Addon.TooltipUpgradeBack = [];
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).onmouseover != null) {
			Addon.TooltipUpgradeBack[i] = l('upgrade' + i).onmouseover;
			eval('l(\'upgrade\' + i).onmouseover = function() {if (!Game.mouseDown) {Game.setOnCrate(this); Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return Addon.Tooltip(\'u\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}}');
		}
	}
}

Addon.Tooltip = function(type, name) {
	if (type == 'b') {
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		if (Addon.TooltipAmor == 1) {
			var buildPrice = Addon.BuildingGetPrice(Game.Objects[name].basePrice, 0, Game.Objects[name].free, Game.Objects[name].amount);
			var amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split('so far</div>').join('so far<br/>&bull; <b>' + Beautify(amortizeAmount) + '</b> ' + (Math.floor(amortizeAmount) == 1 ? 'cookie' : 'cookies') + ' left to amortize (' + Addon.GetTimeColor(buildPrice, Game.Objects[name].totalCookies, (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text + ')</div>');		
			}
		}
		if (Game.buyMode == 1) {
			var target = '';
			var change = false;
			if (Game.buyBulk == 10) {
				target = 'Objects10';
				change = true;
			}
			else if (Game.buyBulk == 100) {
				target = 'Objects100';
				change = true;
			}
			if (change) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join(Beautify(Addon.Cache[target][name].price));
			}
		}
		else if (Game.buyMode == -1) {
			if (Game.buyBulk == -1) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(Addon.BuildingSell(Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.Objects[name].amount, 0)));
			}
			else {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(Addon.BuildingSell(Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.buyBulk, 0)));
			}
		}
	}
	else { // Upgrades
		if (!Game.UpgradesInStore[name]) return '';
		l('tooltip').innerHTML = Game.crate(Game.UpgradesInStore[name], 'store', undefined, undefined, 1)();
	}
	
	var area = document.createElement('div');
	area.id = 'CMTooltipArea';
	l('tooltip').appendChild(area);
	
	if (Addon.Tooltip == 1 && (type != 'b' || Game.buyMode == 1)) {
		l('tooltip').firstChild.style.paddingBottom = '4px';
		var tooltip = document.createElement('div');
		tooltip.style.border = '1px solid';
		tooltip.style.padding = '4px';
		tooltip.style.margin = '0px -4px';
		tooltip.id = 'CMTooltipBorder';
		
		var header = function(text) {
			var div = document.createElement('div');
			div.style.fontWeight = 'bold';
			div.className = Addon.colorTextPre + Addon.colorBlue;
			div.textContent = text;
			return div;
		}
		tooltip.appendChild(header('Bonus Income'));
		var income = document.createElement('div');
		income.style.marginBottom = '4px';
		income.style.color = 'white';
		income.id = 'CMTooltipIncome';
		tooltip.appendChild(income);
		tooltip.appendChild(header('Payback Period'));
		var pp = document.createElement('div');
		pp.style.marginBottom = '4px';
		pp.id = 'CMTooltipPP';
		tooltip.appendChild(pp);
		tooltip.appendChild(header('Time Left'));
		var time = document.createElement('div');
		time.id = 'CMTooltipTime';
		tooltip.appendChild(time);
		
		l('tooltip').appendChild(tooltip);
	}
	
	Addon.tooltipType = type;
	Addon.tooltipName = name;

	Addon.UpdateTooltip();
	
	return l('tooltip').innerHTML;
}

Addon.UpdateTooltip = function() {
	if (l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		
		// Error checking
		if (Addon.tooltipType == 'u' && (typeof Game.UpgradesInStore[Addon.tooltipName] === 'undefined' || typeof Addon.Upgrades[Game.UpgradesInStore[Addon.tooltipName].name] === 'undefined')) {
			return;
		}
		var price;
		var bonus;
		if (Addon.tooltipType == 'b') {
			var target = '';
			if (Game.buyMode == 1 && Game.buyBulk == 10) {
				target = 'Objects10';
				price = Addon.Cache[target][Addon.tooltipName].price;
			}
			else if (Game.buyMode == 1 && Game.buyBulk == 100) {
				target = 'Objects100';
				price = Addon.Cache[target][Addon.tooltipName].price;
			}
			else {
				target = 'Objects';
				price = Game.Objects[Addon.tooltipName].getPrice();
			}
			bonus = Addon.Cache[target][Addon.tooltipName].bonus;
			if (Addon.Tooltip == 1 && Game.buyMode == 1) {
				l('CMTooltipBorder').className = Addon.colorTextPre + Addon.Cache[target][Addon.tooltipName].color;
				l('CMTooltipPP').textContent = Beautify(Addon.Cache[target][Addon.tooltipName].pp, 2);
				l('CMTooltipPP').className = Addon.colorTextPre + Addon.Cache[target][Addon.tooltipName].color;
			}
		}
		else { // Upgrades
			bonus = Addon.Upgrades[Game.UpgradesInStore[Addon.tooltipName].name].bonus;
			price = Game.Upgrades[Game.UpgradesInStore[Addon.tooltipName].name].getPrice();
			if (Addon.Tooltip == 1) {
				l('CMTooltipBorder').className = Addon.colorTextPre + Addon.Upgrades[Game.UpgradesInStore[Addon.tooltipName].name].color;
				l('CMTooltipPP').textContent = Beautify(Addon.Upgrades[Game.UpgradesInStore[Addon.tooltipName].name].pp, 2);
				l('CMTooltipPP').className = Addon.colorTextPre + Addon.Upgrades[Game.UpgradesInStore[Addon.tooltipName].name].color;
			}
		}
		if (Addon.Tooltip == 1 && (Addon.tooltipType != 'b' || Game.buyMode == 1)) {
			l('CMTooltipIncome').textContent = Beautify(bonus, 2);
			
			var increase = Math.round(bonus / Game.cookiesPs * 10000);
			if (isFinite(increase) && increase != 0) {
				l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
			}
		
			var timeColor = Addon.GetTimeColor(price, (Game.cookies + Addon.GetWrinkConfigBank()), Addon.GetCPS());
			l('CMTooltipTime').textContent = timeColor.text;
			l('CMTooltipTime').className = Addon.colorTextPre + timeColor.color;
		}
		
		if (Addon.ToolWarnCaut == 1) {
			var warn = Addon.Lucky;
			if (Addon.ToolWarnCautBon == 1) {
				var bonusNoFren = bonus;
				bonusNoFren /= Addon.getCPSBuffMult();
				warn += ((bonusNoFren * 60 * 15) / 0.15);
			}
			var caut = warn * 7;
			var amount = (Game.cookies + Addon.GetWrinkConfigBank()) - price;
			if ((amount < warn || amount < caut) && (Addon.tooltipType != 'b' || Game.buyMode == 1)) {
				if (Addon.ToolWarnCautPos == 0) {
					Addon.TooltipWarnCaut.style.right = '0px';
				}
				else {
					Addon.TooltipWarnCaut.style.top = (l('tooltip').offsetHeight) + 'px';
				}
				Addon.TooltipWarnCaut.style.width = (l('tooltip').offsetWidth - 6) + 'px';
			
				if (amount < warn) {
					l('CMDispTooltipWarn').style.display = '';
					l('CMDispTooltipWarnText').textContent = Beautify(warn - amount) + ' (' + Addon.FormatTime((warn - amount) / Addon.GetCPS()) + ')';
					l('CMDispTooltipCaut').style.display = '';
					l('CMDispTooltipCautText').textContent = Beautify(caut - amount) + ' (' + Addon.FormatTime((caut - amount) / Addon.GetCPS()) + ')';
				}
				else if (amount < caut) {
					l('CMDispTooltipCaut').style.display = '';
					l('CMDispTooltipCautText').textContent = Beautify(caut - amount) + ' (' + Addon.FormatTime((caut - amount) / Addon.GetCPS()) + ')';
					l('CMDispTooltipWarn').style.display = 'none';
				}
				else {
					l('CMDispTooltipWarn').style.display = 'none';
					l('CMDispTooltipCaut').style.display = 'none';
				}
			}
			else {
				l('CMDispTooltipWarn').style.display = 'none';
				l('CMDispTooltipCaut').style.display = 'none';
			}
		}
	}
}

Addon.DrawTooltipWarnCaut = function() {
	if (Addon.ToolWarnCaut == 1) {
		l('CMDispTooltipWarn').style.opacity = '0';
		l('CMDispTooltipCaut').style.opacity = '0';
	}
}

Addon.UpdateTooltipWarnCaut = function() {
	if (Addon.ToolWarnCaut == 1 && l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		l('CMDispTooltipWarn').style.opacity = '1';
		l('CMDispTooltipCaut').style.opacity = '1';
	}
}

Addon.AddWrinklerAreaDetect = function() {
	l('backgroundLeftCanvas').onmouseover = function() {Addon.TooltipWrinklerArea = 1;};
	l('backgroundLeftCanvas').onmouseout = function() {
		Addon.TooltipWrinklerArea = 0;
		Game.tooltip.hide();
		for (var i in Game.wrinklers) {
			Addon.TooltipWrinklerCache[i] = 0;
		}
	};
}

Addon.CheckWrinklerTooltip = function() {
	if (Addon.ToolWrink == 1 && Addon.TooltipWrinklerArea == 1) {
		var showingTooltip = false;
		var mouseInWrinkler = function (x, y, rect) {
			var dx = x + Math.sin(-rect.r) * (-(rect.h / 2 - rect.o)), dy = y + Math.cos(-rect.r) * (-(rect.h / 2 - rect.o));
			var h1 = Math.sqrt(dx * dx + dy * dy);
			var currA = Math.atan2(dy, dx);
			var newA = currA - rect.r;
			var x2 = Math.cos(newA) * h1;
			var y2 = Math.sin(newA) * h1;
			if (x2 > -0.5 * rect.w && x2 < 0.5 * rect.w && y2 > -0.5 * rect.h && y2 < 0.5 * rect.h) return true;
			return false;
		}
		for (var i in Game.wrinklers) {
			var me = Game.wrinklers[i];
			var rect = {w: 100, h: 200, r: (-me.r) * Math.PI / 180, o: 10};
			if (me.phase > 0 && Game.LeftBackground && Game.mouseX < Game.LeftBackground.canvas.width && mouseInWrinkler(Game.mouseX - me.x, Game.mouseY - me.y, rect)) {
				showingTooltip = true;
				if (Addon.TooltipWrinklerCache[i] == 0) {
					var placeholder = document.createElement('div');
					var wrinkler = document.createElement('div');
					wrinkler.style.minWidth = '120px';
					wrinkler.style.marginBottom = '4px';
					var div = document.createElement('div');
					div.style.textAlign = 'center';
					div.id = 'CMTooltipWrinkler';
					wrinkler.appendChild(div);
					placeholder.appendChild(wrinkler);
					Game.tooltip.draw(this, escape(placeholder.innerHTML));
					Addon.TooltipWrinkler = i;
					Addon.TooltipWrinklerCache[i] = 1;
				}
				else break;
			}
			else {
				Addon.TooltipWrinklerCache[i] = 0;
			}
		}
		if (!showingTooltip) {
			Game.tooltip.hide();
		}
	}
}

Addon.UpdateWrinklerTooltip = function() {
	if (Addon.ToolWrink == 1 && l('CMTooltipWrinkler') != null) {
		var sucked = Game.wrinklers[Addon.TooltipWrinkler].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[Addon.TooltipWrinkler].type == 1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		l('CMTooltipWrinkler').textContent = Beautify(sucked);
	}
}

Addon.UpdateAscendState = function() {
	if (Game.OnAscend) {
		l('game').style.bottom = '0px';
		if (Addon.BotBar == 1) Addon.BotBar.style.display = 'none';
		if (Addon.TimerBar == 1) Addon.TimerBar.style.display = 'none';
	}
	else {
		Addon.ToggleBotBar();
		Addon.ToggleTimerBar();
	}

	Addon.UpdateBackground();
}

Addon.ToggleSayTime = function() {
	if (Addon.SayTime == 1) {
		Game.sayTime = Addon.sayTime;
	}
	else {
		Game.sayTime = Addon.sayTime;
	}
}

Addon.RefreshScale = function() {
	BeautifyAll();
	Game.RefreshStore();
	Game.RebuildUpgrades();

	Addon.UpdateBotBarOther();
	Addon.UpdateBuildings();
	Addon.UpdateUpgrades();
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
Addon.colors = [Addon.colorBlue, Addon.colorGreen, Addon.colorYellow, Addon.colorOrange, Addon.colorRed, Addon.colorPurple, Addon.colorGray, Addon.colorPink, Addon.colorBrown];
Addon.buffColors = {'Frenzy': Addon.colorYellow, 'Dragon Harvest': Addon.colorBrown, 'Elder frenzy': Addon.colorGreen, 'Clot': Addon.colorRed, 'Click frenzy': Addon.colorBlue, 'Dragonflight': Addon.colorPink};
Addon.lastGoldenCookieState = 0;
Addon.lastSeasonPopupState = 0;
Addon.goldenShimmer;
Addon.seasonPopShimmer;
Addon.lastAscendState = -1;

Addon.times = [1, 5, 10, 15, 30];

Addon.metric = ['M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
Addon.shortScale = ['M', 'B', 'Tr', 'Quadr', 'Quint', 'Sext', 'Sept', 'Oct', 'Non', 'Dec', 'Undec', 'Duodec', 'Tredec'];

Addon.TooltipWrinklerArea = 0;
Addon.TooltipWrinkler = -1;
Addon.TooltipWrinklerCache = [];
for (var i in Game.wrinklers) {
	Addon.TooltipWrinklerCache[i] = 0;
}

/********
 * Main *
 ********/
 
Addon.ReplaceNative = function()
 {
	Addon.Beautify = Beautify;
	Beautify = Addon.Beautify;

	Addon.CalculateGains = Game.CalculateGains;
	Game.CalculateGains = function() {
		Addon.CalculateGains();
		Addon.DoSims = 1;
		Addon.Date = new Date().getTime();
	}
	
	Addon.tooltip = {};
	Addon.tooltip.draw = Game.tooltip.draw;
	eval('Addon.tooltip.drawMod = ' + Game.tooltip.draw.toString().split('this').join('Game.tooltip'));
	Game.tooltip.draw = function(from, text, origin) {
		Addon.tooltip.drawMod(from, text, origin);
		Addon.DrawTooltipWarnCaut();
	}
	
	Addon.tooltip.update = Game.tooltip.update;
	eval('Addon.tooltip.updateMod = ' + Game.tooltip.update.toString().split('this').join('Game.tooltip'));
	Game.tooltip.update = function() {
		Addon.tooltip.updateMod();
		Addon.UpdateTooltipWarnCaut();
		Addon.UpdateTooltipLocation();
	}
	
	Addon.UpdateSpecial = Game.UpdateSpecial;
	Game.UpdateSpecial = function() {
		if (Addon.TimerBar == 1 && Addon.TimerBarPos == 0) {
			var timerBarHeight = parseInt(Addon.TimerBar.style.height);
			Game.mouseY -= timerBarHeight;
			Addon.UpdateSpecial();
			Game.mouseY += timerBarHeight;
		}
		else {
			Addon.UpdateSpecial();
		}
	}
	
	Addon.RebuildUpgrades = Game.RebuildUpgrades;
	Game.RebuildUpgrades = function() {
		Addon.RebuildUpgrades();
		Addon.AddTooltipUpgrade();
		Game.CalculateGains();
	}
	
	Addon.UpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function() {
		if (typeof jscolor.picker === 'undefined' || typeof jscolor.picker.owner === 'undefined') {
			Addon.UpdateMenu();
			Addon.AddMenu();
		}
	}
	
	Addon.sayTime = Game.sayTime;
	Addon.sayTime = function(time, detail) {
		if (isNaN(time) || time <= 0) return Addon.sayTime(time, detail);
		else return Addon.FormatTime(time / Game.fps, 1);
	}
	
	Addon.Loop = Game.Loop;
	Game.Loop = function() {
		Addon.Loop();
		Addon.Loop();
	}
	
	Addon.Logic = Game.Logic;
	eval('Addon.LogicMod = ' + Game.Logic.toString().split('document.title').join('Addon.Title'));	
	Game.Logic = function() {
		Addon.LogicMod();
		
		// Update Title
		Addon.UpdateTitle();
	}
}

Addon.Loop = function() {
	if (Addon.lastAscendState != Game.OnAscend) {
		Addon.lastAscendState = Game.OnAscend;
		Addon.UpdateAscendState();
	}
	if (!Game.OnAscend && Game.AscendTimer == 0) {
		if (Addon.DoSims) {		
			Addon.RemakeIncome();
			
			Addon.NoGoldSwitchCookiesPS(); // Needed first
			Addon.RemakeLucky();
			Addon.RemakeChain();
			
			Addon.RemakeSeaSpec();
			Addon.RemakeSellForChoEgg();
		
			Addon.DoSims = 0;
		}
		
		// Check for aura change to recalculate buildings prices
		var hasFierHoard = Game.hasAura('Fierce Hoarder');
		if (!Addon.HadFierHoard && hasFierHoard) {
			Addon.HadFierHoard = true;
			Addon.DoRemakeBuildPrices = 1;
		}
		else if (Addon.HadFierHoard && !hasFierHoard) {
			Addon.HadFierHoard = false;
			Addon.DoRemakeBuildPrices = 1;
		}
		
		if (Addon.DoRemakeBuildPrices) {
			Addon.RemakeBuildingsPrices();
			Addon.DoRemakeBuildPrices = 0;
		}
		
		// Update Wrinkler Bank
		Addon.RemakeWrinkBank();
		
		// Calculate PP
		Addon.RemakePP();

		// Update colors
		Addon.UpdateBotBarOther();
		Addon.UpdateBuildings();
		Addon.UpdateUpgrades();
		
		// Redraw timers
		Addon.UpdateBotBarTime();
		Addon.UpdateTimerBar();
	
		// Update Tooltip
		Addon.UpdateTooltip();

		// Update Wrinkler Tooltip
		Addon.CheckWrinklerTooltip();
		Addon.UpdateWrinklerTooltip();

		// Change menu refresh interval
		Addon.RefreshMenu();
	}
	
	// Check Golden Cookies
	Addon.CheckGoldenCookie();
	
	// Check Season Popup
	Addon.CheckSeasonPopup();

	// Update Average CPS (might need to move)
	Addon.UpdateAvgCPS()
}

Addon.Init = function() {
	var proceed = true;
	if (Game.version != Addon.VersionMajor) {
		proceed = confirm('Cookie Monster version ' + Addon.VersionMajor + '.' + Addon.VersionMinor + ' is meant for Game version ' + Addon.VersionMajor + '.  Loading a different version may cause errors.  Do you still want to load Cookie Monster?');
	}
	if (proceed) {
		Addon.AddQueue();
		Addon.AddJscolor();
		
		var delay = setInterval(function() {
			if (typeof Queue !== 'undefined' && typeof jscolor !== 'undefined') {
				Addon.DelayInit();
				clearInterval(delay);
			}
		}, 500);
	}
}

Addon.DelayInit = function() {
	Addon.InitData();
	Addon.CreateCssArea();
	Addon.CreateBotBar();
	Addon.CreateTimerBar();
	Addon.CreateUpgradeBar();
	Addon.CreateWhiteScreen();
	Addon.CreateFavicon();
	Addon.CreateGCTimer();
	Addon.CreateTooltip('GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px');
	Addon.CreateTooltip('PrestMaxTooltipPlaceholder', 'The MAX prestige is calculated with the cookies gained from popping all wrinklers, selling all buildings with Earth Shatterer aura, and buying Chocolate egg', '310px');
	Addon.CreateTooltip('NextPrestTooltipPlaceholder', 'Not calculated with cookies gained from wrinklers or Chocolate egg', '200px');
	Addon.CreateTooltip('HeavenChipMaxTooltipPlaceholder', 'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers, selling all buildings with Earth Shatterer aura, and buying Chocolate egg', '310px');
	Addon.CreateTooltip('ResetTooltipPlaceholder', 'The bonus income you would get from new prestige levels at 100% of its potential and from reset achievements if you have the same buildings/upgrades after reset', '340px');
	Addon.CreateTooltip('ChoEggTooltipPlaceholder', 'The amount of cookies you would get from popping all wrinklers, selling all buildings with Earth Shatterer aura, and then buying Chocolate egg', '300px');
	Addon.CreateTooltipWarnCaut();
	Addon.AddTooltipBuild();
	Addon.AddWrinklerAreaDetect();
	Addon.InitCookiesDiff();
	Addon.ReplaceNative();
	Game.CalculateGains();
	Addon.LoadConfig(); // Must be after all things are created!
	Addon.lastAscendState = Game.OnAscend;
	Addon.lastBuyMode = Game.buyMode;
	Addon.lastBuyBulk = Game.buyBulk;

	if (Game.prefs.popups) Game.Popup('Cookie Monster version ' + Addon.VersionMajor + '.' + Addon.VersionMinor + ' loaded!');
	else Game.Notify('Cookie Monster version ' + Addon.VersionMajor + '.' + Addon.VersionMinor + ' loaded!', '', '', 1, 1);

	Game.Win('Third-party');
}

Addon.ConfigDefault = {BotBar: 1, TimerBar: 1, TimerBarPos: 0, BuildColor: 1, BulkBuildColor: 0, UpBarColor: 1, CalcWrink: 1, CPSMode: 1, AvgCPSHist: 2, AvgClicksHist: 2, ToolWarnCautBon: 0, Flash: 1, Sound: 1,  Volume: 100, GCSoundURL: 'http://freesound.org/data/previews/66/66717_931655-lq.mp3', SeaSoundURL: 'http://www.freesound.org/data/previews/121/121099_2193266-lq.mp3', GCTimer: 1, Title: 1, Favicon: 1, Tooltip: 1, TooltipAmor: 0, ToolWarnCaut: 1, ToolWarnCautPos: 1, ToolWrink: 1, Stats: 1, UpStats: 1, TimeFormat: 0, SayTime: 1, Scale: 2, StatsPref: {Lucky: 1, Chain: 1, Prestige: 1, Wrink: 1, Sea: 1, Misc: 1}, Colors : {Blue: '#4bb8f0', Green: '#00ff00', Yellow: '#ffff00', Orange: '#ff7f00', Red: '#ff0000', Purple: '#ff00ff', Gray: '#b3b3b3', Pink: '#ff1493', Brown: '#8b4513'}};
Addon.ConfigPrefix = 'CMConfig';

Addon.VersionMajor = '2.002';
Addon.VersionMinor = '2';

/*******
 * Sim *
 *******/

Addon.BuildingGetPrice = function(basePrice, start, free, increase) {
	/*var price=0;
	for (var i = Math.max(0 , start); i < Math.max(0, start + increase); i++) {
		price += basePrice * Math.pow(Game.priceIncrease, Math.max(0, i - free));
	}
	if (Game.Has('Season savings')) price *= 0.99;
	if (Game.Has('Santa\'s dominion')) price *= 0.99;
	if (Game.Has('Faberge egg')) price *= 0.99;
	if (Game.Has('Divine discount')) price *= 0.99;
	if (Game.hasAura('Fierce Hoarder')) price *= 0.98;
	return Math.ceil(price);*/

	var moni = 0;
	for (var i = 0; i < increase; i++) {
		var price = basePrice * Math.pow(Game.priceIncrease, Math.max(0, start - free));
		if (Game.Has('Season savings')) price *= 0.99;
		if (Game.Has('Santa\'s dominion')) price *= 0.99;
		if (Game.Has('Faberge egg')) price *= 0.99;
		if (Game.Has('Divine discount')) price *= 0.99;
		if (Game.hasAura('Fierce Hoarder')) price *= 0.98;
		if (Game.hasBuff('Everything must go')) price *= 0.95;
		price = Math.ceil(price);
		moni+=price;
		start++;
	}
	return moni;
}

Addon.BuildingSell = function(basePrice, start, free, amount, emuAura) {
	/*var price=0;
	for (var i = Math.max(0, start - amount); i < Math.max(0, start); i++) {
		price += basePrice * Math.pow(Game.priceIncrease, Math.max(0, i - free));
	}
	if (Game.Has('Season savings')) price*=0.99;
	if (Game.Has('Santa\'s dominion')) price*=0.99;
	if (Game.Has('Faberge egg')) price*=0.99;
	if (Game.Has('Divine discount')) price*=0.99;
	if (Game.hasAura('Fierce Hoarder')) price*=0.98;
	if (Game.hasAura('Earth Shatterer') || emuAura) {
		price *= 0.85;
	}
	else {
		price *= 0.5;
	}
	return Math.ceil(price);*/

	var moni=0;
	for (var i = 0; i < amount; i++) {
		var price = basePrice * Math.pow(Game.priceIncrease, Math.max(0, start - free));
		if (Game.Has('Season savings')) price *= 0.99;
		if (Game.Has('Santa\'s dominion')) price *= 0.99;
		if (Game.Has('Faberge egg')) price *= 0.99;
		if (Game.Has('Divine discount')) price *= 0.99;
		if (Game.hasAura('Fierce Hoarder')) price *= 0.98;
		if (Game.hasBuff('Everything must go')) price *= 0.95;
		price = Math.ceil(price);
		var giveBack = 0.5;
		if (Game.hasAura('Earth Shatterer') || emuAura) giveBack=0.85;
		price = Math.floor(price * giveBack);
		if (start > 0) {
			moni += price;
			start--;
		}
	}
	return moni;
}

Addon.Has = function(what) {
	if (Game.ascensionMode == 1 && Game.Upgrades[what].pool == 'prestige') return 0;
	return (Addon.Upgrades[what] ? Addon.Upgrades[what].bought : 0);
}


Addon.Win = function(what) {
	if (Addon.Achievements[what]) {
		if (Addon.Achievements[what].won == 0) {
			Addon.Achievements[what].won = 1;
			if (Game.Achievements[what].pool != 'shadow') Addon.AchievementsOwned++;
		}
	}
}

eval('Addon.HasAchiev = ' + Game.HasAchiev.toString().split('Game').join('Addon.Sim'));

eval('Addon.GetHeavenlyMultiplier = ' + Game.GetHeavenlyMultiplier.toString().split('Game').join('Addon.Sim'));

Addon.hasAura = function(what) {
	if (Game.dragonAuras[Addon.dragonAura].name == what || Game.dragonAuras[Addon.dragonAura2].name == what) 
		return true; 
	else
		return false;
}

eval('Addon.GetTieredCpsMult = ' + Game.GetTieredCpsMult.toString().split('Game.Has').join('Addon.Has').split('me.tieredUpgrades').join('Game.Objects[me.name].tieredUpgrades').split('me.synergies').join('Game.Objects[me.name].synergies').split('syn.buildingTie1.amount').join('Addon.Objects[syn.buildingTie1.name].amount').split('syn.buildingTie2.amount').join('Addon.Objects[syn.buildingTie2.name].amount'));

eval('Addon.getGrandmaSynergyUpgradeMultiplier = ' + Game.getGrandmaSynergyUpgradeMultiplier.toString().split('Game.Objects[\'Grandma\']').join('Addon.Objects[\'Grandma\']'));

Addon.getCPSBuffMult = function() {
	var mult = 1;
	for (var i in Game.buffs) {
		if (typeof Game.buffs[i].multCpS != 'undefined') mult *= Game.buffs[i].multCpS;
	}
	return mult;
}

Addon.InitData = function() {
	// Buildings
	Addon.Objects = [];
	for (var i in Game.Objects) {
		Addon.Objects[i] = {};
		var me = Game.Objects[i];
		var you = Addon.Objects[i];
		eval('you.cps = ' + me.cps.toString().split('Game.Has').join('Addon.Has').split('Game.hasAura').join('Addon.hasAura').split('Game.Objects').join('Addon.Objects').split('Game.GetTieredCpsMult').join('Addon.GetTieredCpsMult').split('Game.getGrandmaSynergyUpgradeMultiplier').join('Addon.getGrandmaSynergyUpgradeMultiplier'));
		// Below is needed for above eval!
		you.baseCps = me.baseCps;
		you.name = me.name;
	}

	// Upgrades
	Addon.Upgrades = [];
	for (var i in Game.Upgrades) {
		Addon.Upgrades[i] = {};
	}

	// Achievements
	Addon.Achievements = [];
	for (var i in Game.Achievements) {
		Addon.Achievements[i] = {};
	}
}

Addon.CopyData = function() {
	// Other variables
	Addon.UpgradesOwned = Game.UpgradesOwned;
	Addon.pledges = Game.pledges;
	Addon.AchievementsOwned = Game.AchievementsOwned;
	Addon.heavenlyPower = Game.heavenlyPower;
	Addon.prestige = Game.prestige;
	Addon.dragonAura = Game.dragonAura;
	Addon.dragonAura2 = Game.dragonAura2;
	
	// Buildings
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		var you = Addon.Objects[i];
		you.amount = me.amount;
	}

	// Upgrades
	for (var i in Game.Upgrades) {
		var me = Game.Upgrades[i];
		var you = Addon.Upgrades[i];
		you.bought = me.bought;
	}

	// Achievements
	for (var i in Game.Achievements) {
		var me = Game.Achievements[i];
		var you = Addon.Achievements[i];
		you.won = me.won;
	}
};


Addon.CalculateGains = function() {
	Addon.cookiesPs = 0;
	var mult = 1;

	if (Game.ascensionMode != 1) mult += parseFloat(Addon.prestige) * 0.01 * Addon.heavenlyPower * Addon.GetHeavenlyMultiplier();

	var cookieMult = 0;
	for (var i in Game.cookieUpgrades) {
		var me = Game.cookieUpgrades[i];
		if (Addon.Has(me.name)) {
			mult *= (1 + (typeof(me.power) == 'function' ? me.power(me) : me.power) * 0.01);
		}
	}

	mult *= (1 + 0.01 * cookieMult);
	if (Addon.Has('Specialized chocolate chips')) mult *= 1.01;
	if (Addon.Has('Designer cocoa beans')) mult *= 1.02;
	if (Addon.Has('Underworld ovens')) mult *= 1.03;
	if (Addon.Has('Exotic nuts')) mult *= 1.04;
	if (Addon.Has('Arcane sugar')) mult *= 1.05;

	if (Addon.Has('Increased merriness')) mult *= 1.15;
	if (Addon.Has('Improved jolliness')) mult *= 1.15;
	if (Addon.Has('A lump of coal')) mult *= 1.01;
	if (Addon.Has('An itchy sweater')) mult *= 1.01;
	if (Addon.Has('Santa\'s dominion')) mult *= 1.2;

	if (Addon.Has('Santa\'s legacy')) mult *= 1 + (Game.santaLevel + 1) * 0.03;

	for (var i in Addon.Objects) {
		var me = Addon.Objects[i];
		Addon.cookiesPs += me.amount * (typeof(me.cps) == 'function' ? me.cps(me) : me.cps);
	}

	if (Addon.Has('"egg"')) Addon.cookiesPs += 9; // "egg"

	var milkMult=1;
	if (Addon.Has('Santa\'s milk and cookies')) milkMult *= 1.05;
	if (Addon.hasAura('Breath of Milk')) milkMult *= 1.05;
	if (Addon.Has('Kitten helpers')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.1 * milkMult);
	if (Addon.Has('Kitten workers')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.125 * milkMult);
	if (Addon.Has('Kitten engineers')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.15 * milkMult);
	if (Addon.Has('Kitten overseers')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.175 * milkMult);
	if (Addon.Has('Kitten managers')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.2 * milkMult);
	if (Addon.Has('Kitten accountants')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.2 * milkMult);
	if (Addon.Has('Kitten specialists')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.2 * milkMult);
	if (Addon.Has('Kitten experts')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.2 * milkMult);
	if (Addon.Has('Kitten angels')) mult *= (1 + (Addon.AchievementsOwned / 25) * 0.1 * milkMult);

	var eggMult = 1;
	if (Addon.Has('Chicken egg')) eggMult *= 1.01;
	if (Addon.Has('Duck egg')) eggMult *= 1.01;
	if (Addon.Has('Turkey egg')) eggMult *= 1.01;
	if (Addon.Has('Quail egg')) eggMult *= 1.01;
	if (Addon.Has('Robin egg')) eggMult *= 1.01;
	if (Addon.Has('Ostrich egg')) eggMult *= 1.01;
	if (Addon.Has('Cassowary egg')) eggMult *= 1.01;
	if (Addon.Has('Salmon roe')) eggMult *= 1.01;
	if (Addon.Has('Frogspawn')) eggMult *= 1.01;
	if (Addon.Has('Shark egg')) eggMult *= 1.01;
	if (Addon.Has('Turtle egg')) eggMult *= 1.01;
	if (Addon.Has('Ant larva')) eggMult *= 1.01;
	if (Addon.Has('Century egg')) {
		// The boost increases a little every day, with diminishing returns up to +10% on the 100th day
		var day = Math.floor((Addon.Date - Game.startDate) / 1000 / 10) * 10 / 60 / 60 / 24;
		day = Math.min(day, 100);
		Addon.CentEgg = 1 + (1 - Math.pow(1 - day / 100, 3)) * 0.1;
		eggMult *= Addon.CentEgg;
	}
	mult *= eggMult;
	
	if (Addon.hasAura('Radiant Appetite')) mult *= 2;
	
	var rawCookiesPs = Addon.cookiesPs * mult;
	for (var i in Game.CpsAchievements) {
		if (rawCookiesPs >= Game.CpsAchievements[i].threshold) Addon.Win(Game.CpsAchievements[i].name);
	}

	mult *= Addon.getCPSBuffMult();

	// Pointless?
	name = Game.bakeryName.toLowerCase();
	if (name == 'orteil') mult *= 0.99;
	else if (name == 'ortiel') mult *= 0.98; //or so help me

	if (Addon.Has('Elder Covenant')) mult *= 0.95;

	if (Addon.Has('Golden switch [off]')) {
		var goldenSwitchMult = 1.5;
		if (Addon.Has('Residual luck')) {
			var upgrades = ['Get lucky', 'Lucky day', 'Serendipity', 'Heavenly luck', 'Lasting fortune', 'Decisive fate'];
			for (var i in upgrades) {
				if (Addon.Has(upgrades[i])) goldenSwitchMult += 0.1;
			}
		}
		mult *= goldenSwitchMult;
	}

	Addon.cookiesPs *= mult;

	// TODO remove?
	// if (Game.hasBuff('Cursed finger')) Game.cookiesPs = 0;
};

Addon.CheckOtherAchiev = function() {
	var grandmas=0;
	if (Addon.Has('Farmer grandmas')) grandmas++;
	if (Addon.Has('Worker grandmas')) grandmas++;
	if (Addon.Has('Miner grandmas')) grandmas++;
	if (Addon.Has('Cosmic grandmas')) grandmas++;
	if (Addon.Has('Transmuted grandmas')) grandmas++;
	if (Addon.Has('Altered grandmas')) grandmas++;
	if (Addon.Has('Grandmas\' grandmas')) grandmas++;
	if (Addon.Has('Antigrandmas')) grandmas++;
	if (Addon.Has('Rainbow grandmas')) grandmas++;
	if (Addon.Has('Banker grandmas')) grandmas++;
	if (Addon.Has('Priestess grandmas')) grandmas++;
	if (Addon.Has('Witch grandmas')) grandmas++;
	if (!Addon.HasAchiev('Elder') && grandmas >= 7) Addon.Win('Elder');

	var buildingsOwned = 0;
	var mathematician = 1;
	var base10 = 1;
	var minAmount = 100000;
	for (var i in Addon.Objects) {
		buildingsOwned += Addon.Objects[i].amount;
		minAmount = Math.min(Addon.Objects[i].amount, minAmount);
		if (!Addon.HasAchiev('Mathematician')) {
			if (Addon.Objects[i].amount < Math.min(128, Math.pow(2, (Game.ObjectsById.length - Game.Objects[i].id) - 1))) mathematician = 0;
		}
		if (!Addon.HasAchiev('Base 10')) {
			if (Addon.Objects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id) * 10) base10 = 0;
		}
	}
	if (minAmount >= 1) Addon.Win('One with everything');
	if (mathematician == 1) Addon.Win('Mathematician');
	if (base10 == 1) Addon.Win('Base 10');
	if (minAmount >= 100) Addon.Win('Centennial');
	if (minAmount >= 150) Addon.Win('Centennial and a half');
	if (minAmount >= 200) Addon.Win('Bicentennial');
	if (minAmount >= 250) Addon.Win('Bicentennial and a half');

	if (buildingsOwned >= 100) Addon.Win('Builder');
	if (buildingsOwned >= 500) Addon.Win('Architect');
	if (buildingsOwned >= 1000) Addon.Win('Engineer');
	if (buildingsOwned >= 1500) Addon.Win('Lord of Constructs');
	
	if (Addon.UpgradesOwned >= 20) Addon.Win('Enhancer');
	if (Addon.UpgradesOwned >= 50) Addon.Win('Augmenter');
	if (Addon.UpgradesOwned >= 100) Addon.Win('Upgrader');
	if (Addon.UpgradesOwned >= 200) Addon.Win('Lord of Progress');
	
	if (buildingsOwned >= 3000 && Addon.UpgradesOwned >= 300) Addon.Win('Polymath');
	
	if (Addon.Objects['Cursor'].amount + Addon.Objects['Grandma'].amount >= 777) Addon.Win('The elder scrolls');
	
	var hasAllHalloCook = true;
	for (var i in Addon.HalloCookies) {
		if (!Addon.Has(Addon.HalloCookies[i])) hasAllHalloCook = false;
	}
	if (hasAllHalloCook) Addon.Win('Spooky cookies');

	var hasAllChristCook = true;
	for (var i in Addon.ChristCookies) {
		if (!Addon.Has(Addon.ChristCookies[i])) hasAllChristCook = false;
	}
	if (hasAllChristCook) Addon.Win('Let it snow');
}

Addon.BuyBuildings = function(amount, target) {	
	Addon.Cache[target] = [];
	for (var i in Game.Objects) {
		Addon.CopyData();
		var me = Addon.Objects[i];
		me.amount += amount;
		
		if (i == 'Cursor') {
			if (me.amount >= 1) Addon.Win('Click');
			if (me.amount >= 2) Addon.Win('Double-click');
			if (me.amount >= 50) Addon.Win('Mouse wheel');
			if (me.amount >= 100) Addon.Win('Of Mice and Men');
			if (me.amount >= 200) Addon.Win('The Digital');
			if (me.amount >= 300) Addon.Win('Extreme polydactyly');
			if (me.amount >= 400) Addon.Win('Dr. T');
			if (me.amount >= 500) Addon.Win('Thumbs, phalanges, metacarpals');
		}
		else {
			for (var j in Game.Objects[me.name].tieredAchievs) {
				if (me.amount >= Game.Tiers[Game.Objects[me.name].tieredAchievs[j].tier].achievUnlock) 
					Addon.Win(Game.Objects[me.name].tieredAchievs[j].name);
			}
		}
		
		var lastAchievementsOwned = Addon.AchievementsOwned;
		
		Addon.CalculateGains();
		
		Addon.CheckOtherAchiev();
		
		if (lastAchievementsOwned != Addon.AchievementsOwned) {
			Addon.CalculateGains();
		}
		
		Addon.Cache[target][i] = {};
		Addon.Cache[target][i].bonus = Addon.cookiesPs - Game.cookiesPs;
		if (amount != 1) {
			Addon.DoRemakeBuildPrices = 1;
		}
	}
}

Addon.BuyUpgrades = function() {
	Addon.Upgrades = [];
	for (var i in Game.Upgrades) {
		if (Game.Upgrades[i].pool == 'toggle' || (Game.Upgrades[i].bought == 0 && Game.Upgrades[i].unlocked && Game.Upgrades[i].pool != 'prestige')) {
			Addon.CopyData();
			var me = Addon.Upgrades[i];
			me.bought = 1;
			if (Game.CountsAsUpgradeOwned(Game.Upgrades[i].pool)) Addon.UpgradesOwned++;

			if (i == 'Elder Pledge') {
				Addon.pledges++;
				if (Addon.pledges > 0) Addon.Win('Elder nap');
				if (Addon.pledges >= 5) Addon.Win('Elder slumber');
			}
			else if (i == 'Elder Covenant') {
				Addon.Win('Elder calm')
			}
			else if (i == 'Eternal heart biscuits') {
				Addon.Win('Lovely cookies');
			}
			else if (i == 'Heavenly key') {
				Addon.Win('Wholesome');
			}
		
			var lastAchievementsOwned = Addon.AchievementsOwned;
		
			Addon.CalculateGains();
		
			Addon.CheckOtherAchiev();
		
			if (lastAchievementsOwned != Addon.AchievementsOwned) {
				Addon.CalculateGains();
			}
		
			Addon.Upgrades[i] = {};
			Addon.Upgrades[i].bonus = Addon.cookiesPs - Game.cookiesPs;
		}
	}
}

Addon.NoGoldSwitchCookiesPS = function() {
	if (Game.Has('Golden switch [off]')) {
		Addon.CopyData();
		Addon.Upgrades['Golden switch [off]'].bought = 0;
		Addon.CalculateGains();
		Addon.NoGoldSwitchCookiesPS = Addon.cookiesPs;
	}
	else Addon.NoGoldSwitchCookiesPS = Game.cookiesPs;
}

Addon.ResetBonus = function(possiblePresMax) {
	var lastAchievementsOwned = -1;
	
	// Calculate CPS with all Heavenly upgrades
	var curCPS = Game.cookiesPs;
	if (Addon.Upgrades['Heavenly chip secret'].bought == 0 || Addon.Upgrades['Heavenly cookie stand'].bought == 0 || Addon.Upgrades['Heavenly bakery'].bought == 0 || Addon.Upgrades['Heavenly confectionery'].bought == 0 || Addon.Upgrades['Heavenly key'].bought == 0) {
		Addon.CopyData();

		if (Addon.Upgrades['Heavenly chip secret'].bought == 0) {
			Addon.Upgrades['Heavenly chip secret'].bought = 1;
			Addon.UpgradesOwned++;
		}
		if (Addon.Upgrades['Heavenly cookie stand'].bought == 0) {
			Addon.Upgrades['Heavenly cookie stand'].bought = 1;
			Addon.UpgradesOwned++;
		}
		if (Addon.Upgrades['Heavenly bakery'].bought == 0) {
			Addon.Upgrades['Heavenly bakery'].bought = 1;
			Addon.UpgradesOwned++;
		}
		if (Addon.Upgrades['Heavenly confectionery'].bought == 0) {
			Addon.Upgrades['Heavenly confectionery'].bought = 1;
			Addon.UpgradesOwned++;
		}
		if (Addon.Upgrades['Heavenly key'].bought == 0) {
			Addon.Upgrades['Heavenly key'].bought = 1;
			Addon.UpgradesOwned++;
			Addon.Win('Wholesome');
		}
		
		lastAchievementsOwned = Addon.AchievementsOwned;

		Addon.CalculateGains();
	
		Addon.CheckOtherAchiev();
	
		if (lastAchievementsOwned != Addon.AchievementsOwned) {
			Addon.CalculateGains();
		}

		curCPS = Addon.cookiesPs;
	}
	
	Addon.CopyData();
	
	if (Game.cookiesEarned >= 1000000) Addon.Win('Sacrifice');
	if (Game.cookiesEarned >= 1000000000) Addon.Win('Oblivion');
	if (Game.cookiesEarned >= 1000000000000) Addon.Win('From scratch');
	if (Game.cookiesEarned >= 1000000000000000) Addon.Win('Nihilism');
	if (Game.cookiesEarned >= 1000000000000000000) Addon.Win('Dematerialize');
	if (Game.cookiesEarned >= 1000000000000000000000) Addon.Win('Nil zero zilch');
	if (Game.cookiesEarned >= 1000000000000000000000000) Addon.Win('Transcendence');
	if (Game.cookiesEarned >= 1000000000000000000000000000) Addon.Win('Obliterate');
	if (Game.cookiesEarned >= 1000000000000000000000000000000) Addon.Win('Negative void');
	if (Game.cookiesEarned >= 1000000000000000000000000000000000) Addon.Win('To crumbs, you say?');
	
	if (Addon.Upgrades['Heavenly chip secret'].bought == 0) {
		Addon.Upgrades['Heavenly chip secret'].bought = 1;
		Addon.UpgradesOwned++;
	}
	if (Addon.Upgrades['Heavenly cookie stand'].bought == 0) {
		Addon.Upgrades['Heavenly cookie stand'].bought = 1;
		Addon.UpgradesOwned++;
	}
	if (Addon.Upgrades['Heavenly bakery'].bought == 0) {
		Addon.Upgrades['Heavenly bakery'].bought = 1;
		Addon.UpgradesOwned++;
	}
	if (Addon.Upgrades['Heavenly confectionery'].bought == 0) {
		Addon.Upgrades['Heavenly confectionery'].bought = 1;
		Addon.UpgradesOwned++;
	}
	if (Addon.Upgrades['Heavenly key'].bought == 0) {
		Addon.Upgrades['Heavenly key'].bought = 1;
		Addon.UpgradesOwned++;
		Addon.Win('Wholesome');
	}
	
	Addon.prestige = possiblePresMax;
	
	lastAchievementsOwned = Addon.AchievementsOwned;

	Addon.CalculateGains();
	
	Addon.CheckOtherAchiev();
	
	if (lastAchievementsOwned != Addon.AchievementsOwned) {
		Addon.CalculateGains();
	}

	return (Addon.cookiesPs - curCPS);
}

/**********
 * Footer *
 **********/

Addon.Init();
