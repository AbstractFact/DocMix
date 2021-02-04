import AbstractView from "./AbstractView.js";
import {Doc} from "../models/Doc.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("My Docs");
        this.entries=new Array();
    }

    async getHtml() 
    {
        var html,i;
        i=0;

        html=`
        <h1>My Docs</h1>
        <br/>
        <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                </tr>
            </thead>
            <tbody>`;

        if(localStorage.user!=0)
        {
            await fetch("https://localhost:44397/api/User/GetUserDocs/"+JSON.parse(localStorage.user).id, {method: "GET"})
            .then(p => p.json().then(data => {
                data.forEach(d => {
                    const doc = new Doc(d["ID"], d["Name"], d["Category"], d["Author"], d["PageNum"], d["Pages"]);
                    this.entries.push(doc);

                    html+=`
                        <tr id="${doc.id}">
                        <th scope="row">${++i}</th>
                        <td><a href="/docs/${doc.id}" data-link>${doc.name}</a></td>
                        <td>${doc.category}</td>
                        </tr>`;
                });
            }));
        }

        html+=`</tbody>
        </table>`;

        return html;
    }
}