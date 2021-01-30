import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.setTitle("Viewing Doc");
    }

    async getHtml() {
        return `
            <h1>Doc</h1>
            <p>You are viewing post #${this.postId}.</p>
        `;
    }
}
