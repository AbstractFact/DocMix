import Home from "./views/Home.js";
import Docs from "./views/Docs.js";
import DocView from "./views/DocView.js";
import Login from "./views/Login.js";
import Signup from "./views/Signup.js";
import MyProfile from "./views/MyProfile.js";
import Profile from "./views/Profile.js";

var view;

if(localStorage.logged==0)
{
    var html=document.body.querySelector(".topnav").innerHTML;
    html+=
    `<a href="/login" id="login" class="nav__link" data-link>Login</a>
    <a href="/signup" id="signup" class="nav__link" data-link>Signup</a>`;
    document.body.querySelector(".topnav").innerHTML=html;
}
else
{
    var html=document.body.querySelector(".topnav").innerHTML;
    html+=
    `<a href="/myprofile" id="myprofile" class="nav__link" data-link>My Profile</a>
    <a href="/" id="logout" class="nav__link" logout>Logout</a>`;
    document.body.querySelector(".topnav").innerHTML=html;
}

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Home },
        { path: "/docs", view: Docs },
        { path: "/docs/:id/:pn", view: DocView },
        { path: "/myprofile", view: MyProfile },
        { path: "/profile/:id", view: Profile },
        { path: "/login", view: Login },
        { path: "/signup", view: Signup }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();
    if(window.location.href.includes("docs/"))
        view.getCurrentContent();

};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {    
    document.body.addEventListener("keypress", e => {
        if(e.key==='Enter')
        {
            if (e.target.matches("[gotopage]")) {
                e.preventDefault();
                view.ToPage(e.target.value);
            }
        }
    }),
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }

        if (e.target.matches("[loginbtn]")) {
            e.preventDefault();
            handleLogin();
        }

        if (e.target.matches("[signupbtn]")) {
            e.preventDefault();
            handleSignup();
        }

        if (e.target.matches("[logout]")) {
            e.preventDefault();
            logout();
            navigateTo(e.target.href);
        }

        if (e.target.matches("[addDocBtn]")) {
            e.preventDefault();
            handleAddDoc();
        }

        if (e.target.matches("[editDocBtn]")) {
            e.preventDefault();
            handleEditDoc();
        }

        if (e.target.matches("[deleteDocBtn]")) {
            e.preventDefault();
            handleDeleteDoc();
        }

        if (e.target.matches("[addparBtn]")) {
            e.preventDefault();
            view.addElement("par");
        }
        if (e.target.matches("[addpicBtn]")) {
            e.preventDefault();
            view.addElement("pic");
        }

        if (e.target.matches("[delelembtn]")) {
            e.preventDefault();
            view.DeleteElement(e.target.className);
        }

        if (e.target.matches("[changepageBtn]")) {
            e.preventDefault();
            view.ToPage(e.target.id);
        }

        if (e.target.matches("[savepageBtn]")) {
            e.preventDefault();
            handleSavePage();
        }
        if (e.target.matches("[addpageBtn]")) {
            e.preventDefault();
            handleSavePage();
            handleAddPage();
        }
        if (e.target.matches("[delpageBtn]")) {
            e.preventDefault();
            handleDeletePage();
        }

        if (e.target.matches("[filterMyDocBtn]")) {
            e.preventDefault();
            handleFilter();
        }

        if (e.target.matches("[filterAuthorsBtn]")) {
            e.preventDefault();
            handleFilter();
        }

        if (e.target.matches("[editInfoBtn]")) {
            e.preventDefault();
            handleEditInfo();
        }

        if (e.target.matches("[delUserBtn]")) {
            e.preventDefault();
            handleDeleteUser();
        }
    });

    router();
});


async function handleLogin()
{
    await view.login();
    if(localStorage.logged!=0)
    {
        navigateTo("/");
        location.reload();
    } 
}

async function handleSignup()
{
    await view.signup();
    if(localStorage.logged!=0)
    {
        navigateTo("/");
        location.reload();
    } 
}

function logout()
{
    localStorage.user=0;
    localStorage.logged=0;
    navigateTo("/");
    location.reload();
}

async function handleAddDoc()
{
    await view.AddDoc();
    location.reload();
}

async function handleEditDoc()
{
    await view.EditDoc();
    location.reload();
}

async function handleDeleteDoc()
{
    await view.DeleteDoc();
    navigateTo("/docs");
}

async function handleSavePage()
{
    await view.SavePage();
}

async function handleAddPage()
{
    await view.AddPage();
}

async function handleDeletePage()
{
    await view.DeletePage();
}

async function handleFilter()
{
    await view.Filter();
}

async function handleEditInfo()
{
    await view.EditInfo();
}

async function handleDeleteUser()
{
    await view.DeleteUser();
    logout();
}