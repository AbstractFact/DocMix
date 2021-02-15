import AbstractView from "./AbstractView.js";
import {Doc} from "../models/Doc.js";
import { Paragraph } from "../models/Paragraph.js";
import { Picture } from "../models/Picture.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.currPage=params.pn-1;
        this.setTitle("Viewing Doc");
        this.currDoc=null;
        this.creator=false;
        this.pages = new Array();
        this.elid=0;
        this.pictures=new Array();
    }


    async getHtml() 
    {
        var html;
        
        await fetch("https://localhost:44397/api/Doc/"+this.postId, {method: "GET"})
        .then(p => p.json().then(d => {
            const doc = new Doc(d["d"]["ID"], d["d"]["Name"], d["d"]["Category"], d["d"]["Author"], d["d"]["PageNum"], d["d"]["Public"]);
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
                    <tbody>
                    <tr>
                    <td>${doc.category}</td>
                    <td>${doc.author.Name}</td>
                    <td>${doc.pagenum}</td>          
                    </tr></tbody>
                    </table>`;     

                if(this.creator)
                {
                    html+=`<div style="display:block">
                    <form id="editDoc-form" style="width:100%; float:left;">
                    <div class="form-group col-md-8">
                        <div class="form-group col-md-8">
                        <label for="inputTitle">Name</label>
                        <input type="text" class="form-control" id="inputName" value="${doc.name}">
                        </div>
                        <label for="inputCategory">Category</label>
                        <select id="inputCategory" class="form-control" style="width:30%;">
                            <option selected>${doc.category}</option>
                            <option>Note</option>
                            <option>List</option>
                            <option>Novel</option>
                            <option>Picturary</option>
                            <option>Document</option>
                        </select>
                        <br/>`;
                        if(doc.public)
                            html+=`<input type="checkbox" id="inputPublic" name="inputPublic" checked>`;
                        else
                            html+=`<input type="checkbox" id="inputPublic" name="inputPublic">`;
                    html+=`<label for="inputPublic">Public</label>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:20%" editDocBtn>Edit Doc</button>
                    <button type="submit" class="btn btn-danger" style="width:20%;" deleteDocBtn>Delete Doc</button>
                    </form></div>
                    <form id="viewDoc-form" style="width:100%; float:left;">`;
                }

                if(!this.creator)
                {
                    html+=`<form id="viewDoc-form" style="width:100%;">
                    <div style="display:flex; width:100%; flex-direction:column; align-items: center;">`;

                    this.pages[this.currPage].Elements.forEach(element => {
                        if(element.Text==null)
                        {
                            html+=`<img src="${element.Content}" align=centre alt="Error loading picture" style="width:100%"><br/>`;
                        }
                        else
                        {
                            html+=`<p align=centre>${element.Text}</p><br/>`;
                        }
                    });

                    html+=`
                    </div>
                    <div id="buttons" style="display:block; width:100%;"> 
                        <div style="display: flex; justify-content: center;">
                        <button type="submit" class="btn btn-primary" style="width:10%;" id="${this.currPage}" changepageBtn><-</button>
                        <input type="number" id="pgnum" value="${this.currPage+1}" min="1" max="${doc.pagenum}" style="margin:15px;" gotopage>
                        <button type="submit" class="btn btn-primary" style="width:10%;" id="${this.currPage+2}" changepageBtn>-></button>
                        </div>
                    </div>
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
                            html+=`<img src="${element.Content}" alt="Error loading picture" style="width:100%"><br/>`;
                        }
                        else
                        {
                            html+=`<p>${element.Text}</p><br/>`;
                        }
                    });

                    html+=`
                    </div>
                    <div id="content" style="display:block; width:50%; float:left;">`;
                    
                    // this.pages[this.currPage].Elements.forEach(element => {
                    //     if(element.Text==null)
                    //     {
                    //         html+=`<input type="file" id="${element.ID}" class="${element.ID}" accept=".jpg, .jpeg, .png" style="width:90%">
                    //         <button type="submit" class="${element.ID} btn btn-danger" style="width:7%" delelemBtn>x</button>
                    //         <br/>`;
                    //     }
                    //     else
                    //     {
                    //         html+=`<textarea id="${element.ID}" class="${element.ID}" style="width:90%">${element.Text}</textarea>
                    //         <button type="submit" class="${element.ID} btn btn-danger" style="width:7%" delelemBtn>x</button>
                    //         <br/>`;
                    //     }
                    // });

                    html+=`
                    </div>
                    </div>
                    <div id="buttons" style="display:block; width:100%;">
                        <button type="submit" class="btn btn-primary" style="width:15%" addparBtn>Add paragraph</button>
                        <button type="submit" class="btn btn-primary" style="width:10%" addpicBtn>Add picture</button>
                        <button type="submit" class="btn btn-success" style="width:10%; float:right;" savepageBtn>Save page</button>
                        <button type="submit" class="btn btn-primary" style="width:10%; float:right;" addpageBtn>Add page</button>`;
                        if(this.currDoc.pagenum>1) 
                            html+=`<button type="submit" class="btn btn-danger" style="width:10%; float:right;" delpageBtn>Delete page</button>`;
                        html+=`<div style="display: flex; justify-content: center;">
                            <button type="submit" class="btn btn-primary" style="width:10%;" id="${this.currPage}" changepageBtn><-</button>
                            <input type="number" id="pgnum" value="${this.currPage+1}" min="1" max="${doc.pagenum}" style="margin:15px;" gotopage>
                            <button type="submit" class="btn btn-primary" style="width:10%;" id="${this.currPage+2}" changepageBtn>-></button>
                        </div>
                    </div>
                    </form>`;  
                }  
        }));

        return html;
    }

    async EditDoc()
    {
        const editDocForm = document.querySelector('#editDoc-form');
        const name = editDocForm['inputName'].value;
        const category = editDocForm['inputCategory'].value;
        const pub = editDocForm['inputPublic'].checked;
      
        const response =  await fetch("https://localhost:44397/api/Doc/"+this.postId, 
        { method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"ID": this.postId, "Name": name, "Category":category, "Author": this.currDoc.author, "PageNum": this.currDoc.pagenum, "Public":pub})
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
        if(pagenum>0 && pagenum<=this.currDoc.pagenum)
            window.location.href="/docs/"+this.currDoc.id+"/"+pagenum;
        else
            alert("Chosen page number is out of bounds of this document")
    }

    addElement(type)
    {
        const form = document.querySelector("#content");

        if(type=="par")
        {
            const tarea = document.createElement("textarea");
            tarea.id=++this.elid;
            tarea.className=tarea.id;
            tarea.style.width="90%";
            form.appendChild(tarea);

            const delem = document.createElement("button");
            delem.type="submit";
            delem.className=tarea.id+" btn btn-danger";
            delem.style.width="7%";
            delem.setAttribute("delelembtn","");
            delem.innerHTML="x";
            form.appendChild(delem);
        }
        else if(type=="pic")
        {
            const pic = document.createElement("input");
            pic.type="file";
            pic.id=++this.elid;
            pic.className=pic.id;
            pic.style.width="90%";
            pic.accept=".jpg, .jpeg, .png";
            form.appendChild(pic);

            pic.addEventListener('change', event => this.readpic(event));

            const delem = document.createElement("button");
            delem.type="submit";
            delem.className=pic.id+" btn btn-danger";
            delem.style.width="7%";
            delem.setAttribute("delelembtn","");
            delem.innerHTML="x";
            form.appendChild(delem);
        }
    }

    DeleteElement(clas)
    {
        const cls= clas.split(" ")[0];
        const form = document.querySelector("#content");

        const elems = form.getElementsByClassName(cls);

        form.removeChild(elems[1]);
        form.removeChild(elems[0]);
    }

    async SavePage()
    {
        const form = document.querySelector("#content");
        var elems= new Array();

        for(let z=0; z<form.children.length; z++)
        {
            const child=form.children[z];
            const id= parseInt(child.id);

            if(child.nodeName=="TEXTAREA")
            {
                const text = new Paragraph(id, child.value);
                elems.push(text);
            }
            else if(child.nodeName=="INPUT")
            {
                const picture = this.pictures.find(p=>p.id===child.id);
                if(picture)
                    elems.push(picture);
                else
                {
                    const el = this.pages[this.currPage].Elements.find(el=>el.ID==id);
                    if(el)
                        elems.push(el);
                }
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
                    this.currDoc.pagenum++;
                    this.ToPage(this.currPage+1);
                })
            }
        });
    }

    async DeletePage()
    {
        fetch("https://localhost:44397/api/Page/"+this.pages[this.currPage].ID, { method: "DELETE" }).then(response=>{
            if(response.ok)
            {
                this.pages.splice(this.currPage, 1);
                if(this.currPage!=0)
                    this.ToPage(this.currPage);
                else
                    this.ToPage(this.currPage+1);
            }   
        });
    }

    readpic(event)
    {      
        const id = event.target.id;

        var reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const pic= new Picture(id, event.target.result);
            this.pictures.push(pic);
            const lab = document.getElementsByClassName(id+" label");
            if(lab[0])
                lab[0].innerText="Modified: ";
        });

        reader.readAsDataURL(event.target.files[0]);
    }

    getCurrentContent()
    {
        const form = document.querySelector("#content");
        this.pages[this.currPage].Elements.forEach(element => {
            if(element.Text==null)
            {
                const pic = document.createElement("input");
                pic.type="file";
                pic.id=element.ID;
                pic.className=element.ID;
                pic.style.width="80%";
                pic.accept=".jpg, .jpeg, .png";
                form.appendChild(pic);

                pic.addEventListener('change', event => this.readpic(event));

                const label=document.createElement("label");
                label.innerText="Existing: ";
                label.className=element.ID+" label";
                label.style="float:left;";
                form.appendChild(label);

                const delem = document.createElement("button");
                delem.type="submit";
                delem.className=pic.id+" btn btn-danger";
                delem.style.width="7%";
                delem.setAttribute("delelembtn","");
                delem.innerHTML="x";
                form.appendChild(delem);
            }
            else
            {
                const tarea = document.createElement("textarea");
                tarea.id=element.ID;
                tarea.className=element.ID;
                tarea.style.width="90%";
                tarea.value=element.Text;
                form.appendChild(tarea);

                const delem = document.createElement("button");
                delem.type="submit";
                delem.className=tarea.id+" btn btn-danger";
                delem.style.width="7%";
                delem.setAttribute("delelembtn","");
                delem.innerHTML="x";
                form.appendChild(delem);
            }
        });
    }
}
