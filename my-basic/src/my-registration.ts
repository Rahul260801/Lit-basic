import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@vaadin/button";
import "@vaadin/password-field";
import "@vaadin/text-field";
import "@vaadin/form-layout";
import "@vaadin/date-picker";
import "@vaadin/notification";
import type { NotificationLitRenderer } from "@vaadin/notification/lit.js";
import { notificationRenderer } from "@vaadin/notification/lit.js";
import type { NotificationOpenedChangedEvent } from "@vaadin/notification";
import "@vaadin/multi-select-combo-box";

@customElement("user-registration") /// Registering the custom element with 'user-registration' tag
export class Registration extends LitElement {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  password: string = "";
  dob: any = "";
  phone: string = "";
  @state() showAlert: boolean = false;
  errorMsg: string = "";

  @state()
  private items: any = [
    { id: "1", name: "United States" },
    { id: "2", name: "Canada" },
    { id: "3", name: "Germany" },
    { id: "4", name: "India" },
  ];

  @state() selectCountry: string[] = [];

  static styles = css`
    vaadin-form-layout {
      width: 100%;
      max-width: 400px;
      margin: 50px auto;
      border: 2px solid black;
    }
    vaadin-button {
      width: 100%;
      margin-top: 20px;
    }
    vaadin-multi-select-combo-box {
      width: 300px;
    }
  `;

  handleSubmit(e: Event) {
    e.preventDefault();
    // Basic validation for empty fields
    // console.log("this.name", this.firstName);
    // console.log("this.name", this.lastName);

    // console.log("this.email", this.email);
    // console.log("this.password", this.password);
    // console.log("this.dob", this.dob);
    // console.log("this.phone", this.phone);
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.password ||
      !this.dob ||
      !this.phone ||
      this.selectCountry.length === 0
    ) {
      this.showAlert = true;
      this.errorMsg = `Please enter your ${
        !this.firstName
          ? "firstName"
          : !this.lastName
          ? "lastName"
          : !this.email
          ? "email"
          : !this.password
          ? "password"
          : !this.dob
          ? "dob"
          : !this.phone
          ? "phone"
          : this.selectCountry.length === 0
          ? "country"
          : ""
      }`;
      //   alert("All fields are required!");
      return;
    }

    const userdata = {
      name: `${this.firstName} ${this.lastName}`,
      email: this.email,
      pass: this.password,
      dob: this.dob,
      phone: this.phone,
      countries: this.selectCountry,
    };

    localStorage.setItem("userRegistration", JSON.stringify(userdata));

    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.dob = "";
    this.phone = "";
    this.selectCountry = [];
    alert("Registration successful!");
    console.log(localStorage.getItem("userRegistration"));
  }

  renderer: NotificationLitRenderer = () => html`
    <vaadin-horizontal-layout theme="spacing" style="align-items: center;">
      <div>${this.errorMsg}</div>
    </vaadin-horizontal-layout>
  `;

  render() {
    return html`
      <vaadin-notification
        ?opened="${this.showAlert}"
        theme="error"
        position="top-center"
        duration="2000"
        @opened-changed="${(e: NotificationOpenedChangedEvent) => {
          this.showAlert = e.detail.value;
        }}"
        ${notificationRenderer(this.renderer, [])}
      ></vaadin-notification>
      <vaadin-form-layout>
        <vaadin-text-field
          label="First Name"
          placeholder="Enter your first name"
          required
          @change="${(e: Event) => {
            this.firstName = (e.target as HTMLInputElement).value;
          }}"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Last Name"
          placeholder="Enter your last name"
          @change="${(e: Event) => {
            this.lastName = (e.target as HTMLInputElement).value;
          }}"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Email"
          placeholder="Enter Email"
          @change="${(e: Event) =>
            (this.email = (e.target as HTMLInputElement).value)}"
        ></vaadin-text-field>

        <vaadin-password-field
          label="Password"
          placeholder="Enter your Password"
          @value-changed="${(e: Event) =>
            (this.password = (e.target as HTMLInputElement).value)}"
          required
        ></vaadin-password-field>

        <vaadin-multi-select-combo-box
          label="Countries"
          item-label-path="name"
          item-id-path="id"
          .items="${this.items}"
          .value="${this.selectCountry}"
          @selected-items-changed="${(e: any) => {
            this.selectCountry = e.detail.value;
          }}"
        ></vaadin-multi-select-combo-box>

        <vaadin-date-picker
          label="Date"
          placeholder="Select the Date"
          @value-changed="${(e: Event) =>
            (this.dob = (e.target as HTMLInputElement).value)}"
          clear-button-visible
        ></vaadin-date-picker>

        <vaadin-text-field
          label="Phone Number"
          .value="${this.phone}"
          @input="${(e: Event) =>
            (this.phone = (e.target as HTMLInputElement).value)}"
          required
          type="tel"
        ></vaadin-text-field>

        <vaadin-button @click="${this.handleSubmit}">Register</vaadin-button>
      </vaadin-form-layout>
    `;
  }
}
