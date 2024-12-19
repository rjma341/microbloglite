"use strict";

const postList = document.getElementById("postList");
const authToken = getLoginData().token;

// Open the modal logic is already handled by Bootstrap, so no need to change anything for opening the modal.

// When the "Submit" button is clicked in the modal, this handler will submit the post
document.getElementById("submitPostButton").addEventListener("click", async function() {
  const postText = document.getElementById("postTextModal").value;

  // Make sure the post text is not empty
  if (postText.trim() === "") {
    alert("Post text cannot be empty!");
    return;
  }

  const newPostData = {
    username: getLoginData().username,
    text: postText,
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPostData),
  };

  try {
    const response = await fetch("http://localhost:5005/api/posts", options);
    const postData = await response.json();

    // Close the modal after post submission
    const modal = bootstrap.Modal.getInstance(document.getElementById("postModal"));
    modal.hide();

    // Clear the input field
    document.getElementById("postTextModal").value = "";

    if (response.ok) {
      // Add the newly created post to the posts list without reloading the page
      populatePostCards([postData]);
    } else {
      alert(`Error: ${postData.message}`);
    }
  } catch (error) {
    console.error("Post Error:", error);
    alert("Something went wrong while creating the post.");
  }
});

// Fetch the user's posts from the API
async function getUserPosts() {
  const loginData = getLoginData();
  const username = loginData.username;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    let response = await fetch(
      `http://localhost:5005/api/posts?username=${username}&limit=100&offset=0`,
      options
    );
    let posts = await response.json();
    console.log("User's posts:", posts);
    return posts;
  } catch (error) {
    console.log("Error fetching posts:", error.message);
  }
}

function populatePostCards(posts) {
  posts.forEach((post) => {
    const postDiv = createPostCard(post);
    postList.appendChild(postDiv);
  });
}

function createPostCard(post) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  // Create the post content (same logic as before)
  const avatarDiv = document.createElement("div");
  avatarDiv.classList.add("post_avatar");
  const avatarImg = document.createElement("img");
  avatarImg.src = "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png";
  avatarImg.alt = "Avatar";
  avatarDiv.appendChild(avatarImg);

  const postBodyDiv = document.createElement("div");
  postBodyDiv.classList.add("post_body");
  const postHeaderDiv = document.createElement("div");
  postHeaderDiv.classList.add("post_header");

  const postHeaderTextDiv = document.createElement("div");
  postHeaderTextDiv.classList.add("post_headerText");
  const headerH3 = document.createElement("h3");
  headerH3.textContent = post.fullName;
  const postHeaderSpecialSpan = document.createElement("span");
  postHeaderSpecialSpan.classList.add("postHeaderSpecial");
  postHeaderSpecialSpan.textContent = ` @${post.username}`;
  headerH3.appendChild(postHeaderSpecialSpan);
  postHeaderTextDiv.appendChild(headerH3);

  const postHeaderDescriptionDiv = document.createElement("div");
  postHeaderDescriptionDiv.classList.add("post_headerDescription");
  const descriptionP = document.createElement("p");
  descriptionP.textContent = post.text;
  postHeaderDescriptionDiv.appendChild(descriptionP);

  postHeaderDiv.appendChild(postHeaderTextDiv);
  postHeaderDiv.appendChild(postHeaderDescriptionDiv);

  const postFooterDiv = document.createElement("div");
  postFooterDiv.classList.add("post_footer");

  const commentIcon = document.createElement("i");
  commentIcon.classList.add("uil", "uil-comment");

  const heartIcon = document.createElement("i");
  heartIcon.classList.add("uil", "uil-heart");

  const shareIcon = document.createElement("i");
  shareIcon.classList.add("uil", "uil-share-alt");

  postFooterDiv.appendChild(commentIcon);
  postFooterDiv.appendChild(heartIcon);
  postFooterDiv.appendChild(shareIcon);

  postBodyDiv.appendChild(postHeaderDiv);
  postBodyDiv.appendChild(postFooterDiv);
  postDiv.appendChild(avatarDiv);
  postDiv.appendChild(postBodyDiv);

  return postDiv;
}

// Initialize the page with user's posts
async function initializePage() {
  const posts = await getUserPosts();
  populatePostCards(posts);
}

initializePage();
