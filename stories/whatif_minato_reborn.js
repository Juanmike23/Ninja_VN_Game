window.injectStory({
  whatif_minato_start: {
    text: "Prequel: The night of the Nine-Tails attack. Minato fights to save the village, Kushina, and newborn Naruto. Tragically, his physical body is destroyed, but his soul is sealed into Naruto alongside the Tailed Beast.",
    bgImage: "images/events/ninetails_attack.png",
    choices: [
      { text: "Awaken in Naruto's body", next: "whatif_minato_early" },
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ],
    arc: "start"
  },
  whatif_minato_early: {
    text: "Early Life (Part 1): Minato awakens within Naruto's consciousness, retaining his memories and skills. He deals with the existential trauma of being a ghost in his own son's body before revealing his identity to Hiruzen Sarutobi.",
    bgImage: "images/events/newborn_naruto.png",
    choices: [
      { text: "Join Team 7", next: "whatif_minato_early_pt2" },
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ],
    arc: "early"
  },
  whatif_minato_early_pt2: {
    text: "Early Life (Part 2): Minato joins Team 7 under his former student Kakashi to observe and guide the new generation.",
    bgImage: "images/events/kakashi_bells_training.png",
    choices: [
      { text: "Spar with Kakashi", loadScript: "battle.js", action: () => startBattle("Kakashi Hatake", "whatif_minato_later", "whatif_minato_early_pt2", "Kakashi Bell's Training", window.flyingRaijinSkill) },
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ],
    arc: "early"
  },
  whatif_minato_later: {
    text: "Later Life: Minato struggles with PTSD but masters Uzumaki sealing chains to control the Nine-Tails. He begins uncovering the dark truth behind the Uchiha massacre.",
    bgImage: "images/events/naruto_talks_thirdHokage.png",
    choices: [
      { text: "Enter the Fourth Ninja War", next: "whatif_minato_war" },
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ],
    arc: "middle"
  },
  whatif_minato_war: {
    text: "War: The Fourth Shinobi World War begins. Leading the Allied Shinobi Forces, Minato finally faces the masked man responsible for his original death: his former student, Obito Uchiha.",
    bgImage: "images/events/4th_great_ninja_war.png",
    choices: [
      { text: "Battle Obito Uchiha", loadScript: "battle.js", action: () => startBattle("Obito Uchiha", "whatif_minato_epilogue", "whatif_minato_war", "Battle With Obito", window.flyingRaijinSkill) },
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ],
    arc: "war"
  },
  whatif_minato_epilogue: {
    text: "Epilogue: Minato successfully stops the conflict, achieving a hard-won peace. The world becomes a question wether Minato's envision of peace would actually possible.",
    bgImage: "images/events/5kage_meeting.png",
    choices: [
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ],
    arc: "epilogue"
  }
});