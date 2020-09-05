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
        displayName: undefined,



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
                        window.location = "pages/dashboard.html" + "#" + self.remember + "-" + self.displayName;
                    } else {
                        let hashValue = window.location.hash.split('-');
                        let remember = hashValue[0].substring(1);

                        self.setRememberParam(remember);

                        //for updating the username in case of new user.
                        if (!user.displayName) {
                            let displayName = hashValue[1];
                            self.displayName = displayName;
                            self.setDisplayName(displayName);
                        } else {
                            self.displayName = user.displayName;
                        }

                        dashboard.updateUserName(self.displayName);
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
            self.displayName = username;
            self.auth.createUserWithEmailAndPassword(email, password).then(function(userInfo) {

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

        //for setting up the display name after the page has been loaded.
        setDisplayName(displayName) {
            var self = this;
            if (!displayName) {
                displayName = self.createUsernamefromEmail(self.user.email);
            }
            self.displayName = displayName; //for updating the displayName with the email.
            self.user.updateProfile({ displayName: displayName });
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