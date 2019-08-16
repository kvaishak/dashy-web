(function() {
    login = {
        //initializing the elements.
        loginButton: document.getElementById("login"),
        signUpButton: document.getElementById("signup"),

        txtEmail: document.getElementById("email"),
        txtPassword: document.getElementById("password"),

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            var self = this;
            //Logging in.
            self.loginButton.addEventListener('click', e => {
                //get email and password value
                var email = self.txtEmail.value;
                var password = self.txtPassword.value;

                authenticate.login(email, password);
            });

            //sign Up.
            self.signUpButton.addEventListener('click', e => {
                var email = self.txtEmail.value;
                var password = self.txtPassword.value;

                authenticate.signup(email, password);

            });
        },
    }
})();