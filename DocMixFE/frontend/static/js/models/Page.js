export class Page {
    constructor(number, paragraphs, pictures, elements) {
        this.number = number;   //redni broj stranice
        this.paragraphs = paragraphs;   //broj paragrafa
        this.pictures = pictures;   //broj slika
        this.elements = new Array(); //niz elemenata
        this.elements=elements;
    }
}