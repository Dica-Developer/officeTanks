/*global goog, audica, lime, document*/
//set main namespace
goog.provide('audica.tanks');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Polygon');
goog.require('lime.Label');
goog.require('lime.fill.LinearGradient');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.transitions.Dissolve');
goog.require('goog.events.KeyCodes');
goog.require('goog.math.Box');
goog.require('goog.math.Coordinate');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.JointDef');
goog.require('box2d.MouseJointDef');
goog.require('box2d.World');
goog.require('box2d.Vec2');

// entrypoint
audica.tanks.start = function () {
  var director = new lime.Director(document.body, 800, 480);
  director.makeMobileWebAppCapable();

  var circle = new lime.Circle().setSize(210, 210).setFill(0, 0, 0);
  var lbl = new lime.Label().setSize(200, 30).setFontSize(30).setText('Press To Start').setFontColor('white');
  var title = new lime.Label().setSize(800, 70).setFontSize(60).setText('Office Tanks').setPosition(400, 40)
    .setFontColor('white').setFill(0, 0, 0);

  var target = new lime.Layer().setPosition(400, 240);
  target.appendChild(circle);
  target.appendChild(lbl);

  var background = new lime.Sprite();
  background.setPosition(0, 0);
  background.setFill('mountains.png');

  var layer = new lime.Layer();
  layer.setRenderer(lime.Renderer.CANVAS);
  layer.setPosition(400, 240);
  layer.appendChild(background);

  var gameScene = new lime.Scene();
  gameScene.appendChild(layer);

  goog.events.listen(target, ['mousedown', 'touchstart'], function (e) {
    e.swallow(['mouseup', 'touchend'], function () {
      goog.events.listen(document, ['keydown'], function (e) {
        if (e.keyCode === goog.events.KeyCodes.LEFT) {
          // move tank left
        } else if (e.keyCode === goog.events.KeyCodes.RIGHT) {
          // move tank right
        } else if (e.keyCode === goog.events.KeyCodes.P) {
          director.setPaused(!director.isPaused());
        }
      });

      director.replaceScene(gameScene, lime.transitions.Dissolve);
    });
  });

  var menuScene = new lime.Scene();
  menuScene.appendChild(target);
  menuScene.appendChild(title);

  director.replaceScene(menuScene, lime.transitions.Dissolve);


  var gravity = new box2d.Vec2(0, 200);
  var bounds = new box2d.AABB();
  bounds.minVertex.Set(-800, -400);
  bounds.maxVertex.Set(2 * 800, 2 * 400);
  var world = new box2d.World(bounds, gravity, false);

  function createGround() {
    var ground = new lime.Polygon();
    ground.addPoint(new goog.math.Coordinate(-400, 48));
    var poly = [];
    for (var i=(-400); i<401; i = i+10) {
      var y = 47 - (Math.random() * 30);
      poly.push(new box2d.Vec2(i, y));
      ground.addPoint(new goog.math.Coordinate(i, y));
    }
    ground.addPoint(new goog.math.Coordinate(400, 48));
    ground.setFill(255, 0, 0);
    layer.appendChild(ground);

    box2d.Settings.b2_maxPolyVertices = poly.length;

    var shapeDef = new box2d.PolyDef();
    shapeDef.restitution = 0.9;
    shapeDef.density = 0;
    shapeDef.friction = 1;
    shapeDef.SetVertices(poly);

    var bodyDef = new box2d.BodyDef;
    bodyDef.position.Set(0, 0);
    bodyDef.AddShape(shapeDef);

    ground._body = world.CreateBody(bodyDef);
    return ground;
  }

  function createTank () {
    var tank = new lime.Sprite();
    tank.setFill('tank.png');
    tank.setSize(50, 20);
    layer.appendChild(tank);

    var shapeDef = new box2d.CircleDef;
    shapeDef.restitution = 0.9;
    shapeDef.density = 5;
    shapeDef.friction = 1;

    var bodyDef = new box2d.BodyDef;
    bodyDef.position.Set(0, -200);
    bodyDef.angularDamping = .001;
    bodyDef.AddShape(shapeDef);

    tank._body = world.CreateBody(bodyDef);
    return tank;
  }

  function updateFromBody(shape){
    var pos = shape._body.GetCenterPosition();
    var rot = shape._body.GetRotation();
    shape.setRotation(-rot / Math.PI * 180);
    shape.setPosition(pos);
  }

  var ground = createGround();
  var tank = createTank();

  lime.scheduleManager.schedule(function(dt) {
    if(dt>100) dt=100; // long delays(after pause) cause false collisions
    world.Step(dt / 1000, 3);

    updateFromBody(ground);
    updateFromBody(tank);
  },this);
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('audica.tanks.start', audica.tanks.start);