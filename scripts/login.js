"use strict";
export default class LoginPage {
  constructor() {
    this.inputFieldRegexPattern = /^[a-z,A-Z,0-9]{1,10}$/;
    this.notValidNameErrorMsg = "Not a valid username! Valid characters are a-z, A-Z, 0-9 and 1 to 10 in size!";
    this.notValidpassErrorMsg = "Not a valid password! Valid characters are a-z, A-Z, 0-9 and 1 to 10 in size!";
    this.noUserFoundMsg = "No user with that name is found!";
    this.wrongPassMsg = "Worng password!";
  }

  renderLoginPage = () => {
    this.getMainE().innerHTML = `
    <h1>Login</h1>
      <form id="my_form" action="javascript:void(0);">
          <input type="text" placeholder="Username" class="field" id="username" pattern="[A-Z,a-z,0-9]{1,10}">
          <div class="error_msg_box" id="e_name">"error message"</div>
          <input type="password" placeholder="Password" class="field" id="password" pattern="[A-Z,a-z,0-9]{1,10}"> 
          <div class="error_msg_box" id="e_pass">"error message"</div>             
          <button type="submit" value="Submit" class="btn" id="login_btn">Login</button>
          <button class="btn" id="new_user">New user</button>
      </from>`;
  }

  getLoginBtnEFromPage = () => document.getElementById("login_btn");
  getNewUserBtnEFromPage = () => document.getElementById("new_user");
  getInputFieldUserNameE = () => document.getElementById("username");
  getInputFieldPasswordE = () => document.getElementById("password");      
  isCorrectPassword = (cust) => cust.password == this.getInputFieldPasswordE().value;

  loginUser = () => {

    let usernameInputValue = this.getInputFieldUserNameE().value
    let passwordInputValue = this.getInputFieldPasswordE().value

    if (!this.isValidInputFormat(usernameInputValue)) 
    {
      this.displayNotValidInputErrorMsg(this.getErrorDivForNameFieldE(), this.notValidNameErrorMsg, this.getInputFieldUserNameE());
      return false;
    }

    if(!this.isValidInputFormat(passwordInputValue))
    {
      this.displayNotValidInputErrorMsg(this.getErrorDivForPassFieldE(), this.notValidpassErrorMsg, this.getInputFieldPasswordE());
      return false;
    }

    if(!this.isCustomer(usernameInputValue))
    {
      this.displayNotValidInputErrorMsg(this.getErrorDivForNameFieldE(), this.noUserFoundMsg, this.getInputFieldUserNameE());
      return false;
    }

    const customer = this.getCustomerObject(usernameInputValue);

    if(!this.isCorrectPassword(customer))
    {
      this.displayNotValidInputErrorMsg(this.getErrorDivForPassFieldE(), this.wrongPassMsg, this.getInputFieldPasswordE());
      return false;
    }

    const activeCustomer = this.getCustomerObject("activeCustomer");

    if(customer.username != activeCustomer.username && activeCustomer.shoppingList.length > 0){
      let text = "Vill du lägga till varorna som du har i lagt i korgen\nin i din användares kundvagn";
      if (confirm(text) == true) customer.shoppingList.push(...activeCustomer.shoppingList)
    }

    window.localStorage.setItem("activeCustomer", JSON.stringify(customer));

    return true
  }
}

