import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.entries= new Array();
        this.setTitle("DocMix");
    }

    async getHtml() {
        var i=0, html=``;
        html+=`
        <h1>Welcome To DocMix</h1>
        <p>
            This is the place where your creativity flurishes. The palace of knowlwdge and goodwill.
        </p>
        <p>
            <a href="/docs" data-link>View all public docs</a>
        </p>
        <br/>
        <h2>Our Authors</h2>
        <br/>

        <div style="display:inline-block; width:100%;">
        <form id="filter-form" style="width:100%">
            <div style="display:inline-block; width:38%">
                <div class="form-group col-md-10">
                <label for="inputName">Author: </label>
                <input type="text" style="width:70%" class="form-control" id="inputName" placeholder="Author">
                </div>
            </div>
            <div style="display:inline-block; width:38%">
                <label for="inputCountry">Country: </label>
                <input type="text" style="width:70%" class="form-control" id="inputCountry" placeholder="Country">
            </div>
            <button type="submit" class="btn btn-primary" style="width:15%; float:right;" filterAuthorsBtn>Filter</button>
        </form>
        </div>

        <br/><br/>

        <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Country</th>
                </tr>
            </thead>
            <tbody id="tcontent">`;

        const res = await fetch("https://localhost:44397/api/User", { method: "GET" });
        if (res.ok) {
            const result = await res.json();
            this.entries = result;
            result.forEach(user => {
                html+=`
                <tr>
                <th scope="row">${++i}</th>
                <td><a href="/profile/${user.ID}" data-link>${user.Name}</a></td>
                <td>${user.Country}</td>
                </tr>`;
            });

            html+=`
                </tbody>
            </table>
            <br/>`;
        }

        return html;
    }

    async Filter()
    {
        var i=0;
        const filterForm = document.querySelector('#filter-form');
        const author = filterForm['inputName'].value;
        const country = filterForm['inputCountry'].value;

        const table = document.body.querySelector("#tcontent");
        table.innerHTML=``;

        if(author=="" && country=="")
        {
            this.entries.forEach(d => {
                table.innerHTML+=`
                    <tr>
                    <th scope="row">${++i}</th>
                    <td><a href="/profile/${d["ID"]}" data-link>${d["Name"]}</a></td>
                    <td>${d["Country"]}</td>
                    </tr>`;
            });

            return;
        }

        await fetch("https://localhost:44397/api/User/GetUsersFiltered", {method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": author, "country": country })
        })
        .then(p => p.json().then(data => {
            data.forEach(d => {
                table.innerHTML+=`
                    <tr>
                    <th scope="row">${++i}</th>
                    <td><a href="/profile/${d["ID"]}" data-link>${d["Name"]}</a></td>
                    <td>${d["Country"]}</td>
                    </tr>`;
            });
        }));
    }
}