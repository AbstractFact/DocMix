import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("Login");
    }

    async getHtml() 
    {
       var html;

       html=`
       <div class="container">
       <form id="login-form" style="align:center;">
            <div class="container">
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
                <button class="inputitem" type="submit" loginbtn>Login</button>
            </div>
        </form>
        </div>`;

        return html;
    }

    async login()
    {
        const loginForm = document.querySelector('#login-form');
        const username = loginForm['login-username'].value;
        const password = loginForm['login-password'].value;

        const response =  await fetch("https://localhost:44397/api/User/Login", { method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([ username, password ])
        });
        
        if (!response.ok) 
        {
            alert("User not found!");
            localStorage.user=0;
            localStorage.logged=0;
        }
        else
        {
            const json = await response.json();
            var user = {"id":json.ID, "name":json.Name};
            
            localStorage.user=JSON.stringify(user);
            localStorage.logged=1;

            alert("Welcome to DocMix " + user.name);
        }                                                   
    }     
}