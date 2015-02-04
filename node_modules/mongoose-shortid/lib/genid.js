module.exports = exports = function() {

    var bignum = require('bignum');
    var crypto = require('crypto');


    /*
     * Default encoding alphabets
     * URL-friendly base-64 encoding is chosen.  Base-32 is best suited
     * for tiny-URL like applications, because I and 1 can't be confused
     * and the upper-case characters are more easily remembered by a human.
     *
     * Where "native", we use the bignum native encoding routine.
     */
    var defaultAlphabets = {
        10: "native",
        16: "native",
        32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        36: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        62: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
    };


    // Convert the bignum to a string with the given base
    function bignumToString(bignum, base, alphabet) {
        // Prefer native conversion
        if (alphabet === "native" && base != 6) {
            return bignum.toString(base);
        }

        // Old-sk00l conversion
        var result = [];

        while (bignum.gt(0)) {
            var ord = bignum.mod(base);
            result.push(alphabet.charAt(ord));
            bignum = bignum.div(base);
        }

        return result.reverse().join("");
    }


    return function(options, cb) {
        var len = options.len || 7;
        // if an alphabet was specified it takes priorty
        // otherwise use the default alphabet for the given base
        var base = options.alphabet ? options.alphabet.length : (options.base || 64);
        var alphabet = options.alphabet || defaultAlphabets[base];

        if (!alphabet) {
            var err = new Error(
                "Only base " +
                Object.keys(alphabets).join(", ") +
                " supported if an alphabet is not provided."
            );
            cb(err, null);
            return;
        }

        // Generate a random byte string of the required length
        var bytes = Math.floor( len * Math.log(base) / Math.log(256) );
        crypto.pseudoRandomBytes(bytes, function(err, buf) {

            // Propagate errors...
            if (err) {
                cb(err, null);
                return;
            }

            // Convert to the required base
            var num = bignum.fromBuffer(buf);
            var id = bignumToString(num, base, alphabet);

            // Prefix with the first char to reach the desired fixed length string
            id = Array(len - id.length + 1).join(alphabet[0]) + id;

            cb(null, id);
        });
    };
}();
