document.addEventListener("DOMContentLoaded", () => {
  const avatarInput = document.getElementById("avatar");
  const previewAvatar = document.getElementById("preview-avatar");

  avatarInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    // Validate the file (optional)
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        avatarInput.value = ""; // Reset the input
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        // 2MB limit
        alert("File size exceeds 20MB. Please choose a smaller file.");
        avatarInput.value = ""; // Reset the input
        return;
      }

      // Update the preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previewAvatar.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});

async function checkIdentifierDisponibility(checkIdentifierDisponibility) {
  console.log("checkIdentifierDisponibility", checkIdentifierDisponibility);
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
const submitButtom = document.getElementById("submitButtom");
const form = document.getElementById("edit-profile-form");

const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const passwordConfirmationError = document.getElementById(
  "passwordConfirmationError"
);

const usernameRegex = /^[a-z0-9_]{0,20}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

console.log(email);
email.addEventListener("input", async (event) => {
  checkIdentifierDisponibility(event.target.value).then((isDispo) => {
    console.log(event.target.value);
    console.log("---------------", emailRegex.test(event.target.value));
    console.log("-------     --------", isDispo);
    if (
      !event.target.value ||
      (emailRegex.test(event.target.value) && isDispo)
    ) {
      emailError.innerText = "";
    } else if (!isDispo) {
      emailError.innerText = "Email not available";
    } else {
      emailError.innerText = "Invalid email format";
    }
  });
});

password.addEventListener("input", (event) => {
  if (password.value && password.value.length < 8) {
    passwordError.innerText = "Password must be at least 8 chars";
  } else {
    passwordError.innerText = "";
  }
  if (password.value != passwordConfirmation.value) {
    console.log(password.value, passwordConfirmation.value);
    passwordConfirmationError.innerText = "Confirmation Password not identical";
  } else {
    passwordConfirmationError.innerText = "";
  }
});

passwordConfirmation.addEventListener("input", (event) => {
  if (password.value != passwordConfirmation.value) {
    console.log(password.value, passwordConfirmation.value);
    passwordConfirmationError.innerText = "Confirmation Password not identical";
  } else {
    passwordConfirmationError.innerText = "";
  }
});

submitButtom.addEventListener("click", (event) => {
  event.preventDefault();
  if (
    !usernameError.innerText &&
    !emailError.innerText &&
    !passwordError.innerText &&
    !passwordConfirmationError.innerText
  ) {
    form.submit();
  }
});
