import React, { useRef, useEffect } from 'react';
import { Habit } from '../types';

interface NativePlantCanvasProps {
  habit: Habit;
  className?: string;
}

export const NativePlantCanvas: React.FC<NativePlantCanvasProps> = ({ habit, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isIntersecting = true;
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    });
    observer.observe(canvas);

    let animationFrameId: number;
    let lastDrawTime = 0;

    // Hash to assign asset type deterministically based on habit ID
    let hash = 0;
    for (let i = 0; i < habit.id.length; i++) hash += habit.id.charCodeAt(i);
    const assetTypes = ['Mango', 'Banana', 'Jackfruit'];
    const assetType = assetTypes[hash % assetTypes.length];

    // State object extraction
    const streakDays = habit.streak || 0;
    const isWilted = habit.plantStatus === 'Wilting' || habit.plantStatus === 'Critical' || (habit.plantHealth ?? 100) < 50; 
    
    // Scale Modifier
    // 1-3 days -> ~0.25, 21+ days -> 1.0. 
    let scale = 0.25 + (Math.min(Math.max(streakDays, 0), 21) / 21) * 0.75;

    // Time offset for wind so they don't all sway exactly the same phase
    const timeOffset = hash % 1000;

    const draw = (time: number) => {
      animationFrameId = requestAnimationFrame(draw);
      
      if (!isIntersecting) return;
      if (time - lastDrawTime < 50) return; // ~20 FPS limit
      lastDrawTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Ground center coordinate in canvas space
      ctx.translate(canvas.width / 2, canvas.height - 20);
      
      // Apply wilt modifier global rotate + color shift
      let rgbTrunk = [92, 64, 51]; // Dark brown
      let rgbCanopy = [34, 139, 34]; // Forest green
      if (assetType === 'Banana') rgbCanopy = [90, 205, 50]; // Vibrant lighter green
      if (assetType === 'Jackfruit') rgbCanopy = [15, 90, 25]; // Dark green dense

      if (isWilted) {
         // Tilt 8 degrees downward (to the side)
         ctx.rotate(8 * Math.PI / 180);
         // Shift colors towards olive-brown / muted tones
         rgbTrunk = [107, 100, 71]; 
         rgbCanopy = [128, 128, 60]; 
      }

      ctx.scale(scale, scale);

      // Wind rustle matrix for canopy
      // Sway 2-3 degrees back and forth
      const clock = (time + timeOffset) / 2000; // time factor
      const swayAngle = Math.sin(clock * Math.PI * 2) * (3 * Math.PI / 180); // 3 degrees sway length
      
      const drawMangoTree = () => {
         // Thick central trunk
         ctx.save();
         ctx.fillStyle = `rgb(${rgbTrunk.join(',')})`;
         ctx.beginPath();
         ctx.moveTo(-15, 0);
         ctx.quadraticCurveTo(-10, -50, -20, -90);
         ctx.lineTo(20, -90);
         ctx.quadraticCurveTo(10, -50, 15, 0);
         ctx.fill();
         
         // Trunk texture lines
         ctx.strokeStyle = `rgba(0,0,0,0.15)`;
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(-5, 0); ctx.quadraticCurveTo(0, -45, -5, -80);
         ctx.moveTo(5, 0);  ctx.quadraticCurveTo(8, -45, 5, -80);
         ctx.stroke();
         ctx.restore();

         // Canopy Layer (skewed by wind)
         ctx.save();
         ctx.translate(0, -80);
         // Apply dynamic horizontal skew transformation matrix directly to the canopy layer paths
         ctx.transform(1, 0, Math.tan(swayAngle), 1, 0, 0);

         // Heavy rounded green canopy layer
         ctx.fillStyle = `rgb(${rgbCanopy.join(',')})`;
         ctx.beginPath();
         ctx.arc(0, -40, 55, 0, Math.PI * 2);
         ctx.arc(-35, -15, 45, 0, Math.PI * 2);
         ctx.arc(35, -15, 45, 0, Math.PI * 2);
         ctx.arc(0, 10, 35, 0, Math.PI * 2);
         ctx.arc(-20, -60, 45, 0, Math.PI * 2);
         ctx.arc(20, -60, 45, 0, Math.PI * 2);
         ctx.fill();

         // Ripening fruits (Mangoes) dynamically shifting colors based on streak
         const baseStreak = Math.max(21, habit.lastHarvestStreak ?? 21);
         const ripeRatio = Math.min(Math.max((streakDays - baseStreak) / 7, 0), 1);
         const r = Math.round(34 + (255 - 34) * ripeRatio);
         const g = Math.round(139 + (180 - 139) * ripeRatio);
         const b = Math.round(34 + (0 - 34) * ripeRatio);
         
         const fruitPositions = [
           {x: -30, y: -20, rot: 0.2},
           {x: 15, y: -50, rot: -0.1},
           {x: 35, y: -10, rot: 0.3},
           {x: -10, y: 5, rot: -0.2},
           {x: 0, y: -70, rot: 0.1}
         ];

         const fillStyleColor = isWilted ? 'rgb(140, 110, 50)' : `rgb(${r},${g},${b})`;

         fruitPositions.forEach(p => {
           ctx.save();
           ctx.translate(p.x, p.y);
           ctx.rotate(p.rot);
           ctx.fillStyle = fillStyleColor;
           ctx.beginPath();
           ctx.ellipse(0, 0, 8, 14, 0, 0, Math.PI * 2);
           ctx.fill();
           // Little stem
           ctx.strokeStyle = `rgb(${rgbTrunk.join(',')})`;
           ctx.lineWidth = 2;
           ctx.beginPath();
           ctx.moveTo(0, -14); ctx.lineTo(2, -20);
           ctx.stroke();
           ctx.restore();
         });
         ctx.restore();
      };

      const drawBananaPlant = () => {
         // Pseudo-stem trunk base
         ctx.save();
         ctx.fillStyle = `rgb(${Math.max(rgbTrunk[0]-40,0)}, ${rgbTrunk[1]+60}, ${rgbTrunk[2]+20})`;
         ctx.beginPath();
         // Wide base taper to top
         ctx.moveTo(-20, 0);
         ctx.quadraticCurveTo(-10, -50, -8, -100);
         ctx.lineTo(8, -100);
         ctx.quadraticCurveTo(10, -50, 20, 0);
         ctx.fill();
         // Stem ribbing texture
         ctx.strokeStyle = 'rgba(0,100,0,0.2)';
         ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.moveTo(-10, 0); ctx.lineTo(-4, -100);
         ctx.moveTo(0, 0); ctx.lineTo(0, -100);
         ctx.moveTo(10, 0); ctx.lineTo(4, -100);
         ctx.stroke();
         ctx.restore();

         // Fanning broad elongated leaves
         ctx.save();
         ctx.translate(0, -90);
         // Apply wind skew matrix natively
         ctx.transform(1, 0, Math.tan(swayAngle * 1.5), 1, 0, 0);

         ctx.fillStyle = `rgb(${rgbCanopy.join(',')})`;
         
         const drawLeaf = (rot: number, scaleX: number, scaleY: number) => {
           ctx.save();
           ctx.rotate(rot);
           ctx.scale(scaleX, scaleY);
           
           ctx.beginPath();
           ctx.moveTo(0,0);
           ctx.bezierCurveTo(40, -10, 80, -30, 110, -10);
           ctx.bezierCurveTo(80, 10, 40, 20, 0, 0);
           ctx.fill();
           
           // Core leaf vein
           ctx.beginPath();
           ctx.moveTo(0,0);
           ctx.quadraticCurveTo(50, -10, 105, -10);
           ctx.strokeStyle = 'rgba(0,50,0,0.3)';
           ctx.lineWidth = 2;
           ctx.stroke();

           // Leaf tear accents (character of banana leaves)
           ctx.beginPath();
           ctx.moveTo(70, -22); ctx.lineTo(65, -10);
           ctx.moveTo(40, 15); ctx.lineTo(45, -5);
           ctx.strokeStyle = 'rgba(255,255,255,0.4)';
           ctx.lineWidth = 1;
           ctx.stroke();

           ctx.restore();
         };

         // Fanning outward
         drawLeaf(-Math.PI / 1.5, 0.9, 1);
         drawLeaf(-Math.PI / 2.2, 1.1, 1);
         drawLeaf(Math.PI / 1.5, -0.9, 1);
         drawLeaf(Math.PI / 2.5, -1.2, 1);
         drawLeaf(-Math.PI / 8, 0.8, 1);
         drawLeaf(Math.PI / 6, -0.8, 1);

         // Banana bunch (Pacha logic)
         if (streakDays >= 21) {
            ctx.save();
            const baseStreak = Math.max(21, habit.lastHarvestStreak ?? 21);
            const ripeRatio = Math.min(Math.max((streakDays - baseStreak) / 7, 0), 1);
            const r = Math.round(34 + (255 - 34) * ripeRatio);
            const g = Math.round(139 + (220 - 139) * ripeRatio);
            const b = Math.round(34 + (50 - 34) * ripeRatio);
            
            ctx.translate(-5, -60);
            ctx.fillStyle = isWilted ? 'rgb(120, 100, 40)' : `rgb(${r},${g},${b})`;
            
            // Draw a bunch of bananas
            for(let i=0; i<8; i++) {
               ctx.beginPath();
               ctx.ellipse(i*4 - 15, i*2, 4, 12, Math.PI/4 + i*0.1, 0, Math.PI*2);
               ctx.fill();
               // Stem line
               ctx.strokeStyle = 'rgba(0,50,0,0.5)';
               ctx.lineWidth = 1;
               ctx.stroke();
            }
            
            // Big purple banana flower at the bottom
            ctx.fillStyle = '#6b21a8';
            ctx.beginPath();
            ctx.moveTo(-2, 18);
            ctx.lineTo(-8, 35);
            ctx.lineTo(2, 30);
            ctx.fill();
            
            ctx.restore();
         }

         ctx.restore();
      };

      const drawJackfruitTree = () => {
         // Stout trunk
         ctx.save();
         ctx.fillStyle = `rgb(${rgbTrunk.join(',')})`;
         ctx.beginPath();
         ctx.moveTo(-25, 0);
         ctx.quadraticCurveTo(-20, -50, -15, -110);
         ctx.lineTo(15, -110);
         ctx.quadraticCurveTo(20, -50, 25, 0);
         ctx.fill();
         ctx.restore();

         // Jackfruits clustered directly to the trunk
         ctx.save();
         const baseStreak = Math.max(21, habit.lastHarvestStreak ?? 21);
         const ripeRatio = Math.min(Math.max((streakDays - baseStreak) / 7, 0), 1);
         const r = Math.round(34 + (180 - 34) * ripeRatio);
         const g = Math.round(139 + (200 - 139) * ripeRatio);
         const b = Math.round(34 + (50 - 34) * ripeRatio);
         
         const jfPositions = [
           {x: -18, y: -40, r: 15, rot: 0.1}, 
           {x: 18, y: -65, r: 18, rot: -0.2}, 
           {x: -5, y: -85, r: 14, rot: 0}
         ];

         const fillStyleColor = isWilted ? 'rgb(120, 100, 40)' : `rgb(${r},${g},${b})`;
         jfPositions.forEach(p => {
           ctx.save();
           ctx.translate(p.x, p.y);
           ctx.rotate(p.rot);
           
           ctx.fillStyle = fillStyleColor;
           ctx.beginPath();
           // Huge oval body
           ctx.ellipse(0, 0, p.r, p.r * 1.6, 0, 0, Math.PI * 2);
           ctx.fill();
           
           // Prickly texture dots
           ctx.fillStyle = 'rgba(0,50,0,0.3)';
           for(let i=0; i<15; i++) {
              ctx.beginPath();
              ctx.arc((Math.random()-0.5)*p.r*1.5, (Math.random()-0.5)*p.r*2.5, 1.5, 0, Math.PI*2);
              ctx.fill();
           }
           ctx.restore();
         });
         ctx.restore();

         // Dense textured dark-green cluster canopy
         ctx.save();
         ctx.translate(0, -110);
         ctx.transform(1, 0, Math.tan(swayAngle * 0.7), 1, 0, 0);

         ctx.fillStyle = `rgb(${rgbCanopy.join(',')})`;
         
         for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3.5) {
           ctx.save();
           ctx.rotate(angle);
           ctx.beginPath();
           ctx.ellipse(35, 0, 45, 30, 0, 0, Math.PI * 2);
           ctx.fill();
           
           // Deep shadowing for density
           ctx.fillStyle = `rgba(0,0,0,0.15)`;
           ctx.beginPath();
           ctx.ellipse(25, 5, 35, 20, 0, 0, Math.PI * 2);
           ctx.fill();

           ctx.restore();
         }

         // Top cluster to round it out
         ctx.beginPath();
         ctx.ellipse(0, -20, 50, 40, 0, 0, Math.PI * 2);
         ctx.fillStyle = `rgb(${rgbCanopy.join(',')})`;
         ctx.fill();

         ctx.restore();
      };

      if (assetType === 'Mango') drawMangoTree();
      else if (assetType === 'Banana') drawBananaPlant();
      else drawJackfruitTree();

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [habit]);

  return (
    <canvas 
      ref={canvasRef} 
      width={180} 
      height={240} 
      className={className}
      style={{ pointerEvents: 'none' }}
    />
  );
};
