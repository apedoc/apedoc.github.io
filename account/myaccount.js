var loginCallback;
var logoutCallback;
var accountURL = "http://account.apedoc.com";
var onLoginSuccess = (function(){
	return function (response) {
		localStorage.setItem ("TOKEN",  decodeURIComponent(response.token));
		localStorage.setItem ("USERNAME",  decodeURIComponent(response.userName));
		if (loginCallback)
			loginCallback ();
	}
})();

var onLogoutSuccess = (function(){
	return function (response) {
		localStorage.removeItem ("TOKEN");
		localStorage.removeItem ("USERNAME");
		if (logoutCallback)
			logoutCallback ();
	}
})();

(function(){
	angular.module ("apedoc-ac", [])
	.run (function($location){
		var params = $location.search ();
		if (params.hasOwnProperty("token") && params.hasOwnProperty("userName"))
			onLoginSuccess (params);
		else if (params.hasOwnProperty("logout"))
			onLogoutSuccess (params);
	})
	.service ("myAccount", function ($q, $location) {
		this.getToken = function () {
			return localStorage.getItem ("TOKEN");
		};
		
		this.getUserName = function () {
			return localStorage.getItem ("USERNAME");
		};
		
		this.signIn = function (returnUrl) {
			var deferred = $q.defer();
			if(returnUrl) {
				location.href = accountURL + "?returnUrl=" + returnUrl;
			} else {
				loginCallback = function () {
					deferred.resolve();
				};
				window.open (accountURL,"","menubar=no,toolbar=no");
			}
			return deferred.promise;
		};
		this.signout = function (returnUrl, token) {
			var deferred = $q.defer();
			if(returnUrl) {
				location.href = accountURL + "?action=logout&token="+token+"&returnUrl=" + returnUrl;
			} else {
				logoutCallback = function () {
					deferred.resolve();
				};
				window.open (accountURL + "?action=logout&token=" + token,"","menubar=no,toolbar=no");
			}
			return deferred.promise;
		};
	});
})();