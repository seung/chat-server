var url = require('url'),
   http = require('http');
   data = [], 
   rooms = [],
   keepMessageCount = 20;

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var addRoom = function(name, message) {
  rooms.push(name);
  var groupTalk = {};
  groupTalk[name] = [message]
  data.push(groupTalk);
}

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  console.log('request.method: ' + request.method);

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  var statusCode = 200;
  var path = url.parse(request.url).pathname.split('/');

  if(request.method === 'POST') {
    var postData = '';
    request.on('data', function(chunk) {
      postData += chunk;
    });

    request.on('end', function() {
      var roomID;
      postData = JSON.parse(postData);
      addMessage('latest', postData);

      if (postData['roomname'] !== "") {
        roomID = postData['roomname']; 
      } else {
        roomID = 'default';
        postData['roomname']=roomID;
      };
      addMessage(roomID, postData);
      console.log('45 data : '+JSON.stringify(data))
    });

  } else {
    request.on('end', function() {
      (path[1] !=='classes') ? statusCode = 404 
                             : (request.method==='POST' ? statusCode = 200 : statuscode = 200)
    });
  }

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data) || []);
};

var addMessage = function(roomID, postData) {
  (rooms.indexOf(roomID) === -1) ? addRoom(roomID, postData)
                                 : data[rooms.indexOf(roomID)][roomID].unshift(postData)

  if (data[rooms.indexOf(roomID)][roomID].length > keepMessageCount) {
    data[rooms.indexOf(roomID)][roomID].pop();
  } 
};

exports.handleRequest = handleRequest;
