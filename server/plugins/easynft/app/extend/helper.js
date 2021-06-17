/**
 * @fileOverview helper
 * @name helper.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const createError = require('http-errors');
// const multihashes = require('multihashes');
// const CID = require('cids');
const { create: createClient } = require('ipfs-http-client');

// const crypto = require('crypto');
// const { Readable } = require('stream');

async function generateCID(data) {

  const { url, ...opts } = this.config.easynft.ipfs;
  const client = createClient(url);
  const res = await client.add(data, opts);
  return res.path;

  // / TODO: generate cid in local
  // const opts = this.config.easynft.multihashes;
  // const hash = crypto.createHash(opts.algorithm);
  // if (Buffer.isBuffer(data)) {
  //   hash.update(data);
  // } else if (data instanceof Readable) {
  //   for await (const chunk of data) {
  //     hash.update(chunk);
  //   }
  // } else {
  //   throw new Error('UNSUPPORT_DATA');
  // }
  // const buffer = hash.digest();

  // const content = multihashes.encode(buffer, opts.hashName);
  // const cid = new CID(opts.version, opts.codec, content, opts.multibaseName);
  // return cid.toString();

}

function generateMatrixStorageAPIHeaders(headers = {}) {
  const { ctx, config } = this;

  const default_headers = config.easynft.maxtrix_storage.headers || {};
  const proxy_header_keys = config.easynft.maxtrix_storage.proxyHeaders || [];
  const proxy_headers = {};

  for (const key of proxy_header_keys) {
    if (ctx.headers[key] !== undefined) {
      proxy_headers[key] = ctx.headers[key];
    }
  }

  return {
    ...default_headers,
    ...proxy_headers,
    ...headers,
  };
}

function throwMatrixStorageAPIError(resp) {
  if (resp.code === 0) {
    return;
  }

  let error;
  if (resp.code >= 400 && resp.code < 600) {
    error = createError(resp.code, resp.msg);
  } else {
    error = createError(409,  resp.msg);
  }
  error.type = error.biz_code = resp.code;
  throw error;
}

function throwHttpError(res) {
  if (res.status >= 400 && res.status < 600) {
    let error = createError(res.status, res.data);
    error.type = res.status;
    throw error;
  }
}

exports.generateCID = generateCID;
exports.generateMatrixStorageAPIHeaders = generateMatrixStorageAPIHeaders;
exports.throwMatrixStorageAPIError = throwMatrixStorageAPIError;
exports.throwHttpError = throwHttpError;
