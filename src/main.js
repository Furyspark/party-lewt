var fs = require("fs");

var express = require("express");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var datamanager = require("./src/datamanager");
var games = datamanager.load();

var port = 8010;

app.use('/static', express.static('static'));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
	console.log("A user connected");
	socket.emit("data-full", games);

	// Message: Disconnect
	socket.on("disconnect", function() {
		console.log("A user disconnected.");
	});

	// Message: Receive edited item
	socket.on("edit-item", function(game, unit, itemIndex, item) {
		var items, success = false;
		if(games[game] && games[game].units[unit]) {
			items = games[game].units[unit].items;
			items.splice(itemIndex, 1, item);
			success = true;
			console.log("Edited item: " + item.name + " in " + games[game].name + "'s " + games[game].units[unit].name + ".");
			socket.broadcast.emit("edit-item", game, unit, itemIndex, item);
			datamanager.save(games);
		}
		if(!success) {
			console.log("Failed to edit item: " + item.name + ".");
		}
	});

	// Message: Receive new item
	socket.on("new-item", function(game, unit, item) {
		var items;
		if(games[game] && games[game].units[unit]) {
			items = games[game].units[unit].items;
			items.push(item);
			console.log("New item: " + item.name + " in " + games[game].name + "'s " + games[game].units[unit].name + ".");
			socket.broadcast.emit("new-item", game, unit, item);
		}
	});

	// Message: Delete item
	socket.on("delete-item", function(game, unit, itemIndex) {
		var items;
		if(games[game] && games[game].units[unit]) {
			items = games[game].units[unit].items;
			var item = items.splice(itemIndex, 1)[0];
			console.log("Removed item: " + item.name + " in " + games[game].name + "'s " + games[game].units[unit].name + ".");
			socket.broadcast.emit("delete-item", game, unit, itemIndex);
		}
	});
});

http.listen(port, function() {
	console.log("Listening on port " + port.toString());
});
