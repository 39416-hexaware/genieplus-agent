
module.exports.sendMessage = function (response, message) {
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
        "speech": message, "displayText": message
      }));
    // return template;
}
module.exports.headerTemplate = function () {
    var header = {
        'Cache-Control': 'no-cache',
        // Authorization: 'Basic MzMyMzg6YWJjMTIz', // + new Buffer(username + ':' + pwd).toString('base64'), //MzMyMzg6YWJjMTIz',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };
    return header;
}
// module.exports = ServiceNowApi;

// class ServiceNowApi {
//     short_description
//     urgency
//     impact
//     caller_id
//     constructor(objServiceNowApi) {
//         this.short_description = objServiceNowApi.short_description == undefined ? "" : objServiceNowApi.short_description;
//         urgency = objServiceNowApi.urgency == undefined ? "" : objServiceNowApi.urgency;
//         impact = objServiceNowApi.impact == undefined ? "" : objServiceNowApi.impact;
//         caller_id = objServiceNowApi.caller_id == undefined ? "" : objServiceNowApi.caller_id;
//     }
// }