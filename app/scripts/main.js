/*global define, createjs*/

define([
  'jquery',
  'lodash',
  'box2dWrapper',
  'ground',
  'ball',
  'tank'
], function ($, _, b2, Ground, Ball, Tank) {

  'use strict';
  var world, CANVAS, CANVAS_CTX, DEBUG, DEBUG_CTX, SCALE = 30, STAGE, ground, queue, tank;

  function start() {

    var ground1 = queue.getResult("ground1");
    var imgGrass = queue.getResult("imgGrass");
    var imgBall = queue.getResult("imgBall");
    var imgTank = queue.getResult("imgTank");

    /*for(var i = 0; i < 10; i++){
      var ball = new Ball(world, SCALE, imgBall, Math.random() * 1200 / SCALE, 0);
      STAGE.addChild(ball.view);
    }*/

    var img = queue.getResult("imgTank");
    var wheel = queue.getResult("imgBall");
    tank = new Tank(world, SCALE, img, wheel, Math.random() * 1200 / SCALE, 0);
    STAGE.addChild(tank.view);

    ground.new(ground1, imgGrass);

    _.each(ground.tiles, function(tile){
      STAGE.addChild(tile.view);
    });

    createjs.Ticker.addListener(tick, true);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
  }

  function setDebugDraw () {
    var debugDraw = new b2.DebugDraw();
    debugDraw.SetSprite(DEBUG_CTX);
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.8);
    debugDraw.SetFlags(
      b2.DebugDraw.e_shapeBit |
//      b2.DebugDraw.e_aabbBit |
//      b2.DebugDraw.e_centerOfMassBit |
        b2.DebugDraw.e_jointBit

    );
    world.SetDebugDraw(debugDraw);
  }

  function initLoadQueue () {
    queue = new createjs.LoadQueue();
    queue.addEventListener("complete", start);
    queue.loadManifest([
      {id: "ground1", src: "assets/ground/ground1.json"},
      {id: "imgGrass", src: "assets/images/Gras.png"},
      {id: "imgBall", src: "assets/images/Ball.png"},
      {id: "imgTank", src: "assets/images/Tank.png"}
    ]);
  }

  function init(debug){
    debug = debug || false;

    world = new b2.World(new b2.Vec2(0, 9.81), true);
    CANVAS = document.getElementById('c');
    CANVAS_CTX = CANVAS.getContext("2d");
    DEBUG = document.getElementById('debug');
    DEBUG_CTX = DEBUG.getContext("2d");
    STAGE = new createjs.Stage(CANVAS);
    ground = new Ground(world, CANVAS, STAGE, SCALE);

    $(CANVAS).attr('width', $(window).width())
      .attr('height', $(window).height());
    $(DEBUG).attr('width', $(window).width())
      .attr('height', $(window).height());

    setDebugDraw();

//    $('#debug').on('click', function(e){
//      var img = queue.getResult("imgTank");
//      var wheel = queue.getResult("imgBall");
//      tank = new Tank(world, SCALE, img, wheel, Math.random() * 1200 / SCALE, 0);
//      STAGE.addChild(tank.view);
//    });

    $('#debug').on('keyup', function(e){
      console.log(tank);
      if (e.which === 39) {
        tank.increaseSpeed();
      } else if (e.which === 37) {
        tank.decreaseSpeed();
      }
    });

    initLoadQueue();
  }

  function tick(){
    STAGE.update();
    world.Step(1/60, 10, 10);
//    world.DrawDebugData();
    world.ClearForces();
  }

  $(function(){
    init(true);
  });

});
