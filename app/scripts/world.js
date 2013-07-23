/*global define*/
define(['box2dWrapper'], function(b2){
  'use strict';
  return new b2.World(new b2.Vec2(0, 9.81), true);
});
