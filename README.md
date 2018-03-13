<h1 align="center">
    <a href="https://discord.gg/JtFFkzk"><img src="https://i.imgur.com/6hUjiER.png" width="256px" alt="Monika"></a>
  <br>
    Monika
  <br>
 </h1>
<h4 align="center">Monika greets you <3</h4>
<h5 align="center">This Code is provided as is, there will be no support for getting it to run. We only fix bugs.</h5>
  <p align="center">
      <a href="https://discord.gg/JtFFkzk" target="_blank"><img src="https://discordapp.com/assets/fc0b01fe10a0b8c602fb0106d8189d9b.png" width="256px" alt="Discord"></a>
  </p>
  <p align="center">
  <a href="https://travis-ci.org/weebs-online/Monika" target="_blank"><img src="https://travis-ci.org/weebs-online/Monika.svg?branch=master" alt="Build"></a>
  <a href="https://david-dm.org/weebs-online/monika" target="_blank"><img src="https://david-dm.org/weebs-online/monika/status.svg" alt="Dependencies"></a>
  </p>

### Installation
* Clone this git repository.
* Copy the sample config files into the configuration folder and edit them to your liking.
* Run 'npm start' in the cmd/terminal
* The bot should be online now. If you encounter errors, please open an issue if the same error does not already exists in the issues.

### Config files
Copy "apiKeyConfigSample.json" and "databaseConfigSample.json" to the configuration folder and remove ".sample" from the name and put in everything that's missing.

### Environment variables
We use the environment variable "NODE_ENV" to determine whether we are running Monika in a development or production environment.
If set to production, the bot will only send important logs. If you leave it blank or use development then Monika will give you detailed information
on everything she is doing.
* NODE_ENV => (development or production).
