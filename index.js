// Pkgs imported by node.js
const got = require("got");  // REst api client
const chalk = require('chalk');
const os = require('os');

var config = {};
// Retrieve our api token from the environment variables.
config.token = process.env.DO_TOKEN;

// Check to see if token is define; if not send error message
if (!config.token) {
	console.log(chalk`{red.bold DO_TOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

console.log(chalk.green(`Your token is: ${config.token.substring(0, 4)}...`));

// Configure our headers to use our token when making REST api requests.
const header =
{
	'Content-Type': 'application/json',
	Authorization: 'Bearer ' + config.token
};


class DigitalOceanProvider {
	// Documentation for needle:
	// https://github.com/tomas/needle

	async makeRequest(url) {
		let response = await got(url, { headers: header, responseType: 'json' })
			.catch(err => console.error(`${url} ${err}`));

		if (!response) return;

		if (response.headers) {
			console.log(chalk.yellow(`Calls remaining ${response.headers["ratelimit-remaining"]}`));
		}
		return response;
	}

	async createDroplet(dropletName, region, imageName) {
		if (dropletName == "" || region == "" || imageName == "") {
			console.log(chalk.red("You must provide non-empty parameters for createDroplet!"));
			return;
		}

		var data =
		{
			'name': dropletName,
			'region': region,
			'size': "512mb",
			'image': imageName,
			'ssh_keys': [26294894],
			'backups': false,
			'ipv6': false,
			'user_data': null,
			'private_networking': null
		};

		console.log("Attempting to create: " + JSON.stringify(data));

		let response = await got.post("https://api.digitalocean.com/v2/droplets",
			{
				headers: header,
				body: JSON.stringify(data)
			}).catch(err =>
				console.error(chalk.red(`createDroplet: ${err}`))
			);

		if (!response) return;

		console.log(response.statusCode);

		if (response.statusCode == 202) {
			console.log(chalk.green(`Created droplet ${response.body}`));
		}
	}

	async dropletInfo(id) {
		if (typeof id != "number") {
			console.log(chalk.red("You must provide an integer id for your droplet!"));
			return;
		}

		// Make REST request
		let response = await this.makeRequest(`https://api.digitalocean.com/v2/droplets/${id}`)

		if (!response) return;

		if (response.body.droplet) {
			let droplet = response.body.droplet;
			console.log(droplet);

			// Print out IP address
			console.log("Public IP Address:", droplet.networks.v4[0].ip_address)
		}

	}

};


async function provision() {
	let client = new DigitalOceanProvider();

	// #############################################
	// 1. Create an droplet with the specified name, region, and image
	// Comment out when completed. ONLY RUN ONCE!!!!!
	// var name = "UnityId"+os.hostname();
	// var region = "nyc1"; // Fill one in from #1
	// var image = "centos-6-x64"; // Fill one in from #2
	// await client.createDroplet(name, region, image);

	// Record the droplet id that you see print out in a variable.
	var dropletId = 176097591;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// BEFORE MOVING TO STEP FOR, REMEMBER TO COMMENT OUT THE `createDroplet()` call!!!

	// #############################################
	// #2. Extend the client to retrieve information about a specified droplet.
	// We print out IP address!
	await client.dropletInfo(dropletId);

	// #############################################
	// #5 In the command line, ping your server, make sure it is alive!
	// ping 167.172.150.129
}


// Run workshop code... Calling main()
(async () => {
	await provision();
})();
