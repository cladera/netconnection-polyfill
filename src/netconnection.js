import EventTarget from './event-target.js';
import * as Dom from './utils/dom.js';
import * as Guid from './utils/guid.js';
import * as Flash from './utils/flash.js';
import * as Obj from './utils/object.js';

class NetConnection extends EventTarget {
  constructor() {
    super();

    this._ready = false;

    this._id = `nc_${Guid.newGUID()}`;

    const flashVars = {
      debug: NetConnection.debug ? 'true' : 'false'
    };

    const params = {
      wmode: 'transparent'
    };

    const attributes = {
      id: this._id,
      name: this._id
    };

    this._el = Flash.embed(NetConnection.swf, flashVars, params, attributes);
    this._el.nc = this;

    this._client = null;

    document.body.appendChild(this._el);

    this.one('ready', () =>{
      this._ready = true;

      if (this._client) {
        this._el.nc_setClient(Obj.getObjectMethods(this._client));
      }
    });
  }

  get ready() {
    return this._ready;
  }

  get connected() {
    return this._el.nc_getProperty('connected');
  }

  get	connectedProxyType() {
    return this._el.nc_getProperty('connectedProxyType');
  }

  get	defaultObjectEncoding() {
    return this._el.nc_getProperty('defaultObjectEncoding');
  }

  get	farID() {
    return this._el.nc_getProperty('farID');
  }

  get	farNonce() {
    return this._el.nc_getProperty('farNonce');
  }

  get	maxPeerConnections() {
    return this._el.nc_getProperty('maxPeerConnections');
  }

  get	nearID() {
    return this._el.nc_getProperty('nearID');
  }

  get	nearNonce() {
    return this._el.nc_getProperty('nearNonce');
  }

  get	objectEncoding() {
    return this._el.nc_getProperty('objectEncoding');
  }

  get	protocol() {
    return this._el.nc_getProperty('protocol');
  }

  get	proxyType() {
    return this._el.nc_getProperty('proxyType');
  }

  get	unconnectedPeerStreams() {
    return this._el.nc_getProperty('unconnectedPeerStreams');
  }

  get	uri() {
    return this._el.nc_getProperty('uri');
  }

  get	usingTLS() {
    return this._el.nc_getProperty('usingTLS');
  }

  get client() {
    return this._client;
  }

  set client(client) {
    this._client = client;

    if (this._ready) {
      this._el.nc_setClient(Obj.getObjectMethods(client));
    }
  }

  set maxPeerConnections(value) {
    return this._el.nc_setProperty('maxPeerConnections', value);
  }

  set proxyType(value) {
    return this._el.nc_setProperty('proxyType', value);
  }

  set objectEncoding(value) {
    return this._el.nc_setProperty('objectEncoding', value);
  }

  addHeader(operation, mustUnderstand = false, param = null) {
    return this._el.nc_addHeader(operation, mustUnderstand, param);
  }

  call(command, ...args) {
    return this._el.nc_call(command, ...args);
  }

  close() {
    return this._el.nc_close();
  }

  connect(command, ...args) {
    return this._el.nc_connect(command, ...args);
  }


}

NetConnection.swf = './netconnection-polyfill.swf';
NetConnection.debug = false;

NetConnection.onAsyncErrorEvent = function(swfID, type, text) {
  const nc = Dom.getEl(swfID).nc;

  setTimeout(() => {
    nc.trigger({type, text});
  },1);
};

NetConnection.onIOErrorEvent = function (swfID, type, text) {
  const nc = Dom.getEl(swfID).nc;

  setTimeout(() => {
    nc.trigger({type, text});
  },1);
};

NetConnection.onSecurityErrorEvent = function(swfID, type, error) {
  const nc = Dom.getEl(swfID).nc;

  setTimeout(() => {
    nc.trigger({type, error});
  },1);
};

NetConnection.onNetStatusEvent = function(swfID, type, info) {
  const nc = Dom.getEl(swfID).nc;

  setTimeout(() => {
    nc.trigger({type, info});
  },1);
};

NetConnection.onReady = function(swfID) {
  const nc = Dom.getEl(swfID).nc;

  setTimeout(() => {
    nc.trigger('ready');
  },1);
};

NetConnection.onFlashLog = function(swfID, level, message) {
  switch (level.toLowerCase()) {
    case "error":
      console.error(`${swfID}:> (${level.toUpperCase()}) ${message}`);
      break;
    default:
      console.log(`${swfID}:> (${level.toUpperCase()}) ${message}`);
  }
};

NetConnection.onClientCall = function(swfID, method, ...args) {
  const nc = Dom.getEl(swfID).nc;

  setTimeout(() => {
    if (nc.client && Object.getPrototypeOf(nc.client).hasOwnProperty(method)) {
      nc.client[method](...args);
    }
  },1);
};

// TODO: Not sure if this is the best way to make NetConnection global
window['NetConnection'] = NetConnection;

export default NetConnection;
