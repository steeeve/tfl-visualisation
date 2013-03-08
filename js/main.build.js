({
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
    },
    baseUrl: '.',
    name: '../vendor/almond/almond',
    include: 'main',
    insertRequire: ['main'],
    out: './main.min.js',
    optimize: 'none', // for debugging
    wrap: true
})
