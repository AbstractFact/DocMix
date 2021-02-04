export class Doc {
    constructor(id, name, category, author, pagenum, pages) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.author = author;
        this.pagenum = pagenum; //broj stranica
        this.pages = new Array(); //niz stranica
        this.pages=pages;
    }
}