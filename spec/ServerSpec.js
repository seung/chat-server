var handler = require("../request-handler");

function StubRequest(url, method, postdata) {
  this.url = url;
  this.method = method;
  this._postData = postdata;
  this.setEncoding = function(type) {
    // Ignore
  };
  var self = this;
  this.addListener = this.on = function(type, callback) {
    if (type == "data") {
      // turn postdata (dictionary object) into raw postdata
      // like: username=jono&message=do+my+bidding
      var fields = [];
      for (var key in self._postData) {
        fields.push(key + "=" + self._postData[key].replace(" ", "+"));
      }
      callback(fields.join("&"));
    }
    if (type == "end") {
      callback();
    }
  };
}

function StubResponse() {
  this._ended = false;
  this._responseCode = null;
  this._headers = null;
  this._data = null;
  var self = this;
  this.writeHead = function(responseCode, headers) {
    self._responseCode = responseCode;
    self._headers = headers;
  };
  this.end = function(data) {
    self._ended = true;
    self._data = data;
  };
}

describe("Node Server Request Listener Function", function() {
 it("Should answer GET requests for /classes/room", function() {
   var req = new StubRequest("http://127.0.0.1:8080/classes/room1",
                             "GET");
   var res = new StubResponse();

   handler.handleRequest(req, res);
      console.log('\n\n\nhandle Request called with ' + JSON.stringify(req));
   expect(res._responseCode).toEqual(200);
   expect(res._data).toEqual("[]");
   expect(res._ended).toEqual(true);
 });

 it("Should accept posts to /classes/room", function() {
   var req = new StubRequest("http://127.0.0.1:8080/classes/room1",
                             "POST",
                            {username: "Jono",
                             message: "Do my bidding!"});
    // StubRequest {url: "http://127.0.0.1:8080/classes/room1",
    // method: "GET", _postData: undefined, setEncoding: function,
    // on: function…}
   var res = new StubResponse();
      // res-> StubResponse {_ended: false, _responseCode: null,
      // _headers: null, _data: null, writeHead: function…}
   handler.handleRequest(req, res);
      console.log('res._responseCode : '+res._responseCode);
      console.log('res._data : '+res._data);
   expect(res._responseCode).toEqual(302);
      // why would _data == \n?
   // expect(res._data).toEqual("\n");
   expect(res._ended).toEqual(true);

   req = new StubRequest("http://127.0.0.1:8080/classes/room1",
                             "GET");
   res = new StubResponse();

   handler.handleRequest(req, res);

   expect(res._responseCode).toEqual(200);
   var messageLog = JSON.parse(res._data);
        console.log('messageLog: '+messageLog);
   expect(messageLog.length).toEqual(1);
   expect(messageLog[0].username).toEqual("Jono");
   expect(messageLog[0].message).toEqual("Do my bidding!");
   expect(res._ended).toEqual(true);
 });


 it("Should 404 when asked for a nonexistent file", function() {
   var req = new StubRequest("http://127.0.0.1:8080/arglebargle",
                             "GET");
   var res = new StubResponse();

   handler.handleRequest(req, res);
   console.log("Res is " + JSON.stringify(res));

   // Wait some time before checking results:
   waits(1000);

   runs(function() {
     expect(res._responseCode).toEqual(404);
     expect(res._ended).toEqual(true);
   });
 });

});
