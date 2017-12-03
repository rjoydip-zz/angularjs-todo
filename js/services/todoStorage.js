/*global angular */
(function () {
	'use strict';

	/**
	 * Storage factory
	 */
	StorageFactory.$inject = ['$http', '$injector'];

	function StorageFactory($http, $injector) {
		// Detect if an API backend is present. If so, return the API module, else
		// hand off the localStorage adapter
		return $http.get('/api')
			.then(function () {
				return $injector.get('api');
			}, function () {
				return $injector.get('localStorage');
			});
	}

	/**
	 * Api factory
	 */
	ApiFactory.$inject = ['$resource'];

	function ApiFactory($resource) {
		let store = {
			todos: [],
			api: api,
			get: get,
			put: put,
			insert: tinsert,
			delete: deleteF,
			clearCompleted: clearCompleted
		};

		return store;

		function api() {
			return $resource('/api/todos/:id', null, {
				update: {
					method: 'PUT'
				}
			});
		}

		function clearCompleted() {
			var originalTodos = this.todos.slice(0);

			var incompleteTodos = this.todos.filter(function (todo) {
				return !todo.completed;
			});

			angular.copy(incompleteTodos, this.todos);

			return this.api.delete(function () {}, function error() {
				angular.copy(originalTodos, this.todos);
			});
		}

		function deleteF(todo) {
			this.todos.splice(this.todos.indexOf(todo), 1);
			return this.api.delete({
				id: todo.id
			}, function () {}, function error() {
				angular.copy(this.todos.slice(0), this.todos);
			});
		}

		function get() {
			return this.api.query(function (resp) {
				angular.copy(resp, this.todos);
			});
		};

		function insert(todo) {
			var originalTodos = this.todos.slice(0);

			return this.api.save(todo,
				function success(resp) {
					todo.id = resp.id;
					this.todos.push(todo);
				},
				function error() {
					angular.copy(originalTodos, this.todos);
				}).$promise;
		};

		function put(todo) {
			return this.api.update({
				id: todo.id
			}, todo).$promise;
		};
	}

	/**
	 * Local Storage factory
	 */
	LocalStorageFactory.$inject = ['$q'];

	function LocalStorageFactory($q) {

		var STORAGE_ID = 'todos-angularjs';

		var store = function () {
			return {
				todos: [],
				_getFromLocalStorage: _getFromLocalStorage,
				_saveToLocalStorage: _saveToLocalStorage,
				clearCompleted: clearCompleted,
				delete: deleteF,
				get: get,
				insert: insert,
				put: put
			}
		};

		return store();

		function _getFromLocalStorage() {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		}

		function _saveToLocalStorage(todos) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
		}

		function clearCompleted() {
			var deferred = $q.defer();

			var incompleteTodos = this.todos.filter(function (todo) {
				return !todo.completed;
			});

			angular.copy(incompleteTodos, this.todos);

			this._saveToLocalStorage(this.todos);
			deferred.resolve(this.todos);

			return deferred.promise;
		}

		function deleteF(todo) {
			var deferred = $q.defer();

			this.todos.splice(this.todos.indexOf(todo), 1);

			this._saveToLocalStorage(this.todos);
			deferred.resolve(this.todos);

			return deferred.promise;
		}

		function get() {
			var deferred = $q.defer();

			angular.copy(this._getFromLocalStorage, this.todos);
			deferred.resolve(this.todos);

			return deferred.promise;
		}

		function insert(todo) {
			var deferred = $q.defer();

			this.todos.push(todo);

			this._saveToLocalStorage(this.todos);
			deferred.resolve(this.todos);

			return deferred.promise;
		}

		function put(todo, index) {
			var deferred = $q.defer();

			this.todos[index] = todo;

			this._saveToLocalStorage(this.todos);
			deferred.resolve(this.todos);

			return deferred.promise;
		}
	};

	/**
	 * Services that persists and retrieves todos from localStorage or a backend API
	 * if available.
	 *
	 * They both follow the same API, returning promises for all changes to the
	 * model.
	 */
	angular.module('todomvc')
		.factory('api', ApiFactory)
		.factory('todoStorage', StorageFactory)
		.factory('localStorage', LocalStorageFactory);
})();