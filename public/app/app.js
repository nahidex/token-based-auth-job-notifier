var app = angular.module('myApp', ['appRoutes', 'mainCtrl', 'authService', 'userService', 'userCtrl', 'storyService', 'storyCtrl']);
app.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
})