import AbstractView from "./AbstractView.js";
import {Doc} from "../models/Doc.js";

export default class extends AbstractView {
    constructor(params) 
    {
        super(params);
        this.entries= new Array();
        this.setTitle("Public Docs");
    }

    async getHtml() 
    {
        var html,i=0;

        html=`
        <h1>Public Docs</h1>
        <br/>`;

        if(localStorage.logged!=0)
            html+=`
            <form id="adddoc-form" style="width:100%">
            <div id="container1">
                <div>
                    <label for="inputName">Name:</label>
                    <input type="text" style="width:80%" class="form-control" id="inputName" placeholder="Name">
                </div>
                <div style="width:30%">
                    <label for="inputCategory">Category:</label>
                    <select style="width:80%" id="inputCategory" class="form-control">
                        <option selected>Select Category</option>
                        <option>Note</option>
                        <option>List</option>
                        <option>Novel</option>
                        <option>Picturary</option>
                        <option>Document</option>
                    </select>
                </div>
                <div>
                    <input type="checkbox" id="inputPublic" name="inputPublic" checked>
                    <label for="inputPublic">Public</label>
                </div>
                <button type="submit" class="btn btn-primary" style="width:12%" addDocBtn>Add Doc</button>
            </div>
            </form>
            <br/>`;

        html+=`<div style="display:inline-block; width:70%;">
        <table class="table table-striped" style="width:100%">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Author</th>
                <th scope="col">Page Num</th>
                </tr>
            </thead>
            <tbody id="tcontent">`;

        await fetch("https://localhost:44397/api/Doc", {method: "GET"})
        .then(p => p.json().then(data => {

            data.forEach(d => {
                const doc = new Doc(d["ID"], d["Name"], d["Category"], d["Author"]["Name"], d["PageNum"]);
                this.entries.push(doc);
                
                html+=`
                    <tr>
                    <th scope="row">${++i}</th>
                    <td><a href="/docs/${doc.id}/1" data-link>${doc.name}</a></td>
                    <td>${doc.category}</td>
                    <td>${doc.author}</td>
                    <td>${doc.pagenum}</td>
                    </tr>`;
            });
        }));

        html+=`
            </tbody>
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
        </div>
        <br/>`;

        return html;
    }

    async AddDoc()
    {
        const addDocForm = document.querySelector('#adddoc-form');
        const name = addDocForm['inputName'].value;
        const category = addDocForm['inputCategory'].value;
        const pub = addDocForm['inputPublic'].checked;

        const response =  await fetch("https://localhost:44397/api/Doc", { method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": name, "category": category, "author": JSON.parse(localStorage.user), "pagenum": 1, "public": pub})
        });

        if (response.ok) {
            addDocForm.reset();
            alert("Doc "+name+" added to database!");
        }   
    }

    async Filter()
    {
        var i=0;
        const filterForm = document.querySelector('#filter-form');
        const name = filterForm['inputName'].value;
        const category = filterForm['inputCategory'].value;
        //const pnum1 = filterForm['inputPageNum1'].value;
        //const pnum2 = filterForm['inputPageNum2'].value;

        const table = document.body.querySelector("#tcontent");
        table.innerHTML=``;

        if(name=="" && category=="0")
        {
            this.entries.forEach(d => {
                table.innerHTML+=`
                    <tr>
                    <th scope="row">${++i}</th>
                    <td><a href="/docs/${d["id"]}/1" data-link>${d["name"]}</a></td>
                    <td>${d["category"]}</td>
                    <td>${d["author"]}</td>
                    <td>${d["pagenum"]}</td>
                    </tr>`;
            });

            return;
        }

        await fetch("https://localhost:44397/api/Doc/GetDocsFiltered", {method: "POST",
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
                    <td>${d["Author"]["Name"]}</td>
                    <td>${d["PageNum"]}</td>
                    </tr>`;
            });
        }));
    }
}
