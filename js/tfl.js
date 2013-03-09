/*global define*/

define(function( require ) {
  'use strict';

  var Backbone = require( 'backbone' ),
      ClockView = require( 'clock' );

  var Tfl;

  Tfl = Backbone.View.extend({
    initialize: function() {
      var graph,
        width,
        height;

      width = $(window).width();
      height = $(window).height();

      graph = new ClockView({
        width: width,
        height: height,
        padding: 50
      });

      this.$el.append( graph.el );
    }
  });

  return Tfl;

});