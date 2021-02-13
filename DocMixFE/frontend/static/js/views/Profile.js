import AbstractView from "./AbstractView.js";
import {Doc} from "../models/Doc.js";

export default class extends AbstractView {
    constructor(params){
        super(params);
        this.profileId = params.id;
        this.setTitle("Profile");
        this.entries=new Array();
    }

    async getHtml() 
    {
        var html,i=0;

        await fetch("https://localhost:44397/api/User/"+this.profileId, {method: "GET"})
            .then(p => p.json().then(d => {
                this.entries=d["MyDocs"];

                html=`
                <h1>${d["Name"]}'s Profile</h1>
                <br/>
                <table class="table table-striped" style="width:100%">
                    <thead>
                        <tr>
                        <th scope="col">Country</th>
                        <th scope="col">Username</th>
                        <th scope="col">Number of Docs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>${d["Country"]}</td>
                        <td>${d["Username"]}</td>
                        <td>${d["MyDocs"].length}</td>
                        </tr>
                    </tbody>
                </table>

                <div style="display:inline-block; width:70%;">
                <table class="table table-striped" style="width:100%">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        </tr>
                    </thead>
                    <tbody id="tcontent">`;
                    
                d["MyDocs"].forEach(doc=>{
                    html+=`
                    <tr>
                    <th scope="row">${++i}</th>
                    <td><a href="/docs/${doc.ID}/1" data-link>${doc.Name}</a></td>
                    <td>${doc.Category}</td>
                    </tr>`;
                })
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

        const table = document.body.querySelector("#tcontent");
        table.innerHTML=``;

        if(name=="" && category=="0")
        {
            this.entries.forEach(d => {
                table.innerHTML+=`
                    <tr>
                    <th scope="row">${++i}</th>
                    <td><a href="/docs/${d["ID"]}/1" data-link>${d["Name"]}</a></td>
                    <td>${d["Category"]}</td>
                    </tr>`;
            });

            return;
        }

        await fetch("https://localhost:44397/api/User/GetUserDocsFiltered/"+this.profileId, {method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": name, "category": category, "access": "Public"})
        })
        .then(p => p.json().then(data => {
            data.forEach(d => {
                table.innerHTML+=`
                    <tr>
                    <th scope="row">${++i}</th>
                    <td><a href="/docs/${d["ID"]}/1" data-link>${d["Name"]}</a></td>
                    <td>${d["Category"]}</td>
                    </tr>`;
            });
        }));
    }
}