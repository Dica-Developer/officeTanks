require.config({
  deps: ['main', 'createjs'],
  paths: {
    "jquery": "../components/jquery/jquery",
    "box2d": "../components/box2dweb/Box2dWeb-2.1.a.3",
    "lodash": "../components/lodash/lodash",
    "createjs": "../components/easeljs/lib/easeljs-0.6.1.min",

    "box2dWrapper": "box2dWrapper",
    "settings": "settings",
    "ground": "ground",
    "circle": "circle",
    "tank": "tank"
  },
  shim: {
    'box2d': {
      exports: 'Box2D'
    },
    'box2dWrapper': ['box2d'],
    'createjs' : {
      deps: ['../components/PreloadJS/lib/preloadjs-0.3.1.min'],
      exports: 'createjs'
    }
  }
});