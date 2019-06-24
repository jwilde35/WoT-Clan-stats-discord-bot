var Discord = require('discord.js');
var auth = require('./auth.json');
var request = require("request");
const cheerio = require('cheerio');
var config = require('./config.js');
// Initialize Discord Bot
var bot = new Discord.Client()
bot.on('ready', () => {
    console.log('Connected');
    console.log('Logged in');
	console.log('starting member count');
	setInterval(function() {
	request({
  uri: "https://en.wot-life.com/na/clan/"+ config.clan + "/",
}, function(error, response, body) {
    var $ = cheerio.load(body);
	var members = $('strong').text();
	let guild = bot.guilds.get(config.serverid);
	var dmembers = guild.members.filter(member => !member.user.bot && member.roles.has(config.memberrole)).size;
	
	//if (!guild || !guild.avilable) return console.log("The guild is not availbale.");
	guild.channels.get(config.clanvc).setName(config.clan+" Member count: " + members);
	console.log('set member count to: ' + members)
	guild.channels.get(config.membervc).setName(config.clan+" in Discord: " + dmembers);
	console.log('set discord member count to: ' + dmembers)
	if(config.verification == 'true'){
		var unmembers = guild.members.filter(member => !member.user.bot && member.roles.has(config.verifyrole)).size;
	guild.channels.get(config.unverified).setName("Unverified users: " + unmembers);
	console.log('set unverified count to: ' + unmembers)
	}
});
}, 30000);
})
bot.login(config.token);