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

            self.databaseObject.on('child_changed', snap => {
                self.updateTodo(snap);
                console.log(snap.val());
            });

            //     var connectedRef = firebase.database().ref(".info/connected");
            //     connectedRef.on("value", function(snap) {
            //         if (snap.val() === true) {
            //             alert("connected");
            //         } else {
            //             alert("not connected");
            //         }
            //     });
        },

        addTodo(snap) {
            //handline the addition of todo from database events.
            var event = new CustomEvent("child_added", { detail: { snap } });
            document.dispatchEvent(event);
        },

        removeTodo(snap) {
            //handline the removal of todo from database events
            var event = new CustomEvent("child_removed", { detail: { snap } });
            document.dispatchEvent(event);
        },

        updateTodo(snap) {
            //handling the updation of todo mainly completion toggle.
            var event = new CustomEvent("child_updated", { detail: { snap } });
            document.dispatchEvent(event);
        },

        createNewTodo(todo) {
            //updation of new todo to database.
            var self = this;
            self.databaseRef.ref().child('todo').push().set(todo);
        },

        deleteTodo(todoId) {
            //deletion of todo based on the todo key/id.
            var self = this;
            self.databaseRef.ref().child('todo').child(todoId).remove().then(() => {
                console.log("Element Deleted");
            })
        }
    }

})();