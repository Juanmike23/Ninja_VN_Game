window.injectStory({
  whatif_uchiha_win_start: {
    text: "The Uchiha clan's coup d'état was successful. The Leaf Village is now under the control of the Uchiha Police Force.",
    choices: [
      { text: "Join the resistance", next: "whatif_uchiha_resistance" },
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ]
  },
  whatif_uchiha_resistance: {
    text: "You join the underground resistance led by Kakashi to restore the Will of Fire.",
    choices: [
      { text: "Fight Uchiha Guards", loadScript: "battle.js", action: () => startBattle("Uchiha Guard", "whatif_uchiha_victory", "what_if_menu") },
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ]
  },
  whatif_uchiha_victory: {
    text: "You defeated the guards! The resistance pushes forward into the village core.",
    choices: [
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ]
  }
});