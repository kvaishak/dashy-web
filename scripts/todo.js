//handles the updation of the todo from the database.
(function() {
    todo = {
        todoContainer: document.getElementById("todoContainer"),
        sampleTodo: document.getElementById("Todo"),

        currentUser: authenticate.getCurrentUser(),
        databaseObject: undefined,
        selectedTodo: undefined,
        fromUI: false,

        init() {
            var self = this;
            this.todoContainer = document.getElementById("todoContainer");
            this.inputTodo = document.getElementById('inputTodo');
            this.newTodo = document.getElementById('newTodo');
            // this.clearTodo = document.getElementById('clearTodo');
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

            // self.deleteTodo.addEventListener('click', function() {
            //     let selectedTodoId = self.selectedTodo.getAttribute('id');

            //     database.deleteTodo(selectedTodoId);
            //     self.clearSelection();
            // });

            //clearing the text in the input box.
            // self.clearTodo.addEventListener('click', function() {
            //     self.inputTodo.value = "";
            // });

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
                    toggleElement = todo.getToggleElementById(snap.key);

                if (!todo.fromUI) {
                    //completion toggle updation.
                    let completed = toggleElement.children[0].checked,
                        updateCompleted = todoData.completed;
                    if (completed != updateCompleted) {
                        toggleElement.children[0].checked = todoData.completed;
                        // todoElement.setAttribute('completed', todoData.completed);
                    }
                }
                self.fromUI = false;
            }
        },

        //creating a todo element.
        createTodoElement(snap) {
            var self = this;
            var todoData = snap.val();
            var id = snap.key;

            var todoDiv = document.createElement('div');
            todoDiv.setAttribute('id', id);
            todoDiv.setAttribute('completed', todoData.completed);
            todoDiv.setAttribute('todo-content', todoData.subject);
            todoDiv.classList.add('row');
            todoDiv.classList.add('todo');

            var todoColomn = document.createElement('div');
            todoColomn.classList.add('col-sm-8');

            var todoContent = document.createElement('p');
            todoContent.innerText = todoData.subject;
            todoContent.classList.add('todo-content');
            todoColomn.append(todoContent);

            todoDiv.append(todoColomn);

            var toggleAndDelete = self.createCompleteDeleteContainer(todoData.completed, id);
            todoDiv.append(toggleAndDelete);
            return todoDiv;
        },

        //creates the container that creates the complete and delete buttons/toggle.
        createCompleteDeleteContainer(completed, id) {
            var self = this;
            var mainDiv = document.createElement('div');
            mainDiv.classList.add('col-sm-4');
            var completionToggle = self.createToggle(completed, id);
            var deleteButton = self.createDeleteButton(id);

            mainDiv.append(deleteButton);
            mainDiv.append(completionToggle);

            return mainDiv
        },

        createDeleteButton(id) {
            var delButton = document.createElement('button');
            delButton.setAttribute('type', 'button');
            delButton.setAttribute('id', 'deleteTodo');
            delButton.setAttribute('todoId', id);

            delButton.classList.add('btn');
            delButton.classList.add('btn-danger');
            delButton.classList.add('btn-lg');
            delButton.classList.add('btn-block');

            delButton.hidden = true;
            delButton.innerText = "Delete";

            return delButton;
        },

        //creating the toggle for the completed attribute of todo.
        createToggle(completed, id) {
            var self = this;
            var mainDiv = document.createElement('div');
            mainDiv.classList.add('text-center');

            var label = document.createElement('label');
            label.classList.add('switch');
            label.setAttribute('id', 'toggle_' + id);

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

            mainDiv.append(label);
            return mainDiv;
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
                var toggleElement = self.getToggleElementById(todoId);
                var completed = toggleElement.children[0].checked;
                // var todoElement = self.getTodoElementById(todoId);
                // var completedString = todoElement.getAttribute('completed');
                var newCompleted = completed === true ? false : true;
                var updates = {
                        'completed': newCompleted,
                    }
                    // toggleElement.children[0].checked = newCompleted;
                    // todoElement.children[1].children[0].checked = newCompleted;
                    // todoElement.setAttribute('completed', newCompleted);
                self.fromUI = true;
                database.updateExistingTodo(todoId, updates);

            }
        },

        getTodoElementById(id) {
            return (document.getElementById(id));
        },
        getToggleElementById(id) {
            return (document.getElementById('toggle_' + id));
        }
    }
})();