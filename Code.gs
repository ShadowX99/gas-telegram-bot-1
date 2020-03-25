var token = 'xxxxx';
var publishUrl = 'xxxxx';

function doPost(e) {
  // Make sure to only reply to json requests
  if(e.postData.type == "application/json") {
    
    // Parse the update sent from Telegram
    var update = JSON.parse(e.postData.contents);

    // Instantiate our bot passing the update 
    var bot = new Bot(token, update);
    
    // Building commands
    var bus = new CommandBus();
    bus.on(/\/start/, function () {
      this.replyToSender("Congratulations! It works!");
    });
    
    bus.on(/\/joke\s*([A-Za-z0-9_]+)?\s*([A-Za-z0-9_]+)?/, randomJoke);
    
    // Register the command bus
    bot.register(bus);
    
    // If the update is valid, process it
    if (update) {
      bot.process();
    }   
  }      
}

function setWebhook() {
  var bot = new Bot(token, {});
  var result = bot.request('setWebhook', {
    url: publishUrl
  });
  
  Logger.log(result);
}

function randomJoke(name, surname) {
  var firstName = name || null;
  var lastName = surname || null;
      
  var url = 'http://api.icndb.com/jokes/random?escape=javascript';
  
  if (firstName) url += '&firstName=' + firstName;
  if (lastName) url += '&lastName=' + lastName;
  
  var data = JSON.parse(UrlFetchApp.fetch(url).getContentText());

  this.replyToSender(data.value.joke);
}

function Bot (token, update) {
  this.token = token;
  this.update = update;
  this.handlers = [];
}

Bot.prototype.register = function ( handler) {
  this.handlers.push(handler);
}

Bot.prototype.process = function () {  
  for (var i in this.handlers) {
    var event = this.handlers[i];
    var result = event.condition(this);
    if (result) {
      return event.handle(this);
    }
  }
}

Bot.prototype.request = function (method, data) {
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + this.token + '/' + method, options);
    
  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText());
  }
  
  return false;
}

Bot.prototype.replyToSender = function (text) {
  return this.request('sendMessage', {
    'chat_id': this.update.message.from.id,
    'text': text
  });
}

function CommandBus() {
  this.commands = [];
}

CommandBus.prototype.on = function (regexp, callback) {
  this.commands.push({'regexp': regexp, 'callback': callback});
}

CommandBus.prototype.condition = function (bot) {
  return bot.update.message.text.charAt(0) === '/';
}

CommandBus.prototype.handle = function (bot) {  
  for (var i in this.commands) {
    var cmd = this.commands[i];
    var tokens = cmd.regexp.exec(bot.update.message.text);
    if (tokens != null) {
      return cmd.callback.apply(bot, tokens.splice(1));
    }
  }
  return bot.replyToSender("Invalid command");
}