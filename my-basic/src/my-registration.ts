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
import type { TextField, TextFieldValidatedEvent } from "@vaadin/text-field";
import "@vaadin/multi-select-combo-box";
import { Notification } from '@vaadin/notification';
import "@vaadin/dialog";
import "@vaadin/grid";


@customElement("user-registration") /// Registering the custom element with 'user-registration' tag
export class Registration extends LitElement {
  @state() firstName: string = "";
  @state() lastName: string = "";
  @state() email: string = "";
  @state() password: string = "";
  @state() dob: string = "";
  @state() phone: string = "";

  @state() showAlert: boolean = false;
  @state() errorMsg: string = "";

  @state()
  private items: any = ["United States", "Canada", "Germany", "India"];

  selectedCountry: string[] = [];

  @state() errorMessage: string = "";

  notifyTheme: string = "";

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

  // validateFields() {
  //   // Name validation (non-empty, no special characters)
  //   const nameRegex = /^[a-zA-Z\s]{2,}$/;
  //   if (!nameRegex.test(this.firstName)) {
  //     return "First name must contain only letters and at least 2 characters.";
  //   }
  //   if (!nameRegex.test(this.lastName)) {
  //     return "Last name must contain only letters and at least 2 characters.";
  //   }

  //   // Email validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(this.email)) {
  //     return "Please enter a valid email address.";
  //   }

  //   // Password validation (minimum 8 characters, 1 letter, 1 number)
  //   const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

  //   if (!passwordRegex.test(this.password)) {
  //     return "Password must be at least 8 characters, including 1 letter and 1 number.";
  //   }

  //   // Date of birth validation (must not be empty)
  //   if (!this.dob) {
  //     return "Date of birth is required.";
  //   }

  //   // Phone number validation (only numbers, 10-15 digits)
  //   const phoneRegex = /^\d{10,15}$/;
  //   if (!phoneRegex.test(this.phone)) {
  //     return "Phone number must be between 10 and 15 digits.";
  //   }

  //   // Country selection validation
  //   if (this.selectedCountry.length === 0) {
  //     return "Please select at least one country.";
  //   }

  //   // If all validations pass
  //   return null;
  // }

  handleSubmit(e: Event) {
    e.preventDefault();
    // Basic validation for empty fields
    // console.log("this.name", this.firstName);
    // console.log("this.name", this.lastName);

    // console.log("this.email", this.email);
    // console.log("this.password", this.password);
    // console.log("this.dob", this.dob);
    // console.log("this.phone", this.phone);

    // const validationError = this.validateFields();
    // if (validationError) {
    //   this.showAlert = true;
    //   this.errorMsg = validationError;
    //   return;
    // }

    // if (
    //   !this.firstName ||
    //   !this.lastName ||
    //   !this.email ||
    //   !this.password ||
    //   !this.dob ||
    //   !this.phone ||
    //   this.selectCountry.length === 0
    // ) {
    //   this.showAlert = true;
    //   this.errorMsg = `Please enter your ${
    //     !this.firstName
    //       ? "firstName"
    //       : !this.lastName
    //       ? "lastName"
    //       : !this.email
    //       ? "email"
    //       : !this.password
    //       ? "password"
    //       : !this.dob
    //       ? "dob"
    //       : !this.phone
    //       ? "phone"
    //       : this.selectCountry.length === 0
    //       ? "country"
    //       : ""
    //   }`;
    //   alert("All fields are required!");

    // return;
    //  }
    const userdata = {
      fname: this.firstName,
      lname: this.lastName,
      email: this.email,
      password: this.password,
      dob: this.dob,
      phone: this.phone,
      countries: this.selectedCountry,
    };

    fetch("http://192.168.0.24:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userdata),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Data",data)
        if (data.error) {
          this.notifyTheme = "error"
          this.showAlert = true;
          this.errorMsg = data.error;
        } else {
          // alert("Registration successful!");
          this.notifyTheme = "success"
          this.showAlert = true;
          this.errorMsg ="Registration success"
     
          // Clear form fields after successful registration
          this.firstName = "";
          this.lastName = "";
          this.email = "";
          this.password = "";
          this.dob = "";
          this.phone = "";
          this.selectedCountry = [];
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.showAlert = true;
        this.errorMsg = "There was an error with the registration.";
      });
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
          minlength="5"
          maxlength="18"
          required
          .value="${this.firstName}"
          @change="${(e: Event) => {
            this.firstName = (e.target as HTMLInputElement ).value;
            // this.errorMsg = this.errorMessage;
            // this.showAlert = true
          }}"
          .errorMessage="${this.errorMessage}"
          @validated="${(event: TextFieldValidatedEvent) => {
            const field = event.target as TextField;
            const { validity } = field.inputElement as HTMLInputElement;
            if (validity.valueMissing) {
              this.errorMessage = "Field is required";
            } else if (validity.tooShort) {
              this.errorMessage = `Minimum length is ${field.minlength} characters`;
              
            } else if (validity.tooLong) {
              this.errorMessage = `Maximum length is ${field.maxlength} characters`;
            } else {
              this.errorMessage = "";
            }
          }}"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Last Name"
          placeholder="Enter your last name"
          .value="${this.lastName}"
          @change="${(e: Event) => {
            this.lastName = (e.target as HTMLInputElement).value;
          }}"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Email"
          placeholder="Enter Email"
          .value="${this.email}"
          @change="${(e: Event) => {
            this.email = (e.target as HTMLInputElement).value;
          }}"
        ></vaadin-text-field>

        <vaadin-password-field
          label="Password"
          placeholder="Enter your Password"
          .value="${this.password}"
          @value-changed="${(e: Event) => {
            this.password = (e.target as HTMLInputElement).value;
          }}"
          required
        ></vaadin-password-field>

        <vaadin-multi-select-combo-box
          label="Countries"
          .items="${this.items}"
          .selectedItems="${this.selectedCountry}"
          @selected-items-changed="${(e: any) => {
            this.selectedCountry = e.detail.value;
          }}"
        ></vaadin-multi-select-combo-box>

        <vaadin-date-picker
          label="Reg Date"
          placeholder="Select the Date"
          .value="${this.dob}"
          @value-changed="${(e: Event) => {
            this.dob = (e.target as HTMLInputElement).value;
          }}"
          clear-button-visible
        ></vaadin-date-picker>

        <vaadin-text-field
          label="Phone Number"
          .value="${this.phone}"
          @input="${(e: Event) => {
            this.phone = (e.target as HTMLInputElement).value;
          }}"
          required
          type="tel"
        ></vaadin-text-field>

        <vaadin-button @click="${this.handleSubmit}">Register</vaadin-button>
      </vaadin-form-layout>
    `;
  }
}
