angular.module('jobService', [])
.factory('Job', function($http) {
	var jobFactory = {};

	jobFactory.create = function(jobData){
		return $http.post('/api/job', jobData);
	}

	jobFactory.all = function(){
		return $http.get('/api/job');
	}

	jobFactory.getJob = function(jobId) {
		return $http.get('/api/job/' + jobId);
	}

	jobFactory.removeJob = function(jobId) {
		return $http.delete('/api/job/' + jobId);
	}

	return jobFactory;
});