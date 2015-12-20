var fs = require("fs");

function load() {
	var data = fs.readFileSync("games.json", "UTF-8");

	return JSON.parse(data);
}

function save(data) {
	var rawData = JSON.stringify(data, null, 2);

	fs.writeFileSync("games.json", rawData)
}

module.exports = {
	load: load,
	save: save
};