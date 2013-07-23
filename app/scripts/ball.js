/*global define, createjs*/
define(['lodash', 'box2dWrapper'], function(_, b2){
  'use strict';
  var SCALE;

  function Ball(WORLD, scale, image, x, y){
    SCALE = scale;
    this.view = new createjs.Bitmap(image);
    this.view.regX = this.view.regY = 25;

    var fixDef = new b2.FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape = new b2.CircleShape(25 / SCALE);

    var bodyDef = new b2.BodyDef();
    bodyDef.type = b2.Body.b2_dynamicBody;
    bodyDef.position.x = x
    bodyDef.position.y = y;

    this.view.body = WORLD.CreateBody(bodyDef);
    this.view.body.CreateFixture(fixDef);
    this.view.onTick = tick;
  }

  var tick = function(){
    this.x = this.body.GetPosition().x * SCALE;
    this.y = this.body.GetPosition().y * SCALE;
    this.rotation = this.body.GetAngle() * (180/Math.PI);
  };

  return Ball;
});
