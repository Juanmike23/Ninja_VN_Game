window.flyingRaijinSkill = {
  name: "Flying Raijin",
  cooldown: 180, // 3-second cooldown
  action: (player, enemy) => {
    let dashDistance = 150;
    
    // Dash forward based on the direction the player is facing
    if (player.facing === 'up') player.y = Math.max(0, player.y - dashDistance);
    else if (player.facing === 'down') player.y = Math.min(270, player.y + dashDistance); // 300 canvas height - 30 player height
    else if (player.facing === 'left') player.x = Math.max(0, player.x - dashDistance);
    else if (player.facing === 'right') player.x = Math.min(470, player.x + dashDistance); // 500 canvas width - 30 player width
    
    // Deal a small amount of damage if you teleport directly onto the enemy!
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    if (Math.hypot(dx, dy) < 40) {
      enemy.hp -= 20;
    }
  },
  draw: (ctx, player, enemy) => {
    // Draw a "Yellow Flash" trail for 15 frames right after the skill is used
    if (player.skillCooldown > 165) {
      ctx.fillStyle = "rgba(255, 255, 0, 0.5)"; // Transparent yellow
      let hx = player.x, hy = player.y;
      if (player.facing === 'up') { hy += 30; ctx.fillRect(hx, hy, 30, 150); }
      else if (player.facing === 'down') { hy -= 150; ctx.fillRect(hx, hy, 30, 150); }
      else if (player.facing === 'left') { hx += 30; ctx.fillRect(hx, hy, 150, 30); }
      else if (player.facing === 'right') { hx -= 150; ctx.fillRect(hx, hy, 150, 30); }
    }
  }
};