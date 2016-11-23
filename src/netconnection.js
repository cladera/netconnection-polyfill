import EventTarget from './event-target.js';
import * as Dom from './utils/dom.js';
import * as Guid from './utils/guid.js';
import * as Flash from './utils/flash.js';

class NetConnection extends EventTarget{
  constructor() {
    super();

    this._id = `nc_${Guid.newGUID()}`;

    const flashVars = {
      // SWF Events Callback Function
      eventProxyFunction: 'NetConnection.onFlashEvent',
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

    document.body.appendChild(this._el);
  }
}

NetConnection.swf = './netconnection-polyfill.swf';

NetConnection.onFlashEvent = function(swfID, eventName) {
  const nc = Dom.getEl(swfID).nc;
  const args = Array.prototype.slice.call(arguments, 2);

  // TODO: Arguments not actually being attached to the event

  setTimeout(() => {
    nc.trigger(eventName, args);
  }, 1);
};

// TODO: Not sure if this is the best way to make NetConnection global
window['NetConnection'] = NetConnection;

export default NetConnection;
