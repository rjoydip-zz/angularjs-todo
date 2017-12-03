/*global angular */
(function() {
'use strict';

/**
 * Focus Directive
 */
FocusDirective.$inject = ['$timeout'];

function FocusDirective($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.todoFocus, function (newVal) {
			if (newVal) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
}

/**
 * Directive that places focus on the element it is applied to when the
 * expression it binds to evaluates to true
 */
angular.module('todomvc')
	.directive('todoFocus', FocusDirective);
})();