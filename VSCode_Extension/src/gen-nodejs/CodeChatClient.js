//
// Autogenerated by Thrift Compiler (0.13.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
"use strict";

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;
var Int64 = require('node-int64');


var ttypes = require('./CodeChat_Services_types');
//HELPER FUNCTIONS AND STRUCTURES

var CodeChatClient_get_result_args = function(args) {
  this.id = null;
  if (args) {
    if (args.id !== undefined && args.id !== null) {
      this.id = args.id;
    }
  }
};
CodeChatClient_get_result_args.prototype = {};
CodeChatClient_get_result_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.id = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

CodeChatClient_get_result_args.prototype.write = function(output) {
  output.writeStructBegin('CodeChatClient_get_result_args');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.I32, 1);
    output.writeI32(this.id);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var CodeChatClient_get_result_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = new ttypes.GetResultReturn(args.success);
    }
  }
};
CodeChatClient_get_result_result.prototype = {};
CodeChatClient_get_result_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.GetResultReturn();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

CodeChatClient_get_result_result.prototype.write = function(output) {
  output.writeStructBegin('CodeChatClient_get_result_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var CodeChatClientClient = exports.Client = function(output, pClass) {
  this.output = output;
  this.pClass = pClass;
  this._seqid = 0;
  this._reqs = {};
};
CodeChatClientClient.prototype = {};
CodeChatClientClient.prototype.seqid = function() { return this._seqid; };
CodeChatClientClient.prototype.new_seqid = function() { return this._seqid += 1; };

CodeChatClientClient.prototype.get_result = function(id, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_get_result(id);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_get_result(id);
  }
};

CodeChatClientClient.prototype.send_get_result = function(id) {
  var output = new this.pClass(this.output);
  var params = {
    id: id
  };
  var args = new CodeChatClient_get_result_args(params);
  try {
    output.writeMessageBegin('get_result', Thrift.MessageType.CALL, this.seqid());
    args.write(output);
    output.writeMessageEnd();
    return this.output.flush();
  }
  catch (e) {
    delete this._reqs[this.seqid()];
    if (typeof output.reset === 'function') {
      output.reset();
    }
    throw e;
  }
};

CodeChatClientClient.prototype.recv_get_result = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new CodeChatClient_get_result_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('get_result failed: unknown result');
};
var CodeChatClientProcessor = exports.Processor = function(handler) {
  this._handler = handler;
};
CodeChatClientProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
};
CodeChatClientProcessor.prototype.process_get_result = function(seqid, input, output) {
  var args = new CodeChatClient_get_result_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.get_result.length === 1) {
    Q.fcall(this._handler.get_result.bind(this._handler),
      args.id
    ).then(function(result) {
      var result_obj = new CodeChatClient_get_result_result({success: result});
      output.writeMessageBegin("get_result", Thrift.MessageType.REPLY, seqid);
      result_obj.write(output);
      output.writeMessageEnd();
      output.flush();
    }).catch(function (err) {
      var result;
      result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
      output.writeMessageBegin("get_result", Thrift.MessageType.EXCEPTION, seqid);
      result.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  } else {
    this._handler.get_result(args.id, function (err, result) {
      var result_obj;
      if ((err === null || typeof err === 'undefined')) {
        result_obj = new CodeChatClient_get_result_result((err !== null || typeof err === 'undefined') ? err : {success: result});
        output.writeMessageBegin("get_result", Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("get_result", Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};