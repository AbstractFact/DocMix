import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("Signup");
    }

    async getHtml() 
    {
        var html;

        html=`
        <div class="container">
        <form id="signup-form" method="post" style="align:center;">
            <div class="container">
                <div class="inputitem">
                    <label for="name"><b>Name:</b></label>
                    <input type="text" style="width:100%;" placeholder="Enter Name" name="name" id="login-name" required>
                </div>
                <div class="inputitem">
                    <label for="country"><b>Country:</b></label>
                    <input type="text" style="width:100%;" placeholder="Enter Country Name" name="country" id="login-country" required>
                </div>
                <div class="inputitem">
                    <label for="uname"><b>Username:</b></label>
                    <input type="text" style="width:100%;" placeholder="Enter Username" name="uname" id="login-username" required>
                </div>
                <div class="inputitem">
                    <label for="psw"><b>Password:</b></label>
                    <input type="password" style="width:100%;" placeholder="Enter Password" name="psw" id="login-password" required>
                </div>
                </div>
            <div class="container">
                <button class="inputitem" style="align-self:column;" type="submit" signupbtn>Signup</button>
            </div>
        </form>
        </div>`;
        
        return html;
    }

    async signup()
    {
        const signupForm = document.querySelector('#signup-form');
        const name = signupForm['login-name'].value;
        const country = signupForm['login-country'].value;
        const username = signupForm['login-username'].value;
        const password = signupForm['login-password'].value;  

        const response =  await fetch("https://localhost:44397/api/User", { method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": name, "country": country, "username": username, "password": password })
        });

        if (!response.ok)
        {
            alert("User already exists!");
            localStorage.user=0;
            localStorage.logged=0;
        }
        else
        {
            const json = await response.json();
            var user = {"id":json.ID, "name":json.Name};

            localStorage.user=JSON.stringify(user);
            localStorage.logged=1;

            alert("Welcome to DocMix "+user.name); 
        }   
    }
}