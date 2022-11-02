"use strict";
export default class SignUpPage {
  constructor() {
    this.inputFieldRegexPattern = /^[a-z,A-Z,0-9]{1,10}$/;
    this.notValidNameErrorMsg =
      "Not a valid username! Valid characters are a-z, A-Z, 0-9 and 1 to 10 in size!";
    this.notValidpassErrorMsg =
      "Not a valid password! Valid characters are a-z, A-Z, 0-9 and 1 to 10 in size!";
    this.noUserFoundMsg = "No user with that name is found!";
    this.wrongPassMsg = "Worng password!";
    this.nameTakenMessage = "That user name is already taken!";
  }

  getMainE = () => document.querySelector("main");

  hideElement = (element) =>  element.style.animationName = "hidden";

  isValidUsernameFormat = () => this.inputFieldRegexPattern.test(this.getInputFieldCreateUserNameE().value)
  
  isValidPasswordFormat = () => this.inputFieldRegexPattern.test(this.getInputFieldCreatePasswordE().value)

  getCreateNewUserBtnEFromPage = () => document.getElementById("createBtn");
  getInputFieldCreateUserNameE = () => document.getElementById("c_username");
  getInputFieldCreatePasswordE = () => document.getElementById("c_password");
  getErrorDivForNameFieldE = () => document.getElementById("e_name");
  getErrorDivForPassFieldE = () => document.getElementById("e_pass");

  displayNotValidUsernameErrorMsg = () => {
    const nameErrorDivE = this.getErrorDivForNameFieldE();
    nameErrorDivE.textContent = this.notValidNameErrorMsg;
    nameErrorDivE.style.animationName = "show";
    const inputUsernameElement = this.getInputFieldCreateUserNameE();
    inputUsernameElement.addEventListener("change", () =>
      this.hideElement(nameErrorDivE)
    );
  };

  displayNotValidPasswordErrorMsg = () => {
    const passErrorDivE = this.getErrorDivForPassFieldE();
    passErrorDivE.textContent = this.notValidpassErrorMsg;
    passErrorDivE.style.animationName = "show";
    const inputPasswordElement = this.getInputFieldCreatePasswordE();
    inputPasswordElement.addEventListener("change", () =>
      this.hideElement(passErrorDivE)
    );
  };

  displayNameTakenMsg = () => {
    const nameErrorDivE = this.getErrorDivForNameFieldE();
    nameErrorDivE.textContent = this.nameTakenMessage;
    nameErrorDivE.style.animationName = "show";
    const inputUsernameElement = this.getInputFieldCreateUserNameE();
    inputUsernameElement.addEventListener("change", () =>
      this.hideElement(nameErrorDivE)
    );
  };

  createUser = () => {
    let userInputUsername = this.getInputFieldCreateUserNameE().value;
    let userInputUsernamePassword = this.getInputFieldCreatePasswordE().value;

    let eNameE = this.getErrorDivForNameFieldE();
    let ePassE = this.getErrorDivForPassFieldE();


    let freeUsername = window.localStorage.getItem(userInputUsername) ? false : true;

    if (!this.isValidUsernameFormat()) {
      this.displayNotValidUsernameErrorMsg();
      return;
    }
    if (!this.isValidPasswordFormat()) {
      this.displayNotValidPasswordErrorMsg();
      return;
    }
    if (!freeUsername) {
      this.displayNameTakenMsg();
      return;
    }

    let newUser;

    if (this.isValidUsernameFormat() && this.isValidPasswordFormat() && freeUsername) {
      newUser = {
        username: userInputUsername,
        password: userInputUsernamePassword,
        shoppingList: [],
        orders: [],
      };
      let aCustomer = JSON.parse(window.localStorage.getItem("activeCustomer"));
      if (aCustomer.shoppingList.length > 0) {
        let text =
          "Vill du lägga till varorna som du har i lagt i korgen\nin i din användares kundvagn";
        if (confirm(text) == true) {
          newUser.shoppingList.push(...aCustomer.shoppingList);
        } else {
          console.log(
            `Earliers active customer shopping list is not merged with logged in user`
          );
        }
      }
      window.localStorage.setItem(newUser.username, JSON.stringify(newUser));
      window.localStorage.setItem("activeCustomer", JSON.stringify(newUser));
    }
  }
}