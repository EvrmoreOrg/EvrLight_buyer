#!/usr/bin/env node
"use strict";

// Standalone CLI for buyer.html's obfuscated "?set=" settings-blob format --
// lets you encode/decode these strings without opening a browser or poking
// through devtools. The encode/decode pipeline below (everything down to
// encodeSettingsBlob/decodeSettingsBlob) is copied verbatim from
// buyer/buyer.html's own copy -- keep the two in sync if that algorithm
// ever changes; see buyer.html's own comment block (search
// SETTINGS_OBFUSCATION_KEY) for the full rationale of each step. As that
// comment stresses, this is deliberately NOT cryptography -- the key below
// is public, shipped in this very file -- it only raises the bar above "a
// casual glance," nothing more.

// ---------------------------------------------------------------------
// Pipeline (copied verbatim from buyer.html)
// ---------------------------------------------------------------------

var SETTINGS_OBFUSCATION_KEY = new Uint8Array([
  0x7a, 0x1c, 0x9e, 0x44, 0xb3, 0x5f, 0x22, 0xd8,
  0x91, 0x0e, 0x67, 0xc5, 0x3b, 0xa9, 0xf1, 0x28,
]);
var SETTINGS_BLOB_VERSION = 1;

function lzwCompress(input) {
  var dictionary = {};
  for (var i = 0; i < 256; i++) dictionary[String.fromCharCode(i)] = i;
  var nextCode = 256;
  var current = "";
  var output = [];
  for (var j = 0; j < input.length; j++) {
    var combined = current + input[j];
    if (Object.prototype.hasOwnProperty.call(dictionary, combined)) {
      current = combined;
    } else {
      output.push(dictionary[current]);
      if (nextCode < 65536) dictionary[combined] = nextCode++;
      current = input[j];
    }
  }
  if (current !== "") output.push(dictionary[current]);
  return output;
}
function lzwDecompress(codes) {
  if (codes.length === 0) return "";
  var dictionary = {};
  for (var i = 0; i < 256; i++) dictionary[i] = String.fromCharCode(i);
  var nextCode = 256;
  var current = dictionary[codes[0]];
  if (current === undefined) throw new Error("lzw: invalid first code " + codes[0]);
  var output = current;
  for (var j = 1; j < codes.length; j++) {
    var code = codes[j];
    var entry;
    if (Object.prototype.hasOwnProperty.call(dictionary, code)) {
      entry = dictionary[code];
    } else if (code === nextCode) {
      entry = current + current.charAt(0);
    } else {
      throw new Error("lzw: invalid code " + code);
    }
    output += entry;
    if (nextCode < 65536) dictionary[nextCode++] = current + entry.charAt(0);
    current = entry;
  }
  return output;
}

function codesToBytes(codes) {
  var bytes = new Uint8Array(codes.length * 2);
  for (var i = 0; i < codes.length; i++) {
    bytes[i * 2] = (codes[i] >> 8) & 0xff;
    bytes[i * 2 + 1] = codes[i] & 0xff;
  }
  return bytes;
}
function bytesToCodes(bytes) {
  var codes = [];
  for (var i = 0; i < bytes.length; i += 2) {
    codes.push((bytes[i] << 8) | bytes[i + 1]);
  }
  return codes;
}

function xorBytes(bytes, key) {
  var out = new Uint8Array(bytes.length);
  for (var i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ key[i % key.length];
  }
  return out;
}

