(function() {
    dashboard = {
        userWelcome: document.getElementById("userWelcome"),
        currentUser: undefined,
        init() {
            let self = this;
            todo.init();
        },
        updateUserName(username) {
            var self = this;
            self.userWelcome.innerText = "Hello " + username + "!";
        }
    }
})();