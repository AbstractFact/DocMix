import { Element } from "../models/Element.js";

export class Paragraph extends Element{
    constructor(id, text)
    {
        super(id);
        this.text=text;
    }
} 