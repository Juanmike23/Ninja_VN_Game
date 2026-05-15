const story = {
  start: {
    text: "Prequel: You are an academy student in the Hidden Leaf Village, struggling to pass the graduation exam.",
    choices: [
      { text: "Master the Shadow Clone Jutsu", next: "early" },
      { text: "Back to Main Menu", action: () => window.location.reload() }
    ]
  },

  what_if_menu: {
    text: "Welcome to the Nexus of Timelines. Which alternate reality will you explore?",
    choices: [
      { text: "What If: Minato Reborn", next: "whatif_minato_start", loadScript: "stories/whatif_minato_reborn.js" },
      { text: "What If: Time Travel", next: "whatif_time_travel_start", loadScript: "stories/whatif_time_travel.js" },
      { text: "What If: Uchiha Victory", next: "whatif_uchiha_win_start", loadScript: "stories/whatif_uchiha_win.js" },
      { text: "Back to Main Menu", action: () => window.location.reload() }
    ]
  },

  early: {
    text: "Early: You are now a Genin. You join Team 7, face Zabuza in the Land of Waves, and enter the Chunin Exams.",
    choices: [
      { text: "Leave the village to train with Jiraiya", next: "middle" }
    ]
  },

  middle: {
    text: "Middle: Years later, you return. The Akatsuki is on the move, and you must protect the Tailed Beasts.",
    choices: [
      { text: "Enter the battlefield", next: "war" }
    ]
  },

  war: {
    text: "War: The Fourth Great Ninja War has erupted. You fight alongside the Allied Shinobi Forces to save the world.",
    choices: [
      { text: "End the cycle of hatred", next: "epilogue" }
    ]
  },

  epilogue: {
    text: "Epilogue: The war is over. You have achieved your dream of becoming Hokage, bringing a new era of peace.",
    choices: [
      { text: "Restart the legend", next: "start" }
    ]
  }
};

let currentScene = "start";
const loadedScripts = new Set(); // Keeps track of loaded files so we don't inject them twice
let sceneHistory = [];
let historyIndex = -1;

// Global function that external scripts will use to add their scenes to the main story
window.injectStory = function(newStoryNodes) {
  Object.assign(story, newStoryNodes);
};

const arcOrder = ["start", "early", "middle", "war", "epilogue"];

function initProgressBar() {
  const header = document.createElement("div");
  header.id = "progress-header";
  header.style.display = "flex";
  header.style.justifyContent = "center";
  header.style.alignItems = "flex-start";
  header.style.width = "100%";
  header.style.marginBottom = "30px";
  header.style.marginTop = "20px";

  const arcNames = {
    start: "Prequel",
    early: "Early",
    middle: "Middle",
    war: "War",
    epilogue: "Epilogue"
  };

  arcOrder.forEach((arc, index) => {
    const nodeContainer = document.createElement("div");
    nodeContainer.style.display = "flex";
    nodeContainer.style.flexDirection = "column";
    nodeContainer.style.alignItems = "center";

    const dot = document.createElement("div");
    dot.id = `dot-${arc}`;
    dot.style.width = "20px";
    dot.style.height = "20px";
    dot.style.borderRadius = "50%";
    dot.style.backgroundColor = "#ccc";
    dot.style.transition = "background-color 0.3s";
    dot.title = arcNames[arc]; // Shows a tooltip popup when hovering over the dot
    
    const label = document.createElement("div");
    label.id = `label-${arc}`;
    label.innerText = arcNames[arc];
    label.style.marginTop = "8px";
    label.style.fontSize = "14px";
    label.style.fontWeight = "bold";
    label.style.opacity = "0"; // Hidden by default
    label.style.transition = "opacity 0.3s";

    nodeContainer.appendChild(dot);
    nodeContainer.appendChild(label);
    header.appendChild(nodeContainer);

    if (index < arcOrder.length - 1) {
      const line = document.createElement("div");
      line.id = `line-${arc}`;
      line.style.width = "50px";
      line.style.height = "4px";
      line.style.backgroundColor = "#ccc";
      line.style.transition = "background-color 0.3s";
      line.style.marginTop = "8px"; // Pushes the line down to match the vertical center of the 20px dot
      header.appendChild(line);
    }
  });

  const textDiv = document.getElementById("scene-text");
  const container = textDiv ? textDiv.parentNode : document.body;
  
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.insertBefore(header, textDiv || document.body.firstChild);
}

