"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomInt = randomInt;

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}