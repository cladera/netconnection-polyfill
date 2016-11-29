# NetConnection Polyfill

NetConnection-polyfill brings Flash's [NetConnection](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/NetConnection.html)
to modern JavaScript applications running on a browser which supports 
[Flash plugin](https://get.adobe.com/flashplayer/).

With NetConnection you can establish a real-time two-way communication between 
your browser application made in JS and an [AMS](http://www.adobe.com/products/adobe-media-server-family.html) 
or [Wowza](https://www.wowza.com/) server over RTMP protocol.

## Table of contents

- [How it works](#how-it-works)
- [Getting started](#getting-started)
- [API Reference](#api-reference)
- [Note about the death of Flash](#note-about-the-death-of-flash)


## How it works

NetConnection-polyfill implements NetConnection interface in JavaScript. Although,
it still needs flash to work.

When a new instance of a NetConnection is created in your JS application,
NetConnection-polyfill will create a "transparent" flash object where the 
**actual** instance of NetConnection will be created. 

The JS interface transparently access to the variables and methods of the NetConnection
instance inside the flash object so you can implement your own logic without worrying
about flash at all.

## Getting started

### Install via npm

```
npm install netconnection-polyfill --save

```

### Use as a global class

NetConnection-polyfill is a framework-agnostic library. Once installed and 
included in your web application it can be accessed as a global class.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My NetConnection app</title>
</head>
<body>

<script src="node_modules/netconnection-polyfill.js"></script>

<script>
  (function(){

    // Tell NetConnection where to find the SWF binary
    NetConnection.swf = './node_modules/netconnection-polyfill.swf';

    let nc = new NetConnection();

    // Listen to netStatus events
    nc.addEventListener('netStatus', (event) => {
      switch (event.info.code) {
        case 'NetConnection.Connect.Success':
          console.log('My app is now connected to the RTMP server');
          break;
        case 'NetConnection.Connect.Rejected':
          console.error('My app was rejected by the RTMP server');
          break;
      }
    });

    
    // Wait until the interface is ready
    nc.one('ready', () => {
      console.log('NetConnection is ready');
      // You can pass arguments to connect call
      nc.connect('rtmp://my.server.com/live/instance', 'user', 'password');
    });

  })();
</script>
</body>
</html>

```

### Call server-side methods

Once the connection is established, you can call server-side methods to send 
commands to the server.

```javascript
let nc = new NetConnection();

nc.addEventListener('netStatus', (event) => {
  switch (event.info.code) {
    case 'NetConnection.Connect.Success':
      // Call a method in your server-side application
      nc.call('sendMessage', 'Message to RTMP application');
      break;
    case 'NetConnection.Connect.Rejected':
      console.error('Connection was rejected');
      break;
  }
});

nc.one('ready', () => {
  nc.connect('rtmp://my.server.com/live/instance');
});

```

### Implement your client

The magic of NetConnection is to either the web application 
being able to call server-side methods and the server-side application call 
methods in client-side.

```javascript
class MyClient {
  
  // This method can be called by the server to send messages to your application
  onMessage(message) {
    console.log(`RTMP Server says ${message}`);
  }
}

let nc = new NetConnection();
nc.client = new MyClient();

nc.one('ready', () => {
  nc.connect('rtmp://my.server.com/live/instance');
});

```

## API Reference

NetConneciton-polyfill implements the properties and methods of Flash's 
[NetConnection](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/NetConnection.html)
class that might make sense to expose to a JavaScript application. 

Following documentation shows a short description of NetConnection's properties and
methods. For more details about its usage visit [Adobe's documentation](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/NetConnection.html)

### Properties

**client**: Object

Indicates the object on which callback methods are invoked. The default is this 
NetConnection instance. If you set the client property to another object, 
callback methods will be invoked on that object.

**connected**: Boolean *[read-only]* 

Indicates whether the application is connected to a server through a persistent 
RTMP connection (true) or not (false).

**connectedProxyType**: String *[read-only]*

he proxy type used to make a successful connection to Flash Media Server.


**farID**: String *[read-only]*

A value chosen substantially by Flash Media Server, unique to this connection.

**farNonce**: String *[read-only]*

A value chosen substantially by Flash Media Server, unique to this connection.

**maxPeerConnections**: Number

The total number of inbound and outbound peer connections that this instance of 
Flash Player allows.

**nearID**: String *[read-only]*

A value chosen substantially by this Flash Player, unique to this connection.

**nearNonce**: String *[read-only]*

A value chosen substantially by this Flash Player or Adobe AIR instance, unique 
to this connection.

**objectEncoding**: Number

The object encoding for this NetConnection instance.

**protocol**: String *[read-only]*

The protocol used to establish the connection.

**proxyType**: String

Determines which fallback methods are tried if an initial connection attempt to 
Flash Media Server fails.

**unconnectedPeerStreams**: Array *[read-only]*

An object that holds all of the peer subscriber NetStream objects that are not 
associated with publishing NetStream objects.

**uri**: String *[read-only]*

The URI passed to the NetConnection.connect() method.

**usingTLS**: Boolean *[read-only]*

Indicates whether a secure connection was made using native Transport Layer 
Security (TLS) rather than HTTPS.

### Methods

**addHeader**(operation: String, mustUnderstand: Boolean, param: Object): void

Adds a context header to the Action Message Format (AMF) packet structure.

**call**(command: String, ...arguments): void

Calls a command or method on Flash Media Server or on an application server 
running Flash Remoting.

**close**():void

Closes the connection that was opened locally or to the server and dispatches a 
netStatus event with a code property of NetConnection.Connect.Closed.

**connect**(command: String, ...arguments): void

Creates a two-way connection to an application on Flash Media Server or to Flash
Remoting, or creates a two-way network endpoint for RTMFP peer-to-peer group 
communication.

### Events

NetConnection extends EventTarget with additionally aliases:

**on**(type: String, handler: Function):void

Alias for *addEventListener*

**one**(type: String, handler: Function): void

Subscribes to given event just once.

**off**(type: String, handler: Function):void

Alias for *removeEventListener**

**trigger**(event: String|Event): void

Alias for *dispatchEvent*

#### Types

**ready**

Dispatched when NetConnection interface is ready to be used. Only when this event
is fired the properties and methods can be accessed. 

**asyncError** 

Dispatched when an exception is thrown asynchronously — that is, from native 
asynchronous code.

**ioError**

Dispatched when an input or output error occurs that causes a network operation 
to fail.

**netStatus**

Dispatched when a NetConnection object is reporting its status or error condition.
See: [NetStatusEvent.info](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/NetStatusEvent.html#info)
for more details about the possible netStatus codes.

**securityError**

Dispatched if a call to NetConnection.call() attempts to connect to a server 
outside the caller's security sandbox.


## Note about the death of Flash

Flash is about to die indeed. However, RTMP protocol is still the most used
protocol to feed live streaming.

If you want to create an application to control and/or monitor an AMS or 
Wowza application you have to do it over RTMP protocol which nowadays is 
not possible with only JavaScript. 

NetConnection-polyfill is intended to fill this little gap. It is the lightest and
simplest flash-dependant library possible to manage a real-time connection with
a Media Server over RTMP with JavaScript.

## TODO

- Improve static options
- Tests
- Changelog
- Contributing guidelines

