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
            this.inputTodo = document.getElementById('inputTodo');
            this.newTodo = document.getElementById('newTodo');
            this.clearTodo = document.getElementById('clearTodo');
            // var initTodoData = database.getTodoData();
            // if (initTodoData) {
            //     self.updateTodo(initTodoData);
            // }

            this.bindEvents();
        },
        bindEvents() {
            var self = this;

            //when new todo is added to the server to update it in the local data.
            document.addEventListener("child_added", function(data) {
                console.log(data.detail.snap);
                self.todoAdded(data.detail.snap);
            });

            //when todo is removed in server to update it accordingly.
            document.addEventListener("child_removed", function(data) {
                console.log(data.detail.snap);
                self.todoRemoved(data.detail.snap);
            });

            //creation of newTodo and sending it to the server.
            self.newTodo.addEventListener('click', function() {
                var userId = authenticate.user.uid;
                var subject = self.inputTodo.value;
                var completed = false;
                let todo = {
                    "userId": userId,
                    "subject": subject,
                    "completed": completed,
                }
                database.createNewTodo(todo);
                self.inputTodo.value = "";
            });

            //clearing the text in the input box.
            self.clearTodo.addEventListener('click', function() {
                self.inputTodo.value = "";
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