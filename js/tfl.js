/*global define*/

define(function( require ) {
  'use strict';

  var Backbone = require( 'backbone' ),
      ClockView = require( 'clock' );

  var Tfl;

  Tfl = Backbone.View.extend({
    initialize: function() {
      var graph;

      graph = new ClockView({
        width: 800,
        height: 600,
        padding: 25
      });

      this.$el.append( graph.el );
    }
  });

  return Tfl;

});