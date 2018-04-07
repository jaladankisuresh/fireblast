/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(9);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(10);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(15);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var fbApi = __webpack_require__(5);
let counter = 0;
fbApi.connect('get', "establishments/6/comments", (err, data) => {
  if(err) return console.error("fireblast get error", err);
  console.log("fireblast get success", "establishments/6/comments", data);
});

fbApi.connect('set', "establishments/6/comments/0", "{id=14, text=Fourten}", (err, data) => {
  if(err) return console.error("fireblast set error", err);
  console.log("fireblast set success", "establishments/6/comments/0", "{id=14, text=Fourten}");
});

fbApi.connect('update', "establishments/6/comments", '{"0": {"id":14, "text":"Fourteeen"}}', (err, data) => {
  if(err) return console.error("fireblast update error", err);
  console.log("fireblast update success", "establishments/6/comments", '{"0": {"id":14, "text":"Fourteeen"}}');
});

fbApi.connect('increment', "like-counter/count", (err, data) => {
  if(err) return console.error("fireblast increment error", err);
  console.log("fireblast increment success", "like-counter/count", data);
});

fbApi.connect('increment', "like-counter/count", (err, data) => {
  if(err) return console.error("fireblast increment error", err);
  console.log("fireblast increment success", "like-counter/count", data);
});

fbApi.connect('decrement', "like-counter/count", (err, data) => {
  if(err) return console.error("fireblast decrement error", err);
  console.log("fireblast decrement success", "like-counter/count", data);
});

fbApi.connect('onChildAdded', "establishments/6/comments", (err, data) => {
  if(err) return console.error("fireblast onChildAdded error", err);
  console.log("fireblast onChildAdded success" + counter++, data);
  if(counter > 2) {
    fbApi.connect('offChildAdded', "establishments/6/comments");
  }
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["fbApi"] = __webpack_require__(6);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var shortid = __webpack_require__(7);

var fbRequestQueue = {};
// using a temporary jFirebase javascript object to ease testing from javascript.
// In production, this is to be replaced with fbApi
var fbApi = {
  connect: function() {
    let path, data, cb;
    let args = arguments;
    let token = shortid.generate();
    let key = args[0];
    switch (key) {
      case 'get':
        if(args.length != 3) return;
        path = args[1];
        cb = args[2];
        jFirebase.get(token, path);
        break;
      case 'set':
        if(args.length != 4) return;
        path = args[1];
        data = args[2];
        cb = args[3];
        jFirebase.set(token, path, data);
        break;
      case 'update':
        if(args.length != 4) return;
        path = args[1];
        data = args[2];
        cb = args[3];
        jFirebase.update(token, path, data);
        break;
      case 'increment':
        if(args.length != 3) return;
        path = args[1];
        cb = args[2];
        jFirebase.increment(token, path);
        break;
      case 'decrement':
        if(args.length != 3) return;
        path = args[1];
        cb = args[2];
        jFirebase.decrement(token, path);
        break;
      case 'onChildAdded':
        if(args.length != 3) return;
        let stickyToken = 'stick#' + token;
        path = args[1];
        cb = args[2];
        jFirebase.onChildAdded(stickyToken, path);
        break;
      case 'offChildAdded':
        if(args.length != 2) return;
        let unstickyToken = 'unstick#' + token;
        path = args[1];
        jFirebase.offChildAdded(unstickyToken, path);
        break;
      default: return;
    }
    switch (key) {
      case 'get':
      case 'set':
      case 'update':
      case 'increment':
      case 'decrement':
        fbRequestQueue[token] = cb;
        break;
      case 'onChildAdded':
        let stickyToken = 'stick#' + token;
        fbRequestQueue[stickyToken] = {path: path, cb: cb};
        break;
      case 'offChildAdded':
      let unstickyToken = 'unstick#' + token;
      fbRequestQueue[unstickyToken] = path;
      break;
    }
  },
  onSuccessResponse : function(token, data) {
    let rt = fbRequestQueue[token];
    switch (typeof rt) {
      case 'object':
        rt.cb(null, data);
        break;
      case 'function':
        rt(null, data);
        delete fbRequestQueue[token];
        break;
      case 'string':
        for (let [key, item] of fbRequestQueue) {
          if(typeof item === 'object' && item.path === rt) {
            delete fbRequestQueue[key];
            delete fbRequestQueue[token];
            return;
          }
        }
        break;
    }
  },
  onErrorResponse : function(token, error) {
    let rt = fbRequestQueue[token];
    switch (typeof rt) {
      case 'object':
        rt.cb(error);
        break;
      case 'function':
        rt(error);
        delete fbRequestQueue[token];
        break;
      case 'string':
        delete fbRequestQueue[token];
        break;
    }
  }
};
module.exports = fbApi;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(8);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);
var encode = __webpack_require__(2);
var decode = __webpack_require__(11);
var build = __webpack_require__(12);
var isValid = __webpack_require__(13);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(14) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(2);
var alphabet = __webpack_require__(0);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(0);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["console"] = __webpack_require__(16);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

var stringify = function(args) {
  let strArr = [];
  for(let arg of args) {
    let str = (() => {
      if(typeof arg === 'string') {
        return arg;
      }
      else if(typeof arg === 'function') {
        return arg.toString();
      }
      else if(typeof arg === 'object') {
        return JSON.stringify(arg);
      }
    })();
    strArr.push(str);
  }
  return strArr.join('\n');
};
var console = {
  log : function() {
    let str = stringify(arguments);
    jConsole.log(str);
  },
  error : function() {
    let str = stringify(arguments);
    jConsole.error(str);
  },
  getHandler : function(err, data) {
      if(err) return jConsole.error(err);
      jConsole.log(data);
  }
};

module.exports = console;


/***/ })
/******/ ]);