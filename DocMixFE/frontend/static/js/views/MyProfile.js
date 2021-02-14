import AbstractView from "./AbstractView.js";
import {MyDoc} from "../models/MyDoc.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("My Profile");
        this.entries=new Array();
    }

    async getHtml() 
    {
        var html,i;
        i=0;

        html=`
        <h1>My Profile</h1>
        <br/>
        <div style="display:inline-block; width:100%;">
        <table class="table table-striped" style="width:100%">
            <thead>
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Country</th>
                <th scope="col">Password</th>
                <th scope="col"></th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody id="tinfo">`;

        await fetch("https://localhost:44397/api/User/GetUserFull/"+JSON.parse(localStorage.user).id, {method: "GET"})
            .then(p => p.json().then(data => {

                html+=`
                <tr id="info">
                <td>${data["Name"]}</td>
                <td><input id="country" type="text" value="${data["Country"]}"></td>
                <td><input id="password" type="password" value="${data["Password"]}"></td>
                <td>
                    <button type="submit"  class="btn btn-danger" delUserBtn>Delete</button>
                </td>
                <td>
                    <button type="submit" class="btn btn-success" editInfoBtn>Save</button>
                </td>
                </tr>
                </tbody>
                </table>
                </div>`;

                html+=`
                <div style="display:inline-block; width:70%;">
                <table class="table table-striped" style="width:100%">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Access</th>
                        </tr>
                    </thead>
                    <tbody id="tcontent">`;

                data["MyDocs"].forEach(d => {
                    const doc = new MyDoc(d["ID"], d["Name"], d["Category"], d["Public"]);
                    this.entries.push(doc);

                    html+=`
                        <tr id="${doc.id}">
                        <th scope="row">${++i}</th>
                        <td><a href="/docs/${doc.id}/1" data-link>${doc.name}</a></td>
                        <td>${doc.category}</td>
                        <td>${doc.public? "Public" : "Private" }</td>
                        </tr>`;
                });
            }));

        html+=`</tbody>
        </table>
        </div>

        <div style="display:inline-block; width:25%;">
        <form id="filter-form" style="width:100%">
            <div class="form-group col-md-10">
                <div class="form-group col-md-10">
                <label for="inputName">Name</label>
                <input type="text" class="form-control" id="inputName" placeholder="Name">
                </div>
            </div>
            <div class="form-group col-md-6">
                <label for="inputCategory">Category</label>
                <select id="inputCategory" class="form-control">
                    <option selected value="0">Select Category</option>
                    <option>Note</option>
                    <option>List</option>
                    <option>Novel</option>
                    <option>Picturary</option>
                    <option>Document</option>
                </select>
            </div>
            <div class="form-group col-md-6">
                <label for="inputPublic">Access</label>
                <select id="inputPublic" class="form-control">
                    <option selected value="0">All</option>
                    <option>Public</option>
                    <option>Private</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary" style="width:30%" filterMyDocBtn>Filter</button>
        </form>
        </div>`;

        return html;
    }

    async Filter()
    {
        var i=0;
        const filterForm = document.querySelector('#filter-form');
        const name = filterForm['inputName'].value;
        const category = filterForm['inputCategory'].value;
        const pub = filterForm['inputPublic'].value;

        const table = document.body.querySelector("#tcontent");
        table.innerHTML=``;

        if(name=="" && category=="0" && pub=="0")
        {
            this.entries.forEach(d => {
                table.innerHTML+=`
                    <tr id="${d["id"]}">
                    <th scope="row">${++i}</th>
                    <td><a href="/docs/${d["id"]}/1" data-link>${d["name"]}</a></td>
                    <td>${d["category"]}</td>
                    <td>${d["public"]? "Public" : "Private" }</td>
                    </tr>`;
            });

            return;
        }

        await fetch("https://localhost:44397/api/User/GetUserDocsFiltered/"+JSON.parse(localStorage.user).id, {method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": name, "category": category, "access": pub})
        })
        .then(p => p.json().then(data => {
            data.forEach(d => {
                table.innerHTML+=`
                    <tr id="${d["ID"]}">
                    <th scope="row">${++i}</th>
                    <td><a href="/docs/${d["ID"]}/1" data-link>${d["Name"]}</a></td>
                    <td>${d["Category"]}</td>
                    <td>${d["Public"]? "Public" : "Private" }</td>
                    </tr>`;
            });
        }));
    }

    async EditInfo()
    {
        const row = document.body.querySelector("#info");
        const country = row.querySelector("#country").value;
        const password = row.querySelector("#password").value;

        await fetch("https://localhost:44397/api/User/EditUserInfo/"+JSON.parse(localStorage.user).id, {method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "country": country, "password": password })
        })
        .then(p => {
            if(p.ok)
            {
                alert("Data updated!");
                window.location.reload();
            }
        });
    }

    async DeleteUser()
    {
        await fetch("https://localhost:44397/api/User/"+JSON.parse(localStorage.user).id, {method: "Delete" })
        .then(p => {
            if(p.ok)
            {
                alert("Account deleted!");
            }
        });
    }
}