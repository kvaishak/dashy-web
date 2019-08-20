// link for managing user -> https://firebase.google.com/docs/auth/web/manage-users
(function() {
    authenticate = {

        // Your web app's Firebase configuration
        firebaseConfig: {
            apiKey: "AIzaSyDsWM8tg4WJs-QfrDOeY59cf7oCmDLEMf0",
            authDomain: "logindemo-81a40.firebaseapp.com",
            databaseURL: "https://logindemo-81a40.firebaseio.com",
            projectId: "logindemo-81a40",
            storageBucket: "logindemo-81a40.appspot.com",
            messagingSenderId: "198765944214",
            appId: "1:198765944214:web:81f3f37659a91688"
        },

        firebase: undefined, //firebase object to be used to get the database in todo.js
        auth: undefined, //firebase auth object.
        user: null, //current user.
        remember: false,



        init: function(fromDashBoard) {
            // Initialize Firebase
            firebase.initializeApp(this.firebaseConfig);
            this.firebase = firebase;
            this.auth = firebase.auth();

            this.bindEvents(fromDashBoard);
        },
        bindEvents: function(fromDashBoard) {
            var self = authenticate;

            //handles if the user is logged in properly or not.
            self.auth.onAuthStateChanged(user => {
                if (user) {
                    console.log(user);
                    self.user = user;
                    if (!fromDashBoard) {
                        window.location = "pages/dashboard.htm#" + self.remember;
                    } else {
                        let remember = window.location.hash.substring(1);
                        self.setRememberParam(remember);
                        dashboard.updateUserName(user);
                        database.init();
                    }
                } else {
                    console.log("not logged in");

                    if (fromDashBoard) {
                        window.location = "../index.html"
                    }
                    self.user = null;
                }
            });
        },

        login(email, password, remember) {
            //logging in.
            var self = this;
            self.remember = remember;
            const promise = self.auth.signInWithEmailAndPassword(email, password);
            promise.catch(e => login.alert(e.message));
        },

        signup(email, password, username, remember) {
            //creating new user.
            //if username is passed then it is updated as well.
            var self = this;
            username = username ? username : self.createUsernamefromEmail(email);
            self.remember = remember;
            self.auth.createUserWithEmailAndPassword(email, password).then(function(userInfo) {
                console.log("Username updated");
                return userInfo.user.updateProfile({
                    displayName: username
                });
            }).catch(function(error) {
                login.alert(error.message);
            });
        },

        //for deciding whether the user should be logged off as soon as the application is closed or not.
        setRememberParam(remember) {
            if (remember === "true") {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
            } else {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
            }
        },

        createUsernamefromEmail(email) {
            let index = email.indexOf('@');
            return (email.substr(0, index));
        },

        signout() {
            var self = this;
            //loging out.
            self.auth.signOut();
        },

        //returns the current user.
        getCurrentUser() {
            var self = this;
            return self.user;
        },

        //signs-out the current user.
        logOutCurrentUser() {
            var self = this;
            self.auth.signOut();
        }
    };
}());