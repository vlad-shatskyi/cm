'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('contactManager.services', []).
	constant('APIServer', 'http://ec2-54-226-4-45.compute-1.amazonaws.com').
	factory('Utility', function () {
		return {

			allEmails: function (scope) {
				// Either comma or space separated
				var emailsArray = scope.emails.model.split(/(,\s*|,?\s+)/);
				// Remove empty elements
				emailsArray = emailsArray.filter(function(n){return n.match(/\w+/);});

				return emailsArray;
			},

			selectedEmails: function (scope) {
				var emails = [];
				angular.forEach(scope.selectedContacts, function (data, index) {
					emails.push(data.email);
				});
				return emails;
			},

			manuallyEnteredEmails: function (scope) {
				var allEmails = this.allEmails(scope);
				var selectedEmails = this.selectedEmails(scope);

				return this.arrayDifference(selectedEmails, allEmails);
			},

			notSavedEmails: function(scope) {
				var notSaved = this.manuallyEnteredEmails(scope);
				return this.inFirstButNotInSecond(notSaved, this.emailsFromDB(scope));
			},

			emailsFromDB: function (scope) {
				var emails = [];
				for (var i = 0; i != scope.contacts.length; i++) {
					emails.push(scope.contacts[i].email);
				}
				return emails;
			},

			// XOR
			arrayDifference: function (a1, a2) {
				var a = [], diff = [];
				for (var i = 0; i < a1.length; i++)
					a[a1[i]] = true;
				for (i = 0; i < a2.length; i++)
					if (a[a2[i]]) delete a[a2[i]];
					else a[a2[i]] = true;
				for (var k in a)
					diff.push(k);
				return diff;
			},

			inFirstButNotInSecond: function(firstArray, secondArray) {
				var result = [];
				console.log(firstArray);
				console.log(secondArray);
				for (var i = 0; i != firstArray.length; i++) {
					if (secondArray.indexOf(firstArray[i]) == -1) {
						result.push(firstArray[i]);
					}
				}
				return result;
			},

			formatDate: function(date){
				if(date instanceof Date) {
					var curr_date = date.getDate();
					var curr_month = date.getMonth() + 1; //Months are zero based
					var curr_year = date.getFullYear();
					return curr_year + "-" + curr_month + "-" + curr_date;
				} else {
					return date;
				}
			}
		}
	})
	.factory("flash", function($rootScope) {
		var queue = [], currentMessage = {};

		$rootScope.$on('$routeChangeSuccess', function () {
			if (queue.length > 0)
				currentMessage = queue.shift();
			else
				currentMessage = {};
		});

		return {
			set: function (message) {
				var msg = message;
				queue.push(msg);

			},
			get: function (message) {
				return currentMessage;
			},
			pop: function (message) {
				switch (message.type) {
					case 'success':
						toastr.success(message.body, message.title);
						break;
					case 'info':
						toastr.info(message.body, message.title);
						break;
					case 'warning':
						toastr.warning(message.body, message.title);
						break;
					case 'error':
						toastr.error(message.body, message.title);
						break;
				}
			}
		};
	});