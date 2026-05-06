class Splash {

  constructor() {
    this.splashBorder = 100;

    this.title = createDiv("Meow Matrix");
    this.title.style('color', '#009688');
    this.title.style('font-family', 'Arial, Helvetica, sans-serif');

    this.name = createDiv("Rayna Kavalauskas");

    this.info = createDiv(
      "This is a p5.js sound grid instrument.<p>" +
      "Click the gray cats to toggle looping sounds.<p>" +
       "Click m to make a sound.<p>" +
       "Drag on the top slider to adjust pitch.<p>" +
      "Drag the bottom sliders to adjust individual volume.<p>" +

      "<a href='https://editor.p5js.org/raykavalauskas/sketches/OYUM8ZhpO'>view code</a>"
    );

    this.positionElements();
  }

  draw() {
    push();

    fill(255);
    stroke(255, 0, 0);
    strokeWeight(1);

    rect(
      this.splashBorder,
      this.splashBorder,
      windowWidth - this.splashBorder * 2,
      windowHeight - this.splashBorder * 2
    );

    // close button
    stroke(0, 0, 222);
    strokeWeight(3);

    line(
      windowWidth - this.splashBorder - 40,
      this.splashBorder + 20,
      windowWidth - this.splashBorder - 20,
      this.splashBorder + 40
    );

    line(
      windowWidth - this.splashBorder - 20,
      this.splashBorder + 20,
      windowWidth - this.splashBorder - 40,
      this.splashBorder + 40
    );

    pop();
  }

  update() {
    return (
      mouseX > windowWidth - this.splashBorder - 40 &&
      mouseX < windowWidth - this.splashBorder - 20 &&
      mouseY > this.splashBorder + 20 &&
      mouseY < this.splashBorder + 40
    );
  }

  positionElements() {
    this.title.position(this.splashBorder + 20, this.splashBorder + 20);
    this.name.position(this.splashBorder + 20, this.splashBorder + 60);

    this.info.position(
      this.splashBorder + 20,
      this.splashBorder + 100
    );

    this.info.size(
      windowWidth - this.splashBorder * 2 - 50,
      windowHeight - this.splashBorder * 2 - 50
    );
  }

  hide() {
    this.title.remove();
    this.name.remove();
    this.info.remove();
  }

  onResize() {
    this.positionElements();
  }
}
