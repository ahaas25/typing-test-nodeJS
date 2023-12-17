const express= require("express");
const path = require("path");
const app = express();
const fs = require(`fs`);
const readline = require('readline');
require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 
const bodyParser = require("body-parser");

port = -1;

function main() {
    if (process.argv.length == 3) {
        port = process.argv[2];
    } else {
        console.log("Usage summerCampSerever.js port");
        process.exit(0);
    }
    expressSetup();
    
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Type itemsList or stop to shutdown the server: ' // Set a custom prompt
        });
    rl.prompt();
    rl.on('line', (line) => {
    // Process the entered command
    processCommand(line.trim());
    
    // Display the prompt again
    rl.prompt();
    });
}

function expressSetup() {
    app.set("views", path.resolve(__dirname, "templates"));
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(express.static('assets'));

    /* view/templating engine */
    app.set("view engine", "ejs");

    /* Root */
    app.get("/", (request, response) => {     
        response.render("index");
      });

    app.get("/stats", (request, response) => {     
      response.render("myStats");
    });

    app.get("/leaderboard", (request, response) => {     
      response.render("leaderboard");
    });

    app.get("/about", (request, response) => {     
      response.render("about");
    });




    app.listen(port);
}

function processCommand(command) {
    if (command == "stop") {
        console.log("Shutting down the server");
        process.exit(0);
    } else if (command == "itemsList") {
        console.log(itemsList.itemList);
    } else {
        console.log(`Invalid command: ${command}`);
    }
}

main();