#node-cloudatcost

node Cloud@Cost API client

API Version: `v1`

## References
https://github.com/cloudatcost/api

## Installation
`npm install cloudatcost`

## Example

```js
var CloudAtCost = require("cloudatcost");

var api = new CloudAtCost("key", "email");

api.listServers(function(err, res) {
    if(err)
        throw new Error(JSON.stringify(err));

    res.data.forEach(server =>
        console.log(JSON.stringify(server))
    );
});

api.listTemplates(function(err, res) {
    if(err)
        throw new Error(JSON.stringify(err));

    res.data.forEach(template =>
        console.log(JSON.stringify(template))
    );
});
```
## License
`node-cloudatcost` uses the MIT License. (See `LICENSE`)

This means you can do whatever you want with this code, as long as you include the same license.
