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
 
Addon.Cache.AddQueue = function() {
	Addon.Cache.Queue = document.createElement('script');
	Addon.Cache.Queue.type = 'text/javascript';
	Addon.Cache.Queue.setAttribute('src', 'http://aktanusa.github.io/CookieMonster/queue/queue.js');
	document.head.appendChild(Addon.Cache.Queue);
}

Addon.Cache.NextNumber = function(base) {
	var count = base > Math.pow(2, 53) ? Math.pow(2, Math.floor(Math.log(base) / Math.log(2)) - 53) : 1;
	while (base == base + count) {
		count = Addon.Cache.NextNumber(count);
	}
	return (base + count);
}

Addon.Cache.RemakeBuildingsPrices = function() {
	for (var i in Game.Objects) {
		Addon.Cache.Objects10[i].price = Addon.Sim.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 10);
		Addon.Cache.Objects100[i].price = Addon.Sim.BuildingGetPrice(Game.Objects[i].basePrice, Game.Objects[i].amount, Game.Objects[i].free, 100);
	}
}

Addon.Cache.RemakeIncome = function() {
	// Simulate Building Buys for 1 amount
	Addon.Sim.BuyBuildings(1, 'Objects');

	// Simulate Upgrade Buys
	Addon.Sim.BuyUpgrades();
	
	// Simulate Building Buys for 10 amount
	Addon.Sim.BuyBuildings(10, 'Objects10');
	
	// Simulate Building Buys for 100 amount
	Addon.Sim.BuyBuildings(100, 'Objects100');
}

Addon.Cache.RemakeWrinkBank = function() {
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
	Addon.Cache.WrinkBank = totalSucked;
}

