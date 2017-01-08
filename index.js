'use strict';

var EventEmitter = require('events').EventEmitter,
    Steam        = require('node-steam');

var EMsg   = Steam.EMsg,
    schema = Steam.Internal;

function SteamTrade(steamClient) {
  this._client = steamClient;
  this._client.on('message', function(header, body, callback) {
    if (header.msg in handlers)
      handlers[header.msg].call(this, body, callback);
  }.bind(this));
}

require('util').inherits(SteamTrade, EventEmitter);

// Methods

SteamTrade.prototype.trade = function(user) {
  this._client.send({
    msg: EMsg.EconTrading_InitiateTradeRequest,
    proto: {}
  }, new schema.CMsgTrading_InitiateTradeRequest({
    other_steamid: user
  }).toBuffer());
};

SteamTrade.prototype.respondToTrade = function(tradeId, acceptTrade) {
  this._client.send({
    msg: EMsg.EconTrading_InitiateTradeResponse,
    proto: {}
  }, new schema.CMsgTrading_InitiateTradeResponse({
    trade_request_id: tradeId,
    response: +!acceptTrade
  }).toBuffer());
};

SteamTrade.prototype.cancelTrade = function(user) {
  this._client.send({
    msg: EMsg.EconTrading_CancelTradeRequest,
    proto: {}
  }, new schema.CMsgTrading_CancelTradeRequest({
    other_steamid: user
  }).toBuffer());
};

// Handlers

var handlers = {};

handlers[EMsg.EconTrading_InitiateTradeProposed] = function(data) {
  var tradeProp = Steam._processProto(schema.CMsgTrading_InitiateTradeRequest.decode(data));
  this.emit('tradeProposed', tradeProp.trade_request_id, tradeProp.other_steamid, tradeProp.other_name);
};

handlers[EMsg.EconTrading_InitiateTradeResult] = function(data) {
  var tradeResult = Steam._processProto(schema.CMsgTrading_InitiateTradeResponse.decode(data));
  this.emit('tradeResult', tradeResult.trade_request_id, tradeResult.response, tradeResult.other_steamid);
};

handlers[EMsg.EconTrading_StartSession] = function(data) {
  var startSess = schema.CMsgTrading_StartSession.decode(data);
  this.emit('sessionStart', startSess.other_steamid.toString());
};

module.exports = SteamTrade;
