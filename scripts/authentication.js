// link for managing user -> https://firebase.google.com/docs/auth/web/manage-users
(function() {
    authenticate = {

        // Your web app's Firebase configuration
        firebaseConfig: {
            apiKey: "AIzaSyC-DGi9_6tsBrgSH_IZmw2gaFcTc7fweIE",
            authDomain: "dashy-800d6.firebaseapp.com",
            databaseURL: "https://dashy-800d6.firebaseio.com",
            projectId: "dashy-800d6",
            storageBucket: "",
            messagingSenderId: "689140744292",
            appId: "1:689140744292:web:4cf55ffcdedc1466"
        },

        firebase: undefined, //firebase object to be used to get the database in todo.js
        auth: undefined, //firebase auth object.
        user: null, //current user.
        remember: true,



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
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            } else {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
            }
        },

        createUsernamefromEmail(email) {
            let index = email.indexOf('@');
            return (email.substr(0, index));
        },

        //for sigining in with google account.
        signinUsingGoogle() {
            var self = this;
            var provider = new firebase.auth.GoogleAuthProvider();
            self.auth.signInWithRedirect(provider);
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