var app = angular.module('myApp', [	'appRoutes', 'mainCtrl', 'authService',
									'userService', 'userCtrl', 'storyService',
									'storyCtrl', 'jobCtrl', 'jobService',  ]);
app.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
})