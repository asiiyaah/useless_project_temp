import React, { useEffect, useRef } from "react";
import kaboom from "kaboom";
import "./game.css";

export default function BananaCatch({ onWin }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    function resizeCanvas() {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.parentElement.offsetWidth;
        canvasRef.current.height = canvasRef.current.parentElement.offsetHeight;
      }
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const k = kaboom({
      width: canvasRef.current
        ? canvasRef.current.parentElement.offsetWidth
        : window.innerWidth,
      height: canvasRef.current
        ? canvasRef.current.parentElement.offsetHeight
        : window.innerHeight,
      background: [0, 0, 0],
      canvas: canvasRef.current,
      global: false,
    });

    k.loadSprite("banana", "/tip.png");
    k.loadSprite("peel", "/base.png");

    k.scene("game", () => {
      let score = 0;
      let lives = 3;

      const scoreLabel = k.add([
        k.text(`Score: ${score}`, { size: 24 }),
        k.pos(20, 20),
        k.fixed(),
      ]);

      const livesLabel = k.add([
        k.text(`Lives: ${lives}`, { size: 24 }),
        k.pos(k.width() - 20, 20),
        k.anchor("topright"),
        k.fixed(),
      ]);

      const peel = k.add([
        k.sprite("peel"),
        k.pos(k.width() / 2, k.height() - 40),
        k.anchor("center"),
        k.area(),
        k.scale(0.15), // increased size from 0.1
        "peel",
      ]);

      k.onUpdate("peel", (p) => {
        if (k.isKeyDown("left") || k.isKeyDown("a")) p.move(-400, 0);
        if (k.isKeyDown("right") || k.isKeyDown("d")) p.move(400, 0);
        p.pos.x = Math.min(Math.max(p.pos.x, 32), k.width() - 32);
      });

      function spawnBanana() {
        k.add([
          k.sprite("banana"),
          k.pos(k.rand(40, k.width() - 40), 0),
          k.anchor("center"),
          k.area(),
          k.scale(0.15), // increased size from 0.1
          k.move(k.DOWN, 180),
          k.offscreen({ destroy: true }),
          "banana",
        ]);
      }

      k.loop(k.rand(1.5, 2.5), spawnBanana);

      peel.onCollide("banana", (banana) => {
  banana.caught = true;
  k.destroy(banana);
  score++;
  scoreLabel.text = `Score: ${score}`;

  // Keep the kaboom animation
  k.addKaboom(peel.pos);

  // Add funny banana peel text at the kaboom spot
  k.add([
    k.text("SLIP ATTACK! 🍌", { size: 32, align: "center" }),
    k.pos(peel.pos.x, peel.pos.y - 40), // slightly above kaboom
    k.anchor("center"),
    k.color(255, 255, 0), // banana yellow
    k.lifespan(1), // disappears after 1 second
    k.move(k.UP, 20) // floats up
  ]);

  if (score >= 3) {
    onWin();
    k.go("win", { score });
  }
});


      k.on("destroy", "banana", (banana) => {
        if (!banana.caught) {
          lives--;
          livesLabel.text = `Lives: ${lives}`;
          if (lives <= 0) k.go("lose", { score });
        }
      });
    });

    k.scene("win", ({ score }) => {
      k.add([
        k.text(`You Win!\nFinal Score: ${score}`, {
          size: 48,
          align: "center",
        }),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor("center"),
      ]);
    });

    k.scene("lose", ({ score }) => {
      k.add([
        k.text(`Game Over!\nFinal Score: ${score}`, {
          size: 48,
          align: "center",
        }),
        k.pos(k.width() / 2, k.height() / 2 - 80),
        k.anchor("center"),
      ]);

      const btn = k.add([
        k.rect(200, 60, { radius: 8 }),
        k.pos(k.width() / 2, k.height() / 2 + 60),
        k.anchor("center"),
        k.area(),
        k.color(255, 255, 255),
      ]);

      btn.add([
        k.text("Play Again", { size: 28 }),
        k.anchor("center"),
        k.color(0, 0, 0),
      ]);

      btn.onClick(() => k.go("game"));
    });

    k.go("game");

    return () => {
      k.destroyAll();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [onWin]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      ></canvas>
    </div>
  );
}
