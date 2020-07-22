
## Group Members:
- Student 1: Enhao Wu (1003002289)
- Student 2: Hao Wang (1002275496)
- Student 3: Yian Wu (1002077236)
- Student 4: Quan Zhou (1002162492)

## Site:
This web application has already deploied on heroku server.
Here is the URL for our site https://bang-weather-search.herokuapp.com

>> Our site is an RESTful api, user can use all CURD methods list in Endpoints.

## Endpoints:
*NOTES: <br />
- Some methods design for browser. Thus, BROWSER ONLY methods will not work in terminal or command line, since command line cannot storing sessions.
- All Content-Type of POST and PUT metheds are forced to application/json, This means if a user forget to type '-H "Content-Type: application/json"' when they use curl to manipulate our api, everything will still work as long as they have correct attributes name.

POST: <br />
1. Users can create their own account on our database by sending their infomation to '/api/users'. This method requires user pass in a JSON object which contains at least two fields, usernam and password. Other infomation, such as email, gender, is optional, 

- For Example: <br />
curl -H "Content-Type: application/json" -d '{"username":"xxxxx","password":"xxxxx"}' -X POST https://bang-weather-search.herokuapp.com/api/users

2. Once a user has his own account, then he can log in their own account through '/api/users/login'. This method requires user pass in a JSON object which must contains following two fields, usernam and password.

- For Example: <br />
curl -H "Content-Type: application/json" -d '{"username":"xxxxx","password":"xxxxx"}' -X POST https://bang-weather-search.herokuapp.com/api/users/login

3. A boardcasting message can be posted through '/api/messages'. This method requires user pass in a JSON object which contains only one fields, data.

- For Example: <br />
a. curl -H "Content-Type: application/json" -d '{"data":"Cool"}' -X POST https://bang-weather-search.herokuapp.com/api/messages<br />
b. curl -d '{"data":"Cool"}' -X POST https://bang-weather-search.herokuapp.com/api/messages


GET: <br />
1. User can get an JSON object with weather infomation of a city by calling this endpoint '/api/weather/:LOCATION'

- For Example: <br />
curl https://bang-weather-search.herokuapp.com/api/weather/Toronto

2. After a user sign in, he can access his own data by calling '/api/users/data'.(BROWSER ONLY)

3. When a user want to terminate his own session, he can call '/users/logout' to log out. (BROWSER ONLY)

4. By calling '/api/messages' a user can get a list of current messages that post on web.

- For Example: <br />
curl https://bang-weather-search.herokuapp.com/api/messages

PUT: <br />
1. Once a user logged in, he can add citites to his personal account through '/api/users/addCity'. This method requires user pass in a JSON object which contains only one attribute, city. (BROWSER ONLY)

2. When a user is logged in, he can use '/api/users/updateUserInfo' to update his infomation. New passed in data should in JSON form and contains some of following fields: password, email, gender. (BROWSER ONLY)

DELETE: <br />
1. '/api/users/deleteCity/:CITY' is using to delete an added city in users city collections. (BROWSER ONLY)

2. When a user is logged in, he can delete his account from database by calling '/api/users'. (BROWSER ONLY)

3. User can delete a boardcasting message through calling this method '/api/messages/:ID'. A Id is required for delete a message.

- For Example: <br />
curl -X DELETE https://bang-weather-search.herokuapp.com/api/messages/3

## Session management: 
1. Our web application does not managing sessions for all users.

2. We only managing sessions for logged in users, and a 15 minutes session will sign to each user once they logged in.

3. During users' session, unless the session expired or users choose to sign out. Their infomation will stay on the browser and can be recovered if they close the window and come back latter.

4. While a user(with username:happy) log in, if he want his browser remember his password. Then what he need to do is to check 'remember me' under log in view. Then our server will let their save a signed non-expired session which storing username and its password. So for happy's next log in, once he type his username correctly his password will automatically filled in. Besides, he can easily remove this non-expired session by uncheck 'remember me' in the log in view.   

## Database:
1. We use MongoDB storing and managing our users' infomation. 

2. The collection storing all users' data use username as the primary key for this collectio, which indicates that username has to be unique and not null.

