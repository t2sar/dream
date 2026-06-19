import React, { useEffect, useRef, useState } from "react";
import { Habit } from "../types";

interface LivingMonolithProps {
  habits: Habit[];
  completedHabitIds: string[];
  level: number;
}

// 3D vector representation
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// 3D Shard definition
interface Shard {
  id: number;
  vertices: Point3D[];
  habitId?: string; // Mapped to a habit if applicable
  colorClass?: string;
  defaultColor: { start: string; end: string };
}

export const LivingMonolith: React.FC<LivingMonolithProps> = ({
  habits,
  completedHabitIds,
  level,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  });

  // Compute stats
  const totalHabits = habits.length;
  const completedCount = habits.filter((h) =>
    completedHabitIds.includes(h.id),
  ).length;
  const completionRatio = totalHabits > 0 ? completedCount / totalHabits : 0;
  const isFullComplete = habits.length > 0 && completedCount === totalHabits;

  // Track the previous completed count to detect the exact milestone moment for the dopaminergic "Lock-In Snap"
  const prevCompletedCountRef = useRef(completedCount);
  const stateRef = useRef({
    habits,
    completedHabitIds,
    level,
    completionRatio,
    isFullComplete,
    isSnapping: false,
    shockwaveRadius: null as number | null
  });

  useEffect(() => {
    stateRef.current.habits = habits;
    stateRef.current.completedHabitIds = completedHabitIds;
    stateRef.current.level = level;
    stateRef.current.completionRatio = completionRatio;
    stateRef.current.isFullComplete = isFullComplete;
  }, [habits, completedHabitIds, level, completionRatio, isFullComplete]);

  useEffect(() => {
    if (
      totalHabits > 0 &&
      completedCount === totalHabits &&
      prevCompletedCountRef.current < totalHabits
    ) {
      // Trigger Lock-in Snap!
      stateRef.current.isSnapping = true;
      stateRef.current.shockwaveRadius = 10;
      setTimeout(() => {
        stateRef.current.isSnapping = false;
      }, 1500);
    }
    prevCompletedCountRef.current = completedCount;
  }, [completedCount, totalHabits]);

  // Define octahedron vertices for a beautiful crystalline sculpture
  const baseVertices: Point3D[] = [
    { x: 0, y: 1.4, z: 0 }, // p0: Top
    { x: 1.2, y: 0, z: 1.2 }, // p1: Right Front
    { x: -1.2, y: 0, z: 1.2 }, // p2: Left Front
    { x: -1.2, y: 0, z: -1.2 }, // p3: Left Back
    { x: 1.2, y: 0, z: -1.2 }, // p4: Right Back
    { x: 0, y: -1.4, z: 0 }, // p5: Bottom
  ];

  // Define the 8 faces of the Octahedron
  const faceIndices = [
    [0, 1, 2], // top front right
    [0, 2, 3], // top front left
    [0, 3, 4], // top back left
    [0, 4, 1], // top back right
    [5, 2, 1], // bottom front right
    [5, 3, 2], // bottom front left
    [5, 4, 3], // bottom back left
    [5, 1, 4], // bottom back right
  ];

  // Map category to glowing emission dual-tone color gradients
  const getCategoryGradients = (category: string) => {
    switch (category) {
      case "health": // Kinetic core (Vaporwave purple to hot magma)
        return { start: "#E01E37", end: "#7B2CBF" };
      case "productivity": // Deep flow core (Cyan to Indigo)
        return { start: "#00F5D4", end: "#3A0CA3" };
      case "learning": // Bright Golden Sage (Amber to Yellow Emerald)
        return { start: "#F59E0B", end: "#10B981" };
      case "mindfulness": // Cyber Orchid (Fuchsia to Blue)
        return { start: "#FF007F", end: "#3A0CA3" };
      default: // Other custom
        return { start: "#F59E0B", end: "#D97706" };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isIntersecting = true;
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    });
    observer.observe(canvas);

    let animationFrameId: number;
    let lastRenderTime = 0;
    let rotationAngleX = 0.005;
    let rotationAngleY = 0.008;

    // Track dynamic float translations for fragments
    const shardAnimationOffsets = faceIndices.map((_, i) => ({
      phase: i * (Math.PI / 4),
      speed: 0.015 + i * 0.003,
      driftX: Math.sin(i) * 5,
      driftY: Math.cos(i) * 5,
    }));

    // Touch/Mouse deflections state
    const deflectionInertia = faceIndices.map(() => ({ x: 0, y: 0 }));

    // Precache static HUD elements onto offscreen canvas
    const hudCanvas = document.createElement("canvas");
    hudCanvas.width = 400 * window.devicePixelRatio;
    hudCanvas.height = 360 * window.devicePixelRatio;
    const hudCtx = hudCanvas.getContext("2d");
    if (hudCtx) {
      hudCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
      hudCtx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      hudCtx.lineWidth = 1;
      const rSize = 10;
      const margin = 20;
      const hw = hudCanvas.width;
      const hh = hudCanvas.height;
      hudCtx.beginPath(); hudCtx.moveTo(margin, margin + rSize); hudCtx.lineTo(margin, margin); hudCtx.lineTo(margin + rSize, margin); hudCtx.stroke();
      hudCtx.beginPath(); hudCtx.moveTo(hw - margin, margin + rSize); hudCtx.lineTo(hw - margin, margin); hudCtx.lineTo(hw - margin - rSize, margin); hudCtx.stroke();
      hudCtx.beginPath(); hudCtx.moveTo(margin, hh - margin - rSize); hudCtx.lineTo(margin, hh - margin); hudCtx.lineTo(margin + rSize, hh - margin); hudCtx.stroke();
      hudCtx.beginPath(); hudCtx.moveTo(hw - margin, hh - margin - rSize); hudCtx.lineTo(hw - margin, hh - margin); hudCtx.lineTo(hw - margin - rSize, hh - margin); hudCtx.stroke();
    }

    let resizeTicking = false;
    const handleResize = () => {
      if (!resizeTicking) {
        requestAnimationFrame(() => {
          const rect = canvas.parentElement?.getBoundingClientRect();
          canvas.width = (rect?.width || 400) * window.devicePixelRatio;
          canvas.height = 360 * window.devicePixelRatio;
          canvas.style.width = "100%";
          canvas.style.height = "360px";
          resizeTicking = false;
        });
        resizeTicking = true;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Mouse events
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * window.devicePixelRatio;
      const y = (e.clientY - rect.top) * window.devicePixelRatio;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Touch events for mobile
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches[0].clientX - rect.left) * window.devicePixelRatio;
        const y = (e.touches[0].clientY - rect.top) * window.devicePixelRatio;
        mouseRef.current.targetX = x;
        mouseRef.current.targetY = y;
        mouseRef.current.active = true;
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove);
    canvas.addEventListener("touchend", onMouseLeave);

    // Main animation loop
    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isIntersecting) return;
      if (time - lastRenderTime < 33) return; // ~30 fps max
      lastRenderTime = time;

      const { habits, completedHabitIds, completionRatio, isFullComplete, isSnapping, shockwaveRadius } = stateRef.current;
      
      if (stateRef.current.shockwaveRadius !== null) {
        stateRef.current.shockwaveRadius += 12;
        if (stateRef.current.shockwaveRadius > 405) stateRef.current.shockwaveRadius = null;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const center = { x: width / 2, y: height / 2 };

      // Dynamic base scale
      const sizeScale = Math.min(width, height) * 0.28;

      // Smooth pointer tracking interpolation
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      // Rotations on axes
      if (isFullComplete) {
        // Fast, elegant rotation for monolithic completion state
        rotationAngleY += 0.012;
        rotationAngleX += 0.003;
      } else {
        // Subtle drift rotation
        rotationAngleY += 0.005;
        rotationAngleX += 0.002;
      }

      // Matrix computation arrays
      const cosX = Math.cos(rotationAngleX);
      const sinX = Math.sin(rotationAngleX);
      const cosY = Math.cos(rotationAngleY);
      const sinY = Math.sin(rotationAngleY);

      // Map habits directly to octahedron's 8 faces
      const shards: Shard[] = faceIndices.map((indices, faceIndex) => {
        const mappedHabit = habits[faceIndex % habits.length];
        const isThisCompleted = mappedHabit
          ? completedHabitIds.includes(mappedHabit.id)
          : false;

        const defaultColor = mappedHabit
          ? getCategoryGradients(mappedHabit.category)
          : { start: "#E01E37", end: "#7B2CBF" };

        return {
          id: faceIndex,
          vertices: indices.map((idx) => baseVertices[idx]),
          habitId: mappedHabit?.id,
          defaultColor,
        };
      });

      // Ambient Completed Glow behind the absolute 100% completed Monolith
      if (isFullComplete) {
        const glowRadius = sizeScale * 1.6;
        const glowGrad = ctx.createRadialGradient(
          center.x,
          center.y,
          10,
          center.x,
          center.y,
          glowRadius,
        );
        glowGrad.addColorStop(0, "rgba(123, 44, 191, 0.25)"); // Vaporwave purple core
        glowGrad.addColorStop(0.3, "rgba(0, 245, 212, 0.15)"); // Hyper Cyan aura
        glowGrad.addColorStop(1, "rgba(7, 8, 10, 0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Projection mapping & physics translations
      // We calculate current fragment dispersion distance based on completion
      // 0% completion = highly fragmented (huge distance multiplier)
      // 100% completion = perfectly unified monolith (no distance multiplier, snaps)
      let scatterDistMultiplier = 1.0;
      if (isSnapping) {
        // Snap violent acceleration math: shards quickly converge from outer boundary to core
        scatterDistMultiplier = 0.05; // Tight implosion
      } else {
        // Standard dispersion matching inverse progress ratio
        scatterDistMultiplier = 1.0 + (1.0 - completionRatio) * 0.85;
      }

      // Calculate faces depth values for painter's rendering algorithm order
      const renderedFaces = shards.map((shard, index) => {
        const offsets = shardAnimationOffsets[index];
        offsets.phase += offsets.speed;

        // Base float behavior matching fragments breathing
        const bounceOffset =
          Math.sin(offsets.phase) * (8 * (1.0 - completionRatio));

        // Let's project vertices into rotated 3D space
        const projectedVertices = shard.vertices.map((vertex) => {
          // Absolute 3D coordinates multiplier
          let x3d = vertex.x;
          let y3d = vertex.y;
          let z3d = vertex.z;

          // Multiply vertex outward from core to represent the dispersion
          const faceCentroid = {
            x:
              (shard.vertices[0].x +
                shard.vertices[1].x +
                shard.vertices[2].x) /
              3,
            y:
              (shard.vertices[0].y +
                shard.vertices[1].y +
                shard.vertices[2].y) /
              3,
            z:
              (shard.vertices[0].z +
                shard.vertices[1].z +
                shard.vertices[2].z) /
              3,
          };

          // Apply scatter dispersion offset outward
          x3d += faceCentroid.x * (scatterDistMultiplier - 1);
          y3d +=
            faceCentroid.y * (scatterDistMultiplier - 1) +
            bounceOffset / sizeScale;
          z3d += faceCentroid.z * (scatterDistMultiplier - 1);

          // Apply 3D Rotations (Y-axis rotation first, then X-axis rotation)
          // Y Rotation
          const r1 = x3d * cosY - z3d * sinY;
          const r1z = x3d * sinY + z3d * cosY;
          // X Rotation
          const r2y = y3d * cosX - r1z * sinX;
          const r2z = y3d * sinX + r1z * cosX;

          return { x: r1, y: r2y, z: r2z };
        });

        // Compute 2D center of this face for interactive pointer repulsion
        const canvasFaceCenter = { x: 0, y: 0 };
        projectedVertices.forEach((v) => {
          canvasFaceCenter.x += center.x + v.x * sizeScale;
          canvasFaceCenter.y += center.y + v.y * sizeScale;
        });
        canvasFaceCenter.x /= 3;
        canvasFaceCenter.y /= 3;

        // Magnetic Pointer Repulsion Logic
        let deflectionX = 0;
        let deflectionY = 0;
        if (mouseRef.current.active && !isFullComplete) {
          const dx = canvasFaceCenter.x - mouseRef.current.x;
          const dy = canvasFaceCenter.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxRepulseDist = 180 * window.devicePixelRatio;

          if (distance < maxRepulseDist) {
            // Strong deflection multiplier inversely proportional to pointer distance
            const force =
              (1.0 - distance / maxRepulseDist) * 35 * (1.0 - completionRatio);
            const angle = Math.atan2(dy, dx);
            deflectionX = Math.cos(angle) * force;
            deflectionY = Math.sin(angle) * force;
          }
        }

        // Apply smooth inertia to deflection changes
        const currentDeflect = deflectionInertia[index];
        currentDeflect.x += (deflectionX - currentDeflect.x) * 0.1;
        currentDeflect.y += (deflectionY - currentDeflect.y) * 0.1;

        // Apply final 2D projections including repulsion deflections
        const finalScreenCoords = projectedVertices.map((v) => ({
          x: center.x + v.x * sizeScale + currentDeflect.x,
          y: center.y + v.y * sizeScale + currentDeflect.y,
        }));

        // Z-Index for Painter's ordering
        const averageZ =
          (projectedVertices[0].z +
            projectedVertices[1].z +
            projectedVertices[2].z) /
          3;

        return {
          shard,
          avgZ: averageZ,
          coords: finalScreenCoords,
          faceIndex: index,
        };
      });

      // Sort faces from backend (furthest away) to frontend (closest)
      renderedFaces.sort((a, b) => a.avgZ - b.avgZ);

      // Render each face panel
      renderedFaces.forEach(({ shard, coords, faceIndex }) => {
        const isMappedAndCompleted = shard.habitId
          ? completedHabitIds.includes(shard.habitId)
          : false;

        ctx.beginPath();
        ctx.moveTo(coords[0].x, coords[0].y);
        ctx.lineTo(coords[1].x, coords[1].y);
        ctx.lineTo(coords[2].x, coords[2].y);
        ctx.closePath();

        // 1. Shard Material Spec Rendering
        if (isFullComplete) {
          // Chrome/Glass hyper-reflective premium state
          const faceGrad = ctx.createLinearGradient(
            coords[0].x,
            coords[0].y,
            coords[2].x,
            coords[2].y,
          );
          faceGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
          faceGrad.addColorStop(0.5, "rgba(0, 245, 212, 0.25)"); // Cyber cyan highlight
          faceGrad.addColorStop(1, "rgba(123, 44, 191, 0.20)"); // Vaporwave purple trace
          ctx.fillStyle = faceGrad;
          ctx.fill();

          // Shiny glass border highlights
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + Math.sin(rotationAngleY * 2 + faceIndex) * 0.08})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (isMappedAndCompleted) {
          // Fusion State: Active shard, premium fluorescent categories
          const emissionGrad = ctx.createLinearGradient(
            coords[0].x,
            coords[0].y,
            coords[2].x,
            coords[2].y,
          );
          emissionGrad.addColorStop(0, shard.defaultColor.start);
          emissionGrad.addColorStop(1, shard.defaultColor.end);

          // Add glowing interior fill opacity
          ctx.fillStyle = emissionGrad;
          ctx.globalAlpha = 0.85;
          ctx.fill();
          ctx.globalAlpha = 1.0;

          // Electric edge highlight
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();

          // External laser outer glowing line
          ctx.strokeStyle = shard.defaultColor.start;
          ctx.lineWidth = 4 + Math.sin(rotationAngleY * 4) * 2;
          ctx.globalAlpha = 0.45;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        } else {
          // Dormant State: Cold, matte titanium grey shard (#1F232B)
          // Shards map titanium gradient to catch faint environment lights
          const matteGrad = ctx.createLinearGradient(
            coords[0].x,
            coords[0].y,
            coords[2].x,
            coords[2].y,
          );
          matteGrad.addColorStop(0, "#15181F");
          matteGrad.addColorStop(1, "#252B36");
          ctx.fillStyle = matteGrad;
          ctx.fill();

          // Subtle raw sharp unlit border edge
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // 2. Render shockwave visual circle on correct snapping milestones
      if (shockwaveRadius !== null) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 245, 212, 0.45)"; // Neon laser stroke
        ctx.lineWidth = 8 * (1 - shockwaveRadius / 400);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center.x, center.y, shockwaveRadius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(123, 44, 191, 0.3)"; // Vaporwave secondary ring
        ctx.lineWidth = 3 * (1 - shockwaveRadius / 400);
        ctx.stroke();
      }

      // 3. Central HUD Overlays from Cache
      if (hudCanvas.width === width && hudCanvas.height === height) {
         ctx.drawImage(hudCanvas, 0, 0);
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.lineWidth = 1;
        // Crosshair markers in corners
        const rSize = 10;
        const margin = 20;
        // TL Corner
        ctx.beginPath();
        ctx.moveTo(margin, margin + rSize);
        ctx.lineTo(margin, margin);
        ctx.lineTo(margin + rSize, margin);
        ctx.stroke();
        // TR Corner
        ctx.beginPath();
        ctx.moveTo(width - margin, margin + rSize);
        ctx.lineTo(width - margin, margin);
        ctx.lineTo(width - margin - rSize, margin);
        ctx.stroke();
        // BL Corner
        ctx.beginPath();
        ctx.moveTo(margin, height - margin - rSize);
        ctx.lineTo(margin, height - margin);
        ctx.lineTo(margin + rSize, height - margin);
        ctx.stroke();
        // BR Corner
        ctx.beginPath();
        ctx.moveTo(width - margin, height - margin - rSize);
        ctx.lineTo(width - margin, height - margin);
        ctx.lineTo(width - margin - rSize, height - margin);
        ctx.stroke();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onMouseLeave);
    };
  }, []);

  const activeStatusText = isFullComplete
    ? "STATUS: HARMONIZED // MONOLITH RESPLENDENT"
    : `SYSTEM CORE: ${Math.round(completionRatio * 100)}% ASSEMBLED`;

  const detailsText = isFullComplete
    ? "ALL ENGINES OPTIMAL // CROWN ASCENSION ACTIVATE"
    : `STREAK MATRIX UNLOCKED // LVL ${level} CONCORDANCE`;

  return (
    <div className="relative w-full rounded-large-card glass overflow-hidden border border-surface-alt py-4 mb-8 bg-background-main shadow-md will-change-transform">
      {/* Visual Ambient Core Glow behind Monolith wrapper container */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] pointer-events-none rounded-full opacity-20 bg-gradient-to-tr from-violet-600 via-cyan-400 to-amber-300 transition-all duration-1000 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      <div className="relative flex flex-col items-center">
        {/* Living Monolith Canvas Stage */}
        <canvas ref={canvasRef} className="block cursor-crosshair max-w-full" />

        {/* HUD Matrix Assembly Label in Monospace Extended Header */}
        <div className="text-center px-6 mt-2 relative z-10 w-full">
          <p className="text-emerald-400/80 font-mono-extended text-xs font-semibold tracking-[0.2em] mb-1 leading-none select-none">
            {activeStatusText}
          </p>
          <p className="text-slate-500 font-mono tracking-widest text-[9px] uppercase leading-none mt-2 select-none">
            {detailsText}
          </p>
        </div>
      </div>
    </div>
  );
};
