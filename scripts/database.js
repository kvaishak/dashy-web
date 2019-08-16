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
                self.sync(snap, "add");
                console.log(snap.val());
            });

            self.databaseObject.on('child_removed', snap => {
                self.sync(snap, "remove");
                console.log(snap.val());
            });

            self.databaseObject.on('child_changed', snap => {
                self.sync(snap, "update");
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

        sync(snap, action) {
            var event = new CustomEvent("sync", { detail: { snap, action } });
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
        },

        updateExistingTodo(todoId, updates) {
            //updates the exisisting todo with the id todoId
            //now used only for the completion toggle - can be used for subject edition too.
            var self = this;
            self.databaseRef.ref().child('todo').child(todoId).update(updates);
        }
    }

})();