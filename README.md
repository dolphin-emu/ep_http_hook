# ep_http_hook

Pushes pad updates to a remote location through HTTP POST requests. Batches
updates to avoid overloading the remote location.

## Settings

```
"ep_http_hook": {
  "url": "https://...",
  "hmac_key": "secret"
}
```

## POST content

The updates are sent as POST requests with the following body:

* HMAC-SHA256 of the payload (in hex encoding).
* A space character.
* The payload data as JSON.

The payload is a list of events which can be of the following types (identified
by their `type` field):

* `pad_update`: A pad was updated. The pad id is contained in the `id` field,
  and its raw contents in the `text` field.
