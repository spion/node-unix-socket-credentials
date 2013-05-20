# node-unix-socket-credentials

Get the uid, gid and pid of a client that connects to your node.js unix socket server

Writing multi-user system services in node has suddenly become much easier!

# install

From npm

    npm install unix-socket-credentials

# usage

Sync and async methods are provided:

Full async example:

```js
var uscred = require('unix-socket-credentials');
var net = require('net');

net.createServer(function(cli) {
    uscred.getCredentials(cli, function(err, res) {
        // You can now use the uid/gid/pid of the client process
        console.log(res.uid, res.gid, res.pid);
    });
}).listen('/tmp/test.sock');
```


Shortened sync example:

```js
var res = uscred.getCredentialsSync(cli);
console.log(res.uid, res.gid, res.pid);
```

# licence

MIT
