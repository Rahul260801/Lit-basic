import { LitElement,html,css } from "lit";
import { customElement } from "lit/decorators.js";
import '@vaadin/text-field';






@customElement("my-todo")



export class Todo extends LitElement {


    static styles =css`
      
    `;
   
    render() {
        return html `
           <vaadin-text-field
        label="Todo"
        placeholder="Placeholder"
        clear-button-visible
      ></vaadin-text-field>
         `;
    }
}

   