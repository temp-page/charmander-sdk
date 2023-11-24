"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSorted = isSorted;
function isSorted(list, comparator) {
  for (let i = 0; i < list.length - 1; i++) {
    if (comparator(list[i], list[i + 1]) > 0) return false;
  }
  return true;
}