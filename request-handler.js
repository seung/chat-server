/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */
var url = require('url');
var http = require("http");
var data = [];
var handleRequest = function(request, response) {


  //var pUrl = url.parse(request.url, true);
  console.log("Serving request type " + request.method 
                          + " for url " + request.url);
  console.log('request.method: ' + request.method);
  var statusCode = 200;
  var defaultCorsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10 // Seconds.
  };
  // var body = JSON.stringify(data);
  if(request.url ==='/classes/messages') {
  
  } else {
    statusCode = 404;
  }

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";

  response.writeHead(statusCode, headers);

  // if(request.method == 'POST') {
  request.on('data', function(chunk) {
    var message = {};
    if(request.method == 'POST') {
      dataarr = chunk.toString().split('&');
      for (var i = 0; i < dataarr.length; i++) {
        var key = dataarr[i].split('=')[0];
        var value = dataarr[i].split('=')[1];
        value = value.split('%20').join(' ');
        message[key] = value;
      }
      data.push(message);
      console.log('data' + JSON.stringify(data));
    }
  });
  // }

  request.on('end', function() {
    response.end(JSON.stringify(data) || []); 
  });
  // response.on('error', function(e) {
  //   console.log("error : " + e.message);
  // })
  // request.on('data', function() {

  // });
};

exports.handleRequest = handleRequest;

// var getData = function() {
//   $.ajax('http://127.0.0.1:8080/classes/messages', {
//     contentType: 'application/json',
//     data: {},
//     success: function(data){
//       processData(data);
//     },
//     error: function(data) {
//       $('#error').prepend(' oh no').append('!');
//     }
//   });
// }