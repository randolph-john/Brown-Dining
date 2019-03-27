(function() {
	var app = angular.module('supreme', []);
	
	app.controller('mainController', function() {
		
	});

	app.controller('inputController', function($scope) {
		this.terms = false;
		this.content = {exists: false, sizes: {}};
		console.log(Object.keys(this.content.sizes).length);
		this.test = "HELLO";
		this.getSizes = function() {
			return this.sizes;
		};
		this.itemExists = function(cat, key, col, content) {
			$.ajax({
	          url: "http://fall16.lakeside-cs.org/SupremeBot/search.php",
	          type: "POST",
	          data: {
	              category: cat,
	              keyword: key,
	              color: col
	          },
	          success: function(response){
	              //alertify.alert(response);
	              console.log(Boolean(response.trim()));
	              if(response.trim()) {
	              	  var json = JSON.parse(response);
		              if(json.url !== "http:\/\/www.supremenewyork.com") {
		              	console.log(json);
		              	$scope.$apply(function() {
		              		content.sizes = Object.keys(json.itemDetails);
		              		content.exists = true;
		              	});
		              	console.log(content.sizes);
		              	if (content.sizes.length === 0)
		              	{
		              		alertify.alert("Item sold out.");
		              		return;
		              	}
		                alertify.alert("Item found!");
		              }
		              else {
		              	window.alert("Item not found.");
		              	$scope.$apply(function() {
		              		content.exists = false;
		              	});
		              }
	              }
	              else {
	              	window.alert("Item not found.");
	              	$scope.$apply(function() {
	              		content.exists = false;
	              	});
		            alertify.alert("Item not found.");
		          }
	          },
	          error: function(response){
	            alertify.alert("Error: item not found in shop, or has sold out.");
	          }
	     });
		};
	});
})();