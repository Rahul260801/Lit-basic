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
import "@vaadin/grid/vaadin-grid";
import "@vaadin/grid/vaadin-grid-column";

@customElement("user-registration")
export class Registration extends LitElement {
  @state() firstName: string = "";
  @state() lastName: string = "";
  @state() email: string = "";
  @state() password: string = "";
  @state() dob: string = "";
  @state() phone: string = "";
  @state() users: Array<any> = []; // For fetched users

  @state() showAlert: boolean = false;
  @state() errorMsg: string = "";
  @state() notifyTheme: string = "";
  @state() items: any = ["United States", "Canada", "Germany", "India"];
  @state() selectedCountry: string[] = [];

  static styles = css`
  :host {
  display: flex;
  flex-direction: row; /* Align items side by side */
  justify-content: space-between; /* Add space between form and grid */
  gap: 4px; /* Optional: spacing between the form and the grid */
  padding: 20px;
  box-sizing: border-box;
}
    vaadin-form-layout {
      width: 100%;
      max-width: 400px;
      margin: 50px auto;
      border: 2px solid black;
      background-color:#CCA7A2;
      box-shadow: 10px 5px 5px yellow
    }
    vaadin-button {
      width: 100%;
      margin-top: 20px;
      background-color:#4E5283;
      color:yellow;
    
    }
    vaadin-multi-select-combo-box {
      width: 300px;
    }
    vaadin-grid {
      margin: 20px auto;
      width: 100%;
      max-width: 800px;
      box-shadow: 3px 3px red, -1em 0 .4em olive;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.fetchUsers(); // Fetch users when the component loads
  }

  async fetchUsers() {
    try {
      const response = await fetch("http://localhost:3001/register");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      this.users = await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      this.errorMsg = "Error fetching users";
      this.notifyTheme = "error";
      this.showAlert = true;
    }
  }

  async handleSubmit(e: Event) {
    e.preventDefault();

    const userdata = {
      fname: this.firstName,
      lname: this.lastName,
      email: this.email,
      password: this.password,
      dob: this.dob,
      phone: this.phone,
      countries: this.selectedCountry,
    };

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      });

      const data = await response.json();
      if (response.ok) {
        this.notifyTheme = "success";
        this.errorMsg = "Registration successful";
        this.showAlert = true;

        // Clear form fields after successful registration
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.password = "";
        this.dob = "";
        this.phone = "";
        this.selectedCountry = [];

        // Refresh user data
        this.fetchUsers();
      } else {
        this.notifyTheme = "error";
        this.errorMsg = data.error || "Registration failed";
        this.showAlert = true;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      this.notifyTheme = "error";
      this.errorMsg = "Registration failed";
      this.showAlert = true;
    }
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
        theme="${this.notifyTheme}"
        position="top-center"
        duration="3000"
        @opened-changed="${(e: NotificationOpenedChangedEvent) => {
          this.showAlert = e.detail.value;
        }}"
        ${notificationRenderer(this.renderer, [])}
      ></vaadin-notification>

      <vaadin-form-layout>
        <vaadin-text-field
          label="First Name"
          placeholder="Enter your first name"
          .value="${this.firstName}"
          @change="${(e: Event) =>
            (this.firstName = (e.target as HTMLInputElement).value)}"
          required
        ></vaadin-text-field>

        <vaadin-text-field
          label="Last Name"
          placeholder="Enter your last name"
          .value="${this.lastName}"
          @change="${(e: Event) =>
            (this.lastName = (e.target as HTMLInputElement).value)}"
          required
        ></vaadin-text-field>

        <vaadin-text-field
          label="Email"
          placeholder="Enter your email"
          .value="${this.email}"
          @change="${(e: Event) =>
            (this.email = (e.target as HTMLInputElement).value)}"
          required
        ></vaadin-text-field>

        <vaadin-password-field
          label="Password"
          placeholder="Enter your password"
          .value="${this.password}"
          @value-changed="${(e: Event) =>
            (this.password = (e.target as HTMLInputElement).value)}"
          required
        ></vaadin-password-field>

        <vaadin-date-picker
          label="Date of Registration"
          placeholder="Select your date of Registration"
          .value="${this.dob}"
          @value-changed="${(e: Event) =>
            (this.dob = (e.target as HTMLInputElement).value)}"
          required
        ></vaadin-date-picker>

        <vaadin-text-field
          label="Phone Number"
          .value="${this.phone}"
          @input="${(e: Event) =>
            (this.phone = (e.target as HTMLInputElement).value)}"
          required
        ></vaadin-text-field>

        <vaadin-multi-select-combo-box
          label="Countries"
          .items="${this.items}"
          .selectedItems="${this.selectedCountry}"
          @selected-items-changed="${(e: any) =>
            (this.selectedCountry = e.detail.value)}"
        ></vaadin-multi-select-combo-box>

        <vaadin-button @click="${this.handleSubmit}">Register</vaadin-button>
      </vaadin-form-layout>

      <vaadin-grid .items="${this.users}">
        <vaadin-grid-column path="f_name" header="First Name"></vaadin-grid-column>
        <vaadin-grid-column path="l_name" header="Last Name"></vaadin-grid-column>
        <vaadin-grid-column path="email" header="Email"></vaadin-grid-column>
        <vaadin-grid-column path="phone" header="Phone"></vaadin-grid-column>
        <vaadin-grid-column path="dob" header="Date of Registration"></vaadin-grid-column>
        <vaadin-grid-column path="countries" header="Countries"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}
