angular.module('jobService', [])
.factory('Job', function($http) {
	var jobFactory = {};

	jobFactory.create = function(jobData){
		return $http.post('/api/job', jobData);
	}

	jobFactory.all = function(){
		return $http.get('/api/job');
	}

	return jobFactory;
});