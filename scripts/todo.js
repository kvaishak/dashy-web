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

            //catches the sync events from databse.
            document.addEventListener("sync", function(data) {
                self.sync.handle(data);
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
        sync: {
            //handles the additon/deletion and updation of todo elements coming from the database.
            handle(data) {
                var self = this;
                let snap = data.detail.snap,
                    action = data.detail.action;
                self[action](snap);
            },
            add(snap) {
                let todoElement = todo.createTodoElement(snap);
                //binding of click events to individual todoElements.
                todoElement.addEventListener('click', function() {
                    console.log("todo Selected");
                    todo.selectTodo(event);
                    event.stopPropagation();
                });
                todo.todoContainer.append(todoElement);
            },
            remove(snap) {
                let todoElement = todo.getTodoElementById(snap.key);
                todoElement.remove();
            },
            update(snap) {
                let todoData = snap.val(),
                    todoElement = todo.getTodoElementById(snap.key);

                //completion toggle updation.
                let completed = todoElement.getAttribute('completed'),
                    updateCompleted = String(todoData.completed);
                if (completed != updateCompleted) {
                    todoElement.children[1].children[0].checked = todoData.completed;
                    todoElement.setAttribute('completed', todoData.completed);
                }
            }
        },

        //creating a todo element.
        createTodoElement(snap) {
            var self = this;
            var todoData = snap.val();
            var id = snap.key;

            var todoElement = document.createElement('p');
            todoElement.setAttribute('id', id);
            todoElement.setAttribute('completed', todoData.completed);
            todoElement.setAttribute('todo-content', todoData.subject);
            todoElement.className += 'todo';

            var todoContent = document.createElement('label');
            todoContent.innerText = todoData.subject;
            todoContent.classList.add('todo-content');
            todoElement.append(todoContent);

            var toggle = self.createToggle(todoData.completed, id);
            todoElement.append(toggle);
            return todoElement;
        },

        //creating the toggle for the completed attribute of todo.
        createToggle(completed, id) {
            var self = this;
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
            sp.setAttribute('todoId', id);
            label.append(sp);

            label.addEventListener('click', function() {
                console.log("completion toggle");
                self.toggleCompletion(event);
                event.stopPropagation();
            });

            return label;
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
        },

        //handling the toggling of the completion toggle.
        toggleCompletion(event) {
            var self = this;
            var target = event.target;
            if (target.classList[0] == "slider") {
                var todoId = target.getAttribute('todoId');
                var todoElement = self.getTodoElementById(todoId);
                var completedString = todoElement.getAttribute('completed');
                var newCompleted = completedString === "true" ? false : true;
                var updates = {
                        'completed': newCompleted,
                    }
                    // todoElement.children[1].children[0].checked = newCompleted;
                todoElement.setAttribute('completed', newCompleted);

                database.updateExistingTodo(todoId, updates);

            }
        },

        getTodoElementById(id) {
            return (document.getElementById(id));
        }
    }
})();