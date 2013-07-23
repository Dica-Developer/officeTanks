/*global define, createjs*/
define(['lodash', 'box2dWrapper', 'ball'], function(_, b2, Ball){
  'use strict';
  var SCALE;

  function Tank(WORLD, scale, tube, wheel, x, y){
    SCALE = scale;
    this.view = new createjs.Bitmap(tube);
    this.view.regX = 70;
    this.view.regY = 44;

    var fixDef = new b2.FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape = new b2.PolygonShape();
    fixDef.shape.SetAsBox(70 / SCALE, 30 / SCALE);

    var bodyDef = new b2.BodyDef();
    bodyDef.type = b2.Body.b2_dynamicBody;
    bodyDef.position.x = x
    bodyDef.position.y = y;

    this.view.body = WORLD.CreateBody(bodyDef);

    var bodyCenter = this.view.body.GetWorldCenter();
    var wheel1 = new Ball(WORLD, SCALE, wheel, bodyCenter.x - (70 / SCALE), bodyCenter.y + (20 / SCALE));
    var joint1 = new b2.RevoluteJointDef();
    joint1.Initialize(wheel1.view.body, this.view.body, wheel1.view.body.GetWorldCenter());
    joint1.enableMotor = true;
    joint1.motorSpeed = 0;
    joint1.maxMotorTorque = 500;
    this.motor1 = WORLD.CreateJoint(joint1);

    var wheel2 = new Ball(WORLD, SCALE, wheel, bodyCenter.x + (70 / SCALE), bodyCenter.y + (20 / SCALE));
    var joint2 = new b2.RevoluteJointDef();
    joint2.Initialize(wheel2.view.body, this.view.body, wheel2.view.body.GetWorldCenter());
    joint2.enableMotor = true;
    joint2.motorSpeed = 0;
    joint2.maxMotorTorque = 500;
    this.motor2 = WORLD.CreateJoint(joint2);

    this.view.body.CreateFixture(fixDef);
    this.view.onTick = tick;
  }

  Tank.prototype.increaseSpeed = function(){
    var speed = this.motor1.GetMotorSpeed();
    var increased = speed -1;
    console.log(increased);
    if (increased > -10) {
      this.motor1.SetMotorSpeed(increased);
      this.motor2.SetMotorSpeed(increased);
    }
  };

  Tank.prototype.decreaseSpeed = function(){
    var speed = this.motor1.GetMotorSpeed();
    var decreased = speed +1;
    console.log(decreased);
    if (decreased < 10) {
      this.motor1.SetMotorSpeed(decreased);
      this.motor2.SetMotorSpeed(decreased);
    }
  };

  var tick = function(){
    this.x = this.body.GetPosition().x * SCALE;
    this.y = this.body.GetPosition().y * SCALE;
    this.rotation = this.body.GetAngle() * (180/Math.PI);
  };

  return Tank;
});
