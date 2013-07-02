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
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.transitions.Dissolve');
goog.require('goog.events.KeyCodes');
goog.require('goog.math.Box');

function positionTanksOn(mountain, tank) {
  var fallDown = new lime.animation.MoveTo(-375, 230).setSpeed(1).setEasing(lime.animation.Easing.EASEINOUT);
  function collision(target) {
    var tankBox = tank.getBoundingBox();
    var mountainBox = mountain.getBoundingBox();
    while (goog.math.Box.intersectsWithPadding(tankBox, mountainBox, 1)) {
      lime.scheduleManager.unschedule(collision);
      fallDown.stop();
      var degreeStart = tank.getRotation();
      var position = tank.getPosition();
      tank.setRotation(tank.getRotation() + 1);
      while (goog.math.Box.intersectsWithPadding(tankBox, mountainBox, 1)) {
        tank.setRotation(tank.getRotation() + 1);
        if (degreeStart === tank.getRotation()) {
          break;
        }
      }
      var coordinate = new goog.math.Coordinate(tank.getPosition().x, tank.getPosition().y + 1);
      tank.setPosition(coordinate);
    }
  }
  lime.scheduleManager.schedule(collision);
  tank.setPosition(-375, -230);
  tank.runAction(fallDown);
}

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
  var tank = new lime.Sprite();
  tank.setFill('tank.png');
  tank.setSize(50, 20);
  var mountain = new lime.Polygon();
  mountain.addPoints(-400, 0, 0, -30, 400, 0, 400, -2, -400, -2);
  mountain.setFill(0, 100, 0);
  mountain.setPosition(0, 0);
  mountain.setStroke(1, '#f00');

  var layer = new lime.Layer();
  layer.setRenderer(lime.Renderer.CANVAS);
  layer.setPosition(400, 240);
  layer.appendChild(background);
  layer.appendChild(tank);
  layer.appendChild(mountain);

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

      positionTanksOn(mountain, tank);
      director.replaceScene(gameScene, lime.transitions.Dissolve);
    });
  });

  var menuScene = new lime.Scene();
  menuScene.appendChild(target);
  menuScene.appendChild(title);

  director.replaceScene(menuScene, lime.transitions.Dissolve);
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('audica.tanks.start', audica.tanks.start);