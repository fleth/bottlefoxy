var FFXIVEmotter = {
	emoteList: [],
	shareURL: "https://goo.gl/UDyiwt",
	tweetBaseURL: "https://twitter.com/intent/tweet", 
	tweetButtonOption: "width=550,height=250,personalbar=no,toolbar=no,location=yes,scrollbars=yes,resizable=yes",
	init: function(){
		this.load();
		$("#tweet").click(function(){
			var url = this.createTweetURL($("#tweet-text").val());
			window.open(url, null, this.tweetButtonOption);
		}.bind(this));
	},
	load: function(){
		$.getJSON("ffxivemote.json")
			.success(this.onData.bind(this))
			.error(this.onFail.bind(this));
	},
	onData(data){
		this.emoteList = data.data;
		$.map(this.emoteList,function(value, key){
			this.create(key, value);
		}.bind(this));
	},
	onFail: function (jqXHR, textStatus, errorThrown) {
		console.log(textStatus);
	},
	create: function(name, emotes){
		var list = $("<div class='col-lg-12 text-center'>");
		var panel = $("<div class='panel'>");
		var title = $("<div class='panel-heading ffxiv-panel-bg'>")
			.append($("<span class='ffxiv-font'>").text(name));
		var body = $("<div class='panel-body ffxiv-panel-bg'>");
		panel.append(title);
		panel.append($("<hr class='ffxiv-panel-hr'>"));
		$.map(emotes, function(value, key){
			var row = this.createRow(name, key, value);
			var a = this.createEmoteLink(value);
			body.append(a.append(row));
		}.bind(this));
		body.append($("<div class='clearfix'>"));
		panel.append(body);
		list.append(panel);
		$("#content").append(list);
		$("img.lazy-"+name).lazyload({effect:"fadeIn"});
	},
	createRow: function(name, command, emote){
		var row = $("<div class='row emote-icon col-lg-3 col-md-3 col-sm-4 col-xs-6'>");
		row.css("min-width", "200px");
		row.append($("<div class='col-xs-3'>").append(this.createImage(name, command, emote)));
		row.append($("<div class='col-xs-9 text-left ffxiv-font'>").append(this.createDescription(emote.name, command)));
		return row;
	},
	createImage: function(name, command, emote){
		var image = $("<img class='lazy-"+name+"'>");
		image.attr("data-original", "image/"+name+"/"+command+"."+emote.image);
		image.attr("width", "30");
		image.attr("height", "30");
		image.attr("title", "/"+command);
		return image;
	},
	createDescription: function(message, command){
		var description = $("<span>");
		description.text(message);
		description.attr("title", "/"+command)
		return description;
	},
	createEmoteLink: function(emote){
		var a = $("<a>");
		a.attr("href", "javascript:void(0);");
		a.click(function(){
			var text = this.replaceMessage(this.getMessage(emote));
			$("#tweet-text").val(text);
		}.bind(this));
		return a;
	},
	createTweetURL: function(message){
		var params = {
			text: message,
			url: this.shareURL
		};
		var url = this.tweetBaseURL+"?"+$.param(params)
		return url;
	},
	getMessage: function(emote){
		var target = $("#target");
		if(target.val() == ""){
			return emote.no_target;
		}
		return emote.target;
	},
	replaceMessage: function(message){
		var me = $("#me");
		var target = $("#target");
		if(me.val() != "") message = message.replace("<me>", me.val());
		if(target.val() != "") message = message.replace("<target>", target.val());
		return message;
	}
};