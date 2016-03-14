var request = require('request');

var version = "v1";
var url = "https://panel.cloudatcost.com/api/" + version + '/';

/*
 * Cloud@Cost API client.
 *
 * @param key The API key to access the C@C API with
 * @param login The email to allows to use C@C API
 */
function CloudAtCost(key, login) {
    if(!key)
        throw new Error("API key is required");
    if(!login)
        throw new Error("Email is required");

    this.key = key;
    this.login = login;
}

CloudAtCost.prototype.execute = function(route, params, cb) {
    if(typeof params === "function")
        cb = params;

    //collect special fields
    var method = params.method || "GET";
    //filter special fields
    params = Object.keys(params)
        .filter(key => key != "method")
        .reduce((obj, key) => {
            obj[key] = params[key];
            return obj;
        }, {});

    //merge params with creds
    var creds = {
        key: this.key,
        login: this.login
    };
    params = Object.assign({}, creds, params);

    var methods = {
        GET: "qs",
        POST: "form"
    };

    var options = {
        uri: url + route + ".php",
        json: true,
        rejectUnauthorized: false,
        [methods[method]]: params,
        method
    };

    request(options, function(err, res, body) {
        if(err) {
            console.log(err);
            cb({
                status: err.code && err.code === 'ENETUNREACH'
                    ? "down"
                    : err
            });
        } else if(res.statusCode === 200)
            cb(null, body);
        else
            console.log(res.statusCode, err, body);
    });
};


/*
 * List Servers
 * List all servers on the account
 *
 * @param cb Callback function to call after the request
 */
CloudAtCost.prototype.listServers = function(cb) {
  this.execute('listservers', cb);
};

/*
 * List Templates
 * List all templates available
 *
 * @param cb Callback function to call after the request
 */
CloudAtCost.prototype.listTemplates = function(cb) {
  this.execute('listtemplates', cb);
};

/*
 * List Tasks
 * List all tasks in operation
 *
 * @param cb Callback function to call after the request
 */
CloudAtCost.prototype.listTasks = function(cb) {
  this.execute('listtasks', cb);
};

/*
 * Power Operations
 * Activate server power operations
 *
 * @param sid Server ID
 * @param action Action to execute on the server (= poweron, poweroff, reset)
 * @param cb Callback function to call after the request
 */
CloudAtCost.prototype.powerOp = function(sid, action, cb) {
  this.execute('powerop', { method: 'POST', sid: sid, action: action }, cb);
};

/*
 * Console
 * Request URL for console access
 *
 * @param sid Server ID
 * @param cb Callback function to call after the request
 */
CloudAtCost.prototype.console = function(sid, cb) {
  this.execute('console', { method: 'POST', sid: sid }, cb);
};

/*
 * CloudPRO - Resources
 * Check CloudPRO resource availability
 *
 * @param cb Callback function to call after the request
 */
CloudAtCost.prototype.pro_resources = function(cb) {
  this.execute('cloudpro/resources', { method: 'GET' }, cb);
};

/*
 * CloudPRO - Build
 * Provisions an instance with CloudPRO
 *
 * @param cb Callback function to call after the request
 */
CloudAtCost.prototype.pro_build = function(specs, cb) {
  this.execute('cloudpro/build', Object.assign({ method: "POST" }, specs), cb);
};

/*
 * CloudPRO - Build
 * Deletes a CloudPRO instance
 *
 * @param cb Callback function to call after the request
 */
CloudAtCost.prototype.pro_delete = function(sid, cb) {
  this.execute('cloudpro/delete', { sid, method: "POST" }, cb);
};

module.exports = CloudAtCost;
