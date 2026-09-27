var nobleNip44 = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // node_modules/@noble/ciphers/utils.js
  var require_utils = __commonJS({
    "node_modules/@noble/ciphers/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.wrapCipher = exports.Hash = exports.nextTick = exports.isLE = void 0;
      exports.isBytes = isBytes;
      exports.abool = abool;
      exports.anumber = anumber;
      exports.abytes = abytes;
      exports.ahash = ahash;
      exports.aexists = aexists;
      exports.aoutput = aoutput;
      exports.u8 = u8;
      exports.u32 = u32;
      exports.clean = clean;
      exports.createView = createView;
      exports.bytesToHex = bytesToHex;
      exports.hexToBytes = hexToBytes;
      exports.hexToNumber = hexToNumber;
      exports.bytesToNumberBE = bytesToNumberBE;
      exports.numberToBytesBE = numberToBytesBE;
      exports.utf8ToBytes = utf8ToBytes;
      exports.bytesToUtf8 = bytesToUtf8;
      exports.toBytes = toBytes;
      exports.overlapBytes = overlapBytes;
      exports.complexOverlapBytes = complexOverlapBytes;
      exports.concatBytes = concatBytes;
      exports.checkOpts = checkOpts;
      exports.equalBytes = equalBytes;
      exports.getOutput = getOutput;
      exports.setBigUint64 = setBigUint64;
      exports.u64Lengths = u64Lengths;
      exports.isAligned32 = isAligned32;
      exports.copyBytes = copyBytes;
      function isBytes(a) {
        return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
      }
      function abool(b) {
        if (typeof b !== "boolean")
          throw new Error(`boolean expected, not ${b}`);
      }
      function anumber(n) {
        if (!Number.isSafeInteger(n) || n < 0)
          throw new Error("positive integer expected, got " + n);
      }
      function abytes(b, ...lengths) {
        if (!isBytes(b))
          throw new Error("Uint8Array expected");
        if (lengths.length > 0 && !lengths.includes(b.length))
          throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
      }
      function ahash(h) {
        if (typeof h !== "function" || typeof h.create !== "function")
          throw new Error("Hash should be wrapped by utils.createHasher");
        anumber(h.outputLen);
        anumber(h.blockLen);
      }
      function aexists(instance, checkFinished = true) {
        if (instance.destroyed)
          throw new Error("Hash instance has been destroyed");
        if (checkFinished && instance.finished)
          throw new Error("Hash#digest() has already been called");
      }
      function aoutput(out, instance) {
        abytes(out);
        const min = instance.outputLen;
        if (out.length < min) {
          throw new Error("digestInto() expects output buffer of length at least " + min);
        }
      }
      function u8(arr) {
        return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
      }
      function u32(arr) {
        return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
      }
      function clean(...arrays) {
        for (let i = 0; i < arrays.length; i++) {
          arrays[i].fill(0);
        }
      }
      function createView(arr) {
        return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
      }
      exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
      var hasHexBuiltin = /* @__PURE__ */ (() => (
        // @ts-ignore
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      ))();
      var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex(bytes) {
        abytes(bytes);
        if (hasHexBuiltin)
          return bytes.toHex();
        let hex = "";
        for (let i = 0; i < bytes.length; i++) {
          hex += hexes[bytes[i]];
        }
        return hex;
      }
      var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      function asciiToBase16(ch) {
        if (ch >= asciis._0 && ch <= asciis._9)
          return ch - asciis._0;
        if (ch >= asciis.A && ch <= asciis.F)
          return ch - (asciis.A - 10);
        if (ch >= asciis.a && ch <= asciis.f)
          return ch - (asciis.a - 10);
        return;
      }
      function hexToBytes(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        if (hasHexBuiltin)
          return Uint8Array.fromHex(hex);
        const hl = hex.length;
        const al = hl / 2;
        if (hl % 2)
          throw new Error("hex string expected, got unpadded hex of length " + hl);
        const array = new Uint8Array(al);
        for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
          const n1 = asciiToBase16(hex.charCodeAt(hi));
          const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
          if (n1 === void 0 || n2 === void 0) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
          }
          array[ai] = n1 * 16 + n2;
        }
        return array;
      }
      function hexToNumber(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        return BigInt(hex === "" ? "0" : "0x" + hex);
      }
      function bytesToNumberBE(bytes) {
        return hexToNumber(bytesToHex(bytes));
      }
      function numberToBytesBE(n, len) {
        return hexToBytes(n.toString(16).padStart(len * 2, "0"));
      }
      var nextTick = async () => {
      };
      exports.nextTick = nextTick;
      function utf8ToBytes(str) {
        if (typeof str !== "string")
          throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(str));
      }
      function bytesToUtf8(bytes) {
        return new TextDecoder().decode(bytes);
      }
      function toBytes(data) {
        if (typeof data === "string")
          data = utf8ToBytes(data);
        else if (isBytes(data))
          data = copyBytes(data);
        else
          throw new Error("Uint8Array expected, got " + typeof data);
        return data;
      }
      function overlapBytes(a, b) {
        return a.buffer === b.buffer && // best we can do, may fail with an obscure Proxy
        a.byteOffset < b.byteOffset + b.byteLength && // a starts before b end
        b.byteOffset < a.byteOffset + a.byteLength;
      }
      function complexOverlapBytes(input, output) {
        if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
          throw new Error("complex overlap of input and output is not supported");
      }
      function concatBytes(...arrays) {
        let sum = 0;
        for (let i = 0; i < arrays.length; i++) {
          const a = arrays[i];
          abytes(a);
          sum += a.length;
        }
        const res = new Uint8Array(sum);
        for (let i = 0, pad = 0; i < arrays.length; i++) {
          const a = arrays[i];
          res.set(a, pad);
          pad += a.length;
        }
        return res;
      }
      function checkOpts(defaults, opts) {
        if (opts == null || typeof opts !== "object")
          throw new Error("options must be defined");
        const merged = Object.assign(defaults, opts);
        return merged;
      }
      function equalBytes(a, b) {
        if (a.length !== b.length)
          return false;
        let diff = 0;
        for (let i = 0; i < a.length; i++)
          diff |= a[i] ^ b[i];
        return diff === 0;
      }
      var Hash = class {
      };
      exports.Hash = Hash;
      var wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
        function wrappedCipher(key, ...args) {
          abytes(key);
          if (!exports.isLE)
            throw new Error("Non little-endian hardware is not yet supported");
          if (params.nonceLength !== void 0) {
            const nonce = args[0];
            if (!nonce)
              throw new Error("nonce / iv required");
            if (params.varSizeNonce)
              abytes(nonce);
            else
              abytes(nonce, params.nonceLength);
          }
          const tagl = params.tagLength;
          if (tagl && args[1] !== void 0) {
            abytes(args[1]);
          }
          const cipher = constructor(key, ...args);
          const checkOutput = (fnLength, output) => {
            if (output !== void 0) {
              if (fnLength !== 2)
                throw new Error("cipher output not supported");
              abytes(output);
            }
          };
          let called = false;
          const wrCipher = {
            encrypt(data, output) {
              if (called)
                throw new Error("cannot encrypt() twice with same key + nonce");
              called = true;
              abytes(data);
              checkOutput(cipher.encrypt.length, output);
              return cipher.encrypt(data, output);
            },
            decrypt(data, output) {
              abytes(data);
              if (tagl && data.length < tagl)
                throw new Error("invalid ciphertext length: smaller than tagLength=" + tagl);
              checkOutput(cipher.decrypt.length, output);
              return cipher.decrypt(data, output);
            }
          };
          return wrCipher;
        }
        Object.assign(wrappedCipher, params);
        return wrappedCipher;
      };
      exports.wrapCipher = wrapCipher;
      function getOutput(expectedLength, out, onlyAligned = true) {
        if (out === void 0)
          return new Uint8Array(expectedLength);
        if (out.length !== expectedLength)
          throw new Error("invalid output length, expected " + expectedLength + ", got: " + out.length);
        if (onlyAligned && !isAligned32(out))
          throw new Error("invalid output, must be aligned");
        return out;
      }
      function setBigUint64(view, byteOffset, value, isLE) {
        if (typeof view.setBigUint64 === "function")
          return view.setBigUint64(byteOffset, value, isLE);
        const _32n = BigInt(32);
        const _u32_max = BigInt(4294967295);
        const wh = Number(value >> _32n & _u32_max);
        const wl = Number(value & _u32_max);
        const h = isLE ? 4 : 0;
        const l = isLE ? 0 : 4;
        view.setUint32(byteOffset + h, wh, isLE);
        view.setUint32(byteOffset + l, wl, isLE);
      }
      function u64Lengths(dataLength, aadLength, isLE) {
        abool(isLE);
        const num = new Uint8Array(16);
        const view = createView(num);
        setBigUint64(view, 0, BigInt(aadLength), isLE);
        setBigUint64(view, 8, BigInt(dataLength), isLE);
        return num;
      }
      function isAligned32(bytes) {
        return bytes.byteOffset % 4 === 0;
      }
      function copyBytes(bytes) {
        return Uint8Array.from(bytes);
      }
    }
  });

  // node_modules/@noble/ciphers/_arx.js
  var require_arx = __commonJS({
    "node_modules/@noble/ciphers/_arx.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.rotl = rotl;
      exports.createCipher = createCipher;
      var utils_ts_1 = require_utils();
      var _utf8ToBytes = (str) => Uint8Array.from(str.split("").map((c) => c.charCodeAt(0)));
      var sigma16 = _utf8ToBytes("expand 16-byte k");
      var sigma32 = _utf8ToBytes("expand 32-byte k");
      var sigma16_32 = (0, utils_ts_1.u32)(sigma16);
      var sigma32_32 = (0, utils_ts_1.u32)(sigma32);
      function rotl(a, b) {
        return a << b | a >>> 32 - b;
      }
      function isAligned32(b) {
        return b.byteOffset % 4 === 0;
      }
      var BLOCK_LEN = 64;
      var BLOCK_LEN32 = 16;
      var MAX_COUNTER = 2 ** 32 - 1;
      var U32_EMPTY = new Uint32Array();
      function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
        const len = data.length;
        const block = new Uint8Array(BLOCK_LEN);
        const b32 = (0, utils_ts_1.u32)(block);
        const isAligned = isAligned32(data) && isAligned32(output);
        const d32 = isAligned ? (0, utils_ts_1.u32)(data) : U32_EMPTY;
        const o32 = isAligned ? (0, utils_ts_1.u32)(output) : U32_EMPTY;
        for (let pos = 0; pos < len; counter++) {
          core(sigma, key, nonce, b32, counter, rounds);
          if (counter >= MAX_COUNTER)
            throw new Error("arx: counter overflow");
          const take = Math.min(BLOCK_LEN, len - pos);
          if (isAligned && take === BLOCK_LEN) {
            const pos32 = pos / 4;
            if (pos % 4 !== 0)
              throw new Error("arx: invalid block position");
            for (let j = 0, posj; j < BLOCK_LEN32; j++) {
              posj = pos32 + j;
              o32[posj] = d32[posj] ^ b32[j];
            }
            pos += BLOCK_LEN;
            continue;
          }
          for (let j = 0, posj; j < take; j++) {
            posj = pos + j;
            output[posj] = data[posj] ^ block[j];
          }
          pos += take;
        }
      }
      function createCipher(core, opts) {
        const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = (0, utils_ts_1.checkOpts)({ allowShortKeys: false, counterLength: 8, counterRight: false, rounds: 20 }, opts);
        if (typeof core !== "function")
          throw new Error("core must be a function");
        (0, utils_ts_1.anumber)(counterLength);
        (0, utils_ts_1.anumber)(rounds);
        (0, utils_ts_1.abool)(counterRight);
        (0, utils_ts_1.abool)(allowShortKeys);
        return (key, nonce, data, output, counter = 0) => {
          (0, utils_ts_1.abytes)(key);
          (0, utils_ts_1.abytes)(nonce);
          (0, utils_ts_1.abytes)(data);
          const len = data.length;
          if (output === void 0)
            output = new Uint8Array(len);
          (0, utils_ts_1.abytes)(output);
          (0, utils_ts_1.anumber)(counter);
          if (counter < 0 || counter >= MAX_COUNTER)
            throw new Error("arx: counter overflow");
          if (output.length < len)
            throw new Error(`arx: output (${output.length}) is shorter than data (${len})`);
          const toClean = [];
          let l = key.length;
          let k;
          let sigma;
          if (l === 32) {
            toClean.push(k = (0, utils_ts_1.copyBytes)(key));
            sigma = sigma32_32;
          } else if (l === 16 && allowShortKeys) {
            k = new Uint8Array(32);
            k.set(key);
            k.set(key, 16);
            sigma = sigma16_32;
            toClean.push(k);
          } else {
            throw new Error(`arx: invalid 32-byte key, got length=${l}`);
          }
          if (!isAligned32(nonce))
            toClean.push(nonce = (0, utils_ts_1.copyBytes)(nonce));
          const k32 = (0, utils_ts_1.u32)(k);
          if (extendNonceFn) {
            if (nonce.length !== 24)
              throw new Error(`arx: extended nonce must be 24 bytes`);
            extendNonceFn(sigma, k32, (0, utils_ts_1.u32)(nonce.subarray(0, 16)), k32);
            nonce = nonce.subarray(16);
          }
          const nonceNcLen = 16 - counterLength;
          if (nonceNcLen !== nonce.length)
            throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
          if (nonceNcLen !== 12) {
            const nc = new Uint8Array(12);
            nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
            nonce = nc;
            toClean.push(nonce);
          }
          const n32 = (0, utils_ts_1.u32)(nonce);
          runCipher(core, sigma, k32, n32, data, output, counter, rounds);
          (0, utils_ts_1.clean)(...toClean);
          return output;
        };
      }
    }
  });

  // node_modules/@noble/ciphers/_poly1305.js
  var require_poly1305 = __commonJS({
    "node_modules/@noble/ciphers/_poly1305.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.poly1305 = void 0;
      exports.wrapConstructorWithKey = wrapConstructorWithKey;
      var utils_ts_1 = require_utils();
      var u8to16 = (a, i) => a[i++] & 255 | (a[i++] & 255) << 8;
      var Poly1305 = class {
        constructor(key) {
          this.blockLen = 16;
          this.outputLen = 16;
          this.buffer = new Uint8Array(16);
          this.r = new Uint16Array(10);
          this.h = new Uint16Array(10);
          this.pad = new Uint16Array(8);
          this.pos = 0;
          this.finished = false;
          key = (0, utils_ts_1.toBytes)(key);
          (0, utils_ts_1.abytes)(key, 32);
          const t0 = u8to16(key, 0);
          const t1 = u8to16(key, 2);
          const t2 = u8to16(key, 4);
          const t3 = u8to16(key, 6);
          const t4 = u8to16(key, 8);
          const t5 = u8to16(key, 10);
          const t6 = u8to16(key, 12);
          const t7 = u8to16(key, 14);
          this.r[0] = t0 & 8191;
          this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
          this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
          this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
          this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
          this.r[5] = t4 >>> 1 & 8190;
          this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
          this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
          this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
          this.r[9] = t7 >>> 5 & 127;
          for (let i = 0; i < 8; i++)
            this.pad[i] = u8to16(key, 16 + 2 * i);
        }
        process(data, offset, isLast = false) {
          const hibit = isLast ? 0 : 1 << 11;
          const { h, r } = this;
          const r0 = r[0];
          const r1 = r[1];
          const r2 = r[2];
          const r3 = r[3];
          const r4 = r[4];
          const r5 = r[5];
          const r6 = r[6];
          const r7 = r[7];
          const r8 = r[8];
          const r9 = r[9];
          const t0 = u8to16(data, offset + 0);
          const t1 = u8to16(data, offset + 2);
          const t2 = u8to16(data, offset + 4);
          const t3 = u8to16(data, offset + 6);
          const t4 = u8to16(data, offset + 8);
          const t5 = u8to16(data, offset + 10);
          const t6 = u8to16(data, offset + 12);
          const t7 = u8to16(data, offset + 14);
          let h0 = h[0] + (t0 & 8191);
          let h1 = h[1] + ((t0 >>> 13 | t1 << 3) & 8191);
          let h2 = h[2] + ((t1 >>> 10 | t2 << 6) & 8191);
          let h3 = h[3] + ((t2 >>> 7 | t3 << 9) & 8191);
          let h4 = h[4] + ((t3 >>> 4 | t4 << 12) & 8191);
          let h5 = h[5] + (t4 >>> 1 & 8191);
          let h6 = h[6] + ((t4 >>> 14 | t5 << 2) & 8191);
          let h7 = h[7] + ((t5 >>> 11 | t6 << 5) & 8191);
          let h8 = h[8] + ((t6 >>> 8 | t7 << 8) & 8191);
          let h9 = h[9] + (t7 >>> 5 | hibit);
          let c = 0;
          let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
          c = d0 >>> 13;
          d0 &= 8191;
          d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
          c += d0 >>> 13;
          d0 &= 8191;
          let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
          c = d1 >>> 13;
          d1 &= 8191;
          d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
          c += d1 >>> 13;
          d1 &= 8191;
          let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
          c = d2 >>> 13;
          d2 &= 8191;
          d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
          c += d2 >>> 13;
          d2 &= 8191;
          let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
          c = d3 >>> 13;
          d3 &= 8191;
          d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
          c += d3 >>> 13;
          d3 &= 8191;
          let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
          c = d4 >>> 13;
          d4 &= 8191;
          d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
          c += d4 >>> 13;
          d4 &= 8191;
          let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
          c = d5 >>> 13;
          d5 &= 8191;
          d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
          c += d5 >>> 13;
          d5 &= 8191;
          let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
          c = d6 >>> 13;
          d6 &= 8191;
          d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
          c += d6 >>> 13;
          d6 &= 8191;
          let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
          c = d7 >>> 13;
          d7 &= 8191;
          d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
          c += d7 >>> 13;
          d7 &= 8191;
          let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
          c = d8 >>> 13;
          d8 &= 8191;
          d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
          c += d8 >>> 13;
          d8 &= 8191;
          let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
          c = d9 >>> 13;
          d9 &= 8191;
          d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
          c += d9 >>> 13;
          d9 &= 8191;
          c = (c << 2) + c | 0;
          c = c + d0 | 0;
          d0 = c & 8191;
          c = c >>> 13;
          d1 += c;
          h[0] = d0;
          h[1] = d1;
          h[2] = d2;
          h[3] = d3;
          h[4] = d4;
          h[5] = d5;
          h[6] = d6;
          h[7] = d7;
          h[8] = d8;
          h[9] = d9;
        }
        finalize() {
          const { h, pad } = this;
          const g = new Uint16Array(10);
          let c = h[1] >>> 13;
          h[1] &= 8191;
          for (let i = 2; i < 10; i++) {
            h[i] += c;
            c = h[i] >>> 13;
            h[i] &= 8191;
          }
          h[0] += c * 5;
          c = h[0] >>> 13;
          h[0] &= 8191;
          h[1] += c;
          c = h[1] >>> 13;
          h[1] &= 8191;
          h[2] += c;
          g[0] = h[0] + 5;
          c = g[0] >>> 13;
          g[0] &= 8191;
          for (let i = 1; i < 10; i++) {
            g[i] = h[i] + c;
            c = g[i] >>> 13;
            g[i] &= 8191;
          }
          g[9] -= 1 << 13;
          let mask = (c ^ 1) - 1;
          for (let i = 0; i < 10; i++)
            g[i] &= mask;
          mask = ~mask;
          for (let i = 0; i < 10; i++)
            h[i] = h[i] & mask | g[i];
          h[0] = (h[0] | h[1] << 13) & 65535;
          h[1] = (h[1] >>> 3 | h[2] << 10) & 65535;
          h[2] = (h[2] >>> 6 | h[3] << 7) & 65535;
          h[3] = (h[3] >>> 9 | h[4] << 4) & 65535;
          h[4] = (h[4] >>> 12 | h[5] << 1 | h[6] << 14) & 65535;
          h[5] = (h[6] >>> 2 | h[7] << 11) & 65535;
          h[6] = (h[7] >>> 5 | h[8] << 8) & 65535;
          h[7] = (h[8] >>> 8 | h[9] << 5) & 65535;
          let f = h[0] + pad[0];
          h[0] = f & 65535;
          for (let i = 1; i < 8; i++) {
            f = (h[i] + pad[i] | 0) + (f >>> 16) | 0;
            h[i] = f & 65535;
          }
          (0, utils_ts_1.clean)(g);
        }
        update(data) {
          (0, utils_ts_1.aexists)(this);
          data = (0, utils_ts_1.toBytes)(data);
          (0, utils_ts_1.abytes)(data);
          const { buffer, blockLen } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(data, pos);
              continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(buffer, 0, false);
              this.pos = 0;
            }
          }
          return this;
        }
        destroy() {
          (0, utils_ts_1.clean)(this.h, this.r, this.buffer, this.pad);
        }
        digestInto(out) {
          (0, utils_ts_1.aexists)(this);
          (0, utils_ts_1.aoutput)(out, this);
          this.finished = true;
          const { buffer, h } = this;
          let { pos } = this;
          if (pos) {
            buffer[pos++] = 1;
            for (; pos < 16; pos++)
              buffer[pos] = 0;
            this.process(buffer, 0, true);
          }
          this.finalize();
          let opos = 0;
          for (let i = 0; i < 8; i++) {
            out[opos++] = h[i] >>> 0;
            out[opos++] = h[i] >>> 8;
          }
          return out;
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
      };
      function wrapConstructorWithKey(hashCons) {
        const hashC = (msg, key) => hashCons(key).update((0, utils_ts_1.toBytes)(msg)).digest();
        const tmp = hashCons(new Uint8Array(32));
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (key) => hashCons(key);
        return hashC;
      }
      exports.poly1305 = wrapConstructorWithKey((key) => new Poly1305(key));
    }
  });

  // node_modules/@noble/ciphers/chacha.js
  var require_chacha = __commonJS({
    "node_modules/@noble/ciphers/chacha.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.xchacha20poly1305 = exports.chacha20poly1305 = exports._poly1305_aead = exports.chacha12 = exports.chacha8 = exports.xchacha20 = exports.chacha20 = exports.chacha20orig = void 0;
      exports.hchacha = hchacha;
      var _arx_ts_1 = require_arx();
      var _poly1305_ts_1 = require_poly1305();
      var utils_ts_1 = require_utils();
      function chachaCore(s, k, n, out, cnt, rounds = 20) {
        let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
        let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
        for (let r = 0; r < rounds; r += 2) {
          x00 = x00 + x04 | 0;
          x12 = (0, _arx_ts_1.rotl)(x12 ^ x00, 16);
          x08 = x08 + x12 | 0;
          x04 = (0, _arx_ts_1.rotl)(x04 ^ x08, 12);
          x00 = x00 + x04 | 0;
          x12 = (0, _arx_ts_1.rotl)(x12 ^ x00, 8);
          x08 = x08 + x12 | 0;
          x04 = (0, _arx_ts_1.rotl)(x04 ^ x08, 7);
          x01 = x01 + x05 | 0;
          x13 = (0, _arx_ts_1.rotl)(x13 ^ x01, 16);
          x09 = x09 + x13 | 0;
          x05 = (0, _arx_ts_1.rotl)(x05 ^ x09, 12);
          x01 = x01 + x05 | 0;
          x13 = (0, _arx_ts_1.rotl)(x13 ^ x01, 8);
          x09 = x09 + x13 | 0;
          x05 = (0, _arx_ts_1.rotl)(x05 ^ x09, 7);
          x02 = x02 + x06 | 0;
          x14 = (0, _arx_ts_1.rotl)(x14 ^ x02, 16);
          x10 = x10 + x14 | 0;
          x06 = (0, _arx_ts_1.rotl)(x06 ^ x10, 12);
          x02 = x02 + x06 | 0;
          x14 = (0, _arx_ts_1.rotl)(x14 ^ x02, 8);
          x10 = x10 + x14 | 0;
          x06 = (0, _arx_ts_1.rotl)(x06 ^ x10, 7);
          x03 = x03 + x07 | 0;
          x15 = (0, _arx_ts_1.rotl)(x15 ^ x03, 16);
          x11 = x11 + x15 | 0;
          x07 = (0, _arx_ts_1.rotl)(x07 ^ x11, 12);
          x03 = x03 + x07 | 0;
          x15 = (0, _arx_ts_1.rotl)(x15 ^ x03, 8);
          x11 = x11 + x15 | 0;
          x07 = (0, _arx_ts_1.rotl)(x07 ^ x11, 7);
          x00 = x00 + x05 | 0;
          x15 = (0, _arx_ts_1.rotl)(x15 ^ x00, 16);
          x10 = x10 + x15 | 0;
          x05 = (0, _arx_ts_1.rotl)(x05 ^ x10, 12);
          x00 = x00 + x05 | 0;
          x15 = (0, _arx_ts_1.rotl)(x15 ^ x00, 8);
          x10 = x10 + x15 | 0;
          x05 = (0, _arx_ts_1.rotl)(x05 ^ x10, 7);
          x01 = x01 + x06 | 0;
          x12 = (0, _arx_ts_1.rotl)(x12 ^ x01, 16);
          x11 = x11 + x12 | 0;
          x06 = (0, _arx_ts_1.rotl)(x06 ^ x11, 12);
          x01 = x01 + x06 | 0;
          x12 = (0, _arx_ts_1.rotl)(x12 ^ x01, 8);
          x11 = x11 + x12 | 0;
          x06 = (0, _arx_ts_1.rotl)(x06 ^ x11, 7);
          x02 = x02 + x07 | 0;
          x13 = (0, _arx_ts_1.rotl)(x13 ^ x02, 16);
          x08 = x08 + x13 | 0;
          x07 = (0, _arx_ts_1.rotl)(x07 ^ x08, 12);
          x02 = x02 + x07 | 0;
          x13 = (0, _arx_ts_1.rotl)(x13 ^ x02, 8);
          x08 = x08 + x13 | 0;
          x07 = (0, _arx_ts_1.rotl)(x07 ^ x08, 7);
          x03 = x03 + x04 | 0;
          x14 = (0, _arx_ts_1.rotl)(x14 ^ x03, 16);
          x09 = x09 + x14 | 0;
          x04 = (0, _arx_ts_1.rotl)(x04 ^ x09, 12);
          x03 = x03 + x04 | 0;
          x14 = (0, _arx_ts_1.rotl)(x14 ^ x03, 8);
          x09 = x09 + x14 | 0;
          x04 = (0, _arx_ts_1.rotl)(x04 ^ x09, 7);
        }
        let oi = 0;
        out[oi++] = y00 + x00 | 0;
        out[oi++] = y01 + x01 | 0;
        out[oi++] = y02 + x02 | 0;
        out[oi++] = y03 + x03 | 0;
        out[oi++] = y04 + x04 | 0;
        out[oi++] = y05 + x05 | 0;
        out[oi++] = y06 + x06 | 0;
        out[oi++] = y07 + x07 | 0;
        out[oi++] = y08 + x08 | 0;
        out[oi++] = y09 + x09 | 0;
        out[oi++] = y10 + x10 | 0;
        out[oi++] = y11 + x11 | 0;
        out[oi++] = y12 + x12 | 0;
        out[oi++] = y13 + x13 | 0;
        out[oi++] = y14 + x14 | 0;
        out[oi++] = y15 + x15 | 0;
      }
      function hchacha(s, k, i, o32) {
        let x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i[0], x13 = i[1], x14 = i[2], x15 = i[3];
        for (let r = 0; r < 20; r += 2) {
          x00 = x00 + x04 | 0;
          x12 = (0, _arx_ts_1.rotl)(x12 ^ x00, 16);
          x08 = x08 + x12 | 0;
          x04 = (0, _arx_ts_1.rotl)(x04 ^ x08, 12);
          x00 = x00 + x04 | 0;
          x12 = (0, _arx_ts_1.rotl)(x12 ^ x00, 8);
          x08 = x08 + x12 | 0;
          x04 = (0, _arx_ts_1.rotl)(x04 ^ x08, 7);
          x01 = x01 + x05 | 0;
          x13 = (0, _arx_ts_1.rotl)(x13 ^ x01, 16);
          x09 = x09 + x13 | 0;
          x05 = (0, _arx_ts_1.rotl)(x05 ^ x09, 12);
          x01 = x01 + x05 | 0;
          x13 = (0, _arx_ts_1.rotl)(x13 ^ x01, 8);
          x09 = x09 + x13 | 0;
          x05 = (0, _arx_ts_1.rotl)(x05 ^ x09, 7);
          x02 = x02 + x06 | 0;
          x14 = (0, _arx_ts_1.rotl)(x14 ^ x02, 16);
          x10 = x10 + x14 | 0;
          x06 = (0, _arx_ts_1.rotl)(x06 ^ x10, 12);
          x02 = x02 + x06 | 0;
          x14 = (0, _arx_ts_1.rotl)(x14 ^ x02, 8);
          x10 = x10 + x14 | 0;
          x06 = (0, _arx_ts_1.rotl)(x06 ^ x10, 7);
          x03 = x03 + x07 | 0;
          x15 = (0, _arx_ts_1.rotl)(x15 ^ x03, 16);
          x11 = x11 + x15 | 0;
          x07 = (0, _arx_ts_1.rotl)(x07 ^ x11, 12);
          x03 = x03 + x07 | 0;
          x15 = (0, _arx_ts_1.rotl)(x15 ^ x03, 8);
          x11 = x11 + x15 | 0;
          x07 = (0, _arx_ts_1.rotl)(x07 ^ x11, 7);
          x00 = x00 + x05 | 0;
          x15 = (0, _arx_ts_1.rotl)(x15 ^ x00, 16);
          x10 = x10 + x15 | 0;
          x05 = (0, _arx_ts_1.rotl)(x05 ^ x10, 12);
          x00 = x00 + x05 | 0;
          x15 = (0, _arx_ts_1.rotl)(x15 ^ x00, 8);
          x10 = x10 + x15 | 0;
          x05 = (0, _arx_ts_1.rotl)(x05 ^ x10, 7);
          x01 = x01 + x06 | 0;
          x12 = (0, _arx_ts_1.rotl)(x12 ^ x01, 16);
          x11 = x11 + x12 | 0;
          x06 = (0, _arx_ts_1.rotl)(x06 ^ x11, 12);
          x01 = x01 + x06 | 0;
          x12 = (0, _arx_ts_1.rotl)(x12 ^ x01, 8);
          x11 = x11 + x12 | 0;
          x06 = (0, _arx_ts_1.rotl)(x06 ^ x11, 7);
          x02 = x02 + x07 | 0;
          x13 = (0, _arx_ts_1.rotl)(x13 ^ x02, 16);
          x08 = x08 + x13 | 0;
          x07 = (0, _arx_ts_1.rotl)(x07 ^ x08, 12);
          x02 = x02 + x07 | 0;
          x13 = (0, _arx_ts_1.rotl)(x13 ^ x02, 8);
          x08 = x08 + x13 | 0;
          x07 = (0, _arx_ts_1.rotl)(x07 ^ x08, 7);
          x03 = x03 + x04 | 0;
          x14 = (0, _arx_ts_1.rotl)(x14 ^ x03, 16);
          x09 = x09 + x14 | 0;
          x04 = (0, _arx_ts_1.rotl)(x04 ^ x09, 12);
          x03 = x03 + x04 | 0;
          x14 = (0, _arx_ts_1.rotl)(x14 ^ x03, 8);
          x09 = x09 + x14 | 0;
          x04 = (0, _arx_ts_1.rotl)(x04 ^ x09, 7);
        }
        let oi = 0;
        o32[oi++] = x00;
        o32[oi++] = x01;
        o32[oi++] = x02;
        o32[oi++] = x03;
        o32[oi++] = x12;
        o32[oi++] = x13;
        o32[oi++] = x14;
        o32[oi++] = x15;
      }
      exports.chacha20orig = (0, _arx_ts_1.createCipher)(chachaCore, {
        counterRight: false,
        counterLength: 8,
        allowShortKeys: true
      });
      exports.chacha20 = (0, _arx_ts_1.createCipher)(chachaCore, {
        counterRight: false,
        counterLength: 4,
        allowShortKeys: false
      });
      exports.xchacha20 = (0, _arx_ts_1.createCipher)(chachaCore, {
        counterRight: false,
        counterLength: 8,
        extendNonceFn: hchacha,
        allowShortKeys: false
      });
      exports.chacha8 = (0, _arx_ts_1.createCipher)(chachaCore, {
        counterRight: false,
        counterLength: 4,
        rounds: 8
      });
      exports.chacha12 = (0, _arx_ts_1.createCipher)(chachaCore, {
        counterRight: false,
        counterLength: 4,
        rounds: 12
      });
      var ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
      var updatePadded = (h, msg) => {
        h.update(msg);
        const left = msg.length % 16;
        if (left)
          h.update(ZEROS16.subarray(left));
      };
      var ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
      function computeTag(fn, key, nonce, data, AAD) {
        const authKey = fn(key, nonce, ZEROS32);
        const h = _poly1305_ts_1.poly1305.create(authKey);
        if (AAD)
          updatePadded(h, AAD);
        updatePadded(h, data);
        const num = (0, utils_ts_1.u64Lengths)(data.length, AAD ? AAD.length : 0, true);
        h.update(num);
        const res = h.digest();
        (0, utils_ts_1.clean)(authKey, num);
        return res;
      }
      var _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
        const tagLength = 16;
        return {
          encrypt(plaintext, output) {
            const plength = plaintext.length;
            output = (0, utils_ts_1.getOutput)(plength + tagLength, output, false);
            output.set(plaintext);
            const oPlain = output.subarray(0, -tagLength);
            xorStream(key, nonce, oPlain, oPlain, 1);
            const tag = computeTag(xorStream, key, nonce, oPlain, AAD);
            output.set(tag, plength);
            (0, utils_ts_1.clean)(tag);
            return output;
          },
          decrypt(ciphertext, output) {
            output = (0, utils_ts_1.getOutput)(ciphertext.length - tagLength, output, false);
            const data = ciphertext.subarray(0, -tagLength);
            const passedTag = ciphertext.subarray(-tagLength);
            const tag = computeTag(xorStream, key, nonce, data, AAD);
            if (!(0, utils_ts_1.equalBytes)(passedTag, tag))
              throw new Error("invalid tag");
            output.set(ciphertext.subarray(0, -tagLength));
            xorStream(key, nonce, output, output, 1);
            (0, utils_ts_1.clean)(tag);
            return output;
          }
        };
      };
      exports._poly1305_aead = _poly1305_aead;
      exports.chacha20poly1305 = (0, utils_ts_1.wrapCipher)({ blockSize: 64, nonceLength: 12, tagLength: 16 }, (0, exports._poly1305_aead)(exports.chacha20));
      exports.xchacha20poly1305 = (0, utils_ts_1.wrapCipher)({ blockSize: 64, nonceLength: 24, tagLength: 16 }, (0, exports._poly1305_aead)(exports.xchacha20));
    }
  });

  // node_modules/@noble/hashes/crypto.js
  var require_crypto = __commonJS({
    "node_modules/@noble/hashes/crypto.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.crypto = void 0;
      exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    }
  });

  // node_modules/@noble/hashes/utils.js
  var require_utils2 = __commonJS({
    "node_modules/@noble/hashes/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
      exports.isBytes = isBytes;
      exports.anumber = anumber;
      exports.abytes = abytes;
      exports.ahash = ahash;
      exports.aexists = aexists;
      exports.aoutput = aoutput;
      exports.u8 = u8;
      exports.u32 = u32;
      exports.clean = clean;
      exports.createView = createView;
      exports.rotr = rotr;
      exports.rotl = rotl;
      exports.byteSwap = byteSwap;
      exports.byteSwap32 = byteSwap32;
      exports.bytesToHex = bytesToHex;
      exports.hexToBytes = hexToBytes;
      exports.asyncLoop = asyncLoop;
      exports.utf8ToBytes = utf8ToBytes;
      exports.bytesToUtf8 = bytesToUtf8;
      exports.toBytes = toBytes;
      exports.kdfInputToBytes = kdfInputToBytes;
      exports.concatBytes = concatBytes;
      exports.checkOpts = checkOpts;
      exports.createHasher = createHasher;
      exports.createOptHasher = createOptHasher;
      exports.createXOFer = createXOFer;
      exports.randomBytes = randomBytes;
      var crypto_1 = require_crypto();
      function isBytes(a) {
        return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
      }
      function anumber(n) {
        if (!Number.isSafeInteger(n) || n < 0)
          throw new Error("positive integer expected, got " + n);
      }
      function abytes(b, ...lengths) {
        if (!isBytes(b))
          throw new Error("Uint8Array expected");
        if (lengths.length > 0 && !lengths.includes(b.length))
          throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
      }
      function ahash(h) {
        if (typeof h !== "function" || typeof h.create !== "function")
          throw new Error("Hash should be wrapped by utils.createHasher");
        anumber(h.outputLen);
        anumber(h.blockLen);
      }
      function aexists(instance, checkFinished = true) {
        if (instance.destroyed)
          throw new Error("Hash instance has been destroyed");
        if (checkFinished && instance.finished)
          throw new Error("Hash#digest() has already been called");
      }
      function aoutput(out, instance) {
        abytes(out);
        const min = instance.outputLen;
        if (out.length < min) {
          throw new Error("digestInto() expects output buffer of length at least " + min);
        }
      }
      function u8(arr) {
        return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
      }
      function u32(arr) {
        return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
      }
      function clean(...arrays) {
        for (let i = 0; i < arrays.length; i++) {
          arrays[i].fill(0);
        }
      }
      function createView(arr) {
        return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
      }
      function rotr(word, shift) {
        return word << 32 - shift | word >>> shift;
      }
      function rotl(word, shift) {
        return word << shift | word >>> 32 - shift >>> 0;
      }
      exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
      function byteSwap(word) {
        return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
      }
      exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
      exports.byteSwapIfBE = exports.swap8IfBE;
      function byteSwap32(arr) {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = byteSwap(arr[i]);
        }
        return arr;
      }
      exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
      var hasHexBuiltin = /* @__PURE__ */ (() => (
        // @ts-ignore
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      ))();
      var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex(bytes) {
        abytes(bytes);
        if (hasHexBuiltin)
          return bytes.toHex();
        let hex = "";
        for (let i = 0; i < bytes.length; i++) {
          hex += hexes[bytes[i]];
        }
        return hex;
      }
      var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      function asciiToBase16(ch) {
        if (ch >= asciis._0 && ch <= asciis._9)
          return ch - asciis._0;
        if (ch >= asciis.A && ch <= asciis.F)
          return ch - (asciis.A - 10);
        if (ch >= asciis.a && ch <= asciis.f)
          return ch - (asciis.a - 10);
        return;
      }
      function hexToBytes(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        if (hasHexBuiltin)
          return Uint8Array.fromHex(hex);
        const hl = hex.length;
        const al = hl / 2;
        if (hl % 2)
          throw new Error("hex string expected, got unpadded hex of length " + hl);
        const array = new Uint8Array(al);
        for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
          const n1 = asciiToBase16(hex.charCodeAt(hi));
          const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
          if (n1 === void 0 || n2 === void 0) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
          }
          array[ai] = n1 * 16 + n2;
        }
        return array;
      }
      var nextTick = async () => {
      };
      exports.nextTick = nextTick;
      async function asyncLoop(iters, tick, cb) {
        let ts = Date.now();
        for (let i = 0; i < iters; i++) {
          cb(i);
          const diff = Date.now() - ts;
          if (diff >= 0 && diff < tick)
            continue;
          await (0, exports.nextTick)();
          ts += diff;
        }
      }
      function utf8ToBytes(str) {
        if (typeof str !== "string")
          throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(str));
      }
      function bytesToUtf8(bytes) {
        return new TextDecoder().decode(bytes);
      }
      function toBytes(data) {
        if (typeof data === "string")
          data = utf8ToBytes(data);
        abytes(data);
        return data;
      }
      function kdfInputToBytes(data) {
        if (typeof data === "string")
          data = utf8ToBytes(data);
        abytes(data);
        return data;
      }
      function concatBytes(...arrays) {
        let sum = 0;
        for (let i = 0; i < arrays.length; i++) {
          const a = arrays[i];
          abytes(a);
          sum += a.length;
        }
        const res = new Uint8Array(sum);
        for (let i = 0, pad = 0; i < arrays.length; i++) {
          const a = arrays[i];
          res.set(a, pad);
          pad += a.length;
        }
        return res;
      }
      function checkOpts(defaults, opts) {
        if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
          throw new Error("options should be object or undefined");
        const merged = Object.assign(defaults, opts);
        return merged;
      }
      var Hash = class {
      };
      exports.Hash = Hash;
      function createHasher(hashCons) {
        const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
        const tmp = hashCons();
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = () => hashCons();
        return hashC;
      }
      function createOptHasher(hashCons) {
        const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
        const tmp = hashCons({});
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (opts) => hashCons(opts);
        return hashC;
      }
      function createXOFer(hashCons) {
        const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
        const tmp = hashCons({});
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (opts) => hashCons(opts);
        return hashC;
      }
      exports.wrapConstructor = createHasher;
      exports.wrapConstructorWithOpts = createOptHasher;
      exports.wrapXOFConstructorWithOpts = createXOFer;
      function randomBytes(bytesLength = 32) {
        if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
          return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
        }
        if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
          return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
        }
        throw new Error("crypto.getRandomValues must be defined");
      }
    }
  });

  // node_modules/@noble/hashes/hmac.js
  var require_hmac = __commonJS({
    "node_modules/@noble/hashes/hmac.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hmac = exports.HMAC = void 0;
      var utils_ts_1 = require_utils2();
      var HMAC = class extends utils_ts_1.Hash {
        constructor(hash, _key) {
          super();
          this.finished = false;
          this.destroyed = false;
          (0, utils_ts_1.ahash)(hash);
          const key = (0, utils_ts_1.toBytes)(_key);
          this.iHash = hash.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("Expected instance of class which extends utils.Hash");
          this.blockLen = this.iHash.blockLen;
          this.outputLen = this.iHash.outputLen;
          const blockLen = this.blockLen;
          const pad = new Uint8Array(blockLen);
          pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54;
          this.iHash.update(pad);
          this.oHash = hash.create();
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54 ^ 92;
          this.oHash.update(pad);
          (0, utils_ts_1.clean)(pad);
        }
        update(buf) {
          (0, utils_ts_1.aexists)(this);
          this.iHash.update(buf);
          return this;
        }
        digestInto(out) {
          (0, utils_ts_1.aexists)(this);
          (0, utils_ts_1.abytes)(out, this.outputLen);
          this.finished = true;
          this.iHash.digestInto(out);
          this.oHash.update(out);
          this.oHash.digestInto(out);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to || (to = Object.create(Object.getPrototypeOf(this), {}));
          const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
          to.oHash = oHash._cloneInto(to.oHash);
          to.iHash = iHash._cloneInto(to.iHash);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
        destroy() {
          this.destroyed = true;
          this.oHash.destroy();
          this.iHash.destroy();
        }
      };
      exports.HMAC = HMAC;
      var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
      exports.hmac = hmac;
      exports.hmac.create = (hash, key) => new HMAC(hash, key);
    }
  });

  // node_modules/@noble/hashes/hkdf.js
  var require_hkdf = __commonJS({
    "node_modules/@noble/hashes/hkdf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hkdf = void 0;
      exports.extract = extract;
      exports.expand = expand;
      var hmac_ts_1 = require_hmac();
      var utils_ts_1 = require_utils2();
      function extract(hash, ikm, salt) {
        (0, utils_ts_1.ahash)(hash);
        if (salt === void 0)
          salt = new Uint8Array(hash.outputLen);
        return (0, hmac_ts_1.hmac)(hash, (0, utils_ts_1.toBytes)(salt), (0, utils_ts_1.toBytes)(ikm));
      }
      var HKDF_COUNTER = /* @__PURE__ */ Uint8Array.from([0]);
      var EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
      function expand(hash, prk, info, length = 32) {
        (0, utils_ts_1.ahash)(hash);
        (0, utils_ts_1.anumber)(length);
        const olen = hash.outputLen;
        if (length > 255 * olen)
          throw new Error("Length should be <= 255*HashLen");
        const blocks = Math.ceil(length / olen);
        if (info === void 0)
          info = EMPTY_BUFFER;
        const okm = new Uint8Array(blocks * olen);
        const HMAC = hmac_ts_1.hmac.create(hash, prk);
        const HMACTmp = HMAC._cloneInto();
        const T = new Uint8Array(HMAC.outputLen);
        for (let counter = 0; counter < blocks; counter++) {
          HKDF_COUNTER[0] = counter + 1;
          HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
          okm.set(T, olen * counter);
          HMAC._cloneInto(HMACTmp);
        }
        HMAC.destroy();
        HMACTmp.destroy();
        (0, utils_ts_1.clean)(T, HKDF_COUNTER);
        return okm.slice(0, length);
      }
      var hkdf = (hash, ikm, salt, info, length) => expand(hash, extract(hash, ikm, salt), info, length);
      exports.hkdf = hkdf;
    }
  });

  // node_modules/@noble/hashes/_md.js
  var require_md = __commonJS({
    "node_modules/@noble/hashes/_md.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SHA512_IV = exports.SHA384_IV = exports.SHA224_IV = exports.SHA256_IV = exports.HashMD = void 0;
      exports.setBigUint64 = setBigUint64;
      exports.Chi = Chi;
      exports.Maj = Maj;
      var utils_ts_1 = require_utils2();
      function setBigUint64(view, byteOffset, value, isLE) {
        if (typeof view.setBigUint64 === "function")
          return view.setBigUint64(byteOffset, value, isLE);
        const _32n = BigInt(32);
        const _u32_max = BigInt(4294967295);
        const wh = Number(value >> _32n & _u32_max);
        const wl = Number(value & _u32_max);
        const h = isLE ? 4 : 0;
        const l = isLE ? 0 : 4;
        view.setUint32(byteOffset + h, wh, isLE);
        view.setUint32(byteOffset + l, wl, isLE);
      }
      function Chi(a, b, c) {
        return a & b ^ ~a & c;
      }
      function Maj(a, b, c) {
        return a & b ^ a & c ^ b & c;
      }
      var HashMD = class extends utils_ts_1.Hash {
        constructor(blockLen, outputLen, padOffset, isLE) {
          super();
          this.finished = false;
          this.length = 0;
          this.pos = 0;
          this.destroyed = false;
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE;
          this.buffer = new Uint8Array(blockLen);
          this.view = (0, utils_ts_1.createView)(this.buffer);
        }
        update(data) {
          (0, utils_ts_1.aexists)(this);
          data = (0, utils_ts_1.toBytes)(data);
          (0, utils_ts_1.abytes)(data);
          const { view, buffer, blockLen } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = (0, utils_ts_1.createView)(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
        digestInto(out) {
          (0, utils_ts_1.aexists)(this);
          (0, utils_ts_1.aoutput)(out, this);
          this.finished = true;
          const { buffer, view, blockLen, isLE } = this;
          let { pos } = this;
          buffer[pos++] = 128;
          (0, utils_ts_1.clean)(this.buffer.subarray(pos));
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
          setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
          this.process(view, 0);
          const oview = (0, utils_ts_1.createView)(out);
          const len = this.outputLen;
          if (len % 4)
            throw new Error("_sha2: outputLen should be aligned to 32bit");
          const outLen = len / 4;
          const state = this.get();
          if (outLen > state.length)
            throw new Error("_sha2: outputLen bigger than state");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneInto(to) {
          to || (to = new this.constructor());
          to.set(...this.get());
          const { blockLen, buffer, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (length % blockLen)
            to.buffer.set(buffer);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
      };
      exports.HashMD = HashMD;
      exports.SHA256_IV = Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
      exports.SHA224_IV = Uint32Array.from([
        3238371032,
        914150663,
        812702999,
        4144912697,
        4290775857,
        1750603025,
        1694076839,
        3204075428
      ]);
      exports.SHA384_IV = Uint32Array.from([
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
      ]);
      exports.SHA512_IV = Uint32Array.from([
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
      ]);
    }
  });

  // node_modules/@noble/hashes/_u64.js
  var require_u64 = __commonJS({
    "node_modules/@noble/hashes/_u64.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
      exports.add = add;
      exports.fromBig = fromBig;
      exports.split = split;
      var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
      var _32n = /* @__PURE__ */ BigInt(32);
      function fromBig(n, le = false) {
        if (le)
          return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
        return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
      }
      function split(lst, le = false) {
        const len = lst.length;
        let Ah = new Uint32Array(len);
        let Al = new Uint32Array(len);
        for (let i = 0; i < len; i++) {
          const { h, l } = fromBig(lst[i], le);
          [Ah[i], Al[i]] = [h, l];
        }
        return [Ah, Al];
      }
      var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
      exports.toBig = toBig;
      var shrSH = (h, _l, s) => h >>> s;
      exports.shrSH = shrSH;
      var shrSL = (h, l, s) => h << 32 - s | l >>> s;
      exports.shrSL = shrSL;
      var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
      exports.rotrSH = rotrSH;
      var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
      exports.rotrSL = rotrSL;
      var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
      exports.rotrBH = rotrBH;
      var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
      exports.rotrBL = rotrBL;
      var rotr32H = (_h, l) => l;
      exports.rotr32H = rotr32H;
      var rotr32L = (h, _l) => h;
      exports.rotr32L = rotr32L;
      var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
      exports.rotlSH = rotlSH;
      var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
      exports.rotlSL = rotlSL;
      var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
      exports.rotlBH = rotlBH;
      var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
      exports.rotlBL = rotlBL;
      function add(Ah, Al, Bh, Bl) {
        const l = (Al >>> 0) + (Bl >>> 0);
        return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
      }
      var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
      exports.add3L = add3L;
      var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
      exports.add3H = add3H;
      var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
      exports.add4L = add4L;
      var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
      exports.add4H = add4H;
      var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
      exports.add5L = add5L;
      var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
      exports.add5H = add5H;
      var u64 = {
        fromBig,
        split,
        toBig,
        shrSH,
        shrSL,
        rotrSH,
        rotrSL,
        rotrBH,
        rotrBL,
        rotr32H,
        rotr32L,
        rotlSH,
        rotlSL,
        rotlBH,
        rotlBL,
        add,
        add3L,
        add3H,
        add4L,
        add4H,
        add5H,
        add5L
      };
      exports.default = u64;
    }
  });

  // node_modules/@noble/hashes/sha2.js
  var require_sha2 = __commonJS({
    "node_modules/@noble/hashes/sha2.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sha512_224 = exports.sha512_256 = exports.sha384 = exports.sha512 = exports.sha224 = exports.sha256 = exports.SHA512_256 = exports.SHA512_224 = exports.SHA384 = exports.SHA512 = exports.SHA224 = exports.SHA256 = void 0;
      var _md_ts_1 = require_md();
      var u64 = require_u64();
      var utils_ts_1 = require_utils2();
      var SHA256_K = /* @__PURE__ */ Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      var SHA256 = class extends _md_ts_1.HashMD {
        constructor(outputLen = 32) {
          super(64, outputLen, 8, false);
          this.A = _md_ts_1.SHA256_IV[0] | 0;
          this.B = _md_ts_1.SHA256_IV[1] | 0;
          this.C = _md_ts_1.SHA256_IV[2] | 0;
          this.D = _md_ts_1.SHA256_IV[3] | 0;
          this.E = _md_ts_1.SHA256_IV[4] | 0;
          this.F = _md_ts_1.SHA256_IV[5] | 0;
          this.G = _md_ts_1.SHA256_IV[6] | 0;
          this.H = _md_ts_1.SHA256_IV[7] | 0;
        }
        get() {
          const { A, B, C, D, E, F, G, H } = this;
          return [A, B, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
          for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = (0, utils_ts_1.rotr)(W15, 7) ^ (0, utils_ts_1.rotr)(W15, 18) ^ W15 >>> 3;
            const s1 = (0, utils_ts_1.rotr)(W2, 17) ^ (0, utils_ts_1.rotr)(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
          }
          let { A, B, C, D, E, F, G, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma1 = (0, utils_ts_1.rotr)(E, 6) ^ (0, utils_ts_1.rotr)(E, 11) ^ (0, utils_ts_1.rotr)(E, 25);
            const T1 = H + sigma1 + (0, _md_ts_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = (0, utils_ts_1.rotr)(A, 2) ^ (0, utils_ts_1.rotr)(A, 13) ^ (0, utils_ts_1.rotr)(A, 22);
            const T2 = sigma0 + (0, _md_ts_1.Maj)(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B = B + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B, C, D, E, F, G, H);
        }
        roundClean() {
          (0, utils_ts_1.clean)(SHA256_W);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          (0, utils_ts_1.clean)(this.buffer);
        }
      };
      exports.SHA256 = SHA256;
      var SHA224 = class extends SHA256 {
        constructor() {
          super(28);
          this.A = _md_ts_1.SHA224_IV[0] | 0;
          this.B = _md_ts_1.SHA224_IV[1] | 0;
          this.C = _md_ts_1.SHA224_IV[2] | 0;
          this.D = _md_ts_1.SHA224_IV[3] | 0;
          this.E = _md_ts_1.SHA224_IV[4] | 0;
          this.F = _md_ts_1.SHA224_IV[5] | 0;
          this.G = _md_ts_1.SHA224_IV[6] | 0;
          this.H = _md_ts_1.SHA224_IV[7] | 0;
        }
      };
      exports.SHA224 = SHA224;
      var K512 = /* @__PURE__ */ (() => u64.split([
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817"
      ].map((n) => BigInt(n))))();
      var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
      var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
      var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
      var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
      var SHA512 = class extends _md_ts_1.HashMD {
        constructor(outputLen = 64) {
          super(128, outputLen, 16, false);
          this.Ah = _md_ts_1.SHA512_IV[0] | 0;
          this.Al = _md_ts_1.SHA512_IV[1] | 0;
          this.Bh = _md_ts_1.SHA512_IV[2] | 0;
          this.Bl = _md_ts_1.SHA512_IV[3] | 0;
          this.Ch = _md_ts_1.SHA512_IV[4] | 0;
          this.Cl = _md_ts_1.SHA512_IV[5] | 0;
          this.Dh = _md_ts_1.SHA512_IV[6] | 0;
          this.Dl = _md_ts_1.SHA512_IV[7] | 0;
          this.Eh = _md_ts_1.SHA512_IV[8] | 0;
          this.El = _md_ts_1.SHA512_IV[9] | 0;
          this.Fh = _md_ts_1.SHA512_IV[10] | 0;
          this.Fl = _md_ts_1.SHA512_IV[11] | 0;
          this.Gh = _md_ts_1.SHA512_IV[12] | 0;
          this.Gl = _md_ts_1.SHA512_IV[13] | 0;
          this.Hh = _md_ts_1.SHA512_IV[14] | 0;
          this.Hl = _md_ts_1.SHA512_IV[15] | 0;
        }
        // prettier-ignore
        get() {
          const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
        }
        // prettier-ignore
        set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
          this.Ah = Ah | 0;
          this.Al = Al | 0;
          this.Bh = Bh | 0;
          this.Bl = Bl | 0;
          this.Ch = Ch | 0;
          this.Cl = Cl | 0;
          this.Dh = Dh | 0;
          this.Dl = Dl | 0;
          this.Eh = Eh | 0;
          this.El = El | 0;
          this.Fh = Fh | 0;
          this.Fl = Fl | 0;
          this.Gh = Gh | 0;
          this.Gl = Gl | 0;
          this.Hh = Hh | 0;
          this.Hl = Hl | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32(offset += 4);
          }
          for (let i = 16; i < 80; i++) {
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = u64.rotrSH(W15h, W15l, 1) ^ u64.rotrSH(W15h, W15l, 8) ^ u64.shrSH(W15h, W15l, 7);
            const s0l = u64.rotrSL(W15h, W15l, 1) ^ u64.rotrSL(W15h, W15l, 8) ^ u64.shrSL(W15h, W15l, 7);
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = u64.rotrSH(W2h, W2l, 19) ^ u64.rotrBH(W2h, W2l, 61) ^ u64.shrSH(W2h, W2l, 6);
            const s1l = u64.rotrSL(W2h, W2l, 19) ^ u64.rotrBL(W2h, W2l, 61) ^ u64.shrSL(W2h, W2l, 6);
            const SUMl = u64.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = u64.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
          }
          let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          for (let i = 0; i < 80; i++) {
            const sigma1h = u64.rotrSH(Eh, El, 14) ^ u64.rotrSH(Eh, El, 18) ^ u64.rotrBH(Eh, El, 41);
            const sigma1l = u64.rotrSL(Eh, El, 14) ^ u64.rotrSL(Eh, El, 18) ^ u64.rotrBL(Eh, El, 41);
            const CHIh = Eh & Fh ^ ~Eh & Gh;
            const CHIl = El & Fl ^ ~El & Gl;
            const T1ll = u64.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = u64.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            const sigma0h = u64.rotrSH(Ah, Al, 28) ^ u64.rotrBH(Ah, Al, 34) ^ u64.rotrBH(Ah, Al, 39);
            const sigma0l = u64.rotrSL(Ah, Al, 28) ^ u64.rotrBL(Ah, Al, 34) ^ u64.rotrBL(Ah, Al, 39);
            const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
            const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = u64.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = u64.add3L(T1l, sigma0l, MAJl);
            Ah = u64.add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
          }
          ({ h: Ah, l: Al } = u64.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
          ({ h: Bh, l: Bl } = u64.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
          ({ h: Ch, l: Cl } = u64.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
          ({ h: Dh, l: Dl } = u64.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
          ({ h: Eh, l: El } = u64.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
          ({ h: Fh, l: Fl } = u64.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
          ({ h: Gh, l: Gl } = u64.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
          ({ h: Hh, l: Hl } = u64.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
          this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
        }
        roundClean() {
          (0, utils_ts_1.clean)(SHA512_W_H, SHA512_W_L);
        }
        destroy() {
          (0, utils_ts_1.clean)(this.buffer);
          this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
      };
      exports.SHA512 = SHA512;
      var SHA384 = class extends SHA512 {
        constructor() {
          super(48);
          this.Ah = _md_ts_1.SHA384_IV[0] | 0;
          this.Al = _md_ts_1.SHA384_IV[1] | 0;
          this.Bh = _md_ts_1.SHA384_IV[2] | 0;
          this.Bl = _md_ts_1.SHA384_IV[3] | 0;
          this.Ch = _md_ts_1.SHA384_IV[4] | 0;
          this.Cl = _md_ts_1.SHA384_IV[5] | 0;
          this.Dh = _md_ts_1.SHA384_IV[6] | 0;
          this.Dl = _md_ts_1.SHA384_IV[7] | 0;
          this.Eh = _md_ts_1.SHA384_IV[8] | 0;
          this.El = _md_ts_1.SHA384_IV[9] | 0;
          this.Fh = _md_ts_1.SHA384_IV[10] | 0;
          this.Fl = _md_ts_1.SHA384_IV[11] | 0;
          this.Gh = _md_ts_1.SHA384_IV[12] | 0;
          this.Gl = _md_ts_1.SHA384_IV[13] | 0;
          this.Hh = _md_ts_1.SHA384_IV[14] | 0;
          this.Hl = _md_ts_1.SHA384_IV[15] | 0;
        }
      };
      exports.SHA384 = SHA384;
      var T224_IV = /* @__PURE__ */ Uint32Array.from([
        2352822216,
        424955298,
        1944164710,
        2312950998,
        502970286,
        855612546,
        1738396948,
        1479516111,
        258812777,
        2077511080,
        2011393907,
        79989058,
        1067287976,
        1780299464,
        286451373,
        2446758561
      ]);
      var T256_IV = /* @__PURE__ */ Uint32Array.from([
        573645204,
        4230739756,
        2673172387,
        3360449730,
        596883563,
        1867755857,
        2520282905,
        1497426621,
        2519219938,
        2827943907,
        3193839141,
        1401305490,
        721525244,
        746961066,
        246885852,
        2177182882
      ]);
      var SHA512_224 = class extends SHA512 {
        constructor() {
          super(28);
          this.Ah = T224_IV[0] | 0;
          this.Al = T224_IV[1] | 0;
          this.Bh = T224_IV[2] | 0;
          this.Bl = T224_IV[3] | 0;
          this.Ch = T224_IV[4] | 0;
          this.Cl = T224_IV[5] | 0;
          this.Dh = T224_IV[6] | 0;
          this.Dl = T224_IV[7] | 0;
          this.Eh = T224_IV[8] | 0;
          this.El = T224_IV[9] | 0;
          this.Fh = T224_IV[10] | 0;
          this.Fl = T224_IV[11] | 0;
          this.Gh = T224_IV[12] | 0;
          this.Gl = T224_IV[13] | 0;
          this.Hh = T224_IV[14] | 0;
          this.Hl = T224_IV[15] | 0;
        }
      };
      exports.SHA512_224 = SHA512_224;
      var SHA512_256 = class extends SHA512 {
        constructor() {
          super(32);
          this.Ah = T256_IV[0] | 0;
          this.Al = T256_IV[1] | 0;
          this.Bh = T256_IV[2] | 0;
          this.Bl = T256_IV[3] | 0;
          this.Ch = T256_IV[4] | 0;
          this.Cl = T256_IV[5] | 0;
          this.Dh = T256_IV[6] | 0;
          this.Dl = T256_IV[7] | 0;
          this.Eh = T256_IV[8] | 0;
          this.El = T256_IV[9] | 0;
          this.Fh = T256_IV[10] | 0;
          this.Fl = T256_IV[11] | 0;
          this.Gh = T256_IV[12] | 0;
          this.Gl = T256_IV[13] | 0;
          this.Hh = T256_IV[14] | 0;
          this.Hl = T256_IV[15] | 0;
        }
      };
      exports.SHA512_256 = SHA512_256;
      exports.sha256 = (0, utils_ts_1.createHasher)(() => new SHA256());
      exports.sha224 = (0, utils_ts_1.createHasher)(() => new SHA224());
      exports.sha512 = (0, utils_ts_1.createHasher)(() => new SHA512());
      exports.sha384 = (0, utils_ts_1.createHasher)(() => new SHA384());
      exports.sha512_256 = (0, utils_ts_1.createHasher)(() => new SHA512_256());
      exports.sha512_224 = (0, utils_ts_1.createHasher)(() => new SHA512_224());
    }
  });

  // node_modules/@noble/hashes/sha256.js
  var require_sha256 = __commonJS({
    "node_modules/@noble/hashes/sha256.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sha224 = exports.SHA224 = exports.sha256 = exports.SHA256 = void 0;
      var sha2_ts_1 = require_sha2();
      exports.SHA256 = sha2_ts_1.SHA256;
      exports.sha256 = sha2_ts_1.sha256;
      exports.SHA224 = sha2_ts_1.SHA224;
      exports.sha224 = sha2_ts_1.sha224;
    }
  });

  // browser-build/nip44-entry.js
  var require_nip44_entry = __commonJS({
    "browser-build/nip44-entry.js"(exports, module) {
      var { chacha20 } = require_chacha();
      var { extract, expand } = require_hkdf();
      var { hmac } = require_hmac();
      var { sha256 } = require_sha256();
      var { equalBytes } = require_utils();
      module.exports = { chacha20, hkdfExtract: extract, hkdfExpand: expand, hmac, sha256, equalBytes };
    }
  });
  return require_nip44_entry();
})();
/*! Bundled license information:

@noble/ciphers/utils.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
