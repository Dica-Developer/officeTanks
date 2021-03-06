/*global define, createjs*/
define(['lodash', 'box2dWrapper'], function(_, b2){
  'use strict';

  function Circle(WORLD, SCALE, image, radius, x, y){
    this.view = new createjs.Bitmap(image);
    this.view.scale = SCALE;
    this.view.regX = this.view.regY = radius;

    var fixDef = new b2.FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape = new b2.CircleShape(radius / SCALE);

    var bodyDef = new b2.BodyDef();
    bodyDef.type = b2.Body.b2_dynamicBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    this.view.body = WORLD.CreateBody(bodyDef);
    this.view.body.CreateFixture(fixDef);
    this.view.onTick = tick;
  }

  Circle.prototype.getBody = function(){
    return this.view.body;
  };

  var tick = function(){
    this.x = this.body.GetPosition().x * this.scale;
    this.y = this.body.GetPosition().y * this.scale;
    this.rotation = this.body.GetAngle() * (180/Math.PI);
  };

  return Circle;
});
