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
        this.completeTasksUsers();
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
    }
    
    completeTasksUsers(){
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

        if (user.tasksList && user.tasksList.length) {
            
            const userTasksList = document.createElement("ul");
            itemUserHtml.appendChild(userTasksList);

            user.tasksList.forEach((task) => {
                console.log(`${user.id}------------${user.tasksList.length}`);
                const taskListItem = document.createElement("li");
                taskListItem.textContent = task.name;
                userTasksList.appendChild(taskListItem);

                const deleteTaskButton = document.createElement("button");
                deleteTaskButton.className = "delete-btn";
                deleteTaskButton.addEventListener("click", () => { this.deleteTask(taskListItem) });
                deleteTaskButton.textContent = "Usuń -";
                taskListItem.appendChild(deleteTaskButton);

                const isCompletedCheckbox = document.createElement("input");
                isCompletedCheckbox.type="checkbox";
                isCompletedCheckbox.checked =task.isCompleted;
                isCompletedCheckbox.addEventListener("input", (e) => this.taskIsCompletedChange(e, task));
                taskListItem.appendChild(isCompletedCheckbox);


            });

        }

        this.elementListHTML.appendChild(itemUserHtml);
    }

    taskIsCompletedChange(e, changedTask){
        console.log(changedTask);
        console.log(e);


        const index = this.tasksList.findIndex(task => task.id === changedTask.id);
        this.tasksList[index].isCompleted = e.srcElement.checked;

        //update localstorage
        this.tasksList.toString();
        const tasksListString = JSON.stringify(this.tasksList);
        localStorage.setItem("tasks", tasksListString);

        this.completeTasksUsers();

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
}

export { Manager };