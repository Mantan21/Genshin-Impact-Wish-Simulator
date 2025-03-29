export default class HealthBar {
  constructor(x, y, w, h, maxHealth, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.maxHealth = maxHealth;
    this.maxWidth = w;
    this.health = maxHealth;
    this.color = color;
    this.targetWidth = w;
    this.animationSpeed = 0.2;
  }

  show(context) {
    context.lineWidth = 2;
    context.strokeStyle = "#AF0B15";
    context.fillStyle = this.color;

    this.w += (this.targetWidth - this.w) * this.animationSpeed;

    context.fillRect(this.x, this.y, this.w, this.h);
    context.strokeRect(this.x, this.y, this.maxWidth, this.h);
  }

  updateHealth(val) {
    if (val >= 0) {
      this.health = val;
      this.targetWidth = (this.health / this.maxHealth) * this.maxWidth;
    }
  }
}

//Source: Fahad Haidari, https://github.com/fahadhaidari/