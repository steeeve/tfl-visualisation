/*global define*/

define(function( require ) {
    'use strict';

    var Backbone = require( 'backbone' ),
            _ = require( 'underscore' ),
            d3 = require( 'd3' ),
            moment = require( 'moment' );

    var commute;

    commute = function( raw ) {
        // Process data
        var data;

        data = [];

        for( var i = 0; i < raw.length; i++) {
            var r,
                    d,
                    sT,
                    eT,
                    duration,
                    start,
                    end;

            r = raw[i];

            d = r[ 'Date' ];
            sT = r[ 'Start Time' ];
            eT = r[ 'End Time' ];

            start = moment( d + ' ' + sT , 'DD-MMM-YYYY HH:mm' );
            end = moment( d + ' ' + eT , 'DD-MMM-YYYY HH:mm' );

            if( end.diff( start ) < 0 ) {

                // Bump end date up by a day!
                end.add( 'days', 1 );
            }

            duration = end.diff( start ) / 60000;

            if( duration < 60 ) {

                data.push({
                    start: start,
                    end: end,
                    duration: duration
                });

            }

        }

        return data;
    };

    return commute;

});