function bytesToBase64Url(bytes) {
  var chunkSize = 8192;
  var binary = "";
  for (var i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlToBytes(b64url) {
  var b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  var binary = atob(b64);
  var out = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function stringToRawBytes(str) {
  var bytes = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i) & 0xff;
  return bytes;
}
function rawBytesToString(bytes) {
  var chars = [];
  for (var i = 0; i < bytes.length; i++) chars.push(String.fromCharCode(bytes[i]));
  return chars.join("");
}

function encodeSettingsBlob(relay, network, coin, seller_keys, buyerPrivkeySentinel) {
  var json = JSON.stringify([relay, network, coin, seller_keys, buyerPrivkeySentinel || ""]);
  var compressedBytes = codesToBytes(lzwCompress(json));
  var rawBytes = stringToRawBytes(json);
  var useCompression = compressedBytes.length < rawBytes.length;
  var payload = useCompression ? compressedBytes : rawBytes;
  var header = (SETTINGS_BLOB_VERSION << 1) | (useCompression ? 1 : 0);
  var withHeader = new Uint8Array(1 + payload.length);
  withHeader[0] = header;
  withHeader.set(payload, 1);
  return bytesToBase64Url(xorBytes(withHeader, SETTINGS_OBFUSCATION_KEY));
}

function decodeSettingsBlob(setParam) {
  try {
    var withHeader = xorBytes(base64UrlToBytes(setParam), SETTINGS_OBFUSCATION_KEY);
    if (withHeader.length < 1) throw new Error("empty settings blob");
    var version = withHeader[0] >> 1;
    var isCompressed = (withHeader[0] & 1) === 1;
    if (version !== SETTINGS_BLOB_VERSION) {
      throw new Error("unrecognized settings blob version " + version);
    }
    var payload = withHeader.subarray(1);
    var json;
    if (isCompressed) {
      if (payload.length % 2 !== 0) throw new Error("corrupt compressed payload (odd code-byte length)");
      json = lzwDecompress(bytesToCodes(payload));
    } else {
      json = rawBytesToString(payload);
    }
    var parsed = JSON.parse(json);
    if (!Array.isArray(parsed) || parsed.length !== 5 || !parsed.every(function (v) { return typeof v === "string"; })) {
      throw new Error("decoded settings blob has an unexpected shape");
    }
    return { relay: parsed[0], network: parsed[1], coin: parsed[2], seller_keys: parsed[3], buyer_privkey: parsed[4] };
  } catch (e) {
    throw new Error("failed to decode \"set=\" param: " + e.message);
  }
}

// Same rule buyer.html's own isUrlSafeBuyerPrivkeySentinel() enforces at
// the point a decoded blob is consumed -- not enforced by encode/decode
// above (matching buyer.html's own division of responsibility), only used
// here to warn against accidentally encoding a real secret into a blob
// that anyone holding the link can trivially reverse (see the file-level
// comment: this is obfuscation, not encryption).
function isUrlSafeBuyerPrivkeySentinel(value) {
  return value === "random" || value === "NIP-07_Extension";
}

// ---------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------

function printUsageAndExit(exitCode) {
  var usage = [
    "Usage:",
    "  node settings-blob-tool.js encode <relay> <network> <coin> <seller_keys> [buyer_privkey_sentinel] [--base <url>]",
    "  node settings-blob-tool.js decode <blob-or-url>",
    "",
    "encode:",
    "  relay, network, coin, seller_keys  -- pass \"\" for an empty field, same as buyer.html's config",
    "  buyer_privkey_sentinel             -- optional; only \"random\" or \"NIP-07_Extension\" are ever",
    "                                         honored by buyer.html when the blob is decoded -- anything",
    "                                         else (e.g. a real nsec/hex key) still encodes, but prints",
    "                                         a warning, since it would never survive being consumed",
    "  --base <url>                       -- if given, prints a full \"<url>?set=<blob>\" link instead of",
    "                                         just the raw blob",
    "",
    "decode:",
    "  blob-or-url  -- either a raw \"set=\" blob, or a full URL containing a ?set= param",
    "",
    "Examples:",
    "  node settings-blob-tool.js encode wss://relay.example.com mainnet btc \"\" random",
    "  node settings-blob-tool.js encode wss://relay.example.com mainnet \"\" pubkey1,pubkey2 --base https://example.com/buyer.html",
    "  node settings-blob-tool.js decode eyJhbGci...",
    "  node settings-blob-tool.js decode \"https://example.com/buyer.html?set=eyJhbGci...\"",
  ].join("\n");
  console.error(usage);
  process.exit(exitCode);
}

function runEncode(args) {
  var baseIndex = args.indexOf("--base");
  var base = null;
  if (baseIndex !== -1) {
    base = args[baseIndex + 1];
    if (!base) printUsageAndExit(1);
    args = args.slice(0, baseIndex).concat(args.slice(baseIndex + 2));
  }
  if (args.length < 4 || args.length > 5) printUsageAndExit(1);
  var relay = args[0], network = args[1], coin = args[2], seller_keys = args[3];
  var buyerPrivkeySentinel = args[4] || "";
  if (buyerPrivkeySentinel && !isUrlSafeBuyerPrivkeySentinel(buyerPrivkeySentinel)) {
    console.error(
      "warning: \"" + buyerPrivkeySentinel + "\" is not \"random\" or \"NIP-07_Extension\" -- " +
      "buyer.html only ever honors those two sentinels from a \"set=\" blob, so this value would " +
      "be silently dropped when the link is opened. Encoding it anyway."
    );
  }
  var blob = encodeSettingsBlob(relay, network, coin, seller_keys, buyerPrivkeySentinel);
  console.log(base ? base + "?set=" + blob : blob);
}

function runDecode(args) {
  if (args.length !== 1) printUsageAndExit(1);
  var input = args[0];
  var blob = input;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input) || input.indexOf("set=") !== -1) {
    var match = input.match(/[?&]set=([^&#]+)/);
    if (!match) {
      console.error("no \"set=\" parameter found in: " + input);
      process.exit(1);
    }
    blob = decodeURIComponent(match[1]);
  }
  var decoded = decodeSettingsBlob(blob);
  console.log(JSON.stringify(decoded, null, 2));
}

function main() {
  var args = process.argv.slice(2);
  var command = args[0];
  if (command === "encode") return runEncode(args.slice(1));
  if (command === "decode") return runDecode(args.slice(1));
  printUsageAndExit(command ? 1 : 0);
}

try {
  main();
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
