<h1 align="center">
    <a href="https://discord.gg/JtFFkzk"><img src="https://i.imgur.com/6hUjiER.png" width="256px" alt="Monika"></a>
  <br>
    Monika
  <br>
 </h1>
<h4 align="center">Monika greets you <3</h4>
<h5 align="center">This Code is provided as is, there will be no support for getting it to run. We only fix bugs.</h5>
  <p align="center">
  <a href="https://discord.gg/JtFFkzk"><img src="https://i.imgur.com/81GaSii.png"></a>
  <a href="https://travis-ci.org/weebs-online/Monika" target="_blank"><img src="https://travis-ci.org/weebs-online/Monika.svg?branch=master" alt="Build"></a>
  <a href="https://david-dm.org/weebs-online/monika" target="_blank"><img src="https://david-dm.org/weebs-online/monika/status.svg" alt="Dependencies"></a>
  </p>

### Features
* FULL voice integration (play, pause, resume, volume, queue, skip, skipto, loop, setfav/playfav)
* Search feature (search for anime, manga and "urban dictionary")
* Moderation (prune messages from chat)
* Information (help, whoami, serverinfo, stats, weather)
* And many more...

### Contribute
Feel free to contribute to the bot if you feel the need to push a specific feature.


### Installation
* We are reworking the core and therefore we currently only support rancher/docker setups.
* The image of monika is available at dockerhub: emdix/monika

### Config files
* Config files are being reworked right now.
* You can find the configs in your configuration folder after the first start of the bot though.

### Environment variables
We use the environment variable "NODE_ENV" to determine whether we are running Monika in a development or production environment.
If set to production, the bot will only send important logs. If you leave it blank or use development then Monika will give you detailed information
on everything she is doing.
* NODE_ENV => (development or production).
