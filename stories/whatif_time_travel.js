window.injectStory({
  whatif_time_travel_start: {
    text: "A strange jutsu misfires during the War. You wake up years in the past, right before the Uchiha incident.",
    choices: [
      { text: "Find Itachi and warn him", next: "whatif_time_travel_itachi" },
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ]
  },
  whatif_time_travel_itachi: {
    text: "You intercept Itachi before the fateful night. Together, you uncover a peaceful resolution for the clan.",
    choices: [
      { text: "Return to Main Menu", action: () => window.location.reload() }
    ]
  }
});