import { Element } from "../models/Element.js";

export class Picture extends Element{
    constructor(id, link)
    {
        super(id);
        this.link=link;
    }
} 