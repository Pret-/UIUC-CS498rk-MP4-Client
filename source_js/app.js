var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/settings', {
	    templateUrl: 'partials/settings.html',
        controller: 'SettingsController'
    }).
    when('/users', {
        templateUrl: 'partials/users.html',
        controller: 'UsersController'
    }).
    when('/tasks', {
        templateUrl: 'partials/tasks.html',
        controller: 'TasksController'
    }).
    when('/addUser', {
	    templateUrl: 'partials/addUser.html',
	    controller: 'AddUserController'
    }).
    when('/users/:id', {
	    templateUrl: 'partials/userProfile.html',
	    controller: 'UserProfileController'
    }).
    when('/tasks/:id', {
	    templateUrl: 'partials/task.html',
	    controller: 'TaskController'
    }).
    when('/editTask/:id', {
	    templateUrl: 'partials/editTask.html',
	    controller: 'EditTaskController'
    }).
    when('/addTask', {
	    templateUrl: 'partials/addTask.html',
	    controller: 'AddTaskController'
    }).
    otherwise({
        redirectTo: '/settings'
    });
}]);
