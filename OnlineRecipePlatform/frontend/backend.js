
window.supabaseClient = window.supabase.createClient(
  "https://rhqvjsvpfobuseqbafbv.supabase.co",
  "sb_publishable_nSnzkEl_cyrRbCJ7BEOpMQ_dtye4Sv0"
);

console.log("Supabase connected!");

async function loadRecipes() {
  const container = document.getElementById("recipeContainer");

  const { data, error } = await window.supabaseClient
    .from("recipes")
    .select("id, user_id, title, description, ingredients, instructions, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Recipe loading failed:", error.message);
    return;
  }
  const { data: authData } =
  await window.supabaseClient.auth.getSession();

const currentUserId = authData.session?.user?.id;

  data.forEach(function(recipe) {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const imageBox = document.createElement("div");
    imageBox.className = "recipe-image";

    const image = document.createElement("img");
    image.src = recipe.image_url || 
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85";
    image.alt = recipe.title;
    imageBox.appendChild(image);

    const info = document.createElement("div");
    info.className = "recipe-info";

    const category = document.createElement("span");
    category.className = "category";
    category.textContent = "COMMUNITY RECIPE";
    
const title = document.createElement("h3");
title.textContent = recipe.title;

const description = document.createElement("p");
description.textContent = recipe.description || "";

const ingredients = document.createElement("p");
ingredients.textContent = recipe.ingredients;


    const button = document.createElement("button");
    button.type = "button";
    button.className = "view-button";
    button.textContent = "View Recipe →";

button.addEventListener("click", function() {
    showRecipe(
        recipe.title,
        recipe.ingredients,
        recipe.instructions,
        recipe.id
    );
});

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "view-button";
    editButton.textContent = "Edit Recipe ✏️";

    editButton.addEventListener("click", function() {
      document.getElementById("recipeName").value = recipe.title || "";
      document.getElementById("recipeDescription").value = recipe.description || "";
      document.getElementById("recipeIngredients").value = recipe.ingredients || "";
      document.getElementById("recipeInstructions").value = recipe.instructions || "";

      window.editRecipeId = recipe.id;

      recipeForm.scrollIntoView({ behavior: "smooth" });
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "view-button";
    deleteButton.textContent = "Delete Recipe 🗑️";

    deleteButton.addEventListener("click", async function() {
      const confirmed = confirm("Are you sure you want to delete this recipe?");
      if (!confirmed) return;

      const { data: sessionData } =
        await window.supabaseClient.auth.getSession();

      if (!sessionData.session ||
          sessionData.session.user.id !== recipe.user_id) {
        alert("You can only delete your own recipes. Please log in.");
        return;
      }

      const { error } = await window.supabaseClient
        .from("recipes")
        .delete()
        .eq("id", recipe.id)
        .eq("user_id", sessionData.session.user.id);

      if (error) {
        alert("Could not delete recipe: " + error.message);
        return;
      }

      card.remove();
      alert("Recipe deleted successfully!");
    });
    
info.append(category, title, description, ingredients, button);

if (currentUserId === recipe.user_id) {
  info.append(editButton, deleteButton);
}

    card.append(imageBox, info);
    container.appendChild(card);
  });

  console.log("Recipes loaded:", data.length);
}

loadRecipes();

let isLoginMode = false;

const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authMessage = document.getElementById("authMessage");
const authSubmit = document.getElementById("authSubmit");
const toggleAuth = document.getElementById("toggleAuth");
const logoutButton = document.getElementById("logoutButton");
const authStatus = document.getElementById("authStatus");

function updateAuthUI(session) {
    const loggedIn = Boolean(session);

    authTitle.textContent = loggedIn
        ? "Welcome to Quick Kitchen! 🍳"
        : isLoginMode ? "Log In" : "Join Quick Kitchen 🍳";

    authMessage.textContent = loggedIn
        ? "You are logged in. You can share your recipes."
        : "Sign up or log in to share your recipes.";

    document.getElementById("authEmail").hidden = loggedIn;
    document.getElementById("authPassword").hidden = loggedIn;
    authSubmit.hidden = loggedIn;
    toggleAuth.hidden = loggedIn;
    logoutButton.hidden = !loggedIn;

    if (loggedIn) {
        authStatus.textContent = "Logged in as " + session.user.email;
    }
}

toggleAuth.addEventListener("click", function () {
    isLoginMode = !isLoginMode;

    authTitle.textContent = isLoginMode ? "Log In" : "Join Quick Kitchen 🍳";
    authSubmit.textContent = isLoginMode ? "Log In" : "Sign Up";

    toggleAuth.textContent = isLoginMode
        ? "New here? Sign up"
        : "Already have an account? Log in";

    authStatus.textContent = "";
});

authForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;

    authSubmit.disabled = true;
    authStatus.textContent = "Please wait...";

    try {
        const result = isLoginMode
            ? await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            })
            : await window.supabaseClient.auth.signUp({
                email: email,
                password: password
            });

        if (result.error) {
            authStatus.textContent = result.error.message;
            return;
        }

        if (!isLoginMode && !result.data.session) {
            authStatus.textContent =
                "Account created! Check your email to confirm your account, then log in.";
            return;
        }

        authStatus.textContent = isLoginMode
            ? "Login successful!"
            : "Account created successfully!";

        updateAuthUI(result.data.session);
    } catch (error) {
        console.error(error);
        authStatus.textContent = "Something went wrong. Please try again.";
    } finally {
        authSubmit.disabled = false;
    }
});

logoutButton.addEventListener("click", async function () {
    const { error } = await window.supabaseClient.auth.signOut();

    if (error) {
        authStatus.textContent = error.message;
        return;
    }

    authForm.reset();
    isLoginMode = false;
    authSubmit.textContent = "Sign Up";
    toggleAuth.textContent = "Already have an account? Log in";
    authStatus.textContent = "You have logged out.";

    updateAuthUI(null);
});

async function checkLoginStatus() {
    const { data, error } = await window.supabaseClient.auth.getSession();

    if (error) {
        authStatus.textContent = error.message;
        return;
    }

    updateAuthUI(data.session);
}

checkLoginStatus();

window.supabaseClient.auth.onAuthStateChange(function (_event, session) {
    updateAuthUI(session);
});

