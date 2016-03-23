//noinspection JSUnresolvedFunction
/**
 * Created by wgong on 2016/3/23.
 */
describe('test', function () {
  'use strict';
  it('test1', function () {
    expect('undefined(type: undefined)').toEqual(printType(undefined));
  });
  it('test2', function () {
    expect('object|null(type: object)').toEqual(printType(null));
  });
  it('test3', function () {
    expect('function(type: function)').toEqual(printType(new Function()));
  });
  it('test4', function () {
    expect('string|number(type: number)').toEqual(printType(1));
  });
  it('test5', function () {
    expect('string|number(type: number)').toEqual(printType(NaN));
  });
  it('test6', function () {
    expect('string|number(type: string)').toEqual(printType("Hello"));
  });
  it('test7', function () {
    expect('others(type: boolean)').toEqual(printType(true));
  });
});
