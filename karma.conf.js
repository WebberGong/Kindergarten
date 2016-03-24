module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/js/**/*',
      'app/test/**/*'
    ],

    reporters: ['junit', 'coverage', 'progress'],

    autoWatch : true,

    colors: true,

    logLevel: config.LOG_INFO,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-coverage'
    ],

    junitReporter : {
      outputDir: 'reports/junit',
      outputFile: 'junit.xml',
      suite: 'unit'
    },

    coverageReporter: {
      dir: 'reports/coverage',
      type : 'html'
    },

    preprocessors: {
      'app/js/**/*': ['coverage'],
      'app/test/**/*': ['coverage']
    }

  });
};
