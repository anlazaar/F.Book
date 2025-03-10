const filterContainer = document.getElementById("filterContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilterButtons = document.getElementById("categoryFilterButtons");
const filterButton = document.getElementById("filterButton");
const postsDivs = document.getElementsByClassName("post-card");
let IsLikedButtonActive = false;
let IsMeButtonActive = false;

// Read and parse json (takes a string and returns the parsed object)
const postsData = JSON.parse(document.getElementById("postsData").textContent);
console.log(postsData);
if (postsData) {
  // Check authentication status and update navbar
  checkAuthStatus().then((isAuthenticated) => {
    if (!isAuthenticated) {
      filterButton.remove();
    }
  });

  var maxLikesRatio = 0;
  var searchValue = "";

  var creatingDateFilterValue = { min: Date.now(), max: 0 };
  var likesFilterValue = { min: 0, max: 0 };
  fillLikesFilterValue();
  fillCreationDateFilterValue();

  filterButton?.addEventListener("click", () => {
    triggerVisibility(filterContainer);
  });

  function triggerVisibility(element) {
    const computedStyle = window.getComputedStyle(element);

    if (computedStyle.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }

  // DFS to extract all search suggestions
  const searchExemples = new Set(); // Set is an array that only holds unique items
  const categories = new Set(); // Set is an array that only holds unique items
  const stack = [{ value: postsData, parent: "" }]; // Initialize the stack

  while (stack.length > 0) {
    const current = stack.pop(); // Get and remove the last element from the stack
    const { value, parent } = current; // Destructure to get value and parent

    if (parent == "category") {
      value.forEach((value) => {
        categories.add(value);
        searchExemples.add(value + " - " + parent);
      });
    } else if (parent == "user_name" || parent == "title") {
      //&& (parent != "image")
      searchExemples.add(value + " - " + parent);
    } else if (value instanceof Array) {
      // We didn't use typeof because it define the array as an object
      // If it's an array, push all its items onto the stack with the current parent name
      value.forEach((item) => {
        stack.push({ value: item, parent: parent }); // Keep the parent name the same for array items
      });
    } else if (value instanceof Object) {
      // If it's an object, push all its values onto the stack with their keys as parent names
      Object.entries(value).forEach(([key, val]) => {
        stack.push({ value: val, parent: key }); // Use the key as the parent name
      });
    }
  }

  searchExemples.forEach((exemple) => {
    document.getElementById("searchExemples").innerHTML +=
      "<option value='" +
      exemple.split(" - ")[0] +
      "'>" +
      exemple +
      "</option></br>";
  });

  // // Search Input EventListener
  searchInput?.addEventListener("input", (event) => {
    searchValue = event.target.value;
    showResults();
  });

  // Categories Buttons
  console.log(categories);
  categories.forEach((item) => {
    if (item != "") {
      categoryFilterButtons.innerHTML +=
        "<button class='categoryButtonsClass'>" + item + "</button>";
    }
  });

  let categoryFilterButtonsChildren = document.getElementsByClassName(
    "categoryButtonsClass"
  );
  categoryFilterButtonsChildren = [...categoryFilterButtonsChildren];
  var selectedCategories = {};

  console.log(categoryFilterButtonsChildren);
  if (categoryFilterButtonsChildren.length > 1) {
    categoryFilterButtonsChildren.forEach((button) => {
      button.addEventListener("click", () => {
        if (selectedCategories[button.innerHTML]) {
          button.style.backgroundColor = "var(--surface)";
          delete selectedCategories[button.innerHTML];
        } else {
          button.style.backgroundColor = "rgb(0, 255, 0)";
          selectedCategories[button.innerHTML] = true;
        }
        console.log(selectedCategories);
        showResults();
      });
    });
  }

  // // // // Filter Sliders // // // // // //
  // Creation Date
  const creationDateFilter = document.getElementById("creationDateFilter");
  noUiSlider.create(creationDateFilter, {
    start: [creatingDateFilterValue.min, creatingDateFilterValue.max],
    connect: true,
    range: {
      min: creatingDateFilterValue.min,
      max: creatingDateFilterValue.max,
    },
    step: 1,
  });

  // Creation Date Handler
  creationDateFilter.noUiSlider.on("update", function (values) {
    // Save values
    creatingDateFilterValue.min = Math.round(values[0]);
    creatingDateFilterValue.max = Math.round(values[1]);

    document.getElementById("creationMin").innerText = new Date(
      Math.round(values[0])
    ).toLocaleString();
    document.getElementById("creationMax").innerText = new Date(
      Math.round(values[1])
    ).toLocaleString();

    showResults();
  });

  // Likes Filter
  const likesFilter = document.getElementById("likesFilter");
  noUiSlider.create(likesFilter, {
    start: [likesFilterValue.min, likesFilterValue.max],
    connect: true,
    range: {
      min: likesFilterValue.min,
      max: likesFilterValue.max,
    },
    step: 1,
  });

  // Likes filter Handler
  likesFilter.noUiSlider.on("update", function (values) {
    // Save values
    likesFilterValue.min = values[0];
    likesFilterValue.max = values[1];
    document.getElementById("rateMin").innerText = Math.round(values[0]);
    document.getElementById("rateMax").innerText = Math.round(values[1]);
    showResults();
  });

  function showResults() {
    postsData.forEach((post, index) => {
      const isTargetedBySearch =
        post.user_name.toLowerCase().includes(searchValue) ||
        post.category.some((item) =>
          item.toLowerCase().includes(searchValue)
        ) ||
        post.title.toLowerCase().includes(searchValue);

      const date = new Date(post.created_at);
      const minDate = new Date(creatingDateFilterValue.min);
      const maxDate = new Date(creatingDateFilterValue.max);
      const isTargetedByCreationDate = minDate <= date && date <= maxDate;

      const postRatio = post.nbr_like - post.nbr_dislike;
      const isTargetedByLikesRatio =
        likesFilterValue.min <= postRatio && postRatio <= likesFilterValue.max;

      const isTargetedByCategories =
        Object.keys(selectedCategories).length === 0 ||
        post.category.some((cat) => selectedCategories[cat]);

      // to let both of the liked and owned post work together 
      const isTargetedByLikedOrMeButton =
        (!IsLikedButtonActive && !IsMeButtonActive) ||
        (IsLikedButtonActive && post.is_user_liked) ||
        (IsMeButtonActive && post.is_user_owned);

      if (
        isTargetedBySearch &&
        isTargetedByCreationDate &&
        isTargetedByLikesRatio &&
        isTargetedByCategories &&
        isTargetedByLikedOrMeButton
      ) {
        postsDivs[index].style.display = "block";
      } else {
        postsDivs[index].style.display = "none";
      }
    });
  }

  function toggleButtonStyle(button, isActive) {
    if (isActive) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  }

  // Liked posts filter
  document
    .getElementById("likeFilterButton")
    .addEventListener("click", function () {
      IsLikedButtonActive = !IsLikedButtonActive; 
      toggleButtonStyle(this, IsLikedButtonActive);
      showResults();
    });

  // Owned posts filter
  document
    .getElementById("meFilterButton")
    .addEventListener("click", function () {
      IsMeButtonActive = !IsMeButtonActive; 
      toggleButtonStyle(this, IsMeButtonActive);
      showResults();
    });

  // Get min and max creation date
  function fillCreationDateFilterValue() {
    postsData?.forEach((post) => {
      if (Date.parse(post.created_at) < creatingDateFilterValue.min) {
        creatingDateFilterValue.min = Date.parse(post.created_at);
      }
      if (Date.parse(post.created_at) > creatingDateFilterValue.max) {
        creatingDateFilterValue.max = Date.parse(post.created_at);
      }
    });
  }

  // Get min and max rated posts
  function fillLikesFilterValue() {
    postsData?.forEach((post) => {
      if (post.nbr_like - post.nbr_dislike > likesFilterValue.max) {
        likesFilterValue.max = post.nbr_like - post.nbr_dislike;
      }
      if (post.nbr_like - post.nbr_dislike < likesFilterValue.min) {
        likesFilterValue.min = post.nbr_like - post.nbr_dislike;
      }
    });
  }
}

// save the scroll position 9bel realod
window.addEventListener("beforeunload", function () {
  localStorage.setItem("scrollPosition", window.scrollY);
});

// update the last stored scroll position while loading page
window.addEventListener("load", function () {
  const scrollPosition = localStorage.getItem("scrollPosition");
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition, 10));
  }
});
