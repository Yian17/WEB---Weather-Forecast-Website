const assert = require('assert');
const userDB = require('../public/data/userDB_mongo.js');

describe('test user Database',function(){
	const user = {
		username: "testUser",
	    password: "random123",
	    email: "testUser@weather.search.com",
	    gender: "M"
	};

	it('create user', function(){
		this.timeout(2000);
		var result = userDB.createUser(user);
		return result.then(data=>{
			assert.equal(data,true);
		})
	});

	it('login', function(){
		this.timeout(2000);
		var result = userDB.logIn(user.username, user.password);
		var expectResult = {
			username: user.username,
			email: user.email,
			gender: user.gender,
			savedCities: [],
            lastVisteDate: getTodayDate(),
            createDate: getTodayDate(),
            visitCount: 1
		}

		return result.then(data => {
			assert.equal(JSON.stringify(expectResult),JSON.stringify(data));
		})
	});

	it('update info',function(){
		this.timeout(2000);
		var updateFields = {
			email: "???"
		}
		var result = userDB.updateUserInfo("testUser",updateFields);
		
		return result.then(data => {
			assert.equal(data,true);
		})
	});

	it('delete User', function(){
		this.timeout(2000);
		var result = userDB.deleteUser("testUser");
		return result.then(data=>{
			assert.equal(data, true);
		})
	});
})

function getTodayDate() {
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = today.getMonth() + 1;
        var dd = today.getDate();

        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        return yyyy + '.' + mm + '.' + dd;
    }