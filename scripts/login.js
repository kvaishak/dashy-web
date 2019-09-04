(function() {
    login = {
        //initializing the elements.
        loginButton: document.getElementById("login"),
        signUpButton: document.getElementById("signup"),
        googleButton: document.getElementById("googleButton"),

        confirmPasswordDiv: $('#confirmPassword'),
        usernameDiv: $('#userName'),

        txtEmail: document.getElementById("email"),
        txtPassword: document.getElementById("password"),
        confirmPassword: document.getElementById("confirm"),
        username: document.getElementById("username"),
        remember_me: document.getElementById("remember_me"),

        alertBox: document.getElementById("alertBox"),
        alertMsg: document.getElementById("alertMsg"),

        signInMode: true,

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            var self = this;
            //Sign in and Sign out.
            self.loginButton.addEventListener('click', e => {
                //get email and password value
                var email = self.txtEmail.value;
                var password = self.txtPassword.value;
                var remember_me = self.remember_me,
                    remember = remember_me.checked;

                if (self.signInMode) {
                    authenticate.login(email, password, remember);
                } else {
                    var confirmPassword = self.confirmPassword.value;
                    var username = self.username.value;
                    if (password === confirmPassword) {
                        authenticate.signup(email, password, username, remember);
                    } else {
                        self.alert("Password Mismatch");
                    }
                }
            });

            //Toggling between signin/create a new account
            self.signUpButton.addEventListener('click', e => {

                if (self.signInMode) {
                    self.loginButton.innerText = "Sign up";
                    self.signUpButton.innerText = "Sign in instead";

                    self.confirmPasswordDiv.fadeIn(500);
                    self.usernameDiv.fadeIn(1000);

                    self.signInMode = false;
                } else {
                    self.loginButton.innerText = "Sign in";
                    self.signUpButton.innerText = "Create a new Account";

                    self.usernameDiv.fadeOut(500);
                    self.confirmPasswordDiv.fadeOut(1000);

                    self.signInMode = true;
                }
            });

            //signin using google Api
            self.googleButton.addEventListener('click', e => {
                authenticate.signinUsingGoogle();
            });

            //enter on password will trigger the sign in.
            $('#password').keypress(function(e) {
                if (e.which == 13) {
                    e.preventDefault();
                    if (self.signInMode) {
                        $("#login").click();
                    }
                }
            });

            //entering the username on signup mode will trigger the signup
            $('#username').keypress(function(e) {
                if (e.which == 13) {
                    e.preventDefault();
                    if (!self.signInMode) {
                        $("#login").click();
                    }
                }
            });
        },
        alert(message) {
            var self = this;
            self.alertBox.hidden = false;
            self.alertMsg.innerText = message;
        }
    }
})();