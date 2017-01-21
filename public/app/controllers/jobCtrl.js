angular.module('jobCtrl', ['jobService'])

.controller('JobController', function(Job, $location) {
	var vm = this;
	Job.all().success(function(data){
		vm.jobs = data;
	});

	vm.create = function() {
		Job.create(vm.jobData).success(function(data){
			vm.jobData = '';
			vm.message = data.message;
			$location.path('/');
		});
	}
	vm.removeJob = function(id) {

		Job.removeJob(id).success(function(data){
			console.log(data);
		});
	}
})