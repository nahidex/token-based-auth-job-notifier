angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/pages/home.html',
		})
		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html',
			controller: 'UserCreateController',
			controllerAs: 'user'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html',
			controller: 'MainController',
			controllerAs: 'login'
		})

	$locationProvider.html5Mode(true);
});