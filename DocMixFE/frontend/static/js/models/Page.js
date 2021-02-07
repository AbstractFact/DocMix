export class Page {
    constructor(id, documentid, position, elements) {
        this.id = id;
        this.documentid = documentid;
        this.position = position;
        this.elements = new Array(); //niz elemenata
        this.elements = elements;
    }
}