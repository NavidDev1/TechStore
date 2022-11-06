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

  renderSignUpPage = () => {
    this.getMainE().innerHTML = `<h1>New user</h1><form id="my_form" action="javascript:void(0);">
    <input type="text" placeholder="Choose username" id="c_username" class="field" pattern="[A-Z,a-z,0-9]{1,10}">
    <div class="error_msg_box" id="e_name">"error message"</div>
    <input type="password" placeholder="Choose password" id="c_password" class="field" pattern="[A-Z,a-z,0-9]{1,10}">
    <div class="error_msg_box" id="e_pass">"error message"</div>
    <button type="submit" value="Create user" id="createBtn" class="btn">Create user</button>
    </form>`;
  }

  getCreateNewUserBtnEFromPage = () => document.getElementById("createBtn");
  getInputFieldCreateUserNameE = () => document.getElementById("c_username");
  getInputFieldCreatePasswordE = () => document.getElementById("c_password");

  createUser = () => {
    let createUsernameInputE = this.getInputFieldCreateUserNameE();
    let createPasswordInputE = this.getInputFieldCreatePasswordE();
    let eNameE = this.getErrorDivForNameFieldE();
    let ePassE = this.getErrorDivForPassFieldE();


    let freeUsername = window.localStorage.getItem(createUsernameInputE.value) ? false : true;

    if (!this.isValidInputFormat(createUsernameInputE.value)) {
      this.displayNotValidInputErrorMsg(eNameE, this.notValidNameErrorMsg, createUsernameInputE);
      return false;
    }
    if (!this.isValidInputFormat(createPasswordInputE.value)) {
      this.displayNotValidInputErrorMsg(ePassE, this.notValidpassErrorMsg, createPasswordInputE);
      return false;
    }
    if (!freeUsername) {
      this.displayNotValidInputErrorMsg(eNameE, this.nameTakenMessage, createUsernameInputE);
      return false;
    }

    let newUser;

    if (this.isValidInputFormat(createUsernameInputE.value) && this.isValidInputFormat(createPasswordInputE.value) && freeUsername) {
      newUser = {
        username: createUsernameInputE.value,
        password: createPasswordInputE.value,
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
    return true
  }
}