function updateProgressBar(sceneId) {
  const scene = story[sceneId];
  const targetArc = (scene && scene.arc) ? scene.arc : sceneId;
  const currentIndex = arcOrder.indexOf(targetArc);

  if (currentIndex === -1) return; // If it's a branch/what-if scenario, keep the main arc progress

  arcOrder.forEach((arc, index) => {
    const dot = document.getElementById(`dot-${arc}`);
    if (dot) dot.style.backgroundColor = index <= currentIndex ? "#ff7b00" : "#ccc"; // Naruto Orange

    const label = document.getElementById(`label-${arc}`);
    if (label) {
      label.style.opacity = index === currentIndex ? "1" : "0"; // Only show text for the current arc
    }

    if (index < arcOrder.length - 1) {
      const line = document.getElementById(`line-${arc}`);
      if (line) line.style.backgroundColor = index < currentIndex ? "#ff7b00" : "#ccc";
    }
  });
}

function showScene(sceneId, isHistoryNav = false) {
  if (!isHistoryNav) {
    sceneHistory = sceneHistory.slice(0, historyIndex + 1);
    sceneHistory.push(sceneId);
    historyIndex++;
  }

  const scene = story[sceneId];
  currentScene = sceneId;

  // Apply background image if the scene has one defined
  if (scene.bgImage) {
    document.body.style.backgroundImage = `url('${scene.bgImage}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else {
    document.body.style.backgroundImage = ""; // Clear background if not specified
  }

  const sceneText = typeof scene.text === "function" ? scene.text() : scene.text;
  document.getElementById("scene-text").innerText = sceneText;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  updateProgressBar(sceneId);

  // --- History Navigation Controls ---
  const navDiv = document.createElement("div");
  navDiv.style.display = "flex";
  navDiv.style.justifyContent = "center";
  navDiv.style.gap = "15px";
  navDiv.style.marginBottom = "20px";
  navDiv.style.width = "100%";

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "◄ Previous";
  prevBtn.disabled = historyIndex <= 0;
  prevBtn.onclick = () => {
    historyIndex--;
    showScene(sceneHistory[historyIndex], true);
  };

  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next ►";
  nextBtn.disabled = historyIndex >= sceneHistory.length - 1;
  nextBtn.onclick = () => {
    historyIndex++;
    showScene(sceneHistory[historyIndex], true);
  };

  navDiv.appendChild(prevBtn);
  navDiv.appendChild(nextBtn);
  choicesDiv.appendChild(navDiv);

  if (historyIndex < sceneHistory.length - 1) {
    const pastNotice = document.createElement("p");
    pastNotice.innerText = "(Viewing History - Navigate forward to continue making choices)";
    pastNotice.style.fontStyle = "italic";
    pastNotice.style.color = "#888";
    pastNotice.style.textAlign = "center";
    pastNotice.style.width = "100%";
    choicesDiv.appendChild(pastNotice);
    return; // Stop running here, so we skip showing choices for past events
  }

  const sceneChoices = typeof scene.choices === "function" ? scene.choices() : scene.choices;
  sceneChoices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    
    if (/(return|flee|cancel|exit|back)/i.test(choice.text)) {
      btn.style.backgroundColor = "#dc3545";
      btn.style.color = "white";
    }
    
    btn.onclick = () => {
      if (choice.loadScript && !loadedScripts.has(choice.loadScript)) {
        const script = document.createElement("script");
        script.src = choice.loadScript;
        script.onload = () => {
          loadedScripts.add(choice.loadScript);
          if (choice.action) choice.action();
          else showScene(choice.next);
        };
        document.body.appendChild(script);
      } else {
        if (choice.action) choice.action();
        else showScene(choice.next);
      }
    };
    choicesDiv.appendChild(btn);
  });
}

// Game initialization is now handled by index.js!