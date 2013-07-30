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
    this.canonMotor = null;

    this.buildTank();
  }

  Tank.prototype.buildTank = function() {
    this.tube = new Box(this.world, this.scale, this.tubeImg, 140, 60, this.x, this.y);
    this.tube.view.regX = 70;
    this.tube.view.regY = 44;
    this.stage.addChild(this.tube.view);
    var tubeCenter = this.tube.getBody().GetWorldCenter();

    this.canon = new Circle(this.world, this.scale, "", 10, tubeCenter.x + (70 / this.scale), tubeCenter.y - (35 / this.scale));
    this.stage.addChild(this.canon.view);
    var canonBody = this.canon.view.body;
    var canonCenter = canonBody.GetWorldCenter();
    var canonJoinPoint = new b2.Vec2(tubeCenter.x + (70 / this.scale), canonCenter.y);

//    var tankCanonJoinPoint = new b2.Vec2(tubeCenter.x - (70 / this.scale), tubeCenter.y);

    var canonJoint = new b2.RevoluteJointDef();
    canonJoint.Initialize(canonBody, this.tube.getBody(), canonJoinPoint);
    canonJoint.enableMotor = true;
    canonJoint.lowerAngle = -0.15 * Math.PI;
    canonJoint.upperAngle = 0.50 * Math.PI;
    canonJoint.enableLimit = true;
    canonJoint.maxMotorTorque = 5000;
    canonJoint.motorSpeed = 0;
    this.canonMotor = this.world.CreateJoint(canonJoint);

    this.canonTop = new Box(this.world, this.scale, "", 100, 1, tubeCenter.x + (120 / this.scale), tubeCenter.y - (40 / this.scale));
    var canonTopCenter = this.canonTop.view.body.GetWorldCenter();
    var canonTopJoinPoint = new b2.Vec2(canonTopCenter.x - (50 / this.scale), canonTopCenter.y);
    var canonTopJoint = new b2.WeldJointDef();
    canonTopJoint.Initialize(canonBody, this.canonTop.view.body, canonTopJoinPoint);
    this.world.CreateJoint(canonTopJoint);

    this.canonBottom = new Box(this.world, this.scale, "", 100, 1, tubeCenter.x + (120 / this.scale), tubeCenter.y - (30 / this.scale));
    var canonBottomCenter = this.canonBottom.view.body.GetWorldCenter();
    var canonBottomJoinPoint = new b2.Vec2(canonBottomCenter.x - (50 / this.scale), canonBottomCenter.y);
    var canonBottomJoint = new b2.WeldJointDef();
    canonBottomJoint.Initialize(canonBody, this.canonBottom.view.body, canonBottomJoinPoint);
    this.world.CreateJoint(canonBottomJoint);

    this.canonEnd = new Box(this.world, this.scale, "", 1, 10, canonTopCenter.x + (50 / this.scale), canonTopCenter.y + (5 / this.scale));
    var canonEndCenter = this.canonTop.view.body.GetWorldCenter();

    var canonEndJoinPointTop = new b2.Vec2(canonEndCenter.x + (50 / this.scale), canonEndCenter.y);
    var canonEndJointTop = new b2.WeldJointDef();
    canonEndJointTop.Initialize(this.canonTop.view.body, this.canonEnd.view.body, canonEndJoinPointTop);
    this.world.CreateJoint(canonEndJointTop);

    var canonEndJoinPointBottom = new b2.Vec2(canonEndCenter.x + (50 / this.scale), canonEndCenter.y);
    var canonEndJointBottom = new b2.WeldJointDef();
    canonEndJointBottom.Initialize(this.canonBottom.view.body, this.canonEnd.view.body, new b2.Vec2(canonBottomCenter.x + (50 / this.scale), canonBottomCenter.y), canonEndJoinPointBottom);
    this.world.CreateJoint(canonEndJointBottom);

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

  Tank.prototype.liftCanon = function(){
    this.canonMotor.SetMotorSpeed(0.5);
  };

  Tank.prototype.lowerCanon = function(){
    this.canonMotor.SetMotorSpeed(-0.5);
  };

  Tank.prototype.stopCanon = function(){
    this.canonMotor.SetMotorSpeed(0);
  };

  Tank.prototype.stop = function(){
    this.frontMotor.SetMotorSpeed(0);
    this.rearMotor.SetMotorSpeed(0);
  };

  Tank.prototype.shoot = function() {
    // create bullet
    // position on left end of canon
    // apply force to the bullet
  }

  Tank.prototype.addToStage = function(){

  };

  var tick = function(){
    this.x = this.body.GetPosition().x * this.scale;
    this.y = this.body.GetPosition().y * this.scale;
    this.rotation = this.body.GetAngle() * (180/Math.PI);
  };

  return Tank;
});
