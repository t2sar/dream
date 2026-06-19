import React, { useEffect, useRef } from 'react';

interface WeatherParticlesProps {
  isMonsoon: boolean;
  isNight: boolean;
  isAutumn?: boolean;
  isWinter?: boolean;
}

export const WeatherParticles: React.FC<WeatherParticlesProps> = ({ isMonsoon, isNight, isAutumn, isWinter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Handle resize
    const setSize = () => {
      // Get parent element dimensions or window
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    setSize();
    window.addEventListener('resize', setSize);

    // Particles state
    const raindrops = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 8 + 4,
      opacity: Math.random() * 0.3 + 0.1
    }));

    const fireflies = Array.from({ length: 25 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      seed: Math.random() * Math.PI * 2,
      speedSine: Math.random() * 0.002 + 0.001
    }));

    const leaves = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 4,
      speedX: (Math.random() - 0.5) * 2,
      speedY: Math.random() * 2 + 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
      color: Math.random() > 0.5 ? '#d97706' : Math.random() > 0.5 ? '#b45309' : '#ea580c' // amber/orange
    }));

    const snowflakes = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1,
      speedY: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.6 + 0.2
    }));

    let lastRenderTime = 0;

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (time - lastRenderTime < 33) return; // ~30 fps max
      lastRenderTime = time;

      ctx.clearRect(0, 0, width, height);

      if (isMonsoon) {
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        raindrops.forEach(drop => {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200, 220, 255, ${drop.opacity})`;
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - drop.length * 0.2, drop.y + drop.length);
          ctx.stroke();

          // Move
          drop.y += drop.speed;
          drop.x -= drop.speed * 0.2;

          // Reset
          if (drop.y > height || drop.x < 0) {
            drop.y = -drop.length;
            drop.x = Math.random() * width + 50;
          }
        });
      }

      if (isAutumn) {
        leaves.forEach(leaf => {
          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate((leaf.rotation * Math.PI) / 180);
          ctx.beginPath();
          ctx.fillStyle = leaf.color;
          // Draw a simple leaf shape
          ctx.ellipse(0, 0, leaf.size, leaf.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          leaf.y += leaf.speedY;
          leaf.x += leaf.speedX + Math.sin(leaf.rotation * 0.05) * 0.5;
          leaf.rotation += leaf.rotationSpeed;

          if (leaf.y > height) {
            leaf.y = -20;
            leaf.x = Math.random() * width;
          }
        });
      }

      if (isWinter) {
        ctx.fillStyle = 'white';
        snowflakes.forEach(flake => {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
          ctx.globalAlpha = flake.opacity;
          ctx.fill();
          
          flake.y += flake.speedY;
          flake.x += flake.speedX;

          if (flake.y > height) {
            flake.y = -10;
            flake.x = Math.random() * width;
          }
        });
        ctx.globalAlpha = 1.0;
      }

      if (isNight) {
        const time = Date.now();
        fireflies.forEach(firefly => {
          const sinePhase = time * firefly.speedSine + firefly.seed;
          const intensity = (Math.sin(sinePhase) + 1) / 2;
          
          if (intensity > 0.05) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 223, 0, ${intensity * 0.9})`;
            ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 200, 0, ${intensity * 0.2})`;
            ctx.arc(firefly.x, firefly.y, firefly.size * 3.5, 0, Math.PI * 2);
            ctx.fill();
          }

          firefly.x += firefly.speedX;
          firefly.y += Math.sin(sinePhase) * 0.3 + firefly.speedY;

          if (firefly.x < 0) firefly.x = width;
          if (firefly.x > width) firefly.x = 0;
          if (firefly.y < 0) firefly.y = height;
          if (firefly.y > height) firefly.y = 0;
        });
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMonsoon, isNight, isAutumn, isWinter]);

  if (!isMonsoon && !isNight && !isAutumn && !isWinter) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10" 
      style={{ mixBlendMode: isNight && !isWinter ? 'screen' : 'normal' }}
    />
  );
};
