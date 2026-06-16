# Visual Asset Generation Rules

Whenever you are asked to create new visual assets (plants, pots, decorations, shop items, backgrounds), you must strictly obey the following Design System rules without exception:

1. **Format & Delivery:**
   - Output ONLY raw, native SVG path code (or Compose/Flutter native canvas code depending on the framework). 
   - NEVER suggest downloading external images or using third-party PNGs/WebPs.

2. **Visual Aesthetic ("2D Flat Vector Game Art"):**
   - **Style:** Soft block shading, flat overlapping shapes, and vibrant pastel/neon colors.
   - **Prohibited:** NO harsh black outlines, NO hyper-realistic gradients, NO messy AI-generated artifacts. Keep it minimalist and premium.
   - **Grounding:** Items should usually sit inside a pot, on a pedestal, or on a small floating island base with a subtle dark shadow underneath.

3. **Technical Layout Constraints (The Display Case Rule):**
   - **Strict Bounding Box:** The SVG `viewBox` must completely encapsulate the item. 
   - Ensure the asset is scaled so the highest leaf or widest edge never touches or clips outside the bounds of the parent UI container. 

When asked for a new item, confirm you understand these rules, generate the Dictionary/Map entry, and provide the raw SVG code.
