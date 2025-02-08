let selectedCategories = new Set();

// Update select event to use change instead of click
if (document.getElementById("categories")) {
  document.getElementById("categories").addEventListener("change", (event) => {
    if (event.target.value) {
      selectedCategories.add(event.target.value);
      updateSelectedCategories();
      event.target.value = "";
    }
  });
}

document.getElementById("addButton").addEventListener("click", (e) => {
  e.preventDefault();
  const categoryValue = document.getElementById("category").value;
  if (categoryValue) {
    selectedCategories.add("#" + categoryValue);
    updateSelectedCategories();
    document.getElementById("category").value = "";
    document.getElementById("addButton").disabled = true;
  }
});

// Function to update the display of selected categories
function updateSelectedCategories() {
  document.getElementById("selectedCatDiv").innerHTML = [...selectedCategories]
    .map(
      (cat) =>
        `<span class="category-tag">${cat}<button type="button" class="remove-category" data-category="${cat}">×</button></span>`
    )
    .join("");
  document.getElementById("postCategories").value = [
    ...selectedCategories,
  ].join(" ");

  // Keep your existing click handler code
  document.querySelectorAll(".remove-category").forEach((button) => {
    button.addEventListener("click", (e) => {
      const categoryToRemove = e.target.dataset.category;
      selectedCategories.delete(categoryToRemove);
      updateSelectedCategories();
    });
  });
}

// Enable/disable add button based on input
document.getElementById("category").addEventListener("input", (event) => {
  document.getElementById("addButton").disabled = !event.target.value;
});
const postImage = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");

postImage.addEventListener("change", (event) => {
  const file = event.target.files[0];

  // Validate the file (optional)
  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      postImage.value = ""; // Reset the input
      imagePreview.innerHTML = ""; // Clear the preview
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      // 20MB limit
      alert("File size exceeds 20MB. Please choose a smaller file.");
      postImage.value = ""; // Reset the input
      imagePreview.innerHTML = ""; // Clear the preview
      return;
    }

    // Create and display image preview
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image preview" />`;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.innerHTML = ""; // Clear the preview if no file is selected
  }
});

const category = document.getElementById("category");
const title = document.getElementById("title");

// Regex for category
const catRegex = /^[a-zA-Z-_]{1,30}$/;

// Regex for title
const titleRegex = /^.{1,50}$/;

const catError = document.getElementById("customCatError");
const titleError = document.getElementById("customTitleError");

const addButton = document.getElementById("addButton");
const submitButton = document.getElementById("submitButton");

category.addEventListener("input", (event) => {
  if (catRegex.test(event.target.value)) {
    catError.innerText = "";
    addButton.disabled = false;
  } else {
    catError.innerText =
      "Invalid category (No spaces allowed, No numbers allowed, max 50 chars)";
    addButton.disabled = true;
  }
});

title.addEventListener("input", (event) => {
  if (titleRegex.test(event.target.value)) {
    titleError.innerText = "";
    submitButton.disabled = false;
  } else {
    titleError.innerText = "Invalid title (Max 50 chars)";
    submitButton.disabled = true;
  }
});
