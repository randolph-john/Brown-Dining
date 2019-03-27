//when we are in /checkout

//window.alert("test");
//function autofill() {

chrome.extension.sendMessage({action: "getDisabled"}, function(response) {
	console.log(response);
	if(response.disable == false) {
		var fields = ['name', 'email', 'phone', 'address', 'zip', 'city', 'state', 'country', 'category', 'size', 'keyword', 'color', 'provider', 'cardNumber', 'expirationMonth', 'expirationYear','cvv'];
		//window.alert("trying to get data from server");
		chrome.storage.local.get(fields, function(res) {
			//window.alert(res);
			document.getElementById('order_billing_name').value = res.name;
			document.getElementById('order_email').value = res.email;
			document.getElementById('order_tel').value = res.phone;
			document.getElementById('bo').value = res.address;
			document.getElementById('order_billing_zip').value = res.zip;
			document.getElementById('order_billing_city').value = res.city;
			document.getElementById('order_billing_state').value = res.state;
			document.getElementById('order_billing_country').value = res.country;
			document.getElementById('credit_card_type').value = res.provider;
			document.getElementById('cnb').value = res.cardNumber;
			document.getElementById('credit_card_month').value = res.expirationMonth;
			document.getElementById('credit_card_year').value = res.expirationYear;
			document.getElementById('vval').value = res.cvv;
			$('.iCheck-helper')[1].click();
			$('.iCheck-helper')[0].click();
		});

		setTimeout(function() {
			$("[name=commit]").click();
		}, 1000);
	}
});
	


