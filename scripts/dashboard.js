(function() {
    dashboard = {
        userWelcome: document.getElementById("userWelcome"),
        currentUser: undefined,
        init() {
            let self = this;
            todo.init();
        },
        updateUserName(user) {
            var self = this;
            self.currentUser = user;
            let username = user.displayName ? user.displayName : authenticate.createUsernamefromEmail(user.email);
            self.userWelcome.innerText = "Hello " + username + "!";
        }
    }
})();