/*global define*/

define(function( require ) {
  'use strict';

  var Backbone = require( 'backbone' ),
      _ = require( 'underscore' ),
      d3 = require( 'd3' ),
      moment = require( 'moment' ),
      commute = require( 'commute' );

  var ClockView;

  ClockView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(
        this,
        'handleData',
        'filter',
        'render'
      );

      this.svg = d3.select( this.el )
        .append( 'svg' )
        .attr( 'class', 'clock canvas' )
        .attr( 'width', this.options.width )
        .attr( 'height', this.options.height );

      // Loading data
      d3.csv( 'data/all.csv', this.handleData );
    },

    handleData: function( data ) {
      this.data = commute( data );
      this.render();
    },

    handleUpdateFilters: function() {
      this.render();
    },

    filter: function() {
    },

    render: function() {
      var data,
        width,
        height,
        padding,
        helpers,
        center,
        maxD,
        minR,
        maxR;

      data = this.data;
      helpers = this.helpers;
      width = this.options.width;
      height = this.options.height;
      padding = this.options.padding;
      center = [
        width * 0.5,
        height * 0.5
      ];
      minR = 20;
      maxR = ( width > height )
        ? height
        : width;
      maxR = maxR * 0.5 - padding;

      maxD = d3.max( data, function( d ) { return d.duration; });

      this.svg.append('circle')
        .attr('r', maxR)
        .attr('cx', center[0])
        .attr('cy', center[1])
        .attr('class', 'clock face');

      for(var i = 0; i < 24; i++ ) {
        var a,
          x,
          y;

        a = ((i-6)*Math.PI)/12;
        x = Math.cos( a ) * maxR;
        y = Math.sin( a ) * maxR;

        this.svg.append('line')
          .attr('x1', center[0])
          .attr('y1', center[1])
          .attr('x2', center[0] + x)
          .attr('y2', center[1] + y)
          .attr('class', 'clock spoke');
      }

      var rings = Math.floor( maxD / 5 );

      for(var i = 0; i < rings; i++ ) {
        var r;

        r = maxR * ( i / rings );

        this.svg.append('circle')
          .attr('r', r)
          .attr('cx', center[0])
          .attr('cy', center[1])
          .attr('class', 'clock ring');
      }

      this.journeys = this.svg.selectAll('.journey');

      this.journeys.data( data )
        .enter().append('circle')
        .attr('class','journey')
        .attr('r', 5)
        .attr('cx', function( d ) {
          return center[0] + helpers.getClockCoords(
            d.start, d.duration, maxD, maxR
          )[0];
        })
        .attr('cy', function( d ) {
          return center[1] + helpers.getClockCoords(
            d.start, d.duration, maxD, maxR
          )[1];
        });
    },
    helpers: {
      getHoursFromMoment: function( m ) {
        var hours;

        hours = m.hours() + m.minutes()/60;

        return hours;
      },
      getClockAngle: function( m ) {
        var hand;

        hand = ( this.getHoursFromMoment( m ) / 24 ) * 2 * Math.PI - (Math.PI / 2);

        return hand;
      },
      getClockCoords: function( start, duration, maxD, maxR ) {
        var a,
          x,
          y;

        a = this.getClockAngle( start );

        x = Math.cos( a ) * (duration / maxD) * maxR ;

        y = Math.sin( a ) * (duration / maxD) * maxR ;

        return [ x, y ];
      }
    }
  });

  return ClockView;
});