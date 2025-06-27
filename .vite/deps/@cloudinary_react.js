import {
  require_react
} from "./chunk-TVFQMRVC.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/@cloudinary/react/dist/index.js
var import_react = __toESM(require_react());
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var lodash_clonedeep = { exports: {} };
(function(module, exports) {
  var LARGE_ARRAY_SIZE = 200;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var MAX_SAFE_INTEGER = 9007199254740991;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", promiseTag = "[object Promise]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag2 = "[object Symbol]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reFlags = /\w*$/;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag2] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
  var freeGlobal2 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
  var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  function addMapEntry(map, pair) {
    map.set(pair[0], pair[1]);
    return map;
  }
  function addSetEntry(set, value) {
    set.add(value);
    return set;
  }
  function arrayEach(array, iteratee) {
    var index = -1, length = array ? array.length : 0;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array ? array.length : 0;
    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function isHostObject(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {
      }
    }
    return result;
  }
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto2 = Object.prototype;
  var coreJsData = root2["__core-js_shared__"];
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto2.hasOwnProperty;
  var objectToString2 = objectProto2.toString;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Buffer = moduleExports ? root2.Buffer : void 0, Symbol2 = root2.Symbol, Uint8Array = root2.Uint8Array, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto2.propertyIsEnumerable, splice = arrayProto.splice;
  var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0, nativeKeys = overArg(Object.keys, Object);
  var DataView = getNative(root2, "DataView"), Map2 = getNative(root2, "Map"), Promise2 = getNative(root2, "Promise"), Set = getNative(root2, "Set"), WeakMap = getNative(root2, "WeakMap"), nativeCreate = getNative(Object, "create");
  var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function Hash(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map2 || ListCache)(),
      "string": new Hash()
    };
  }
  function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function Stack(entries) {
    this.__data__ = new ListCache(entries);
  }
  function stackClear() {
    this.__data__ = new ListCache();
  }
  function stackDelete(key) {
    return this.__data__["delete"](key);
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  function stackSet(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache) {
      var pairs = cache.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        return this;
      }
      cache = this.__data__ = new MapCache(pairs);
    }
    cache.set(key, value);
    return this;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayLikeKeys(value, inherited) {
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
      object[key] = value;
    }
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }
  function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== void 0) {
      return result;
    }
    if (!isObject2(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag || tag == argsTag || isFunc && !object) {
        if (isHostObject(value)) {
          return object ? value : {};
        }
        result = initCloneObject(isFunc ? {} : value);
        if (!isDeep) {
          return copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, baseClone, isDeep);
      }
    }
    stack || (stack = new Stack());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (!isArr) {
      var props = isFull ? getAllKeys(value) : keys(value);
    }
    arrayEach(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue(result, key2, baseClone(subValue, isDeep, isFull, customizer, key2, value, stack));
    });
    return result;
  }
  function baseCreate(proto) {
    return isObject2(proto) ? objectCreate(proto) : {};
  }
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  function baseGetTag(value) {
    return objectToString2.call(value);
  }
  function baseIsNative(value) {
    if (!isObject2(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
  }
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor());
  }
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor());
  }
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  function copyObject(source, props, object, customizer) {
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      assignValue(object, key, newValue === void 0 ? source[key] : newValue);
    }
    return object;
  }
  function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
  }
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
  var getTag = baseGetTag;
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function(value) {
      var result = objectToString2.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function initCloneArray(array) {
    var length = array.length, result = array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  }
  function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return cloneArrayBuffer(object);
      case boolTag:
      case dateTag:
        return new Ctor(+object);
      case dataViewTag:
        return cloneDataView(object, isDeep);
      case float32Tag:
      case float64Tag:
      case int8Tag:
      case int16Tag:
      case int32Tag:
      case uint8Tag:
      case uint8ClampedTag:
      case uint16Tag:
      case uint32Tag:
        return cloneTypedArray(object, isDeep);
      case mapTag:
        return cloneMap(object, isDeep, cloneFunc);
      case numberTag:
      case stringTag:
        return new Ctor(object);
      case regexpTag:
        return cloneRegExp(object);
      case setTag:
        return cloneSet(object, isDeep, cloneFunc);
      case symbolTag2:
        return cloneSymbol(object);
    }
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto2;
    return value === proto;
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function cloneDeep2(value) {
    return baseClone(value, true, true);
  }
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  function isArguments(value) {
    return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString2.call(value) == argsTag);
  }
  var isArray = Array.isArray;
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  function isArrayLikeObject(value) {
    return isObjectLike2(value) && isArrayLike(value);
  }
  var isBuffer = nativeIsBuffer || stubFalse;
  function isFunction(value) {
    var tag = isObject2(value) ? objectToString2.call(value) : "";
    return tag == funcTag || tag == genTag;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isObject2(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function stubArray() {
    return [];
  }
  function stubFalse() {
    return false;
  }
  module.exports = cloneDeep2;
})(lodash_clonedeep, lodash_clonedeep.exports);
var cloneDeep = lodash_clonedeep.exports;
var __assign$1 = function() {
  __assign$1 = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$1.apply(this, arguments);
};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function render(element, pluginCloudinaryAsset, plugins, pluginState, analyticsOptions) {
  return __awaiter(this, void 0, void 0, function() {
    var response, i;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (plugins === void 0)
            return [
              2
              /*return*/
            ];
          i = 0;
          _a.label = 1;
        case 1:
          if (!(i < plugins.length)) return [3, 4];
          return [4, plugins[i](element, pluginCloudinaryAsset, pluginState, analyticsOptions, plugins)];
        case 2:
          response = _a.sent();
          if (response === "canceled") {
            return [3, 4];
          }
          _a.label = 3;
        case 3:
          i++;
          return [3, 1];
        case 4:
          if (response !== "canceled") {
            return [2, response];
          }
          return [
            2
            /*return*/
          ];
      }
    });
  });
}
var getAnalyticsOptions = function(options, features) {
  if (features === void 0) {
    features = {};
  }
  return options ? {
    trackedAnalytics: __assign$1({ sdkCode: options.sdkCode, sdkSemver: options.sdkSemver, techVersion: options.techVersion }, features)
  } : null;
};
var HtmlImageLayer = (
  /** @class */
  function() {
    function HtmlImageLayer2(element, userCloudinaryImage, plugins, baseAnalyticsOptions) {
      var _this = this;
      this.isMounted = true;
      this.imgElement = element;
      this.htmlPluginState = { cleanupCallbacks: [], pluginEventSubscription: [] };
      var pluginCloudinaryImage = cloneDeep(userCloudinaryImage);
      render(element, pluginCloudinaryImage, plugins, this.htmlPluginState, baseAnalyticsOptions).then(function(pluginResponse) {
        if (!_this.isMounted) {
          return;
        }
        _this.htmlPluginState.pluginEventSubscription.forEach(function(fn) {
          fn();
        });
        var analyticsOptions = getAnalyticsOptions(baseAnalyticsOptions, pluginResponse);
        _this.imgElement.setAttribute("src", pluginCloudinaryImage.toURL(analyticsOptions));
      });
    }
    HtmlImageLayer2.prototype.update = function(userCloudinaryImage, plugins, baseAnalyticsOptions) {
      var _this = this;
      var pluginCloudinaryImage = cloneDeep(userCloudinaryImage);
      render(this.imgElement, pluginCloudinaryImage, plugins, this.htmlPluginState).then(function(pluginResponse) {
        if (!_this.isMounted) {
          return;
        }
        var featuredAnalyticsOptions = getAnalyticsOptions(baseAnalyticsOptions, pluginResponse);
        _this.imgElement.setAttribute("src", pluginCloudinaryImage.toURL(featuredAnalyticsOptions));
      });
    };
    HtmlImageLayer2.prototype.unmount = function() {
      this.isMounted = false;
    };
    return HtmlImageLayer2;
  }()
);
var QualifierValue = class {
  /**
   *
   * @param {QualifierValue | QualifierValue[] | any[] | string | number}qualifierValue
   */
  constructor(qualifierValue) {
    this.values = [];
    this.delimiter = ":";
    if (this.hasValue(qualifierValue)) {
      this.addValue(qualifierValue);
    }
  }
  /**
   * @description Joins the provided values with the provided delimiter
   */
  toString() {
    return this.values.join(this.delimiter);
  }
  /**
   * @description Checks if the provided argument has a value
   * @param {any} v
   * @private
   * @return {boolean}
   */
  hasValue(v) {
    return typeof v !== "undefined" && v !== null && v !== "";
  }
  /**
   * @desc Adds a value for the this qualifier instance
   * @param {any} value
   * @return {this}
   */
  addValue(value) {
    if (Array.isArray(value)) {
      this.values = this.values.concat(value);
    } else {
      this.values.push(value);
    }
    this.values = this.values.filter((v) => this.hasValue(v));
    return this;
  }
  /**
   * @description Sets the delimiter for this instance
   * @param delimiter
   */
  setDelimiter(delimiter) {
    this.delimiter = delimiter;
    return this;
  }
};
var UnsupportedError = class extends Error {
  constructor(message = "Unsupported") {
    super(message);
  }
};
function createUnsupportedError(message) {
  return new UnsupportedError(message);
}
function qualifierToJson() {
  return this._qualifierModel || { error: createUnsupportedError(`unsupported qualifier ${this.constructor.name}`) };
}
var QualifierModel = class {
  constructor() {
    this._qualifierModel = {};
  }
  toJson() {
    return qualifierToJson.apply(this);
  }
};
var Qualifier = class extends QualifierModel {
  constructor(key, qualifierValue) {
    super();
    this.delimiter = "_";
    this.key = key;
    if (qualifierValue instanceof QualifierValue) {
      this.qualifierValue = qualifierValue;
    } else {
      this.qualifierValue = new QualifierValue();
      this.qualifierValue.addValue(qualifierValue);
    }
  }
  toString() {
    const { key, delimiter, qualifierValue } = this;
    return `${key}${delimiter}${qualifierValue.toString()}`;
  }
  addValue(value) {
    this.qualifierValue.addValue(value);
    return this;
  }
};
var FlagQualifier = class extends Qualifier {
  constructor(flagType, flagValue) {
    let qualifierValue;
    if (flagValue) {
      qualifierValue = new QualifierValue([flagType, `${flagValue}`]).setDelimiter(":");
    } else {
      qualifierValue = flagType;
    }
    super("fl", qualifierValue);
    this.flagValue = flagValue;
  }
  toString() {
    return super.toString().replace(/\./g, "%2E");
  }
  getFlagValue() {
    return this.flagValue;
  }
};
function mapToSortedArray(map, flags) {
  const array = Array.from(map.entries());
  flags.forEach((flag) => {
    array.push(["fl", flag]);
  });
  return array.sort().map((v) => v[1]);
}
function actionToJson() {
  var _a, _b, _c;
  const actionModelIsNotEmpty = this._actionModel && Object.keys(this._actionModel).length;
  const sourceTransformationError = (_c = (_b = (_a = this._actionModel) === null || _a === void 0 ? void 0 : _a.source) === null || _b === void 0 ? void 0 : _b.transformation) === null || _c === void 0 ? void 0 : _c.error;
  if (sourceTransformationError && sourceTransformationError instanceof Error) {
    return { error: sourceTransformationError };
  }
  if (actionModelIsNotEmpty) {
    return this._actionModel;
  }
  return { error: createUnsupportedError(`unsupported action ${this.constructor.name}`) };
}
var ActionModel = class {
  constructor() {
    this._actionModel = {};
  }
  toJson() {
    return actionToJson.apply(this);
  }
};
var Action = class extends ActionModel {
  constructor() {
    super(...arguments);
    this.qualifiers = /* @__PURE__ */ new Map();
    this.flags = [];
    this.delimiter = ",";
    this.actionTag = "";
  }
  prepareQualifiers() {
  }
  /**
   * @description Returns the custom name tag that was given to this action
   * @return {string}
   */
  getActionTag() {
    return this.actionTag;
  }
  /**
   * @description Sets the custom name tag for this action
   * @return {this}
   */
  setActionTag(tag) {
    this.actionTag = tag;
    return this;
  }
  /**
   * @description Calls toString() on all child qualifiers (implicitly by using .join()).
   * @return {string}
   */
  toString() {
    this.prepareQualifiers();
    return mapToSortedArray(this.qualifiers, this.flags).join(this.delimiter);
  }
  /**
   * @description Adds the parameter to the action.
   * @param {SDK.Qualifier} qualifier
   * @return {this}
   */
  addQualifier(qualifier) {
    if (typeof qualifier === "string") {
      const [key, value] = qualifier.toLowerCase().split("_");
      if (key === "fl") {
        this.flags.push(new FlagQualifier(value));
      } else {
        this.qualifiers.set(key, new Qualifier(key, value));
      }
    } else {
      this.qualifiers.set(qualifier.key, qualifier);
    }
    return this;
  }
  /**
   * @description Adds a flag to the current action.
   * @param {Qualifiers.Flag} flag
   * @return {this}
   */
  addFlag(flag) {
    if (typeof flag === "string") {
      this.flags.push(new FlagQualifier(flag));
    } else {
      if (flag instanceof FlagQualifier) {
        this.flags.push(flag);
      }
    }
    return this;
  }
  addValueToQualifier(qualifierKey, qualifierValue) {
    this.qualifiers.get(qualifierKey).addValue(qualifierValue);
    return this;
  }
};
var NamedRegion = class extends Action {
  constructor(type) {
    super();
    this.regionType = type;
    this._actionModel.regionType = type;
  }
};
var CustomRegion = class _CustomRegion extends NamedRegion {
  constructor() {
    super("custom");
  }
  /**
   * @description The x position in pixels.
   * @param {number | string} x
   */
  x(x) {
    this._actionModel.x = x;
    this.addQualifier(new Qualifier("x", x));
    return this;
  }
  /**
   * @description The y position in pixels.
   * @param {number | string} y
   */
  y(y) {
    this._actionModel.y = y;
    this.addQualifier(new Qualifier("y", y));
    return this;
  }
  /**
   * @description The width of the region in pixels.
   * @param {number | string} width
   */
  width(width) {
    this._actionModel.width = width;
    this.addQualifier(new Qualifier("w", width));
    return this;
  }
  /**
   * @description The height of the region in pixels.
   * @param {number | string} height
   */
  height(height) {
    this._actionModel.height = height;
    this.addQualifier(new Qualifier("h", height));
    return this;
  }
  static fromJson(model) {
    const customRegion = new _CustomRegion();
    if (model.width) {
      customRegion.width(model.width);
    }
    if (model.height) {
      customRegion.height(model.height);
    }
    if (model.x) {
      customRegion.x(model.x);
    }
    if (model.y) {
      customRegion.y(model.y);
    }
    return customRegion;
  }
};
function custom() {
  return new CustomRegion();
}
function faces() {
  return new NamedRegion("faces");
}
function ocr$1() {
  return new NamedRegion("ocr_text");
}
var BlurAction = class extends Action {
  constructor(strength) {
    super();
    this._actionModel = {};
    this._strength = strength;
    this._actionModel.actionType = "blur";
    this._actionModel.strength = strength;
  }
  /**
   * @description Specifies the region to blur.
   * @param {NamedRegion} blurRegion
   */
  region(blurRegion) {
    this._region = blurRegion;
    this._actionModel.region = blurRegion.toJson();
    return this;
  }
  /**
   * @description Sets the strength of the blur effect.
   * @param {number | string} strength
   */
  strength(strength) {
    this._strength = strength;
    this._actionModel.strength = strength;
    return this;
  }
  prepareQualifiers() {
    const strength = this._strength ? `:${this._strength}` : "";
    if ("_region" in this) {
      const qualifiers = this._region.qualifiers;
      qualifiers.forEach((q) => this.addQualifier(q));
      if (this._region.regionType === "custom") {
        this.addQualifier(new Qualifier("e", `blur_region${strength}`));
      }
      if (this._region.regionType === "ocr_text") {
        this.addQualifier(new Qualifier("e", `blur_region${strength}`));
        this.addQualifier(new Qualifier("g", `ocr_text`));
      }
      if (this._region.regionType === "faces") {
        this.addQualifier(new Qualifier("e", `blur_faces${strength}`));
      }
    } else {
      this.addQualifier(new Qualifier("e", `blur${strength}`));
    }
  }
  static fromJson(actionModel) {
    const { strength, region } = actionModel;
    const result = new this(strength);
    strength && result.strength(strength);
    if (region && region.regionType === "faces") {
      result.region(faces());
    }
    if (region && region.regionType === "ocr_text") {
      result.region(ocr$1());
    }
    if (region && region.regionType === "custom") {
      result.region(CustomRegion.fromJson(region));
    }
    return result;
  }
};
function objectFlip(obj) {
  const result = {};
  Object.keys(obj).forEach((key) => {
    result[obj[key]] = key;
  });
  return result;
}
var ACTION_TYPE_TO_CROP_MODE_MAP = {
  limitFit: "limit",
  limitFill: "lfill",
  minimumFit: "mfit",
  thumbnail: "thumb",
  limitPad: "lpad",
  minimumPad: "mpad",
  autoPad: "auto_pad"
};
var ACTION_TYPE_TO_DELIVERY_MODE_MAP = {
  colorSpace: "cs",
  dpr: "dpr",
  density: "dn",
  defaultImage: "d",
  format: "f",
  quality: "q"
};
var ACTION_TYPE_TO_EFFECT_MODE_MAP = {
  redEye: "redeye",
  advancedRedEye: "adv_redeye",
  oilPaint: "oil_paint",
  unsharpMask: "unsharp_mask",
  makeTransparent: "make_transparent",
  generativeRestore: "gen_restore",
  upscale: "upscale"
};
var ACTION_TYPE_TO_QUALITY_MODE_MAP = {
  autoBest: "auto:best",
  autoEco: "auto:eco",
  autoGood: "auto:good",
  autoLow: "auto:low",
  jpegminiHigh: "jpegmini:1",
  jpegminiMedium: "jpegmini:2",
  jpegminiBest: "jpegmini:0"
};
var ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP = {
  fullHd: "full_hd",
  fullHdWifi: "full_hd_wifi",
  fullHdLean: "full_hd_lean",
  hdLean: "hd_lean"
};
var CHROMA_VALUE_TO_CHROMA_MODEL_ENUM = {
  444: "CHROMA_444",
  420: "CHROMA_420"
};
var COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP = {
  "noCmyk": "no_cmyk",
  "keepCmyk": "keep_cmyk",
  "tinySrgb": "tinysrgb",
  "srgbTrueColor": "srgb:truecolor"
};
var CHROMA_MODEL_ENUM_TO_CHROMA_VALUE = objectFlip(CHROMA_VALUE_TO_CHROMA_MODEL_ENUM);
objectFlip(COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP);
var CROP_MODE_TO_ACTION_TYPE_MAP = objectFlip(ACTION_TYPE_TO_CROP_MODE_MAP);
var DELIVERY_MODE_TO_ACTION_TYPE_MAP = objectFlip(ACTION_TYPE_TO_DELIVERY_MODE_MAP);
var EFFECT_MODE_TO_ACTION_TYPE_MAP = objectFlip(ACTION_TYPE_TO_EFFECT_MODE_MAP);
objectFlip(ACTION_TYPE_TO_QUALITY_MODE_MAP);
objectFlip(ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP);
var SimpleEffectAction = class extends Action {
  constructor(effectType, level) {
    super();
    this._actionModel = {};
    this._actionModel.actionType = EFFECT_MODE_TO_ACTION_TYPE_MAP[effectType] || effectType;
    const qualifierEffect = this.createEffectQualifier(effectType, level);
    this.addQualifier(qualifierEffect);
  }
  createEffectQualifier(effectType, level) {
    let qualifierValue;
    if (level) {
      qualifierValue = new QualifierValue([effectType, `${level}`]).setDelimiter(":");
    } else {
      qualifierValue = new QualifierValue(effectType);
    }
    return new Qualifier("e", qualifierValue);
  }
  static fromJson(actionModel) {
    const { actionType, level, strength } = actionModel;
    const effectType = ACTION_TYPE_TO_EFFECT_MODE_MAP[actionType] || actionType;
    const result = new this(effectType, level ? level : strength);
    return result;
  }
};
var LeveledEffectAction = class extends SimpleEffectAction {
  constructor(effectType, level) {
    super(effectType, level);
    this.LEVEL_NAME = "level";
    this._actionModel = {};
    this.effectType = effectType;
    this._actionModel.actionType = EFFECT_MODE_TO_ACTION_TYPE_MAP[effectType] || effectType;
    if (level) {
      this.setLevel(level);
    }
  }
  /**
   *
   * @description Sets the effect level for the action
   * @param {string | number} level - The strength of the effect
   * @protected
   */
  setLevel(level) {
    this._actionModel[this.LEVEL_NAME] = level;
    const qualifierEffect = this.createEffectQualifier(this.effectType, level);
    this.addQualifier(qualifierEffect);
    return this;
  }
};
function prepareColor(color2) {
  if (color2) {
    return color2.match(/^#/) ? `rgb:${color2.substr(1)}` : color2;
  } else {
    return color2;
  }
}
var VectorizeEffectAction = class extends Action {
  constructor() {
    super();
    this._actionModel = {};
    this._actionModel.actionType = "vectorize";
  }
  /**
   * @description The number of colors. (Range: 2 to 30, Server default: 10)
   * @param {number | string} num
   * @return {this}
   */
  numOfColors(num) {
    this._actionModel.numOfColors = num;
    this._numOfColors = num;
    return this;
  }
  /**
   * @description The level of detail. Specify either a percentage of the original image (Range: 0.0 to 1.0) or an absolute number of pixels (Range: 0 to 1000). (Server default: 300)
   * @param {number | string} num
   * @return {this}
   */
  detailsLevel(num) {
    this._actionModel.detailLevel = num;
    this._detailsLevel = num;
    return this;
  }
  /**
   * @description The size of speckles to suppress. Specify either a percentage of the original image (Range: 0.0 to 1.0) or an absolute number of pixels (Range: 0 to 100, Server default: 2)
   * @param {number | string} num
   * @return {this}
   */
  despeckleLevel(num) {
    this._actionModel.despeckleLevel = num;
    this._despeckleLevel = num;
    return this;
  }
  /**
   * @description The corner threshold. Specify 100 for no smoothing (polygon corners), 0 for completely smooth corners. (Range: 0 to 100, Default: 25)
   * @param {number | string} num
   * @return {this}
   */
  cornersLevel(num) {
    this._actionModel.cornersLevel = num;
    this._cornersLevel = num;
    return this;
  }
  /**
   * @description The optimization value. Specify 100 for least optimization and the largest file. (Range: 0 to 100, Server default: 100).
   * @param {number} num
   * @return {this}
   */
  paths(num) {
    this._actionModel.paths = num;
    this._paths = num;
    return this;
  }
  prepareQualifiers() {
    let str = "vectorize";
    if (this._numOfColors) {
      str += `:${new QualifierValue(`colors:${this._numOfColors}`).toString()}`;
    }
    if (this._detailsLevel) {
      str += `:${new QualifierValue(`detail:${this._detailsLevel}`).toString()}`;
    }
    if (this._despeckleLevel) {
      str += `:${new QualifierValue(`despeckle:${this._despeckleLevel}`).toString()}`;
    }
    if (this._paths) {
      str += `:${new QualifierValue(`paths:${this._paths}`).toString()}`;
    }
    if (this._cornersLevel) {
      str += `:${new QualifierValue(`corners:${this._cornersLevel}`).toString()}`;
    }
    this.addQualifier(new Qualifier("e", str));
  }
  static fromJson(actionModel) {
    const { actionType, paths, cornersLevel, despeckleLevel, detailLevel, numOfColors } = actionModel;
    const result = new this();
    paths && result.paths(paths);
    cornersLevel && result.cornersLevel(cornersLevel);
    despeckleLevel && result.despeckleLevel(despeckleLevel);
    detailLevel && result.detailsLevel(detailLevel);
    numOfColors && result.numOfColors(numOfColors);
    return result;
  }
};
var EffectActionWithLevel = class extends LeveledEffectAction {
  level(value) {
    this._actionModel.level = value;
    return this.setLevel(value);
  }
};
var AssistColorBlindEffectAction = class extends Action {
  constructor() {
    super();
    this._actionModel = {};
    this._actionModel.actionType = "assistColorblind";
    this.addQualifier(new Qualifier("e", new QualifierValue("assist_colorblind")));
  }
  /**
   * @description Replaces problematic colors with colors that are easier to differentiate.
   * @return {this}
   */
  xray() {
    this._actionModel.type = "xray";
    return this.addQualifier(new Qualifier("e", new QualifierValue(["assist_colorblind", "xray"]).setDelimiter(":")));
  }
  /**
   * @description Applies stripes of the specified intensity to help people with common color blind conditions to differentiate between colors that are similar for them.
   * @param {number | string} strength The intensity of the stripes. (Range: 1 to 100, Server default: 10)
   * @return {this}
   */
  stripesStrength(strength) {
    this._actionModel.type = "stripes";
    this._actionModel.stripesStrength = strength;
    return this.addQualifier(new Qualifier("e", new QualifierValue(["assist_colorblind", strength]).setDelimiter(":")));
  }
  static fromJson(actionModel) {
    const { actionType, type, stripesStrength } = actionModel;
    const result = new this();
    if (type === "xray") {
      result.xray();
    }
    if (type === "stripes") {
      stripesStrength && result.stripesStrength(stripesStrength);
    }
    return result;
  }
};
var ColorizeEffectAction = class extends EffectActionWithLevel {
  /**
   * @description The color to use for colorization. Specify HTML name or RGB hex code. (Server default: gray)
   * @param {string} color HTML name(red, green, etc.) or RGB hex code. (Server default: gray)
   * @return {this}
   */
  color(color2) {
    this._actionModel.color = color2;
    return this.addQualifier(new Qualifier("co", new QualifierValue(prepareColor(color2))));
  }
  static fromJson(actionModel) {
    const { actionType, level, color: color2 } = actionModel;
    const result = new this(actionType, level);
    color2 && result.color(color2);
    return result;
  }
};
var Pixelate = class extends Action {
  constructor(squareSize) {
    super();
    this._actionModel = {};
    this._squareSize = squareSize;
    this._actionModel.actionType = "pixelate";
    this._actionModel.squareSize = squareSize;
  }
  /**
   * @description Specifies the region to piexlate.
   * @param {NamedRegion} pixelateRegion
   */
  region(pixelateRegion) {
    this._region = pixelateRegion;
    this._actionModel.region = { regionType: this._region.regionType };
    return this;
  }
  /**
   * @description Sets the squareSize of the pixelate effect.
   * @param {number | string} squareSize
   */
  squareSize(squareSize) {
    this._squareSize = squareSize;
    this._actionModel.squareSize = squareSize;
    return this;
  }
  prepareQualifiers() {
    const str = this._squareSize ? `:${this._squareSize}` : "";
    if ("_region" in this) {
      const qualifiers = this._region.qualifiers;
      qualifiers.forEach((q) => this.addQualifier(q));
      if (this._region.regionType === "custom") {
        this.addQualifier(new Qualifier("e", `pixelate_region${str}`));
      }
      if (this._region.regionType === "ocr_text") {
        this.addQualifier(new Qualifier("e", `pixelate_region${str}`));
        this.addQualifier(new Qualifier("g", `ocr_text`));
      }
      if (this._region.regionType === "faces") {
        this.addQualifier(new Qualifier("e", `pixelate_faces${str}`));
      }
    } else {
      this.addQualifier(new Qualifier("e", `pixelate${str}`));
    }
  }
  static fromJson(actionModel) {
    const { region, squareSize } = actionModel;
    const result = new this(squareSize);
    squareSize && result.squareSize(squareSize);
    if (region && region.regionType === "faces") {
      result.region(faces());
    }
    if (region && region.regionType === "custom") {
      result.region(custom());
    }
    return result;
  }
};
var encodePromptComponent = (prompt) => composeStringOperations(encodeURIComponent, replaceMissingChars, decodeSpaces)(prompt);
var charsMissingFromUrlEncode = /[!'()*~_.-]/g;
var missingCharsMap = {
  "!": "%21",
  "'": "%27",
  "(": "%28",
  ")": "%29",
  "*": "%2A",
  "~": "%7E",
  _: "%5F",
  ".": "%2E",
  "-": "%2D"
};
var replaceMissingChars = (str) => {
  return str.replace(charsMissingFromUrlEncode, (match) => {
    var _a;
    return (_a = missingCharsMap[match]) !== null && _a !== void 0 ? _a : match;
  });
};
var decodeSpaces = (str) => str.replace(/%20/g, " ");
var composeStringOperations = (...fns) => (arg) => fns.reduce((acc, fn) => fn(acc), arg);
function blur(blurLevel) {
  return new BlurAction(blurLevel);
}
function grayscale() {
  return new SimpleEffectAction("grayscale");
}
function colorize(colorizeLevel) {
  return new ColorizeEffectAction("colorize", colorizeLevel);
}
function vectorize() {
  return new VectorizeEffectAction();
}
function assistColorBlind() {
  return new AssistColorBlindEffectAction();
}
function pixelate(squareSize) {
  return new Pixelate(squareSize);
}
var BackgroundColor = class extends Action {
  constructor(color2) {
    super();
    this._actionModel = {};
    this.addQualifier(new Qualifier("b", new QualifierValue(prepareColor(color2)).setDelimiter("_")));
    this._actionModel.color = color2;
    this._actionModel.actionType = "backgroundColor";
  }
  static fromJson(actionModel) {
    const { color: color2 } = actionModel;
    const result = new this(color2);
    return result;
  }
};
var RawAction = class {
  constructor(raw) {
    this.raw = raw;
  }
  toString() {
    return this.raw;
  }
  toJson() {
    return { error: createUnsupportedError(`unsupported action ${this.constructor.name}`) };
  }
};
function isErrorObject(obj) {
  const errorObj = obj;
  return "error" in errorObj && !!errorObj.error;
}
function ignoreInitialAspectRatio() {
  return new FlagQualifier("ignore_aspect_ratio");
}
function lossy() {
  return new FlagQualifier("lossy");
}
function preserveTransparency() {
  return new FlagQualifier("preserve_transparency");
}
function progressive(mode) {
  return new FlagQualifier("progressive", mode);
}
function regionRelative() {
  return new FlagQualifier("region_relative");
}
function relative() {
  return new FlagQualifier("relative");
}
var FormatQualifier = class extends QualifierValue {
  constructor(val) {
    super(val);
    this.val = val;
  }
  getValue() {
    return this.val;
  }
};
var DeliveryAction = class extends Action {
  /**
   * @param {string} deliveryKey A generic Delivery Action Key (such as q, f, dn, etc.)
   * @param {string} deliveryType A Format Qualifiers for the action, such as Quality.auto()
   * @param {string} modelProperty internal model property of the action, for example quality uses `level` while dpr uses `density`
   * @see Visit {@link Actions.Delivery|Delivery} for an example
   */
  constructor(deliveryKey, deliveryType, modelProperty) {
    super();
    this._actionModel = {};
    let deliveryTypeValue;
    if (deliveryType instanceof FormatQualifier) {
      deliveryTypeValue = deliveryType.getValue();
    } else {
      deliveryTypeValue = deliveryType;
    }
    this._actionModel.actionType = DELIVERY_MODE_TO_ACTION_TYPE_MAP[deliveryKey];
    this._actionModel[modelProperty] = deliveryTypeValue;
    this.addQualifier(new Qualifier(deliveryKey, deliveryType));
  }
};
var ProgressiveQualifier = class extends FlagQualifier {
  constructor(mode) {
    super("progressive", mode);
  }
};
var DeliveryFormatAction = class extends DeliveryAction {
  constructor(deliveryKey, deliveryType) {
    super(deliveryKey, deliveryType, "formatType");
  }
  /**
   * @description Uses lossy compression when delivering animated GIF files.
   * @return {this}
   */
  lossy() {
    this._actionModel.lossy = true;
    this.addFlag(lossy());
    return this;
  }
  /**
   * @description Uses progressive compression when delivering JPG file format.
   * @return {this}
   */
  progressive(mode) {
    if (mode instanceof ProgressiveQualifier) {
      this._actionModel.progressive = { mode: mode.getFlagValue() };
      this.addFlag(mode);
    } else {
      this._actionModel.progressive = { mode };
      this.addFlag(progressive(mode));
    }
    return this;
  }
  /**
   * @description Ensures that images with a transparency channel are delivered in PNG format.
   */
  preserveTransparency() {
    this._actionModel.preserveTransparency = true;
    this.addFlag(preserveTransparency());
    return this;
  }
  static fromJson(actionModel) {
    const { formatType, lossy: lossy2, progressive: progressive2, preserveTransparency: preserveTransparency2 } = actionModel;
    let result;
    if (formatType) {
      result = new this("f", formatType);
    } else {
      result = new this("f");
    }
    if (progressive2) {
      if (progressive2.mode) {
        result.progressive(progressive2.mode);
      } else {
        result.progressive();
      }
    }
    lossy2 && result.lossy();
    preserveTransparency2 && result.preserveTransparency();
    return result;
  }
};
var Transformation = class _Transformation {
  constructor() {
    this.actions = [];
  }
  /**
   * @param {SDK.Action | string} action
   * @return {this}
   */
  addAction(action) {
    let actionToAdd;
    if (typeof action === "string") {
      if (action.indexOf("/") >= 0) {
        throw "addAction cannot accept a string with a forward slash in it - /, use .addTransformation() instead";
      } else {
        actionToAdd = new RawAction(action);
      }
    } else {
      actionToAdd = action;
    }
    this.actions.push(actionToAdd);
    return this;
  }
  /**
   * @description Allows the injection of a raw transformation as a string into the transformation, or a Transformation instance that was previously created
   * @param {string | SDK.Transformation} tx
   * @example
   * import {Transformation} from "@cloudinary/url-gen";
   *
   * const transformation = new Transformation();
   * transformation.addTransformation('w_100/w_200/w_300');
   * @return {this}
   */
  addTransformation(tx) {
    if (tx instanceof _Transformation) {
      this.actions = this.actions.concat(tx.actions);
    } else {
      this.actions.push(new RawAction(tx));
    }
    return this;
  }
  /**
   * @return {string}
   */
  toString() {
    return this.actions.map((action) => {
      return action.toString();
    }).filter((a) => a).join("/");
  }
  /**
   * @description Delivers an animated GIF.
   * @param {AnimatedAction} animatedAction
   * @return {this}
   */
  animated(animatedAction) {
    return this.addAction(animatedAction);
  }
  /**
   * @description Adds a border around the image.
   * @param {Border} borderAction
   * @return {this}
   */
  border(borderAction) {
    return this.addAction(borderAction);
  }
  /**
   * @description Adjusts the shape of the delivered image. </br>
   * <b>Learn more:</b> {@link https://cloudinary.com/documentation/effects_and_artistic_enhancements#distort|Shape changes and distortion effects}
   * @param {IReshape} reshapeAction
   * @return {this}
   */
  reshape(reshapeAction) {
    return this.addAction(reshapeAction);
  }
  /**
   * @description Resize the asset using provided resize action
   * @param {ResizeSimpleAction} resizeAction
   * @return {this}
   */
  resize(resizeAction) {
    return this.addAction(resizeAction);
  }
  /**
   * @desc An alias to Action Delivery.quality
   * @param {string|number} quality
   * @return {this}
   */
  quality(quality2) {
    this.addAction(new DeliveryFormatAction("q", quality2));
    return this;
  }
  /**
   * @desc An alias to Action Delivery.format
   * @param {string} format
   * @return {this}
   */
  format(format2) {
    this.addAction(new DeliveryFormatAction("f", format2));
    return this;
  }
  /**
   * @description Rounds the specified corners of an image.
   * @param roundCornersAction
   * @return {this}
   */
  roundCorners(roundCornersAction) {
    return this.addAction(roundCornersAction);
  }
  /**
   * @description Adds an overlay over the base image.
   * @param {LayerAction} overlayAction
   * @return {this}
   */
  overlay(overlayAction) {
    return this.addAction(overlayAction);
  }
  /**
   * @description Adds an underlay under the base image.
   * @param {LayerAction} underlayAction
   * @return {this}
   */
  underlay(underlayAction) {
    underlayAction.setLayerType("u");
    return this.addAction(underlayAction);
  }
  /**
   * @description Defines an new user variable.
   * @param {VariableAction} variableAction
   * @return {this}
   */
  addVariable(variableAction) {
    return this.addAction(variableAction);
  }
  /**
   * @description Specifies a condition to be met before applying a transformation.
   * @param {ConditionalAction} conditionAction
   * @return {this}
   */
  conditional(conditionAction) {
    return this.addAction(conditionAction);
  }
  /**
   * @description Applies a filter or an effect on an asset.
   * @param {SimpleEffectAction} effectAction
   * @return {this}
   */
  effect(effectAction) {
    return this.addAction(effectAction);
  }
  /**
   * @description Applies adjustment effect on an asset.
   * @param action
   * @return {this}
   */
  adjust(action) {
    return this.addAction(action);
  }
  /**
   * @description Rotates the asset by the given angle.
   * @param {RotateAction} rotateAction
   * @return {this}
   */
  rotate(rotateAction) {
    return this.addAction(rotateAction);
  }
  /**
   * @description Applies a pre-defined named transformation of the given name.
   * @param {NamedTransformation} namedTransformation
   * @return {this}
   */
  namedTransformation(namedTransformation) {
    return this.addAction(namedTransformation);
  }
  /**
   * @description Applies delivery action.
   * @param deliveryAction
   * @return {this}
   */
  delivery(deliveryAction) {
    return this.addAction(deliveryAction);
  }
  /**
   * @description Sets the color of the background.
   * @param {Qualifiers.Color} color
   * @return {this}
   */
  backgroundColor(color2) {
    return this.addAction(new BackgroundColor(color2));
  }
  /**
   * @description Adds a layer in a Photoshop document.
   * @param action
   * @return {this}
   */
  psdTools(action) {
    return this.addAction(action);
  }
  /**
   * @description Extracts an image or a page using an index, a range, or a name from a layered media asset.
   * @param action
   * @return {this}
   */
  extract(action) {
    return this.addAction(action);
  }
  /**
   * @description Adds a flag as a separate action.
   * @param {Qualifiers.Flag | string} flagQualifier
   * @return {this}
   */
  addFlag(flagQualifier) {
    const action = new Action();
    let flagToAdd = flagQualifier;
    if (typeof flagQualifier === "string") {
      flagToAdd = new FlagQualifier(flagQualifier);
    }
    action.addQualifier(flagToAdd);
    return this.addAction(action);
  }
  /**
   * @description Inject a custom function into the image transformation pipeline.
   * @return {this}
   */
  customFunction(customFunction) {
    return this.addAction(customFunction);
  }
  /**
   * Transcodes the video (or audio) to another format.
   * @param {Action} action
   * @return {this}
   */
  transcode(action) {
    return this.addAction(action);
  }
  /**
   * Applies the specified video edit action.
   *
   * @param {videoEditType} action
   * @return {this}
   */
  videoEdit(action) {
    return this.addAction(action);
  }
  toJson() {
    const actions = [];
    for (const action of this.actions) {
      const json = action.toJson();
      if (isErrorObject(json)) {
        return json;
      }
      actions.push(json);
    }
    return { actions };
  }
};
function toFloatAsString(value) {
  const returnValue = value.toString();
  if (returnValue.match(/[A-Z]/gi)) {
    return returnValue;
  }
  if (returnValue.length > 1 && returnValue[0] === "0") {
    return returnValue;
  }
  const isNumberLike = !isNaN(parseFloat(returnValue)) && returnValue.indexOf(":") === -1;
  if (isNumberLike && returnValue.indexOf(".") === -1) {
    return `${returnValue}.0`;
  } else {
    return returnValue;
  }
}
var AspectRatioQualifierValue = class extends QualifierValue {
};
var ResizeSimpleAction = class extends Action {
  /**
   * @param {string} cropType
   * @param {number | string} cropWidth The required width of a transformed asset.
   * @param {number | string} cropHeight The required height of a transformed asset.
   */
  constructor(cropType, cropWidth, cropHeight) {
    super();
    this._actionModel = { dimensions: {} };
    this._actionModel.actionType = CROP_MODE_TO_ACTION_TYPE_MAP[cropType] || cropType;
    this.addQualifier(new Qualifier("c", cropType));
    cropWidth && this.width(cropWidth);
    cropHeight && this.height(cropHeight);
  }
  /**
   * @description Sets the height of the resize
   * @param {string | number} x The height in pixels (if an integer is specified) or as a percentage (if a float is specified).
   */
  height(x) {
    this._actionModel.dimensions.height = x;
    return this.addQualifier(new Qualifier("h", x));
  }
  /**
   * @description Sets the width of the resize
   * @param {string | number} x The width in pixels (if an integer is specified) or as a percentage (if a float is specified).
   */
  width(x) {
    this._actionModel.dimensions.width = x;
    return this.addQualifier(new Qualifier("w", x));
  }
  /**
   * @description Sets the aspect ratio of the asset.
   * For a list of supported types see {@link Qualifiers.AspectRatio|
    * AspectRatio values}
   * @param {AspectRatioType|number|string} ratio The new aspect ratio, specified as a percentage or ratio.
   * @return {this}
   */
  aspectRatio(ratio) {
    if (ratio instanceof AspectRatioQualifierValue) {
      this._actionModel.dimensions.aspectRatio = `${ratio}`;
      return this.addQualifier(new Qualifier("ar", ratio));
    }
    if (typeof ratio === "number" || typeof ratio === "string") {
      this._actionModel.dimensions.aspectRatio = toFloatAsString(ratio);
      return this.addQualifier(new Qualifier("ar", toFloatAsString(ratio)));
    }
    if (ratio instanceof FlagQualifier) {
      this._actionModel.dimensions.aspectRatio = `${ratio.qualifierValue}`;
      return this.addFlag(ratio);
    }
  }
  /**
   * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the containing image instead of the added layer.
   * @return {this}
   */
  relative() {
    this._actionModel.relative = true;
    return this.addFlag(relative());
  }
  /**
   * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the overlaid region
   * @return {this}
   */
  regionRelative() {
    this._actionModel.regionRelative = true;
    return this.addFlag(regionRelative());
  }
  static fromJson(actionModel) {
    const { actionType, dimensions, relative: relative2, regionRelative: regionRelative2 } = actionModel;
    const { aspectRatio, width, height } = dimensions;
    const cropMode = ACTION_TYPE_TO_CROP_MODE_MAP[actionType] || actionType;
    const result = new this(cropMode, width, height);
    aspectRatio && result.aspectRatio(aspectRatio === "ignore_aspect_ratio" ? ignoreInitialAspectRatio() : aspectRatio);
    relative2 && result.relative();
    regionRelative2 && result.regionRelative();
    return result;
  }
};
var GravityQualifier = class extends Qualifier {
  /**
   * @param value, an array containing (GravityObject | AutoGravity | string) or a string;
   */
  constructor(value) {
    super("g", new QualifierValue(value));
  }
};
var AutoGravity = class extends GravityQualifier {
  constructor() {
    super("auto");
  }
  /**
   * @description Autofocuses on objects, allowing their priority within the algorithm to be configured.
   * @param {AutoFocus} AutoFocusObjects
   */
  autoFocus(...AutoFocusObjects) {
    this.addValue(AutoFocusObjects);
    return this;
  }
};
var FocusOnGravity = class extends GravityQualifier {
  constructor(FocusOnObjects) {
    super(FocusOnObjects);
  }
  /**
   * @description Specifies the gravity to use if none of the other gravity objects are found.
   * @param {Qualifiers.Gravity.AutoGravity} val
   */
  fallbackGravity(val) {
    this.addValue(val.qualifierValue);
    return this;
  }
};
var CompassGravity = class extends GravityQualifier {
  constructor(dir) {
    super(dir);
  }
};
function compass(direction) {
  return new CompassGravity(direction);
}
function focusOn(...args) {
  const res = [...args];
  return new FocusOnGravity(res);
}
function autoGravity() {
  return new AutoGravity();
}
var FocusOnValue = class extends QualifierValue {
  constructor(name) {
    super();
    this.name = name;
  }
  toString() {
    return this.name;
  }
};
function ocr() {
  return new FocusOnValue("ocr_text");
}
function isIAutoGravityString(gravity) {
  return gravity && `${gravity}`.split(":")[0] === "auto";
}
function isCompassGravity(gravity) {
  const gravityValue = getGravityValue(gravity);
  return ["north", "center", "east", "west", "south", "north_west", "south_east", "south_west", "north_east"].includes(gravityValue);
}
function getGravityValue(gravity) {
  return `${gravity}`.replace("g_", "");
}
function createCompassGravityModel(gravity) {
  return {
    compass: getGravityValue(gravity),
    gravityType: "direction"
  };
}
function isOcrGravity(gravity) {
  return getGravityValue(gravity) === "ocr_text";
}
function createOcrGravityModel() {
  return {
    gravityType: "ocr"
  };
}
function isAutoGravity(gravity) {
  return `${gravity.qualifierValue}`.split(":")[0] === "auto";
}
function createIAutoFocusObject(gravity) {
  const gravityString = gravity.toString();
  const values = gravityString.split("_");
  const result = {
    object: values[0]
  };
  if (values.length > 1) {
    if (values[1] === "avoid") {
      result.avoid = true;
    } else {
      result.weight = +values[1];
    }
  }
  return result;
}
function createAutoGravityModel(gravity) {
  let values;
  const gravityQualifier = gravity === "auto" ? new AutoGravity() : gravity;
  if (`${gravity}`.startsWith("auto:")) {
    values = `${gravity}`.split(":").filter((v) => v !== "auto");
  } else {
    values = gravityQualifier.qualifierValue.values.filter((v) => v !== "auto");
  }
  const autoFocus = values.map(createIAutoFocusObject);
  return {
    gravityType: "auto",
    autoFocus
  };
}
function createFocusOnGravityModel(gravity) {
  const hasAutoGravity = `${gravity}`.split(":").includes("auto");
  const values = gravity.qualifierValue.values;
  const focusOnValues = hasAutoGravity ? values.slice(0, values.length - 1) : values;
  const result = {
    gravityType: "object",
    focusOnObjects: focusOnValues.map((v) => `${v}`)
  };
  if (hasAutoGravity) {
    const autoFocusObjects = values[values.length - 1].values.slice(1);
    const autoGravityInstance = autoGravity().autoFocus(...autoFocusObjects);
    result.fallbackGravity = createAutoGravityModel(autoGravityInstance);
  }
  return result;
}
function createFocusOnGravity(gravity) {
  const values = gravity.split(":");
  const focusOnValues = values.map((g) => new FocusOnValue(g));
  return new FocusOnGravity(focusOnValues);
}
function createGravityModel(gravity) {
  if (isCompassGravity(gravity)) {
    return createCompassGravityModel(gravity);
  }
  if (isOcrGravity(gravity)) {
    return createOcrGravityModel();
  }
  if (isIAutoGravityString(gravity) || isAutoGravity(gravity)) {
    return createAutoGravityModel(gravity);
  }
  return createFocusOnGravityModel(typeof gravity === "string" ? createFocusOnGravity(gravity) : gravity);
}
var AutoFocus = class _AutoFocus extends QualifierValue {
  constructor(focusOn2, weight) {
    super();
    this._weight = weight;
    this.focusOn = focusOn2;
    this.shouldAvoid = false;
  }
  /**
   * @summary qualifier
   * @description Specifies the object to focus on automatically
   * Accepts an AutoFocusObject (which is just a wrapper for a FocusOn object, but with extra method: avoid, weight)
   * @param {Qualifiers.FocusOn} obj The object to focus on.
   * @param {number} weight
   */
  static focusOn(obj, weight) {
    const focusOn2 = obj instanceof FocusOnValue ? obj : new FocusOnValue(obj);
    return new _AutoFocus(focusOn2, weight);
  }
  shouldAddWeight() {
    return typeof this._weight === "number" || typeof this._weight === "string" || this.shouldAvoid;
  }
  /**
   * @summary qualifier
   * @desc Get the name of the of the object
   */
  getName() {
    return this.focusOn.name;
  }
  /**
   * @summary qualifier
   * @desc Get the weight for the object
   */
  getWeight() {
    if (this.shouldAvoid) {
      return "avoid";
    } else {
      return this._weight;
    }
  }
  /**
   * @summary qualifier
   * @desc Return the string representation of this QualifierValue
   */
  toString() {
    if (this.shouldAddWeight()) {
      return `${this.getName()}_${this.getWeight()}`;
    } else {
      return `${this.getName()}`;
    }
  }
  /**
   * @summary qualifier
   * @description Sets the importance level of the object within the automatic gravity algorithm
   * @param {numebr} w The focus weight for the object
   * @return {this}
   */
  weight(w) {
    this._weight = w;
    return this;
  }
  /**
   * @summary qualifier
   * @description Attempts to avoid the detected object in the image
   * @return {this}
   */
  avoid() {
    this.shouldAvoid = true;
    return this;
  }
};
var CompassQualifier = class extends QualifierValue {
  constructor(val) {
    super();
    this.val = val;
  }
  toString() {
    return this.val;
  }
};
function isCompassGravityModel(gravityModel) {
  return gravityModel.gravityType === "direction";
}
function isOcrGravityModel(gravityModel) {
  return gravityModel.gravityType === "ocr";
}
function isAutoGravityModel(gravityModel) {
  return gravityModel.gravityType === "auto";
}
function createAutoFocusFromModel(autoGravityObjectModel) {
  const { object, weight, avoid } = autoGravityObjectModel;
  const autoFocus = new AutoFocus(new FocusOnValue(object));
  (weight || weight === 0) && autoFocus.weight(weight);
  avoid && autoFocus.avoid();
  return autoFocus;
}
function createAutoGravityFromModel(gravityModel) {
  const autoFocusModel = gravityModel.autoFocus || [];
  const autoFocus = autoFocusModel.map(createAutoFocusFromModel);
  return autoGravity().autoFocus(...autoFocus);
}
function createFocusOnGravityFromModel(gravityModel) {
  const focusOnObjects = (gravityModel.focusOnObjects || []).map((str) => new FocusOnValue(str));
  const result = focusOn(...focusOnObjects);
  if (gravityModel.fallbackGravity) {
    const autoGravity2 = createAutoGravityFromModel(gravityModel.fallbackGravity);
    result.fallbackGravity(autoGravity2);
  }
  return result;
}
function createGravityFromModel(gravityModel) {
  if (isCompassGravityModel(gravityModel)) {
    return new CompassGravity(new CompassQualifier(gravityModel.compass));
  }
  if (isOcrGravityModel(gravityModel)) {
    return focusOn(ocr());
  }
  if (isAutoGravityModel(gravityModel)) {
    return createAutoGravityFromModel(gravityModel);
  }
  return createFocusOnGravityFromModel(gravityModel);
}
var ResizeAdvancedAction = class extends ResizeSimpleAction {
  /**
   * @description Which part of the original image to include.
   * @param {Qualifiers.Gravity} gravity
   */
  gravity(gravity) {
    this._actionModel.gravity = createGravityModel(gravity);
    const gravityQualifier = typeof gravity === "string" ? new Qualifier("g", gravity) : gravity;
    return this.addQualifier(gravityQualifier);
  }
  static fromJson(actionModel) {
    const result = super.fromJson.apply(this, [actionModel]);
    if (actionModel.gravity) {
      result.gravity(createGravityFromModel(actionModel.gravity));
    }
    return result;
  }
};
var BackgroundQualifier = class extends Qualifier {
  constructor(backgroundValue) {
    super("b");
    if (backgroundValue) {
      this.addValue(backgroundValue);
    }
  }
};
var DEFAULT_INTENSITY = 100;
var DEFAULT_BRIGHTNESS = 0;
var BlurredBackgroundAction = class extends BackgroundQualifier {
  /**
   * @description Sets the intensity of the blur.
   * @param {number} value - The intensity of the blur.
   */
  intensity(value) {
    this.intensityLevel = value;
    return this;
  }
  /**
   * @description Sets the brightness of the background.
   * @param {number} value - The brightness of the background.
   */
  brightness(value) {
    this.brightnessLevel = value;
    return this;
  }
  /**
   * @description
   * Stringify the qualifier
   * BackgroundQualifiers don't have a value, but instead override the toString() function
   */
  toString() {
    const intensity = this.intensityLevel !== void 0 ? `:${this.intensityLevel}` : "";
    const brightness = this.brightnessLevel !== void 0 ? this.intensityLevel !== void 0 ? `:${this.brightnessLevel}` : `:${DEFAULT_INTENSITY}:${this.brightnessLevel}` : "";
    return `b_blurred${intensity}${brightness}`;
  }
};
var BlurredBackgroundAction$1 = BlurredBackgroundAction;
var BaseCommonBackground = class extends BackgroundQualifier {
  constructor() {
    super();
    this._palette = [];
  }
  /**
   * @description Selects the strongest contrasting color to use for padding.
   * @return {this}
   */
  contrast() {
    this._contrast = true;
    return this;
  }
  /**
   * @description Defines the custom colors to use when resizing using content-aware padding.
   * @param {...string} colors One or more colors - Example: palette('green', 'red', blue')
   * @return {this}
   */
  palette(...colors) {
    this._palette = colors.map((color2) => {
      return prepareColor(color2);
    });
    return this;
  }
};
var BackgroundAutoBorderQualifier = class extends BaseCommonBackground {
  /**
   * @description
   * Stringify the qualifier
   * BackgroundQualifiers don't have a value, but instead override the toString() function.
   */
  toString() {
    return `
    b_auto:border
    ${this._contrast ? "_contrast" : ""}
    ${this._palette.length ? `:palette_${this._palette.join("_")}` : ""}
    `.replace(/\s+/g, "");
  }
};
var BaseGradientBackground = class extends BaseCommonBackground {
  /**
   *
   * @description Sets the number of predominant colors to use (2 or 4).
   * @param {number} num
   * @return {this}
   */
  gradientColors(num) {
    this._gradientColors = num;
    return this;
  }
  /**
   * @description Sets the direction for a background gradient fade effect.
   * @param {Qualifiers.GradientDirection | GradientDirectionType | string} direction Use one of these functions
   * provided by {@link Qualifiers.GradientDirection|GradientDirection}
   * @return {this}
   */
  gradientDirection(direction) {
    this._gradientDirection = direction;
    return this;
  }
};
var BackgroundBorderGradientQualifier = class extends BaseGradientBackground {
  /**
   * @description
   * Stringify the qualifier
   * BackgroundQualifiers don't have a value, but instead override the toString() function.
   */
  toString() {
    return `
    b_auto:border_gradient
    ${this._contrast ? "_contrast" : ""}
    ${this._gradientColors ? `:${this._gradientColors}` : ""}
    ${this._gradientDirection ? `:${this._gradientDirection}` : ""}
    ${this._palette.length ? `:palette_${this._palette.join("_")}` : ""}
    `.replace(/\s+/g, "");
  }
};
var BackgroundPredominantGradientQualifier = class extends BaseGradientBackground {
  /**
   * @description
   * Stringify the qualifier
   * BackgroundQualifiers don't have a value, but instead override the toString() function.
   */
  toString() {
    return `
    b_auto:predominant_gradient
    ${this._contrast ? "_contrast" : ""}
    ${this._gradientColors ? `:${this._gradientColors}` : ""}
    ${this._gradientDirection ? `:${this._gradientDirection}` : ""}
    ${this._palette.length ? `:palette_${this._palette.join("_")}` : ""}
    `.replace(/\s+/g, "");
  }
};
var BackgroundAutoPredominantQualifier = class extends BaseCommonBackground {
  /**
   * @description
   * Stringify the qualifier
   * BackgroundQualifiers don't have a value, but instead override the toString() function.
   */
  toString() {
    return `
    b_auto:predominant
    ${this._contrast ? "_contrast" : ""}
    ${this._palette.length ? `:palette_${this._palette.join("_")}` : ""}
    `.replace(/\s+/g, "");
  }
};
var BackgroundGenerativeFillQualifier = class extends BackgroundQualifier {
  constructor() {
    super("gen_fill");
    this._backgroundType = "generativeFill";
  }
  prompt(prompt) {
    try {
      this._prompt = decodeURIComponent(prompt);
    } catch (_a) {
      this._prompt = prompt;
    }
    return this;
  }
  getPrompt() {
    return this._prompt;
  }
  getBackgroundType() {
    return this._backgroundType;
  }
  /**
   * @description
   * Override the toString() function to explicitly stringify the qualifier.
   */
  toString() {
    return `b_gen_fill${this._prompt ? `:prompt_${encodePromptComponent(this._prompt)}` : ""}`;
  }
};
function getBackgroundValue(background) {
  return `${background}`.replace("b_", "");
}
function createAutoBackgroundModel() {
  return { backgroundType: "auto" };
}
function createBlurredBackgroundModel(background) {
  const { intensityLevel, brightnessLevel } = background;
  const result = {
    backgroundType: "blurred"
  };
  if (intensityLevel || intensityLevel === 0) {
    result.intensity = intensityLevel;
  }
  if (brightnessLevel || brightnessLevel === 0) {
    result.brightness = brightnessLevel;
  }
  return result;
}
function createContrastPaletteBackgroundModel(background) {
  const contrast = background._contrast;
  const palette = background._palette;
  const result = {
    backgroundType: ""
  };
  if (contrast) {
    result.contrast = true;
  }
  if (palette) {
    result.palette = palette;
  }
  return result;
}
function createBorderBackgroundModel(background) {
  return Object.assign(Object.assign({}, createContrastPaletteBackgroundModel(background)), { backgroundType: "border" });
}
function createBaseGradientBackgroundModel(background) {
  const gradientColors = background._gradientColors;
  const gradientDirection = `${background._gradientDirection}`;
  const result = createContrastPaletteBackgroundModel(background);
  if (gradientColors) {
    result.gradientColors = gradientColors;
  }
  if (gradientDirection) {
    result.gradientDirection = gradientDirection;
  }
  return result;
}
function createBorderGradientBackgroundModel(background) {
  return Object.assign(Object.assign({}, createBaseGradientBackgroundModel(background)), { backgroundType: "borderGradient" });
}
function createColorBackgroundModel(background) {
  return {
    backgroundType: "color",
    color: getBackgroundValue(background)
  };
}
function createPredominantBackgroundModel(background) {
  return Object.assign(Object.assign({}, createContrastPaletteBackgroundModel(background)), { backgroundType: "predominant" });
}
function createPredominantGradientBackgroundModel(background) {
  return Object.assign(Object.assign({}, createBaseGradientBackgroundModel(background)), { backgroundType: "predominantGradient" });
}
function createGenerativeFillBackgroundModel(background) {
  return Object.assign({ backgroundType: background.getBackgroundType() }, background.getPrompt() ? { prompt: background.getPrompt() } : {});
}
function createBackgroundModel(background) {
  if (getBackgroundValue(background) === "auto") {
    return createAutoBackgroundModel();
  }
  if (background instanceof BlurredBackgroundAction$1) {
    return createBlurredBackgroundModel(background);
  }
  if (background instanceof BackgroundAutoBorderQualifier) {
    return createBorderBackgroundModel(background);
  }
  if (background instanceof BackgroundBorderGradientQualifier) {
    return createBorderGradientBackgroundModel(background);
  }
  if (background instanceof BackgroundAutoPredominantQualifier) {
    return createPredominantBackgroundModel(background);
  }
  if (background instanceof BackgroundPredominantGradientQualifier) {
    return createPredominantGradientBackgroundModel(background);
  }
  if (background instanceof BackgroundGenerativeFillQualifier) {
    return createGenerativeFillBackgroundModel(background);
  }
  return createColorBackgroundModel(background);
}
function svg() {
  return new FormatQualifier("svg");
}
function auto$1() {
  return new FormatQualifier("auto");
}
function border() {
  return new BackgroundAutoBorderQualifier();
}
function auto() {
  return new BackgroundQualifier("auto");
}
function borderGradient() {
  return new BackgroundBorderGradientQualifier();
}
function predominantGradient() {
  return new BackgroundPredominantGradientQualifier();
}
function predominant() {
  return new BackgroundAutoPredominantQualifier();
}
function color(colorStr) {
  return new BackgroundQualifier(prepareColor(colorStr));
}
function blurred() {
  return new BlurredBackgroundAction$1();
}
function generativeFill() {
  return new BackgroundGenerativeFillQualifier();
}
var Background = {
  auto,
  border,
  borderGradient,
  predominantGradient,
  predominant,
  color,
  blurred,
  generativeFill
};
function createBlurredBackground(backgroundModel) {
  const { brightness, intensity } = backgroundModel;
  const result = Background.blurred();
  result.brightness(brightness !== null && brightness !== void 0 ? brightness : DEFAULT_BRIGHTNESS);
  result.intensity(intensity !== null && intensity !== void 0 ? intensity : DEFAULT_INTENSITY);
  return result;
}
function createGradientBackground(background, backgroundModel) {
  const { gradientColors, gradientDirection, contrast, palette } = backgroundModel;
  if (contrast) {
    background.contrast();
  }
  if (palette) {
    background.palette(...palette);
  }
  if (gradientColors) {
    background.gradientColors(+gradientColors);
  }
  if (gradientDirection) {
    background.gradientDirection(gradientDirection);
  }
  return background;
}
function createContrastPaletteBackground(background, backgroundModel) {
  const { contrast, palette } = backgroundModel;
  if (contrast) {
    background.contrast();
  }
  if (palette) {
    background.palette(...palette);
  }
  return background;
}
function createGenerativeFillBackground(background, backgroundModel) {
  const { prompt } = backgroundModel;
  if (prompt) {
    background.prompt(prompt);
  }
  return background;
}
function createBackgroundFromModel(backgroundModel) {
  const { backgroundType } = backgroundModel;
  switch (backgroundType) {
    case "auto":
      return auto();
    case "blurred":
      return createBlurredBackground(backgroundModel);
    case "border":
      return createContrastPaletteBackground(border(), backgroundModel);
    case "borderGradient":
      return createGradientBackground(borderGradient(), backgroundModel);
    case "predominant":
      return createContrastPaletteBackground(predominant(), backgroundModel);
    case "predominantGradient":
      return createGradientBackground(predominantGradient(), backgroundModel);
    case "generativeFill":
      return createGenerativeFillBackground(generativeFill(), backgroundModel);
    default:
      return color(backgroundModel.color);
  }
}
var ResizePadAction = class extends ResizeAdvancedAction {
  /**
   * @description Sets the background.
   * @param {Qualifiers.Background} backgroundQualifier Defines the background color to use instead of
   * transparent background areas or when resizing with padding.
   */
  background(backgroundQualifier) {
    this._actionModel.background = createBackgroundModel(backgroundQualifier);
    return this.addQualifier(backgroundQualifier);
  }
  /**
   * @description Horizontal position for custom-coordinates based padding.
   * @param {number} x The x position.
   */
  offsetX(x) {
    this._actionModel.x = x;
    return this.addQualifier(new Qualifier("x", x));
  }
  /**
   * @description Vertical position for custom-coordinates based padding
   * @param {number} y The y position.
   */
  offsetY(y) {
    this._actionModel.y = y;
    return this.addQualifier(new Qualifier("y", y));
  }
  static fromJson(actionModel) {
    const result = super.fromJson.apply(this, [actionModel]);
    actionModel.background && result.background(createBackgroundFromModel(actionModel.background));
    actionModel.x && result.offsetX(actionModel.x);
    actionModel.y && result.offsetY(actionModel.y);
    actionModel.zoom && result.zoom(actionModel.zoom);
    return result;
  }
};
var ResizeScaleAction = class extends ResizeSimpleAction {
  /**
   * @description Changes the aspect ratio of an image while retaining all important content and avoiding unnatural
   * distortions.
   * @return {this}
   */
  liquidRescaling() {
    return this.addQualifier(new GravityQualifier("liquid"));
  }
};
var ResizeCropAction = class extends ResizeAdvancedAction {
  /**
   * @description Horizontal position for custom-coordinates based cropping.
   * @param {number} x The x position.
   */
  x(x) {
    this._actionModel.x = x;
    return this.addQualifier(new Qualifier("x", x));
  }
  /**
   * @description Vertical position for custom-coordinates based cropping
   * @param {number} y The y position.
   */
  y(y) {
    this._actionModel.y = y;
    return this.addQualifier(new Qualifier("y", y));
  }
  /**
   * @description Controls how much of the original image surrounding the face to keep when using either the 'crop' or 'thumb' cropping modes with face detection.
   * @param {number | string} z The zoom factor. (Default: 1.0)
   */
  zoom(z) {
    this._actionModel.zoom = z;
    return this.addQualifier(new Qualifier("z", z));
  }
  static fromJson(actionModel) {
    const result = super.fromJson.apply(this, [actionModel]);
    actionModel.x && result.x(actionModel.x);
    actionModel.y && result.y(actionModel.y);
    actionModel.zoom && result.zoom(actionModel.zoom);
    return result;
  }
};
var ResizeFillAction = class extends ResizeAdvancedAction {
  /**
   * @description Absolute X position when used with Gravity.xyCenter {@link Qualifiers.Gravity.GravityQualifier}}
   * @param {number} x The x position.
   */
  x(x) {
    this._actionModel.x = x;
    return this.addQualifier(new Qualifier("x", x));
  }
  /**
   * @description Absolute Y position when used with Gravity.xyCenter {@link Qualifiers.Gravity.GravityQualifier}}
   * @param {number} y The y position.
   */
  y(y) {
    this._actionModel.y = y;
    return this.addQualifier(new Qualifier("y", y));
  }
  static fromJson(actionModel) {
    const result = super.fromJson.apply(this, [actionModel]);
    actionModel.x && result.x(actionModel.x);
    actionModel.y && result.y(actionModel.y);
    return result;
  }
};
function scale(width, height) {
  return new ResizeScaleAction("scale", width, height);
}
function crop(width, height) {
  return new ResizeCropAction("crop", width, height);
}
function fill(width, height) {
  return new ResizeFillAction("fill", width, height);
}
function pad(width, height) {
  return new ResizePadAction("pad", width, height);
}
var DeliveryQualityAction = class extends DeliveryAction {
  /**
   * @param {Qualifiers.Quality} qualityValue a Quality value
   */
  constructor(qualityValue) {
    super("q", qualityValue.toString(), "level");
  }
  /**
   * Selet the Chroma sub sampling</br>
   * <b>Learn more</b>: {@link https://cloudinary.com/documentation/image_optimization#toggle_chroma_subsampling|Toggling chroma subsampling}
   * @param {420 | 444 | number} type The chroma sub sampling type
   */
  chromaSubSampling(type) {
    this._actionModel.chromaSubSampling = CHROMA_VALUE_TO_CHROMA_MODEL_ENUM[type];
    const qualityWithSubSampling = new QualifierValue([this._actionModel.level, type]);
    qualityWithSubSampling.setDelimiter(":");
    return this.addQualifier(new Qualifier("q", qualityWithSubSampling));
  }
  /**
   * Controls the final quality by setting a maximum quantization percentage
   * @param {number} val
   */
  quantization(val) {
    this._actionModel.quantization = val;
    const qualityWithQuantization = new QualifierValue([this._actionModel.level, `qmax_${val}`]).setDelimiter(":");
    return this.addQualifier(new Qualifier("q", qualityWithQuantization));
  }
  static fromJson(actionModel) {
    const { level, chromaSubSampling, quantization } = actionModel;
    const levelType = ACTION_TYPE_TO_QUALITY_MODE_MAP[level] || level;
    const result = new this(levelType);
    if (chromaSubSampling) {
      const chromaValue = CHROMA_MODEL_ENUM_TO_CHROMA_VALUE[chromaSubSampling.toUpperCase()];
      chromaValue && result.chromaSubSampling(+chromaValue);
    }
    quantization && result.quantization(quantization);
    return result;
  }
};
function format(format2) {
  return new DeliveryFormatAction("f", format2);
}
function quality(qualityType) {
  return new DeliveryQualityAction(qualityType);
}
function northEast() {
  return new CompassQualifier("north_east");
}
var ACCESSIBILITY_MODES = {
  "darkmode": colorize(70).color("black"),
  "brightmode": colorize(40).color("white"),
  "monochrome": grayscale(),
  "colorblind": assistColorBlind()
};
var VECTORIZE = new Transformation().effect(vectorize()).delivery(quality("auto")).delivery(format(svg()));
var PIXELATE = new Transformation().effect(pixelate()).delivery(quality("auto")).delivery(format(auto$1()));
var BLUR = new Transformation().effect(blur(2e3)).delivery(quality("auto")).delivery(format(auto$1()));
var PREDOMINANT_COLOR_TRANSFORM = new Transformation().resize(pad("iw_div_2").aspectRatio(1).background(Background.auto())).resize(crop(1, 1).gravity(compass(northEast()))).resize(fill().height("ih").width("iw")).delivery(quality("auto")).delivery(format(auto$1()));
var PLACEHOLDER_IMAGE_OPTIONS = {
  "vectorize": VECTORIZE,
  "pixelate": PIXELATE,
  "blur": BLUR,
  "predominant-color": PREDOMINANT_COLOR_TRANSFORM
};
var singleTransparentPixel = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
var VIDEO_MIME_TYPES = {
  "flv": "x-flv",
  "3gp": "3gpp",
  "mov": "quicktime",
  "mpg": "mpeg",
  "avi": "x-msvideo",
  "wmv": "x-ms-wmv",
  "ogv": "ogg",
  "webm": "webm",
  "mp4": "mp4"
};
var ANALYTICS_DELIMITER = "?_a=";
var HtmlVideoLayer = (
  /** @class */
  function() {
    function HtmlVideoLayer2(element, userCloudinaryVideo, sources, plugins, videoAttributes, userCloudinaryPoster, videoOptions) {
      var _this = this;
      this.mimeType = "video";
      this.mimeSubTypes = VIDEO_MIME_TYPES;
      this.videoElement = element;
      this.originalVideo = userCloudinaryVideo;
      this.videoOptions = videoOptions;
      this.htmlPluginState = { cleanupCallbacks: [], pluginEventSubscription: [] };
      var pluginCloudinaryVideo = cloneDeep(userCloudinaryVideo);
      render(element, userCloudinaryVideo, plugins, this.htmlPluginState).then(function() {
        _this.htmlPluginState.pluginEventSubscription.forEach(function(fn) {
          fn();
        });
        _this.setVideoAttributes(videoAttributes, userCloudinaryPoster);
        _this.handleSourceToVideo(pluginCloudinaryVideo, sources);
      });
    }
    HtmlVideoLayer2.prototype.handleSourceToVideo = function(userCloudinaryVideo, sources) {
      var _this = this;
      if (sources) {
        this.generateUserSources(userCloudinaryVideo, sources);
      } else {
        var defaultTypes = ["webm", "mp4", "ogv"];
        defaultTypes.forEach(function(type) {
          _this.appendSourceTag(cloneDeep(userCloudinaryVideo), type);
        });
      }
    };
    HtmlVideoLayer2.prototype.generateUserSources = function(userCloudinaryVideo, sources) {
      var _this = this;
      sources.map(function(_a) {
        var type = _a.type, codecs = _a.codecs, transcode = _a.transcode;
        return _this.appendSourceTag(cloneDeep(userCloudinaryVideo).transcode(transcode), type, _this.buildMimeType(type, codecs));
      });
    };
    HtmlVideoLayer2.prototype.appendSourceTag = function(userCloudinaryVideo, type, mimeType) {
      var _a;
      var source = document.createElement("source");
      var shouldUseFetchFormat = (_a = this.videoOptions) === null || _a === void 0 ? void 0 : _a.useFetchFormat;
      if (shouldUseFetchFormat) {
        userCloudinaryVideo.format(type);
      }
      var url = userCloudinaryVideo.toURL();
      var srcParts = url.split(ANALYTICS_DELIMITER);
      var analyticsStr = srcParts[1] ? "".concat(ANALYTICS_DELIMITER).concat(srcParts[1]) : "";
      var ext = shouldUseFetchFormat ? "" : ".".concat(type);
      source.src = "".concat(srcParts[0]).concat(ext).concat(analyticsStr);
      source.type = mimeType ? mimeType : "video/".concat(VIDEO_MIME_TYPES[type] || type);
      this.videoElement.appendChild(source);
    };
    HtmlVideoLayer2.prototype.buildMimeType = function(type, codecs) {
      var mimeType = "".concat(this.mimeType, "/").concat(this.mimeSubTypes[type] || type);
      if (codecs) {
        mimeType += "; codecs=" + (Array.isArray(codecs) ? codecs.join(", ") : codecs);
      }
      return mimeType;
    };
    HtmlVideoLayer2.prototype.setVideoAttributes = function(videoAttributes, userCloudinaryPoster) {
      var _a;
      if (videoAttributes === void 0) {
        videoAttributes = {};
      }
      if (userCloudinaryPoster === "auto") {
        var posterCloudinaryVideo = cloneDeep(this.originalVideo);
        videoAttributes["poster"] = posterCloudinaryVideo.quality("auto").format("jpg").addTransformation("so_auto").toURL();
      } else if (userCloudinaryPoster) {
        videoAttributes["poster"] = (_a = userCloudinaryPoster.toURL) === null || _a === void 0 ? void 0 : _a.call(userCloudinaryPoster);
      }
      for (var _i = 0, _b = Object.entries(videoAttributes); _i < _b.length; _i++) {
        var _c = _b[_i], key = _c[0], value = _c[1];
        value && this.videoElement.setAttribute(key, key === "poster" ? value : "");
      }
    };
    HtmlVideoLayer2.prototype.update = function(updatedCloudinaryVideo, sources, plugins, videoAttributes, userCloudinaryPoster) {
      var _this = this;
      if (updatedCloudinaryVideo !== this.originalVideo) {
        var sourcesToDelete = this.videoElement.getElementsByTagName("SOURCE");
        while (sourcesToDelete[0])
          sourcesToDelete[0].parentNode.removeChild(sourcesToDelete[0]);
        render(this.videoElement, updatedCloudinaryVideo, plugins, this.htmlPluginState).then(function() {
          _this.setVideoAttributes(videoAttributes, userCloudinaryPoster);
          _this.handleSourceToVideo(updatedCloudinaryVideo, sources);
          _this.videoElement.load();
        });
      }
    };
    return HtmlVideoLayer2;
  }()
);
var FUNC_ERROR_TEXT = "Expected a function";
var NAN = 0 / 0;
var symbolTag = "[object Symbol]";
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var objectProto = Object.prototype;
var objectToString = objectProto.toString;
var nativeMax = Math.max;
var nativeMin = Math.min;
var now = function() {
  return root.Date.now();
};
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
    return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time = now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function isObject(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, "");
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var lodash_debounce = debounce;
function isNum(value) {
  return typeof value === "number";
}
function isBrowser() {
  return typeof window !== "undefined";
}
function isImage(i) {
  return i instanceof HTMLImageElement;
}
var initialPlugins = {
  accessibility: false,
  lazyload: false,
  placeholder: false,
  responsive: false
};
var getPluginType = function(name) {
  return name.replace("bound ", "").replace("Plugin", "");
};
var isPluginUsed = function(plugins, pluginType) {
  if (plugins === void 0) {
    plugins = [];
  }
  var usedPlugins = plugins.reduce(function(used, _a) {
    var _b;
    var name = _a.name;
    return __assign$1(__assign$1({}, used), (_b = {}, _b[getPluginType(name)] = true, _b));
  }, initialPlugins);
  return usedPlugins[pluginType];
};
function responsive(_a) {
  var _b = _a === void 0 ? {} : _a, steps = _b.steps;
  return responsivePlugin.bind(null, steps);
}
function responsivePlugin(steps, element, responsiveImage, htmlPluginState, baseAnalyticsOptions, plugins) {
  if (!isBrowser())
    return true;
  if (!isImage(element))
    return;
  return new Promise(function(resolve) {
    htmlPluginState.cleanupCallbacks.push(function() {
      window.removeEventListener("resize", resizeRef);
      resolve("canceled");
    });
    var analyticsOptions = getAnalyticsOptions(baseAnalyticsOptions, { responsive: true });
    responsiveImage.addAction(new Action().setActionTag("responsive"));
    var shouldRunImmediately = !isPluginUsed(plugins, "placeholder");
    if (shouldRunImmediately) {
      onResize(steps, element, responsiveImage, analyticsOptions);
    } else {
      updateByContainerWidth(steps, element, responsiveImage);
    }
    var resizeRef;
    htmlPluginState.pluginEventSubscription.push(function() {
      window.addEventListener("resize", resizeRef = lodash_debounce(function() {
        onResize(steps, element, responsiveImage, analyticsOptions);
      }, 100));
    });
    resolve({ responsive: true });
  });
}
function onResize(steps, element, responsiveImage, analyticsOptions) {
  updateByContainerWidth(steps, element, responsiveImage);
  element.src = responsiveImage.toURL(analyticsOptions);
}
function updateByContainerWidth(steps, element, responsiveImage) {
  var responsiveImgWidth = element.parentElement.clientWidth;
  if (isNum(steps)) {
    var WIDTH_INTERVALS = steps;
    responsiveImgWidth = Math.ceil(responsiveImgWidth / WIDTH_INTERVALS) * WIDTH_INTERVALS;
  } else if (Array.isArray(steps)) {
    responsiveImgWidth = steps.reduce(function(prev, curr) {
      return Math.abs(curr - responsiveImgWidth) < Math.abs(prev - responsiveImgWidth) ? curr : prev;
    });
  }
  responsiveImage.transformation.actions.forEach(function(action, index) {
    if (action instanceof Action && action.getActionTag() === "responsive") {
      responsiveImage.transformation.actions[index] = scale(responsiveImgWidth).setActionTag("responsive");
    }
  });
}
function lazyload(_a) {
  var _b = _a === void 0 ? {} : _a, _c = _b.rootMargin, rootMargin = _c === void 0 ? "0px" : _c, _d = _b.threshold, threshold = _d === void 0 ? 0.1 : _d;
  return lazyloadPlugin.bind(null, rootMargin, threshold);
}
function lazyloadPlugin(rootMargin, threshold, element, cloudinaryImage, htmlPluginState, plugins) {
  if (rootMargin === void 0) {
    rootMargin = "0px";
  }
  if (threshold === void 0) {
    threshold = 0.1;
  }
  if (!isBrowser())
    return false;
  return new Promise(function(resolve) {
    var onIntersect = function() {
      return resolve({ lazyload: true });
    };
    var unobserve = detectIntersection(element, onIntersect, rootMargin, threshold);
    htmlPluginState.cleanupCallbacks.push(function() {
      unobserve();
      resolve("canceled");
    });
  });
}
function isIntersectionObserverSupported() {
  return window && "IntersectionObserver" in window;
}
function detectIntersection(el, onIntersect, rootMargin, threshold) {
  try {
    if (!isIntersectionObserverSupported()) {
      onIntersect();
      return function() {
      };
    }
    var observer_1 = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          observer_1.unobserve(entry.target);
          onIntersect();
        }
      });
    }, { rootMargin, threshold });
    observer_1.observe(el);
    return function() {
      el && observer_1.observe(el);
    };
  } catch (e) {
    onIntersect();
  }
}
function accessibility(_a) {
  var _b = _a === void 0 ? {} : _a, _c = _b.mode, mode = _c === void 0 ? "darkmode" : _c;
  return accessibilityPlugin.bind(null, mode);
}
function accessibilityPlugin(mode, element, pluginCloudinaryImage, htmlPluginState, plugins) {
  if (isBrowser()) {
    if (!isImage(element))
      return;
    return new Promise(function(resolve) {
      htmlPluginState.cleanupCallbacks.push(function() {
        resolve("canceled");
      });
      if (!ACCESSIBILITY_MODES[mode]) {
        mode = "darkmode";
      }
      pluginCloudinaryImage.effect(ACCESSIBILITY_MODES[mode]);
      resolve({ accessibility: true });
    });
  } else {
    pluginCloudinaryImage.effect(ACCESSIBILITY_MODES[mode]);
    return true;
  }
}
function placeholder(_a) {
  var _b = _a === void 0 ? {} : _a, _c = _b.mode, mode = _c === void 0 ? "vectorize" : _c;
  return placeholderPlugin.bind(null, mode);
}
function placeholderPlugin(mode, element, pluginCloudinaryImage, htmlPluginState, baseAnalyticsOptions, plugins) {
  if (!PLACEHOLDER_IMAGE_OPTIONS[mode]) {
    mode = "vectorize";
  }
  var PLACEHOLDER_ACTIONS = PLACEHOLDER_IMAGE_OPTIONS[mode].actions;
  var placeholderClonedImage = cloneDeep(pluginCloudinaryImage);
  PLACEHOLDER_ACTIONS.forEach(function(transformation) {
    placeholderClonedImage.addAction(transformation);
  });
  if (!isBrowser()) {
    pluginCloudinaryImage.transformation = placeholderClonedImage.transformation;
    return true;
  }
  if (!isImage(element))
    return;
  placeholderClonedImage.transformation.actions.forEach(function(action, index) {
    if (action instanceof Action && action.getActionTag() === "responsive") {
      delete placeholderClonedImage.transformation.actions[index];
    }
  });
  var analyticsOptions = getAnalyticsOptions(baseAnalyticsOptions, { placeholder: true });
  element.src = placeholderClonedImage.toURL(analyticsOptions);
  element.onerror = function() {
    element.src = singleTransparentPixel;
  };
  return new Promise(function(resolve) {
    element.onload = function() {
      resolve();
    };
  }).then(function() {
    return new Promise(function(resolve) {
      htmlPluginState.cleanupCallbacks.push(function() {
        element.src = singleTransparentPixel;
        resolve("canceled");
      });
      var largeImage = new Image();
      largeImage.src = pluginCloudinaryImage.toURL(analyticsOptions);
      largeImage.onload = function() {
        resolve({ placeholder: true });
      };
      largeImage.onerror = function() {
        resolve({ placeholder: true });
      };
    });
  });
}
function serverSideSrc(plugins, serverCloudinaryImage, analyticsOptions) {
  var clonedServerCloudinaryImage = cloneDeep(serverCloudinaryImage);
  if (plugins) {
    for (var i = 0; i < plugins.length; i++) {
      var response = plugins[i](null, clonedServerCloudinaryImage);
      if (!response) {
        break;
      }
    }
  }
  return clonedServerCloudinaryImage.toURL(analyticsOptions ? { trackedAnalytics: analyticsOptions } : null);
}
function cancelCurrentlyRunningPlugins(pluginState) {
  pluginState.cleanupCallbacks.forEach(function(fn) {
    fn();
  });
}
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
var SDKAnalyticsConstants = {
  sdkSemver: "1.14.3",
  techVersion: import_react.default.version,
  sdkCode: "J"
};
var AdvancedImage = (
  /** @class */
  function(_super) {
    __extends(AdvancedImage2, _super);
    function AdvancedImage2(props) {
      var _this = _super.call(this, props) || this;
      _this.imageRef = import_react.default.createRef();
      return _this;
    }
    AdvancedImage2.prototype.componentDidMount = function() {
      this.htmlLayerInstance = new HtmlImageLayer(this.imageRef.current, this.props.cldImg, this.props.plugins, SDKAnalyticsConstants);
    };
    AdvancedImage2.prototype.componentDidUpdate = function() {
      cancelCurrentlyRunningPlugins(this.htmlLayerInstance.htmlPluginState);
      this.htmlLayerInstance.update(this.props.cldImg, this.props.plugins, SDKAnalyticsConstants);
    };
    AdvancedImage2.prototype.componentWillUnmount = function() {
      cancelCurrentlyRunningPlugins(this.htmlLayerInstance.htmlPluginState);
      this.htmlLayerInstance.unmount();
    };
    AdvancedImage2.prototype.render = function() {
      var _a = this.props;
      _a.cldImg;
      _a.plugins;
      var otherProps = __rest(_a, ["cldImg", "plugins"]);
      if (isBrowser()) {
        return import_react.default.createElement("img", __assign({ suppressHydrationWarning: true }, otherProps, { ref: this.imageRef }));
      } else {
        var src = serverSideSrc(this.props.plugins, this.props.cldImg, SDKAnalyticsConstants);
        return import_react.default.createElement("img", __assign({}, otherProps, { src }));
      }
    };
    return AdvancedImage2;
  }(import_react.default.Component)
);
var VIDEO_ATTRIBUTES_KEYS = ["controls", "loop", "muted", "poster", "preload", "autoplay", "playsinline"];
var AdvancedVideo = (
  /** @class */
  function(_super) {
    __extends(AdvancedVideo2, _super);
    function AdvancedVideo2(props) {
      var _this = _super.call(this, props) || this;
      _this.videoRef = (0, import_react.createRef)();
      _this.attachRef = _this.attachRef.bind(_this);
      return _this;
    }
    AdvancedVideo2.prototype.componentDidMount = function() {
      this.htmlVideoLayerInstance = new HtmlVideoLayer(this.videoRef && this.videoRef.current, this.props.cldVid, this.props.sources, this.props.plugins, this.getVideoAttributes(), this.props.cldPoster, {
        useFetchFormat: this.props.useFetchFormat
      });
    };
    AdvancedVideo2.prototype.componentDidUpdate = function() {
      cancelCurrentlyRunningPlugins(this.htmlVideoLayerInstance.htmlPluginState);
      this.htmlVideoLayerInstance.update(this.props.cldVid, this.props.sources, this.props.plugins, this.getVideoAttributes(), this.props.cldPoster);
    };
    AdvancedVideo2.prototype.componentWillUnmount = function() {
      cancelCurrentlyRunningPlugins(this.htmlVideoLayerInstance.htmlPluginState);
    };
    AdvancedVideo2.prototype.getVideoAttributes = function() {
      var _this = this;
      var result = {};
      VIDEO_ATTRIBUTES_KEYS.forEach(function(key) {
        if (key in _this.props) {
          result[key] = _this.props[key];
        }
      });
      return result;
    };
    AdvancedVideo2.prototype.attachRef = function(element) {
      this.videoRef.current = element;
      var innerRef = this.props.innerRef;
      if (innerRef) {
        if (innerRef instanceof Function) {
          innerRef(element);
        } else {
          innerRef.current = element;
        }
      }
    };
    AdvancedVideo2.prototype.render = function() {
      var _a = this.props;
      _a.cldVid;
      _a.cldPoster;
      _a.plugins;
      _a.sources;
      _a.innerRef;
      _a.useFetchFormat;
      var videoAttrs = __rest(_a, ["cldVid", "cldPoster", "plugins", "sources", "innerRef", "useFetchFormat"]);
      return import_react.default.createElement("video", __assign({}, videoAttrs, { ref: this.attachRef }));
    };
    return AdvancedVideo2;
  }(import_react.Component)
);
export {
  AdvancedImage,
  AdvancedVideo,
  accessibility,
  lazyload,
  placeholder,
  responsive
};
/*! Bundled license information:

@cloudinary/react/dist/index.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=@cloudinary_react.js.map
