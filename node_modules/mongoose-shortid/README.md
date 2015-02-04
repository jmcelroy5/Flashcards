mongoose-shortid
================

This plugin provides a new Schema Type, ShortId, that can be used in place of ObjectId. Typically you will want to use this instead of the default `id` field, but you can also use ShortId for any other field. To make sure however the ShortId is unique, you should add an index on the field.
The generated IDs are random url-safe strings of configurable length, represented in a configurable base (10, 16, 32, 36, 62, 64 only).

This plugin will automatically retry inserts on a collision.

### Usage

```javascript
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');

var personSchema = mongoose.Schema({
    _id: ShortId,
    name: String
});

// or 

var anotherSchema = mongoose.Schema({
    alternativeId: { type: ShortId, index: true},
    name         : String
});


```

### Options

The default options are:

```javascript
var personSchema = mongoose.Schema({
    _id: {
        type: ShortId,
        len: 7,     // Length 7 characters
        base: 64,   // Web-safe base 64 encoded string
        alphabet: undefined // Use default alphabet for base
        retries: 4  // Four retries on collision
    },
    name: String
});
```

### Custom Alphabets

A custom alphabet can be provided using the `alphabet` option. This takes priority over the `base` argument.

```javascript
var personSchema = mongoose.Schema({
    _id: {
        type: ShortId,
        len: 9,
        alphabet: 'fubar'
    }
});
```

The generated IDs will be 9 characters long with only the characters `f` `u` `b` `a` and `r`.


### Custom ID Generation

A custom ID generator function can be provided by setting the `generator` option. This function will be called with two arguments: `generatorOptions` and `callback`.

The `generatorOptions` is made up from the `generatorOptions` object in the field options (if set), with `len`, `base` and `alphabet` overriden if set on the field options.

The `callback` function expects to be called with `err` and `id` parameters.

Here's an example:

```javascript
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');

function customIdGenerator(options, callback) {
    var desiredLength = options.len || 7;
    var base = options.base || 64;
    var alphabet = options.alphabet || alphabetForBase(base);
    var customOption = options.customOption;
    
    // do Id generation
    var generatedId = ...;

    if (generatedId) {
        callback(null, generatedId);
    } else {
        callback(err);
    }
}

var exampleSchema = mongoose.Schema({
    _id: {
        type: ShortId,
        len:4,
        generator: customIdGenerator,
        generatorOptions: { customOption: 'foo' }
    },
    name: String
});

```
