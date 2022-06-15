require('module-alias/register');

// Load .env variables
require("dotenv").config();

// Start discord bot
require("./discord.js");

// Start api web server
require('./api.js');