/**
 * Created by wgong on 2016/3/16.
 */
angular.module('kindergartenApp', ['ui.router'])
  .config(['$stateProvider', function($stateProvider) {
    'use strict';

    $stateProvider
      .state('index', {
        url: '/index',
        templateUrl: '/index.html',
        resolve: {
        }
      })
  }]);
