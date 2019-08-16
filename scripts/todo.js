//handles the updation of the todo from the database.
(function() {
    todo = {
        todoContainer: document.getElementById("todoContainer"),
        sampleTodo: document.getElementById("Todo"),

        currentUser: authenticate.getCurrentUser(),
        databaseObject: undefined,
        selectedTodo: undefined,

        init() {
            var self = this;
            this.todoContainer = document.getElementById("todoContainer");
            this.inputTodo = document.getElementById('inputTodo');
            this.newTodo = document.getElementById('newTodo');
            this.clearTodo = document.getElementById('clearTodo');
            this.logOut = document.getElementById('logout');
            this.deleteTodo = document.getElementById('deleteTodo');

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

            self.deleteTodo.addEventListener('click', function() {
                let selectedTodoId = self.selectedTodo.getAttribute('id');

                database.deleteTodo(selectedTodoId);
                self.clearSelection();
            });

            //clearing the text in the input box.
            self.clearTodo.addEventListener('click', function() {
                self.inputTodo.value = "";
            });

            //logging out.
            self.logOut.addEventListener('click', function() {
                authenticate.signout();
            });

            //clearing the selection in case user touches anywhere else.
            document.addEventListener('click', function() {
                self.clearSelection();
            });
        },

        //handles the addition of single todo from the database
        todoAdded(snap) {
            var self = this;

            var todoElement = self.createTodoElement(snap);
            //binding of click events to individual todoElements.
            todoElement.addEventListener('click', function() {
                console.log("todo Selected");
                self.selectTodo(event);
                event.stopPropagation();
            });
            self.todoContainer.append(todoElement);
        },

        //handles the deletion of todo from the database.
        todoRemoved(snap) {
            var self = this;
            self.removeTodoElement(snap);

        },


        //creating a todo element.
        createTodoElement(snap) {
            var self = this;
            var todoData = snap.val();
            var id = snap.key;

            var todoElement = document.createElement('p');
            todoElement.setAttribute('id', id);
            todoElement.setAttribute('completed', todoData.completed);
            todoElement.className += 'todo';

            var todoContent = document.createElement('label');
            todoContent.innerText = todoData.subject;
            todoContent.classList.add('todo-content');
            todoElement.append(todoContent);

            var toggle = self.createToggle(todoData.completed);
            todoElement.append(toggle);
            return todoElement;
        },

        //creating the toggle for the completed attribute of todo.
        createToggle(completed) {
            var label = document.createElement('label');
            label.classList.add('switch');

            var ip = document.createElement('input');
            ip.setAttribute('type', 'checkbox');
            if (completed) {
                ip.checked = true;
            } else {
                ip.checked = false;
            }
            label.append(ip);

            var sp = document.createElement('span');
            sp.classList.add('slider');
            sp.classList.add('round');
            label.append(sp);

            return label;
        },

        //removing a todo element.
        removeTodoElement(snap) {
            var todoElement = document.getElementById(snap.key);
            todoElement.remove();
        },

        //handles the selection of todo.
        selectTodo(event) {
            let self = this,
                selectedTodoElement = event.target;

            self.clearSelection();
            self.selectedTodo = selectedTodoElement;
            selectedTodoElement.className = 'selected-todo';
            self.deleteTodo.disabled = false;
        },

        //handles the clearing of selected Todo.
        clearSelection() {
            let self = this,
                selectedTodo = self.selectedTodo;
            if (selectedTodo) {
                selectedTodo.className = "todo";
                self.deleteTodo.disabled = true;
            }
        }
    }
})();