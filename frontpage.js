function initFrontPage() {
  // Find the standard game UI components
  const textDiv = document.getElementById("scene-text");
  const choicesDiv = document.getElementById("choices");
  
  // Hide the game container initially so only the main menu shows
  if (textDiv) textDiv.style.display = "none";
  if (choicesDiv) choicesDiv.style.display = "none";

  // Set the background image for the front page
  document.body.style.backgroundImage = "url('images/frontpage/mainMenu2.png')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  // Create the main menu container dynamically
  const menuContainer = document.createElement("div");
  menuContainer.id = "main-menu";
  menuContainer.style.display = "flex";
  menuContainer.style.flexDirection = "column";
  menuContainer.style.alignItems = "center";
  menuContainer.style.justifyContent = "center";
  menuContainer.style.minHeight = "80vh";
  menuContainer.style.fontFamily = "Arial, sans-serif";
  menuContainer.style.textAlign = "center";
  menuContainer.style.padding = "20px";

  // Add Game Title
  const title = document.createElement("h1");
  title.innerText = "Ninja Story: Alternate Paths";
  title.style.fontSize = "3.5rem";
  title.style.color = "#ff7b00"; // Naruto Orange
  title.style.textShadow = "2px 2px 4px rgba(0,0,0,0.3)";
  title.style.marginBottom = "15px";

  // Add Game Description
  const description = document.createElement("p");
  description.innerText = "Follow the path alternate 'What If' scenarios where a single event may changes everything.";
  description.style.fontSize = "1.2rem";
  description.style.maxWidth = "600px";
  description.style.lineHeight = "1.6";
  description.style.marginBottom = "40px";
  description.style.color = "#ddd"; // Changed to light gray to be visible on a dark card

  // Create a container for the buttons
  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "20px";
  btnContainer.style.flexWrap = "wrap";
  btnContainer.style.justifyContent = "center";

  // Helper function to style buttons
  const styleButton = (btn, bgColor) => {
    btn.style.padding = "15px 30px";
    btn.style.fontSize = "1.2rem";
    btn.style.fontWeight = "bold";
    btn.style.cursor = "pointer";
    btn.style.backgroundColor = bgColor;
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    btn.style.transition = "transform 0.2s, background-color 0.2s";
    
    btn.onmouseover = () => btn.style.transform = "scale(1.05)";
    btn.onmouseout = () => btn.style.transform = "scale(1)";
  };

  const mainStoryBtn = document.createElement("button");
  mainStoryBtn.innerText = "Play Main Story";
  styleButton(mainStoryBtn, "#ff7b00"); // Orange

  const whatIfBtn = document.createElement("button");
  whatIfBtn.innerText = "Explore 'What If' Timelines";
  styleButton(whatIfBtn, "#333"); // Dark Gray

  // Create the horizontal cards container
  const whatIfContainer = document.createElement("div");
  whatIfContainer.style.display = "none"; // Hidden initially
  whatIfContainer.style.gap = "15px";
  whatIfContainer.style.overflowX = "auto";
  whatIfContainer.style.padding = "10px";
  whatIfContainer.style.width = "100%";
  whatIfContainer.style.maxWidth = "800px";
  whatIfContainer.style.marginTop = "20px";

  const whatIfOptions = [
    { title: "Minato Reborn", desc: "What if Minato survived and was sealed in Naruto?", startNode: "whatif_minato_start", script: "stories/whatif_minato_reborn.js" },
    { title: "Time Travel", desc: "What if you woke up before the Uchiha incident?", startNode: "whatif_time_travel_start", script: "stories/whatif_time_travel.js" },
    { title: "Uchiha Victory", desc: "What if the Uchiha coup was successful?", startNode: "whatif_uchiha_win_start", script: "stories/whatif_uchiha_win.js" }
  ];

  whatIfOptions.forEach(opt => {
    const card = document.createElement("div");
    card.style.minWidth = "220px";
    card.style.flex = "0 0 auto"; // Prevent shrinking
    card.style.backgroundColor = "rgba(34, 34, 34, 0.75)";
    card.style.border = "2px solid #444";
    card.style.borderRadius = "8px";
    card.style.padding = "15px";
    card.style.cursor = "pointer";
    card.style.transition = "transform 0.2s, border-color 0.2s";
    
    card.onmouseover = () => { card.style.transform = "scale(1.05)"; card.style.borderColor = "#ff7b00"; };
    card.onmouseout = () => { card.style.transform = "scale(1)"; card.style.borderColor = "#444"; };

    const cardTitle = document.createElement("h3");
    cardTitle.innerText = opt.title;
    cardTitle.style.color = "#ff7b00";
    cardTitle.style.marginTop = "0";

    const cardDesc = document.createElement("p");
    cardDesc.innerText = opt.desc;
    cardDesc.style.color = "#ccc";
    cardDesc.style.fontSize = "0.9rem";

    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    
    card.onclick = () => {
      // Dynamically load the story script before launching the game
      if (!loadedScripts.has(opt.script)) {
        const scriptTag = document.createElement("script");
        scriptTag.src = opt.script;
        scriptTag.onload = () => {
          loadedScripts.add(opt.script);
          startGame(opt.startNode);
        };
        document.body.appendChild(scriptTag);
      } else {
        startGame(opt.startNode);
      }
    };

    whatIfContainer.appendChild(card);
  });

  // Function to transition from the front page into the game
  const startGame = (startNode) => {
    // Remove the main menu UI
    menuContainer.remove();
    
    // Unhide the game UI elements (removes the inline "none" style)
    if (textDiv) textDiv.style.display = "";
    if (choicesDiv) choicesDiv.style.display = "";

    // Remove the background image when the game starts
    document.body.style.backgroundImage = "";

    // Initialize the game systems
    initProgressBar();
    showScene(startNode);
  };

  // Hook up the buttons to their respective timelines
  mainStoryBtn.onclick = () => startGame("start");
  whatIfBtn.onclick = () => {
    whatIfBtn.style.display = "none";
    whatIfContainer.style.display = "flex";
  };

  // Assemble the menu
  btnContainer.appendChild(mainStoryBtn);
  btnContainer.appendChild(whatIfBtn);
  
  menuContainer.appendChild(title);
  menuContainer.appendChild(description);
  menuContainer.appendChild(btnContainer);
  menuContainer.appendChild(whatIfContainer);

  // Inject into the page exactly where the game normally sits
  const container = textDiv ? textDiv.parentNode : document.body;
  container.appendChild(menuContainer);
}

// Bulletproof initialization check
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFrontPage);
} else {
  initFrontPage();
}