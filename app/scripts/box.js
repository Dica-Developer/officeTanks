/*global define, createjs*/
define(['lodash', 'box2dWrapper'], function(_, b2){
  'use strict';

  function Box(world, scale, image, width, height, x, y){
    this.x = x;
    this.y = y;
    this.view = new createjs.Bitmap(image);
    this.view.scale = scale;

    var fixDef = new b2.FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape = new b2.PolygonShape();
    fixDef.shape.SetAsBox(width / 2 / this.view.scale, height / 2 / this.view.scale);

    var bodyDef = new b2.BodyDef();
    bodyDef.type = b2.Body.b2_dynamicBody;
    bodyDef.position.x = this.x;
    bodyDef.position.y = this.y;

    this.view.body = world.CreateBody(bodyDef);
    this.view.body.CreateFixture(fixDef);
    this.view.onTick = tick;
  }

  Box.prototype.getBody = function(){
    return this.view.body;
  };

  var tick = function(){
    this.x = this.body.GetPosition().x * this.scale;
    this.y = this.body.GetPosition().y * this.scale;
    this.rotation = this.body.GetAngle() * (180/Math.PI);
  };

  return Box;
});
