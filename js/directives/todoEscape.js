/*global angular */
(function() {
'use strict';

/**
 * Escape Directive
 */
EscapeDirective.$inject = [];

function EscapeDirective() {
	return function (scope, elem, attrs) {
		elem.bind('keydown', function (event) {
			if (event.keyCode === 27) {
				scope.$apply(attrs.todoEscape);
			}
		});

		scope.$on('$destroy', function () {
			elem.unbind('keydown');
		});
	};
}


/**
 * Directive that executes an expression when the element it is applied to gets
 * an `escape` keydown event.
 */
angular.module('todomvc')
	.directive('todoEscape', EscapeDirective);
})();