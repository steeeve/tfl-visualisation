/*global requirejs,define*/

requirejs.config({
    paths: {
        'jquery': '../vendor/jquery/jquery',
        'underscore': '../vendor/underscore/underscore',
        'backbone': '../vendor/backbone/backbone',
        'moment': '../vendor/moment/moment',
        'd3': '../vendor/d3/d3'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'moment': {
            exports: 'moment'
        },
        'd3': {
            exports: 'd3'
        }
    }
});

define(function( require ) {
  'use strict';

  var Tfl = require( 'tfl' );

  var tfl = new Tfl({
    el: '#tfl'
  });

});