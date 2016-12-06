
require('promise/lib/rejection-tracking').enable(
  {allRejections: true}
);

var should = require('should')

//Create a new instance
var RedisDot = require('./redis-dot')
var redis = new RedisDot('redis://h:p9ol5qrepnfpdg6r810gj51b0gd@ec2-107-20-255-37.compute-1.amazonaws.com:25539')

//use a static path
redis.a.thing.with.a.path.set('world')
redis.a.thing.with.a.path.get().then(function (value) {
	should(value).be.equal('world')
	redis.a.thing.with.a.path.del()
	completeAsync()
})

//or a dynamic path
redis.a.thing.with.a['dynamic'].path.set('world')
redis.a.thing.with.a['dynamic'].path.get().then(function (value) {
	should(value).be.equal('world')
	redis.a.thing.with.a['dynamic'].path.del()
	completeAsync()
})

//hang on to a path for later
var redisProxy = redis.will.always.return.something
//It will never be null
should.exist(redisProxy)

//Use it just like ioredis
var testValue = 'a value'
redisProxy.set(testValue)
redisProxy.get().then(function (value) {
	should(value).be.equal(testValue)
	completeAsync()
})

//Pass it an object straight up, it'll encode it for you.
redisProxy.set({aProperty:'of an object'})
redisProxy.get().then(function (value) {
	should(value).be.equal('{"aProperty":"of an object"}')
	completeAsync()
})

//Delete stuff (but not too much stuff)
redisProxy.del()
redisProxy.get().then(function (value) {
	should.not.exist(value)
	completeAsync()
})

var numAsync = 5
var completedAsync = 0
function completeAsync() {
	completedAsync ++
	if (completedAsync == numAsync) {
		redis.disconnect()
		console.log("tests complete")
		process.exit()
	}
}