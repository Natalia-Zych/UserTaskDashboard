import { User } from "./user.js";
const API_URL = "https://jsonplaceholder.typicode.com/users";

class Manager {
    constructor() {
        this.usersList = [];
        this.filteredUsersList = [];
        this.inputElement = document.getElementById("serch-user-input");
        this.elementListHTML = document.getElementById("users-list");
    }

    async start() {
        const loadingElement = document.getElementById("loading");
        loadingElement.textContent = "Loading...";

        await this.fetchUsers();
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

            //function filter
            //const karianneUser = this.usersList.filter((user) => user.username.includes("Karianne"));
            //console.log(karianneUser);
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

    renderUsers() {
        const emptyStateElement = document.getElementById("empty-state");
        emptyStateElement.textContent = "";

        while (this.elementListHTML.firstChild) {
            this.elementListHTML.removeChild(this.elementListHTML.lastChild);
        }

        this.filteredUsersList.forEach(user => {
            let itemListHtml = document.createElement("li");
            itemListHtml.textContent = `${user.name} (${user.username})`;
            itemListHtml.id = user.id;
            this.elementListHTML.appendChild(itemListHtml);
        });

        if (!this.filteredUsersList.length) {
            emptyStateElement.textContent = "No users";
        }
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