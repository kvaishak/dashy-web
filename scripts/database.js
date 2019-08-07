(function() {
    database = {
        databaseRef: undefined,
        databaseObject: undefined,
        Todo: undefined,
        init() {
            const user = authenticate.getCurrentUser();
            const userId = user.uid;
            this.databaseRef = authenticate.firebase.database();
            const dbRefObject = authenticate.firebase.database().ref().child("todo").orderByChild('userId').equalTo(userId);
            this.databaseObject = dbRefObject;
            this.bindEvents();
        },

        bindEvents() {
            var self = this;
            self.databaseObject.on('value', snap => {
                self.Todo = snap.val();
                // console.log(snap.val());
            });

            self.databaseObject.on('child_added', snap => {
                self.addTodo(snap);
                console.log(snap.val());
            });

            self.databaseObject.on('child_removed', snap => {
                self.removeTodo(snap);
                console.log(snap.val());
            });
        },

        addTodo(snap) {
            var self = this;
            var event = new CustomEvent("child_added", { detail: { snap } });

            // Dispatch/Trigger/Fire the event
            document.dispatchEvent(event);
        },

        removeTodo(snap) {
            var self = this;
            var event = new CustomEvent("child_removed", { detail: { snap } });

            // Dispatch/Trigger/Fire the event
            document.dispatchEvent(event);
        }
    }

})();