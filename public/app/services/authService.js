angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken){
	var authFacotry = {};

	authFacotry.login = function(username, password) {
		return $http.post('/api/login', {
			username: username,
			password: password
		}).then(function(res){
			AuthToken.setToken(res.data.token);
			return res.data;
		});
	};

	authFacotry.logout = function() {
		AuthToken.setToken();
	};

	authFacotry.isLoggedIn = function() {
		if (AuthToken.getToken()) {
			return true;
		} else {
			return false;
		}
	};

	authFacotry.getUser = function() {
		if (AuthToken.getToken()) {
			return $http.get('/api/me').then(function(data) {
				return data;
			});
		}
	};

	return authFacotry;
})


.factory('AuthToken', function($window){
	var authTokenFacotry = {};

	authTokenFacotry.getToken = function() {
		return $window.localStorage.getItem('token');
	};
	authTokenFacotry.setToken = function(token) {
		if (token) {
			$window.localStorage.setItem('token', token);
		} else {
			$window.localStorage.removeItem('token')
		}
	};

	return authTokenFacotry;
})

.factory('AuthInterceptor', function($q, $location, AuthToken){
	var interceptorFacotry = {};

	interceptorFacotry.request = function(config) {
		var token = AuthToken.getToken();

		if (token) {
			config.headers['x-access-token'] = token;
		}
		return config;
	};

	interceptorFacotry.responseError = function(response) {
		if (response.status == 403) {
			$location.path('/login');
		}

		return $q.reject(response);
	}

	return interceptorFacotry;
})