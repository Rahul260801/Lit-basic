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
import { columnBodyRenderer } from "@vaadin/grid/lit.js";
import type { GridColumnBodyLitRenderer } from "@vaadin/grid/lit.js";
import "@vaadin/icon";
import "@vaadin/icons";
import gsap from "gsap";
import "@vaadin/dialog";
import { dialogHeaderRenderer, dialogRenderer } from "@vaadin/dialog/lit.js";
import "@vaadin/vertical-layout";
import "@vaadin/email-field";

@customElement("user-registration")
export class Registration extends LitElement {
  @state() firstName: string = "";
  @state() lastName: string = "";
  @state() email: string = "";
  @state() password: string = "";
  @state() dob: string = "";
  @state() phone: string = "";
  @state() users: Array<any> = []; // Keeps the list of registered users fetched from the server.
  @state() dialogUserDetails: any = {}; // Single user object, assuming you want to hold one user

  @state() showAlert: boolean = false;
  @state() errorMsg: string = "";
  @state() notifyTheme: string = "";
  @state() items: any = ["United States", "Canada", "Germany", "India"];
  @state() selectedCountry: string[] = [];

  @state() dialogOpened: boolean = false;
  @state() editBtnClicked: boolean = false;
  @state() editedId : any;
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
      background-color: #cca7a2;
      box-shadow: 10px 5px 5px yellow;
    }
    vaadin-button {
      /* width: 100%; */
      /* margin-top: 20px; */
      background-color: #4e5283;
      color: yellow;
    }
    vaadin-multi-select-combo-box {
      width: 300px;
    }
    vaadin-grid {
      margin: 20px auto;
      width: 100%;
      max-width: 1200px;
      box-shadow: inset 0 -3em 3em rgb(0 200 0 / 30%), 0 0 0 2px white,
        0.3em 0.3em 1em rgb(200 0 0 / 60%);
    }
    .edit-btn {
      width: 2px;
      margin: 0;
    }
    .edit-btn:hover {
      background-color: yellow;
      cursor: pointer;
    }
  `;

  connectedCallback() {
    super.connectedCallback(); //this method is called when the component is inserted into the DOM
    this.fetchUsers(); // Fetch users when the component loads and to fetch the existing users and initializes the custom cursor
    this.initializeCursor();
  }

  initializeCursor() {
    const cursor = document.getElementById("cursor")!; // Ensure cursor exists in the DOM
    const main = document.querySelector("body"); // Optionally you can change this selector for more specific elements.

    main!.addEventListener("mousemove", (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
    });
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

  async handleUpdate(e: Event) {
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
debugger
    console.log(userdata)
    try {
      const response = await fetch(
        `http://localhost:3001/register/${this.editedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userdata),
        }
      );

      const data = await response.json();
      if (response.ok) {
        this.notifyTheme = "success";
        this.errorMsg = "User updated successfully";
        this.showAlert = true;

        // Clear the form fields after successful update
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.password = "";
        this.dob = "";
        this.phone = "";
        this.selectedCountry = [];

        this.editBtnClicked = false;
        // Refresh user data
        this.fetchUsers();
      } else {
        this.notifyTheme = "error";
        this.errorMsg = data.error || "Update failed";
        this.showAlert = true;
      }
    } catch (error) {
      console.error("Error during update:", error);
      this.notifyTheme = "error";
      this.errorMsg = "Update failed";
      this.showAlert = true;
    }
  }

  editHandler = (item: any) => {
    this.firstName = item.f_name;
    this.lastName = item.l_name;
    this.email = item.email;
    this.password = item.password;
    const dob = item.dob;
    this.phone = item.phone;
    this.selectedCountry = item.countries;
    this.dob = dob.split("T")[0];
    this.editedId = item.id;
    this.editBtnClicked = true;
    // Store the selected user data for later updating
  };

  viewHandler = (item: any) => {
    console.log(item);
    this.dialogUserDetails = item;
    this.dialogOpened = true;
  };

  deleteHandler = async (item: any) => {
    console.log(item);
    const userId = item.id; // Assuming each user has a unique id

    try {
      // Send DELETE request to the backend API
      const response = await fetch(`http://localhost:3001/register/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted user from the users array
        this.users = this.users.filter((user: any) => user.id !== userId);

        this.notifyTheme = "success";
        this.errorMsg = "User deleted successfully";
        this.showAlert = true;
      } else {
        this.notifyTheme = "error";
        this.errorMsg = "Failed to delete user";
        this.showAlert = true;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      this.notifyTheme = "error";
      this.errorMsg = "Error deleting user";
      this.showAlert = true;
    }
  };

  closeIconHandler = () => {
    this.dialogOpened = false;
    this.requestUpdate();
  };

  private manageRenderer: GridColumnBodyLitRenderer<any> = (item: any) => html`
    <vaadin-button class="edit-btn" @click="${() => this.editHandler(item)}">
      <vaadin-icon icon="vaadin:pencil" style="color: black"></vaadin-icon>
    </vaadin-button>
    <vaadin-button @click="${() => this.viewHandler(item)}">
      <vaadin-icon icon="vaadin:eye" style="color: black"></vaadin-icon>
    </vaadin-button>
    <vaadin-button @click="${() => this.deleteHandler(item)}">
      <vaadin-icon icon="vaadin:trash" style="color: black"></vaadin-icon>
    </vaadin-button>
  `;

  renderer: NotificationLitRenderer = () => html`
    <vaadin-horizontal-layout theme="spacing" style="align-items: center;">
      <div>${this.errorMsg}</div>
    </vaadin-horizontal-layout>
  `;

  renderDialog = (item: any) => html`
    <vaadin-vertical-layout
      theme="spacing"
      style="width: 300px; max-width: 100%; align-items: stretch;"
    >
      <vaadin-vertical-layout style="align-items: stretch;">
        <vaadin-text-field
          label="Name"
          value="${`${item.f_name} ${item.l_name}`}"
          readonly
          style="padding-top: 0;"
        ></vaadin-text-field>
        <vaadin-email-field
          label="Email"
          value="${item.email}"
          readonly
        ></vaadin-email-field>
        <vaadin-text-field
          label="DOR"
          value="${item.dob}"
          readonly
          style="padding-top: 0;"
        ></vaadin-text-field>
        <vaadin-text-field
          label="Phone number"
          value="${item.phone}"
          readonly
          style="padding-top: 0;"
        ></vaadin-text-field>
        <vaadin-text-field
          label="Country"
          value="${item.countries}"
          readonly
          style="padding-top: 0;"
        ></vaadin-text-field>
      </vaadin-vertical-layout>
    </vaadin-vertical-layout>
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

        <vaadin-button
          @click="${(e: Event) => {
            this.editBtnClicked ?
            this.handleUpdate(e) : this.handleSubmit(e)  ;
          }}"
          >${this.editBtnClicked ? "Update" : "Register"}</vaadin-button
        >
      </vaadin-form-layout>

      <vaadin-grid .items="${this.users}">
        <vaadin-grid-column
          path="f_name"
          header="First Name"
        ></vaadin-grid-column>
        <vaadin-grid-column
          path="l_name"
          header="Last Name"
        ></vaadin-grid-column>
        <vaadin-grid-column path="email" header="Email"></vaadin-grid-column>

        <vaadin-grid-column
          header="Manage"
          ${columnBodyRenderer(this.manageRenderer, [])}
        ></vaadin-grid-column>
      </vaadin-grid>

      <vaadin-dialog
        header-title="New employee"
        .opened="${this.dialogOpened}"
        ${dialogHeaderRenderer(
          () => html`
            <vaadin-button theme="tertiary" @click="${this.closeIconHandler}">
              <vaadin-icon icon="vaadin:arrows-cross"></vaadin-icon>
            </vaadin-button>
          `,
          []
        )}
        ${dialogRenderer(() => this.renderDialog(this.dialogUserDetails), [])}
      ></vaadin-dialog>
    `;
  }
}
