var mp4Controllers = angular.module('mp4Controllers', []);

//mp4Controllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
//  $scope.data = "";
//   $scope.displayText = ""
//
//  $scope.setData = function(){
//    CommonData.setData($scope.data);
//    $scope.displayText = "Data set"
//
//  };
//
//}]);
//
//mp4Controllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
//  $scope.data = "";
//
//  $scope.getData = function(){
//    $scope.data = CommonData.getData();
//
//  };
//
//}]);
//
//
//mp4Controllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {
//
//  Llamas.get().success(function(data){
//    $scope.llamas = data;
//  });
//
//
//}]);

//Format date helper function
getDate = function(date) {
	var d = new Date(date);
	var ret = d.toDateString();
	return "Deadline:  " + ret;
};

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
	$scope.url = $window.sessionStorage.baseurl;
	$scope.showText = false;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
	  $scope.showText = true;
  };
}]);

mp4Controllers.controller('UsersController', ['$scope', 'Users', function($scope, Users) {
	//Get
	Users.get({'name': 1, 'email': 1, '_id': 1}).success(function(data) {
		$scope.users = data.data;
	});

	//Delete
	$scope.delete = function(user) {
		Users.delete(user._id, user.name).then(function() {
			$scope.users.splice($scope.users.indexOf(user), 1);
		});
	}
}]);


mp4Controllers.controller('AddUserController', ['$scope', 'Users', function($scope, Users) {
	$scope.user = {};
	$scope.fail = false;
	$scope.success = false;
	$scope.submit = function() {
		Users.post($scope.user)
			.success(function() {
				$scope.success = true;
			})
			.error(function(error) {
				$scope.fail = true;
				$scope.error = error.message;
			});
	}
}]);

mp4Controllers.controller('UserProfileController', ['$scope', '$routeParams','Users', 'Tasks', 'Task', function($scope, $routeParams, Users, Tasks, Task) {

	$scope.showCompleted = false;
	$scope.pendingTasks = [];
	$scope.completedTasks = [];
	Users.getUser($routeParams.id).success(function(data) {
		$scope.user = data.data;
		Tasks.getTasks($scope.user.pendingTasks).success(function(data) {
			$scope.pendingTasks = data.data;
		});
	});

	$scope.completeTask = function(task) {
		task.completed = true;
		Task.put(task);

		$scope.pendingTasks.splice($scope.pendingTasks.indexOf(task), 1);
		$scope.completedTasks.push(task);
	};

	$scope.showCompletedTasks = function() {
		$scope.showCompleted = true;
		Tasks.getCompleted($scope.user.name).success(function(data) {
			$scope.completedTasks = data.data;
		});
	};

	$scope.formatDate = function(date) {
		return getDate(date);
	};

}]);

mp4Controllers.controller('TasksController', ['$scope', 'Tasks', 'Task', function($scope, Tasks, Task) {
	$scope.order = false;
	$scope.filter= 'pending';
	$scope.page = 0;
	$scope.orderType='dateCreated';

	$scope.updateTask = function() {
		$scope.page = 0;
		Tasks.get($scope.orderType, $scope.order, $scope.page, $scope.filter).success(function(data) {
			$scope.tasks = data.data;
		});
		Tasks.getCount($scope.filter).success(function(data) {
			$scope.pages = Math.ceil(data.data / 10.0);
		});
	};

	$scope.updateTask();

	$scope.changePage = function(newPage) {
		$scope.page = newPage;
		Tasks.get($scope.orderType, $scope.order, $scope.page, $scope.filter).success(function(data) {
			$scope.tasks = data.data;
		});
		Tasks.getCount($scope.filter).success(function(data) {
			$scope.pages = Math.ceil(data.data / 10.0);
		});
	};

	$scope.delete = function(task) {
		Task.delete(task).then(function() {
			Tasks.get($scope.orderType, $scope.order, $scope.page, $scope.filter).success(function(data) {
				$scope.tasks = data.data;
			});
			Tasks.getCount($scope.filter).success(function(data) {
				$scope.pages = Math.ceil(data.data / 10.0);
			});
		});
	};

	$scope.formatDate = function(date) {
		return getDate(date);
	};

}]);

mp4Controllers.controller('TaskController', ['$scope', '$routeParams', 'Task', function($scope, $routeParams, Task) {
	Task.getTask($routeParams.id).success(function(data) {
		$scope.task = data.data;
	});

	$scope.formatDate = function(date) {
		return getDate(date);
	};
}]);

mp4Controllers.controller('AddTaskController', ['$scope', 'Users', 'Task', function($scope, Users, Task) {
	$scope.task = {};
	$scope.success = false;
	$scope.fail = false;
	Users.get({'_id': 1, 'name': 1}).success(function(data) {
		$scope.users = data.data;
		$scope.users.unshift({'_id': '', 'name': 'unassigned'});
		$scope.selectedUser = $scope.users[0];
	});
	$scope.submit = function() {
		$scope.task.assignedUserName = $scope.selectedUser.name;
		$scope.task.assignedUser = $scope.selectedUser._id;
		Task.post($scope.task)
			.then(function() {
				$scope.success = true;
				$scope.task = {};
				$scope.selectedUser = $scope.users[0];
			})
			.catch(function(error) {
				$scope.fail = true;
				$scope.error = error.message;
			});
	};
}]);

mp4Controllers.controller('EditTaskController', ['$scope', '$routeParams', 'Users', 'Task', function($scope, $routeParams, Users, Task) {
	$scope.success = false;
	$scope.fail = false;

	Task.getTask($routeParams.id).success(function(data) {
		$scope.task = data.data;

		Users.get({'_id': 1, 'name': 1}).success(function(data) {
			$scope.users = data.data;
			$scope.users.unshift({'_id': '', 'name': 'unassigned'});

			$scope.selectedUser = $scope.users.filter(function(user) {
				return user.name == $scope.task.assignedUserName;
			})[0];
		});
	});
	$scope.submit = function() {
		$scope.task.assignedUserName = $scope.selectedUser.name;
		$scope.task.assignedUser = $scope.selectedUser._id;
		Task.put($scope.task)
			.then(function() {
				$scope.success = true;
			})
			.catch(function(error) {
				$scope.fail = true;
				$scope.error = error.message;
			});
	};
}]);