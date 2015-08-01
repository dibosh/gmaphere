// Source code inspired from
// http://stackoverflow.com/questions/5205672/modify-url-before-loading-page-in-firefox/
var {Cc, Ci} = require("chrome");

function parsePosition(url) {
  var regex = /-?\d+\.\d+/g;
  return url.match(regex).map(function (v) {
    return parseFloat(v);
  });
}

var httpRequestObserver =
{
  observe: function (subject, topic, data) {
    if (topic == "http-on-modify-request") {

      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      var url = httpChannel.URI.spec;
      if (url.indexOf("www.here.com/directions/") > -1) {
        var position = parsePosition(url);
        var googleMapURL = 'http://maps.google.com/maps?q=loc:'+position[0]+','+position[1]+'&z=17';
        var newuri = Cc["@mozilla.org/network/standard-url;1"]
          .createInstance(Ci.nsIStandardURL);
        newuri.init(Ci.nsIStandardURL.URLTYPE_STANDARD, 80, googleMapURL, 'utf-8', null);
        newuri = newuri.QueryInterface(Ci.nsIURI);
        httpChannel.redirectTo(newuri);
      }
    }
  },

  get observerService() {
    return Cc["@mozilla.org/observer-service;1"]
      .getService(Ci.nsIObserverService);
  },

  register: function () {
    this.observerService.addObserver(this, "http-on-modify-request", false);
  },

  unregister: function () {
    this.observerService.removeObserver(this, "http-on-modify-request");
  }
};

httpRequestObserver.register();