
var PathProxy = require('path-proxy')
var Promise = require('promise')

var Redis = require('ioredis')

module.exports = function RedisDot() {

	var redis = new Redis(arguments[0], arguments[1], arguments[2])

	//not sure when this is called
	redis.on("error", function (err) {
	    console.log("Error " + err)
	})

	redis.getValue = function (obj, key) {

		//check to see if the key is a supported Redis funtion
		if (isSupportedFunction(key)) {

			//is the funtion the set() funtion?
			if (key == 'set') {

				//If it is, return a funtion that returns the return value of the set funtion
				return function () {
					args = [].slice.call(arguments) //copt the args list
					//If the second argument is not a string
					if (typeof args[1] !== typeof 'string') {
						args[1] = JSON.stringify(args[1]) //then stringify it
					}

					redis.set.apply(redis, args) //call set() with redis as the 'this' argument
				}
			}
			//if we don't need to do any cleanup of the args then call redis directly
			return redis[key]
		}

		//otherwise just perform a basic get()
		return obj[key]
	}

	var dbRoot = new PathProxy(redis)
	return dbRoot
}

var supportedFunctions = ['get', 'set', 'del'] //this will need to be expanded and further tested
function isSupportedFunction(name) {
	for (var i = 0; i < supportedFunctions.length; i++) {
		var otherName = supportedFunctions[i]
		if (otherName === name) {
			return true
		}
	}

	return false
}