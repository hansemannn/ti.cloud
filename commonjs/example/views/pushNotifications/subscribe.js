var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Subscribe'] = function(evt) {
	var win = WindowManager.createWindow({
		backgroundColor: 'white'
	});
	var content = Ti.UI.createScrollView({
		top: 0,
		contentHeight: 'auto',
		layout: 'vertical'
	});
	win.add(content);

	if (!Utils.pushDeviceToken) {
		content.add(Ti.UI.createLabel({
			text: 'Please visit Push Notifications > Settings to enable push!',
			textAlign: 'center',
			color: '#000',
			height: 'auto',
			color: 'black'
		}));
		return win;
		return;
	}

	var channel = Ti.UI.createTextField({
		hintText: 'Channel',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		color: "black",
		hintTextColor: "gray"
	});
	content.add(channel);

	if (Ti.Platform.name === 'android') {
		var android_type = Ti.UI.createTextField({
			hintText: 'android type',
			top: 10 + Utils.u,
			left: 10 + Utils.u,
			right: 10 + Utils.u,
			height: 40 + Utils.u,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
			autocorrect: false,
			color: "black",
			hintTextColor: "gray"
		});
		content.add(android_type);
	}

	var button = Ti.UI.createButton({
		title: 'Subscribe',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		bottom: 10 + Utils.u,
		height: 40 + Utils.u
	});
	content.add(button);

	var fields = [channel];

	function submitForm() {
		for (var i = 0; i < fields.length; i++) {
			if (!fields[i].value.length) {
				fields[i].focus();
				return;
			}
			fields[i].blur();
		}
		button.hide();

		var type = Ti.Platform.name;
		if (Ti.Platform.name === 'android') {
			type = android_type.value;
		} else if (Ti.Platform.name === 'iPhone OS') {
			type = 'ios';
		}

		Cloud.PushNotifications.subscribe({
			channel: channel.value,
			device_token: Utils.pushDeviceToken,
			type: type
		}, function(e) {
			if (e.success) {
				channel.value = '';
				alert('Subscribed!');
			} else {
				Utils.error(e);
			}
			button.show();
		});
	}

	button.addEventListener('click', submitForm);
	for (var i = 0; i < fields.length; i++) {
		fields[i].addEventListener('return', submitForm);
	}

	win.addEventListener('open', function() {
		channel.focus();
	});
	return win;
};