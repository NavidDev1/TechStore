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

  isValidUsernameFormat = () => this.inputFieldRegexPattern.test(this.getInputFieldUserNameE().value)
  
  isValidPasswordFormat = () => this.inputFieldRegexPattern.test(this.getInputFieldPasswordE().value)

  displayNotValidUsernameErrorMsg = () => {
    const nameErrorDivE = this.getErrorDivForNameFieldE();
    nameErrorDivE.textContent = this.notValidNameErrorMsg;
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

  displayUsernameNotFoundErrorMsg = () => {
    const nameErrorDivE = this.getErrorDivForNameFieldE();
    nameErrorDivE.textContent = this.noUserFoundMsg;
    nameErrorDivE.style.animationName = "show";
    const inputUsernameElement = this.getInputFieldUserNameE();
    inputUsernameElement.addEventListener("change", () => this.hideElement(nameErrorDivE));
  }

  displayWrongPassword = () => {
    const passErrorDivE = this.getErrorDivForPassFieldE();
    passErrorDivE.textContent = this.wrongPasswordMsg;
    passErrorDivE.style.animationName = "show";
    const inputPasswordElement = this.getInputFieldPasswordE();
    inputPasswordElement.addEventListener("change", () => this.hideElement(passErrorDivE));
  }

  displayNameTakenMsg = () => {
    const nameErrorDivE = this.getErrorDivForNameFieldE();
    nameErrorDivE.textContent = this.nameTakenMessage;
    nameErrorDivE.style.animationName = "show";
    const inputUsernameElement = this.getInputFieldUserNameE();
    inputUsernameElement.addEventListener("change", () => this.hideElement(nameErrorDivE));
  }

  getCustomer = () => {
    let foundUser = window.localStorage.getItem(getInputFieldUserNameE().value);
    return JSON.parse(foundUser);
  }

  getActiveCustomer = () => JSON.parse(window.localStorage.getItem("activeCustomer"));
  

  isCorrectPassword = (cust) => cust.password == getInputFieldPasswordE().value;

  isCustomer = (customerName) => window.localStorage.getItem(customerName) ? true : false

  loginUser = () => {
    if (!this.isValidUsernameFormat()) 
    {
      this.displayNotValidUsernameErrorMsg();
      return;
    }

    if(!this.isValidPasswordFormat())
    {
      this.displayNotValidPasswordErrorMsg();
      return;
    }

    if(!isCustomer(getInputFieldUserNameE()))
    {
      this.displayUsernameNotFoundErrorMsg();
      return;
    }

    const customer = getCustomer();

    if(!this.isCorrectPassword(customer))
    {
      this.displayWrongPassword();
      return;
    }

    const activeCustomer = getActiveCustomer();

    if(customer.username != activeCustomer.username && activeCustomer.shoppingList.length > 0){
      let text = "Vill du lägga till varorna som du har i lagt i korgen\nin i din användares kundvagn";
      if (confirm(text) == true) customer.shoppingList.push(...activeCustomer.shoppingList)
    }

    window.localStorage.setItem("activeCustomer", JSON.stringify(customer));
  }
}

