/*global define*/

define(function( require ) {
    'use strict';

    var Backbone = require( 'backbone' ),
            _ = require( 'underscore' ),
            d3 = require( 'd3' ),
            commute = require( './commute'),
            moment = require( 'moment' );

    var ClockView,
        helpers;

    helpers = {
        getHoursFromMoment: function( m ) {
            var hours;

            hours = m.hours() + m.minutes()/60;

            return hours;
        },
        getClockAngle: function( m ) {
            var hand;

            hand = ( helpers.getHoursFromMoment( m ) / 24 ) * 2 * Math.PI - (Math.PI / 2);

            return hand;
        },
        getClockCoords: function( start, duration, maxD, maxR ) {
            var a,
                x,
                y;

            a = helpers.getClockAngle( start );

            x = Math.cos( a ) * (duration / maxD) * maxR ;

            y = Math.sin( a ) * (duration / maxD) * maxR ;

            return [ x, y ];
        },
        getTranslate: function( d, center, maxD, maxR ) {
            var x,
                y;

            x = center[0] + helpers.getClockCoords(
                d.start, d.duration, maxD, maxR
            )[0];

            y = center[1] + helpers.getClockCoords(
                d.start, d.duration, maxD, maxR
            )[1];

            return "translate("+x+","+y+")";
        }
    };

    ClockView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(
                this,
                'handleData',
                'render'
            );

            this.svg = d3.select( this.el )
                .append( 'svg' )
                .attr( 'class', 'tfl-visualisation clock canvas' )
                .attr( 'width', this.options.width )
                .attr( 'height', this.options.height );

            // Loading data
            d3.csv( 'data/all.csv', this.handleData );
        },

        handleData: function( data ) {
            this.data = commute(data);
            this.render();
        },

        handleUpdateFilters: function() {
            this.render();
        },

        handleRingMouseover: function() {
            var ring = d3.select( this );

            d3.event.stopPropagation();

            ring.transition()
                .duration( 250 )
                .style(
                    'fill',
                    d3.rgb(ring.attr('data-fill')).brighter(0.15)
                );
        },

        handleRingMouseout: function() {
            var ring = d3.select( this );

            d3.select( this ).transition()
                .delay( 125 )
                .duration( 500 )
                .style( 'fill', ring.attr('data-fill') );
        },

        render: function() {
            var data,
                width,
                height,
                padding,
                center,
                maxD,
                minR,
                maxR;

            data = this.data;
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

            var rings = Math.floor( maxD / 5 );
            var ring_color = d3.interpolateRgb(
                'rgb(0,144,231)',
                'rgb(203,230,246)'
            );

            for(var i = 0; i < rings; i++ ) {
                var p,
                    r,
                    circle;

                p = ( i / rings )
                r = maxR * ( 1 - p );

                circle = this.svg.append('circle')
                    .attr('r', r)
                    .attr('cx', center[0])
                    .attr('cy', center[1])
                    .attr('class', 'clock ring')
                    .style('fill', ring_color( p ) )
                    .attr('data-fill', ring_color( p ) )
                    .on('mouseover', this.handleRingMouseover)
                    .on('mouseout', this.handleRingMouseout);
            }

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

            this.journeys = this.svg.selectAll('.journey');

            var journey = this.journeys.data( data )
                .enter()
                .append('g')
                .attr('transform', function( d ) { 
                    return helpers.getTranslate( d, center, maxD, maxR );
                })
                .attr('class','journey');
    
            journey
                .append('circle')
                .attr('r', 7)
                .on( 'mouseover', function() {
                    d3.select( d3.select( this ).node().parentNode )
                    .attr('class','journey active');
                    this.parentNode.parentNode.appendChild( this.parentNode );
                })
                .on( 'mouseout', function() {
                    d3.select( d3.select( this ).node().parentNode )
                    .attr('class','journey');
                });

            journey
                .append('text')
                .attr( 'dy', -10 )
                .text(function( d ) {
                    // var t = moment(d.start);
                    // return d.duration + ' mins at ' + t.format('HH:mm');
                    return d.duration + ' mins';
                })
        }
    });

    return ClockView;
});