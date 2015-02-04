var mongoose = require('mongoose');
var genId = require('./genid');

var Schema = mongoose.Schema
  , Types = mongoose.Types
  , SchemaString = mongoose.Schema.Types.String;

function ShortId(key, options) {
    this.retries = options.retries || 4;
    this.generator = options.generator || genId;
    this.generatorOptions = options.generatorOptions || {};
    if (!this.generatorOptions.len) {
        this.generatorOptions.len = options.len || 7;
    }
    if (!this.generatorOptions.base) {
        this.generatorOptions.base = options.base || 64;
    }
    if (!this.generatorOptions.alphabet) {
        this.generatorOptions.alphabet = options.alphabet;
    }

    if (options.generator) {
        delete options.generator;
    }
    SchemaString.call(this, key, options);
};

ShortId.prototype.__proto__ = SchemaString.prototype;

Schema.Types.ShortId = ShortId;
Types.ShortId = String;

module.exports = exports = ShortId;
