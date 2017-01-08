# SteamTrade

This is a handler for trade related functionality, to be used with the `node-steam` module. It is basically a straight copy of Seishun's module [here](https://github.com/seishun/node-steam/tree/master/lib/handlers/trading).

Initialize it by passing a SteamClient instance to the constructor.

```js
var Steam      = require('node-steam'),
    SteamTrade = require('node-steam-trade');

var client = new Steam.SteamClient();

Steam.SteamTrade = new SteamTrade(client);
```

## Methods

### trade(steamID)

Sends a trade request to the specified user.

### respondToTrade(tradeID, acceptTrade)

Same `tradeID` as the one passed through the ['tradeProposed' event](#tradeproposed). `acceptTrade` should be `true` or `false`.

### cancelTrade(steamID)

Cancels your proposed trade to the specified user.

## Events

### 'tradeProposed'
* Trade ID
* SteamID of the user who proposed the trade

You were offered a trade.

### 'tradeResult'
* Trade ID
* `EEconTradeResponse`
* SteamID of the user you sent a trade request

Listen for this event if you are the one sending a trade request.

### 'sessionStart'
* SteamID of the other party

The trade is now available at http://steamcommunity.com/trade/{SteamID}. You can use [node-steam-trade](https://github.com/seishun/node-steam-trade) to automate the trade itself.
