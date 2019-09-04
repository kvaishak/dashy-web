(function() {
    dashboard = {
        userWelcome: document.getElementById("userWelcome"),

        init() {
            let self = this;
            todo.init();
        },
        updateUserName(displayName) {
            var self = this;
            self.userWelcome.innerText = "Hello " + displayName + "!";
        }
    }
})();