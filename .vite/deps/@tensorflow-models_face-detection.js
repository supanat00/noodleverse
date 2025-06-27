import {
  Tensor,
  add,
  browser_exports,
  cast,
  clipByValue,
  concat,
  dispose,
  div,
  exp,
  expandDims,
  image,
  loadGraphModel,
  mul,
  reshape,
  sigmoid,
  slice,
  squeeze,
  sub,
  tensor1d,
  tensor2d,
  tidy,
  util_exports
} from "./chunk-QN6CNHHJ.js";
import {
  __commonJS,
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/@mediapipe/face_detection/face_detection.js
var require_face_detection = __commonJS({
  "node_modules/@mediapipe/face_detection/face_detection.js"(exports) {
    (function() {
      "use strict";
      var x;
      function aa(a) {
        var b2 = 0;
        return function() {
          return b2 < a.length ? { done: false, value: a[b2++] } : { done: true };
        };
      }
      var ba = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b2, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b2] = c.value;
        return a;
      };
      function ca(a) {
        a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
        for (var b2 = 0; b2 < a.length; ++b2) {
          var c = a[b2];
          if (c && c.Math == Math) return c;
        }
        throw Error("Cannot find global object");
      }
      var y = ca(this);
      function B2(a, b2) {
        if (b2) a: {
          var c = y;
          a = a.split(".");
          for (var d = 0; d < a.length - 1; d++) {
            var e2 = a[d];
            if (!(e2 in c)) break a;
            c = c[e2];
          }
          a = a[a.length - 1];
          d = c[a];
          b2 = b2(d);
          b2 != d && null != b2 && ba(c, a, { configurable: true, writable: true, value: b2 });
        }
      }
      B2("Symbol", function(a) {
        function b2(g) {
          if (this instanceof b2) throw new TypeError("Symbol is not a constructor");
          return new c(d + (g || "") + "_" + e2++, g);
        }
        function c(g, f) {
          this.g = g;
          ba(this, "description", { configurable: true, writable: true, value: f });
        }
        if (a) return a;
        c.prototype.toString = function() {
          return this.g;
        };
        var d = "jscomp_symbol_" + (1e9 * Math.random() >>> 0) + "_", e2 = 0;
        return b2;
      });
      B2("Symbol.iterator", function(a) {
        if (a) return a;
        a = Symbol("Symbol.iterator");
        for (var b2 = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b2.length; c++) {
          var d = y[b2[c]];
          "function" === typeof d && "function" != typeof d.prototype[a] && ba(d.prototype, a, { configurable: true, writable: true, value: function() {
            return da(aa(this));
          } });
        }
        return a;
      });
      function da(a) {
        a = { next: a };
        a[Symbol.iterator] = function() {
          return this;
        };
        return a;
      }
      function C2(a) {
        var b2 = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
        return b2 ? b2.call(a) : { next: aa(a) };
      }
      function D2(a) {
        if (!(a instanceof Array)) {
          a = C2(a);
          for (var b2, c = []; !(b2 = a.next()).done; ) c.push(b2.value);
          a = c;
        }
        return a;
      }
      var ea = "function" == typeof Object.create ? Object.create : function(a) {
        function b2() {
        }
        b2.prototype = a;
        return new b2();
      }, fa;
      if ("function" == typeof Object.setPrototypeOf) fa = Object.setPrototypeOf;
      else {
        var ha;
        a: {
          var ia = { a: true }, ja = {};
          try {
            ja.__proto__ = ia;
            ha = ja.a;
            break a;
          } catch (a) {
          }
          ha = false;
        }
        fa = ha ? function(a, b2) {
          a.__proto__ = b2;
          if (a.__proto__ !== b2) throw new TypeError(a + " is not extensible");
          return a;
        } : null;
      }
      var ka = fa;
      function E2(a, b2) {
        a.prototype = ea(b2.prototype);
        a.prototype.constructor = a;
        if (ka) ka(a, b2);
        else for (var c in b2) if ("prototype" != c) if (Object.defineProperties) {
          var d = Object.getOwnPropertyDescriptor(b2, c);
          d && Object.defineProperty(a, c, d);
        } else a[c] = b2[c];
        a.na = b2.prototype;
      }
      function la() {
        this.l = false;
        this.i = null;
        this.h = void 0;
        this.g = 1;
        this.u = this.o = 0;
        this.j = null;
      }
      function ma(a) {
        if (a.l) throw new TypeError("Generator is already running");
        a.l = true;
      }
      la.prototype.s = function(a) {
        this.h = a;
      };
      function na(a, b2) {
        a.j = { da: b2, ea: true };
        a.g = a.o || a.u;
      }
      la.prototype.return = function(a) {
        this.j = { return: a };
        this.g = this.u;
      };
      function G2(a, b2, c) {
        a.g = c;
        return { value: b2 };
      }
      function oa(a) {
        this.g = new la();
        this.h = a;
      }
      function pa(a, b2) {
        ma(a.g);
        var c = a.g.i;
        if (c) return qa(a, "return" in c ? c["return"] : function(d) {
          return { value: d, done: true };
        }, b2, a.g.return);
        a.g.return(b2);
        return H2(a);
      }
      function qa(a, b2, c, d) {
        try {
          var e2 = b2.call(a.g.i, c);
          if (!(e2 instanceof Object)) throw new TypeError("Iterator result " + e2 + " is not an object");
          if (!e2.done) return a.g.l = false, e2;
          var g = e2.value;
        } catch (f) {
          return a.g.i = null, na(a.g, f), H2(a);
        }
        a.g.i = null;
        d.call(a.g, g);
        return H2(a);
      }
      function H2(a) {
        for (; a.g.g; ) try {
          var b2 = a.h(a.g);
          if (b2) return a.g.l = false, { value: b2.value, done: false };
        } catch (c) {
          a.g.h = void 0, na(a.g, c);
        }
        a.g.l = false;
        if (a.g.j) {
          b2 = a.g.j;
          a.g.j = null;
          if (b2.ea) throw b2.da;
          return { value: b2.return, done: true };
        }
        return { value: void 0, done: true };
      }
      function ra(a) {
        this.next = function(b2) {
          ma(a.g);
          a.g.i ? b2 = qa(a, a.g.i.next, b2, a.g.s) : (a.g.s(b2), b2 = H2(a));
          return b2;
        };
        this.throw = function(b2) {
          ma(a.g);
          a.g.i ? b2 = qa(a, a.g.i["throw"], b2, a.g.s) : (na(a.g, b2), b2 = H2(a));
          return b2;
        };
        this.return = function(b2) {
          return pa(a, b2);
        };
        this[Symbol.iterator] = function() {
          return this;
        };
      }
      function sa(a) {
        function b2(d) {
          return a.next(d);
        }
        function c(d) {
          return a.throw(d);
        }
        return new Promise(function(d, e2) {
          function g(f) {
            f.done ? d(f.value) : Promise.resolve(f.value).then(b2, c).then(g, e2);
          }
          g(a.next());
        });
      }
      function J2(a) {
        return sa(new ra(new oa(a)));
      }
      B2("Promise", function(a) {
        function b2(f) {
          this.h = 0;
          this.i = void 0;
          this.g = [];
          this.s = false;
          var h = this.j();
          try {
            f(h.resolve, h.reject);
          } catch (k2) {
            h.reject(k2);
          }
        }
        function c() {
          this.g = null;
        }
        function d(f) {
          return f instanceof b2 ? f : new b2(function(h) {
            h(f);
          });
        }
        if (a) return a;
        c.prototype.h = function(f) {
          if (null == this.g) {
            this.g = [];
            var h = this;
            this.i(function() {
              h.l();
            });
          }
          this.g.push(f);
        };
        var e2 = y.setTimeout;
        c.prototype.i = function(f) {
          e2(f, 0);
        };
        c.prototype.l = function() {
          for (; this.g && this.g.length; ) {
            var f = this.g;
            this.g = [];
            for (var h = 0; h < f.length; ++h) {
              var k2 = f[h];
              f[h] = null;
              try {
                k2();
              } catch (l) {
                this.j(l);
              }
            }
          }
          this.g = null;
        };
        c.prototype.j = function(f) {
          this.i(function() {
            throw f;
          });
        };
        b2.prototype.j = function() {
          function f(l) {
            return function(m) {
              k2 || (k2 = true, l.call(h, m));
            };
          }
          var h = this, k2 = false;
          return { resolve: f(this.D), reject: f(this.l) };
        };
        b2.prototype.D = function(f) {
          if (f === this) this.l(new TypeError("A Promise cannot resolve to itself"));
          else if (f instanceof b2) this.H(f);
          else {
            a: switch (typeof f) {
              case "object":
                var h = null != f;
                break a;
              case "function":
                h = true;
                break a;
              default:
                h = false;
            }
            h ? this.A(f) : this.o(f);
          }
        };
        b2.prototype.A = function(f) {
          var h = void 0;
          try {
            h = f.then;
          } catch (k2) {
            this.l(k2);
            return;
          }
          "function" == typeof h ? this.I(h, f) : this.o(f);
        };
        b2.prototype.l = function(f) {
          this.u(2, f);
        };
        b2.prototype.o = function(f) {
          this.u(1, f);
        };
        b2.prototype.u = function(f, h) {
          if (0 != this.h) throw Error("Cannot settle(" + f + ", " + h + "): Promise already settled in state" + this.h);
          this.h = f;
          this.i = h;
          2 === this.h && this.G();
          this.B();
        };
        b2.prototype.G = function() {
          var f = this;
          e2(function() {
            if (f.C()) {
              var h = y.console;
              "undefined" !== typeof h && h.error(f.i);
            }
          }, 1);
        };
        b2.prototype.C = function() {
          if (this.s) return false;
          var f = y.CustomEvent, h = y.Event, k2 = y.dispatchEvent;
          if ("undefined" === typeof k2) return true;
          "function" === typeof f ? f = new f("unhandledrejection", { cancelable: true }) : "function" === typeof h ? f = new h("unhandledrejection", { cancelable: true }) : (f = y.document.createEvent("CustomEvent"), f.initCustomEvent("unhandledrejection", false, true, f));
          f.promise = this;
          f.reason = this.i;
          return k2(f);
        };
        b2.prototype.B = function() {
          if (null != this.g) {
            for (var f = 0; f < this.g.length; ++f) g.h(this.g[f]);
            this.g = null;
          }
        };
        var g = new c();
        b2.prototype.H = function(f) {
          var h = this.j();
          f.M(h.resolve, h.reject);
        };
        b2.prototype.I = function(f, h) {
          var k2 = this.j();
          try {
            f.call(h, k2.resolve, k2.reject);
          } catch (l) {
            k2.reject(l);
          }
        };
        b2.prototype.then = function(f, h) {
          function k2(p, n) {
            return "function" == typeof p ? function(r) {
              try {
                l(p(r));
              } catch (t) {
                m(t);
              }
            } : n;
          }
          var l, m, q2 = new b2(function(p, n) {
            l = p;
            m = n;
          });
          this.M(k2(f, l), k2(h, m));
          return q2;
        };
        b2.prototype.catch = function(f) {
          return this.then(void 0, f);
        };
        b2.prototype.M = function(f, h) {
          function k2() {
            switch (l.h) {
              case 1:
                f(l.i);
                break;
              case 2:
                h(l.i);
                break;
              default:
                throw Error("Unexpected state: " + l.h);
            }
          }
          var l = this;
          null == this.g ? g.h(k2) : this.g.push(k2);
          this.s = true;
        };
        b2.resolve = d;
        b2.reject = function(f) {
          return new b2(function(h, k2) {
            k2(f);
          });
        };
        b2.race = function(f) {
          return new b2(function(h, k2) {
            for (var l = C2(f), m = l.next(); !m.done; m = l.next()) d(m.value).M(h, k2);
          });
        };
        b2.all = function(f) {
          var h = C2(f), k2 = h.next();
          return k2.done ? d([]) : new b2(function(l, m) {
            function q2(r) {
              return function(t) {
                p[r] = t;
                n--;
                0 == n && l(p);
              };
            }
            var p = [], n = 0;
            do
              p.push(void 0), n++, d(k2.value).M(q2(p.length - 1), m), k2 = h.next();
            while (!k2.done);
          });
        };
        return b2;
      });
      function ta(a, b2) {
        a instanceof String && (a += "");
        var c = 0, d = false, e2 = { next: function() {
          if (!d && c < a.length) {
            var g = c++;
            return { value: b2(g, a[g]), done: false };
          }
          d = true;
          return { done: true, value: void 0 };
        } };
        e2[Symbol.iterator] = function() {
          return e2;
        };
        return e2;
      }
      var ua = "function" == typeof Object.assign ? Object.assign : function(a, b2) {
        for (var c = 1; c < arguments.length; c++) {
          var d = arguments[c];
          if (d) for (var e2 in d) Object.prototype.hasOwnProperty.call(d, e2) && (a[e2] = d[e2]);
        }
        return a;
      };
      B2("Object.assign", function(a) {
        return a || ua;
      });
      B2("Object.is", function(a) {
        return a ? a : function(b2, c) {
          return b2 === c ? 0 !== b2 || 1 / b2 === 1 / c : b2 !== b2 && c !== c;
        };
      });
      B2("Array.prototype.includes", function(a) {
        return a ? a : function(b2, c) {
          var d = this;
          d instanceof String && (d = String(d));
          var e2 = d.length;
          c = c || 0;
          for (0 > c && (c = Math.max(c + e2, 0)); c < e2; c++) {
            var g = d[c];
            if (g === b2 || Object.is(g, b2)) return true;
          }
          return false;
        };
      });
      B2("String.prototype.includes", function(a) {
        return a ? a : function(b2, c) {
          if (null == this) throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");
          if (b2 instanceof RegExp) throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
          return -1 !== this.indexOf(b2, c || 0);
        };
      });
      B2("Array.prototype.keys", function(a) {
        return a ? a : function() {
          return ta(this, function(b2) {
            return b2;
          });
        };
      });
      var va = this || self;
      function K2(a, b2) {
        a = a.split(".");
        var c = va;
        a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift()); ) a.length || void 0 === b2 ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b2;
      }
      ;
      function L2() {
        throw Error("Invalid UTF8");
      }
      function wa(a, b2) {
        b2 = String.fromCharCode.apply(null, b2);
        return null == a ? b2 : a + b2;
      }
      var xa, ya = "undefined" !== typeof TextDecoder, za, Aa = "undefined" !== typeof TextEncoder;
      var Ba = {}, M = null;
      function Ca(a) {
        var b2;
        void 0 === b2 && (b2 = 0);
        Da();
        b2 = Ba[b2];
        for (var c = Array(Math.floor(a.length / 3)), d = b2[64] || "", e2 = 0, g = 0; e2 < a.length - 2; e2 += 3) {
          var f = a[e2], h = a[e2 + 1], k2 = a[e2 + 2], l = b2[f >> 2];
          f = b2[(f & 3) << 4 | h >> 4];
          h = b2[(h & 15) << 2 | k2 >> 6];
          k2 = b2[k2 & 63];
          c[g++] = l + f + h + k2;
        }
        l = 0;
        k2 = d;
        switch (a.length - e2) {
          case 2:
            l = a[e2 + 1], k2 = b2[(l & 15) << 2] || d;
          case 1:
            a = a[e2], c[g] = b2[a >> 2] + b2[(a & 3) << 4 | l >> 4] + k2 + d;
        }
        return c.join("");
      }
      function Ea(a) {
        var b2 = a.length, c = 3 * b2 / 4;
        c % 3 ? c = Math.floor(c) : -1 != "=.".indexOf(a[b2 - 1]) && (c = -1 != "=.".indexOf(a[b2 - 2]) ? c - 2 : c - 1);
        var d = new Uint8Array(c), e2 = 0;
        Fa(a, function(g) {
          d[e2++] = g;
        });
        return e2 !== c ? d.subarray(0, e2) : d;
      }
      function Fa(a, b2) {
        function c(k2) {
          for (; d < a.length; ) {
            var l = a.charAt(d++), m = M[l];
            if (null != m) return m;
            if (!/^[\s\xa0]*$/.test(l)) throw Error("Unknown base64 encoding at char: " + l);
          }
          return k2;
        }
        Da();
        for (var d = 0; ; ) {
          var e2 = c(-1), g = c(0), f = c(64), h = c(64);
          if (64 === h && -1 === e2) break;
          b2(e2 << 2 | g >> 4);
          64 != f && (b2(g << 4 & 240 | f >> 2), 64 != h && b2(f << 6 & 192 | h));
        }
      }
      function Da() {
        if (!M) {
          M = {};
          for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b2 = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) {
            var d = a.concat(b2[c].split(""));
            Ba[c] = d;
            for (var e2 = 0; e2 < d.length; e2++) {
              var g = d[e2];
              void 0 === M[g] && (M[g] = e2);
            }
          }
        }
      }
      ;
      var Ga = "function" === typeof Uint8Array;
      function Ha(a) {
        return Ga && null != a && a instanceof Uint8Array;
      }
      var Ia;
      function Ja(a) {
        this.L = a;
        if (null !== a && 0 === a.length) throw Error("ByteString should be constructed with non-empty values");
      }
      ;
      var Ka = "function" === typeof Uint8Array.prototype.slice, N2 = 0, O2 = 0;
      function La(a, b2) {
        if (a.constructor === Uint8Array) return a;
        if (a.constructor === ArrayBuffer) return new Uint8Array(a);
        if (a.constructor === Array) return new Uint8Array(a);
        if (a.constructor === String) return Ea(a);
        if (a.constructor === Ja) {
          if (!b2 && (b2 = a.L) && b2.constructor === Uint8Array) return b2;
          b2 = a.L;
          b2 = null == b2 || Ha(b2) ? b2 : "string" === typeof b2 ? Ea(b2) : null;
          return (a = a.L = b2) ? new Uint8Array(a) : Ia || (Ia = new Uint8Array(0));
        }
        if (a instanceof Uint8Array) return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, or Array of numbers");
      }
      ;
      function Ma(a, b2) {
        return Error("Invalid wire type: " + a + " (at position " + b2 + ")");
      }
      function Na() {
        return Error("Failed to read varint, encoding is invalid.");
      }
      ;
      function Oa(a, b2) {
        b2 = void 0 === b2 ? {} : b2;
        b2 = void 0 === b2.v ? false : b2.v;
        this.h = null;
        this.g = this.i = this.j = 0;
        this.v = b2;
        a && Pa(this, a);
      }
      function Pa(a, b2) {
        a.h = La(b2, a.v);
        a.j = 0;
        a.i = a.h.length;
        a.g = a.j;
      }
      Oa.prototype.reset = function() {
        this.g = this.j;
      };
      function P2(a) {
        if (a.g > a.i) throw Error("Tried to read past the end of the data " + a.g + " > " + a.i);
      }
      function Q2(a) {
        var b2 = a.h, c = b2[a.g], d = c & 127;
        if (128 > c) return a.g += 1, P2(a), d;
        c = b2[a.g + 1];
        d |= (c & 127) << 7;
        if (128 > c) return a.g += 2, P2(a), d;
        c = b2[a.g + 2];
        d |= (c & 127) << 14;
        if (128 > c) return a.g += 3, P2(a), d;
        c = b2[a.g + 3];
        d |= (c & 127) << 21;
        if (128 > c) return a.g += 4, P2(a), d;
        c = b2[a.g + 4];
        a.g += 5;
        d |= (c & 15) << 28;
        if (128 > c) return P2(a), d;
        if (128 <= b2[a.g++] && 128 <= b2[a.g++] && 128 <= b2[a.g++] && 128 <= b2[a.g++] && 128 <= b2[a.g++]) throw Na();
        P2(a);
        return d;
      }
      var Qa = [];
      function Ra() {
        this.g = [];
      }
      Ra.prototype.length = function() {
        return this.g.length;
      };
      Ra.prototype.end = function() {
        var a = this.g;
        this.g = [];
        return a;
      };
      function S(a, b2) {
        for (; 127 < b2; ) a.g.push(b2 & 127 | 128), b2 >>>= 7;
        a.g.push(b2);
      }
      ;
      function Sa(a) {
        var b2 = {}, c = void 0 === b2.W ? false : b2.W;
        this.l = { v: void 0 === b2.v ? false : b2.v };
        this.W = c;
        b2 = this.l;
        Qa.length ? (c = Qa.pop(), b2 && (c.v = b2.v), a && Pa(c, a), a = c) : a = new Oa(a, b2);
        this.g = a;
        this.j = this.g.g;
        this.h = this.i = -1;
      }
      Sa.prototype.reset = function() {
        this.g.reset();
        this.j = this.g.g;
        this.h = this.i = -1;
      };
      function Ta(a) {
        var b2 = a.g;
        if (b2.g == b2.i) return false;
        a.j = a.g.g;
        var c = Q2(a.g) >>> 0;
        b2 = c >>> 3;
        c &= 7;
        if (!(0 <= c && 5 >= c)) throw Ma(c, a.j);
        if (1 > b2) throw Error("Invalid field number: " + b2 + " (at position " + a.j + ")");
        a.i = b2;
        a.h = c;
        return true;
      }
      function Ua(a) {
        switch (a.h) {
          case 0:
            if (0 != a.h) Ua(a);
            else a: {
              a = a.g;
              for (var b2 = a.g, c = b2 + 10; b2 < c; ) if (0 === (a.h[b2++] & 128)) {
                a.g = b2;
                P2(a);
                break a;
              }
              throw Na();
            }
            break;
          case 1:
            a = a.g;
            a.g += 8;
            P2(a);
            break;
          case 2:
            2 != a.h ? Ua(a) : (b2 = Q2(a.g) >>> 0, a = a.g, a.g += b2, P2(a));
            break;
          case 5:
            a = a.g;
            a.g += 4;
            P2(a);
            break;
          case 3:
            b2 = a.i;
            do {
              if (!Ta(a)) throw Error("Unmatched start-group tag: stream EOF");
              if (4 == a.h) {
                if (a.i != b2) throw Error("Unmatched end-group tag");
                break;
              }
              Ua(a);
            } while (1);
            break;
          default:
            throw Ma(a.h, a.j);
        }
      }
      var Va = [];
      function Wa() {
        this.i = [];
        this.h = 0;
        this.g = new Ra();
      }
      function T2(a, b2) {
        0 !== b2.length && (a.i.push(b2), a.h += b2.length);
      }
      function Xa(a, b2) {
        if (b2 = b2.ba) {
          T2(a, a.g.end());
          for (var c = 0; c < b2.length; c++) T2(a, b2[c]);
        }
      }
      ;
      var U2 = "function" === typeof Symbol && "symbol" === typeof Symbol() ? Symbol(void 0) : void 0;
      function Ya(a, b2) {
        Object.isFrozen(a) || (U2 ? a[U2] |= b2 : void 0 !== a.N ? a.N |= b2 : Object.defineProperties(a, { N: { value: b2, configurable: true, writable: true, enumerable: false } }));
      }
      function Za(a) {
        var b2;
        U2 ? b2 = a[U2] : b2 = a.N;
        return null == b2 ? 0 : b2;
      }
      function $a(a) {
        Ya(a, 1);
        return a;
      }
      function ab(a) {
        return Array.isArray(a) ? !!(Za(a) & 2) : false;
      }
      function bb(a) {
        if (!Array.isArray(a)) throw Error("cannot mark non-array as immutable");
        Ya(a, 2);
      }
      ;
      function cb(a) {
        return null !== a && "object" === typeof a && !Array.isArray(a) && a.constructor === Object;
      }
      var db = Object.freeze($a([]));
      function eb(a) {
        if (ab(a.m)) throw Error("Cannot mutate an immutable Message");
      }
      var fb = "undefined" != typeof Symbol && "undefined" != typeof Symbol.hasInstance;
      function gb(a) {
        return { value: a, configurable: false, writable: false, enumerable: false };
      }
      ;
      function V2(a, b2, c) {
        return -1 === b2 ? null : b2 >= a.i ? a.g ? a.g[b2] : void 0 : (void 0 === c ? 0 : c) && a.g && (c = a.g[b2], null != c) ? c : a.m[b2 + a.h];
      }
      function W2(a, b2, c, d) {
        d = void 0 === d ? false : d;
        eb(a);
        b2 < a.i && !d ? a.m[b2 + a.h] = c : (a.g || (a.g = a.m[a.i + a.h] = {}))[b2] = c;
      }
      function hb(a, b2, c, d) {
        c = void 0 === c ? true : c;
        d = void 0 === d ? false : d;
        var e2 = V2(a, b2, d);
        null == e2 && (e2 = db);
        if (ab(a.m)) c && (bb(e2), Object.freeze(e2));
        else if (e2 === db || ab(e2)) e2 = $a(e2.slice()), W2(a, b2, e2, d);
        return e2;
      }
      function X2(a, b2, c) {
        a = V2(a, b2);
        a = null == a ? a : +a;
        return null == a ? void 0 === c ? 0 : c : a;
      }
      function ib(a, b2, c, d) {
        a.j || (a.j = {});
        var e2 = ab(a.m), g = a.j[c];
        if (!g) {
          d = hb(a, c, true, void 0 === d ? false : d);
          g = [];
          e2 = e2 || ab(d);
          for (var f = 0; f < d.length; f++) g[f] = new b2(d[f]), e2 && bb(g[f].m);
          e2 && (bb(g), Object.freeze(g));
          a.j[c] = g;
        }
        return g;
      }
      function jb(a, b2, c, d, e2) {
        var g = void 0 === g ? false : g;
        eb(a);
        g = ib(a, c, b2, g);
        c = d ? d : new c();
        a = hb(a, b2);
        void 0 != e2 ? (g.splice(e2, 0, c), a.splice(e2, 0, c.m)) : (g.push(c), a.push(c.m));
        return c;
      }
      function kb(a, b2) {
        a = V2(a, b2);
        return null == a ? 0 : a;
      }
      function lb(a, b2) {
        a = V2(a, b2);
        return null == a ? "" : a;
      }
      ;
      function mb(a) {
        switch (typeof a) {
          case "number":
            return isFinite(a) ? a : String(a);
          case "object":
            if (a && !Array.isArray(a)) {
              if (Ha(a)) return Ca(a);
              if (a instanceof Ja) {
                var b2 = a.L;
                b2 = null == b2 || "string" === typeof b2 ? b2 : Ga && b2 instanceof Uint8Array ? Ca(b2) : null;
                return (a.L = b2) || "";
              }
            }
        }
        return a;
      }
      ;
      function nb(a) {
        var b2 = ob;
        b2 = void 0 === b2 ? pb : b2;
        return qb(a, b2);
      }
      function rb(a, b2) {
        if (null != a) {
          if (Array.isArray(a)) a = qb(a, b2);
          else if (cb(a)) {
            var c = {}, d;
            for (d in a) c[d] = rb(a[d], b2);
            a = c;
          } else a = b2(a);
          return a;
        }
      }
      function qb(a, b2) {
        for (var c = a.slice(), d = 0; d < c.length; d++) c[d] = rb(c[d], b2);
        Array.isArray(a) && Za(a) & 1 && $a(c);
        return c;
      }
      function ob(a) {
        if (a && "object" == typeof a && a.toJSON) return a.toJSON();
        a = mb(a);
        return Array.isArray(a) ? nb(a) : a;
      }
      function pb(a) {
        return Ha(a) ? new Uint8Array(a) : a;
      }
      ;
      function sb(a, b2, c) {
        a || (a = tb);
        tb = null;
        var d = this.constructor.h;
        a || (a = d ? [d] : []);
        this.h = (d ? 0 : -1) - (this.constructor.g || 0);
        this.j = void 0;
        this.m = a;
        a: {
          d = this.m.length;
          a = d - 1;
          if (d && (d = this.m[a], cb(d))) {
            this.i = a - this.h;
            this.g = d;
            break a;
          }
          void 0 !== b2 && -1 < b2 ? (this.i = Math.max(b2, a + 1 - this.h), this.g = void 0) : this.i = Number.MAX_VALUE;
        }
        if (c) for (b2 = 0; b2 < c.length; b2++) if (a = c[b2], a < this.i) a += this.h, (d = this.m[a]) ? Array.isArray(d) && $a(d) : this.m[a] = db;
        else {
          d = this.g || (this.g = this.m[this.i + this.h] = {});
          var e2 = d[a];
          e2 ? Array.isArray(e2) && $a(e2) : d[a] = db;
        }
      }
      sb.prototype.toJSON = function() {
        return nb(this.m);
      };
      sb.prototype.toString = function() {
        return this.m.toString();
      };
      var tb;
      function ub() {
        sb.apply(this, arguments);
      }
      E2(ub, sb);
      if (fb) {
        var vb = {};
        Object.defineProperties(ub, (vb[Symbol.hasInstance] = gb(function() {
          throw Error("Cannot perform instanceof checks for MutableMessage");
        }), vb));
      }
      ;
      function wb(a, b2, c) {
        if (c) {
          var d = {}, e2;
          for (e2 in c) {
            var g = c[e2], f = g.ha;
            f || (d.F = g.la || g.fa.P, g.aa ? (d.U = xb(g.aa), f = /* @__PURE__ */ function(h) {
              return function(k2, l, m) {
                return h.F(k2, l, m, h.U);
              };
            }(d)) : g.ca ? (d.T = yb(g.X.g, g.ca), f = /* @__PURE__ */ function(h) {
              return function(k2, l, m) {
                return h.F(k2, l, m, h.T);
              };
            }(d)) : f = d.F, g.ha = f);
            f(b2, a, g.X);
            d = { F: d.F, U: d.U, T: d.T };
          }
        }
        Xa(b2, a);
      }
      var zb = Symbol();
      function Ab(a, b2, c) {
        return a[zb] || (a[zb] = function(d, e2) {
          return b2(d, e2, c);
        });
      }
      function Bb(a) {
        var b2 = a[zb];
        if (!b2) {
          var c = Cb(a);
          b2 = function(d, e2) {
            return Db(d, e2, c);
          };
          a[zb] = b2;
        }
        return b2;
      }
      function Eb(a) {
        var b2 = a.aa;
        if (b2) return Bb(b2);
        if (b2 = a.ka) return Ab(a.X.g, b2, a.ca);
      }
      function Fb(a) {
        var b2 = Eb(a), c = a.X, d = a.fa.O;
        return b2 ? function(e2, g) {
          return d(e2, g, c, b2);
        } : function(e2, g) {
          return d(e2, g, c);
        };
      }
      function Gb(a, b2, c, d, e2, g) {
        a = a();
        var f = 0;
        a.length && "number" !== typeof a[0] && (c(b2, a[0]), f++);
        for (; f < a.length; ) {
          c = a[f++];
          for (var h = f + 1; h < a.length && "number" !== typeof a[h]; ) h++;
          var k2 = a[f++];
          h -= f;
          switch (h) {
            case 0:
              d(b2, c, k2);
              break;
            case 1:
              d(b2, c, k2, a[f++]);
              break;
            case 2:
              e2(b2, c, k2, a[f++], a[f++]);
              break;
            case 3:
              h = a[f++];
              var l = a[f++], m = a[f++];
              Array.isArray(m) ? e2(b2, c, k2, h, l, m) : g(b2, c, k2, h, l, m);
              break;
            case 4:
              g(b2, c, k2, a[f++], a[f++], a[f++], a[f++]);
              break;
            default:
              throw Error("unexpected number of binary field arguments: " + h);
          }
        }
        return b2;
      }
      var Hb = Symbol();
      function xb(a) {
        var b2 = a[Hb];
        if (!b2) {
          var c = Ib(a);
          b2 = function(d, e2) {
            return Jb(d, e2, c);
          };
          a[Hb] = b2;
        }
        return b2;
      }
      function yb(a, b2) {
        var c = a[Hb];
        c || (c = function(d, e2) {
          return wb(d, e2, b2);
        }, a[Hb] = c);
        return c;
      }
      var Kb = Symbol();
      function Lb(a, b2) {
        a.push(b2);
      }
      function Mb(a, b2, c) {
        a.push(b2, c.P);
      }
      function Nb(a, b2, c, d, e2) {
        var g = xb(e2), f = c.P;
        a.push(b2, function(h, k2, l) {
          return f(h, k2, l, d, g);
        });
      }
      function Ob(a, b2, c, d, e2, g) {
        var f = yb(d, g), h = c.P;
        a.push(b2, function(k2, l, m) {
          return h(k2, l, m, d, f);
        });
      }
      function Ib(a) {
        var b2 = a[Kb];
        return b2 ? b2 : Gb(a, a[Kb] = [], Lb, Mb, Nb, Ob);
      }
      var Pb = Symbol();
      function Qb(a, b2) {
        a[0] = b2;
      }
      function Rb(a, b2, c, d) {
        var e2 = c.O;
        a[b2] = d ? function(g, f, h) {
          return e2(g, f, h, d);
        } : e2;
      }
      function Sb(a, b2, c, d, e2, g) {
        var f = c.O, h = Bb(e2);
        a[b2] = function(k2, l, m) {
          return f(k2, l, m, d, h, g);
        };
      }
      function Tb(a, b2, c, d, e2, g, f) {
        var h = c.O, k2 = Ab(d, e2, g);
        a[b2] = function(l, m, q2) {
          return h(l, m, q2, d, k2, f);
        };
      }
      function Cb(a) {
        var b2 = a[Pb];
        return b2 ? b2 : Gb(a, a[Pb] = {}, Qb, Rb, Sb, Tb);
      }
      function Db(a, b2, c) {
        for (; Ta(b2) && 4 != b2.h; ) {
          var d = b2.i, e2 = c[d];
          if (!e2) {
            var g = c[0];
            g && (g = g[d]) && (e2 = c[d] = Fb(g));
          }
          if (!e2 || !e2(b2, a, d)) {
            if (e2 = b2, d = a, g = e2.j, Ua(e2), !e2.W) {
              var f = e2.g.h;
              e2 = e2.g.g;
              e2 = g === e2 ? Ia || (Ia = new Uint8Array(0)) : Ka ? f.slice(g, e2) : new Uint8Array(f.subarray(g, e2));
              (g = d.ba) ? g.push(e2) : d.ba = [e2];
            }
          }
        }
        return a;
      }
      function Ub(a, b2, c) {
        if (Va.length) {
          var d = Va.pop();
          a && (Pa(d.g, a), d.i = -1, d.h = -1);
          a = d;
        } else a = new Sa(a);
        try {
          return Db(new b2(), a, Cb(c));
        } finally {
          b2 = a.g, b2.h = null, b2.j = 0, b2.i = 0, b2.g = 0, b2.v = false, a.i = -1, a.h = -1, 100 > Va.length && Va.push(a);
        }
      }
      function Jb(a, b2, c) {
        for (var d = c.length, e2 = 1 == d % 2, g = e2 ? 1 : 0; g < d; g += 2) (0, c[g + 1])(b2, a, c[g]);
        wb(a, b2, e2 ? c[0] : void 0);
      }
      function Vb(a, b2) {
        var c = new Wa();
        Jb(a, c, Ib(b2));
        T2(c, c.g.end());
        a = new Uint8Array(c.h);
        b2 = c.i;
        for (var d = b2.length, e2 = 0, g = 0; g < d; g++) {
          var f = b2[g];
          a.set(f, e2);
          e2 += f.length;
        }
        c.i = [a];
        return a;
      }
      function Wb(a, b2) {
        return { O: a, P: b2 };
      }
      var Y2 = Wb(function(a, b2, c) {
        if (5 !== a.h) return false;
        a = a.g;
        var d = a.h[a.g];
        var e2 = a.h[a.g + 1];
        var g = a.h[a.g + 2], f = a.h[a.g + 3];
        a.g += 4;
        P2(a);
        e2 = (d << 0 | e2 << 8 | g << 16 | f << 24) >>> 0;
        a = 2 * (e2 >> 31) + 1;
        d = e2 >>> 23 & 255;
        e2 &= 8388607;
        W2(b2, c, 255 == d ? e2 ? NaN : Infinity * a : 0 == d ? a * Math.pow(2, -149) * e2 : a * Math.pow(2, d - 150) * (e2 + Math.pow(2, 23)));
        return true;
      }, function(a, b2, c) {
        b2 = V2(b2, c);
        if (null != b2) {
          S(a.g, 8 * c + 5);
          a = a.g;
          var d = b2;
          d = (c = 0 > d ? 1 : 0) ? -d : d;
          0 === d ? 0 < 1 / d ? N2 = O2 = 0 : (O2 = 0, N2 = 2147483648) : isNaN(d) ? (O2 = 0, N2 = 2147483647) : 34028234663852886e22 < d ? (O2 = 0, N2 = (c << 31 | 2139095040) >>> 0) : 11754943508222875e-54 > d ? (d = Math.round(d / Math.pow(2, -149)), O2 = 0, N2 = (c << 31 | d) >>> 0) : (b2 = Math.floor(Math.log(d) / Math.LN2), d *= Math.pow(2, -b2), d = Math.round(8388608 * d), 16777216 <= d && ++b2, O2 = 0, N2 = (c << 31 | b2 + 127 << 23 | d & 8388607) >>> 0);
          c = N2;
          a.g.push(c >>> 0 & 255);
          a.g.push(c >>> 8 & 255);
          a.g.push(c >>> 16 & 255);
          a.g.push(c >>> 24 & 255);
        }
      }), Xb = Wb(function(a, b2, c) {
        if (0 !== a.h) return false;
        for (var d = a.g, e2 = 128, g = 0, f = a = 0; 4 > f && 128 <= e2; f++) e2 = d.h[d.g++], P2(d), g |= (e2 & 127) << 7 * f;
        128 <= e2 && (e2 = d.h[d.g++], P2(d), g |= (e2 & 127) << 28, a |= (e2 & 127) >> 4);
        if (128 <= e2) for (f = 0; 5 > f && 128 <= e2; f++) e2 = d.h[d.g++], P2(d), a |= (e2 & 127) << 7 * f + 3;
        if (128 > e2) {
          d = g >>> 0;
          e2 = a >>> 0;
          if (a = e2 & 2147483648) d = ~d + 1 >>> 0, e2 = ~e2 >>> 0, 0 == d && (e2 = e2 + 1 >>> 0);
          d = 4294967296 * e2 + (d >>> 0);
        } else throw Na();
        W2(b2, c, a ? -d : d);
        return true;
      }, function(a, b2, c) {
        b2 = V2(b2, c);
        if (null != b2 && null != b2) {
          S(a.g, 8 * c);
          a = a.g;
          var d = b2;
          c = 0 > d;
          d = Math.abs(d);
          b2 = d >>> 0;
          d = Math.floor((d - b2) / 4294967296);
          d >>>= 0;
          c && (d = ~d >>> 0, b2 = (~b2 >>> 0) + 1, 4294967295 < b2 && (b2 = 0, d++, 4294967295 < d && (d = 0)));
          N2 = b2;
          O2 = d;
          c = N2;
          for (b2 = O2; 0 < b2 || 127 < c; ) a.g.push(c & 127 | 128), c = (c >>> 7 | b2 << 25) >>> 0, b2 >>>= 7;
          a.g.push(c);
        }
      }), Yb = Wb(function(a, b2, c) {
        if (0 !== a.h) return false;
        W2(b2, c, Q2(a.g));
        return true;
      }, function(a, b2, c) {
        b2 = V2(b2, c);
        if (null != b2 && null != b2) if (S(a.g, 8 * c), a = a.g, c = b2, 0 <= c) S(a, c);
        else {
          for (b2 = 0; 9 > b2; b2++) a.g.push(c & 127 | 128), c >>= 7;
          a.g.push(1);
        }
      }), Zb = Wb(function(a, b2, c) {
        if (2 !== a.h) return false;
        var d = Q2(a.g) >>> 0;
        a = a.g;
        var e2 = a.g;
        a.g += d;
        P2(a);
        a = a.h;
        var g;
        if (ya) (g = xa) || (g = xa = new TextDecoder("utf-8", { fatal: true })), g = g.decode(a.subarray(e2, e2 + d));
        else {
          d = e2 + d;
          for (var f = [], h = null, k2, l, m; e2 < d; ) k2 = a[e2++], 128 > k2 ? f.push(k2) : 224 > k2 ? e2 >= d ? L2() : (l = a[e2++], 194 > k2 || 128 !== (l & 192) ? (e2--, L2()) : f.push((k2 & 31) << 6 | l & 63)) : 240 > k2 ? e2 >= d - 1 ? L2() : (l = a[e2++], 128 !== (l & 192) || 224 === k2 && 160 > l || 237 === k2 && 160 <= l || 128 !== ((g = a[e2++]) & 192) ? (e2--, L2()) : f.push((k2 & 15) << 12 | (l & 63) << 6 | g & 63)) : 244 >= k2 ? e2 >= d - 2 ? L2() : (l = a[e2++], 128 !== (l & 192) || 0 !== (k2 << 28) + (l - 144) >> 30 || 128 !== ((g = a[e2++]) & 192) || 128 !== ((m = a[e2++]) & 192) ? (e2--, L2()) : (k2 = (k2 & 7) << 18 | (l & 63) << 12 | (g & 63) << 6 | m & 63, k2 -= 65536, f.push((k2 >> 10 & 1023) + 55296, (k2 & 1023) + 56320))) : L2(), 8192 <= f.length && (h = wa(h, f), f.length = 0);
          g = wa(h, f);
        }
        W2(b2, c, g);
        return true;
      }, function(a, b2, c) {
        b2 = V2(b2, c);
        if (null != b2) {
          var d = false;
          d = void 0 === d ? false : d;
          if (Aa) {
            if (d && /(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(b2)) throw Error("Found an unpaired surrogate");
            b2 = (za || (za = new TextEncoder())).encode(b2);
          } else {
            for (var e2 = 0, g = new Uint8Array(3 * b2.length), f = 0; f < b2.length; f++) {
              var h = b2.charCodeAt(f);
              if (128 > h) g[e2++] = h;
              else {
                if (2048 > h) g[e2++] = h >> 6 | 192;
                else {
                  if (55296 <= h && 57343 >= h) {
                    if (56319 >= h && f < b2.length) {
                      var k2 = b2.charCodeAt(++f);
                      if (56320 <= k2 && 57343 >= k2) {
                        h = 1024 * (h - 55296) + k2 - 56320 + 65536;
                        g[e2++] = h >> 18 | 240;
                        g[e2++] = h >> 12 & 63 | 128;
                        g[e2++] = h >> 6 & 63 | 128;
                        g[e2++] = h & 63 | 128;
                        continue;
                      } else f--;
                    }
                    if (d) throw Error("Found an unpaired surrogate");
                    h = 65533;
                  }
                  g[e2++] = h >> 12 | 224;
                  g[e2++] = h >> 6 & 63 | 128;
                }
                g[e2++] = h & 63 | 128;
              }
            }
            b2 = g.subarray(0, e2);
          }
          S(a.g, 8 * c + 2);
          S(a.g, b2.length);
          T2(a, a.g.end());
          T2(a, b2);
        }
      }), $b = Wb(function(a, b2, c, d, e2) {
        if (2 !== a.h) return false;
        b2 = jb(b2, c, d);
        c = a.g.i;
        d = Q2(a.g) >>> 0;
        var g = a.g.g + d, f = g - c;
        0 >= f && (a.g.i = g, e2(b2, a), f = g - a.g.g);
        if (f) throw Error("Message parsing ended unexpectedly. Expected to read " + (d + " bytes, instead read " + (d - f) + " bytes, either the data ended unexpectedly or the message misreported its own length"));
        a.g.g = g;
        a.g.i = c;
        return true;
      }, function(a, b2, c, d, e2) {
        b2 = ib(b2, d, c);
        if (null != b2) for (d = 0; d < b2.length; d++) {
          var g = a;
          S(g.g, 8 * c + 2);
          var f = g.g.end();
          T2(g, f);
          f.push(g.h);
          g = f;
          e2(b2[d], a);
          f = a;
          var h = g.pop();
          for (h = f.h + f.g.length() - h; 127 < h; ) g.push(h & 127 | 128), h >>>= 7, f.h++;
          g.push(h);
          f.h++;
        }
      });
      function Z2() {
        ub.apply(this, arguments);
      }
      E2(Z2, ub);
      if (fb) {
        var ac = {};
        Object.defineProperties(Z2, (ac[Symbol.hasInstance] = gb(Object[Symbol.hasInstance]), ac));
      }
      ;
      function bc(a) {
        Z2.call(this, a);
      }
      E2(bc, Z2);
      function cc() {
        return [1, Yb, 2, Y2, 3, Zb, 4, Zb];
      }
      ;
      function dc(a) {
        Z2.call(this, a, -1, ec);
      }
      E2(dc, Z2);
      dc.prototype.addClassification = function(a, b2) {
        jb(this, 1, bc, a, b2);
        return this;
      };
      function fc() {
        return [1, $b, bc, cc];
      }
      var ec = [1];
      function gc(a) {
        Z2.call(this, a);
      }
      E2(gc, Z2);
      function hc() {
        return [1, Y2, 2, Y2, 3, Y2, 4, Y2, 5, Y2];
      }
      ;
      function ic(a) {
        Z2.call(this, a, -1, jc);
      }
      E2(ic, Z2);
      function kc() {
        return [1, $b, gc, hc];
      }
      var jc = [1];
      function lc(a) {
        Z2.call(this, a);
      }
      E2(lc, Z2);
      function mc() {
        return [1, Y2, 2, Y2, 3, Y2, 4, Y2, 5, Y2, 6, Xb];
      }
      ;
      var nc = [[61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314], [314, 405], [405, 321], [321, 375], [375, 291], [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [78, 95], [95, 88], [88, 178], [178, 87], [87, 14], [14, 317], [317, 402], [402, 318], [318, 324], [324, 308], [78, 191], [191, 80], [80, 81], [81, 82], [82, 13], [13, 312], [312, 311], [311, 310], [310, 415], [415, 308]], oc = [[263, 249], [249, 390], [390, 373], [373, 374], [374, 380], [380, 381], [381, 382], [382, 362], [263, 466], [466, 388], [388, 387], [387, 386], [
        386,
        385
      ], [385, 384], [384, 398], [398, 362]], pc = [[276, 283], [283, 282], [282, 295], [295, 285], [300, 293], [293, 334], [334, 296], [296, 336]], qc = [[33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154], [154, 155], [155, 133], [33, 246], [246, 161], [161, 160], [160, 159], [159, 158], [158, 157], [157, 173], [173, 133]], rc = [[46, 53], [53, 52], [52, 65], [65, 55], [70, 63], [63, 105], [105, 66], [66, 107]], sc = [
        [10, 338],
        [338, 297],
        [297, 332],
        [332, 284],
        [284, 251],
        [251, 389],
        [389, 356],
        [356, 454],
        [454, 323],
        [323, 361],
        [361, 288],
        [288, 397],
        [397, 365],
        [365, 379],
        [379, 378],
        [378, 400],
        [400, 377],
        [377, 152],
        [152, 148],
        [148, 176],
        [176, 149],
        [149, 150],
        [150, 136],
        [136, 172],
        [172, 58],
        [58, 132],
        [132, 93],
        [93, 234],
        [234, 127],
        [127, 162],
        [162, 21],
        [21, 54],
        [54, 103],
        [103, 67],
        [67, 109],
        [109, 10]
      ], tc = [].concat(D2(nc), D2(oc), D2(pc), D2(qc), D2(rc), D2(sc));
      function uc(a, b2, c) {
        c = a.createShader(0 === c ? a.VERTEX_SHADER : a.FRAGMENT_SHADER);
        a.shaderSource(c, b2);
        a.compileShader(c);
        if (!a.getShaderParameter(c, a.COMPILE_STATUS)) throw Error("Could not compile WebGL shader.\n\n" + a.getShaderInfoLog(c));
        return c;
      }
      ;
      function vc(a) {
        return ib(a, bc, 1).map(function(b2) {
          return { index: kb(b2, 1), ga: X2(b2, 2), label: null != V2(b2, 3) ? lb(b2, 3) : void 0, displayName: null != V2(b2, 4) ? lb(b2, 4) : void 0 };
        });
      }
      ;
      function wc(a) {
        return { x: X2(a, 1), y: X2(a, 2), z: X2(a, 3), visibility: null != V2(a, 4) ? X2(a, 4) : void 0 };
      }
      ;
      function xc(a, b2) {
        this.h = a;
        this.g = b2;
        this.l = 0;
      }
      function yc(a, b2, c) {
        zc(a, b2);
        if ("function" === typeof a.g.canvas.transferToImageBitmap) return Promise.resolve(a.g.canvas.transferToImageBitmap());
        if (c) return Promise.resolve(a.g.canvas);
        if ("function" === typeof createImageBitmap) return createImageBitmap(a.g.canvas);
        void 0 === a.i && (a.i = document.createElement("canvas"));
        return new Promise(function(d) {
          a.i.height = a.g.canvas.height;
          a.i.width = a.g.canvas.width;
          a.i.getContext("2d", {}).drawImage(a.g.canvas, 0, 0, a.g.canvas.width, a.g.canvas.height);
          d(a.i);
        });
      }
      function zc(a, b2) {
        var c = a.g;
        if (void 0 === a.o) {
          var d = uc(c, "\n  attribute vec2 aVertex;\n  attribute vec2 aTex;\n  varying vec2 vTex;\n  void main(void) {\n    gl_Position = vec4(aVertex, 0.0, 1.0);\n    vTex = aTex;\n  }", 0), e2 = uc(c, "\n  precision mediump float;\n  varying vec2 vTex;\n  uniform sampler2D sampler0;\n  void main(){\n    gl_FragColor = texture2D(sampler0, vTex);\n  }", 1), g = c.createProgram();
          c.attachShader(g, d);
          c.attachShader(g, e2);
          c.linkProgram(g);
          if (!c.getProgramParameter(g, c.LINK_STATUS)) throw Error("Could not compile WebGL program.\n\n" + c.getProgramInfoLog(g));
          d = a.o = g;
          c.useProgram(d);
          e2 = c.getUniformLocation(d, "sampler0");
          a.j = { K: c.getAttribLocation(d, "aVertex"), J: c.getAttribLocation(d, "aTex"), ma: e2 };
          a.u = c.createBuffer();
          c.bindBuffer(c.ARRAY_BUFFER, a.u);
          c.enableVertexAttribArray(a.j.K);
          c.vertexAttribPointer(a.j.K, 2, c.FLOAT, false, 0, 0);
          c.bufferData(c.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), c.STATIC_DRAW);
          c.bindBuffer(c.ARRAY_BUFFER, null);
          a.s = c.createBuffer();
          c.bindBuffer(c.ARRAY_BUFFER, a.s);
          c.enableVertexAttribArray(a.j.J);
          c.vertexAttribPointer(
            a.j.J,
            2,
            c.FLOAT,
            false,
            0,
            0
          );
          c.bufferData(c.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), c.STATIC_DRAW);
          c.bindBuffer(c.ARRAY_BUFFER, null);
          c.uniform1i(e2, 0);
        }
        d = a.j;
        c.useProgram(a.o);
        c.canvas.width = b2.width;
        c.canvas.height = b2.height;
        c.viewport(0, 0, b2.width, b2.height);
        c.activeTexture(c.TEXTURE0);
        a.h.bindTexture2d(b2.glName);
        c.enableVertexAttribArray(d.K);
        c.bindBuffer(c.ARRAY_BUFFER, a.u);
        c.vertexAttribPointer(d.K, 2, c.FLOAT, false, 0, 0);
        c.enableVertexAttribArray(d.J);
        c.bindBuffer(c.ARRAY_BUFFER, a.s);
        c.vertexAttribPointer(
          d.J,
          2,
          c.FLOAT,
          false,
          0,
          0
        );
        c.bindFramebuffer(c.DRAW_FRAMEBUFFER ? c.DRAW_FRAMEBUFFER : c.FRAMEBUFFER, null);
        c.clearColor(0, 0, 0, 0);
        c.clear(c.COLOR_BUFFER_BIT);
        c.colorMask(true, true, true, true);
        c.drawArrays(c.TRIANGLE_FAN, 0, 4);
        c.disableVertexAttribArray(d.K);
        c.disableVertexAttribArray(d.J);
        c.bindBuffer(c.ARRAY_BUFFER, null);
        a.h.bindTexture2d(0);
      }
      function Ac(a) {
        this.g = a;
      }
      ;
      var Bc = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 9, 1, 7, 0, 65, 0, 253, 15, 26, 11]);
      function Cc(a, b2) {
        return b2 + a;
      }
      function Dc(a, b2) {
        window[a] = b2;
      }
      function Ec(a) {
        var b2 = document.createElement("script");
        b2.setAttribute("src", a);
        b2.setAttribute("crossorigin", "anonymous");
        return new Promise(function(c) {
          b2.addEventListener("load", function() {
            c();
          }, false);
          b2.addEventListener("error", function() {
            c();
          }, false);
          document.body.appendChild(b2);
        });
      }
      function Fc() {
        return J2(function(a) {
          switch (a.g) {
            case 1:
              return a.o = 2, G2(a, WebAssembly.instantiate(Bc), 4);
            case 4:
              a.g = 3;
              a.o = 0;
              break;
            case 2:
              return a.o = 0, a.j = null, a.return(false);
            case 3:
              return a.return(true);
          }
        });
      }
      function Gc(a) {
        this.g = a;
        this.listeners = {};
        this.j = {};
        this.H = {};
        this.o = {};
        this.u = {};
        this.I = this.s = this.Z = true;
        this.D = Promise.resolve();
        this.Y = "";
        this.C = {};
        this.locateFile = a && a.locateFile || Cc;
        if ("object" === typeof window) var b2 = window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/";
        else if ("undefined" !== typeof location) b2 = location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/";
        else throw Error("solutions can only be loaded on a web page or in a web worker");
        this.$ = b2;
        if (a.options) {
          b2 = C2(Object.keys(a.options));
          for (var c = b2.next(); !c.done; c = b2.next()) {
            c = c.value;
            var d = a.options[c].default;
            void 0 !== d && (this.j[c] = "function" === typeof d ? d() : d);
          }
        }
      }
      x = Gc.prototype;
      x.close = function() {
        this.i && this.i.delete();
        return Promise.resolve();
      };
      function Hc(a) {
        var b2, c, d, e2, g, f, h, k2, l, m, q2;
        return J2(function(p) {
          switch (p.g) {
            case 1:
              if (!a.Z) return p.return();
              b2 = void 0 === a.g.files ? [] : "function" === typeof a.g.files ? a.g.files(a.j) : a.g.files;
              return G2(p, Fc(), 2);
            case 2:
              c = p.h;
              if ("object" === typeof window) return Dc("createMediapipeSolutionsWasm", { locateFile: a.locateFile }), Dc("createMediapipeSolutionsPackedAssets", { locateFile: a.locateFile }), f = b2.filter(function(n) {
                return void 0 !== n.data;
              }), h = b2.filter(function(n) {
                return void 0 === n.data;
              }), k2 = Promise.all(f.map(function(n) {
                var r = Ic(a, n.url);
                if (void 0 !== n.path) {
                  var t = n.path;
                  r = r.then(function(w) {
                    a.overrideFile(t, w);
                    return Promise.resolve(w);
                  });
                }
                return r;
              })), l = Promise.all(h.map(function(n) {
                return void 0 === n.simd || n.simd && c || !n.simd && !c ? Ec(a.locateFile(n.url, a.$)) : Promise.resolve();
              })).then(function() {
                var n, r, t;
                return J2(function(w) {
                  if (1 == w.g) return n = window.createMediapipeSolutionsWasm, r = window.createMediapipeSolutionsPackedAssets, t = a, G2(w, n(r), 2);
                  t.h = w.h;
                  w.g = 0;
                });
              }), m = function() {
                return J2(function(n) {
                  a.g.graph && a.g.graph.url ? n = G2(
                    n,
                    Ic(a, a.g.graph.url),
                    0
                  ) : (n.g = 0, n = void 0);
                  return n;
                });
              }(), G2(p, Promise.all([l, k2, m]), 7);
              if ("function" !== typeof importScripts) throw Error("solutions can only be loaded on a web page or in a web worker");
              d = b2.filter(function(n) {
                return void 0 === n.simd || n.simd && c || !n.simd && !c;
              }).map(function(n) {
                return a.locateFile(n.url, a.$);
              });
              importScripts.apply(null, D2(d));
              e2 = a;
              return G2(p, createMediapipeSolutionsWasm(Module), 6);
            case 6:
              e2.h = p.h;
              a.l = new OffscreenCanvas(1, 1);
              a.h.canvas = a.l;
              g = a.h.GL.createContext(a.l, {
                antialias: false,
                alpha: false,
                ja: "undefined" !== typeof WebGL2RenderingContext ? 2 : 1
              });
              a.h.GL.makeContextCurrent(g);
              p.g = 4;
              break;
            case 7:
              a.l = document.createElement("canvas");
              q2 = a.l.getContext("webgl2", {});
              if (!q2 && (q2 = a.l.getContext("webgl", {}), !q2)) return alert("Failed to create WebGL canvas context when passing video frame."), p.return();
              a.G = q2;
              a.h.canvas = a.l;
              a.h.createContext(a.l, true, true, {});
            case 4:
              a.i = new a.h.SolutionWasm(), a.Z = false, p.g = 0;
          }
        });
      }
      function Jc(a) {
        var b2, c, d, e2, g, f, h, k2;
        return J2(function(l) {
          if (1 == l.g) {
            if (a.g.graph && a.g.graph.url && a.Y === a.g.graph.url) return l.return();
            a.s = true;
            if (!a.g.graph || !a.g.graph.url) {
              l.g = 2;
              return;
            }
            a.Y = a.g.graph.url;
            return G2(l, Ic(a, a.g.graph.url), 3);
          }
          2 != l.g && (b2 = l.h, a.i.loadGraph(b2));
          c = C2(Object.keys(a.C));
          for (d = c.next(); !d.done; d = c.next()) e2 = d.value, a.i.overrideFile(e2, a.C[e2]);
          a.C = {};
          if (a.g.listeners) for (g = C2(a.g.listeners), f = g.next(); !f.done; f = g.next()) h = f.value, Kc(a, h);
          k2 = a.j;
          a.j = {};
          a.setOptions(k2);
          l.g = 0;
        });
      }
      x.reset = function() {
        var a = this;
        return J2(function(b2) {
          a.i && (a.i.reset(), a.o = {}, a.u = {});
          b2.g = 0;
        });
      };
      x.setOptions = function(a, b2) {
        var c = this;
        if (b2 = b2 || this.g.options) {
          for (var d = [], e2 = [], g = {}, f = C2(Object.keys(a)), h = f.next(); !h.done; g = { R: g.R, S: g.S }, h = f.next()) {
            var k2 = h.value;
            k2 in this.j && this.j[k2] === a[k2] || (this.j[k2] = a[k2], h = b2[k2], void 0 !== h && (h.onChange && (g.R = h.onChange, g.S = a[k2], d.push(/* @__PURE__ */ function(l) {
              return function() {
                var m;
                return J2(function(q2) {
                  if (1 == q2.g) return G2(q2, l.R(l.S), 2);
                  m = q2.h;
                  true === m && (c.s = true);
                  q2.g = 0;
                });
              };
            }(g))), h.graphOptionXref && (k2 = { valueNumber: 1 === h.type ? a[k2] : 0, valueBoolean: 0 === h.type ? a[k2] : false, valueString: 2 === h.type ? a[k2] : "" }, h = Object.assign(Object.assign(Object.assign({}, { calculatorName: "", calculatorIndex: 0 }), h.graphOptionXref), k2), e2.push(h))));
          }
          if (0 !== d.length || 0 !== e2.length) this.s = true, this.B = (void 0 === this.B ? [] : this.B).concat(e2), this.A = (void 0 === this.A ? [] : this.A).concat(d);
        }
      };
      function Lc(a) {
        var b2, c, d, e2, g, f, h;
        return J2(function(k2) {
          switch (k2.g) {
            case 1:
              if (!a.s) return k2.return();
              if (!a.A) {
                k2.g = 2;
                break;
              }
              b2 = C2(a.A);
              c = b2.next();
            case 3:
              if (c.done) {
                k2.g = 5;
                break;
              }
              d = c.value;
              return G2(k2, d(), 4);
            case 4:
              c = b2.next();
              k2.g = 3;
              break;
            case 5:
              a.A = void 0;
            case 2:
              if (a.B) {
                e2 = new a.h.GraphOptionChangeRequestList();
                g = C2(a.B);
                for (f = g.next(); !f.done; f = g.next()) h = f.value, e2.push_back(h);
                a.i.changeOptions(e2);
                e2.delete();
                a.B = void 0;
              }
              a.s = false;
              k2.g = 0;
          }
        });
      }
      x.initialize = function() {
        var a = this;
        return J2(function(b2) {
          return 1 == b2.g ? G2(b2, Hc(a), 2) : 3 != b2.g ? G2(b2, Jc(a), 3) : G2(b2, Lc(a), 0);
        });
      };
      function Ic(a, b2) {
        var c, d;
        return J2(function(e2) {
          if (b2 in a.H) return e2.return(a.H[b2]);
          c = a.locateFile(b2, "");
          d = fetch(c).then(function(g) {
            return g.arrayBuffer();
          });
          a.H[b2] = d;
          return e2.return(d);
        });
      }
      x.overrideFile = function(a, b2) {
        this.i ? this.i.overrideFile(a, b2) : this.C[a] = b2;
      };
      x.clearOverriddenFiles = function() {
        this.C = {};
        this.i && this.i.clearOverriddenFiles();
      };
      x.send = function(a, b2) {
        var c = this, d, e2, g, f, h, k2, l, m, q2;
        return J2(function(p) {
          switch (p.g) {
            case 1:
              if (!c.g.inputs) return p.return();
              d = 1e3 * (void 0 === b2 || null === b2 ? performance.now() : b2);
              return G2(p, c.D, 2);
            case 2:
              return G2(p, c.initialize(), 3);
            case 3:
              e2 = new c.h.PacketDataList();
              g = C2(Object.keys(a));
              for (f = g.next(); !f.done; f = g.next()) if (h = f.value, k2 = c.g.inputs[h]) {
                a: {
                  var n = a[h];
                  switch (k2.type) {
                    case "video":
                      var r = c.o[k2.stream];
                      r || (r = new xc(c.h, c.G), c.o[k2.stream] = r);
                      0 === r.l && (r.l = r.h.createTexture());
                      if ("undefined" !== typeof HTMLVideoElement && n instanceof HTMLVideoElement) {
                        var t = n.videoWidth;
                        var w = n.videoHeight;
                      } else "undefined" !== typeof HTMLImageElement && n instanceof HTMLImageElement ? (t = n.naturalWidth, w = n.naturalHeight) : (t = n.width, w = n.height);
                      w = { glName: r.l, width: t, height: w };
                      t = r.g;
                      t.canvas.width = w.width;
                      t.canvas.height = w.height;
                      t.activeTexture(t.TEXTURE0);
                      r.h.bindTexture2d(r.l);
                      t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, n);
                      r.h.bindTexture2d(0);
                      r = w;
                      break a;
                    case "detections":
                      r = c.o[k2.stream];
                      r || (r = new Ac(c.h), c.o[k2.stream] = r);
                      r.data || (r.data = new r.g.DetectionListData());
                      r.data.reset(n.length);
                      for (w = 0; w < n.length; ++w) {
                        t = n[w];
                        var v = r.data, A2 = v.setBoundingBox, I2 = w;
                        var F2 = t.boundingBox;
                        var u = new lc();
                        W2(u, 1, F2.xCenter);
                        W2(u, 2, F2.yCenter);
                        W2(u, 3, F2.height);
                        W2(u, 4, F2.width);
                        W2(u, 5, F2.rotation);
                        W2(u, 6, F2.rectId);
                        F2 = Vb(u, mc);
                        A2.call(v, I2, F2);
                        if (t.landmarks) for (v = 0; v < t.landmarks.length; ++v) {
                          u = t.landmarks[v];
                          var z2 = u.visibility ? true : false;
                          A2 = r.data;
                          I2 = A2.addNormalizedLandmark;
                          F2 = w;
                          u = Object.assign(Object.assign({}, u), { visibility: z2 ? u.visibility : 0 });
                          z2 = new gc();
                          W2(
                            z2,
                            1,
                            u.x
                          );
                          W2(z2, 2, u.y);
                          W2(z2, 3, u.z);
                          u.visibility && W2(z2, 4, u.visibility);
                          u = Vb(z2, hc);
                          I2.call(A2, F2, u);
                        }
                        if (t.V) for (v = 0; v < t.V.length; ++v) A2 = r.data, I2 = A2.addClassification, F2 = w, u = t.V[v], z2 = new bc(), W2(z2, 2, u.ga), u.index && W2(z2, 1, u.index), u.label && W2(z2, 3, u.label), u.displayName && W2(z2, 4, u.displayName), u = Vb(z2, cc), I2.call(A2, F2, u);
                      }
                      r = r.data;
                      break a;
                    default:
                      r = {};
                  }
                }
                l = r;
                m = k2.stream;
                switch (k2.type) {
                  case "video":
                    e2.pushTexture2d(Object.assign(Object.assign({}, l), { stream: m, timestamp: d }));
                    break;
                  case "detections":
                    q2 = l;
                    q2.stream = m;
                    q2.timestamp = d;
                    e2.pushDetectionList(q2);
                    break;
                  default:
                    throw Error("Unknown input config type: '" + k2.type + "'");
                }
              }
              c.i.send(e2);
              return G2(p, c.D, 4);
            case 4:
              e2.delete(), p.g = 0;
          }
        });
      };
      function Mc(a, b2, c) {
        var d, e2, g, f, h, k2, l, m, q2, p, n, r, t, w;
        return J2(function(v) {
          switch (v.g) {
            case 1:
              if (!c) return v.return(b2);
              d = {};
              e2 = 0;
              g = C2(Object.keys(c));
              for (f = g.next(); !f.done; f = g.next()) h = f.value, k2 = c[h], "string" !== typeof k2 && "texture" === k2.type && void 0 !== b2[k2.stream] && ++e2;
              1 < e2 && (a.I = false);
              l = C2(Object.keys(c));
              f = l.next();
            case 2:
              if (f.done) {
                v.g = 4;
                break;
              }
              m = f.value;
              q2 = c[m];
              if ("string" === typeof q2) return t = d, w = m, G2(v, Nc(a, m, b2[q2]), 14);
              p = b2[q2.stream];
              if ("detection_list" === q2.type) {
                if (p) {
                  var A2 = p.getRectList();
                  for (var I2 = p.getLandmarksList(), F2 = p.getClassificationsList(), u = [], z2 = 0; z2 < A2.size(); ++z2) {
                    var R2 = Ub(A2.get(z2), lc, mc);
                    R2 = { boundingBox: { xCenter: X2(R2, 1), yCenter: X2(R2, 2), height: X2(R2, 3), width: X2(R2, 4), rotation: X2(R2, 5, 0), rectId: kb(R2, 6) }, landmarks: ib(Ub(I2.get(z2), ic, kc), gc, 1).map(wc), V: vc(Ub(F2.get(z2), dc, fc)) };
                    u.push(R2);
                  }
                  A2 = u;
                } else A2 = [];
                d[m] = A2;
                v.g = 7;
                break;
              }
              if ("proto_list" === q2.type) {
                if (p) {
                  A2 = Array(p.size());
                  for (I2 = 0; I2 < p.size(); I2++) A2[I2] = p.get(I2);
                  p.delete();
                } else A2 = [];
                d[m] = A2;
                v.g = 7;
                break;
              }
              if (void 0 === p) {
                v.g = 3;
                break;
              }
              if ("float_list" === q2.type) {
                d[m] = p;
                v.g = 7;
                break;
              }
              if ("proto" === q2.type) {
                d[m] = p;
                v.g = 7;
                break;
              }
              if ("texture" !== q2.type) throw Error("Unknown output config type: '" + q2.type + "'");
              n = a.u[m];
              n || (n = new xc(a.h, a.G), a.u[m] = n);
              return G2(v, yc(n, p, a.I), 13);
            case 13:
              r = v.h, d[m] = r;
            case 7:
              q2.transform && d[m] && (d[m] = q2.transform(d[m]));
              v.g = 3;
              break;
            case 14:
              t[w] = v.h;
            case 3:
              f = l.next();
              v.g = 2;
              break;
            case 4:
              return v.return(d);
          }
        });
      }
      function Nc(a, b2, c) {
        var d;
        return J2(function(e2) {
          return "number" === typeof c || c instanceof Uint8Array || c instanceof a.h.Uint8BlobList ? e2.return(c) : c instanceof a.h.Texture2dDataOut ? (d = a.u[b2], d || (d = new xc(a.h, a.G), a.u[b2] = d), e2.return(yc(d, c, a.I))) : e2.return(void 0);
        });
      }
      function Kc(a, b2) {
        for (var c = b2.name || "$", d = [].concat(D2(b2.wants)), e2 = new a.h.StringList(), g = C2(b2.wants), f = g.next(); !f.done; f = g.next()) e2.push_back(f.value);
        g = a.h.PacketListener.implement({ onResults: function(h) {
          for (var k2 = {}, l = 0; l < b2.wants.length; ++l) k2[d[l]] = h.get(l);
          var m = a.listeners[c];
          m && (a.D = Mc(a, k2, b2.outs).then(function(q2) {
            q2 = m(q2);
            for (var p = 0; p < b2.wants.length; ++p) {
              var n = k2[d[p]];
              "object" === typeof n && n.hasOwnProperty && n.hasOwnProperty("delete") && n.delete();
            }
            q2 && (a.D = q2);
          }));
        } });
        a.i.attachMultiListener(e2, g);
        e2.delete();
      }
      x.onResults = function(a, b2) {
        this.listeners[b2 || "$"] = a;
      };
      K2("Solution", Gc);
      K2("OptionType", { BOOL: 0, NUMBER: 1, ia: 2, 0: "BOOL", 1: "NUMBER", 2: "STRING" });
      function Oc(a) {
        var b2 = this;
        a = a || {};
        var c = { url: "face_detection_short.binarypb" }, d = { type: 1, graphOptionXref: { calculatorType: "TensorsToDetectionsCalculator", calculatorName: "facedetectionshortrangegpu__facedetectionshortrangecommon__TensorsToDetectionsCalculator", fieldName: "min_score_thresh" } };
        this.g = new Gc({
          locateFile: a.locateFile,
          files: [{ data: true, url: "face_detection_short.binarypb" }, { data: true, url: "face_detection_short_range.tflite" }, { simd: true, url: "face_detection_solution_simd_wasm_bin.js" }, { simd: false, url: "face_detection_solution_wasm_bin.js" }],
          graph: c,
          listeners: [{ wants: ["detections", "image_transformed"], outs: { image: "image_transformed", detections: { type: "detection_list", stream: "detections" } } }],
          inputs: { image: { type: "video", stream: "input_frames_gpu" } },
          options: { useCpuInference: { type: 0, graphOptionXref: { calculatorType: "InferenceCalculator", fieldName: "use_cpu_inference" }, default: "object" !== typeof window || void 0 === window.navigator ? false : "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document }, selfieMode: { type: 0, graphOptionXref: { calculatorType: "GlScalerCalculator", calculatorIndex: 1, fieldName: "flip_horizontal" } }, model: { type: 0, onChange: function(e2) {
            var g, f, h, k2, l, m;
            return J2(function(q2) {
              switch (q2.g) {
                case 1:
                  g = "short" === e2 ? ["face_detection_short_range.tflite"] : ["face_detection_full_range_sparse.tflite"], f = C2(g), h = f.next();
                case 2:
                  if (h.done) {
                    q2.g = 4;
                    break;
                  }
                  k2 = h.value;
                  l = "third_party/mediapipe/modules/face_detection/" + k2;
                  return G2(q2, Ic(b2.g, k2), 5);
                case 5:
                  m = q2.h;
                  b2.g.overrideFile(l, m);
                  h = f.next();
                  q2.g = 2;
                  break;
                case 4:
                  return c.url = "short" === e2 ? "face_detection_short.binarypb" : "face_detection_full.binarypb", d.graphOptionXref.calculatorName = "short" === e2 ? "facedetectionshortrangegpu__facedetectionshortrangecommon__TensorsToDetectionsCalculator" : "facedetectionfullrangegpu__facedetectionfullrangecommon__TensorsToDetectionsCalculator", q2.return(true);
              }
            });
          } }, minDetectionConfidence: d }
        });
      }
      x = Oc.prototype;
      x.close = function() {
        this.g.close();
        return Promise.resolve();
      };
      x.onResults = function(a) {
        this.g.onResults(a);
      };
      x.initialize = function() {
        var a = this;
        return J2(function(b2) {
          return G2(b2, a.g.initialize(), 0);
        });
      };
      x.reset = function() {
        this.g.reset();
      };
      x.send = function(a) {
        var b2 = this;
        return J2(function(c) {
          return G2(c, b2.g.send(a), 0);
        });
      };
      x.setOptions = function(a) {
        this.g.setOptions(a);
      };
      K2("FaceDetection", Oc);
      K2("FACEDETECTION_LIPS", nc);
      K2("FACEDETECTION_LEFT_EYE", oc);
      K2("FACEDETECTION_LEFT_EYEBROW", pc);
      K2("FACEDETECTION_RIGHT_EYE", qc);
      K2("FACEDETECTION_RIGHT_EYEBROW", rc);
      K2("FACEDETECTION_FACE_OVAL", sc);
      K2("FACEDETECTION_CONTOURS", tc);
      K2("FACEDETECTION_TESSELATION", [
        [127, 34],
        [34, 139],
        [139, 127],
        [11, 0],
        [0, 37],
        [37, 11],
        [232, 231],
        [231, 120],
        [120, 232],
        [72, 37],
        [37, 39],
        [39, 72],
        [128, 121],
        [121, 47],
        [47, 128],
        [232, 121],
        [121, 128],
        [128, 232],
        [104, 69],
        [69, 67],
        [67, 104],
        [175, 171],
        [171, 148],
        [148, 175],
        [118, 50],
        [50, 101],
        [101, 118],
        [73, 39],
        [39, 40],
        [40, 73],
        [9, 151],
        [151, 108],
        [108, 9],
        [48, 115],
        [115, 131],
        [131, 48],
        [194, 204],
        [204, 211],
        [211, 194],
        [74, 40],
        [40, 185],
        [185, 74],
        [80, 42],
        [42, 183],
        [183, 80],
        [40, 92],
        [92, 186],
        [186, 40],
        [230, 229],
        [229, 118],
        [118, 230],
        [202, 212],
        [212, 214],
        [214, 202],
        [83, 18],
        [18, 17],
        [17, 83],
        [76, 61],
        [61, 146],
        [146, 76],
        [160, 29],
        [29, 30],
        [30, 160],
        [56, 157],
        [157, 173],
        [173, 56],
        [106, 204],
        [204, 194],
        [194, 106],
        [135, 214],
        [214, 192],
        [192, 135],
        [203, 165],
        [165, 98],
        [98, 203],
        [21, 71],
        [71, 68],
        [68, 21],
        [51, 45],
        [45, 4],
        [4, 51],
        [144, 24],
        [24, 23],
        [23, 144],
        [77, 146],
        [146, 91],
        [91, 77],
        [205, 50],
        [50, 187],
        [187, 205],
        [201, 200],
        [200, 18],
        [18, 201],
        [91, 106],
        [106, 182],
        [182, 91],
        [90, 91],
        [91, 181],
        [181, 90],
        [85, 84],
        [84, 17],
        [17, 85],
        [206, 203],
        [203, 36],
        [36, 206],
        [148, 171],
        [171, 140],
        [140, 148],
        [92, 40],
        [40, 39],
        [39, 92],
        [193, 189],
        [189, 244],
        [244, 193],
        [159, 158],
        [158, 28],
        [28, 159],
        [247, 246],
        [246, 161],
        [161, 247],
        [236, 3],
        [3, 196],
        [196, 236],
        [54, 68],
        [68, 104],
        [104, 54],
        [193, 168],
        [168, 8],
        [8, 193],
        [117, 228],
        [228, 31],
        [31, 117],
        [189, 193],
        [193, 55],
        [55, 189],
        [98, 97],
        [97, 99],
        [99, 98],
        [126, 47],
        [47, 100],
        [100, 126],
        [166, 79],
        [79, 218],
        [218, 166],
        [155, 154],
        [154, 26],
        [26, 155],
        [209, 49],
        [49, 131],
        [131, 209],
        [135, 136],
        [136, 150],
        [150, 135],
        [47, 126],
        [126, 217],
        [217, 47],
        [223, 52],
        [52, 53],
        [53, 223],
        [45, 51],
        [51, 134],
        [134, 45],
        [211, 170],
        [170, 140],
        [140, 211],
        [67, 69],
        [69, 108],
        [108, 67],
        [43, 106],
        [106, 91],
        [91, 43],
        [230, 119],
        [119, 120],
        [120, 230],
        [226, 130],
        [130, 247],
        [247, 226],
        [63, 53],
        [53, 52],
        [52, 63],
        [238, 20],
        [20, 242],
        [242, 238],
        [46, 70],
        [70, 156],
        [156, 46],
        [78, 62],
        [62, 96],
        [96, 78],
        [46, 53],
        [53, 63],
        [63, 46],
        [143, 34],
        [34, 227],
        [227, 143],
        [123, 117],
        [117, 111],
        [111, 123],
        [44, 125],
        [125, 19],
        [19, 44],
        [236, 134],
        [134, 51],
        [51, 236],
        [216, 206],
        [206, 205],
        [205, 216],
        [154, 153],
        [153, 22],
        [22, 154],
        [39, 37],
        [37, 167],
        [167, 39],
        [200, 201],
        [201, 208],
        [208, 200],
        [36, 142],
        [142, 100],
        [100, 36],
        [57, 212],
        [212, 202],
        [202, 57],
        [20, 60],
        [60, 99],
        [99, 20],
        [28, 158],
        [158, 157],
        [157, 28],
        [35, 226],
        [226, 113],
        [113, 35],
        [160, 159],
        [159, 27],
        [27, 160],
        [204, 202],
        [202, 210],
        [210, 204],
        [113, 225],
        [225, 46],
        [46, 113],
        [43, 202],
        [202, 204],
        [204, 43],
        [62, 76],
        [76, 77],
        [77, 62],
        [137, 123],
        [123, 116],
        [116, 137],
        [41, 38],
        [38, 72],
        [72, 41],
        [203, 129],
        [129, 142],
        [142, 203],
        [64, 98],
        [98, 240],
        [240, 64],
        [49, 102],
        [102, 64],
        [64, 49],
        [41, 73],
        [73, 74],
        [74, 41],
        [212, 216],
        [216, 207],
        [207, 212],
        [42, 74],
        [74, 184],
        [184, 42],
        [169, 170],
        [170, 211],
        [211, 169],
        [170, 149],
        [149, 176],
        [176, 170],
        [105, 66],
        [66, 69],
        [69, 105],
        [122, 6],
        [6, 168],
        [168, 122],
        [123, 147],
        [147, 187],
        [187, 123],
        [96, 77],
        [77, 90],
        [90, 96],
        [65, 55],
        [55, 107],
        [107, 65],
        [89, 90],
        [90, 180],
        [180, 89],
        [101, 100],
        [100, 120],
        [120, 101],
        [63, 105],
        [105, 104],
        [104, 63],
        [93, 137],
        [137, 227],
        [227, 93],
        [15, 86],
        [86, 85],
        [85, 15],
        [129, 102],
        [102, 49],
        [49, 129],
        [14, 87],
        [87, 86],
        [86, 14],
        [55, 8],
        [8, 9],
        [9, 55],
        [100, 47],
        [47, 121],
        [121, 100],
        [145, 23],
        [23, 22],
        [22, 145],
        [88, 89],
        [89, 179],
        [179, 88],
        [6, 122],
        [122, 196],
        [196, 6],
        [88, 95],
        [95, 96],
        [96, 88],
        [
          138,
          172
        ],
        [172, 136],
        [136, 138],
        [215, 58],
        [58, 172],
        [172, 215],
        [115, 48],
        [48, 219],
        [219, 115],
        [42, 80],
        [80, 81],
        [81, 42],
        [195, 3],
        [3, 51],
        [51, 195],
        [43, 146],
        [146, 61],
        [61, 43],
        [171, 175],
        [175, 199],
        [199, 171],
        [81, 82],
        [82, 38],
        [38, 81],
        [53, 46],
        [46, 225],
        [225, 53],
        [144, 163],
        [163, 110],
        [110, 144],
        [52, 65],
        [65, 66],
        [66, 52],
        [229, 228],
        [228, 117],
        [117, 229],
        [34, 127],
        [127, 234],
        [234, 34],
        [107, 108],
        [108, 69],
        [69, 107],
        [109, 108],
        [108, 151],
        [151, 109],
        [48, 64],
        [64, 235],
        [235, 48],
        [62, 78],
        [78, 191],
        [191, 62],
        [129, 209],
        [209, 126],
        [126, 129],
        [111, 35],
        [35, 143],
        [143, 111],
        [117, 123],
        [123, 50],
        [50, 117],
        [222, 65],
        [65, 52],
        [52, 222],
        [19, 125],
        [125, 141],
        [141, 19],
        [221, 55],
        [55, 65],
        [65, 221],
        [3, 195],
        [195, 197],
        [197, 3],
        [25, 7],
        [7, 33],
        [33, 25],
        [220, 237],
        [237, 44],
        [44, 220],
        [70, 71],
        [71, 139],
        [139, 70],
        [122, 193],
        [193, 245],
        [245, 122],
        [247, 130],
        [130, 33],
        [33, 247],
        [71, 21],
        [21, 162],
        [162, 71],
        [170, 169],
        [169, 150],
        [150, 170],
        [188, 174],
        [174, 196],
        [196, 188],
        [216, 186],
        [186, 92],
        [92, 216],
        [2, 97],
        [97, 167],
        [167, 2],
        [141, 125],
        [125, 241],
        [241, 141],
        [164, 167],
        [167, 37],
        [37, 164],
        [72, 38],
        [38, 12],
        [12, 72],
        [
          38,
          82
        ],
        [82, 13],
        [13, 38],
        [63, 68],
        [68, 71],
        [71, 63],
        [226, 35],
        [35, 111],
        [111, 226],
        [101, 50],
        [50, 205],
        [205, 101],
        [206, 92],
        [92, 165],
        [165, 206],
        [209, 198],
        [198, 217],
        [217, 209],
        [165, 167],
        [167, 97],
        [97, 165],
        [220, 115],
        [115, 218],
        [218, 220],
        [133, 112],
        [112, 243],
        [243, 133],
        [239, 238],
        [238, 241],
        [241, 239],
        [214, 135],
        [135, 169],
        [169, 214],
        [190, 173],
        [173, 133],
        [133, 190],
        [171, 208],
        [208, 32],
        [32, 171],
        [125, 44],
        [44, 237],
        [237, 125],
        [86, 87],
        [87, 178],
        [178, 86],
        [85, 86],
        [86, 179],
        [179, 85],
        [84, 85],
        [85, 180],
        [180, 84],
        [83, 84],
        [84, 181],
        [181, 83],
        [
          201,
          83
        ],
        [83, 182],
        [182, 201],
        [137, 93],
        [93, 132],
        [132, 137],
        [76, 62],
        [62, 183],
        [183, 76],
        [61, 76],
        [76, 184],
        [184, 61],
        [57, 61],
        [61, 185],
        [185, 57],
        [212, 57],
        [57, 186],
        [186, 212],
        [214, 207],
        [207, 187],
        [187, 214],
        [34, 143],
        [143, 156],
        [156, 34],
        [79, 239],
        [239, 237],
        [237, 79],
        [123, 137],
        [137, 177],
        [177, 123],
        [44, 1],
        [1, 4],
        [4, 44],
        [201, 194],
        [194, 32],
        [32, 201],
        [64, 102],
        [102, 129],
        [129, 64],
        [213, 215],
        [215, 138],
        [138, 213],
        [59, 166],
        [166, 219],
        [219, 59],
        [242, 99],
        [99, 97],
        [97, 242],
        [2, 94],
        [94, 141],
        [141, 2],
        [75, 59],
        [59, 235],
        [235, 75],
        [24, 110],
        [110, 228],
        [228, 24],
        [25, 130],
        [130, 226],
        [226, 25],
        [23, 24],
        [24, 229],
        [229, 23],
        [22, 23],
        [23, 230],
        [230, 22],
        [26, 22],
        [22, 231],
        [231, 26],
        [112, 26],
        [26, 232],
        [232, 112],
        [189, 190],
        [190, 243],
        [243, 189],
        [221, 56],
        [56, 190],
        [190, 221],
        [28, 56],
        [56, 221],
        [221, 28],
        [27, 28],
        [28, 222],
        [222, 27],
        [29, 27],
        [27, 223],
        [223, 29],
        [30, 29],
        [29, 224],
        [224, 30],
        [247, 30],
        [30, 225],
        [225, 247],
        [238, 79],
        [79, 20],
        [20, 238],
        [166, 59],
        [59, 75],
        [75, 166],
        [60, 75],
        [75, 240],
        [240, 60],
        [147, 177],
        [177, 215],
        [215, 147],
        [20, 79],
        [79, 166],
        [166, 20],
        [187, 147],
        [147, 213],
        [213, 187],
        [
          112,
          233
        ],
        [233, 244],
        [244, 112],
        [233, 128],
        [128, 245],
        [245, 233],
        [128, 114],
        [114, 188],
        [188, 128],
        [114, 217],
        [217, 174],
        [174, 114],
        [131, 115],
        [115, 220],
        [220, 131],
        [217, 198],
        [198, 236],
        [236, 217],
        [198, 131],
        [131, 134],
        [134, 198],
        [177, 132],
        [132, 58],
        [58, 177],
        [143, 35],
        [35, 124],
        [124, 143],
        [110, 163],
        [163, 7],
        [7, 110],
        [228, 110],
        [110, 25],
        [25, 228],
        [356, 389],
        [389, 368],
        [368, 356],
        [11, 302],
        [302, 267],
        [267, 11],
        [452, 350],
        [350, 349],
        [349, 452],
        [302, 303],
        [303, 269],
        [269, 302],
        [357, 343],
        [343, 277],
        [277, 357],
        [452, 453],
        [453, 357],
        [357, 452],
        [333, 332],
        [332, 297],
        [297, 333],
        [175, 152],
        [152, 377],
        [377, 175],
        [347, 348],
        [348, 330],
        [330, 347],
        [303, 304],
        [304, 270],
        [270, 303],
        [9, 336],
        [336, 337],
        [337, 9],
        [278, 279],
        [279, 360],
        [360, 278],
        [418, 262],
        [262, 431],
        [431, 418],
        [304, 408],
        [408, 409],
        [409, 304],
        [310, 415],
        [415, 407],
        [407, 310],
        [270, 409],
        [409, 410],
        [410, 270],
        [450, 348],
        [348, 347],
        [347, 450],
        [422, 430],
        [430, 434],
        [434, 422],
        [313, 314],
        [314, 17],
        [17, 313],
        [306, 307],
        [307, 375],
        [375, 306],
        [387, 388],
        [388, 260],
        [260, 387],
        [286, 414],
        [414, 398],
        [398, 286],
        [335, 406],
        [406, 418],
        [418, 335],
        [364, 367],
        [367, 416],
        [416, 364],
        [423, 358],
        [358, 327],
        [327, 423],
        [251, 284],
        [284, 298],
        [298, 251],
        [281, 5],
        [5, 4],
        [4, 281],
        [373, 374],
        [374, 253],
        [253, 373],
        [307, 320],
        [320, 321],
        [321, 307],
        [425, 427],
        [427, 411],
        [411, 425],
        [421, 313],
        [313, 18],
        [18, 421],
        [321, 405],
        [405, 406],
        [406, 321],
        [320, 404],
        [404, 405],
        [405, 320],
        [315, 16],
        [16, 17],
        [17, 315],
        [426, 425],
        [425, 266],
        [266, 426],
        [377, 400],
        [400, 369],
        [369, 377],
        [322, 391],
        [391, 269],
        [269, 322],
        [417, 465],
        [465, 464],
        [464, 417],
        [386, 257],
        [257, 258],
        [258, 386],
        [466, 260],
        [260, 388],
        [388, 466],
        [456, 399],
        [
          399,
          419
        ],
        [419, 456],
        [284, 332],
        [332, 333],
        [333, 284],
        [417, 285],
        [285, 8],
        [8, 417],
        [346, 340],
        [340, 261],
        [261, 346],
        [413, 441],
        [441, 285],
        [285, 413],
        [327, 460],
        [460, 328],
        [328, 327],
        [355, 371],
        [371, 329],
        [329, 355],
        [392, 439],
        [439, 438],
        [438, 392],
        [382, 341],
        [341, 256],
        [256, 382],
        [429, 420],
        [420, 360],
        [360, 429],
        [364, 394],
        [394, 379],
        [379, 364],
        [277, 343],
        [343, 437],
        [437, 277],
        [443, 444],
        [444, 283],
        [283, 443],
        [275, 440],
        [440, 363],
        [363, 275],
        [431, 262],
        [262, 369],
        [369, 431],
        [297, 338],
        [338, 337],
        [337, 297],
        [273, 375],
        [375, 321],
        [321, 273],
        [450, 451],
        [451, 349],
        [349, 450],
        [446, 342],
        [342, 467],
        [467, 446],
        [293, 334],
        [334, 282],
        [282, 293],
        [458, 461],
        [461, 462],
        [462, 458],
        [276, 353],
        [353, 383],
        [383, 276],
        [308, 324],
        [324, 325],
        [325, 308],
        [276, 300],
        [300, 293],
        [293, 276],
        [372, 345],
        [345, 447],
        [447, 372],
        [352, 345],
        [345, 340],
        [340, 352],
        [274, 1],
        [1, 19],
        [19, 274],
        [456, 248],
        [248, 281],
        [281, 456],
        [436, 427],
        [427, 425],
        [425, 436],
        [381, 256],
        [256, 252],
        [252, 381],
        [269, 391],
        [391, 393],
        [393, 269],
        [200, 199],
        [199, 428],
        [428, 200],
        [266, 330],
        [330, 329],
        [329, 266],
        [287, 273],
        [273, 422],
        [422, 287],
        [250, 462],
        [462, 328],
        [328, 250],
        [258, 286],
        [286, 384],
        [384, 258],
        [265, 353],
        [353, 342],
        [342, 265],
        [387, 259],
        [259, 257],
        [257, 387],
        [424, 431],
        [431, 430],
        [430, 424],
        [342, 353],
        [353, 276],
        [276, 342],
        [273, 335],
        [335, 424],
        [424, 273],
        [292, 325],
        [325, 307],
        [307, 292],
        [366, 447],
        [447, 345],
        [345, 366],
        [271, 303],
        [303, 302],
        [302, 271],
        [423, 266],
        [266, 371],
        [371, 423],
        [294, 455],
        [455, 460],
        [460, 294],
        [279, 278],
        [278, 294],
        [294, 279],
        [271, 272],
        [272, 304],
        [304, 271],
        [432, 434],
        [434, 427],
        [427, 432],
        [272, 407],
        [407, 408],
        [408, 272],
        [394, 430],
        [430, 431],
        [431, 394],
        [
          395,
          369
        ],
        [369, 400],
        [400, 395],
        [334, 333],
        [333, 299],
        [299, 334],
        [351, 417],
        [417, 168],
        [168, 351],
        [352, 280],
        [280, 411],
        [411, 352],
        [325, 319],
        [319, 320],
        [320, 325],
        [295, 296],
        [296, 336],
        [336, 295],
        [319, 403],
        [403, 404],
        [404, 319],
        [330, 348],
        [348, 349],
        [349, 330],
        [293, 298],
        [298, 333],
        [333, 293],
        [323, 454],
        [454, 447],
        [447, 323],
        [15, 16],
        [16, 315],
        [315, 15],
        [358, 429],
        [429, 279],
        [279, 358],
        [14, 15],
        [15, 316],
        [316, 14],
        [285, 336],
        [336, 9],
        [9, 285],
        [329, 349],
        [349, 350],
        [350, 329],
        [374, 380],
        [380, 252],
        [252, 374],
        [318, 402],
        [402, 403],
        [403, 318],
        [6, 197],
        [197, 419],
        [419, 6],
        [318, 319],
        [319, 325],
        [325, 318],
        [367, 364],
        [364, 365],
        [365, 367],
        [435, 367],
        [367, 397],
        [397, 435],
        [344, 438],
        [438, 439],
        [439, 344],
        [272, 271],
        [271, 311],
        [311, 272],
        [195, 5],
        [5, 281],
        [281, 195],
        [273, 287],
        [287, 291],
        [291, 273],
        [396, 428],
        [428, 199],
        [199, 396],
        [311, 271],
        [271, 268],
        [268, 311],
        [283, 444],
        [444, 445],
        [445, 283],
        [373, 254],
        [254, 339],
        [339, 373],
        [282, 334],
        [334, 296],
        [296, 282],
        [449, 347],
        [347, 346],
        [346, 449],
        [264, 447],
        [447, 454],
        [454, 264],
        [336, 296],
        [296, 299],
        [299, 336],
        [338, 10],
        [10, 151],
        [151, 338],
        [278, 439],
        [439, 455],
        [455, 278],
        [292, 407],
        [407, 415],
        [415, 292],
        [358, 371],
        [371, 355],
        [355, 358],
        [340, 345],
        [345, 372],
        [372, 340],
        [346, 347],
        [347, 280],
        [280, 346],
        [442, 443],
        [443, 282],
        [282, 442],
        [19, 94],
        [94, 370],
        [370, 19],
        [441, 442],
        [442, 295],
        [295, 441],
        [248, 419],
        [419, 197],
        [197, 248],
        [263, 255],
        [255, 359],
        [359, 263],
        [440, 275],
        [275, 274],
        [274, 440],
        [300, 383],
        [383, 368],
        [368, 300],
        [351, 412],
        [412, 465],
        [465, 351],
        [263, 467],
        [467, 466],
        [466, 263],
        [301, 368],
        [368, 389],
        [389, 301],
        [395, 378],
        [378, 379],
        [379, 395],
        [412, 351],
        [351, 419],
        [419, 412],
        [
          436,
          426
        ],
        [426, 322],
        [322, 436],
        [2, 164],
        [164, 393],
        [393, 2],
        [370, 462],
        [462, 461],
        [461, 370],
        [164, 0],
        [0, 267],
        [267, 164],
        [302, 11],
        [11, 12],
        [12, 302],
        [268, 12],
        [12, 13],
        [13, 268],
        [293, 300],
        [300, 301],
        [301, 293],
        [446, 261],
        [261, 340],
        [340, 446],
        [330, 266],
        [266, 425],
        [425, 330],
        [426, 423],
        [423, 391],
        [391, 426],
        [429, 355],
        [355, 437],
        [437, 429],
        [391, 327],
        [327, 326],
        [326, 391],
        [440, 457],
        [457, 438],
        [438, 440],
        [341, 382],
        [382, 362],
        [362, 341],
        [459, 457],
        [457, 461],
        [461, 459],
        [434, 430],
        [430, 394],
        [394, 434],
        [414, 463],
        [463, 362],
        [362, 414],
        [396, 369],
        [
          369,
          262
        ],
        [262, 396],
        [354, 461],
        [461, 457],
        [457, 354],
        [316, 403],
        [403, 402],
        [402, 316],
        [315, 404],
        [404, 403],
        [403, 315],
        [314, 405],
        [405, 404],
        [404, 314],
        [313, 406],
        [406, 405],
        [405, 313],
        [421, 418],
        [418, 406],
        [406, 421],
        [366, 401],
        [401, 361],
        [361, 366],
        [306, 408],
        [408, 407],
        [407, 306],
        [291, 409],
        [409, 408],
        [408, 291],
        [287, 410],
        [410, 409],
        [409, 287],
        [432, 436],
        [436, 410],
        [410, 432],
        [434, 416],
        [416, 411],
        [411, 434],
        [264, 368],
        [368, 383],
        [383, 264],
        [309, 438],
        [438, 457],
        [457, 309],
        [352, 376],
        [376, 401],
        [401, 352],
        [274, 275],
        [275, 4],
        [4, 274],
        [421, 428],
        [428, 262],
        [262, 421],
        [294, 327],
        [327, 358],
        [358, 294],
        [433, 416],
        [416, 367],
        [367, 433],
        [289, 455],
        [455, 439],
        [439, 289],
        [462, 370],
        [370, 326],
        [326, 462],
        [2, 326],
        [326, 370],
        [370, 2],
        [305, 460],
        [460, 455],
        [455, 305],
        [254, 449],
        [449, 448],
        [448, 254],
        [255, 261],
        [261, 446],
        [446, 255],
        [253, 450],
        [450, 449],
        [449, 253],
        [252, 451],
        [451, 450],
        [450, 252],
        [256, 452],
        [452, 451],
        [451, 256],
        [341, 453],
        [453, 452],
        [452, 341],
        [413, 464],
        [464, 463],
        [463, 413],
        [441, 413],
        [413, 414],
        [414, 441],
        [258, 442],
        [442, 441],
        [441, 258],
        [257, 443],
        [443, 442],
        [442, 257],
        [
          259,
          444
        ],
        [444, 443],
        [443, 259],
        [260, 445],
        [445, 444],
        [444, 260],
        [467, 342],
        [342, 445],
        [445, 467],
        [459, 458],
        [458, 250],
        [250, 459],
        [289, 392],
        [392, 290],
        [290, 289],
        [290, 328],
        [328, 460],
        [460, 290],
        [376, 433],
        [433, 435],
        [435, 376],
        [250, 290],
        [290, 392],
        [392, 250],
        [411, 416],
        [416, 433],
        [433, 411],
        [341, 463],
        [463, 464],
        [464, 341],
        [453, 464],
        [464, 465],
        [465, 453],
        [357, 465],
        [465, 412],
        [412, 357],
        [343, 412],
        [412, 399],
        [399, 343],
        [360, 363],
        [363, 440],
        [440, 360],
        [437, 399],
        [399, 456],
        [456, 437],
        [420, 456],
        [456, 363],
        [363, 420],
        [401, 435],
        [435, 288],
        [288, 401],
        [372, 383],
        [383, 353],
        [353, 372],
        [339, 255],
        [255, 249],
        [249, 339],
        [448, 261],
        [261, 255],
        [255, 448],
        [133, 243],
        [243, 190],
        [190, 133],
        [133, 155],
        [155, 112],
        [112, 133],
        [33, 246],
        [246, 247],
        [247, 33],
        [33, 130],
        [130, 25],
        [25, 33],
        [398, 384],
        [384, 286],
        [286, 398],
        [362, 398],
        [398, 414],
        [414, 362],
        [362, 463],
        [463, 341],
        [341, 362],
        [263, 359],
        [359, 467],
        [467, 263],
        [263, 249],
        [249, 255],
        [255, 263],
        [466, 467],
        [467, 260],
        [260, 466],
        [75, 60],
        [60, 166],
        [166, 75],
        [238, 239],
        [239, 79],
        [79, 238],
        [162, 127],
        [127, 139],
        [139, 162],
        [72, 11],
        [11, 37],
        [37, 72],
        [121, 232],
        [232, 120],
        [120, 121],
        [73, 72],
        [72, 39],
        [39, 73],
        [114, 128],
        [128, 47],
        [47, 114],
        [233, 232],
        [232, 128],
        [128, 233],
        [103, 104],
        [104, 67],
        [67, 103],
        [152, 175],
        [175, 148],
        [148, 152],
        [119, 118],
        [118, 101],
        [101, 119],
        [74, 73],
        [73, 40],
        [40, 74],
        [107, 9],
        [9, 108],
        [108, 107],
        [49, 48],
        [48, 131],
        [131, 49],
        [32, 194],
        [194, 211],
        [211, 32],
        [184, 74],
        [74, 185],
        [185, 184],
        [191, 80],
        [80, 183],
        [183, 191],
        [185, 40],
        [40, 186],
        [186, 185],
        [119, 230],
        [230, 118],
        [118, 119],
        [210, 202],
        [202, 214],
        [214, 210],
        [84, 83],
        [83, 17],
        [17, 84],
        [77, 76],
        [76, 146],
        [146, 77],
        [161, 160],
        [
          160,
          30
        ],
        [30, 161],
        [190, 56],
        [56, 173],
        [173, 190],
        [182, 106],
        [106, 194],
        [194, 182],
        [138, 135],
        [135, 192],
        [192, 138],
        [129, 203],
        [203, 98],
        [98, 129],
        [54, 21],
        [21, 68],
        [68, 54],
        [5, 51],
        [51, 4],
        [4, 5],
        [145, 144],
        [144, 23],
        [23, 145],
        [90, 77],
        [77, 91],
        [91, 90],
        [207, 205],
        [205, 187],
        [187, 207],
        [83, 201],
        [201, 18],
        [18, 83],
        [181, 91],
        [91, 182],
        [182, 181],
        [180, 90],
        [90, 181],
        [181, 180],
        [16, 85],
        [85, 17],
        [17, 16],
        [205, 206],
        [206, 36],
        [36, 205],
        [176, 148],
        [148, 140],
        [140, 176],
        [165, 92],
        [92, 39],
        [39, 165],
        [245, 193],
        [193, 244],
        [244, 245],
        [27, 159],
        [159, 28],
        [28, 27],
        [30, 247],
        [247, 161],
        [161, 30],
        [174, 236],
        [236, 196],
        [196, 174],
        [103, 54],
        [54, 104],
        [104, 103],
        [55, 193],
        [193, 8],
        [8, 55],
        [111, 117],
        [117, 31],
        [31, 111],
        [221, 189],
        [189, 55],
        [55, 221],
        [240, 98],
        [98, 99],
        [99, 240],
        [142, 126],
        [126, 100],
        [100, 142],
        [219, 166],
        [166, 218],
        [218, 219],
        [112, 155],
        [155, 26],
        [26, 112],
        [198, 209],
        [209, 131],
        [131, 198],
        [169, 135],
        [135, 150],
        [150, 169],
        [114, 47],
        [47, 217],
        [217, 114],
        [224, 223],
        [223, 53],
        [53, 224],
        [220, 45],
        [45, 134],
        [134, 220],
        [32, 211],
        [211, 140],
        [140, 32],
        [109, 67],
        [67, 108],
        [108, 109],
        [146, 43],
        [43, 91],
        [
          91,
          146
        ],
        [231, 230],
        [230, 120],
        [120, 231],
        [113, 226],
        [226, 247],
        [247, 113],
        [105, 63],
        [63, 52],
        [52, 105],
        [241, 238],
        [238, 242],
        [242, 241],
        [124, 46],
        [46, 156],
        [156, 124],
        [95, 78],
        [78, 96],
        [96, 95],
        [70, 46],
        [46, 63],
        [63, 70],
        [116, 143],
        [143, 227],
        [227, 116],
        [116, 123],
        [123, 111],
        [111, 116],
        [1, 44],
        [44, 19],
        [19, 1],
        [3, 236],
        [236, 51],
        [51, 3],
        [207, 216],
        [216, 205],
        [205, 207],
        [26, 154],
        [154, 22],
        [22, 26],
        [165, 39],
        [39, 167],
        [167, 165],
        [199, 200],
        [200, 208],
        [208, 199],
        [101, 36],
        [36, 100],
        [100, 101],
        [43, 57],
        [57, 202],
        [202, 43],
        [242, 20],
        [20, 99],
        [99, 242],
        [
          56,
          28
        ],
        [28, 157],
        [157, 56],
        [124, 35],
        [35, 113],
        [113, 124],
        [29, 160],
        [160, 27],
        [27, 29],
        [211, 204],
        [204, 210],
        [210, 211],
        [124, 113],
        [113, 46],
        [46, 124],
        [106, 43],
        [43, 204],
        [204, 106],
        [96, 62],
        [62, 77],
        [77, 96],
        [227, 137],
        [137, 116],
        [116, 227],
        [73, 41],
        [41, 72],
        [72, 73],
        [36, 203],
        [203, 142],
        [142, 36],
        [235, 64],
        [64, 240],
        [240, 235],
        [48, 49],
        [49, 64],
        [64, 48],
        [42, 41],
        [41, 74],
        [74, 42],
        [214, 212],
        [212, 207],
        [207, 214],
        [183, 42],
        [42, 184],
        [184, 183],
        [210, 169],
        [169, 211],
        [211, 210],
        [140, 170],
        [170, 176],
        [176, 140],
        [104, 105],
        [105, 69],
        [69, 104],
        [193, 122],
        [
          122,
          168
        ],
        [168, 193],
        [50, 123],
        [123, 187],
        [187, 50],
        [89, 96],
        [96, 90],
        [90, 89],
        [66, 65],
        [65, 107],
        [107, 66],
        [179, 89],
        [89, 180],
        [180, 179],
        [119, 101],
        [101, 120],
        [120, 119],
        [68, 63],
        [63, 104],
        [104, 68],
        [234, 93],
        [93, 227],
        [227, 234],
        [16, 15],
        [15, 85],
        [85, 16],
        [209, 129],
        [129, 49],
        [49, 209],
        [15, 14],
        [14, 86],
        [86, 15],
        [107, 55],
        [55, 9],
        [9, 107],
        [120, 100],
        [100, 121],
        [121, 120],
        [153, 145],
        [145, 22],
        [22, 153],
        [178, 88],
        [88, 179],
        [179, 178],
        [197, 6],
        [6, 196],
        [196, 197],
        [89, 88],
        [88, 96],
        [96, 89],
        [135, 138],
        [138, 136],
        [136, 135],
        [138, 215],
        [215, 172],
        [172, 138],
        [218, 115],
        [115, 219],
        [219, 218],
        [41, 42],
        [42, 81],
        [81, 41],
        [5, 195],
        [195, 51],
        [51, 5],
        [57, 43],
        [43, 61],
        [61, 57],
        [208, 171],
        [171, 199],
        [199, 208],
        [41, 81],
        [81, 38],
        [38, 41],
        [224, 53],
        [53, 225],
        [225, 224],
        [24, 144],
        [144, 110],
        [110, 24],
        [105, 52],
        [52, 66],
        [66, 105],
        [118, 229],
        [229, 117],
        [117, 118],
        [227, 34],
        [34, 234],
        [234, 227],
        [66, 107],
        [107, 69],
        [69, 66],
        [10, 109],
        [109, 151],
        [151, 10],
        [219, 48],
        [48, 235],
        [235, 219],
        [183, 62],
        [62, 191],
        [191, 183],
        [142, 129],
        [129, 126],
        [126, 142],
        [116, 111],
        [111, 143],
        [143, 116],
        [118, 117],
        [117, 50],
        [50, 118],
        [223, 222],
        [222, 52],
        [52, 223],
        [94, 19],
        [19, 141],
        [141, 94],
        [222, 221],
        [221, 65],
        [65, 222],
        [196, 3],
        [3, 197],
        [197, 196],
        [45, 220],
        [220, 44],
        [44, 45],
        [156, 70],
        [70, 139],
        [139, 156],
        [188, 122],
        [122, 245],
        [245, 188],
        [139, 71],
        [71, 162],
        [162, 139],
        [149, 170],
        [170, 150],
        [150, 149],
        [122, 188],
        [188, 196],
        [196, 122],
        [206, 216],
        [216, 92],
        [92, 206],
        [164, 2],
        [2, 167],
        [167, 164],
        [242, 141],
        [141, 241],
        [241, 242],
        [0, 164],
        [164, 37],
        [37, 0],
        [11, 72],
        [72, 12],
        [12, 11],
        [12, 38],
        [38, 13],
        [13, 12],
        [70, 63],
        [63, 71],
        [71, 70],
        [31, 226],
        [226, 111],
        [111, 31],
        [36, 101],
        [101, 205],
        [
          205,
          36
        ],
        [203, 206],
        [206, 165],
        [165, 203],
        [126, 209],
        [209, 217],
        [217, 126],
        [98, 165],
        [165, 97],
        [97, 98],
        [237, 220],
        [220, 218],
        [218, 237],
        [237, 239],
        [239, 241],
        [241, 237],
        [210, 214],
        [214, 169],
        [169, 210],
        [140, 171],
        [171, 32],
        [32, 140],
        [241, 125],
        [125, 237],
        [237, 241],
        [179, 86],
        [86, 178],
        [178, 179],
        [180, 85],
        [85, 179],
        [179, 180],
        [181, 84],
        [84, 180],
        [180, 181],
        [182, 83],
        [83, 181],
        [181, 182],
        [194, 201],
        [201, 182],
        [182, 194],
        [177, 137],
        [137, 132],
        [132, 177],
        [184, 76],
        [76, 183],
        [183, 184],
        [185, 61],
        [61, 184],
        [184, 185],
        [186, 57],
        [57, 185],
        [185, 186],
        [216, 212],
        [212, 186],
        [186, 216],
        [192, 214],
        [214, 187],
        [187, 192],
        [139, 34],
        [34, 156],
        [156, 139],
        [218, 79],
        [79, 237],
        [237, 218],
        [147, 123],
        [123, 177],
        [177, 147],
        [45, 44],
        [44, 4],
        [4, 45],
        [208, 201],
        [201, 32],
        [32, 208],
        [98, 64],
        [64, 129],
        [129, 98],
        [192, 213],
        [213, 138],
        [138, 192],
        [235, 59],
        [59, 219],
        [219, 235],
        [141, 242],
        [242, 97],
        [97, 141],
        [97, 2],
        [2, 141],
        [141, 97],
        [240, 75],
        [75, 235],
        [235, 240],
        [229, 24],
        [24, 228],
        [228, 229],
        [31, 25],
        [25, 226],
        [226, 31],
        [230, 23],
        [23, 229],
        [229, 230],
        [231, 22],
        [22, 230],
        [230, 231],
        [232, 26],
        [26, 231],
        [231, 232],
        [233, 112],
        [
          112,
          232
        ],
        [232, 233],
        [244, 189],
        [189, 243],
        [243, 244],
        [189, 221],
        [221, 190],
        [190, 189],
        [222, 28],
        [28, 221],
        [221, 222],
        [223, 27],
        [27, 222],
        [222, 223],
        [224, 29],
        [29, 223],
        [223, 224],
        [225, 30],
        [30, 224],
        [224, 225],
        [113, 247],
        [247, 225],
        [225, 113],
        [99, 60],
        [60, 240],
        [240, 99],
        [213, 147],
        [147, 215],
        [215, 213],
        [60, 20],
        [20, 166],
        [166, 60],
        [192, 187],
        [187, 213],
        [213, 192],
        [243, 112],
        [112, 244],
        [244, 243],
        [244, 233],
        [233, 245],
        [245, 244],
        [245, 128],
        [128, 188],
        [188, 245],
        [188, 114],
        [114, 174],
        [174, 188],
        [134, 131],
        [131, 220],
        [220, 134],
        [174, 217],
        [217, 236],
        [
          236,
          174
        ],
        [236, 198],
        [198, 134],
        [134, 236],
        [215, 177],
        [177, 58],
        [58, 215],
        [156, 143],
        [143, 124],
        [124, 156],
        [25, 110],
        [110, 7],
        [7, 25],
        [31, 228],
        [228, 25],
        [25, 31],
        [264, 356],
        [356, 368],
        [368, 264],
        [0, 11],
        [11, 267],
        [267, 0],
        [451, 452],
        [452, 349],
        [349, 451],
        [267, 302],
        [302, 269],
        [269, 267],
        [350, 357],
        [357, 277],
        [277, 350],
        [350, 452],
        [452, 357],
        [357, 350],
        [299, 333],
        [333, 297],
        [297, 299],
        [396, 175],
        [175, 377],
        [377, 396],
        [280, 347],
        [347, 330],
        [330, 280],
        [269, 303],
        [303, 270],
        [270, 269],
        [151, 9],
        [9, 337],
        [337, 151],
        [344, 278],
        [278, 360],
        [360, 344],
        [424, 418],
        [418, 431],
        [431, 424],
        [270, 304],
        [304, 409],
        [409, 270],
        [272, 310],
        [310, 407],
        [407, 272],
        [322, 270],
        [270, 410],
        [410, 322],
        [449, 450],
        [450, 347],
        [347, 449],
        [432, 422],
        [422, 434],
        [434, 432],
        [18, 313],
        [313, 17],
        [17, 18],
        [291, 306],
        [306, 375],
        [375, 291],
        [259, 387],
        [387, 260],
        [260, 259],
        [424, 335],
        [335, 418],
        [418, 424],
        [434, 364],
        [364, 416],
        [416, 434],
        [391, 423],
        [423, 327],
        [327, 391],
        [301, 251],
        [251, 298],
        [298, 301],
        [275, 281],
        [281, 4],
        [4, 275],
        [254, 373],
        [373, 253],
        [253, 254],
        [375, 307],
        [307, 321],
        [321, 375],
        [280, 425],
        [425, 411],
        [411, 280],
        [200, 421],
        [421, 18],
        [18, 200],
        [335, 321],
        [321, 406],
        [406, 335],
        [321, 320],
        [320, 405],
        [405, 321],
        [314, 315],
        [315, 17],
        [17, 314],
        [423, 426],
        [426, 266],
        [266, 423],
        [396, 377],
        [377, 369],
        [369, 396],
        [270, 322],
        [322, 269],
        [269, 270],
        [413, 417],
        [417, 464],
        [464, 413],
        [385, 386],
        [386, 258],
        [258, 385],
        [248, 456],
        [456, 419],
        [419, 248],
        [298, 284],
        [284, 333],
        [333, 298],
        [168, 417],
        [417, 8],
        [8, 168],
        [448, 346],
        [346, 261],
        [261, 448],
        [417, 413],
        [413, 285],
        [285, 417],
        [326, 327],
        [327, 328],
        [328, 326],
        [277, 355],
        [355, 329],
        [329, 277],
        [309, 392],
        [392, 438],
        [438, 309],
        [381, 382],
        [382, 256],
        [256, 381],
        [279, 429],
        [429, 360],
        [360, 279],
        [365, 364],
        [364, 379],
        [379, 365],
        [355, 277],
        [277, 437],
        [437, 355],
        [282, 443],
        [443, 283],
        [283, 282],
        [281, 275],
        [275, 363],
        [363, 281],
        [395, 431],
        [431, 369],
        [369, 395],
        [299, 297],
        [297, 337],
        [337, 299],
        [335, 273],
        [273, 321],
        [321, 335],
        [348, 450],
        [450, 349],
        [349, 348],
        [359, 446],
        [446, 467],
        [467, 359],
        [283, 293],
        [293, 282],
        [282, 283],
        [250, 458],
        [458, 462],
        [462, 250],
        [300, 276],
        [276, 383],
        [383, 300],
        [292, 308],
        [308, 325],
        [325, 292],
        [283, 276],
        [276, 293],
        [293, 283],
        [264, 372],
        [372, 447],
        [447, 264],
        [
          346,
          352
        ],
        [352, 340],
        [340, 346],
        [354, 274],
        [274, 19],
        [19, 354],
        [363, 456],
        [456, 281],
        [281, 363],
        [426, 436],
        [436, 425],
        [425, 426],
        [380, 381],
        [381, 252],
        [252, 380],
        [267, 269],
        [269, 393],
        [393, 267],
        [421, 200],
        [200, 428],
        [428, 421],
        [371, 266],
        [266, 329],
        [329, 371],
        [432, 287],
        [287, 422],
        [422, 432],
        [290, 250],
        [250, 328],
        [328, 290],
        [385, 258],
        [258, 384],
        [384, 385],
        [446, 265],
        [265, 342],
        [342, 446],
        [386, 387],
        [387, 257],
        [257, 386],
        [422, 424],
        [424, 430],
        [430, 422],
        [445, 342],
        [342, 276],
        [276, 445],
        [422, 273],
        [273, 424],
        [424, 422],
        [306, 292],
        [292, 307],
        [307, 306],
        [352, 366],
        [366, 345],
        [345, 352],
        [268, 271],
        [271, 302],
        [302, 268],
        [358, 423],
        [423, 371],
        [371, 358],
        [327, 294],
        [294, 460],
        [460, 327],
        [331, 279],
        [279, 294],
        [294, 331],
        [303, 271],
        [271, 304],
        [304, 303],
        [436, 432],
        [432, 427],
        [427, 436],
        [304, 272],
        [272, 408],
        [408, 304],
        [395, 394],
        [394, 431],
        [431, 395],
        [378, 395],
        [395, 400],
        [400, 378],
        [296, 334],
        [334, 299],
        [299, 296],
        [6, 351],
        [351, 168],
        [168, 6],
        [376, 352],
        [352, 411],
        [411, 376],
        [307, 325],
        [325, 320],
        [320, 307],
        [285, 295],
        [295, 336],
        [336, 285],
        [320, 319],
        [319, 404],
        [404, 320],
        [329, 330],
        [330, 349],
        [
          349,
          329
        ],
        [334, 293],
        [293, 333],
        [333, 334],
        [366, 323],
        [323, 447],
        [447, 366],
        [316, 15],
        [15, 315],
        [315, 316],
        [331, 358],
        [358, 279],
        [279, 331],
        [317, 14],
        [14, 316],
        [316, 317],
        [8, 285],
        [285, 9],
        [9, 8],
        [277, 329],
        [329, 350],
        [350, 277],
        [253, 374],
        [374, 252],
        [252, 253],
        [319, 318],
        [318, 403],
        [403, 319],
        [351, 6],
        [6, 419],
        [419, 351],
        [324, 318],
        [318, 325],
        [325, 324],
        [397, 367],
        [367, 365],
        [365, 397],
        [288, 435],
        [435, 397],
        [397, 288],
        [278, 344],
        [344, 439],
        [439, 278],
        [310, 272],
        [272, 311],
        [311, 310],
        [248, 195],
        [195, 281],
        [281, 248],
        [375, 273],
        [273, 291],
        [291, 375],
        [
          175,
          396
        ],
        [396, 199],
        [199, 175],
        [312, 311],
        [311, 268],
        [268, 312],
        [276, 283],
        [283, 445],
        [445, 276],
        [390, 373],
        [373, 339],
        [339, 390],
        [295, 282],
        [282, 296],
        [296, 295],
        [448, 449],
        [449, 346],
        [346, 448],
        [356, 264],
        [264, 454],
        [454, 356],
        [337, 336],
        [336, 299],
        [299, 337],
        [337, 338],
        [338, 151],
        [151, 337],
        [294, 278],
        [278, 455],
        [455, 294],
        [308, 292],
        [292, 415],
        [415, 308],
        [429, 358],
        [358, 355],
        [355, 429],
        [265, 340],
        [340, 372],
        [372, 265],
        [352, 346],
        [346, 280],
        [280, 352],
        [295, 442],
        [442, 282],
        [282, 295],
        [354, 19],
        [19, 370],
        [370, 354],
        [285, 441],
        [441, 295],
        [295, 285],
        [195, 248],
        [248, 197],
        [197, 195],
        [457, 440],
        [440, 274],
        [274, 457],
        [301, 300],
        [300, 368],
        [368, 301],
        [417, 351],
        [351, 465],
        [465, 417],
        [251, 301],
        [301, 389],
        [389, 251],
        [394, 395],
        [395, 379],
        [379, 394],
        [399, 412],
        [412, 419],
        [419, 399],
        [410, 436],
        [436, 322],
        [322, 410],
        [326, 2],
        [2, 393],
        [393, 326],
        [354, 370],
        [370, 461],
        [461, 354],
        [393, 164],
        [164, 267],
        [267, 393],
        [268, 302],
        [302, 12],
        [12, 268],
        [312, 268],
        [268, 13],
        [13, 312],
        [298, 293],
        [293, 301],
        [301, 298],
        [265, 446],
        [446, 340],
        [340, 265],
        [280, 330],
        [330, 425],
        [425, 280],
        [322, 426],
        [426, 391],
        [391, 322],
        [420, 429],
        [429, 437],
        [437, 420],
        [393, 391],
        [391, 326],
        [326, 393],
        [344, 440],
        [440, 438],
        [438, 344],
        [458, 459],
        [459, 461],
        [461, 458],
        [364, 434],
        [434, 394],
        [394, 364],
        [428, 396],
        [396, 262],
        [262, 428],
        [274, 354],
        [354, 457],
        [457, 274],
        [317, 316],
        [316, 402],
        [402, 317],
        [316, 315],
        [315, 403],
        [403, 316],
        [315, 314],
        [314, 404],
        [404, 315],
        [314, 313],
        [313, 405],
        [405, 314],
        [313, 421],
        [421, 406],
        [406, 313],
        [323, 366],
        [366, 361],
        [361, 323],
        [292, 306],
        [306, 407],
        [407, 292],
        [306, 291],
        [291, 408],
        [408, 306],
        [291, 287],
        [287, 409],
        [409, 291],
        [287, 432],
        [432, 410],
        [
          410,
          287
        ],
        [427, 434],
        [434, 411],
        [411, 427],
        [372, 264],
        [264, 383],
        [383, 372],
        [459, 309],
        [309, 457],
        [457, 459],
        [366, 352],
        [352, 401],
        [401, 366],
        [1, 274],
        [274, 4],
        [4, 1],
        [418, 421],
        [421, 262],
        [262, 418],
        [331, 294],
        [294, 358],
        [358, 331],
        [435, 433],
        [433, 367],
        [367, 435],
        [392, 289],
        [289, 439],
        [439, 392],
        [328, 462],
        [462, 326],
        [326, 328],
        [94, 2],
        [2, 370],
        [370, 94],
        [289, 305],
        [305, 455],
        [455, 289],
        [339, 254],
        [254, 448],
        [448, 339],
        [359, 255],
        [255, 446],
        [446, 359],
        [254, 253],
        [253, 449],
        [449, 254],
        [253, 252],
        [252, 450],
        [450, 253],
        [252, 256],
        [256, 451],
        [451, 252],
        [256, 341],
        [341, 452],
        [452, 256],
        [414, 413],
        [413, 463],
        [463, 414],
        [286, 441],
        [441, 414],
        [414, 286],
        [286, 258],
        [258, 441],
        [441, 286],
        [258, 257],
        [257, 442],
        [442, 258],
        [257, 259],
        [259, 443],
        [443, 257],
        [259, 260],
        [260, 444],
        [444, 259],
        [260, 467],
        [467, 445],
        [445, 260],
        [309, 459],
        [459, 250],
        [250, 309],
        [305, 289],
        [289, 290],
        [290, 305],
        [305, 290],
        [290, 460],
        [460, 305],
        [401, 376],
        [376, 435],
        [435, 401],
        [309, 250],
        [250, 392],
        [392, 309],
        [376, 411],
        [411, 433],
        [433, 376],
        [453, 341],
        [341, 464],
        [464, 453],
        [357, 453],
        [453, 465],
        [465, 357],
        [343, 357],
        [357, 412],
        [
          412,
          343
        ],
        [437, 343],
        [343, 399],
        [399, 437],
        [344, 360],
        [360, 440],
        [440, 344],
        [420, 437],
        [437, 456],
        [456, 420],
        [360, 420],
        [420, 363],
        [363, 360],
        [361, 401],
        [401, 288],
        [288, 361],
        [265, 372],
        [372, 353],
        [353, 265],
        [390, 339],
        [339, 249],
        [249, 390],
        [339, 448],
        [448, 255],
        [255, 339]
      ]);
      K2("VERSION", "0.4.1646425229");
    }).call(exports);
  }
});

