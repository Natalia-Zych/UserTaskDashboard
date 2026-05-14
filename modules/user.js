class User {
    constructor(id, name, username, email) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.tasksList = [];
    }

    includes(phrase){
        phrase = phrase.toLowerCase();
        return this.name.toLowerCase().includes(phrase)
            || this.username.toLowerCase().includes(phrase)
            || this.email.toLowerCase().includes(phrase);
    }

    print(){
        console.log(`${this.name}  ${this.username} ${this.email}`);
    }
}

export {User};