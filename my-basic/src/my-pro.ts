import { LitElement,html,css } from "lit";
import { property, customElement, state } from 'lit/decorators.js';

@customElement('my-pro')
export class My extends LitElement{
    // @property() count =0;
    @property({ type: Number }) count = 0;
    render(){
        this.count+=3;
        return html`<div>${this.count}</div>`;
    }
}


