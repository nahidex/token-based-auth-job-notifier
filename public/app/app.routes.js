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
		.when('/job', {
			templateUrl: 'app/views/pages/job.html',
			controller: 'JobController',
			controllerAs: 'allJobs'
		})
		.when('/job/create', {
			templateUrl: 'app/views/pages/jobCreate.html',
			controller: 'JobController',
			controllerAs: 'job'
		})


	$locationProvider.html5Mode(true);
});