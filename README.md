# signalr-no-jquery

## ⚠️ ASP.NET SignalR is deprecated. Please upgrade to modern .NET Core and use ASP.NET Core SignalR ([@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr))

SignalR JS Client with shimmed jQuery not polluting global namespace

Forked from [tehcojam/signalr-no-jquery](https://github.com/tehcojam/signalr-no-jquery).

Modified to work with `"typescript": "^4.6.3"` and Webpack 5 in a Vue project. Fixes an error with `export` being undefined by removing
`"type": "module"` from the `package.json`

TypeScript typings was taken from [DefinitelyTyped repo](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/signalr).

jQuery shim borrowed from [react-native-signalR](https://github.com/olofd/react-native-signalr)

This version of signalR client doesn't add jQuery to `window` object but imports jQueryShim locally to signalR and exports `hubConnection`. jQueryShim file contains only bare-minimum of jQuery to make signalR client run.

This package is not meant to be used with ASP.NET Core version of SignalR.

### Usage

```js
npm i -D @jamiecurnow/signalr-no-jquery
```

#### ES6 Loader

```js
import { hubConnection } from '@jamiecurnow/signalr-no-jquery';
```

Use just like regular signalR but without $ namespace

```js
const connection = hubConnection('http://[address]:[port]', options);
const hubProxy = connection.createHubProxy('hubNameString');

// set up event listeners i.e. for incoming "message" event
hubProxy.on('message', function(message) {
    console.log(message);
});

// connect
connection.start({ jsonp: true })
	.done(function(){ console.log('Now connected, connection ID=' + connection.id); })
	.fail(function(){ console.log('Could not connect'); });
```

