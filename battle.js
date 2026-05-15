let animationId;
let canvas, ctx;
let keys = {};
let battleActive = false;

let player = { x: 50, y: 150, width: 30, height: 30, speed: 3, hp: 100, maxHp: 100, attackCooldown: 0, skillCooldown: 0, facing: 'right' };
let enemy = { x: 300, y: 150, width: 30, height: 30, speed: 1.5, hp: 100, maxHp: 100, attackCooldown: 0, name: "" };

let wNode = "";
let lNode = "";
let battleTitleText = "";
let currentSkill = null;

// Global function to trigger the 2D Canvas fight
window.startBattle = function(enemyName, winSceneId, loseSceneId, battleTitle = "", skill = null) {
  wNode = winSceneId;
  lNode = loseSceneId;
  enemy.name = enemyName;
  battleActive = true;
  battleTitleText = battleTitle;
  currentSkill = skill;
  
  // Reset stats and positions
  player.hp = 100; player.x = 50; player.y = 150; player.attackCooldown = 0; player.skillCooldown = 0; player.facing = 'right';
  enemy.hp = 100; enemy.x = 300; enemy.y = 150; enemy.attackCooldown = 0;
  
  // Setup HTML5 Canvas overlay
  canvas = document.createElement("canvas");
  canvas.id = "battle-canvas";
  canvas.width = 500;
  canvas.height = 300;
  canvas.style.border = "4px solid #333";
  canvas.style.backgroundColor = "#7cfc00"; // Grass green arena
  canvas.style.display = "block";
  canvas.style.margin = "0 auto";
  canvas.style.borderRadius = "8px";
  
  // Hide standard text UI, inject Canvas
  const textDiv = document.getElementById("scene-text");
  const choicesDiv = document.getElementById("choices");
  textDiv.style.display = "none";
  choicesDiv.style.display = "none";
  
  choicesDiv.parentNode.insertBefore(canvas, choicesDiv);
  ctx = canvas.getContext("2d");
  
  // Input Listeners
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  
  // Start 60FPS loop
  gameLoop();
};

function handleKeyDown(e) { keys[e.key.toLowerCase()] = true; }
function handleKeyUp(e) { keys[e.key.toLowerCase()] = false; }

function endBattle(won) {
  battleActive = false;
  cancelAnimationFrame(animationId);
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  canvas.remove();
  
  // Restore UI
  const textDiv = document.getElementById("scene-text");
  const choicesDiv = document.getElementById("choices");
  textDiv.style.display = "block";
  choicesDiv.style.display = "block";
  
  // Transition back into the main story
  showScene(won ? wNode : lNode);
}

function gameLoop() {
  if (!battleActive) return;
  update();
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function update() {
  // Player Movement (W, A, S, D)
  if (keys['w'] && player.y > 0) { player.y -= player.speed; player.facing = 'up'; }
  if (keys['s'] && player.y < canvas.height - player.height) { player.y += player.speed; player.facing = 'down'; }
  if (keys['a'] && player.x > 0) { player.x -= player.speed; player.facing = 'left'; }
  if (keys['d'] && player.x < canvas.width - player.width) { player.x += player.speed; player.facing = 'right'; }
  
  // Player Attack (O)
  if (player.attackCooldown > 0) player.attackCooldown--;
  if (keys['o'] && player.attackCooldown === 0) {
    player.attackCooldown = 30; // Attack speed limiter
    
    // Calculate Hitbox based on facing direction
    let hx = player.x, hy = player.y, hw = player.width, hh = player.height;
    let range = 35; 
    if (player.facing === 'up') { hy -= range; hh += range; }
    else if (player.facing === 'down') { hh += range; }
    else if (player.facing === 'left') { hx -= range; hw += range; }
    else if (player.facing === 'right') { hw += range; }
    
    // Collision detection with Enemy
    if (hx < enemy.x + enemy.width && hx + hw > enemy.x &&
        hy < enemy.y + enemy.height && hy + hh > enemy.y) {
      enemy.hp -= 20; // Player attack damage
      if (enemy.hp <= 0) return endBattle(true);
    }
  }
  
  // Player Skill (P)
  if (player.skillCooldown > 0) player.skillCooldown--;
  if (keys['p'] && player.skillCooldown === 0 && currentSkill) {
    player.skillCooldown = currentSkill.cooldown || 180; // Defaults to a 3-second cooldown
    if (currentSkill.action) currentSkill.action(player, enemy);
    if (enemy.hp <= 0) return endBattle(true);
  }
  
  // Enemy AI (Chase & Attack)
  if (enemy.attackCooldown > 0) enemy.attackCooldown--;
  let dx = player.x - enemy.x;
  let dy = player.y - enemy.y;
  let dist = Math.hypot(dx, dy);
  
  if (dist > 35) { // Walk toward player
    enemy.x += (dx / dist) * enemy.speed;
    enemy.y += (dy / dist) * enemy.speed;
  } else if (enemy.attackCooldown === 0) { // In range, attack!
    enemy.attackCooldown = 60; // Attack speed limiter
    player.hp -= 15; // Enemy attack damage
    if (player.hp <= 0) return endBattle(false);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw Player (Blue square)
  ctx.fillStyle = "#007bff";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Draw Attack Animation (Orange slash effect)
  if (player.attackCooldown > 20) {
     ctx.fillStyle = "rgba(255, 165, 0, 0.7)"; 
     let hx = player.x, hy = player.y, hw = player.width, hh = player.height;
     let range = 35;
     if (player.facing === 'up') { hy -= range; hh = range; }
     else if (player.facing === 'down') { hy += player.height; hh = range; }
     else if (player.facing === 'left') { hx -= range; hw = range; }
     else if (player.facing === 'right') { hx += player.width; hw = range; }
     ctx.fillRect(hx, hy, hw, hh);
  }
  
  // Draw Enemy (Red square)
  ctx.fillStyle = "#dc3545";
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  
  // Draw Health Bars
  ctx.fillStyle = "#000";
  ctx.font = "14px Arial";
  ctx.fillText("You: " + player.hp + " HP", 10, 20);
  ctx.fillText(enemy.name + ": " + enemy.hp + " HP", canvas.width - 130, 20);
  
  ctx.fillStyle = "#28a745"; // Green health
  ctx.fillRect(10, 25, player.hp, 8);
  ctx.fillStyle = "#dc3545"; // Red health
  ctx.fillRect(canvas.width - 130, 25, enemy.hp, 8);

  // Draw Skill Status
  if (currentSkill) {
    ctx.fillStyle = "#000";
    ctx.fillText(`Skill (P): ${currentSkill.name} ` + (player.skillCooldown === 0 ? "[READY]" : `[${Math.ceil(player.skillCooldown/60)}s]`), 10, 45);
    if (currentSkill.draw) currentSkill.draw(ctx, player, enemy);
  }

  // Draw Battle Title
  if (battleTitleText) {
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(battleTitleText, canvas.width / 2, 25);
    ctx.textAlign = "left"; // Reset text alignment
  }
}