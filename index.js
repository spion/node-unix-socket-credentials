
var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');


var Credentials = Struct({
    pid: 'int',
    uid: 'int',
    gid: 'int'
});


var voidPtrT = ref.refType('void');
var socklenPtrT = ref.refType('int');

var socklib = ffi.Library(null, {
    'getsockopt': ['int', ['int', 'int', 'int', voidPtrT, socklenPtrT]],
    'setsockopt': ['int', ['int', 'int', 'int', voidPtrT, 'int']],
});

var SOL_SOCKET = 1;
var SO_PEERCRED = 17;
var SO_PASSCRED = 16;

exports.getCredentials = function(socket, done) {
    var c = new Credentials(),
        clen = ref.alloc('int', 4 * 3), // 3 ints received
        fd = socket._handle.fd;
    socklib.getsockopt.async(fd, SOL_SOCKET, SO_PEERCRED, c.ref(), clen, onOptionsReceived);

    function onOptionsReceived(err, res) {
        if (err) 
            return done(err);
        if (res == -1) 
            return done(new Error('Unable to call getsockopt'));
        else 
            return done(null, {pid: c.pid, uid:c.uid, gid:c.gid});
    }
}


exports.getCredentialsSync = function(socket) {
    var c = new Credentials(),
        clen = ref.alloc('int', 4 * 3), // 3 ints received
        fd = socket._handle.fd;
    var res = socklib.getsockopt(fd, SOL_SOCKET, SO_PEERCRED, c.ref(), clen);
    if (res == -1) throw new Error('getsockopt error');
    return {pid: c.pid, uid:c.uid, gid:c.gid};

}

// This is not currently in use.
/*
exports.passCredentials = function(socket, done) {
    var fd = socket._handle.fd,
        opt = ref.alloc('int', 1);
        optSz = 4;
    socklib.setsockopt.async(fd, SOL_SOCKET, SO_PASSCRED, opt, optSz, onOptionsSet)
    function onOptionsSet(err, res) {
        if (err) 
            return done(err);
        if (res == -1) 
            return done(new Error('Unable to setsockopt'));
        return done(null);
    }
}
*/
