
module.exports.sendMessage = function (response, message) {
    console.log('event call x');
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