const admin = require("./mongo_login.js");
const MongoClient = require('mongodb').MongoClient

const collectionName = "weather_search_userDB";
const url = "mongodb://"+ admin.username+":"+admin.password +
		  "@ds119446.mlab.com:19446/weather_search_user";

var userDB = (function() {
	//user to hash password
	function hash(str) {
        var hash = 5381;
        var i = str.length;
        while(i) {
            hash = (hash * 33) ^ str.charCodeAt(--i);
        }
        return hash >>> 0;
    }

    //compare if input password matches setPassword 
    function hashCompare(password, setPassword){
        password = hash(password);
        return (password===setPassword);
    }

    function getTodayDate() {
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = today.getMonth() + 1;
        var dd = today.getDate();

        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        return yyyy + '.' + mm + '.' + dd;
    }

    //return a promise that contains user's info
    function getUser(db, username){
    	return db.collection(collectionName)
    		.find({username:username},{_id:false})
			.toArray();
    }

    //return a promise that is a boolean value
    //indicates if a username in current DB
    function checkUsernameNotExist(userList){
    	return userList.then(data => {
    		var size = data.length;
    		return (size==0);
    	});
    }

    //do not return user's password
    function encapUserInfo(user){
    	var encapData = user;
    	delete encapData.password;
        return encapData;
    }

	return {
		createUser: function(user){
			/*
			* Create a new user on DB
			*
			* Input: a user object with at least a unique
			* 		 user name, and a password
			* Output: a promise with true on success,
			* 		  otherwise false
			*/
			var newUser = {
				username: user.username,
				password: hash(user.password),
				email: user.email,
				gender: user.gender,
				savedCities: [],
				lastVisteDate: getTodayDate(),
                createDate: getTodayDate(),
                visitCount: 0
			};

			return new Promise(function (resolve, reject){
				MongoClient.connect(url, function(err,res){
					var db = res;

					var userList = getUser(db, newUser.username);
					var usernameNotExist = checkUsernameNotExist(userList);
					
					usernameNotExist.then(data=>{
						if(!data){
							db.close();
							resolve(false);
						}else{
							db.collection(collectionName)
			    			.insertOne(newUser, function(err, res){
			    				if(err) resolve(false);
			    			})
			    			db.close();
							resolve(true);
						}
					})
				});
			})
		},logIn: function(username, password){
			/*
			* Allow user to get their info storing on DB
			*
			* Input: username with a matched password
			* Output: a promise with encap user data on success,
			* 		  otherwise false
			*/
			return new Promise(function (resolve, reject){
				MongoClient.connect(url, function(err,res){
					var db = res;

					var userList = getUser(db, username);
					var usernameNotExist = checkUsernameNotExist(userList);
					
					usernameNotExist.then(data=>{
						if(data){
							db.close();
							resolve(false);
						}else{
							db.close();
							userList.then(user=>{
								var isPassword = hashCompare(password, user[0].password);
								if(isPassword){
									user[0].visitCount+=1;
									var encapData = encapUserInfo(user[0])
									userDB.updateUserInfo(username, encapData)
									.then(data => {
										if(data){
											resolve(encapData);
										}else{
											resolve(false);
										}
									})
								}else{
									resolve(false);
								}
							})
						}
					})
				})
			})
		},updateUserInfo: function(username, newInfo){
			/*
			* Allow user update their info storing on DB
			*
			* Input: username with a object that contains
			*		 fields need to update
			* Output: a promise with true on success,
			* 		  otherwise false
			*/
			var updateUser = {username:username};

			return new Promise(function (resolve, reject){
				MongoClient.connect(url, function(err,res){
					var db = res;

					var userList = getUser(db, username);
					var usernameNotExist = checkUsernameNotExist(userList);

					usernameNotExist.then(data=>{
						if(data){
							db.close();
							resolve(false);
						}else{
							userList.then(user => {
								var user = user[0];
								for(var field in newInfo){
									switch(field){
										case("password"): user.password = hash(newInfo.password);
															break;
										case("email"): user.email = newInfo.email;
															break;
										case("savedCities"): user.savedCities = newInfo.savedCities;
															break;
										case("gender"): user.gender = newInfo.gender;
															break;
										case("visitCount"): user.visitCount =  newInfo.visitCount;
															break;
										default: break;
									}
								}
								
								db.collection(collectionName)
								.updateOne(updateUser, user, function(err, res) {
								    if (err) {
								    	db.close();
								    	resolve(false);
								    }
								});
								db.close();
								resolve(true);
							})
						}
					})
				})
			})
		},deleteUser: function(username){
			/*
			* Allow user to delete their info storing on DB
			*
			* Input: username
			* Output: a promise with true on success,
			* 		  otherwise false
			*/
			var deleteUser = {username: username};

			return new Promise(function (resolve, reject){
				MongoClient.connect(url, function(err,res){
					var db = res;

					var userList = getUser(db, username);
					var usernameNotExist = checkUsernameNotExist(userList);

					usernameNotExist.then(data=>{
						if(data){
							db.close();
							resolve(false);
						}else{
							db.collection(collectionName)
							.deleteOne(deleteUser, function(err, obj) {
							    if(err) {
								    db.close();
								    resolve(false);
								}
								db.close();
								resolve(true);
	  						});
						}
					})
				})
			})
		},
	}
})();

module.exports = userDB;


















