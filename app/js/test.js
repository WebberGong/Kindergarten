/**
 * Created by wgong on 2016/3/16.
 */
function printType(obj) {
  'use strict';
  var type = typeof obj;
  var output = '';
  if (type === 'undefined') {
    output = type;
  } else if (type === 'function') {
    output = type;
  } else if (type === 'object') {
    output = 'object|null';
  } else if (type === 'string' || type === 'number') {
    output = 'string|number';
  } else {
    output = 'others';
  }
  return output + '(type: ' + type + ')';
}
