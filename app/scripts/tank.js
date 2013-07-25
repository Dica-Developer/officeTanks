/*global define, createjs*/
define([
  'lodash',
  'box2dWrapper',
  'circle',
  'box'
], function(_, b2, Circle, Box){
  'use strict';

  function Tank(WORLD, stage, scale, tubeImg, wheelImg, x, y){
    this.world = WORLD;
    this.scale = scale;
    this.stage = stage;
    this.x = x;
    this.y = y;
    this.tube = null;
    this.tubeImg = tubeImg;
    this.frontWheel = null;
    this.frontMotor = null;
    this.rearWheel = null;
    this.rearMotor = null;
    this.wheelImg = wheelImg;

    this.buildTank();
  }

  Tank.prototype.buildTank = function() {
    this.tube = new Box(this.world, this.scale, this.tubeImg, 140, 60, this.x, this.y);
    this.tube.view.regX = 70;
    this.tube.view.regY = 44;
    this.stage.addChild(this.tube.view);

    var tubeCenter = this.tube.getBody().GetWorldCenter();
    this.rearWheel = new Circle(
      this.world,
      this.scale,
      this.wheelImg,
      25,
      tubeCenter.x - (70 / this.scale),
      tubeCenter.y + (20 / this.scale)
    );
    this.stage.addChild(this.rearWheel.view);
    var rearJoint = new b2.RevoluteJointDef();
    var rearWheelBody = this.rearWheel.view.body;
    var rearWheelCenter = rearWheelBody.GetWorldCenter();
    rearJoint.Initialize(rearWheelBody, this.tube.getBody(), rearWheelCenter);
    rearJoint.enableMotor = true;
    rearJoint.motorSpeed = 0;
    rearJoint.maxMotorTorque = 500;
    this.frontMotor = this.world.CreateJoint(rearJoint);

    this.frontWheel = new Circle(
      this.world,
      this.scale,
      this.wheelImg,
      25,
      tubeCenter.x + (70 / this.scale),
      tubeCenter.y + (20 / this.scale)
    );
    this.stage.addChild(this.frontWheel.view);
    var frontJoint = new b2.RevoluteJointDef();
    var frontWheelBody = this.frontWheel.view.body;
    var frontWheelCenter = frontWheelBody.GetWorldCenter();
    frontJoint.Initialize(frontWheelBody, this.tube.getBody(), frontWheelCenter);
    frontJoint.enableMotor = true;
    frontJoint.motorSpeed = 0;
    frontJoint.maxMotorTorque = 500;
    this.rearMotor = this.world.CreateJoint(frontJoint);
  };

  Tank.prototype.increaseSpeed = function(){
    var speed = this.getSpeed();
    var increased = speed -1;
    if (increased > -10) {
      this.frontMotor.SetMotorSpeed(increased);
      this.rearMotor.SetMotorSpeed(increased);
    }
  };

  Tank.prototype.getSpeed = function() {
    return this.frontMotor.GetMotorSpeed();
  };

  Tank.prototype.decreaseSpeed = function(){
    var speed = this.getSpeed();
    var decreased = speed +1;
    if (decreased < 10) {
      this.frontMotor.SetMotorSpeed(decreased);
      this.rearMotor.SetMotorSpeed(decreased);
    }
  };

  Tank.prototype.addToStage = function(){

  };


  var tick = function(){
    this.x = this.body.GetPosition().x * this.scale;
    this.y = this.body.GetPosition().y * this.scale;
    this.rotation = this.body.GetAngle() * (180/Math.PI);
  };

  return Tank;
});
