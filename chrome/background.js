function parsePosition (url) {
  var regex = /-?\d+\.\d+/g;
  return url.match(regex).map(function(v) {
    return parseFloat(v);
  });
}

function interceptRequest(request)
{
  if(request && request.url)
  {
    if(request.type == "main_frame") // 'Here' url is being loaded in the main window
    {
      // Parses the lat and long value from url
      var position = parsePosition(request.url);
      var googleMapURL = 'http://maps.google.com/maps?q=loc:'+position[0]+','+position[1]+'&z=17';
      return {redirectUrl: googleMapURL};
    }
  }
}

// The url interception happens here
chrome.webRequest.onHeadersReceived.addListener(interceptRequest, {urls: ["*://www.here.com/directions/drive/*"]},
  ["blocking"]);