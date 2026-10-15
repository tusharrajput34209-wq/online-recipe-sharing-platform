
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const recipeContainer = document.getElementById("recipeContainer");
const recipeForm = document.getElementById("recipeForm");
const recipeModal = document.getElementById("recipeModal");
const closeModal = document.getElementById("closeModal");
const noResults = document.getElementById("noResults");
const ratingStars = document.getElementById("ratingStars");
const selectedRatingText = document.getElementById("selectedRating");
const reviewForm = document.getElementById("reviewForm");
const reviewComment = document.getElementById("reviewComment");
const reviewStatus = document.getElementById("reviewStatus");
const averageRating = document.getElementById("averageRating");
const reviewList = document.getElementById("reviewList");

let currentRecipeKey = null;
let currentRecipeTitle = "";
let selectedRating = 0;

function searchRecipes() {
    const searchText = searchInput.value.toLowerCase().trim();
    const cards = recipeContainer.querySelectorAll(".recipe-card");
    let visibleCount = 0;

    cards.forEach(function(card) {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(searchText);

        card.style.display = matches ? "" : "none";

        if (matches) {
            visibleCount++;
        }
    });

    noResults.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", searchRecipes);
searchButton.addEventListener("click", searchRecipes);

function showRecipe(name, ingredients, instructions, recipeId = null) {
    document.getElementById("modalTitle").textContent = name;
    document.getElementById("modalIngredients").textContent = ingredients || "";
    document.getElementById("modalInstructions").textContent = instructions || "";

    currentRecipeTitle = name;
    currentRecipeKey = recipeId !== null && recipeId !== undefined
        ? "id:" + String(recipeId)
        : "name:" + name.trim().toLowerCase().replace(/\s+/g, " ");

    selectedRating = 0;
    selectedRatingText.textContent = "Select your rating (1–5)";
    reviewStatus.textContent = "";
    reviewForm.reset();
    updateRatingStars();

    recipeModal.hidden = false;
    closeModal.focus();

    loadReviews();
}

function hideRecipe() {
    recipeModal.hidden = true;
}

closeModal.addEventListener("click", hideRecipe);

recipeModal.addEventListener("click", function(event) {
    if (event.target === recipeModal) {
        hideRecipe();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !recipeModal.hidden) {
        hideRecipe();
    }
});


recipeForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("recipeName").value.trim();
    const description = document.getElementById("recipeDescription").value.trim();
    const ingredients = document.getElementById("recipeIngredients").value.trim();
    const instructions = document.getElementById("recipeInstructions").value.trim();

    if (!name || !description || !ingredients || !instructions) {
        alert("Please fill in all fields.");
        return;
    }

    const { data: sessionData, error: sessionError } =
        await window.supabaseClient.auth.getSession();

    if (sessionError || !sessionData.session) {
        alert("Please log in before adding a recipe.");
        return;
    }

    let imageUrl =
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85";

    const lowerName = name.toLowerCase();

    if (lowerName.includes("chole") || lowerName.includes("bhature")) {
        imageUrl = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85";
    } else if (lowerName.includes("pizza")) {
        imageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85";
    } else if (lowerName.includes("burger")) {
        imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85";
    } else if (lowerName.includes("pasta")) {
        imageUrl = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85";
    } else if (lowerName.includes("salad")) {
        imageUrl = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85";
    }

    const submitButton = recipeForm.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
        
const editingId = window.editRecipeId;

const recipeData = {
    title: name,
    description: description,
    ingredients: ingredients,
    instructions: instructions,
    image_url: imageUrl
};

let result;

if (editingId) {
    result = await window.supabaseClient
        .from("recipes")
        .update(recipeData)
        .eq("id", editingId)
        .eq("user_id", sessionData.session.user.id)
        .select("id, user_id, title, description, ingredients, instructions, image_url")
        .single();
} else {
    result = await window.supabaseClient
        .from("recipes")
        .insert({
            ...recipeData,
            user_id: sessionData.session.user.id
        })
        .select("id, user_id, title, description, ingredients, instructions, image_url")
        .single();
}

const { data, error } = result;

if (error) {
    console.error("Recipe save failed:", error);
    alert("Could not save recipe: " + error.message);
    return;
}

if (editingId) {
    window.editRecipeId = null;
    recipeForm.reset();
    alert("Recipe updated successfully! 🎉");
    window.location.reload();
    return;
}


        if (error) {
            console.error("Recipe save failed:", error);
            alert("Could not save recipe: " + error.message);
            return;
        }

        const card = document.createElement("article");
        card.className = "recipe-card";

        const imageBox = document.createElement("div");
        imageBox.className = "recipe-image";

        const photo = document.createElement("img");
        photo.src = data.image_url || imageUrl;
        photo.alt = data.title;
        imageBox.appendChild(photo);

        const info = document.createElement("div");
        info.className = "recipe-info";

        const category = document.createElement("span");
        category.className = "category";
        category.textContent = "COMMUNITY RECIPE";

        const title = document.createElement("h3");
        title.textContent = data.title;

        const descriptionText = document.createElement("p");
        descriptionText.textContent = data.description || "";

        const meta = document.createElement("div");
        meta.className = "recipe-meta";
        meta.textContent = "Homemade favourite";

        const viewButton = document.createElement("button");
        viewButton.type = "button";
        viewButton.className = "view-button";
        viewButton.textContent = "View Recipe →";

        viewButton.addEventListener("click", function() {
            showRecipe(data.title, data.ingredients, data.instructions, data.id);
        });

        info.append(category, title, descriptionText, meta, viewButton);
        card.append(imageBox, info);
        recipeContainer.prepend(card);

        recipeForm.reset();
        searchInput.value = "";
        searchRecipes();

        alert("Recipe saved successfully! 🎉");
    } catch (error) {
        console.error(error);
        alert("Something went wrong while saving the recipe.");
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});

