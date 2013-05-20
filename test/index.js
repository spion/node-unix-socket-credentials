var test = require('tap').test;
var net  = require('net');
var cred = require('../');

test('basic test', function(t) {
    t.plan(4);    
    var s = net.createServer(function(cli) {
        cred.getCredentials(cli, function(err, res) {
            t.notOk(err, 'getting credentials from socket')
            console.log(res);
            t.equal(res.uid, process.getuid(), 'correct uid');
            t.equal(res.gid, process.getgid(), 'correct gid');
            t.equal(res.pid, process.pid, 'correct pid');
            c.end();
            s.close();
            t.end();
        });
        var res = cred.getCredentialsSync(cli);
        
    });
    var rnd = Math.random() + '-unix-socket-credentials-test.sock', path = '/tmp/' + rnd;
    s.listen(path);
    var c = net.connect({path: path});

});


test('basic test sync', function(t) {
    t.plan(3);
    var s = net.createServer(function(cli) {
        var res = cred.getCredentialsSync(cli);
        t.equal(res.uid, process.getuid(), 'correct uid');
        t.equal(res.gid, process.getgid(), 'correct gid');
        t.equal(res.pid, process.pid, 'correct pid');
        c.end();
        s.close();
        t.end();
    });
    var rnd = Math.random(), path = '/tmp/' + rnd;
    s.listen(path);
    var c = net.connect({path: path});
});
