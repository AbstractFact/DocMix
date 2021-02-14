import { Element } from "../models/Element.js";

export class Picture extends Element{
    constructor(id, content)
    {
        super(id);
        this.content=content;
    }
} 