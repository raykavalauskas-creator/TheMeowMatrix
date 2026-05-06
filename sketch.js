let mode = 0;
let splash;
let circles = [];
let sounds = [];
let amps = [];

let pitchSlider;

let columns = 4;
let rows = 1;

let filenames = 
    [
  "BassC.mp3",
  "MainC.mp3",
  "ArpC.mp3",
  "PercC.mp3"
    ];

let volumeSliders = [];

let meowSound;
let meowPulse = 0;
let meowRipple = 0;

let catImg;

let rainCats = [];
let rainTimer = 0;

function preload() 
{

  for (let i = 0; i < columns * rows; i++) 
  {
    let file = filenames[i % filenames.length];

    sounds[i] = loadSound(
      "Sound/" + file,
      () => console.log("loaded:", file),
      () => console.log("failed:", file)
    );
  }

  meowSound = loadSound("Sound/MeowC.mp3");
  catImg = loadImage("assets/cat.gif");
}

function setup() 
{
  createCanvas(windowWidth, windowHeight);

  splash = new Splash();
  buildGrid();

  for (let i = 0; i < sounds.length; i++) 
  {
    amps[i] = new p5.Amplitude();
    amps[i].setInput(sounds[i]);
  }
}

function buildGrid() 
{
  circles = [];

  let spacingX = width / columns;
  let spacingY = height / rows;

  let index = 0;

  for (let j = 0; j < rows; j++) 
  {
    for (let i = 0; i < columns; i++) 
    {

      let base = min(spacingX, spacingY) * 0.5;

      circles.push
      ({
        x: i * spacingX + spacingX / 2,
        y: j * spacingY + spacingY / 2,
        baseSize: base,
        size: base,
        soundIndex: index
      });

      index++;
    }
  }
}

function buildUI() 
{

  pitchSlider = createSlider(0.5, 2, 1, 0.01);
  pitchSlider.position(20, 20);
  pitchSlider.style('width', '200px');
  pitchSlider.hide();

  volumeSliders = [];

  for (let i = 0; i < sounds.length; i++) 
  {
    let s = createSlider(0, 1, 0, 0.01);
    s.position(20, 80 + i * 40);
    s.style('width', '120px');
    s.hide();
    volumeSliders[i] = s;
  }
}

function showUI() 
{
  pitchSlider.show();
  for (let s of volumeSliders) s.show();
}

function getActiveCatCount() 
{
  let count = 0;
  for (let s of volumeSliders) 
  {
    if (s.value() > 0) count++;
  }
  return count;
}

function spawnRainCat(extra = false) 
{
  let active = getActiveCatCount();

  rainCats.push({
    x: random(width),
    y: -50,
    size: random(30, 80) * (1 + active * 0.05),
    speed: random(2, 6) + active * 0.15,
    drift: random(-1, 1),
    gold: extra
  });
}

function updateRainCats() 
{
  rainTimer++;

  let active = getActiveCatCount();

  let spawnRate = int(map(active, 0, volumeSliders.length, 18, 3));
  spawnRate = max(2, spawnRate);

  if (rainTimer % spawnRate === 0) 
  {
    let burst = int(map(active, 0, volumeSliders.length, 1, 4));

    for (let i = 0; i < burst; i++) 
    {
      spawnRainCat(false);
    }
  }

  for (let c of rainCats) 
  {
    c.y += c.speed;
    c.x += c.drift;
  }

  rainCats = rainCats.filter(c => c.y < height + 100);
}

function drawRainCats() 
{
  imageMode(CENTER);

  for (let c of rainCats) 
  {
    push();
    translate(c.x, c.y);

    if (catImg) 
    {
      if (c.gold) 
      {
        tint(255, 215, 0);
      } else {
        noTint();
      }

      image(catImg, 0, 0, c.size, c.size);
    }

    pop();
  }

  noTint();
}

function draw() 
{
  background(30);

  if (mode === 0) 
  {
    splash.draw();
  }

  if (mode === 1) 
  {

    meowPulse *= 0.88;
    if (meowPulse < 0.01) meowPulse = 0;

    if (meowPulse > 0) meowRipple += 10;
    else meowRipple = 0;

    let rateValue = pitchSlider.value();
    for (let s of sounds) {
      if (s && s.isPlaying()) {
        s.rate(rateValue);
      }
    }

    for (let i = 0; i < sounds.length; i++) 
    {
      if (sounds[i] && sounds[i].isLoaded()) 
      {
        sounds[i].setVolume(volumeSliders[i].value());
      }
    }

    updateRainCats();
    drawRainCats();

    imageMode(CENTER);

    for (let c of circles) 
    {

      let level = amps[c.soundIndex].getLevel();

      let pulse = map(level, 0, 0.3, 0.8, 2.2);
      pulse *= 1 + meowPulse * 0.25;

      c.size = lerp(c.size, c.baseSize * pulse, 0.2);

      let v = volumeSliders[c.soundIndex].value();

      push();
      translate(c.x, c.y);

      if (v > 0) 
      {
        drawingContext.shadowBlur = 25;
        drawingContext.shadowColor = "gold";
        tint(255);
      } else {
        drawingContext.shadowBlur = 0;
        tint(120);
      }

      if (catImg) 
      {
        image(catImg, 0, 0, c.size, c.size);
      }

      pop();
    }

    noTint();
    drawingContext.shadowBlur = 0;

    if (meowPulse > 0) 
    {
      noFill();

      stroke(212, 175, 55, 200 * meowPulse);
      strokeWeight(4);
      ellipse(width / 2, height / 2, meowRipple * 5);

      stroke(255, 220, 120, 120 * meowPulse);
      strokeWeight(2);
      ellipse(width / 2, height / 2, (meowRipple - 80) * 2);

      stroke(255, 255, 255, 60 * meowPulse);
      strokeWeight(1);
      ellipse(width / 2, height / 2, (meowRipple - 160) * 2);
    }
  }
}

function mousePressed() 
{
  if (mode === 0 && splash.update()) 
  {
    mode = 1;
    splash.hide();

    for (let s of sounds) {
      if (s && s.isLoaded()) 
      {
        s.loop();
        s.setVolume(0);
      }
    }

    buildUI();
    showUI();
  }

  if (mode !== 1) return;

  for (let c of circles) 
  {
    let d = dist(mouseX, mouseY, c.x, c.y);

    if (d < c.baseSize / 2) 
    {
      let slider = volumeSliders[c.soundIndex];
      slider.value(slider.value() > 0 ? 0 : 0.6);
    }
  }
}

function keyPressed() 
{
  if (mode !== 1) return;

  if (key === 'm' || key === 'M') 
  {
    if (meowSound && meowSound.isLoaded()) 
    {

      meowSound.rate(pitchSlider.value());
      meowSound.stop();
      meowSound.play();

      meowPulse = 1.5;
      meowRipple = 0;

      spawnRainCat(true);
    }
  }
}

function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);

  if (splash) splash.onResize();

  if (mode === 1) 
  {
    buildGrid();

    pitchSlider.position(20, 20);

    for (let i = 0; i < volumeSliders.length; i++) 
    {
      volumeSliders[i].position(20, 80 + i * 40);
    }
  }
}