(function() {
    login = {
        //initializing the elements.
        loginButton: document.getElementById("login"),
        signUpButton: document.getElementById("signup"),

        confirmPasswordDiv: $('#confirmPassword'),
        usernameDiv: $('#userName'),

        txtEmail: document.getElementById("email"),
        txtPassword: document.getElementById("password"),
        confirmPassword: document.getElementById("confirm"),
        username: document.getElementById("username"),

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

                if (self.signInMode) {
                    authenticate.login(email, password);
                } else {
                    var confirmPassword = self.confirmPassword.value;
                    var username = self.username.value;
                    if (password === confirmPassword) {
                        authenticate.signup(email, password, username);
                    } else {
                        self.alert("Password Mismatch");
                    }
                }
            });

            //Toggling between signin/create a new account
            self.signUpButton.addEventListener('click', e => {
                // var email = self.txtEmail.value;
                // var password = self.txtPassword.value;

                // authenticate.signup(email, password);
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
        },
        alert(message) {
            var self = this;
            self.alertBox.hidden = false;
            self.alertMsg.innerText = message;
        }
    }
})();