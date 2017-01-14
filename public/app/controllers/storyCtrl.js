angular.module('storyCtrl', ['storyService'])

.controller('StoryController', function(Story){
	var vm = this;
	function getStories() {
		Story.all().success(function(data){
			vm.stories = data;
		});
	}

	getStories();


	vm.create = function() {
		vm.message = '';
		Story.create(vm.storyData).success(function(data){
			vm.storyData = '';
			vm.message = data.message;
			getStories();
		});
	};
	return vm;
});