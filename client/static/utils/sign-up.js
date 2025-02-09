async function checkIdentifierDisponibility(checkIdentifierDisponibility) {
  try {
    const response = await fetch(
      "/api/checkEmail?identifier=" + checkIdentifierDisponibility
    );
    if (!response.ok) {
      throw new Error("Failed to fetch email disponibility...");
    }
    const data = await response.json();
    return data.isDisponible;
  } catch (error) {
    console.error("Error checking email disponibility:", error);
    return false;
  }
}
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirmation = document.getElementById("confirm-password");

const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const submitButtom = document.getElementById("submitButtom");

const usernameRegex = /^[a-z0-9_]{1,20}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/;

submitButtom.addEventListener("click", (event) => {
  if (
    usernameError.innerText ||
    emailError.innerText ||
    passwordError.innerText
  ) {
    event.preventDefault();
  }
});

username.addEventListener("input", (event) => {
  checkIdentifierDisponibility("@" + event.target.value).then((isDispo) => {
    if (usernameRegex.test(event.target.value) && isDispo) {
      usernameError.innerText = "";
    } else if (!isDispo) {
      usernameError.innerText = "Username not available";
    } else {
      usernameError.innerText = "Invalid Username format";
    }
  });
});

email.addEventListener("input", (event) => {
  checkIdentifierDisponibility(event.target.value).then((isDispo) => {
    if (emailRegex.test(event.target.value) && isDispo) {
      emailError.innerText = "";
    } else if (!isDispo) {
      emailError.innerText = "Email not available";
    } else {
      emailError.innerText = "Invalid email format";
    }
  });
});

password.addEventListener("input", (event) => {
  if (password.value.length < 8) {
    passwordError.innerText = "Password must be at least 8 chars";
  } else {
    passwordError.innerText = "";
  }
});

passwordConfirmation.addEventListener("input", (event) => {
  if (password.value != passwordConfirmation.value) {
    console.log(password.value, passwordConfirmation.value);
    passwordError.innerText = "Confirmation Password not identical";
  } else {
    passwordError.innerText = "";
  }
});
