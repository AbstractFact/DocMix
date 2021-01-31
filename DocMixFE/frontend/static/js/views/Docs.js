import AbstractView from "./AbstractView.js";
import {Doc} from "../models/Doc.js";

export default class extends AbstractView {
    constructor(params) 
    {
        super(params);
        this.setTitle("All Docs");
    }

    async getHtml() 
    {
        var html,i=0;

        html=`
        <h1>All Docs</h1>
        <br/>
        <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Author</th>
                <th scope="col">Pages</th>
                </tr>
            </thead>
            <tbody>`;

        await fetch("https://localhost:44397/api/Doc", {method: "GET"})
        .then(p => p.json().then(data => {

            data.forEach(d => {
                const doc = new Doc(d["ID"], d["Name"], d["Category"], d["Author"]["Name"], d["Pages"]);
                html+=`
                    <tr>
                    <th scope="row">${++i}</th>
                    <td><a href="/docs/${doc.id}" data-link>${doc.name}</a></td>
                    <td>${doc.category}</td>
                    <td>${doc.author}</td>
                    <td>${doc.pages}</td>
                    </tr>`;
            });
        }));

        html+=`
            </tbody>
            </table>

            <br/>`;

        if(localStorage.logged!=0)
            html+=
            `<form id="adddoc-form" style="width:50%">
            <div class="form-group col-md-10">
                <div class="form-group col-md-10">
                <label for="inputName">Name</label>
                <input type="text" class="form-control" id="inputName" placeholder="Name">
                </div>
            </div>
            <div class="form-group col-md-6">
                <label for="inputCategory">Category</label>
                <select id="inputCategory" class="form-control">
                    <option selected>Select Category</option>
                    <option>Note</option>
                    <option>List</option>
                    <option>Novel</option>
                    <option>Picturary</option>
                    <option>Document</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary" style="width:20%" addDocBtn>Add Doc</button>
            </form>`;

        return html;
    }

    async AddDoc()
    {
        const addDocForm = document.querySelector('#adddoc-form');
        const name = addDocForm['inputName'].value;
        const category = addDocForm['inputCategory'].value;

        const response =  await  fetch("https://localhost:44397/api/Doc", { method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": name, "category": category, "author": JSON.parse(localStorage.user), "pages": 0})
        });

        if (response.ok) {
            addDocForm.reset();
            alert("Doc "+name+" added to database!");
        }   
    }
}

