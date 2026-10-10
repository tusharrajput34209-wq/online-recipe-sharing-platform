
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const recipeContainer = document.getElementById("recipeContainer");
const recipeForm = document.getElementById("recipeForm");
const recipeModal = document.getElementById("recipeModal");
const closeModal = document.getElementById("closeModal");
const noResults = document.getElementById("noResults");

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

function showRecipe(name, ingredients, instructions) {
    document.getElementById("modalTitle").textContent = name;
    document.getElementById("modalIngredients").textContent = ingredients;
    document.getElementById("modalInstructions").textContent = instructions;

    recipeModal.hidden = false;
    closeModal.focus();
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
            showRecipe(data.title, data.ingredients, data.instructions);
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
