# CTFTime Event Discord Bot

A simple Discord bot to call details for upcoming CTFs.

Data relies on the work of the CTFTime community, and is in no way intended to replace the website itself. 

## Setup

* Clone this repository `git clone https://github.com/LinusKay/ctftime-bot`
* Install required packages `npm i` 
* [Create a Discord bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) and invite it to your server
* Create a `config.json` in the project root directory, swapping in your details where required
```
    {
        "token": "DISCORD BOT TOKEN",
        "clientId": "DISCORD BOT APPLICATION ID",
        "guildId": "DISCORD SERVER ID"
    }
```
* run `node .`

## Commands
### upcoming {startdate} {enddate} {results}
View upcoming CTF events. By default will display events in the next 7 days, limited to 10 results. With command arguments you can search any time period, but results will be limited to 25 due to Embed size limits. 

### eventinfo {eventid}
View details for a specific event. Event IDs are displayed in results for the upcoming command

For wider data ranges I highly recommend checking out the API yourself: https://ctftime.org/api/