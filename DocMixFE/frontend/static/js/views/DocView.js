import AbstractView from "./AbstractView.js";
import {Doc} from "../models/Doc.js";
import { Page } from "../models/Page.js";
import { Paragraph } from "../models/Paragraph.js";
import { Picture } from "../models/Picture.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("Viewing Doc");
        this.currPage=0;
        this.currDoc=null;
        this.creator=false;
    }

    async getHtml() 
    {
        var html,i;
        
        await fetch("https://localhost:44397/api/Doc/"+this.postId, {method: "GET"})
        .then(p => p.json().then(d => {
            const doc = new Doc(d["ID"], d["Name"], d["Category"], d["Author"], d["PageNum"], d["Pages"]);
            this.currDoc=doc;

            if(localStorage.user!=0 && this.currDoc.author.ID==JSON.parse(localStorage.user).id)
                this.creator=true;
            else
                this.creator=false;

            html=`
                <h1>Doc: ${doc.name}</h1>
                <br/>
                <table class="table table-striped">
                    <thead>
                        <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Author</th>
                        <th scope="col">Page Num</th>
                        </tr>
                    </thead>
                    <tbody>`;

                html+=`
                    <tr>
                    <td>${doc.category}</td>
                    <td>${doc.author.Name}</td>
                    <td>${doc.pagenum}</td>          
                    </tr>`;

                html+=`
                    </tbody>
                    </table>
                    <form id="viewDoc-form" style="width:100%; float:left;">`;

                if(!this.creator)
                {
                    //this.currDoc.content.forEach(element => {
                        
                    //});
                    html+=`
                        <p>
                            Ovde ide sadrzaj dokumenta
                        </p>    
                        <br/>
                        </form>`;
                }
                else
                    html+=`
                    <div id="content" style="display:block;"></div>
                    <button type="submit" class="btn btn-primary" style="width:20%" addparBtn>Add paragraph</button>
                    <button type="submit" class="btn btn-primary" style="width:20%" addpicBtn>Add picture</button>
                    <button type="submit" class="btn btn-success" style="width:20%; float:right;" savepageBtn>Save page</button>
                    <button type="submit" class="btn btn-primary" style="width:20%; float:right;" addpageBtn>Add page</button>
                    </form>

                    <div style="display:block">
                    <form id="editDoc-form" style="width:50%; float:left;">
                    <div class="form-group col-md-8">
                        <div class="form-group col-md-8">
                        <label for="inputTitle">Name</label>
                        <input type="text" class="form-control" id="inputName" value="${doc.name}">
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
        const category = editDocForm['inputCategory'].value;
      
        const response =  await fetch("https://localhost:44397/api/Doc/"+this.postId, 
        { method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"ID": this.postId, "Name": name, "Category":category, "Author": this.currDoc.author, "PageNum": this.currDoc.pagenum})
        });

        if (response.ok) 
        {
            alert("Doc "+name+" edited!");
        }
    }

    async DeleteDoc()
    {
        const response1 =  await fetch("https://localhost:44397/api/Doc/"+this.postId, { method: "DELETE"});

        const response2 =  await fetch("https://localhost:44397/api/User/DeleteDoc", { method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify([ this.currDoc.author.ID, this.postId ])
     });

        if (response1.ok && response2.ok) {
            alert("Doc deleted!");
        }
    }

    addElement(type)
    {
        const form = document.querySelector("#content");

        if(type=="par")
        {
            const tarea = document.createElement("textarea");
            tarea.id=++this.currDoc.pages[this.currPage].ParagraphsNum;
            form.appendChild(tarea);
        }
        else if(type=="pic")
        {
            const pic = document.createElement("input");
            pic.type="file";
            pic.id=++this.currDoc.pages[this.currPage].PicturesNum+1;
            form.appendChild(pic);
        }
    }

    async SavePage()
    {
        const form = document.querySelector("#content");
        var elems= new Array();
        let i=0,j=0;

        for(let z=0; z<form.children.length;z++)
        {
            const child=form.children[z];
            const id= parseInt(child.id);
            const tmp = child.value;

            if(child.nodeName=="TEXTAREA")
            {
                const text = new Paragraph(id, tmp);
                elems.push(text);
                i++;
            }
            else if(child.nodeName=="INPUT")
            {
                const img = new Picture(id, tmp);
                elems.push(img);
                j++;
            }
        };
        
        let page = new Page(this.currPage, i ,j, elems);

        await fetch("https://localhost:44397/api/Doc/UpdatePage/"+this.postId+"/"+this.currPage, { method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(page)
        });
    }
}
