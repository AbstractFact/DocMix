import AbstractView from "./AbstractView.js";
import {Doc} from "../models/Doc.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("Viewing Doc");
        this.currDoc=null;
    }

    async getHtml() 
    {
        var html,i;
        
        await fetch("https://localhost:44397/api/Doc/"+this.postId, {method: "GET"})
        .then(p => p.json().then(d => {
                const doc = new Doc(d["ID"], d["Name"], d["Category"], d["Author"], d["Pages"]);
                this.currDoc=doc;
                html=`
                    <h1>Doc: ${doc.name}</h1>
                    <br/>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Author</th>
                            <th scope="col">Pages</th>
                            </tr>
                        </thead>
                        <tbody>`;

                    html+=`
                        <tr>
                        <td>${doc.category}</td>
                        <td>${doc.author.Name}</td>
                        <td>${doc.pages}</td>          
                        </tr>`;

                    html+=`
                        </tbody>
                        </table>
                        <p>
                            Ovde ide sadrzaj dokumenta
                        </p>    
                        <br/>

                        <div style="display:block">
                        <form id="editDoc-form" style="width:50%; float:left;">
                        <div class="form-group col-md-8">
                            <div class="form-group col-md-8">
                            <label for="inputTitle">Name</label>
                            <input type="text" class="form-control" id="inputName" value="${doc.name}">
                            </div>
                            <div class="form-group col-md-3">
                            <label for="inputPages">Pages</label>
                            <input type="number" class="form-control" id="inputPages" value="${doc.pages}">
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="inputCategory">Category</label>
                            <select id="inputCategory" class="form-control">
                                <option selected>${doc.category}</option>
                                <option>Note</option>
                                <option>List</option>
                                <option>Novel</option>
                                <option>Picturary</option>
                                <option>Document</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:20%" editDocBtn>Edit Doc</button>
                        <button type="submit" class="btn btn-danger" style="width:30%; float:right" deleteDocBtn>Delete Doc</button>
                        </form></div>`;    
        }));

        return html;
    }

    async EditDoc()
    {
        const editDocForm = document.querySelector('#editDoc-form');
        const name = editDocForm['inputName'].value;
        const pages = parseInt(editDocForm['inputPages'].value); 
        const category = editDocForm['inputCategory'].value;
      
        const response =  await fetch("https://localhost:44397/api/Doc/"+this.postId, 
        { method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"ID": this.postId, "Name": name, "Category":category, "Author": this.currDoc.author, "Pages": pages})
        });

        if (response.ok) 
        {
            alert("Doc "+name+" edited!");
        }
    }

    async DeleteDoc()
    {
        
        
         const response1 =  await fetch("https://localhost:44397/api/Doc/"+this.postId, { method: "DELETE"});

         const response2 =  await  fetch("https://localhost:44397/api/User/DeleteDoc", { method: "DELETE",
         headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify([ this.currDoc.author.ID, this.postId ])
     });

         if (response1.ok && response2.ok) {
             alert("Doc deleted!");
         }
    }
}
