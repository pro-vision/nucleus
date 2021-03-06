/* global describe */
/* global it */

'use strict';

var assert = require('assert');
var Helpers = require('./helpers');
var Verbose = require('../src/Verbose.js');
var Substitute = require('../src/Substitute');

describe('Substitution', function () {

  it('complains about invalid shortcodes', function () {
    Helpers.hook(Verbose, 'log');
    Substitute.substitute('@{lipsums}');
    assert.ok(Helpers.logCalled >= 1);
  });

  /********************************************************/

  it('should not break if no markup is present', function () {
    Substitute.substitute();
  });

  /********************************************************/

  it('resolves to image urls', function () {
    var markup = 'Test @{image:300:300}';
    var subs = Substitute.substitute(markup);

    assert.ok(subs.indexOf('Test') === 0);
    assert.ok(subs.indexOf('https://unsplash.it/') !== -1);

  });

  /********************************************************/

  it('resolves dummy text', function () {
    var markup = 'Test @{lipsum:1:words}';
    var subs = Substitute.substitute(markup);

    assert.ok(subs.indexOf('Test') === 0);
    assert.ok(subs.indexOf('{lipsum') === -1);

    markup = 'Test @{lipsum:1:letter}';
    subs = Substitute.substitute(markup);
    assert.ok(subs.indexOf('Test') === 0);
    assert.ok(subs.indexOf('{lipsum') === -1);

    markup = '@{lipsum:1:words}';
    subs = Substitute.substitute(markup);
    assert.ok(subs.split(' ').length === 1);

    markup = '@{lipsum:3:words}';
    subs = Substitute.substitute(markup);
    assert.ok(subs.split(' ').length === 3);

  });


    /********************************************************/

    it('includes templates', function () {
      var markup = 'Test @{template: assets/test-fixtures/substitition-template.html}';
      Substitute.injectConfig({});
      var subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{template') === -1);
      assert.ok(/---TEMPLATE---$/.test(subs));

      markup = 'Test @{template: substitition-template.html}';
      Substitute.injectConfig({
        templatePath: 'assets/test-fixtures'
      });
      var subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{template') === -1);
      assert.ok(/---TEMPLATE---$/.test(subs));

      markup = 'Test @{template: random-file.txt}';
      Substitute.injectConfig({});
      var subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{template') === -1);
      assert.ok(!/---TEMPLATE---$/.test(subs));
    });


  /********************************************************/

  it('includes templates', function () {
    var markup = 'Test @{template: assets/test-fixtures/substitition-template.html}';
    Substitute.injectConfig({});
    var subs = Substitute.substitute(markup);
    assert.ok(subs.indexOf('{template') === -1);
    assert.ok(/---TEMPLATE---$/.test(subs));

    markup = 'Test @{template: substitition-template.html}';
    Substitute.injectConfig({
      templatePath: 'assets/test-fixtures'
    });
    var subs = Substitute.substitute(markup);
    assert.ok(subs.indexOf('{template') === -1);
    assert.ok(/---TEMPLATE---$/.test(subs));

    markup = 'Test @{template: random-file.txt}';
    Substitute.injectConfig({});
    var subs = Substitute.substitute(markup);
    assert.ok(subs.indexOf('{template') === -1);
    assert.ok(!/---TEMPLATE---$/.test(subs));
  });


  /********************************************************/

  describe('iframes / ', function () {
    // quotation marks for regex
    const quot = `['"]`;
    const url = '/components/test.html';
    const host = 'http://example.com';
    const DEFAULT_WIDTH = '100%';
    const DEFAULT_HEIGHT = '100vh';
    // returns data-markup-selector="sel"
    const selectorRegex = (sel = '') => RegExp(`data-markup-selector=${quot}${sel}${quot}`);
    var markup, subs;

    it("inserts defaults", function () {
      markup = `Test @{iframe: ${url}}`;
      Substitute.injectConfig({});
      subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{iframe') === -1);
      assert.ok(/<iframe/.test(subs));
      assert.ok(RegExp(`src=${quot}${url}${quot}`).test(subs));
      assert.ok(RegExp(`width:\\s*${DEFAULT_WIDTH}`).test(subs));
      assert.ok(RegExp(`height:\\s*${DEFAULT_HEIGHT}`).test(subs));
      assert.ok(selectorRegex().test(subs));
    });

    it("uses iframePath", function () {
      markup = `Test @{iframe: ${url}}`;
      Substitute.injectConfig({
        iframePath: host
      });
      subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{iframe') === -1);
      assert.ok(/<iframe/.test(subs));
      assert.ok(RegExp(`src=${quot}${host}${url}${quot}`).test(subs));
    });

    it("uses iframePath and handles slashes", function () {
      markup = `Test @{iframe: /${url}}`;
      Substitute.injectConfig({
        iframePath: host + '/'
      });
      subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{iframe') === -1);
      assert.ok(/<iframe/.test(subs));
      assert.ok(RegExp(`src=${quot}${host}${url}${quot}`).test(subs));
    });

    it("uses height when there is no width", function () {
      markup = `Test @{iframe: ${url}::hhh}`;
      Substitute.injectConfig({});
      subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{iframe') === -1);
      assert.ok(/<iframe/.test(subs));
      assert.ok(RegExp(`src=${quot}${url}${quot}`).test(subs));
      assert.ok(RegExp(`width:\\s*${DEFAULT_WIDTH}`).test(subs));
      assert.ok(RegExp(`height:\\s*hhh`).test(subs));
    });

    it("uses width and height", function () {
      markup = `Test @{iframe: ${url}:wwww:hhhh}`;
      Substitute.injectConfig({});
      subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{iframe') === -1);
      assert.ok(/<iframe/.test(subs));
      assert.ok(RegExp(`src=${quot}${url}${quot}`).test(subs));
      assert.ok(RegExp(`width:\\s*wwww`).test(subs));
      assert.ok(RegExp(`height:\\s*hhhh`).test(subs));
    });

    it("uses selector", function () {
      markup = `Test @{iframe: ${url}:wwww:hhhh:selector}`;
      Substitute.injectConfig({});
      subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{iframe') === -1);
      assert.ok(/<iframe/.test(subs));
      assert.ok(RegExp(`src=${quot}${url}${quot}`).test(subs));
      assert.ok(selectorRegex('selector').test(subs));
    });

    it("uses selector with colons", function () {
      markup = `Test @{iframe: ${url}:wwww:hhhh:selector:with:colon}`;
      Substitute.injectConfig({});
      subs = Substitute.substitute(markup);
      assert.ok(subs.indexOf('{iframe') === -1);
      assert.ok(/<iframe/.test(subs));
      assert.ok(RegExp(`src=${quot}${url}${quot}`).test(subs));
      assert.ok(selectorRegex('selector:with:colon').test(subs));
    });
  });

});
