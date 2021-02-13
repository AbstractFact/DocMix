import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("DocMix");
    }

    async getHtml() {
        var i=0, html=``;
        html+=`
        <h1>Welcome To DocMix</h1>
        <p>
            This is the place where your creativity flurishes. Palace of knowlwdge and goodwill.
        </p>
        <p>
            <a href="/docs" data-link>View all public docs</a>
        </p>
        <br/>
        <h2>Our Authors</h2>
        <br/>
        <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Country</th>
                <th scope="col">Docs Num</th>
                </tr>
            </thead>
            <tbody>`;

        const res = await fetch("https://localhost:44397/api/User", { method: "GET" });
        if (res.ok) {
            const result = await res.json();
            result.forEach(user => {
                html+=`
                <tr>
                <th scope="row">${++i}</th>
                <td><a href="/docs" data-link>${user.Name}</a></td>
                <td>${user.Country}</td>
                <td>${user.MyDocs.length}</td>
                </tr>`;
            });

            html+=`
                </tbody>
            </table>
            <br/>`;
        }

        return html;
    }
}