3. Example:  <br />
- Following data is what we save on DB for every user <br />
{"_id": {"$oid": "5a2576df5921f000146b8416”}, "username": "wang", "password": 3628376483, "email": "123@gmail.com", "gender": "F", "savedCities": [], "lastVisteDate": "2017.12.04", "createDate": "2017.12.04", "visitCount": 1 } 
- However, our database will only provide a encapData to server <br />
{"username": "wang","email": "123@gmail.com","gender": "F","savedCities": [],"lastVisteDate": "2017.12.04","createDate": "2017.12.04","visitCount": 1 }

## Security: (the most thing we concerned)
1. All non-expired sessions we store on browser are signed. This means the value storing in those sessions are not readable for human and other mechine. Only the server with correct key can read that value. Thus, sessions storing on browser are safe.

2. All passwords stored in databases has been hashed in one direction - we only have forward method that convert a input password to a hash+shift string (no reverse method). When a user log in, their input password will first convert to a hash+shift string, then two hash strings will be compared. Thus, users' passwords are safe.

3. We store user's infomation in a signed session which has a expired time 15 mins. After a session expired, all user's data storing in that session will disappear and the only way to retrive those data back is for the user to log into his account again.Thus, user's current logged in session is safe.

4. User session expiration mechanism can helps users keep the privacy of their data when they forget to sign out.

## Tests: 
1. We have tests for database. Basically, it tests all database operations we use in this project: create user, login user, update user’s info and delete user.

2. We have tests for weather data return from yahoo weather search API, which tests all data fields required for our web application.

## Scripts:
1. sh init.sh: bash file that install everything needed for this project and run all the tests

2. npm test: run all tests we have for weather and databases

3. npm run react: convert all jsx file in ./public/script/jsx to js files under directory ./public/script/js_client

## Features:
LogIn: <br />
We provide a login system for our user. Users can access by clicking the LogIn button on the top tool bar. There is also a link on the Register page for our new users. 

Thers is also a "Remember Password?" option available for the users. By checking the checkbox when you log in, we will remember your password for your next visits. if you decide to clear the remembered password, just simply uncheck the checkbox when you log in again.

After user logged in there will be a 'SignOut' on the top right, so users can sign out their account by clicking it. 

- Errors: <br /> 
1. Username and password field can not be empty, otherwise the error message will pop up.

2. If a user enter the username and password correctly, by clicking the "LogIn" button, the user will be directed back to search Page and with user's account logged in. 

3. If the account does not exist or wrong password, the user will not be signed in successfuly. The user will see a message and asking for another try. 

Account Information: <br />
After a user successfuly log in, he/she will be able to see the information page of the account. 

There are 6 things will be listed which are username, email, gender, the date when the account was created and the number of visiting of the user.

The user can also modify their email, gender and password through the information page. If the user doesn't modify their information follow the following requirements, an error will appear at the right side of the user input box.

- Error: <br />
1. If a user want to change a new password, the user need to enter a password exatly the same twice.

2. If a user want to change email address, the email address must in the format of  XXX@XXX.XX

3. If a user want to change gender information, only "M" or "F" can be typed in the input box.


Register: <br />
Users are able to do registration. 

Registration page can be accessed only in Login Page. There is a link in Log in page which link to the registration page. 

There is also a link on registration page which allows the user to jump to log in page, in case of users accidently click the button which links registration page.

When filling the registration form, we have set some constains to keep validity of our users' account.

- Constraints <br />
1. If user's input is invalid, then there will be a error message appears near the text field and the 'create account' button will be invalid.

2. Username is required and it must be unique, if the username has already been registered, after click "create account" a red sentence will be showed on top of the registration form to notify the users to rename their username.

3. Password is also required and it must be at least 6 characters long, and must contain letters and numbers due to a safety concern.

4. Users must retype the password in the Confirm Password field, the retyped password must be the same with password, to ensure that users really know what they are typing. 

5. If the Password and Confirm Password are not typed as the requirement, a red sentence will appear on the right side of the user input box to help users set the password correctly.

6. Once user has a username, password and confirm password are correctly typed, the "Create account" button will be valid. 

Search history: <br />
This part appears once a user logged in.

The main propose for this part is to keep tracking user’s searched cities and make users’ search easier. It will maximumly show the most 7 recently searched city.

Users are allow to delete some cities that they do not want.

Message box: <br />
This part appears once a user logged in.

User will see the most current board casting message in that box.

If a user want see history of messages, he can simply click ‘history’ to expands the message box. Then he will be able to see all the massages have been posted in the past.

User can also post board casting messages to all logged in users.

Once user finish viewing messages' history, he can click ‘hide’ to hide the giant message box.
