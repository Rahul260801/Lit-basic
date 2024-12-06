import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@vaadin/button";
import "@vaadin/horizontal-layout";

@customElement("my-file")
export class MyFile extends LitElement {
  message = "hello from my-file";

  static styles = css`
    :host {
      background-image: url("https://images.pexels.com/photos/26383088/pexels-photo-26383088/free-photo-of-view-of-the-mexico-city-skyline-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
      background-position: center;
      background-size: cover;
      height: 100%;
      width: 100%;
      border: 1px solid yellow;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    vaadin-button {
      margin-right: 40px;
    }
  `;
  @state()
  private counter = 0;

  render() {
    return html`
      <p>${this.message}</p>
      <vaadin-horizontal-layout theme="spacing" style="align-items: baseline">
        <vaadin-button @click="${() => this.counter++}">Button</vaadin-button>
        <p>Clicked ${this.counter} times</p>
      </vaadin-horizontal-layout>
    `;
  }
}
