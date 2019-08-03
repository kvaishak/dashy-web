//handles the updation of the todo from the database.
(function() {
    todo = {
        todoContainer: document.getElementById("todoContainer"),
        sampleTodo: document.getElementById("Todo"),

        currentUser: authenticate.getCurrentUser(),
        databaseObject: undefined,

        init() {
            var self = this;
            this.todoContainer = document.getElementById("todoContainer");
            // var initTodoData = database.getTodoData();
            // if (initTodoData) {
            //     self.updateTodo(initTodoData);
            // }

            this.bindEvents();
        },
        bindEvents() {
            var self = this;

            document.addEventListener("child_added", function(data) {
                console.log(data.detail.snap);
                self.todoAdded(data.detail.snap);
            });

            document.addEventListener("child_removed", function(data) {
                console.log(data.detail.snap);
                self.todoRemoved(data.detail.snap);
            });
        },

        //handles the addition of single todo.
        todoAdded(snap) {
            var self = this;

            var todoElement = self.createTodoElement(snap);
            self.todoContainer.append(todoElement);
        },

        //handles the deletion of todo.
        todoRemoved(snap) {
            var self = this;
            self.removeTodoElement(snap);

        },

        // //get the todo index from the todocontainer if it is present else returns null.
        // getTodoIndex(todoData) {
        //     var self = this;
        //     var todoNodes = self.todoContainer.childNodes;

        //     var length = todoNodes.length;
        //     for (var i = 0; i < length; i++) {
        //         if (todoNodes[i].getAttribute('id') === id) {
        //             return i;
        //         }
        //     }
        // },

        //creating a todo element.
        createTodoElement(snap) {
            var todoData = snap.val();
            var id = snap.key;

            var todoElement = document.createElement('p');
            todoElement.setAttribute('id', id);
            todoElement.setAttribute('completed', todoData.completed);
            todoElement.innerText = todoData.subject;
            return todoElement;
        },

        //removing a todo element.
        removeTodoElement(snap) {
            var todoElement = document.getElementById(snap.key);
            todoElement.remove();
        }
    }
})();