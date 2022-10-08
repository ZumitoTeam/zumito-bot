![Zumito banner](/assets/images/banner.png?raw=true)
<div align="center">
 <a href="https://zumito.ga">Website</a> 
 •
 <a href="https://discord.gg/EwEhgKCmSy">Discord server</a> 
</div>
 
# Zumito 🧃
[![CodeFactor](https://www.codefactor.io/repository/github/fernandomema/zumito/badge)](https://www.codefactor.io/repository/github/fernandomema/zumito)
![GitHub Repo stars](https://img.shields.io/github/stars/fernandomema/zumito)

Multipurpose discord bot
- [Zumito 🧃](#zumito---)
- [Tech stack](#tech-stack)
- [Development](#development)
  * [Project requeriments](#project-requeriments)
  * [Getting started](#getting-started)
    + [Setup project](#setup-project)
    + [Start bot](#start-bot)
  * [Contributing](#contributing)
    + [Submiting bug or error](#submiting-bug-or-error)
    + [Submiting ideas](#submiting-ideas)
    + [Translating](#translating)
    + [Coding](#coding)

# Tech stack
- [Node.js](https://nodejs.org/en/) - JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) - JavaScript superset
- [Discord.js](https://discord.js.org/#/) - Discord API wrapper
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Zumito Framework](https://github.com/fernandomema/zumito-framework) - Zumito's self-made framework
# Development
## Project requeriments
* Node.js (16.X or higher) and NPM
* Discord bot token, clientID and client secret
* MongoDB database

## Getting started
### Setup project
To start editing the bot you need to download the project
```bash
git clone https://github.com/fernandomema/Zumito.git
cd Zumito
```
Next steep is to download project dependencies
```bash
npm install
```
And finally copy .env.example to .env and edit your tokens and DB info.
```bash
cp .env.example .env
```

### Start bot
To start bot you just need to run that command on project root
```bash
npm start
```
## Contributing
We have a lot of work and need for a lot of help. For this reason any help is welcome and we have organized some of the main options in which you can contribute with your grain of sand.
Please note that if you have any other ideas on how to contribute we are all ears, we are not limited to the following list.
### Submiting bug or error
If you found an error using the bot feel free to [open issue](https://github.com/fernandomema/Zumito/issues/new/choose) and tell us what happen.
Is important you provide as much details as you can, cause we need to be able to reproduce the error in order to find a solution.
### Submiting ideas
Ideas are always welcome, inspiration is something that cannot be bought. So if you have any idea for the bot feel free to tell us what you think [opening a new issue](https://github.com/fernandomema/Zumito/issues/new/choose)
### Translating
Knowledge of a language is a great way to open doors to the whole world, so if you know a language you can always bring Zumito to a lot of new people.
Just create a pull request with the new language file and we will review it.
- The language files are located in ``src/modules/[module name]/translations/[language code].json``
- The language code must be in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format
- The language file must be a valid JSON file
- The main language is english, so you can use it as a reference
- To add a new language you just need to create a new file with the correct language code, bot will automatically detect it
### Coding
If you can code you can do almost everithing you want, just sumbit a pull request and we will review as fast as we can.
If you want to contribute coding but you don't know what, you can check the [projects tab](https://github.com/fernandomema/Zumito/projects). There is a lot of things to implement or fix. Feel free to open te task issue, assign to you and/or [ask for more details](https://github.com/fernandomema/Zumito/discussions/new) on that task.