Addon.Cache.RemakeBuildingsPP = function() {
	Addon.Cache.min = -1;
	Addon.Cache.max = -1;
	Addon.Cache.mid = -1;
	for (var i in Addon.Cache.Objects) {
		//Addon.Cache.Objects[i].pp = Game.Objects[i].getPrice() / Addon.Cache.Objects[i].bonus;
		Addon.Cache.Objects[i].pp = (Math.max(Game.Objects[i].getPrice() - (Game.cookies + Addon.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Objects[i].getPrice() / Addon.Cache.Objects[i].bonus);
		if (Addon.Cache.min == -1 || Addon.Cache.Objects[i].pp < Addon.Cache.min) Addon.Cache.min = Addon.Cache.Objects[i].pp;
		if (Addon.Cache.max == -1 || Addon.Cache.Objects[i].pp > Addon.Cache.max) Addon.Cache.max = Addon.Cache.Objects[i].pp;
	}
	Addon.Cache.mid = ((Addon.Cache.max - Addon.Cache.min) / 2) + Addon.Cache.min;
	for (var i in Addon.Cache.Objects) {
		var color = '';
		if (Addon.Cache.Objects[i].pp == Addon.Cache.min) color = Addon.Disp.colorGreen;
		else if (Addon.Cache.Objects[i].pp == Addon.Cache.max) color = Addon.Disp.colorRed;
		else if (Addon.Cache.Objects[i].pp > Addon.Cache.mid) color = Addon.Disp.colorOrange;
		else color = Addon.Disp.colorYellow;
		Addon.Cache.Objects[i].color = color;
	}
}

Addon.Cache.RemakeUpgradePP = function() {
	for (var i in Addon.Cache.Upgrades) {
		//Addon.Cache.Upgrades[i].pp = Game.Upgrades[i].getPrice() / Addon.Cache.Upgrades[i].bonus;
		Addon.Cache.Upgrades[i].pp = (Math.max(Game.Upgrades[i].getPrice() - (Game.cookies + Addon.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Game.Upgrades[i].getPrice() / Addon.Cache.Upgrades[i].bonus);
		if (isNaN(Addon.Cache.Upgrades[i].pp)) Addon.Cache.Upgrades[i].pp = 'Infinity';
		var color = '';
		if (Addon.Cache.Upgrades[i].pp <= 0 || Addon.Cache.Upgrades[i].pp == 'Infinity') color = Addon.Disp.colorGray;
		else if (Addon.Cache.Upgrades[i].pp < Addon.Cache.min) color = Addon.Disp.colorBlue;
		else if (Addon.Cache.Upgrades[i].pp == Addon.Cache.min) color = Addon.Disp.colorGreen;
		else if (Addon.Cache.Upgrades[i].pp == Addon.Cache.max) color = Addon.Disp.colorRed;
		else if (Addon.Cache.Upgrades[i].pp > Addon.Cache.max) color = Addon.Disp.colorPurple;
		else if (Addon.Cache.Upgrades[i].pp > Addon.Cache.mid) color = Addon.Disp.colorOrange;
		else color = Addon.Disp.colorYellow;
		Addon.Cache.Upgrades[i].color = color;
	}
}

Addon.Cache.RemakeBuildingsOtherPP = function(amount, target) {
	for (var i in Addon.Cache[target]) {
		//Addon.Cache[target][i].pp = Addon.Cache[target][i].price / Addon.Cache[target][i].bonus;
		Addon.Cache[target][i].pp = (Math.max(Addon.Cache[target][i].price - (Game.cookies + Addon.Disp.GetWrinkConfigBank()), 0) / Game.cookiesPs) + (Addon.Cache[target][i].price / Addon.Cache[target][i].bonus);
		var color = '';
		if (Addon.Cache[target][i].pp <= 0 || Addon.Cache[target][i].pp == 'Infinity') color = Addon.Disp.colorGray;
		else if (Addon.Cache[target][i].pp < Addon.Cache.min) color = Addon.Disp.colorBlue;
		else if (Addon.Cache[target][i].pp == Addon.Cache.min) color = Addon.Disp.colorGreen;
		else if (Addon.Cache[target][i].pp == Addon.Cache.max) color = Addon.Disp.colorRed;
		else if (Addon.Cache[target][i].pp > Addon.Cache.max) color = Addon.Disp.colorPurple;
		else if (Addon.Cache[target][i].pp > Addon.Cache.mid) color = Addon.Disp.colorOrange;
		else color = Addon.Disp.colorYellow;
		Addon.Cache[target][i].color = color;
	}
}

Addon.Cache.RemakePP = function() {
	// Buildings for 1 amount
	Addon.Cache.RemakeBuildingsPP();
	
	// Upgrades
	Addon.Cache.RemakeUpgradePP();
	
	// Buildings for 10 amount
	Addon.Cache.RemakeBuildingsOtherPP(10, 'Objects10');

	// Buildings for 100 amount
	Addon.Cache.RemakeBuildingsOtherPP(100, 'Objects100');	
}

Addon.Cache.RemakeLucky = function() {
	Addon.Cache.Lucky = (Addon.Cache.NoGoldSwitchCookiesPS * 60 * 15) / 0.15;
	Addon.Cache.Lucky /= Addon.Sim.getCPSBuffMult();
	Addon.Cache.LuckyReward = (Addon.Cache.Lucky * 0.15) + 13;
	Addon.Cache.LuckyFrenzy = Addon.Cache.Lucky * 7;
	Addon.Cache.LuckyRewardFrenzy = (Addon.Cache.LuckyFrenzy * 0.15) + 13;
}

Addon.Cache.MaxChainMoni = function(digit, maxPayout) {
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

Addon.Cache.RemakeChain = function() {
	var maxPayout = Addon.Cache.NoGoldSwitchCookiesPS * 60 * 60 * 6;
	maxPayout /= Addon.Sim.getCPSBuffMult();
	
	Addon.Cache.ChainReward = Addon.Cache.MaxChainMoni(7, maxPayout);
	
	Addon.Cache.ChainWrathReward = Addon.Cache.MaxChainMoni(6, maxPayout);
	
	if (maxPayout < Addon.Cache.ChainReward) {
		Addon.Cache.Chain = 0;
	}
	else {
		Addon.Cache.Chain = Addon.Cache.NextNumber(Addon.Cache.ChainReward) / 0.25;
	}
	if (maxPayout < Addon.Cache.ChainWrathReward) {
		Addon.Cache.ChainWrath = 0;
	}
	else {
		Addon.Cache.ChainWrath = Addon.Cache.NextNumber(Addon.Cache.ChainWrathReward) / 0.25;
	}
	
	Addon.Cache.ChainFrenzyReward = Addon.Cache.MaxChainMoni(7, maxPayout * 7);
	
	Addon.Cache.ChainFrenzyWrathReward = Addon.Cache.MaxChainMoni(6, maxPayout * 7);
	
	if ((maxPayout * 7) < Addon.Cache.ChainFrenzyReward) {
		Addon.Cache.ChainFrenzy = 0;
	}
	else {
		Addon.Cache.ChainFrenzy = Addon.Cache.NextNumber(Addon.Cache.ChainFrenzyReward) / 0.25;
	}
	if ((maxPayout * 7) < Addon.Cache.ChainFrenzyWrathReward) {
		Addon.Cache.ChainFrenzyWrath = 0;
	}
	else {
		Addon.Cache.ChainFrenzyWrath = Addon.Cache.NextNumber(Addon.Cache.ChainFrenzyWrathReward) / 0.25;
	}
}

Addon.Cache.RemakeSeaSpec = function() {
	if (Game.season == 'christmas') {
		var val = Game.cookiesPs * 60;
		if (Game.hasBuff('Elder frenzy')) val *= 0.5; // very sorry
		if (Game.hasBuff('Frenzy')) val *= 0.75; // I sincerely apologize		
		Addon.Cache.SeaSpec = Math.max(25, val);
		if (Game.Has('Ho ho ho-flavored frosting')) Addon.Cache.SeaSpec *= 2;
	}
}

Addon.Cache.RemakeSellForChoEgg = function() {
	if (Game.hasAura('Earth Shatterer') || Game.dragonLevel < 9) {
		var sellTotal = 0;
		for (var i in Game.Objects) {
			var me = Game.Objects[i];
			sellTotal += Addon.Sim.BuildingSell(me.basePrice, me.amount, me.free, me.amount, 0);
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
			sellTotal += Addon.Sim.BuildingSell(me.basePrice, amount, me.free, amount, 1);
		}
	}
	Addon.Cache.SellForChoEgg = sellTotal;
}

Addon.Cache.InitCookiesDiff = function() {
	Addon.Cache.CookiesDiff = new Queue();
	Addon.Cache.WrinkDiff = new Queue();
	Addon.Cache.ChoEggDiff = new Queue();
	Addon.Cache.ClicksDiff = new Queue();
}

Addon.Cache.UpdateAvgCPS = function() {
	var currDate = Math.floor(Date.now() / 1000);
	if (Addon.Cache.lastDate != currDate) {	
		var choEggTotal = Game.cookies + Addon.Cache.SellForChoEgg;
		if (Game.cpsSucked > 0) {
			choEggTotal += Addon.Cache.WrinkBank;
		}
		choEggTotal *= 0.05;

		if (Addon.Cache.lastDate != -1) {
			var timeDiff = currDate - Addon.Cache.lastDate
			var bankDiffAvg = Math.max(0, (Game.cookies - Addon.Cache.lastCookies)) / timeDiff;
			var wrinkDiffAvg = (Addon.Cache.WrinkBank - Addon.Cache.lastWrinkCookies) / timeDiff;
			var choEggDiffAvg = Math.max(0,(choEggTotal - Addon.Cache.lastChoEgg)) / timeDiff;
			var clicksDiffAvg = (Game.cookieClicks - Addon.Cache.lastClicks) / timeDiff;
			for (var i = 0; i < timeDiff; i++) {
				Addon.Cache.CookiesDiff.enqueue(bankDiffAvg);
				Addon.Cache.WrinkDiff.enqueue(wrinkDiffAvg);
				Addon.Cache.ChoEggDiff.enqueue(choEggDiffAvg);
				Addon.Cache.ClicksDiff.enqueue(clicksDiffAvg);		
			}
			// Assumes the queues are the same length
			while (Addon.Cache.CookiesDiff.getLength() > 1800) {
				Addon.Cache.CookiesDiff.dequeue();
				Addon.Cache.WrinkDiff.dequeue();
				Addon.Cache.ClicksDiff.dequeue();
			}
			
			while (Addon.Cache.ClicksDiff.getLength() > 30) {
				Addon.Cache.ClicksDiff.dequeue();
			}
		}
		Addon.Cache.lastDate = currDate;
		Addon.Cache.lastCookies = Game.cookies;
		Addon.Cache.lastWrinkCookies = Addon.Cache.WrinkBank;
		Addon.Cache.lastChoEgg = choEggTotal;
		Addon.Cache.lastClicks = Game.cookieClicks;
		
		var totalGainBank = 0;
		var totalGainWrink = 0;
		var totalGainChoEgg = 0;
		var cpsLength = Math.min(Addon.Cache.CookiesDiff.getLength(), Addon.Disp.times[Addon.Config.AvgCPSHist] * 60);
		// Assumes the queues are the same length 
		for (var i = Addon.Cache.CookiesDiff.getLength() - cpsLength; i < Addon.Cache.CookiesDiff.getLength(); i++) {
			totalGainBank += Addon.Cache.CookiesDiff.get(i);
			totalGainWrink += Addon.Cache.WrinkDiff.get(i);
			totalGainChoEgg += Addon.Cache.ChoEggDiff.get(i);
		}
		Addon.Cache.AvgCPS = (totalGainBank + (Addon.Config.CalcWrink ? totalGainWrink : 0)) / cpsLength;
		
		if ((Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg')) || Addon.Config.CalcWrink == 0) {
			Addon.Cache.AvgCPSChoEgg = (totalGainBank + totalGainWrink + totalGainChoEgg) / cpsLength;
		}
		else {
			Addon.Cache.AvgCPSChoEgg = Addon.Cache.AvgCPS;
		}

		var totalClicks = 0;
		var clicksLength = Math.min(Addon.Cache.ClicksDiff.getLength(), Addon.Disp.times[Addon.Config.AvgClicksHist]);
		for (var i = Addon.Cache.ClicksDiff.getLength() - clicksLength; i < Addon.Cache.ClicksDiff.getLength(); i++) {
			totalClicks += Addon.Cache.ClicksDiff.get(i);
		}
		Addon.Cache.AvgClicks = totalClicks / clicksLength;
	}
}

Addon.Cache.min = -1;
Addon.Cache.max = -1;
Addon.Cache.mid = -1;
Addon.Cache.WrinkBank = -1;
Addon.Cache.NoGoldSwitchCookiesPS = 0;
Addon.Cache.Lucky = 0;
Addon.Cache.LuckyReward = 0;
Addon.Cache.LuckyFrenzy = 0;
Addon.Cache.LuckyRewardFrenzy = 0;
Addon.Cache.SeaSpec = 0;
Addon.Cache.Chain = 0;
Addon.Cache.ChainWrath = 0;
Addon.Cache.ChainReward = 0;
Addon.Cache.ChainWrathReward = 0;
Addon.Cache.ChainFrenzy = 0;
Addon.Cache.ChainFrenzyWrath = 0;
Addon.Cache.ChainFrenzyReward = 0;
Addon.Cache.ChainFrenzyWrathReward = 0;
Addon.Cache.CentEgg = 0;
Addon.Cache.SellForChoEgg = 0;
Addon.Cache.Title = '';
Addon.Cache.HadFierHoard = false;
Addon.Cache.lastDate = -1;
Addon.Cache.lastCookies = -1;
Addon.Cache.lastWrinkCookies = -1;
Addon.Cache.lastChoEgg = -1;
Addon.Cache.lastClicks = -1;
Addon.Cache.CookiesDiff;
Addon.Cache.WrinkDiff;
Addon.Cache.ChoEggDiff;
Addon.Cache.ClicksDiff;
Addon.Cache.AvgCPS = -1;
Addon.Cache.AvgCPSChoEgg = -1;
Addon.Cache.AvgClicks = -1;

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
	l(Addon.ConfigPrefix + config).innerHTML = Addon.Disp.GetConfigDisplay(config);
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
	l(Addon.ConfigPrefix + config).innerHTML = Addon.Disp.GetConfigDisplay(config);
	Addon.SaveConfig(Addon.Config);
}

Addon.ToggleStatsConfig = function(config) {
	if (Addon.Config.StatsPref[config] == 0) {
		Addon.Config.StatsPref[config]++;
	}
	else {
		Addon.Config.StatsPref[config]--;
	}
	Addon.SaveConfig(Addon.Config);
}

Addon.ConfigData.Test = {label: ['Test OFF', 'Test ON'], desc: 'Test', toggle: true, func: function() {}};

/********
 * Data *
 ********/

Addon.Data.HalloCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
Addon.Data.ChristCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
Addon.Data.ValCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];

/********
 * Disp *
 ********/

Addon.Disp.FormatTime = function(time, format) {
	if (time == 'Infinity') return time;
	if (Addon.Config.TimeFormat) {
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

Addon.Disp.GetTimeColor = function(price, bank, cps) {
	var color;
	var text;
	if (bank >= price) {
		color = Addon.Disp.colorGreen;
		if (Addon.Config.TimeFormat) {
			text = '00:00:00:00:00';
		}
		else {
			text = 'Done!';
		}
	}
	else {
		var time = (price - bank) / cps;
		text = Addon.Disp.FormatTime(time);
		if (time > 300) {
			color =  Addon.Disp.colorRed;
		}
		else if (time > 60) {
			color =  Addon.Disp.colorOrange;
		}
		else {
			color =  Addon.Disp.colorYellow;
		}
	}
	return {text: text, color: color};
}

Addon.Disp.Beautify = function(num, frac) {
	if (Addon.Config.Scale != 0 && isFinite(num)) {
		var answer = '';
		var negative = false;
		if (num < 0) {
			num = Math.abs(num);
			negative = true;
		}
				
		for (var i = (Addon.Disp.shortScale.length - 1); i >= 0; i--) {
			if (i < Addon.Disp.metric.length && Addon.Config.Scale == 1) {
				if (num >= Math.pow(1000, i + 2)) {
					answer = (Math.floor(num / Math.pow(1000, i + 1)) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + Addon.Disp.metric[i];
					break;
				}
			}
			else if (Addon.Config.Scale > 1) {
				if (num >= Math.pow(1000, i + 2)) {
					answer = (Math.floor(num / Math.pow(1000, i + 1)) / 1000) + (Addon.Config.Scale == 2 ? (' ' + Addon.Disp.shortScale[i]) : ('e+' + ((i + 2) * 3)));
					break;
				}
			}
		}
		if (answer == '') {
			answer = Addon.Backup.Beautify(num, frac);
		}
		
		if (negative) {
			answer = '-' + answer;
		}
		return answer;
	}
	else {
		return Addon.Backup.Beautify(num, frac);
	}
}

Addon.Disp.GetWrinkConfigBank = function() {
	if (Addon.Config.CalcWrink)
		return Addon.Cache.WrinkBank;
	else
		return 0;
}

Addon.Disp.GetCPS = function() {
	if (Addon.Config.CPSMode)
		return Addon.Cache.AvgCPS;
	else
		return (Game.cookiesPs * (1 - Game.cpsSucked));
}

Addon.Disp.UpdateBackground = function() {
	Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
	Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
	Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
	Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
}

Addon.Disp.GetConfigDisplay = function(config) {
	return Addon.ConfigData[config].label[Addon.Config[config]];
}

Addon.Disp.AddJscolor = function() {
	Addon.Disp.Jscolor = document.createElement('script');
	Addon.Disp.Jscolor.type = 'text/javascript';
	Addon.Disp.Jscolor.setAttribute('src', 'http://aktanusa.github.io/CookieMonster/jscolor/jscolor.js');
	document.head.appendChild(Addon.Disp.Jscolor);
}

Addon.Disp.CreateCssArea = function() {
	Addon.Disp.Css = document.createElement('style');
	Addon.Disp.Css.type = 'text/css';

	document.head.appendChild(Addon.Disp.Css);
}

Addon.Disp.CreateTooltip = function(placeholder, text, minWidth) {
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

Addon.Disp.AddMenuPref = function()
{
	var title = function()
	{
		var div = document.createElement('div');
		div.className = 'title ' + Addon.Disp.colorTextPre + Addon.Disp.colorRed;
		div.textContent = 'Addon Options';
		return div;
	}
	var header = function(text)
	{
		var div = document.createElement('div');
		div.className = 'listing';
		div.style.padding = '5px 16px';
		div.style.opacity = '0.7';
		div.style.fontSize = '17px';
		div.style.fontFamily = '\"Kavoon\", Georgia, serif';
		div.textContent = text;
		return div;
	}
	var listing = function(config)
	{
		var div = document.createElement('div');
		div.className = 'listing';
		var a = document.createElement('a');
		if (Addon.ConfigData[config].toggle && Addon.Config[config] == 0)
			a.className = 'option off';
		else
			a.className = 'option';
		a.id = Addon.ConfigPrefix + config;
		a.onclick = function() {Addon.ToggleConfig(config);};
		a.textContent = Addon.Disp.GetConfigDisplay(config);
		div.appendChild(a);
		var label = document.createElement('label');
		label.textContent = Addon.ConfigData[config].desc;
		div.appendChild(label);
		return div;
	}
	var url = function(config)
	{
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
	var frag = document.createDocumentFragment();
	frag.appendChild(title());
}

Addon.Disp.AddMenuStats = function()
{
	var title = function()
	{
		var div = document.createElement('div');
		div.className = 'title ' + Addon.Disp.colorTextPre + Addon.Disp.colorPurple;
		div.textContent = 'Addon Stats';
		return div;
	}
	var header = function(text, config)
	{
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
		span.textContent = Addon.Config.StatsPref[config] ? '-' : '+';
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
	if (Addon.Config.StatsPref.Lucky) {
		var luckyColor = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.Lucky) ? Addon.Disp.colorRed : Addon.Disp.colorGreen;
		var luckyTime = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.Lucky) ? Addon.Disp.FormatTime((Addon.Cache.Lucky - (Game.cookies + Addon.Disp.GetWrinkConfigBank())) / Addon.Disp.GetCPS()) : '';
		var luckyColorFrenzy = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.LuckyFrenzy) ? Addon.Disp.colorRed : Addon.Disp.colorGreen;
		var luckyTimeFrenzy = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.LuckyFrenzy) ? Addon.Disp.FormatTime((Addon.Cache.LuckyFrenzy - (Game.cookies + Addon.Disp.GetWrinkConfigBank())) / Addon.Disp.GetCPS()) : '';
		var luckyCurBase = Math.min((Game.cookies + Addon.Disp.GetWrinkConfigBank()) * 0.15, Addon.Cache.NoGoldSwitchCookiesPS * 60 * 15) + 13;
		var luckyRewardMax = Addon.Cache.LuckyReward;
		var luckyRewardMaxWrath = Addon.Cache.LuckyReward;
		var luckyRewardFrenzyMax = Addon.Cache.LuckyRewardFrenzy;
		var luckyRewardFrenzyMaxWrath = Addon.Cache.LuckyRewardFrenzy;
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
		luckyReqSpan.className = Addon.Disp.colorTextPre + luckyColor;
		luckyReqSpan.textContent = Beautify(Addon.Cache.Lucky);
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
		luckyReqFrenSpan.className = Addon.Disp.colorTextPre + luckyColorFrenzy;
		luckyReqFrenSpan.textContent = Beautify(Addon.Cache.LuckyFrenzy);
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
	if (Addon.Config.StatsPref.Chain) {
		var chainColor = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.Chain) ? Addon.Disp.colorRed : Addon.Disp.colorGreen;
		var chainTime = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.Chain) ? Addon.Disp.FormatTime((Addon.Cache.Chain - (Game.cookies + Addon.Disp.GetWrinkConfigBank())) / Addon.Disp.GetCPS()) : '';
		var chainColorFrenzy = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.ChainFrenzy) ? Addon.Disp.colorRed : Addon.Disp.colorGreen;
		var chainTimeFrenzy = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.ChainFrenzy) ? Addon.Disp.FormatTime((Addon.Cache.ChainFrenzy - (Game.cookies + Addon.Disp.GetWrinkConfigBank())) / Addon.Disp.GetCPS()) : '';
		var chainWrathColor = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.ChainWrath) ? Addon.Disp.colorRed : Addon.Disp.colorGreen;
		var chainWrathTime = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.ChainWrath) ? Addon.Disp.FormatTime((Addon.Cache.ChainWrath - (Game.cookies + Addon.Disp.GetWrinkConfigBank())) / Addon.Disp.GetCPS()) : '';
		var chainWrathColorFrenzy = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.ChainFrenzyWrath) ? Addon.Disp.colorRed : Addon.Disp.colorGreen;
		var chainWrathTimeFrenzy = ((Game.cookies + Addon.Disp.GetWrinkConfigBank()) < Addon.Cache.ChainFrenzyWrath) ? Addon.Disp.FormatTime((Addon.Cache.ChainFrenzyWrath - (Game.cookies + Addon.Disp.GetWrinkConfigBank())) / Addon.Disp.GetCPS()) : '';
		
		var chainRewardMax = Addon.Cache.ChainReward;
		var chainWrathRewardMax = Addon.Cache.ChainWrathReward;
		var chainFrenzyRewardMax = Addon.Cache.ChainFrenzyReward;
		var chainFrenzyWrathRewardMax = Addon.Cache.ChainFrenzyWrathReward;
		var chainCurMax = Math.min(Addon.Cache.NoGoldSwitchCookiesPS * 60 * 60 * 6, (Game.cookies + Addon.Disp.GetWrinkConfigBank()) * 0.25);
		var chainCur = Addon.Cache.MaxChainMoni(7, chainCurMax);
		var chainCurWrath = Addon.Cache.MaxChainMoni(6, chainCurMax);
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
		chainReqSpan.className = Addon.Disp.colorTextPre + chainColor;
		chainReqSpan.textContent = Beautify(Addon.Cache.Chain);
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
		chainWrathReqSpan.className = Addon.Disp.colorTextPre + chainWrathColor;
		chainWrathReqSpan.textContent = Beautify(Addon.Cache.ChainWrath);
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
		chainReqFrenSpan.className = Addon.Disp.colorTextPre + chainColorFrenzy;
		chainReqFrenSpan.textContent = Beautify(Addon.Cache.ChainFrenzy);
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
		chainWrathReqFrenSpan.className = Addon.Disp.colorTextPre + chainWrathColorFrenzy;
		chainWrathReqFrenSpan.textContent = Beautify(Addon.Cache.ChainFrenzyWrath);
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
	if (Addon.Config.StatsPref.Prestige) {
		var possiblePresMax = Math.floor(Game.HowMuchPrestige(Game.cookiesEarned + Game.cookiesReset + Addon.Cache.WrinkBank + (choEgg ? Addon.Cache.lastChoEgg : 0)));
		var neededCook = Game.HowManyCookiesReset(possiblePresMax + 1) - (Game.cookiesEarned + Game.cookiesReset + Addon.Cache.WrinkBank + (choEgg ? Addon.Cache.lastChoEgg : 0));

		stats.appendChild(listing(listingQuest('Prestige Level (CUR / MAX)', 'PrestMaxTooltipPlaceholder'),  document.createTextNode(Beautify(Game.prestige) + ' / ' + Beautify(possiblePresMax))));
		var cookiesNextFrag = document.createDocumentFragment();
		cookiesNextFrag.appendChild(document.createTextNode(Beautify(neededCook)));
		var cookiesNextSmall = document.createElement('small');
		cookiesNextSmall.textContent = ' (' + (Addon.Disp.FormatTime(neededCook / Addon.Cache.AvgCPSChoEgg, 1)) + ')';
		cookiesNextFrag.appendChild(cookiesNextSmall);
		stats.appendChild(listing(listingQuest('Cookies To Next Level', 'NextPrestTooltipPlaceholder'), cookiesNextFrag));
		stats.appendChild(listing(listingQuest('Heavenly Chips (CUR / MAX)', 'HeavenChipMaxTooltipPlaceholder'),  document.createTextNode(Beautify(Game.heavenlyChips) + ' / ' + Beautify((possiblePresMax - Game.prestige) + Game.heavenlyChips))));
		var resetBonus = Addon.Sim.ResetBonus(possiblePresMax);
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
		if (Addon.Config.StatsPref.Wrink) {
			var popAllFrag = document.createDocumentFragment();
			popAllFrag.appendChild(document.createTextNode(Beautify(Addon.Cache.WrinkBank) + ' '));
			var popAllA = document.createElement('a');
			popAllA.textContent = 'Pop All';
			popAllA.className = 'option';
			popAllA.onclick = function() { Addon.Disp.CollectWrinklers(); };
			popAllFrag.appendChild(popAllA);
			stats.appendChild(listing('Rewards of Popping',  popAllFrag));
		}
	}
	
	var specDisp = false;
	var halloCook = [];
	for (var i in Addon.Data.HalloCookies) {
		if (!Game.Has(Addon.Data.HalloCookies[i])) {
			halloCook.push(Addon.Data.HalloCookies[i]);
			specDisp = true;
		}
	}
	var christCook = [];
	for (var i in Addon.Data.ChristCookies) {
		if (!Game.Has(Addon.Data.ChristCookies[i])) {
			christCook.push(Addon.Data.ChristCookies[i]);
			specDisp = true;
		}
	}
	var valCook = [];
	for (var i in Addon.Data.ValCookies) {
		if (!Game.Has(Addon.Data.ValCookies[i])) {
			valCook.push(Addon.Data.ValCookies[i]);
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
		if (Addon.Config.StatsPref.Sea) {
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

			if (Game.season == 'christmas') stats.appendChild(listing('Reindeer Reward',  document.createTextNode(Beautify(Addon.Cache.SeaSpec))));
			if (choEgg) {
				stats.appendChild(listing(listingQuest('Chocolate Egg Cookies', 'ChoEggTooltipPlaceholder'), document.createTextNode(Beautify(Addon.Cache.lastChoEgg))));
			}
			if (centEgg) {
				stats.appendChild(listing('Century Egg Multiplier', document.createTextNode((Math.round((Addon.Cache.CentEgg - 1) * 10000) / 100) + '%')));
			}				
		}
	}
	
	stats.appendChild(header('Miscellaneous', 'Misc'));
	if (Addon.Config.StatsPref.Misc) {
		stats.appendChild(listing('Average Cookies Per Second (Past ' + Addon.Disp.times[Addon.Config.AvgCPSHist] + (Addon.Config.AvgCPSHist == 0 ? ' minute' : ' minutes') + ')', document.createTextNode(Beautify(Addon.Cache.AvgCPS, 3))));
		stats.appendChild(listing('Average Cookie Clicks Per Second (Past ' + Addon.Disp.times[Addon.Config.AvgClicksHist] + (Addon.Config.AvgClicksHist == 0 ? ' second' : ' seconds') + ')', document.createTextNode(Beautify(Addon.Cache.AvgClicks, 1))));
		stats.appendChild(listing('Missed Golden Cookies', document.createTextNode(Beautify(Game.missedGoldenClicks))));
	}

	l('menu').insertBefore(stats, l('menu').childNodes[2]);
}

Addon.Disp.AddMenu = function()
{
	if (Game.onMenu == 'prefs')
		Addon.Disp.AddMenuPref();
	else if (Addon.Config.Stats == 1 && Game.onMenu == 'stats')
		Addon.Disp.AddMenuStats();
}

Addon.Disp.RefreshMenu = function() {
	if (Addon.Config.UpStats && Game.onMenu == 'stats' && (Game.drawT - 1) % (Game.fps * 5) != 0 && (Game.drawT - 1) % Game.fps == 0) Game.UpdateMenu();
}

Addon.Disp.UpdateTooltipLocation = function() {
	if (Game.tooltip.origin == 'store') {
		var warnCautOffset = 0;
		if (Addon.Config.ToolWarnCaut == 1 && Addon.Config.ToolWarnCautPos == 1) warnCautOffset = Addon.Disp.TooltipWarnCaut.clientHeight - 4;
		Game.tooltip.tta.style.top = Math.min(parseInt(Game.tooltip.tta.style.top), (l('game').clientHeight + l('topBar').clientHeight) - Game.tooltip.tt.clientHeight - warnCautOffset - 46) + 'px';
	}
	// Kept for future possible use if the code changes again
	/*else if (!Game.onCrate && !Game.OnAscend && Addon.Config.TimerBar == 1 && Addon.Config.TimerBarPos == 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(Addon.Disp.TimerBar.style.height)) + 'px';
	}*/
}

Addon.Disp.CreateTooltipWarnCaut = function() {
	Addon.Disp.TooltipWarnCaut = document.createElement('div');
	Addon.Disp.TooltipWarnCaut.style.position = 'absolute';
	Addon.Disp.TooltipWarnCaut.style.display = 'none';
	Addon.Disp.TooltipWarnCaut.style.left = 'auto';
	Addon.Disp.TooltipWarnCaut.style.bottom = 'auto';
	
	var create = function(boxId, color, labelTextFront, labelTextBack, deficitId) {
		var box = document.createElement('div');
		box.id = boxId;
		box.style.display = 'none';
		box.style.WebkitTransition = 'opacity 0.1s ease-out';
		box.style.MozTransition = 'opacity 0.1s ease-out';
		box.style.MsTransition = 'opacity 0.1s ease-out';
		box.style.OTransition = 'opacity 0.1s ease-out';
		box.style.transition = 'opacity 0.1s ease-out';
		box.className = Addon.Disp.colorBorderPre + color;
		box.style.padding = '2px';
		box.style.background = '#000 url(img/darkNoise.png)';
		var labelDiv = document.createElement('div');
		box.appendChild(labelDiv);
		var labelSpan = document.createElement('span');
		labelSpan.className = Addon.Disp.colorTextPre + color;
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
	Addon.Disp.TooltipWarnCaut.appendChild(create('CMDispTooltipWarn', Addon.Disp.colorRed, 'Warning: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!"', 'CMDispTooltipWarnText'));
	Addon.Disp.TooltipWarnCaut.firstChild.style.marginBottom = '4px';
	Addon.Disp.TooltipWarnCaut.appendChild(create('CMDispTooltipCaut', Addon.Disp.colorYellow, 'Caution: ', 'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)', 'CMDispTooltipCautText'));

	l('tooltipAnchor').appendChild(Addon.Disp.TooltipWarnCaut);
}

Addon.Disp.ToggleToolWarnCaut = function() {
	if (Addon.Config.ToolWarnCaut == 1) {
		Addon.Disp.TooltipWarnCaut.style.display = 'block';
	}
	else {
		Addon.Disp.TooltipWarnCaut.style.display = 'none';
	}
}

Addon.Disp.ToggleToolWarnCautPos = function() {
	if (Addon.Config.ToolWarnCautPos == 0) {
		Addon.Disp.TooltipWarnCaut.style.top = 'auto';
		Addon.Disp.TooltipWarnCaut.style.margin = '4px -4px';
		Addon.Disp.TooltipWarnCaut.style.padding = '3px 4px';
	}
	else {
		Addon.Disp.TooltipWarnCaut.style.right = 'auto';
		Addon.Disp.TooltipWarnCaut.style.margin = '4px';
		Addon.Disp.TooltipWarnCaut.style.padding = '4px 3px';
	}
}

Addon.Disp.AddTooltipBuild = function() {
	Addon.Disp.TooltipBuildBack = [];
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		if (l('product' + me.id).onmouseover != null) {
			Addon.Disp.TooltipBuildBack[i] = l('product' + me.id).onmouseover;
			eval('l(\'product\' + me.id).onmouseover = function() {Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return Addon.Disp.Tooltip(\'b\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}');
		}
	}
}

Addon.Disp.AddTooltipUpgrade = function() {
	Addon.Disp.TooltipUpgradeBack = [];
	for (var i in Game.UpgradesInStore) {
		var me = Game.UpgradesInStore[i];
		if (l('upgrade' + i).onmouseover != null) {
			Addon.Disp.TooltipUpgradeBack[i] = l('upgrade' + i).onmouseover;
			eval('l(\'upgrade\' + i).onmouseover = function() {if (!Game.mouseDown) {Game.setOnCrate(this); Game.tooltip.dynamic = 1; Game.tooltip.draw(this, function() {return Addon.Disp.Tooltip(\'u\', \'' + i + '\');}, \'store\'); Game.tooltip.wobble();}}');
		}
	}
}

Addon.Disp.Tooltip = function(type, name) {
	if (type == 'b') {
		l('tooltip').innerHTML = Game.Objects[name].tooltip();
		if (Addon.Config.TooltipAmor == 1) {
			var buildPrice = Addon.Sim.BuildingGetPrice(Game.Objects[name].basePrice, 0, Game.Objects[name].free, Game.Objects[name].amount);
			var amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
			if (amortizeAmount > 0) {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split('so far</div>').join('so far<br/>&bull; <b>' + Beautify(amortizeAmount) + '</b> ' + (Math.floor(amortizeAmount) == 1 ? 'cookie' : 'cookies') + ' left to amortize (' + Addon.Disp.GetTimeColor(buildPrice, Game.Objects[name].totalCookies, (Game.Objects[name].storedTotalCps * Game.globalCpsMult)).text + ')</div>');		
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
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(Addon.Sim.BuildingSell(Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.Objects[name].amount, 0)));
			}
			else {
				l('tooltip').innerHTML = l('tooltip').innerHTML.split(Beautify(Game.Objects[name].getPrice())).join('-' + Beautify(Addon.Sim.BuildingSell(Game.Objects[name].basePrice, Game.Objects[name].amount, Game.Objects[name].free, Game.buyBulk, 0)));
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
	
	if (Addon.Config.Tooltip == 1 && (type != 'b' || Game.buyMode == 1)) {
		l('tooltip').firstChild.style.paddingBottom = '4px';
		var tooltip = document.createElement('div');
		tooltip.style.border = '1px solid';
		tooltip.style.padding = '4px';
		tooltip.style.margin = '0px -4px';
		tooltip.id = 'CMTooltipBorder';
		
		var header = function(text) {
			var div = document.createElement('div');
			div.style.fontWeight = 'bold';
			div.className = Addon.Disp.colorTextPre + Addon.Disp.colorBlue;
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
	
	Addon.Disp.tooltipType = type;
	Addon.Disp.tooltipName = name;

	Addon.Disp.UpdateTooltip();
	
	return l('tooltip').innerHTML;
}

Addon.Disp.UpdateTooltip = function() {
	if (l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		
		// Error checking
		if (Addon.Disp.tooltipType == 'u' && (typeof Game.UpgradesInStore[Addon.Disp.tooltipName] === 'undefined' || typeof Addon.Cache.Upgrades[Game.UpgradesInStore[Addon.Disp.tooltipName].name] === 'undefined')) {
			return;
		}
		var price;
		var bonus;
		if (Addon.Disp.tooltipType == 'b') {
			var target = '';
			if (Game.buyMode == 1 && Game.buyBulk == 10) {
				target = 'Objects10';
				price = Addon.Cache[target][Addon.Disp.tooltipName].price;
			}
			else if (Game.buyMode == 1 && Game.buyBulk == 100) {
				target = 'Objects100';
				price = Addon.Cache[target][Addon.Disp.tooltipName].price;
			}
			else {
				target = 'Objects';
				price = Game.Objects[Addon.Disp.tooltipName].getPrice();
			}
			bonus = Addon.Cache[target][Addon.Disp.tooltipName].bonus;
			if (Addon.Config.Tooltip == 1 && Game.buyMode == 1) {
				l('CMTooltipBorder').className = Addon.Disp.colorTextPre + Addon.Cache[target][Addon.Disp.tooltipName].color;
				l('CMTooltipPP').textContent = Beautify(Addon.Cache[target][Addon.Disp.tooltipName].pp, 2);
				l('CMTooltipPP').className = Addon.Disp.colorTextPre + Addon.Cache[target][Addon.Disp.tooltipName].color;
			}
		}
		else { // Upgrades
			bonus = Addon.Cache.Upgrades[Game.UpgradesInStore[Addon.Disp.tooltipName].name].bonus;
			price = Game.Upgrades[Game.UpgradesInStore[Addon.Disp.tooltipName].name].getPrice();
			if (Addon.Config.Tooltip == 1) {
				l('CMTooltipBorder').className = Addon.Disp.colorTextPre + Addon.Cache.Upgrades[Game.UpgradesInStore[Addon.Disp.tooltipName].name].color;
				l('CMTooltipPP').textContent = Beautify(Addon.Cache.Upgrades[Game.UpgradesInStore[Addon.Disp.tooltipName].name].pp, 2);
				l('CMTooltipPP').className = Addon.Disp.colorTextPre + Addon.Cache.Upgrades[Game.UpgradesInStore[Addon.Disp.tooltipName].name].color;
			}
		}
		if (Addon.Config.Tooltip == 1 && (Addon.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
			l('CMTooltipIncome').textContent = Beautify(bonus, 2);
			
			var increase = Math.round(bonus / Game.cookiesPs * 10000);
			if (isFinite(increase) && increase != 0) {
				l('CMTooltipIncome').textContent += ' (' + (increase / 100) + '% of income)';
			}
		
			var timeColor = Addon.Disp.GetTimeColor(price, (Game.cookies + Addon.Disp.GetWrinkConfigBank()), Addon.Disp.GetCPS());
			l('CMTooltipTime').textContent = timeColor.text;
			l('CMTooltipTime').className = Addon.Disp.colorTextPre + timeColor.color;
		}
		
		if (Addon.Config.ToolWarnCaut == 1) {
			var warn = Addon.Cache.Lucky;
			if (Addon.Config.ToolWarnCautBon == 1) {
				var bonusNoFren = bonus;
				bonusNoFren /= Addon.Sim.getCPSBuffMult();
				warn += ((bonusNoFren * 60 * 15) / 0.15);
			}
			var caut = warn * 7;
			var amount = (Game.cookies + Addon.Disp.GetWrinkConfigBank()) - price;
			if ((amount < warn || amount < caut) && (Addon.Disp.tooltipType != 'b' || Game.buyMode == 1)) {
				if (Addon.Config.ToolWarnCautPos == 0) {
					Addon.Disp.TooltipWarnCaut.style.right = '0px';
				}
				else {
					Addon.Disp.TooltipWarnCaut.style.top = (l('tooltip').offsetHeight) + 'px';
				}
				Addon.Disp.TooltipWarnCaut.style.width = (l('tooltip').offsetWidth - 6) + 'px';
			
				if (amount < warn) {
					l('CMDispTooltipWarn').style.display = '';
					l('CMDispTooltipWarnText').textContent = Beautify(warn - amount) + ' (' + Addon.Disp.FormatTime((warn - amount) / Addon.Disp.GetCPS()) + ')';
					l('CMDispTooltipCaut').style.display = '';
					l('CMDispTooltipCautText').textContent = Beautify(caut - amount) + ' (' + Addon.Disp.FormatTime((caut - amount) / Addon.Disp.GetCPS()) + ')';
				}
				else if (amount < caut) {
					l('CMDispTooltipCaut').style.display = '';
					l('CMDispTooltipCautText').textContent = Beautify(caut - amount) + ' (' + Addon.Disp.FormatTime((caut - amount) / Addon.Disp.GetCPS()) + ')';
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

Addon.Disp.DrawTooltipWarnCaut = function() {
	if (Addon.Config.ToolWarnCaut == 1) {
		l('CMDispTooltipWarn').style.opacity = '0';
		l('CMDispTooltipCaut').style.opacity = '0';
	}
}

Addon.Disp.UpdateTooltipWarnCaut = function() {
	if (Addon.Config.ToolWarnCaut == 1 && l('tooltipAnchor').style.display != 'none' && l('CMTooltipArea') != null) {
		l('CMDispTooltipWarn').style.opacity = '1';
		l('CMDispTooltipCaut').style.opacity = '1';
	}
}

Addon.Disp.AddWrinklerAreaDetect = function() {
	l('backgroundLeftCanvas').onmouseover = function() {Addon.Disp.TooltipWrinklerArea = 1;};
	l('backgroundLeftCanvas').onmouseout = function() {
		Addon.Disp.TooltipWrinklerArea = 0;
		Game.tooltip.hide();
		for (var i in Game.wrinklers) {
			Addon.Disp.TooltipWrinklerCache[i] = 0;
		}
	};
}

Addon.Disp.CheckWrinklerTooltip = function() {
	if (Addon.Config.ToolWrink == 1 && Addon.Disp.TooltipWrinklerArea == 1) {
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
				if (Addon.Disp.TooltipWrinklerCache[i] == 0) {
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
					Addon.Disp.TooltipWrinkler = i;
					Addon.Disp.TooltipWrinklerCache[i] = 1;
				}
				else break;
			}
			else {
				Addon.Disp.TooltipWrinklerCache[i] = 0;
			}
		}
		if (!showingTooltip) {
			Game.tooltip.hide();
		}
	}
}

Addon.Disp.UpdateWrinklerTooltip = function() {
	if (Addon.Config.ToolWrink == 1 && l('CMTooltipWrinkler') != null) {
		var sucked = Game.wrinklers[Addon.Disp.TooltipWrinkler].sucked;
		var toSuck = 1.1;
		if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
		if (Game.wrinklers[Addon.Disp.TooltipWrinkler].type == 1) toSuck *= 3; // Shiny wrinklers
		sucked *= toSuck;
		if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
		l('CMTooltipWrinkler').textContent = Beautify(sucked);
	}
}

Addon.Disp.UpdateAscendState = function() {
	if (Game.OnAscend) {
		l('game').style.bottom = '0px';
		if (Addon.Config.BotBar == 1) Addon.Disp.BotBar.style.display = 'none';
		if (Addon.Config.TimerBar == 1) Addon.Disp.TimerBar.style.display = 'none';
	}
	else {
		Addon.Disp.ToggleBotBar();
		Addon.Disp.ToggleTimerBar();
	}

	Addon.Disp.UpdateBackground();
}

Addon.Disp.ToggleSayTime = function() {
	if (Addon.Config.SayTime == 1) {
		Game.sayTime = Addon.Disp.sayTime;
	}
	else {
		Game.sayTime = Addon.Backup.sayTime;
	}
}

Addon.Disp.RefreshScale = function() {
	BeautifyAll();
	Game.RefreshStore();
	Game.RebuildUpgrades();

	Addon.Disp.UpdateBotBarOther();
	Addon.Disp.UpdateBuildings();
	Addon.Disp.UpdateUpgrades();
}

Addon.Disp.colorTextPre = 'CMText';
Addon.Disp.colorBackPre = 'CMBack';
Addon.Disp.colorBorderPre = 'CMBorder';
Addon.Disp.colorBlue = 'Blue';
Addon.Disp.colorGreen = 'Green';
Addon.Disp.colorYellow = 'Yellow';
Addon.Disp.colorOrange = 'Orange';
Addon.Disp.colorRed = 'Red';
Addon.Disp.colorPurple = 'Purple';
Addon.Disp.colorGray = 'Gray';
Addon.Disp.colorPink = 'Pink';
Addon.Disp.colorBrown = 'Brown';
Addon.Disp.colors = [Addon.Disp.colorBlue, Addon.Disp.colorGreen, Addon.Disp.colorYellow, Addon.Disp.colorOrange, Addon.Disp.colorRed, Addon.Disp.colorPurple, Addon.Disp.colorGray, Addon.Disp.colorPink, Addon.Disp.colorBrown];
Addon.Disp.buffColors = {'Frenzy': Addon.Disp.colorYellow, 'Dragon Harvest': Addon.Disp.colorBrown, 'Elder frenzy': Addon.Disp.colorGreen, 'Clot': Addon.Disp.colorRed, 'Click frenzy': Addon.Disp.colorBlue, 'Dragonflight': Addon.Disp.colorPink};
Addon.Disp.lastGoldenCookieState = 0;
Addon.Disp.lastSeasonPopupState = 0;
Addon.Disp.goldenShimmer;
Addon.Disp.seasonPopShimmer;
Addon.Disp.lastAscendState = -1;

Addon.Disp.times = [1, 5, 10, 15, 30];

Addon.Disp.metric = ['M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
Addon.Disp.shortScale = ['M', 'B', 'Tr', 'Quadr', 'Quint', 'Sext', 'Sept', 'Oct', 'Non', 'Dec', 'Undec', 'Duodec', 'Tredec'];

Addon.Disp.TooltipWrinklerArea = 0;
Addon.Disp.TooltipWrinkler = -1;
Addon.Disp.TooltipWrinklerCache = [];
for (var i in Game.wrinklers) {
	Addon.Disp.TooltipWrinklerCache[i] = 0;
}

/********
 * Main *
 ********/
 
Addon.ReplaceNative = function() {
	Addon.Backup.Beautify = Beautify;
	Beautify = Addon.Disp.Beautify;

	Addon.Backup.CalculateGains = Game.CalculateGains;
	Game.CalculateGains = function() {
		Addon.Backup.CalculateGains();
		Addon.Sim.DoSims = 1;
		Addon.Sim.Date = new Date().getTime();
	}
	
	Addon.Backup.tooltip = {};
	Addon.Backup.tooltip.draw = Game.tooltip.draw;
	eval('Addon.Backup.tooltip.drawMod = ' + Game.tooltip.draw.toString().split('this').join('Game.tooltip'));
	Game.tooltip.draw = function(from, text, origin) {
		Addon.Backup.tooltip.drawMod(from, text, origin);
		Addon.Disp.DrawTooltipWarnCaut();
	}
	
	Addon.Backup.tooltip.update = Game.tooltip.update;
	eval('Addon.Backup.tooltip.updateMod = ' + Game.tooltip.update.toString().split('this').join('Game.tooltip'));
	Game.tooltip.update = function() {
		Addon.Backup.tooltip.updateMod();
		Addon.Disp.UpdateTooltipWarnCaut();
		Addon.Disp.UpdateTooltipLocation();
	}
	
	Addon.Backup.UpdateSpecial = Game.UpdateSpecial;
	Game.UpdateSpecial = function() {
		if (Addon.Config.TimerBar == 1 && Addon.Config.TimerBarPos == 0) {
			var timerBarHeight = parseInt(Addon.Disp.TimerBar.style.height);
			Game.mouseY -= timerBarHeight;
			Addon.Backup.UpdateSpecial();
			Game.mouseY += timerBarHeight;
		}
		else {
			Addon.Backup.UpdateSpecial();
		}
	}
	
	Addon.Backup.RebuildUpgrades = Game.RebuildUpgrades;
	Game.RebuildUpgrades = function() {
		Addon.Backup.RebuildUpgrades();
		Addon.Disp.AddTooltipUpgrade();
		Game.CalculateGains();
	}
	
	Addon.Backup.UpdateMenu = Game.UpdateMenu;
	Game.UpdateMenu = function() {
		if (typeof jscolor.picker === 'undefined' || typeof jscolor.picker.owner === 'undefined') {
			Addon.Backup.UpdateMenu();
			Addon.Disp.AddMenu();
		}
	}
	
	Addon.Backup.sayTime = Game.sayTime;
	Addon.Disp.sayTime = function(time, detail) {
		if (isNaN(time) || time <= 0) return Addon.Backup.sayTime(time, detail);
		else return Addon.Disp.FormatTime(time / Game.fps, 1);
	}
	
	Addon.Backup.Loop = Game.Loop;
	Game.Loop = function() {
		Addon.Backup.Loop();
		Addon.Loop();
	}
	
	Addon.Backup.Logic = Game.Logic;
	eval('Addon.Backup.LogicMod = ' + Game.Logic.toString().split('document.title').join('Addon.Cache.Title'));	
	Game.Logic = function() {
		Addon.Backup.LogicMod();
		
		// Update Title
		Addon.Disp.UpdateTitle();
	}
}

Addon.Loop = function() {
	if (Addon.Disp.lastAscendState != Game.OnAscend) {
		Addon.Disp.lastAscendState = Game.OnAscend;
		Addon.Disp.UpdateAscendState();
	}
	if (!Game.OnAscend && Game.AscendTimer == 0) {
		if (Addon.Sim.DoSims) {		
			Addon.Cache.RemakeIncome();
			
			Addon.Sim.NoGoldSwitchCookiesPS(); // Needed first
			Addon.Cache.RemakeLucky();
			Addon.Cache.RemakeChain();
			
			Addon.Cache.RemakeSeaSpec();
			Addon.Cache.RemakeSellForChoEgg();
		
			Addon.Sim.DoSims = 0;
		}
		
		// Check for aura change to recalculate buildings prices
		var hasFierHoard = Game.hasAura('Fierce Hoarder');
		if (!Addon.Cache.HadFierHoard && hasFierHoard) {
			Addon.Cache.HadFierHoard = true;
			Addon.Cache.DoRemakeBuildPrices = 1;
		}
		else if (Addon.Cache.HadFierHoard && !hasFierHoard) {
			Addon.Cache.HadFierHoard = false;
			Addon.Cache.DoRemakeBuildPrices = 1;
		}
		
		if (Addon.Cache.DoRemakeBuildPrices) {
			Addon.Cache.RemakeBuildingsPrices();
			Addon.Cache.DoRemakeBuildPrices = 0;
		}
		
		// Update Wrinkler Bank
		Addon.Cache.RemakeWrinkBank();
		
		// Calculate PP
		Addon.Cache.RemakePP();

		// Update colors
		Addon.Disp.UpdateBotBarOther();
		Addon.Disp.UpdateBuildings();
		Addon.Disp.UpdateUpgrades();
		
		// Redraw timers
		Addon.Disp.UpdateBotBarTime();
		Addon.Disp.UpdateTimerBar();
	
		// Update Tooltip
		Addon.Disp.UpdateTooltip();

		// Update Wrinkler Tooltip
		Addon.Disp.CheckWrinklerTooltip();
		Addon.Disp.UpdateWrinklerTooltip();

		// Change menu refresh interval
		Addon.Disp.RefreshMenu();
	}
	
	// Check Golden Cookies
	Addon.Disp.CheckGoldenCookie();
	
	// Check Season Popup
	Addon.Disp.CheckSeasonPopup();

	// Update Average CPS (might need to move)
	Addon.Cache.UpdateAvgCPS()
}

Addon.Init = function() {
	var proceed = true;
	if (Game.version != Addon.VersionMajor) {
		proceed = confirm('Cookie Monster version ' + Addon.VersionMajor + '.' + Addon.VersionMinor + ' is meant for Game version ' + Addon.VersionMajor + '.  Loading a different version may cause errors.  Do you still want to load Cookie Monster?');
	}
	if (proceed) {
		Addon.Cache.AddQueue();
		Addon.Disp.AddJscolor();
		
		var delay = setInterval(function() {
			if (typeof Queue !== 'undefined' && typeof jscolor !== 'undefined') {
				Addon.DelayInit();
				clearInterval(delay);
			}
		}, 500);
	}
}

Addon.DelayInit = function() {
	Addon.Sim.InitData();
	Addon.Disp.CreateCssArea();
	Addon.Disp.CreateBotBar();
	Addon.Disp.CreateTimerBar();
	Addon.Disp.CreateUpgradeBar();
	Addon.Disp.CreateWhiteScreen();
	Addon.Disp.CreateFavicon();
	Addon.Disp.CreateGCTimer();
	Addon.Disp.CreateTooltip('GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px');
	Addon.Disp.CreateTooltip('PrestMaxTooltipPlaceholder', 'The MAX prestige is calculated with the cookies gained from popping all wrinklers, selling all buildings with Earth Shatterer aura, and buying Chocolate egg', '310px');
	Addon.Disp.CreateTooltip('NextPrestTooltipPlaceholder', 'Not calculated with cookies gained from wrinklers or Chocolate egg', '200px');
	Addon.Disp.CreateTooltip('HeavenChipMaxTooltipPlaceholder', 'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers, selling all buildings with Earth Shatterer aura, and buying Chocolate egg', '310px');
	Addon.Disp.CreateTooltip('ResetTooltipPlaceholder', 'The bonus income you would get from new prestige levels at 100% of its potential and from reset achievements if you have the same buildings/upgrades after reset', '340px');
	Addon.Disp.CreateTooltip('ChoEggTooltipPlaceholder', 'The amount of cookies you would get from popping all wrinklers, selling all buildings with Earth Shatterer aura, and then buying Chocolate egg', '300px');
	Addon.Disp.CreateTooltipWarnCaut();
	Addon.Disp.AddTooltipBuild();
	Addon.Disp.AddWrinklerAreaDetect();
	Addon.Cache.InitCookiesDiff();
	Addon.ReplaceNative();
	Game.CalculateGains();
	Addon.LoadConfig(); // Must be after all things are created!
	Addon.Disp.lastAscendState = Game.OnAscend;
	Addon.Disp.lastBuyMode = Game.buyMode;
	Addon.Disp.lastBuyBulk = Game.buyBulk;

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

Addon.Sim.BuildingGetPrice = function(basePrice, start, free, increase) {
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

Addon.Sim.BuildingSell = function(basePrice, start, free, amount, emuAura) {
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

Addon.Sim.Has = function(what) {
	if (Game.ascensionMode == 1 && Game.Upgrades[what].pool == 'prestige') return 0;
	return (Addon.Sim.Upgrades[what] ? Addon.Sim.Upgrades[what].bought : 0);
}


Addon.Sim.Win = function(what) {
	if (Addon.Sim.Achievements[what]) {
		if (Addon.Sim.Achievements[what].won == 0) {
			Addon.Sim.Achievements[what].won = 1;
			if (Game.Achievements[what].pool != 'shadow') Addon.Sim.AchievementsOwned++;
		}
	}
}

eval('Addon.Sim.HasAchiev = ' + Game.HasAchiev.toString().split('Game').join('Addon.Sim'));

eval('Addon.Sim.GetHeavenlyMultiplier = ' + Game.GetHeavenlyMultiplier.toString().split('Game').join('Addon.Sim'));

Addon.Sim.hasAura = function(what) {
	if (Game.dragonAuras[Addon.Sim.dragonAura].name == what || Game.dragonAuras[Addon.Sim.dragonAura2].name == what) 
		return true; 
	else
		return false;
}

eval('Addon.Sim.GetTieredCpsMult = ' + Game.GetTieredCpsMult.toString().split('Game.Has').join('Addon.Sim.Has').split('me.tieredUpgrades').join('Game.Objects[me.name].tieredUpgrades').split('me.synergies').join('Game.Objects[me.name].synergies').split('syn.buildingTie1.amount').join('Addon.Sim.Objects[syn.buildingTie1.name].amount').split('syn.buildingTie2.amount').join('Addon.Sim.Objects[syn.buildingTie2.name].amount'));

eval('Addon.Sim.getGrandmaSynergyUpgradeMultiplier = ' + Game.getGrandmaSynergyUpgradeMultiplier.toString().split('Game.Objects[\'Grandma\']').join('Addon.Sim.Objects[\'Grandma\']'));

Addon.Sim.getCPSBuffMult = function() {
	var mult = 1;
	for (var i in Game.buffs) {
		if (typeof Game.buffs[i].multCpS != 'undefined') mult *= Game.buffs[i].multCpS;
	}
	return mult;
}

Addon.Sim.InitData = function() {
	// Buildings
	Addon.Sim.Objects = [];
	for (var i in Game.Objects) {
		Addon.Sim.Objects[i] = {};
		var me = Game.Objects[i];
		var you = Addon.Sim.Objects[i];
		eval('you.cps = ' + me.cps.toString().split('Game.Has').join('Addon.Sim.Has').split('Game.hasAura').join('Addon.Sim.hasAura').split('Game.Objects').join('Addon.Sim.Objects').split('Game.GetTieredCpsMult').join('Addon.Sim.GetTieredCpsMult').split('Game.getGrandmaSynergyUpgradeMultiplier').join('Addon.Sim.getGrandmaSynergyUpgradeMultiplier'));
		// Below is needed for above eval!
		you.baseCps = me.baseCps;
		you.name = me.name;
	}

	// Upgrades
	Addon.Sim.Upgrades = [];
	for (var i in Game.Upgrades) {
		Addon.Sim.Upgrades[i] = {};
	}

	// Achievements
	Addon.Sim.Achievements = [];
	for (var i in Game.Achievements) {
		Addon.Sim.Achievements[i] = {};
	}
}

Addon.Sim.CopyData = function() {
	// Other variables
	Addon.Sim.UpgradesOwned = Game.UpgradesOwned;
	Addon.Sim.pledges = Game.pledges;
	Addon.Sim.AchievementsOwned = Game.AchievementsOwned;
	Addon.Sim.heavenlyPower = Game.heavenlyPower;
	Addon.Sim.prestige = Game.prestige;
	Addon.Sim.dragonAura = Game.dragonAura;
	Addon.Sim.dragonAura2 = Game.dragonAura2;
	
	// Buildings
	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		var you = Addon.Sim.Objects[i];
		you.amount = me.amount;
	}

	// Upgrades
	for (var i in Game.Upgrades) {
		var me = Game.Upgrades[i];
		var you = Addon.Sim.Upgrades[i];
		you.bought = me.bought;
	}

	// Achievements
	for (var i in Game.Achievements) {
		var me = Game.Achievements[i];
		var you = Addon.Sim.Achievements[i];
		you.won = me.won;
	}
};


Addon.Sim.CalculateGains = function() {
	Addon.Sim.cookiesPs = 0;
	var mult = 1;

	if (Game.ascensionMode != 1) mult += parseFloat(Addon.Sim.prestige) * 0.01 * Addon.Sim.heavenlyPower * Addon.Sim.GetHeavenlyMultiplier();

	var cookieMult = 0;
	for (var i in Game.cookieUpgrades) {
		var me = Game.cookieUpgrades[i];
		if (Addon.Sim.Has(me.name)) {
			mult *= (1 + (typeof(me.power) == 'function' ? me.power(me) : me.power) * 0.01);
		}
	}

	mult *= (1 + 0.01 * cookieMult);
	if (Addon.Sim.Has('Specialized chocolate chips')) mult *= 1.01;
	if (Addon.Sim.Has('Designer cocoa beans')) mult *= 1.02;
	if (Addon.Sim.Has('Underworld ovens')) mult *= 1.03;
	if (Addon.Sim.Has('Exotic nuts')) mult *= 1.04;
	if (Addon.Sim.Has('Arcane sugar')) mult *= 1.05;

	if (Addon.Sim.Has('Increased merriness')) mult *= 1.15;
	if (Addon.Sim.Has('Improved jolliness')) mult *= 1.15;
	if (Addon.Sim.Has('A lump of coal')) mult *= 1.01;
	if (Addon.Sim.Has('An itchy sweater')) mult *= 1.01;
	if (Addon.Sim.Has('Santa\'s dominion')) mult *= 1.2;

	if (Addon.Sim.Has('Santa\'s legacy')) mult *= 1 + (Game.santaLevel + 1) * 0.03;

	for (var i in Addon.Sim.Objects) {
		var me = Addon.Sim.Objects[i];
		Addon.Sim.cookiesPs += me.amount * (typeof(me.cps) == 'function' ? me.cps(me) : me.cps);
	}

	if (Addon.Sim.Has('"egg"')) Addon.Sim.cookiesPs += 9; // "egg"

	var milkMult=1;
	if (Addon.Sim.Has('Santa\'s milk and cookies')) milkMult *= 1.05;
	if (Addon.Sim.hasAura('Breath of Milk')) milkMult *= 1.05;
	if (Addon.Sim.Has('Kitten helpers')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.1 * milkMult);
	if (Addon.Sim.Has('Kitten workers')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.125 * milkMult);
	if (Addon.Sim.Has('Kitten engineers')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.15 * milkMult);
	if (Addon.Sim.Has('Kitten overseers')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.175 * milkMult);
	if (Addon.Sim.Has('Kitten managers')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (Addon.Sim.Has('Kitten accountants')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (Addon.Sim.Has('Kitten specialists')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (Addon.Sim.Has('Kitten experts')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.2 * milkMult);
	if (Addon.Sim.Has('Kitten angels')) mult *= (1 + (Addon.Sim.AchievementsOwned / 25) * 0.1 * milkMult);

	var eggMult = 1;
	if (Addon.Sim.Has('Chicken egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Duck egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Turkey egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Quail egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Robin egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Ostrich egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Cassowary egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Salmon roe')) eggMult *= 1.01;
	if (Addon.Sim.Has('Frogspawn')) eggMult *= 1.01;
	if (Addon.Sim.Has('Shark egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Turtle egg')) eggMult *= 1.01;
	if (Addon.Sim.Has('Ant larva')) eggMult *= 1.01;
	if (Addon.Sim.Has('Century egg')) {
		// The boost increases a little every day, with diminishing returns up to +10% on the 100th day
		var day = Math.floor((Addon.Sim.Date - Game.startDate) / 1000 / 10) * 10 / 60 / 60 / 24;
		day = Math.min(day, 100);
		Addon.Cache.CentEgg = 1 + (1 - Math.pow(1 - day / 100, 3)) * 0.1;
		eggMult *= Addon.Cache.CentEgg;
	}
	mult *= eggMult;
	
	if (Addon.Sim.hasAura('Radiant Appetite')) mult *= 2;
	
	var rawCookiesPs = Addon.Sim.cookiesPs * mult;
	for (var i in Game.CpsAchievements) {
		if (rawCookiesPs >= Game.CpsAchievements[i].threshold) Addon.Sim.Win(Game.CpsAchievements[i].name);
	}

	mult *= Addon.Sim.getCPSBuffMult();

	// Pointless?
	name = Game.bakeryName.toLowerCase();
	if (name == 'orteil') mult *= 0.99;
	else if (name == 'ortiel') mult *= 0.98; //or so help me

	if (Addon.Sim.Has('Elder Covenant')) mult *= 0.95;

	if (Addon.Sim.Has('Golden switch [off]')) {
		var goldenSwitchMult = 1.5;
		if (Addon.Sim.Has('Residual luck')) {
			var upgrades = ['Get lucky', 'Lucky day', 'Serendipity', 'Heavenly luck', 'Lasting fortune', 'Decisive fate'];
			for (var i in upgrades) {
				if (Addon.Sim.Has(upgrades[i])) goldenSwitchMult += 0.1;
			}
		}
		mult *= goldenSwitchMult;
	}

	Addon.Sim.cookiesPs *= mult;

	// TODO remove?
	// if (Game.hasBuff('Cursed finger')) Game.cookiesPs = 0;
};

Addon.Sim.CheckOtherAchiev = function() {
	var grandmas=0;
	if (Addon.Sim.Has('Farmer grandmas')) grandmas++;
	if (Addon.Sim.Has('Worker grandmas')) grandmas++;
	if (Addon.Sim.Has('Miner grandmas')) grandmas++;
	if (Addon.Sim.Has('Cosmic grandmas')) grandmas++;
	if (Addon.Sim.Has('Transmuted grandmas')) grandmas++;
	if (Addon.Sim.Has('Altered grandmas')) grandmas++;
	if (Addon.Sim.Has('Grandmas\' grandmas')) grandmas++;
	if (Addon.Sim.Has('Antigrandmas')) grandmas++;
	if (Addon.Sim.Has('Rainbow grandmas')) grandmas++;
	if (Addon.Sim.Has('Banker grandmas')) grandmas++;
	if (Addon.Sim.Has('Priestess grandmas')) grandmas++;
	if (Addon.Sim.Has('Witch grandmas')) grandmas++;
	if (!Addon.Sim.HasAchiev('Elder') && grandmas >= 7) Addon.Sim.Win('Elder');

	var buildingsOwned = 0;
	var mathematician = 1;
	var base10 = 1;
	var minAmount = 100000;
	for (var i in Addon.Sim.Objects) {
		buildingsOwned += Addon.Sim.Objects[i].amount;
		minAmount = Math.min(Addon.Sim.Objects[i].amount, minAmount);
		if (!Addon.Sim.HasAchiev('Mathematician')) {
			if (Addon.Sim.Objects[i].amount < Math.min(128, Math.pow(2, (Game.ObjectsById.length - Game.Objects[i].id) - 1))) mathematician = 0;
		}
		if (!Addon.Sim.HasAchiev('Base 10')) {
			if (Addon.Sim.Objects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id) * 10) base10 = 0;
		}
	}
	if (minAmount >= 1) Addon.Sim.Win('One with everything');
	if (mathematician == 1) Addon.Sim.Win('Mathematician');
	if (base10 == 1) Addon.Sim.Win('Base 10');
	if (minAmount >= 100) Addon.Sim.Win('Centennial');
	if (minAmount >= 150) Addon.Sim.Win('Centennial and a half');
	if (minAmount >= 200) Addon.Sim.Win('Bicentennial');
	if (minAmount >= 250) Addon.Sim.Win('Bicentennial and a half');

	if (buildingsOwned >= 100) Addon.Sim.Win('Builder');
	if (buildingsOwned >= 500) Addon.Sim.Win('Architect');
	if (buildingsOwned >= 1000) Addon.Sim.Win('Engineer');
	if (buildingsOwned >= 1500) Addon.Sim.Win('Lord of Constructs');
	
	if (Addon.Sim.UpgradesOwned >= 20) Addon.Sim.Win('Enhancer');
	if (Addon.Sim.UpgradesOwned >= 50) Addon.Sim.Win('Augmenter');
	if (Addon.Sim.UpgradesOwned >= 100) Addon.Sim.Win('Upgrader');
	if (Addon.Sim.UpgradesOwned >= 200) Addon.Sim.Win('Lord of Progress');
	
	if (buildingsOwned >= 3000 && Addon.Sim.UpgradesOwned >= 300) Addon.Sim.Win('Polymath');
	
	if (Addon.Sim.Objects['Cursor'].amount + Addon.Sim.Objects['Grandma'].amount >= 777) Addon.Sim.Win('The elder scrolls');
	
	var hasAllHalloCook = true;
	for (var i in Addon.Data.HalloCookies) {
		if (!Addon.Sim.Has(Addon.Data.HalloCookies[i])) hasAllHalloCook = false;
	}
	if (hasAllHalloCook) Addon.Sim.Win('Spooky cookies');

	var hasAllChristCook = true;
	for (var i in Addon.Data.ChristCookies) {
		if (!Addon.Sim.Has(Addon.Data.ChristCookies[i])) hasAllChristCook = false;
	}
	if (hasAllChristCook) Addon.Sim.Win('Let it snow');
}

Addon.Sim.BuyBuildings = function(amount, target) {	
	Addon.Cache[target] = [];
	for (var i in Game.Objects) {
		Addon.Sim.CopyData();
		var me = Addon.Sim.Objects[i];
		me.amount += amount;
		
		if (i == 'Cursor') {
			if (me.amount >= 1) Addon.Sim.Win('Click');
			if (me.amount >= 2) Addon.Sim.Win('Double-click');
			if (me.amount >= 50) Addon.Sim.Win('Mouse wheel');
			if (me.amount >= 100) Addon.Sim.Win('Of Mice and Men');
			if (me.amount >= 200) Addon.Sim.Win('The Digital');
			if (me.amount >= 300) Addon.Sim.Win('Extreme polydactyly');
			if (me.amount >= 400) Addon.Sim.Win('Dr. T');
			if (me.amount >= 500) Addon.Sim.Win('Thumbs, phalanges, metacarpals');
		}
		else {
			for (var j in Game.Objects[me.name].tieredAchievs) {
				if (me.amount >= Game.Tiers[Game.Objects[me.name].tieredAchievs[j].tier].achievUnlock) 
					Addon.Sim.Win(Game.Objects[me.name].tieredAchievs[j].name);
			}
		}
		
		var lastAchievementsOwned = Addon.Sim.AchievementsOwned;
		
		Addon.Sim.CalculateGains();
		
		Addon.Sim.CheckOtherAchiev();
		
		if (lastAchievementsOwned != Addon.Sim.AchievementsOwned) {
			Addon.Sim.CalculateGains();
		}
		
		Addon.Cache[target][i] = {};
		Addon.Cache[target][i].bonus = Addon.Sim.cookiesPs - Game.cookiesPs;
		if (amount != 1) {
			Addon.Cache.DoRemakeBuildPrices = 1;
		}
	}
}

Addon.Sim.BuyUpgrades = function() {
	Addon.Cache.Upgrades = [];
	for (var i in Game.Upgrades) {
		if (Game.Upgrades[i].pool == 'toggle' || (Game.Upgrades[i].bought == 0 && Game.Upgrades[i].unlocked && Game.Upgrades[i].pool != 'prestige')) {
			Addon.Sim.CopyData();
			var me = Addon.Sim.Upgrades[i];
			me.bought = 1;
			if (Game.CountsAsUpgradeOwned(Game.Upgrades[i].pool)) Addon.Sim.UpgradesOwned++;

			if (i == 'Elder Pledge') {
				Addon.Sim.pledges++;
				if (Addon.Sim.pledges > 0) Addon.Sim.Win('Elder nap');
				if (Addon.Sim.pledges >= 5) Addon.Sim.Win('Elder slumber');
			}
			else if (i == 'Elder Covenant') {
				Addon.Sim.Win('Elder calm')
			}
			else if (i == 'Eternal heart biscuits') {
				Addon.Sim.Win('Lovely cookies');
			}
			else if (i == 'Heavenly key') {
				Addon.Sim.Win('Wholesome');
			}
		
			var lastAchievementsOwned = Addon.Sim.AchievementsOwned;
		
			Addon.Sim.CalculateGains();
		
			Addon.Sim.CheckOtherAchiev();
		
			if (lastAchievementsOwned != Addon.Sim.AchievementsOwned) {
				Addon.Sim.CalculateGains();
			}
		
			Addon.Cache.Upgrades[i] = {};
			Addon.Cache.Upgrades[i].bonus = Addon.Sim.cookiesPs - Game.cookiesPs;
		}
	}
}

Addon.Sim.NoGoldSwitchCookiesPS = function() {
	if (Game.Has('Golden switch [off]')) {
		Addon.Sim.CopyData();
		Addon.Sim.Upgrades['Golden switch [off]'].bought = 0;
		Addon.Sim.CalculateGains();
		Addon.Cache.NoGoldSwitchCookiesPS = Addon.Sim.cookiesPs;
	}
	else Addon.Cache.NoGoldSwitchCookiesPS = Game.cookiesPs;
}

Addon.Sim.ResetBonus = function(possiblePresMax) {
	var lastAchievementsOwned = -1;
	
	// Calculate CPS with all Heavenly upgrades
	var curCPS = Game.cookiesPs;
	if (Addon.Sim.Upgrades['Heavenly chip secret'].bought == 0 || Addon.Sim.Upgrades['Heavenly cookie stand'].bought == 0 || Addon.Sim.Upgrades['Heavenly bakery'].bought == 0 || Addon.Sim.Upgrades['Heavenly confectionery'].bought == 0 || Addon.Sim.Upgrades['Heavenly key'].bought == 0) {
		Addon.Sim.CopyData();

		if (Addon.Sim.Upgrades['Heavenly chip secret'].bought == 0) {
			Addon.Sim.Upgrades['Heavenly chip secret'].bought = 1;
			Addon.Sim.UpgradesOwned++;
		}
		if (Addon.Sim.Upgrades['Heavenly cookie stand'].bought == 0) {
			Addon.Sim.Upgrades['Heavenly cookie stand'].bought = 1;
			Addon.Sim.UpgradesOwned++;
		}
		if (Addon.Sim.Upgrades['Heavenly bakery'].bought == 0) {
			Addon.Sim.Upgrades['Heavenly bakery'].bought = 1;
			Addon.Sim.UpgradesOwned++;
		}
		if (Addon.Sim.Upgrades['Heavenly confectionery'].bought == 0) {
			Addon.Sim.Upgrades['Heavenly confectionery'].bought = 1;
			Addon.Sim.UpgradesOwned++;
		}
		if (Addon.Sim.Upgrades['Heavenly key'].bought == 0) {
			Addon.Sim.Upgrades['Heavenly key'].bought = 1;
			Addon.Sim.UpgradesOwned++;
			Addon.Sim.Win('Wholesome');
		}
		
		lastAchievementsOwned = Addon.Sim.AchievementsOwned;

		Addon.Sim.CalculateGains();
	
		Addon.Sim.CheckOtherAchiev();
	
		if (lastAchievementsOwned != Addon.Sim.AchievementsOwned) {
			Addon.Sim.CalculateGains();
		}

		curCPS = Addon.Sim.cookiesPs;
	}
	
	Addon.Sim.CopyData();
	
	if (Game.cookiesEarned >= 1000000) Addon.Sim.Win('Sacrifice');
	if (Game.cookiesEarned >= 1000000000) Addon.Sim.Win('Oblivion');
	if (Game.cookiesEarned >= 1000000000000) Addon.Sim.Win('From scratch');
	if (Game.cookiesEarned >= 1000000000000000) Addon.Sim.Win('Nihilism');
	if (Game.cookiesEarned >= 1000000000000000000) Addon.Sim.Win('Dematerialize');
	if (Game.cookiesEarned >= 1000000000000000000000) Addon.Sim.Win('Nil zero zilch');
	if (Game.cookiesEarned >= 1000000000000000000000000) Addon.Sim.Win('Transcendence');
	if (Game.cookiesEarned >= 1000000000000000000000000000) Addon.Sim.Win('Obliterate');
	if (Game.cookiesEarned >= 1000000000000000000000000000000) Addon.Sim.Win('Negative void');
	if (Game.cookiesEarned >= 1000000000000000000000000000000000) Addon.Sim.Win('To crumbs, you say?');
	
	if (Addon.Sim.Upgrades['Heavenly chip secret'].bought == 0) {
		Addon.Sim.Upgrades['Heavenly chip secret'].bought = 1;
		Addon.Sim.UpgradesOwned++;
	}
	if (Addon.Sim.Upgrades['Heavenly cookie stand'].bought == 0) {
		Addon.Sim.Upgrades['Heavenly cookie stand'].bought = 1;
		Addon.Sim.UpgradesOwned++;
	}
	if (Addon.Sim.Upgrades['Heavenly bakery'].bought == 0) {
		Addon.Sim.Upgrades['Heavenly bakery'].bought = 1;
		Addon.Sim.UpgradesOwned++;
	}
	if (Addon.Sim.Upgrades['Heavenly confectionery'].bought == 0) {
		Addon.Sim.Upgrades['Heavenly confectionery'].bought = 1;
		Addon.Sim.UpgradesOwned++;
	}
	if (Addon.Sim.Upgrades['Heavenly key'].bought == 0) {
		Addon.Sim.Upgrades['Heavenly key'].bought = 1;
		Addon.Sim.UpgradesOwned++;
		Addon.Sim.Win('Wholesome');
	}
	
	Addon.Sim.prestige = possiblePresMax;
	
	lastAchievementsOwned = Addon.Sim.AchievementsOwned;

	Addon.Sim.CalculateGains();
	
	Addon.Sim.CheckOtherAchiev();
	
	if (lastAchievementsOwned != Addon.Sim.AchievementsOwned) {
		Addon.Sim.CalculateGains();
	}

	return (Addon.Sim.cookiesPs - curCPS);
}

/**********
 * Footer *
 **********/

Addon.Init();