function updateRatingStars() {
    ratingStars.querySelectorAll(".rating-star").forEach(function(star) {
        const rating = Number(star.dataset.rating);
        star.classList.toggle("active", rating <= selectedRating);
        star.setAttribute("aria-pressed", String(rating === selectedRating));
    });
}

ratingStars.addEventListener("click", function(event) {
    const star = event.target.closest(".rating-star");
    if (!star) return;

    selectedRating = Number(star.dataset.rating);
    selectedRatingText.textContent = "You selected " + selectedRating + " out of 5 stars";
    updateRatingStars();
});

async function loadReviews() {
    averageRating.textContent = "Loading ratings...";
    reviewList.replaceChildren();

    const { data, error } = await window.supabaseClient
        .from("recipe_reviews")
        .select("rating, comment, created_at")
        .eq("recipe_key", currentRecipeKey)
        .order("created_at", { ascending: false });

    if (error) {
        averageRating.textContent = "Could not load reviews.";
        console.error("Review loading failed:", error.message);
        return;
    }

    if (!data.length) {
        averageRating.textContent = "No ratings yet.";
        return;
    }

    const total = data.reduce(function(sum, review) {
        return sum + review.rating;
    }, 0);

    averageRating.textContent =
        "⭐ " + (total / data.length).toFixed(1) +
        " / 5 (" + data.length + (data.length === 1 ? " review)" : " reviews)");

    data.forEach(function(review) {
        const item = document.createElement("div");
        item.className = "review-item";

        const stars = document.createElement("p");
        stars.textContent = "⭐".repeat(review.rating);

        const comment = document.createElement("p");
        comment.textContent = review.comment;

        const date = document.createElement("small");
        date.textContent = new Date(review.created_at).toLocaleDateString();

        item.append(stars, comment, date);
        reviewList.appendChild(item);
    });
}

reviewForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (!currentRecipeKey) {
        reviewStatus.textContent = "Please open a recipe first.";
        return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
        reviewStatus.textContent = "Please select a star rating.";
        return;
    }

    const comment = reviewComment.value.trim();

    if (!comment) {
        reviewStatus.textContent = "Please enter a comment.";
        return;
    }

    const { data: sessionData, error: sessionError } =
        await window.supabaseClient.auth.getSession();

    if (sessionError || !sessionData.session) {
        reviewStatus.textContent = "Please log in to submit a review.";
        return;
    }

    const submitButton = reviewForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    reviewStatus.textContent = "Submitting review...";

    try {
        const userId = sessionData.session.user.id;

        const { error } = await window.supabaseClient
            .from("recipe_reviews")
            .upsert({
                recipe_key: currentRecipeKey,
                recipe_title: currentRecipeTitle,
                user_id: userId,
                rating: selectedRating,
                comment: comment
            }, {
                onConflict: "recipe_key,user_id"
            });

        if (error) {
            console.error("Review submission failed:", error.message);
            reviewStatus.textContent = "Could not submit review: " + error.message;
            return;
        }

        reviewStatus.textContent = "Review submitted successfully!";
        reviewForm.reset();
        selectedRating = 0;
        selectedRatingText.textContent = "Select your rating (1–5)";
        updateRatingStars();
        await loadReviews();
    } catch (error) {
        console.error(error);
        reviewStatus.textContent = "Something went wrong. Please try again.";
    } finally {
        submitButton.disabled = false;
    }
});

