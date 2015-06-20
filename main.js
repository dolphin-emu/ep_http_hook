var crypto = require("crypto");
var request = require("request");
var settings = require('ep_etherpad-lite/node/utils/Settings');

// Constants
var BATCHING_TIME_MS = 2000;

// Globals (boo).
var pending_events = [];
var pending_events_sender = null;

function computeHmac(data) {
  var key = settings.ep_http_hook.hmac_key || '';
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

function sendSerializedEvents(data) {
  request.post({ url: settings.ep_http_hook.url, body: data });
}

function sendEvent(data) {
  if (!settings.ep_http_hook || !settings.ep_http_hook.url) {
    return;
  }

  if (pending_events_sender) {
    clearTimeout(pending_events_sender);
  }
  pending_events.push(data);
  pending_events_sender = setTimeout(function () {
    pending_events_sender = null;
    var serialized_data = JSON.stringify(pending_events);
    var data_to_send = computeHmac(serialized_data) + ' ' + serialized_data;
    sendSerializedEvents(data_to_send);
    pending_events = [];
  }, BATCHING_TIME_MS);
};

exports.padUpdate = function (hook_name, context) {
  var pad = context.pad;
  var hook_data = {
    type: "pad_update",
    id: pad.id,
    text: pad.atext.text
  };
  sendEvent(hook_data);
};
