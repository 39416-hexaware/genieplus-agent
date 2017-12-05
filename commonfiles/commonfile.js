
module.exports.sendMessage = function (response, message) {
    console.log('event call x');
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
        "speech": message, "displayText": message
      }));
    // return template;
}
