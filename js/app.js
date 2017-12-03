/*global angular */
(function() {
'use strict';

Config.$inject = ['$routeProvider'];

function Config($routeProvider) {
	var routeConfig = {
		controller: 'TodoController as vm',
		templateUrl: 'todoView.html',
		resolve: {
			store: function (todoStorage) {
				// Get the correct module (API or localStorage).
				return todoStorage.then(function (module) {
					module.get(); // Fetch the todo records in the background.
					return module;
				});
			}
		}
	};

	$routeProvider
		.when('/', routeConfig)
		.otherwise({
			redirectTo: '/'
		});
}

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
	.config(Config);
})();