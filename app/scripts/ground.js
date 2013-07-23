/*global define, createjs*/
define(['lodash', 'box2dWrapper'], function(_, b2){
  'use strict';
  var world = null;
  var CANVAS, STAGE, SCALE;


  function Ground(newWorld, canvas, stage, scale){
    world = newWorld;
    CANVAS = canvas;
    STAGE = stage;
    SCALE = scale;
    this.tiles = [];
  }

  Ground.prototype.new = function(groundDefinition, image){
    this.tileHeight = 5 / SCALE;
    var startY = (groundDefinition.startY * CANVAS.height / 100) / SCALE;
    var lastTilePosition = new b2.Vec2(0, startY);
    _.each(groundDefinition.tiles, function(tileDef, index){
      var angle = tileDef.angle;
      var tile = new Tile(this.createTile(lastTilePosition, angle, tileDef.width / SCALE), angle, image);
      this.tiles[index] = tile;
      STAGE.addChild(tile.view);
      var fixture = tile.getBody().GetFixtureList();
      lastTilePosition = tile.getBody().GetWorldPoint(fixture.GetShape().m_vertices[3]);
    }, this);
  };

  Ground.prototype.createTile = function(position, angle, width){
    var bodyDef = new b2.BodyDef();
    bodyDef.type = b2.Body.b2_staticBody;

    bodyDef.position.Set(position.x, position.y);

    var fixDef = new b2.FixtureDef();
    fixDef.shape = new b2.PolygonShape();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;

    var coords = [];

    //top-left
    coords.push(new b2.Vec2(
      0,
      0
    ));

    //bottom-left
    coords.push(new b2.Vec2(
      0,
      -this.tileHeight
    ));

    //bottom-right
    coords.push(new b2.Vec2(
      width,
      -this.tileHeight
    ));

    //top-right
    coords.push(new b2.Vec2(
      width,
      0
    ));

    var newCoords = this.rotateTile(coords, new b2.Vec2(0,0), angle);
    fixDef.shape.SetAsArray(newCoords, newCoords.length);
    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    return body;
  };

  Ground.prototype.rotateTile = function(coords, center, angle) {
    var newcoords = [];
    for(var k = 0; k < coords.length; k++) {
      var nc = {};
      nc.x = Math.cos(angle)*(coords[k].x - center.x) - Math.sin(angle)*(coords[k].y - center.y) + center.x;
      nc.y = Math.sin(angle)*(coords[k].x - center.x) + Math.cos(angle)*(coords[k].y - center.y) + center.y;
      newcoords.push(nc);
    }
    return newcoords;
  };

  function Tile(body, angle, image){
    this.view = new createjs.Bitmap(image);
    this.view.regY = 25;
    this.view.body = body;
    this.view.rotation = angle * (180/Math.PI);

    this.view.onTick = function(){
      this.x = this.body.GetPosition().x * SCALE;
      this.y = this.body.GetPosition().y * SCALE;
    };
  }

  Tile.prototype.getBody = function(){
    return this.view.body;
  };

  return Ground;
});