// node_modules/@tensorflow-models/face-detection/dist/face-detection.esm.js
var import_face_detection = __toESM(require_face_detection());
var b = function() {
  return b = Object.assign || function(e2) {
    for (var t, n = 1, i = arguments.length; n < i; n++) for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e2[o] = t[o]);
    return e2;
  }, b.apply(this, arguments);
};
function T(e2, t, n, i) {
  return new (n || (n = Promise))(function(o, r) {
    function a(e3) {
      try {
        h(i.next(e3));
      } catch (e4) {
        r(e4);
      }
    }
    function s(e3) {
      try {
        h(i.throw(e3));
      } catch (e4) {
        r(e4);
      }
    }
    function h(e3) {
      var t2;
      e3.done ? o(e3.value) : (t2 = e3.value, t2 instanceof n ? t2 : new n(function(e4) {
        e4(t2);
      })).then(a, s);
    }
    h((i = i.apply(e2, t || [])).next());
  });
}
function C(e2, t) {
  var n, i, o, r, a = { label: 0, sent: function() {
    if (1 & o[0]) throw o[1];
    return o[1];
  }, trys: [], ops: [] };
  return r = { next: s(0), throw: s(1), return: s(2) }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
    return this;
  }), r;
  function s(r2) {
    return function(s2) {
      return function(r3) {
        if (n) throw new TypeError("Generator is already executing.");
        for (; a; ) try {
          if (n = 1, i && (o = 2 & r3[0] ? i.return : r3[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, r3[1])).done) return o;
          switch (i = 0, o && (r3 = [2 & r3[0], o.value]), r3[0]) {
            case 0:
            case 1:
              o = r3;
              break;
            case 4:
              return a.label++, { value: r3[1], done: false };
            case 5:
              a.label++, i = r3[1], r3 = [0];
              continue;
            case 7:
              r3 = a.ops.pop(), a.trys.pop();
              continue;
            default:
              if (!(o = a.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== r3[0] && 2 !== r3[0])) {
                a = 0;
                continue;
              }
              if (3 === r3[0] && (!o || r3[1] > o[0] && r3[1] < o[3])) {
                a.label = r3[1];
                break;
              }
              if (6 === r3[0] && a.label < o[1]) {
                a.label = o[1], o = r3;
                break;
              }
              if (o && a.label < o[2]) {
                a.label = o[2], a.ops.push(r3);
                break;
              }
              o[2] && a.ops.pop(), a.trys.pop();
              continue;
          }
          r3 = t.call(e2, a);
        } catch (e3) {
          r3 = [6, e3], i = 0;
        } finally {
          n = o = 0;
        }
        if (5 & r3[0]) throw r3[1];
        return { value: r3[0] ? r3[1] : void 0, done: true };
      }([r2, s2]);
    };
  }
}
var O = ["rightEye", "leftEye", "noseTip", "mouthCenter", "rightEarTragion", "leftEarTragion"];
var B = { modelType: "short", runtime: "mediapipe", maxFaces: 1 };
var z = function() {
  function i(t) {
    var n = this;
    this.width = 0, this.height = 0, this.selfieMode = false, this.faceDetectorSolution = new import_face_detection.FaceDetection({ locateFile: function(e2, n2) {
      if (t.solutionPath) {
        var i2 = t.solutionPath.replace(/\/+$/, "");
        return "".concat(i2, "/").concat(e2);
      }
      return "".concat(n2, "/").concat(e2);
    } }), this.faceDetectorSolution.setOptions({ selfieMode: this.selfieMode, model: t.modelType }), this.faceDetectorSolution.onResults(function(e2) {
      if (n.height = e2.image.height, n.width = e2.image.width, n.faces = [], null !== e2.detections) for (var t2 = 0, i2 = e2.detections; t2 < i2.length; t2++) {
        var o = i2[t2];
        n.faces.push(n.normalizedToAbsolute(o.landmarks, (r = o.boundingBox, a = void 0, s = void 0, h = void 0, a = r.xCenter - r.width / 2, s = a + r.width, h = r.yCenter - r.height / 2, { xMin: a, xMax: s, yMin: h, yMax: h + r.height, width: r.width, height: r.height })));
      }
      var r, a, s, h;
    });
  }
  return i.prototype.normalizedToAbsolute = function(e2, t) {
    var n = this;
    return { keypoints: e2.map(function(e3, t2) {
      return { x: e3.x * n.width, y: e3.y * n.height, name: O[t2] };
    }), box: { xMin: t.xMin * this.width, yMin: t.yMin * this.height, xMax: t.xMax * this.width, yMax: t.yMax * this.height, width: t.width * this.width, height: t.height * this.height } };
  }, i.prototype.estimateFaces = function(e2, i2) {
    return T(this, void 0, void 0, function() {
      var o, r;
      return C(this, function(a) {
        switch (a.label) {
          case 0:
            return i2 && i2.flipHorizontal && i2.flipHorizontal !== this.selfieMode && (this.selfieMode = i2.flipHorizontal, this.faceDetectorSolution.setOptions({ selfieMode: this.selfieMode })), e2 instanceof Tensor ? (r = ImageData.bind, [4, browser_exports.toPixels(e2)]) : [3, 2];
          case 1:
            return o = new (r.apply(ImageData, [void 0, a.sent(), e2.shape[1], e2.shape[0]]))(), [3, 3];
          case 2:
            o = e2, a.label = 3;
          case 3:
            return e2 = o, [4, this.faceDetectorSolution.send({ image: e2 })];
          case 4:
            return a.sent(), [2, this.faces];
        }
      });
    });
  }, i.prototype.dispose = function() {
    this.faceDetectorSolution.close();
  }, i.prototype.reset = function() {
    this.faceDetectorSolution.reset(), this.width = 0, this.height = 0, this.faces = null, this.selfieMode = false;
  }, i.prototype.initialize = function() {
    return this.faceDetectorSolution.initialize();
  }, i;
}();
function D(e2) {
  return T(this, void 0, void 0, function() {
    var t, n;
    return C(this, function(i) {
      switch (i.label) {
        case 0:
          return t = function(e3) {
            if (null == e3) return b({}, B);
            var t2 = b({}, e3);
            return t2.runtime = "mediapipe", null == t2.modelType && (t2.modelType = B.modelType), null == t2.maxFaces && (t2.maxFaces = B.maxFaces), t2;
          }(e2), [4, (n = new z(t)).initialize()];
        case 1:
          return i.sent(), [2, n];
      }
    });
  });
}
function A(e2, t, n, i) {
  var o = e2.width, r = e2.height, a = i ? -1 : 1, s = Math.cos(e2.rotation), h = Math.sin(e2.rotation), u = e2.xCenter, c = e2.yCenter, l = 1 / t, f = 1 / n, d = new Array(16);
  return d[0] = o * s * a * l, d[1] = -r * h * l, d[2] = 0, d[3] = (-0.5 * o * s * a + 0.5 * r * h + u) * l, d[4] = o * h * a * f, d[5] = r * s * f, d[6] = 0, d[7] = (-0.5 * r * s - 0.5 * o * h * a + c) * f, d[8] = 0, d[9] = 0, d[10] = o * l, d[11] = 0, d[12] = 0, d[13] = 0, d[14] = 0, d[15] = 1, function(e3) {
    if (16 !== e3.length) throw new Error("Array length must be 16 but got ".concat(e3.length));
    return [[e3[0], e3[1], e3[2], e3[3]], [e3[4], e3[5], e3[6], e3[7]], [e3[8], e3[9], e3[10], e3[11]], [e3[12], e3[13], e3[14], e3[15]]];
  }(d);
}
function F(e2) {
  return e2 instanceof Tensor ? { height: e2.shape[0], width: e2.shape[1] } : { height: e2.height, width: e2.width };
}
function E(e2) {
  return e2 instanceof Tensor ? e2 : browser_exports.fromPixels(e2);
}
function R(e2, t) {
  util_exports.assert(0 !== e2.width, function() {
    return "".concat(t, " width cannot be 0.");
  }), util_exports.assert(0 !== e2.height, function() {
    return "".concat(t, " height cannot be 0.");
  });
}
function L(e2, t) {
  var n = function(e3, t2, n2, i) {
    var o = t2 - e3, r = i - n2;
    if (0 === o) throw new Error("Original min and max are both ".concat(e3, ", range cannot be 0."));
    var a = r / o;
    return { scale: a, offset: n2 - e3 * a };
  }(0, 255, t[0], t[1]);
  return tidy(function() {
    return add(mul(e2, n.scale), n.offset);
  });
}
function K(e2, t, n) {
  var i = t.outputTensorSize, r = t.keepAspectRatio, a = t.borderMode, l = t.outputTensorFloatRange, f = F(e2), d = function(e3, t2) {
    return t2 ? { xCenter: t2.xCenter * e3.width, yCenter: t2.yCenter * e3.height, width: t2.width * e3.width, height: t2.height * e3.height, rotation: t2.rotation } : { xCenter: 0.5 * e3.width, yCenter: 0.5 * e3.height, width: e3.width, height: e3.height, rotation: 0 };
  }(f, n), p = function(e3, t2, n2) {
    if (void 0 === n2 && (n2 = false), !n2) return { top: 0, left: 0, right: 0, bottom: 0 };
    var i2 = t2.height, o = t2.width;
    R(t2, "targetSize"), R(e3, "roi");
    var r2, a2, s = i2 / o, h = e3.height / e3.width, u = 0, c = 0;
    return s > h ? (r2 = e3.width, a2 = e3.width * s, c = (1 - h / s) / 2) : (r2 = e3.height / s, a2 = e3.height, u = (1 - s / h) / 2), e3.width = r2, e3.height = a2, { top: c, left: u, right: u, bottom: c };
  }(d, i, r), m = A(d, f.width, f.height, false), x = tidy(function() {
    var t2 = E(e2), n2 = tensor2d(function(e3, t3, n3) {
      return R(n3, "inputResolution"), [1 / n3.width * e3[0][0] * t3.width, 1 / n3.height * e3[0][1] * t3.width, e3[0][3] * t3.width, 1 / n3.width * e3[1][0] * t3.height, 1 / n3.height * e3[1][1] * t3.height, e3[1][3] * t3.height, 0, 0];
    }(m, f, i), [1, 8]), o = "zero" === a ? "constant" : "nearest", r2 = image.transform(expandDims(cast(t2, "float32")), n2, "bilinear", o, 0, [i.height, i.width]);
    return null != l ? L(r2, l) : r2;
  });
  return { imageTensor: x, padding: p, transformationMatrix: m };
}
function k(e2) {
  null == e2.reduceBoxesInLowestLayer && (e2.reduceBoxesInLowestLayer = false), null == e2.interpolatedScaleAspectRatio && (e2.interpolatedScaleAspectRatio = 1), null == e2.fixedAnchorSize && (e2.fixedAnchorSize = false);
  for (var t = [], n = 0; n < e2.numLayers; ) {
    for (var i = [], o = [], r = [], a = [], s = n; s < e2.strides.length && e2.strides[s] === e2.strides[n]; ) {
      var h = P(e2.minScale, e2.maxScale, s, e2.strides.length);
      if (0 === s && e2.reduceBoxesInLowestLayer) r.push(1), r.push(2), r.push(0.5), a.push(0.1), a.push(h), a.push(h);
      else {
        for (var u = 0; u < e2.aspectRatios.length; ++u) r.push(e2.aspectRatios[u]), a.push(h);
        if (e2.interpolatedScaleAspectRatio > 0) {
          var c = s === e2.strides.length - 1 ? 1 : P(e2.minScale, e2.maxScale, s + 1, e2.strides.length);
          a.push(Math.sqrt(h * c)), r.push(e2.interpolatedScaleAspectRatio);
        }
      }
      s++;
    }
    for (var l = 0; l < r.length; ++l) {
      var f = Math.sqrt(r[l]);
      i.push(a[l] / f), o.push(a[l] * f);
    }
    var d = 0, p = 0;
    if (e2.featureMapHeight.length > 0) d = e2.featureMapHeight[n], p = e2.featureMapWidth[n];
    else {
      var m = e2.strides[n];
      d = Math.ceil(e2.inputSizeHeight / m), p = Math.ceil(e2.inputSizeWidth / m);
    }
    for (var x = 0; x < d; ++x) for (var g = 0; g < p; ++g) for (var y = 0; y < i.length; ++y) {
      var v = { xCenter: (g + e2.anchorOffsetX) / p, yCenter: (x + e2.anchorOffsetY) / d, width: 0, height: 0 };
      e2.fixedAnchorSize ? (v.width = 1, v.height = 1) : (v.width = o[y], v.height = i[y]), t.push(v);
    }
    n = s;
  }
  return t;
}
function P(e2, t, n, i) {
  return 1 === i ? 0.5 * (e2 + t) : e2 + (t - e2) * n / (i - 1);
}
function V(e2, t) {
  var n = t[0], i = t[1];
  return [n * e2[0] + i * e2[1] + e2[3], n * e2[4] + i * e2[5] + e2[7]];
}
function H(e2) {
  return tidy(function() {
    var t = function(e3) {
      return tidy(function() {
        return [slice(e3, [0, 0, 0], [1, -1, 1]), slice(e3, [0, 0, 1], [1, -1, -1])];
      });
    }(e2), n = t[0], i = t[1];
    return { boxes: squeeze(i), logits: squeeze(n) };
  });
}
function U(e2, t, n, i) {
  return T(this, void 0, void 0, function() {
    var i2, o, r, a, u;
    return C(this, function(c) {
      switch (c.label) {
        case 0:
          return e2.sort(function(e3, t2) {
            return Math.max.apply(Math, t2.score) - Math.max.apply(Math, e3.score);
          }), i2 = tensor2d(e2.map(function(e3) {
            return [e3.locationData.relativeBoundingBox.yMin, e3.locationData.relativeBoundingBox.xMin, e3.locationData.relativeBoundingBox.yMax, e3.locationData.relativeBoundingBox.xMax];
          })), o = tensor1d(e2.map(function(e3) {
            return e3.score[0];
          })), [4, image.nonMaxSuppressionAsync(i2, o, t, n)];
        case 1:
          return [4, (r = c.sent()).array()];
        case 2:
          return a = c.sent(), u = e2.filter(function(e3, t2) {
            return a.indexOf(t2) > -1;
          }), dispose([i2, o, r]), [2, u];
      }
    });
  });
}
function j(e2, t, n) {
  return T(this, void 0, void 0, function() {
    var i, s, h, u, c;
    return C(this, function(p) {
      switch (p.label) {
        case 0:
          return i = e2[0], s = e2[1], h = function(e3, t2, n2) {
            return tidy(function() {
              var i2, o, s2, h2;
              n2.reverseOutputOrder ? (o = squeeze(slice(e3, [0, n2.boxCoordOffset + 0], [-1, 1])), i2 = squeeze(slice(e3, [0, n2.boxCoordOffset + 1], [-1, 1])), h2 = squeeze(slice(e3, [0, n2.boxCoordOffset + 2], [-1, 1])), s2 = squeeze(slice(e3, [0, n2.boxCoordOffset + 3], [-1, 1]))) : (i2 = squeeze(slice(e3, [0, n2.boxCoordOffset + 0], [-1, 1])), o = squeeze(slice(e3, [0, n2.boxCoordOffset + 1], [-1, 1])), s2 = squeeze(slice(e3, [0, n2.boxCoordOffset + 2], [-1, 1])), h2 = squeeze(slice(e3, [0, n2.boxCoordOffset + 3], [-1, 1]))), o = add(mul(div(o, n2.xScale), t2.w), t2.x), i2 = add(mul(div(i2, n2.yScale), t2.h), t2.y), n2.applyExponentialOnBoxSize ? (s2 = mul(exp(div(s2, n2.hScale)), t2.h), h2 = mul(exp(div(h2, n2.wScale)), t2.w)) : (s2 = mul(div(s2, n2.hScale), t2.h), h2 = mul(div(h2, n2.wScale), t2.h));
              var u2 = sub(i2, div(s2, 2)), c2 = sub(o, div(h2, 2)), d = add(i2, div(s2, 2)), p2 = add(o, div(h2, 2)), w = concat([reshape(u2, [n2.numBoxes, 1]), reshape(c2, [n2.numBoxes, 1]), reshape(d, [n2.numBoxes, 1]), reshape(p2, [n2.numBoxes, 1])], 1);
              if (n2.numKeypoints) for (var M = 0; M < n2.numKeypoints; ++M) {
                var S = n2.keypointCoordOffset + M * n2.numValuesPerKeypoint, b2 = void 0, T2 = void 0;
                n2.reverseOutputOrder ? (b2 = squeeze(slice(e3, [0, S], [-1, 1])), T2 = squeeze(slice(e3, [0, S + 1], [-1, 1]))) : (T2 = squeeze(slice(e3, [0, S], [-1, 1])), b2 = squeeze(slice(e3, [0, S + 1], [-1, 1])));
                var C2 = add(mul(div(b2, n2.xScale), t2.w), t2.x), O2 = add(mul(div(T2, n2.yScale), t2.h), t2.y);
                w = concat([w, reshape(C2, [n2.numBoxes, 1]), reshape(O2, [n2.numBoxes, 1])], 1);
              }
              return w;
            });
          }(s, t, n), u = tidy(function() {
            var e3 = i;
            return n.sigmoidScore ? (null != n.scoreClippingThresh && (e3 = clipByValue(i, -n.scoreClippingThresh, n.scoreClippingThresh)), e3 = sigmoid(e3)) : e3;
          }), [4, I(h, u, n)];
        case 1:
          return c = p.sent(), dispose([h, u]), [2, c];
      }
    });
  });
}
function I(e2, t, n) {
  return T(this, void 0, void 0, function() {
    var i, o, r, a, s, h, u, c, l, f, d, p;
    return C(this, function(m) {
      switch (m.label) {
        case 0:
          return i = [], [4, e2.data()];
        case 1:
          return o = m.sent(), [4, t.data()];
        case 2:
          for (r = m.sent(), a = 0; a < n.numBoxes; ++a) if (!(null != n.minScoreThresh && r[a] < n.minScoreThresh || (s = a * n.numCoords, h = _(o[s + 0], o[s + 1], o[s + 2], o[s + 3], r[a], n.flipVertically, a), (u = h.locationData.relativeBoundingBox).width < 0 || u.height < 0))) {
            if (n.numKeypoints > 0) for ((c = h.locationData).relativeKeypoints = [], l = n.numKeypoints * n.numValuesPerKeypoint, f = 0; f < l; f += n.numValuesPerKeypoint) d = s + n.keypointCoordOffset + f, p = { x: o[d + 0], y: n.flipVertically ? 1 - o[d + 1] : o[d + 1] }, c.relativeKeypoints.push(p);
            i.push(h);
          }
          return [2, i];
      }
    });
  });
}
function _(e2, t, n, i, o, r, a) {
  return { score: [o], ind: a, locationData: { relativeBoundingBox: { xMin: t, yMin: r ? 1 - n : e2, xMax: i, yMax: r ? 1 - e2 : n, width: i - t, height: n - e2 } } };
}
var N = { reduceBoxesInLowestLayer: false, interpolatedScaleAspectRatio: 1, featureMapHeight: [], featureMapWidth: [], numLayers: 4, minScale: 0.1484375, maxScale: 0.75, inputSizeHeight: 128, inputSizeWidth: 128, anchorOffsetX: 0.5, anchorOffsetY: 0.5, strides: [8, 16, 16, 16], aspectRatios: [1], fixedAnchorSize: true };
var W = { reduceBoxesInLowestLayer: false, interpolatedScaleAspectRatio: 0, featureMapHeight: [], featureMapWidth: [], numLayers: 1, minScale: 0.1484375, maxScale: 0.75, inputSizeHeight: 192, inputSizeWidth: 192, anchorOffsetX: 0.5, anchorOffsetY: 0.5, strides: [4], aspectRatios: [1], fixedAnchorSize: true };
var X = { runtime: "tfjs", modelType: "short", maxFaces: 1, detectorModelUrl: "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1" };
var Y = { applyExponentialOnBoxSize: false, flipVertically: false, ignoreClasses: [], numClasses: 1, numBoxes: 896, numCoords: 16, boxCoordOffset: 0, keypointCoordOffset: 4, numKeypoints: 6, numValuesPerKeypoint: 2, sigmoidScore: true, scoreClippingThresh: 100, reverseOutputOrder: true, xScale: 128, yScale: 128, hScale: 128, wScale: 128, minScoreThresh: 0.5 };
var q = { applyExponentialOnBoxSize: false, flipVertically: false, ignoreClasses: [], numClasses: 1, numBoxes: 2304, numCoords: 16, boxCoordOffset: 0, keypointCoordOffset: 4, numKeypoints: 6, numValuesPerKeypoint: 2, sigmoidScore: true, scoreClippingThresh: 100, reverseOutputOrder: true, xScale: 192, yScale: 192, hScale: 192, wScale: 192, minScoreThresh: 0.6 };
var G = 0.3;
var $ = { outputTensorSize: { width: 128, height: 128 }, keepAspectRatio: true, outputTensorFloatRange: [-1, 1], borderMode: "zero" };
var J = { outputTensorSize: { width: 192, height: 192 }, keepAspectRatio: true, outputTensorFloatRange: [-1, 1], borderMode: "zero" };
var Q;
var Z = function() {
  function e2(e3, t, n) {
    this.detectorModel = t, this.maxFaces = n, "full" === e3 ? (this.imageToTensorConfig = J, this.tensorsToDetectionConfig = q, this.anchors = k(W)) : (this.imageToTensorConfig = $, this.tensorsToDetectionConfig = Y, this.anchors = k(N));
    var i = tensor1d(this.anchors.map(function(e4) {
      return e4.width;
    })), o = tensor1d(this.anchors.map(function(e4) {
      return e4.height;
    })), r = tensor1d(this.anchors.map(function(e4) {
      return e4.xCenter;
    })), a = tensor1d(this.anchors.map(function(e4) {
      return e4.yCenter;
    }));
    this.anchorTensor = { x: r, y: a, w: i, h: o };
  }
  return e2.prototype.dispose = function() {
    this.detectorModel.dispose(), dispose([this.anchorTensor.x, this.anchorTensor.y, this.anchorTensor.w, this.anchorTensor.h]);
  }, e2.prototype.reset = function() {
  }, e2.prototype.detectFaces = function(e3, t) {
    return void 0 === t && (t = false), T(this, void 0, void 0, function() {
      var n, i, r, a, s, l, p, m, x, g, y;
      return C(this, function(v) {
        switch (v.label) {
          case 0:
            return null == e3 ? (this.reset(), [2, []]) : (n = tidy(function() {
              var n2 = cast(E(e3), "float32");
              if (t) {
                n2 = squeeze(image.flipLeftRight(expandDims(n2, 0)), [0]);
              }
              return n2;
            }), i = K(n, this.imageToTensorConfig), r = i.imageTensor, a = i.transformationMatrix, s = this.detectorModel.execute(r, "Identity:0"), l = H(s), p = l.boxes, [4, j([m = l.logits, p], this.anchorTensor, this.tensorsToDetectionConfig)]);
          case 1:
            return 0 === (x = v.sent()).length ? (dispose([n, r, s, m, p]), [2, x]) : [4, U(x, this.maxFaces, G)];
          case 2:
            return g = v.sent(), y = function(e4, t2) {
              void 0 === e4 && (e4 = []);
              var n2, i2 = (n2 = t2, [].concat.apply([], n2));
              return e4.forEach(function(e5) {
                var t3 = e5.locationData;
                t3.relativeKeypoints.forEach(function(e6) {
                  var t4 = V(i2, [e6.x, e6.y]), n4 = t4[0], o2 = t4[1];
                  e6.x = n4, e6.y = o2;
                });
                var n3 = t3.relativeBoundingBox, o = Number.MAX_VALUE, r2 = Number.MAX_VALUE, a2 = Number.MIN_VALUE, s2 = Number.MIN_VALUE;
                [[n3.xMin, n3.yMin], [n3.xMin + n3.width, n3.yMin], [n3.xMin + n3.width, n3.yMin + n3.height], [n3.xMin, n3.yMin + n3.height]].forEach(function(e6) {
                  var t4 = V(i2, e6), n4 = t4[0], h = t4[1];
                  o = Math.min(o, n4), a2 = Math.max(a2, n4), r2 = Math.min(r2, h), s2 = Math.max(s2, h);
                }), t3.relativeBoundingBox = { xMin: o, xMax: a2, yMin: r2, yMax: s2, width: a2 - o, height: s2 - r2 };
              }), e4;
            }(g, a), dispose([n, r, s, m, p]), [2, y];
        }
      });
    });
  }, e2.prototype.estimateFaces = function(e3, t) {
    return T(this, void 0, void 0, function() {
      var n, i;
      return C(this, function(o) {
        return n = F(e3), i = !!t && t.flipHorizontal, [2, this.detectFaces(e3, i).then(function(e4) {
          return e4.map(function(e5) {
            for (var t2 = e5.locationData.relativeKeypoints.map(function(e6, t3) {
              return b(b({}, e6), { x: e6.x * n.width, y: e6.y * n.height, name: O[t3] });
            }), i2 = e5.locationData.relativeBoundingBox, o2 = 0, r = ["width", "xMax", "xMin"]; o2 < r.length; o2++) {
              i2[r[o2]] *= n.width;
            }
            for (var a = 0, s = ["height", "yMax", "yMin"]; a < s.length; a++) {
              i2[s[a]] *= n.height;
            }
            return { keypoints: t2, box: i2 };
          });
        })];
      });
    });
  }, e2;
}();
function ee(e2) {
  return T(this, void 0, void 0, function() {
    var t, n, i;
    return C(this, function(o) {
      switch (o.label) {
        case 0:
          return t = function(e3) {
            if (null == e3) return b({}, X);
            var t2 = b({}, e3);
            null == t2.modelType && (t2.modelType = X.modelType), null == t2.maxFaces && (t2.maxFaces = X.maxFaces), null == t2.detectorModelUrl && ("full" === t2.modelType ? t2.detectorModelUrl = "https://tfhub.dev/mediapipe/tfjs-model/face_detection/full/1" : t2.detectorModelUrl = "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1");
            return t2;
          }(e2), n = "string" == typeof t.detectorModelUrl && t.detectorModelUrl.indexOf("https://tfhub.dev") > -1, [4, loadGraphModel(t.detectorModelUrl, { fromTFHub: n })];
        case 1:
          return i = o.sent(), [2, new Z(t.modelType, i, t.maxFaces)];
      }
    });
  });
}
function te(e2, t) {
  return T(this, void 0, void 0, function() {
    var n, i;
    return C(this, function(o) {
      if (e2 === Q.MediaPipeFaceDetector) {
        if (i = void 0, null != (n = t)) {
          if ("tfjs" === n.runtime) return [2, ee(n)];
          if ("mediapipe" === n.runtime) return [2, D(n)];
          i = n.runtime;
        }
        throw new Error("Expect modelConfig.runtime to be either 'tfjs' " + "or 'mediapipe', but got ".concat(i));
      }
      throw new Error("".concat(e2, " is not a supported model name."));
    });
  });
}
!function(e2) {
  e2.MediaPipeFaceDetector = "MediaPipeFaceDetector";
}(Q || (Q = {}));
export {
  z as MediaPipeFaceDetectorMediaPipe,
  Z as MediaPipeFaceDetectorTfjs,
  Q as SupportedModels,
  te as createDetector
};
/*! Bundled license information:

@tensorflow-models/face-detection/dist/face-detection.esm.js:
  (**
      * @license
      * Copyright 2024 Google LLC. All Rights Reserved.
      * Licensed under the Apache License, Version 2.0 (the "License");
      * you may not use this file except in compliance with the License.
      * You may obtain a copy of the License at
      *
      * http://www.apache.org/licenses/LICENSE-2.0
      *
      * Unless required by applicable law or agreed to in writing, software
      * distributed under the License is distributed on an "AS IS" BASIS,
      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      * See the License for the specific language governing permissions and
      * limitations under the License.
      * =============================================================================
      *)
*/
//# sourceMappingURL=@tensorflow-models_face-detection.js.map
