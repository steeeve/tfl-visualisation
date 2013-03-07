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

    for( var i in raw ) {
      var r,
          d,
          sT,
          eT,
          journeyAction,
          from,
          to,
          duration,
          start,
          end,
          journey;

      r = raw[i];

      journeyAction = r['Journey/Action'];

      d = r[ 'Date' ];
      sT = r[ 'Start Time' ];
      eT = r[ 'End Time' ];

      if(
        !journeyAction.match(/bus journey|topped up|season ticket/ig) &&
        eT !== ''
      ) {
        journey = journeyAction.split( ' to ' );

        start = moment( d + ' ' + sT , 'DD-MMM-YYYY HH:mm' );
        end = moment( d + ' ' + eT , 'DD-MMM-YYYY HH:mm' );

        if( end.diff( start ) < 0 ) {

            // Bump end date up by a day!
            end.add( 'days', 1 );
        }

        duration = end.diff( start ) / 60000;

        data.push({
          from: journey[ 0 ],
          to: journey[ 1 ],
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