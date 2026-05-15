import { User } from "./user.js";
import { Task } from "./task.js";
const API_URL = "https://jsonplaceholder.typicode.com/users";

class Manager {
    constructor() {
        this.usersList = [];
        this.filteredUsersList = [];
        this.inputElement = document.getElementById("serch-user-input");
        this.elementListHTML = document.getElementById("users-list");
        this.tasksList = [];
        this.nextTaskId = 1;

        //this.generateTestDataToLocalStorago();
        
    }
    generateTestDataToLocalStorago(){
        const tasksLS = [];
        
        tasksLS.push(new Task(1, "nauczyć się Javascript", 3, true));
        tasksLS.push(new Task(2, "zakupy", 3, false));
        tasksLS.push(new Task(3, "obiad", 3, true));
        tasksLS.push(new Task(4, "sprzątanie", 4, false));
        tasksLS.push(new Task(5, "spacer", 4, true));

        tasksLS.toString();
        const usersListString = JSON.stringify(tasksLS);
        localStorage.setItem("tasks", usersListString);
    }

    async start() {
        const loadingElement = document.getElementById("loading");
        loadingElement.textContent = "Loading...";

        await this.fetchUsers();
        this.fetchTasks();
        this.setTasksUsers();
        loadingElement.textContent = "";

        this.renderUsers();

        //this.saveInLocalStorage();

        this.setInput();

    }

    async fetchUsers() {
        let users = [];
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();
            data.forEach((user) => {
                users.push(new User(user.id, user.name, user.username, user.email));
            });
        }
        catch (e) {
            console.error("Error fetching users from API:", e);
            const errorElement = document.getElementById("error-message");
            errorElement.textContent = "Error fetching users.";
            users = [];
        }

        this.usersList = users;
        this.filteredUsersList = users;
    }

    fetchTasks() {
        let tasks = [];
        try {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }
        catch (e) {
            console.error(`Error fetching tasks from localStorage: ${e}`);
            tasks = [];
        }

        this.tasksList = tasks;
        this.nextTaskId = Math.max(...tasks.map(task => task.id)) + 1;
    }
    
    setTasksUsers(){
        this.usersList.forEach((user) => {
            user.tasksList = this.tasksList.filter((task) => task.userId == user.id);
        });

        this.filteredUsersList = this.usersList;
        console.log(this.filteredUsersList);
    }

    renderUsers() {
        const emptyStateElement = document.getElementById("empty-state");
        emptyStateElement.textContent = "";

        while (this.elementListHTML.firstChild) {
            this.elementListHTML.removeChild(this.elementListHTML.lastChild);
        }

        this.filteredUsersList.forEach(user => { this.renderUserItem(user) });

        if (!this.filteredUsersList.length) {
            emptyStateElement.textContent = "No users";
        }
    }

    renderUserItem(user) {
        const itemUserHtml = document.createElement("li");
        itemUserHtml.textContent = `${user.name} (${user.username})`;
        itemUserHtml.id = user.id;

        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.placeholder = "Enter a new task...";
        inputElement.addEventListener("keypress", (e) => this.addNewTask(e, user.id));
        itemUserHtml.appendChild(inputElement);

        if (user.tasksList && user.tasksList.length) {
            
            const userTasksList = document.createElement("ul");
            itemUserHtml.appendChild(userTasksList);

            user.tasksList.forEach((task) => {
                console.log(`${user.id}------------${user.tasksList.length}`);
                const taskListItem = document.createElement("li");
                //taskListItem.textContent = task.name;

                userTasksList.appendChild(taskListItem);

                const isCompletedCheckbox = document.createElement("input");
                isCompletedCheckbox.type="checkbox";
                isCompletedCheckbox.checked =task.isCompleted;
                isCompletedCheckbox.addEventListener("input", (e) => this.taskIsCompletedChange(e, task));
                taskListItem.appendChild(isCompletedCheckbox);

                const label = document.createElement("label");
                label.textContent = task.name;
                taskListItem.appendChild(label);

                const deleteTaskButton = document.createElement("button");
                deleteTaskButton.className = "delete-btn";
                deleteTaskButton.addEventListener("click", (e) =>  this.deleteTask(task.id, userTasksList, taskListItem));
                deleteTaskButton.textContent = "Usuń -";
                taskListItem.appendChild(deleteTaskButton);


            });

        }

        this.elementListHTML.appendChild(itemUserHtml);
    }

    deleteTask(taskId, parent, childElementToDelete){
        this.tasksList = this.tasksList.filter((task) => task.id != taskId);
        this.updateLocalStorage();
        this.setTasksUsers();
        parent.removeChild(childElementToDelete);
    }

    taskIsCompletedChange(e, changedTask){
        const index = this.tasksList.findIndex(task => task.id === changedTask.id);
        this.tasksList[index].isCompleted = e.srcElement.checked;

        //update localstorage
        this.updateLocalStorage();

        //update user tasks
        this.setTasksUsers();
    }

    updateLocalStorage(){
        this.tasksList.toString();
        const tasksListString = JSON.stringify(this.tasksList);
        localStorage.setItem("tasks", tasksListString);
    }

    saveInLocalStorage() {
        if (this.usersList && this.usersList.length) {
            this.usersList.toString();
            const usersListString = JSON.stringify(this.usersList);
            localStorage.setItem("users", usersListString);
            const usersFromLocalStorage = localStorage.getItem("users");
            const array = JSON.parse(usersFromLocalStorage);

            console.log(" ----------- ");
            console.log(array);
        }
    }

    setInput() {

        let timeout;
        this.inputElement.value = "";
        this.inputElement.addEventListener("input", (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => { this.filterUsers(e) }, 1000);
        });
    }

    filterUsers(e) {
        const phraze = this.inputElement.value;
        this.filteredUsersList = this.usersList.filter((user) => user.includes(phraze));
        this.renderUsers();
        console.log("-----filtered users-----");
        this.filteredUsersList.forEach((user) => user.print());
    }

    addNewTask(e, userId) {
    if (event.key === "Enter") {
            let task = new Task(this.nextTaskId, e.srcElement.value, userId, false);
            this.nextTaskId += 1;
            this.tasksList.push(task);
            this.setTasksUsers();

            //e.srcElement.value = "";
            this.updateLocalStorage();
            this.renderUsers();
        }
    }

}

export { Manager };