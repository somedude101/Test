Addon = {};

Addon.CCPrefs = Game.DefaultPrefs;
Game.DefaultPrefs=function()
{
	Addon.CCPrefs();
	Game.prefs.statistics = 0;
}

Addon.AddMenu = function()
{
	var str = '';
	if (Game.onMenu == 'prefs')
	{
		str += '<div class="section">Options</div>'+
		'<div class="subsection">'+
		'<div class="title">General</div>'+
		'<div class="listing"><a class="option" '+Game.clickStr+'="Game.WriteSave();PlaySound(\'snd/tick.mp3\');">Save</a><label>Save manually (the game autosaves every 60 seconds; shortcut : ctrl+S)</label></div>'+
		'<div class="listing"><a class="option" '+Game.clickStr+'="Game.ExportSave();PlaySound(\'snd/tick.mp3\');">Export save</a><a class="option" '+Game.clickStr+'="Game.ImportSave();PlaySound(\'snd/tick.mp3\');">Import save</a><label>You can use this to backup your save or to transfer it to another computer (shortcut for import : ctrl+O)</label></div>'+
		'<div class="listing"><a class="option" '+Game.clickStr+'="Game.FileSave();PlaySound(\'snd/tick.mp3\');">Save to file</a><a class="option" style="position:relative;"><input id="FileLoadInput" type="file" style="cursor:pointer;opacity:0;position:absolute;left:0px;top:0px;width:100%;height:100%;" onchange="Game.FileLoad(event);" '+Game.clickStr+'="PlaySound(\'snd/tick.mp3\');"/>Load from file</a><label><b>Experimental</b> - use this to keep backups on your computer</label></div>'+
		'<div class="listing"><a class="option warning" '+Game.clickStr+'="Game.HardReset();PlaySound(\'snd/tick.mp3\');">Wipe save</a><label>Delete all your progress, including your achievements</label></div>'+
		'<div class="title">Settings</div>'+
		'<div class="listing">'+
		Game.WriteSlider('volumeSlider','Volume','[$]%',function(){return Game.volume;},'Game.setVolume(Math.round(l(\'volumeSlider\').value));l(\'volumeSliderRightText\').innerHTML=Game.volume+\'%\';')+'<br>'+
		Game.WriteButton('fancy','fancyButton','Fancy graphics ON','Fancy graphics OFF','Game.ToggleFancy();')+'<label>(visual improvements; disabling may improve performance)</label><br>'+
		Game.WriteButton('filters','filtersButton','CSS filters ON','CSS filters OFF','Game.ToggleFilters();')+'<label>(cutting-edge visual improvements; disabling may improve performance)</label><br>'+
		Game.WriteButton('particles','particlesButton','Particles ON','Particles OFF')+'<label>(cookies falling down, etc; disabling may improve performance)</label><br>'+
		Game.WriteButton('numbers','numbersButton','Numbers ON','Numbers OFF')+'<label>(numbers that pop up when clicking the cookie)</label><br>'+
		Game.WriteButton('milk','milkButton','Milk ON','Milk OFF')+'<label>(only appears with enough achievements)</label><br>'+
		Game.WriteButton('cursors','cursorsButton','Cursors ON','Cursors OFF')+'<label>(visual display of your cursors)</label><br>'+
		Game.WriteButton('wobbly','wobblyButton','Wobbly cookie ON','Wobbly cookie OFF')+'<label>(your cookie will react when you click it)</label><br>'+
		Game.WriteButton('cookiesound','cookiesoundButton','Alt cookie sound ON','Alt cookie sound OFF')+'<label>(how your cookie sounds when you click on it)</label><br>'+
		Game.WriteButton('crates','cratesButton','Icon crates ON','Icon crates OFF')+'<label>(display boxes around upgrades and achievements in stats)</label><br>'+
		Game.WriteButton('monospace','monospaceButton','Alt font ON','Alt font OFF')+'<label>(your cookies are displayed using a monospace font)</label><br>'+
		Game.WriteButton('format','formatButton','Short numbers OFF','Short numbers ON','BeautifyAll();Game.RefreshStore();Game.upgradesToRebuild=1;',1)+'<label>(shorten big numbers)</label><br>'+
		Game.WriteButton('notifs','notifsButton','Fast notes ON','Fast notes OFF')+'<label>(notifications disappear much faster)</label><br>'+
		Game.WriteButton('autoupdate','autoupdateButton','Offline mode OFF','Offline mode ON',0,1)+'<label>(disables update notifications)</label><br>'+
		Game.WriteButton('warn','warnButton','Closing warning ON','Closing warning OFF')+'<label>(the game will ask you to confirm when you close the window)</label><br>'+
		Game.WriteButton('focus','focusButton','Defocus OFF','Defocus ON',0,1)+'<label>(the game will be less resource-intensive when out of focus)</label><br>'+
		'</div>'+
		'<div class="title">Addon</div>'+
		'<div class="listing">'+
		Game.WriteButton('statistics','statisticsButton','Statistics ON','Statistics OFF',1,0)+'<label>(stats on the next purchase)</label><br>'+
		'</div>'+
		'<div style="padding-bottom:128px;"></div>'+
		'</div>';
		l('menu').innerHTML = str;
	}
	else if(Game.onMenu == 'stats')
	{
		var buildingsOwned=0;
		buildingsOwned=Game.BuildingsOwned;
		var upgrades='';
		var cookieUpgrades='';
		var hiddenUpgrades='';
		var prestigeUpgrades='';
		var upgradesTotal=0;
		var upgradesOwned=0;
		var prestigeUpgradesTotal=0;
		var prestigeUpgradesOwned=0;
		var list=[];
		for (var i in Game.Upgrades)
		{
			list.push(Game.Upgrades[i]);
		}
		var sortMap=function(a,b)
		{
			if (a.order>b.order) return 1;
			else if (a.order<b.order) return -1;
			else return 0;
		}
		list.sort(sortMap);
		for (var i in list)
		{
			var str2='';
			var me=list[i];	
			str2+=Game.crate(me,'stats');
			if (me.bought)
			{
				if (Game.CountsAsUpgradeOwned(me.pool)) upgradesOwned++;
				else if (me.pool=='prestige') prestigeUpgradesOwned++;
			}
			if (me.pool=='' || me.pool=='cookie' || me.pool=='tech') upgradesTotal++;
			if (me.pool=='debug') hiddenUpgrades+=str2;
			else if (me.pool=='prestige') {prestigeUpgrades+=str2;prestigeUpgradesTotal++;}
			else if (me.pool=='cookie') cookieUpgrades+=str2;
			else if (me.pool!='toggle' && me.pool!='unused') upgrades+=str2;
		}
		var achievements=[];
		var achievementsOwned=0;
		var achievementsTotal=0;		
		var list=[];
		for (var i in Game.Achievements)//sort the achievements
		{
					list.push(Game.Achievements[i]);
		}
		var sortMap=function(a,b)
		{
			if (a.order>b.order) return 1;
			else if (a.order<b.order) return -1;
			else return 0;
		}
		list.sort(sortMap);				
		for (var i in list)
		{
			var me=list[i];
			if (me.pool=='normal' || me.won>0) achievementsTotal++;
			var pool=me.pool;
			if (!achievements[pool]) achievements[pool]='';		
			achievements[pool]+=Game.crate(me,'stats');
			if (me.won>0) achievementsOwned++;
		}		
		var achievementsStr='';
		var pools=
		{
			'dungeon':'<b>Dungeon achievements</b> <small>(Not technically achievable yet.)</small>',
			'shadow':'<b>Shadow achievements</b> <small>(These are feats that are either unfair or difficult to attain. They do not give milk.)</small>'
		};
		for (var i in achievements)
		{
			if (achievements[i]!='')
			{
				if (pools[i]) achievementsStr+='<div class="listing">'+pools[i]+'</div>';
				achievementsStr+='<div class="listing crateBox">'+achievements[i]+'</div>';
			}
		}	
		var santaStr='';
		var frames=15;
		if (Game.Has('A festive hat'))
		{
			for (var i=0;i<=Game.santaLevel;i++)
			{
				santaStr+='<div '+Game.getTooltip(
				'<div class="prompt" style="text-align:center;padding-bottom:6px;white-space:nowrap;margin:0px 32px;"><div style="width:96px;height:96px;margin:4px auto;background:url(img/santa.png) '+(-i*96)+'px 0px;filter:drop-shadow(0px 3px 2px #000);-webkit-filter:drop-shadow(0px 3px 2px #000);"></div><div class="line"></div><h3>'+Game.santaLevels[i]+'</h3></div>'
				,'top')+' style="background:url(img/santa.png) '+(-i*48)+'px 0px;background-size:'+(frames*48)+'px 48px;" class="trophy"></div>';
			}
			santaStr+='<div style="clear:both;"></div>';
		}
		var dragonStr='';
		var frames=8;
		var mainLevels=[0,4,8,19,21];
		if (Game.Has('A crumbly egg'))
		{
			for (var i=0;i<=mainLevels.length;i++)
			{
				if (Game.dragonLevel>=mainLevels[i])
				{
					var level=Game.dragonLevels[mainLevels[i]];
					dragonStr+='<div '+Game.getTooltip(
					'<div class="prompt" style="text-align:center;padding-bottom:6px;white-space:nowrap;margin:0px 32px;"><div style="width:96px;height:96px;margin:4px auto;background:url(img/dragon.png) '+(-level.pic*96)+'px 0px;filter:drop-shadow(0px 3px 2px #000);-webkit-filter:drop-shadow(0px 3px 2px #000);"></div><div class="line"></div><h3>'+level.name+'</h3></div>'
					,'top')+' style="background:url(img/dragon.png) '+(-level.pic*48)+'px 0px;background-size:'+(frames*48)+'px 48px;" class="trophy"></div>';
				}
			}
			dragonStr+='<div style="clear:both;"></div>';
		}
		var ascensionModeStr='';
		var icon=Game.ascensionModes[Game.ascensionMode].icon;
		if (Game.resets>0) ascensionModeStr='<span style="cursor:pointer;" '+Game.getTooltip(
					'<div style="min-width:200px;text-align:center;font-size:11px;">'+Game.ascensionModes[Game.ascensionMode].desc+'</div>'
					,'top')+'><div class="icon" style="display:inline-block;float:none;transform:scale(0.5);margin:-24px -16px -19px -8px;background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px;"></div>'+Game.ascensionModes[Game.ascensionMode].name+'</span>';	
		var milkName=Game.Milk.name;	
		var researchStr=Game.sayTime(Game.researchT);
		var pledgeStr=Game.sayTime(Game.pledgeT);
		var wrathStr='';
		if (Game.elderWrath==1) wrathStr='awoken';
		else if (Game.elderWrath==2) wrathStr='displeased';
		else if (Game.elderWrath==3) wrathStr='angered';
		else if (Game.elderWrath==0 && Game.pledges>0) wrathStr='appeased';	
		var date=new Date();
		date.setTime(Date.now()-Game.startDate);
		var timeInSeconds=date.getTime()/1000;
		var startDate=Game.sayTime(timeInSeconds*Game.fps,2);
		var startDateDays=Game.sayTime(timeInSeconds*Game.fps,1);
		date.setTime(Date.now()-Game.fullDate);
		var fullDate=Game.sayTime(date.getTime()/1000*Game.fps,2);
		if (!fullDate || fullDate.length<1) fullDate='a long while';
		var heavenlyMult=Game.GetHeavenlyMultiplier();
		var seasonStr=Game.sayTime(Game.seasonT);
		str+='<div class="section">Statistics</div>'+
		'<div class="subsection">'+
		'<div class="title">General</div>'+
		'<div class="listing"><b>Cookies in bank :</b> <div class="price plain">'+Game.tinyCookie()+Beautify(Game.cookies)+'</div></div>'+
		'<div class="listing"><b>Cookies baked (this ascension) :</b> <div class="price plain">'+Game.tinyCookie()+Beautify(Game.cookiesEarned)+'</div></div>'+
		'<div class="listing"><b>Cookies baked (all time) :</b> <div class="price plain">'+Game.tinyCookie()+Beautify(Game.cookiesEarned+Game.cookiesReset)+'</div></div>'+
		(Game.cookiesReset>0?'<div class="listing"><b>Cookies forfeited by ascending :</b> <div class="price plain">'+Game.tinyCookie()+Beautify(Game.cookiesReset)+'</div></div>':'')+
		(Game.resets?('<div class="listing"><b>Legacy started :</b> '+(fullDate==''?'just now':(fullDate+' ago'))+', with '+Beautify(Game.resets)+' ascension'+(Game.resets==1?'':'s')+'</div>'):'')+
		'<div class="listing"><b>Run started :</b> '+(startDate==''?'just now':(startDate+' ago'))+'</div>'+
		'<div class="listing"><b>Buildings owned :</b> '+Beautify(buildingsOwned)+'</div>'+
		'<div class="listing"><b>Cookies per second :</b> '+Beautify(Game.cookiesPs,1)+' <small>'+
		'(multiplier : '+Beautify(Math.round(Game.globalCpsMult*100),1)+'%)'+
		(Game.cpsSucked>0?' <span class="warning">(withered : '+Beautify(Math.round(Game.cpsSucked*100),1)+'%)</span>':'')+
		'</small></div>'+
		'<div class="listing"><b>Cookies per click :</b> '+Beautify(Game.computedMouseCps,1)+'</div>'+
		'<div class="listing"><b>Cookie clicks :</b> '+Beautify(Game.cookieClicks)+'</div>'+
		'<div class="listing"><b>Hand-made cookies :</b> '+Beautify(Game.handmadeCookies)+'</div>'+
		'<div class="listing"><b>Golden cookie clicks :</b> '+Beautify(Game.goldenClicksLocal)+' <small>(all time : '+Beautify(Game.goldenClicks)+')</small></div>'+//' <span class="hidden">(<b>Missed golden cookies :</b> '+Beautify(Game.missedGoldenClicks)+')</span></div>'+
		'<br><div class="listing"><b>Running version :</b> '+Game.version+'</div>'+	
		((researchStr!='' || wrathStr!='' || pledgeStr!='' || santaStr!='' || dragonStr!='' || Game.season!='' || ascensionModeStr!='')?(
		'</div><div class="subsection">'+
		'<div class="title">Special</div>'+
		(ascensionModeStr!=''?'<div class="listing"><b>Challenge mode :</b>'+ascensionModeStr+'</div>':'')+
		(Game.season!=''?'<div class="listing"><b>Seasonal event :</b> '+Game.seasons[Game.season].name+
		(seasonStr!=''?' <small>('+seasonStr+' remaining)</small>':'')+
		'</div>':'')+
		(Game.season=='fools'?
			'<div class="listing"><b>Money made from selling cookies :</b> $'+Beautify(Game.cookiesEarned*0.08,2)+'</div>'+
			(Game.Objects['Portal'].amount>0?'<div class="listing"><b>TV show seasons produced :</b> '+Beautify(Math.floor((timeInSeconds/60/60)*(Game.Objects['Portal'].amount*0.13)+1))+'</div>':'')
		:'')+
		(researchStr!=''?'<div class="listing"><b>Research :</b> '+researchStr+' remaining</div>':'')+
		(wrathStr!=''?'<div class="listing"><b>Grandmatriarchs status :</b> '+wrathStr+'</div>':'')+
		(pledgeStr!=''?'<div class="listing"><b>Pledge :</b> '+pledgeStr+' remaining</div>':'')+
		(Game.wrinklersPopped>0?'<div class="listing"><b>Wrinklers popped :</b> '+Beautify(Game.wrinklersPopped)+'</div>':'')+
		(Game.reindeerClicked>0?'<div class="listing"><b>Reindeer found :</b> '+Beautify(Game.reindeerClicked)+'</div>':'')+
		(santaStr!=''?'<div class="listing"><b>Santa stages unlocked :</b></div><div>'+santaStr+'</div>':'')+
		(dragonStr!=''?'<div class="listing"><b>Dragon training :</b></div><div>'+dragonStr+'</div>':'')+''
		):'')+
		((Game.prestige>0 || prestigeUpgrades!='')?(
		'</div><div class="subsection">'+
		'<div class="title">Prestige</div>'+
		'<div class="listing"><div class="icon" style="float:left;background-position:'+(-19*48)+'px '+(-7*48)+'px;"></div>'+
		'<div style="margin-top:8px;"><span class="title" style="font-size:22px;">Prestige level : '+Beautify(Game.prestige)+'</span> at '+Beautify(heavenlyMult*100,1)+'% of its potential <b>(+'+Beautify(parseFloat(Game.prestige)*Game.heavenlyPower*heavenlyMult,1)+'% CpS)</b><br>Heavenly chips : <b>'+Beautify(Game.heavenlyChips)+'</b></div>'+
		'</div>'+
		(prestigeUpgrades!=''?(
		'<div class="listing" style="clear:left;"><b>Prestige upgrades unlocked :</b> '+prestigeUpgradesOwned+'/'+prestigeUpgradesTotal+' ('+Math.floor((prestigeUpgradesOwned/prestigeUpgradesTotal)*100)+'%)</div>'+
		'<div class="listing crateBox">'+prestigeUpgrades+'</div>'):'')+
		''):'')+
		'</div><div class="subsection">'+
		'<div class="title">Upgrades unlocked</div>'+
		(hiddenUpgrades!=''?('<div class="listing"><b>Debug</b></div>'+
		'<div class="listing crateBox">'+hiddenUpgrades+'</div>'):'')+
		'<div class="listing"><b>Unlocked :</b> '+upgradesOwned+'/'+upgradesTotal+' ('+Math.floor((upgradesOwned/upgradesTotal)*100)+'%)</div>'+
		'<div class="listing crateBox">'+upgrades+'</div>'+
		(cookieUpgrades!=''?('<div class="listing"><b>Cookies</b></div>'+
		'<div class="listing crateBox">'+cookieUpgrades+'</div>'):'')+
		'</div><div class="subsection">'+
		'<div class="title">Achievements</div>'+
		'<div class="listing"><b>Unlocked :</b> '+achievementsOwned+'/'+achievementsTotal+' ('+Math.floor((achievementsOwned/achievementsTotal)*100)+'%)</div>'+
		'<div class="listing"><b>Milk :</b> '+Math.round(Game.milkProgress*100)+'% ('+milkName+') <small>(Note : you gain milk through achievements. Milk can unlock unique upgrades over time.)</small></div>'+
		achievementsStr+
		'</div>'+
		'<div style="padding-bottom:128px;"></div>';
		l('menu').innerHTML = str;
	}
}
Addon.CCMenu = Game.UpdateMenu;
Game.UpdateMenu = function()
{
	Addon.CCMenu();
	Addon.AddMenu();
}
