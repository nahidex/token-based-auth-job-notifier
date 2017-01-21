angular.module('jobDirective', ['jobService'])

.directive('jobDetail', function(Job) {
    return {
        restrict: 'E',
        scope: {
      	    jobId: '@jobId'
        },
        replace: 'true',
        templateUrl: '/app/views/template/jobDetailDirective.html',
        controller: function($scope) {
            $scope.data = null;
            Job.getJob($scope.jobId).success(function(data){
                if (data) {
                    $scope.data = data;
                }
            });
        }
    };
})
.directive('loader', function() {
    return {
       restrict: 'E',
       templateUrl: '/app/views/template/loader.html'
    }
});

