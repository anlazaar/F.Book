const submitButton = document.getElementById("submit-button");
const passwordErrorDiv = document.getElementById("passwordError");

const emailErrorDiv = document.getElementById("emailError");
submitButton.disabled = true;

if (!emailErrorDiv.innerText && !passwordErrorDiv.innerText) {
  submitButton.disabled = false;
} else {
  submitButton.disabled = true;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const checkIsValidCredentials = async (email, password) => {
  try {
    const response = await fetch("/api/isValidAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch email disponibility...");
    }
    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error("Error checking email disponibility:", error);
    return false;
  }
};

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  checkIsValidCredentials(email.value, password.value).then((isValid) => {
    if (isValid) {
      document.getElementById("signin-form").submit();
    } else {
      passwordErrorDiv.innerText = "Invalid Email or Password credentials";
    }
  });
});

document.getElementById("email").addEventListener("input", (event) => {
  if (emailRegex.test(event.target.value)) {
    emailErrorDiv.innerText = "";
  } else {
    emailErrorDiv.innerText = "Invalid email address";
  }

  if (!emailErrorDiv.innerText && !passwordErrorDiv.innerText) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});

document.getElementById("password").addEventListener("input", (event) => {
  if (event.target.value.length > 7) {
    passwordErrorDiv.innerText = "";
  } else {
    passwordErrorDiv.innerText = "Password less than 8 characters";
  }

  if (!emailErrorDiv.innerText && !passwordErrorDiv.innerText) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});
