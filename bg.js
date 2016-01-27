var token = "";
var errorCb = function(request, errStr, exception, ajaxObj) {
	if(request.status == 409 && (token = request.getResponseHeader('X-Transmission-Session-Id'))) {
		$.ajax(ajaxObj);
	}
};
var addTorrent = function(info, tab) {
	var url = info.linkUrl;
	var m = null;
	if (m = url.match(/^.*?(http.+?\.torrent).*$/)) {
		url = m[1];
	}
	if (url.match(/^[0-9a-f]{40}$/i)) {
		url = 'magnet:?xt=urn:btih:' + url;
	}
	$.ajax({
		url: "http://htpc.local:9091/transmission/rpc",
		contentType: "json",
		dataType: "json",
		type: "POST",
		//data: '{"method": "torrent-add", "arguments": {"paused": false, "filename": "' + url + '"}}',
		data: JSON.stringify({
			method: "torrent-add",
			arguments: {
				paused: false,
				filename: url
			}
		}),
		beforeSend: function (XHR) { XHR.setRequestHeader("X-Transmission-Session-Id", token)},
		error: function (request, errStr, exception) {
			errorCb(request, errStr, exception, this);
		},
		success: function (response) {
			if (!response) {
				alert("Cannot finish request");
				return;
			}
			if (response.result != "success") {
				alert(response.result);
			}
		}
	});
};
chrome.contextMenus.create({
	title: "Pobierz przez torrent",
	contexts: ["link"],
	onclick: addTorrent
});