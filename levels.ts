export const LEVEL_THRESHOLDS: number[] = [0]; // index 0 is not used

for (let i = 1; i <= 50; i++) {
  if (i === 1) LEVEL_THRESHOLDS.push(0);
  else if (i === 2) LEVEL_THRESHOLDS.push(100);
  else if (i === 3) LEVEL_THRESHOLDS.push(250);
  else if (i === 4) LEVEL_THRESHOLDS.push(450);
  else if (i === 5) LEVEL_THRESHOLDS.push(700);
  else if (i === 6) LEVEL_THRESHOLDS.push(1000);
  else if (i === 7) LEVEL_THRESHOLDS.push(1350);
  else if (i === 8) LEVEL_THRESHOLDS.push(1750);
  else if (i === 9) LEVEL_THRESHOLDS.push(2200);
  else if (i === 10) LEVEL_THRESHOLDS.push(2700);
  else {
    const prev = LEVEL_THRESHOLDS[i - 1];
    const step = 500 + (i - 10) * 150;
    LEVEL_THRESHOLDS.push(prev + step);
  }
}

export const getLevelFromXP = (xp: number) => {
  for (let i = 50; i >= 1; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 1;
};

export const getRankFromLevel = (level: number) => {
  if (level >= 50) return "Master of the Fruit Garden";
  if (level >= 40) return "Legendary Gardener";
  if (level >= 30) return "Fruit Garden Master";
  if (level >= 20) return "Garden Keeper";
  if (level >= 15) return "Fruit Collector";
  if (level >= 10) return "Garden Helper";
  if (level >= 6) return "Sprout Keeper";
  if (level >= 3) return "Seed Planter";
  return "New Gardener";
};
