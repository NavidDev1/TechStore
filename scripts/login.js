export default class LoginPage {
  constructor() {
    this.inputFieldRegexPattern = /^[a-z,A-Z,0-9]{1,10}$/;
    this.notValidNameErrorMsg = "Not a valid username! Valid characters are a-z, A-Z, 0-9 and 1 to 10 in size!";
    this.notValidpassErrorMsg = "Not a valid password! Valid characters are a-z, A-Z, 0-9 and 1 to 10 in size!";
    this.noUserFoundMsg = "No user with that name is found!";
    this.wrongPassMsg = "Worng password!";
  }

  getLoginForm = () => {
     
    return `
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

  getErrorDivForNameFieldE = () => document.getElementById("e_name");

  getErrorDivForPassFieldE = () => document.getElementById("e_pass");

  hideElement = (element) =>  element.style.animationName = "hidden";

  checkValidUsername = () => this.inputFieldRegexPattern.test(this.getInputFieldUserNameE().value)
  
  checkValidPassword = () => this.inputFieldRegexPattern.test(this.getInputFieldPasswordE().value)

  displayNotValidUsernameErrorMsg = () => {
    const nameErrorDivE = this.getErrorDivForNameFieldE();
    nameErrorDivE.textContent = this.notValidNameErrorMsg;
    nameErrorDivE.style.animationName = "show";
    const inputUsernameElement = this.getInputFieldUserNameE();
    inputUsernameElement.addEventListener("change", () => this.hideElement(nameErrorDivE));
  }

  displayUsernameNotFoundErrorMsg = () => {
    const nameErrorDivE = this.getErrorDivForNameFieldE();
    nameErrorDivE.textContent = this.noUserFoundMsg;
    nameErrorDivE.style.animationName = "show";
    const inputUsernameElement = this.getInputFieldUserNameE();
    inputUsernameElement.addEventListener("change", () => this.hideElement(nameErrorDivE));
  }

  displayNotValidPasswordErrorMsg = () =>{
    const passErrorDivE = this.getErrorDivForPassFieldE();
    passErrorDivE.textContent = this.notValidpassErrorMsg;
    passErrorDivE.style.animationName = "show";
    const inputPasswordElement = this.getInputFieldPasswordE();
    inputPasswordElement.addEventListener("change", () => this.hideElement(passErrorDivE));
  }
}

