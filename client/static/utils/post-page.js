function toggleButtonStyle(button, isActive) {
  if (button) {
    if (isActive) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  }
}

// Trim the '#' from category tags
document.querySelectorAll(".category-tag").forEach((el) => {
  el.textContent = el.textContent.slice(1);
});

const dataElement = document.getElementById("isLiked");
let data = null;

try {
  data = JSON.parse(dataElement.textContent);
} catch (error) {
  console.error("FAILED TO PARSE JSON DATA", error);
}

if (data) {
  // Toggle post like/dislike buttons
  toggleButtonStyle(
    document.getElementById("like-button"),
    data.Post.is_user_liked
  );
  toggleButtonStyle(
    document.getElementById("dislike-button"),
    data.Post.is_user_disliked
  );

  // Toggle comment like/dislike buttons
  const comments = document.querySelectorAll(".comment");
  comments.forEach((comment, index) => {
    const commentData = data.Comments[index];
    if (commentData) {
      toggleButtonStyle(
        comment.querySelector(".like-btn"),
        commentData.is_user_liked
      );
      toggleButtonStyle(
        comment.querySelector(".dislike-btn"),
        commentData.is_user_disliked
      );
    }
  });
} else {
  console.error("No valid data found");
}
