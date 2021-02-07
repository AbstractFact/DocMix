import AbstractView from "./AbstractView.js";
import {Doc} from "../models/Doc.js";
import { Page } from "../models/Page.js";
import { Paragraph } from "../models/Paragraph.js";
import { Picture } from "../models/Picture.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.currPage=params.pn-1;
        this.setTitle("Viewing Doc");
        //this.currPage=0;
        this.currDoc=null;
        this.creator=false;
        this.pages = new Array();
        this.elid=0;
    }

    async getHtml() 
    {
        var html;
        
        await fetch("https://localhost:44397/api/Doc/"+this.postId, {method: "GET"})
        .then(p => p.json().then(d => {
            const doc = new Doc(d["d"]["ID"], d["d"]["Name"], d["d"]["Category"], d["d"]["Author"], d["d"]["PageNum"]);
            this.pages=d["p"];

            this.currDoc=doc;
            this.elid=this.pages[this.currPage].Elements.length;

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
                    this.pages[this.currPage].Elements.forEach(element => {
                        console.log(element);
                        if(element.Text==null)
                        {
                            html+=`<img src="${element.Link}" alt="Error loading picture"><br/>`;
                        }
                        else
                        {
                            html+=`<p>${element.Text}</p><br/>`;
                        }
                    });

                    html+=`  
                        <br/>
                        </form>`;
                }
                else
                {
                    html+=`<div id="container" style="display:inline-block; width:100%;">
                    <div id="view" style="display:block; width:50%; float:right;">`;

                    this.pages[this.currPage].Elements.forEach(element => {
                        if(element.Text==null)
                        {
                            html+=`<img src="${element.Link}" alt="Error loading picture"><br/>`;
                        }
                        else
                        {
                            html+=`<p>${element.Text}</p><br/>`;
                        }
                    });

                    html+=`
                    </div>
                    <div id="content" style="display:block; width:50%; float:left;">`;

                    this.pages[this.currPage].Elements.forEach(element => {
                        if(element.Text==null)
                        {
                            html+=`<input type="file" id="${element.ID}" value="${element.Link}" style="width:100%"><br/>`;
                        }
                        else
                        {
                            html+=`<textarea id="${element.ID}" style="width:100%">${element.Text}</textarea><br/>`;
                        }
                    });

                    html+=`
                    </div>
                    </div>
                    <div id="buttons" style="display:block; width:100%;">
                    <button type="submit" class="btn btn-primary" style="width:20%" addparBtn>Add paragraph</button>
                    <button type="submit" class="btn btn-primary" style="width:20%" addpicBtn>Add picture</button>
                    <button type="submit" class="btn btn-success" style="width:20%; float:right;" savepageBtn>Save page</button>
                    <button type="submit" class="btn btn-primary" style="width:20%; float:right;" addpageBtn>Add page</button>
                    </div>
                    </form>

                    <div style="display:block">
                    <form id="editDoc-form" style="width:100%; float:left;">
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
                }  
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
    
    ToPage(pagenum)
    {
        window.location.href="/docs/"+this.currDoc.id+"/"+pagenum;
    }

    addElement(type)
    {
        const form = document.querySelector("#content");

        if(type=="par")
        {
            const tarea = document.createElement("textarea");
            tarea.id=++this.elid;
            tarea.style.width="100%";
            form.appendChild(tarea);
        }
        else if(type=="pic")
        {
            const pic = document.createElement("input");
            pic.type="file";
            pic.id=++this.elid;
            pic.style.width="100%";
            form.appendChild(pic);
        }
    }

    async SavePage()
    {
        const form = document.querySelector("#content");
        var elems= new Array();

        for(let z=0; z<form.children.length; z++)
        {
            const child=form.children[z];
            const id= parseInt(child.id);
            const tmp = child.value;

            console.log(child.name);

            if(child.nodeName=="TEXTAREA")
            {
                const text = new Paragraph(id, tmp);
                elems.push(text);
            }
            else if(child.nodeName=="INPUT")
            {
                const img = new Picture(id, tmp);
                elems.push(img);
            }
        };

        await fetch("https://localhost:44397/api/Page/Update/"+this.pages[this.currPage].ID, { method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"id":this.pages[this.currPage].ID, "documentid":this.currDoc.id, "position":this.pages[this.currPage].Position, "elements": elems})
        }).then(res=>{if (res.ok) this.ToPage(this.currPage+1);});
    }

    AddPage()
    {
        this.SavePage();

        let pos;
        if(!this.pages[this.currPage+1])
            pos = Math.trunc(this.pages[this.currPage].Position)+1;
        else
            pos=(this.pages[this.currPage].Position+this.pages[this.currPage+1].Position)/2.0;

        fetch("https://localhost:44397/api/Page", { method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"documentid":this.currDoc.id, "position":pos})
        }).then(response=>{
            if(response.ok)
            {
                response.json().then(data=>
                {
                    this.pages.splice(this.currPage+1, 0, data);
                    this.currPage++;
                    console.log(this.pages);
                    this.ToPage(this.currPage+1);
                })
            }
        });
    }
}
