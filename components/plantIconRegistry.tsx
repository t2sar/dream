import React from 'react';
import { PlantType } from '../types';

export interface PlantIconConfig {
  plantTypeId: PlantType;
  emoji: string;
  primaryColor: string;
  secondaryColor?: string;
  bgColor: string;
  outlineColor: string;
  shapeGroup: 'mango' | 'banana' | 'round' | 'oval' | 'berry' | 'cluster' | 'palm' | 'spiky' | 'star' | 'melon' | 'citrus' | 'nut' | 'fig' | 'leaf' | 'bean' | 'flower' | 'long_fruit';
}

export const PLANT_ICONS_CONFIG: Record<PlantType, PlantIconConfig> = {
  "Mango / Aam": { plantTypeId: "Mango / Aam", emoji: "🥭", primaryColor: "#F7C85F", bgColor: "rgba(247, 200, 95, 0.2)", outlineColor: "#D97925", shapeGroup: "mango" },
  "Jackfruit / Kathal": { plantTypeId: "Jackfruit / Kathal", emoji: "🍈", primaryColor: "#A1C96A", bgColor: "rgba(161, 201, 106, 0.2)", outlineColor: "#4A7A2A", shapeGroup: "spiky" },
  "Banana / Kola": { plantTypeId: "Banana / Kola", emoji: "🍌", primaryColor: "#F9D549", bgColor: "rgba(249, 213, 73, 0.2)", outlineColor: "#D69F12", shapeGroup: "banana" },
  "Coconut / Narikel": { plantTypeId: "Coconut / Narikel", emoji: "🥥", primaryColor: "#E2D0B4", bgColor: "rgba(226, 208, 180, 0.2)", outlineColor: "#7A6448", shapeGroup: "round" },
  "Guava / Peyara": { plantTypeId: "Guava / Peyara", emoji: "🍐", primaryColor: "#A5D678", bgColor: "rgba(165, 214, 120, 0.2)", outlineColor: "#5B8D2F", shapeGroup: "round" },
  "Litchi / Lichu": { plantTypeId: "Litchi / Lichu", emoji: "🍒", primaryColor: "#E55C5C", bgColor: "rgba(229, 92, 92, 0.2)", outlineColor: "#8C2323", shapeGroup: "cluster" },
  "Papaya / Pepe": { plantTypeId: "Papaya / Pepe", emoji: "🍈", primaryColor: "#EBB15B", bgColor: "rgba(235, 177, 91, 0.2)", outlineColor: "#A6631C", shapeGroup: "oval" },
  "Pineapple / Anaros": { plantTypeId: "Pineapple / Anaros", emoji: "🍍", primaryColor: "#E5CA49", bgColor: "rgba(229, 202, 73, 0.2)", outlineColor: "#A68615", shapeGroup: "spiky" },
  "Strawberry": { plantTypeId: "Strawberry", emoji: "🍓", primaryColor: "#E24A4A", bgColor: "rgba(226, 74, 74, 0.2)", outlineColor: "#931717", shapeGroup: "berry" },
  "Asian Palmyra Palm / Taal": { plantTypeId: "Asian Palmyra Palm / Taal", emoji: "🌴", primaryColor: "#574033", secondaryColor: "#FFC843", bgColor: "rgba(87, 64, 51, 0.2)", outlineColor: "#2F2119", shapeGroup: "palm" },
  "Black Plum / Jam": { plantTypeId: "Black Plum / Jam", emoji: "🫐", primaryColor: "#4B326D", bgColor: "rgba(75, 50, 109, 0.2)", outlineColor: "#26153B", shapeGroup: "berry" },
  "Jujube / Boroi": { plantTypeId: "Jujube / Boroi", emoji: "🍏", primaryColor: "#ABC959", bgColor: "rgba(171, 201, 89, 0.2)", outlineColor: "#5F7623", shapeGroup: "round" },
  "Hog Plum / Amra": { plantTypeId: "Hog Plum / Amra", emoji: "🍐", primaryColor: "#81C160", bgColor: "rgba(129, 193, 96, 0.2)", outlineColor: "#3F7124", shapeGroup: "oval" },
  "Wood Apple / Bel": { plantTypeId: "Wood Apple / Bel", emoji: "🥥", primaryColor: "#CBA77A", bgColor: "rgba(203, 167, 122, 0.2)", outlineColor: "#755B39", shapeGroup: "round" },
  "Star Fruit / Kamranga": { plantTypeId: "Star Fruit / Kamranga", emoji: "⭐", primaryColor: "#EACC58", bgColor: "rgba(234, 204, 88, 0.2)", outlineColor: "#A38725", shapeGroup: "star" },
  "Indian Gooseberry / Amloki": { plantTypeId: "Indian Gooseberry / Amloki", emoji: "🍈", primaryColor: "#A2C959", bgColor: "rgba(162, 201, 89, 0.2)", outlineColor: "#587623", shapeGroup: "berry" },
  "Lemon / Lebu": { plantTypeId: "Lemon / Lebu", emoji: "🍋", primaryColor: "#F4E050", bgColor: "rgba(244, 224, 80, 0.2)", outlineColor: "#B5A118", shapeGroup: "citrus" },
  "Orange / Komola": { plantTypeId: "Orange / Komola", emoji: "🍊", primaryColor: "#EA8E3A", bgColor: "rgba(234, 142, 58, 0.2)", outlineColor: "#AB5513", shapeGroup: "citrus" },
  "Pomegranate / Dalim": { plantTypeId: "Pomegranate / Dalim", emoji: "🍎", primaryColor: "#D1454F", bgColor: "rgba(209, 69, 79, 0.2)", outlineColor: "#7A1C23", shapeGroup: "round" },
  "Custard Apple / Ata": { plantTypeId: "Custard Apple / Ata", emoji: "🍐", primaryColor: "#7A9E53", bgColor: "rgba(122, 158, 83, 0.2)", outlineColor: "#39521E", shapeGroup: "spiky" },
  "Watermelon / Tormuj": { plantTypeId: "Watermelon / Tormuj", emoji: "🍉", primaryColor: "#5EA152", secondaryColor: "#D44242", bgColor: "rgba(94, 161, 82, 0.2)", outlineColor: "#275A1E", shapeGroup: "melon" },
  "Melon / Bangi": { plantTypeId: "Melon / Bangi", emoji: "🍈", primaryColor: "#EDDB91", bgColor: "rgba(237, 219, 145, 0.2)", outlineColor: "#AC9A4D", shapeGroup: "melon" },
  "Date Palm / Khejur": { plantTypeId: "Date Palm / Khejur", emoji: "🌴", primaryColor: "#874D27", bgColor: "rgba(135, 77, 39, 0.2)", outlineColor: "#44210A", shapeGroup: "palm" },
  "Tamarind / Tetul": { plantTypeId: "Tamarind / Tetul", emoji: "🫘", primaryColor: "#7A5835", bgColor: "rgba(122, 88, 53, 0.2)", outlineColor: "#3B2612", shapeGroup: "bean" },
  "Indian Olive / Jolpai": { plantTypeId: "Indian Olive / Jolpai", emoji: "🫒", primaryColor: "#678A3C", bgColor: "rgba(103, 138, 60, 0.2)", outlineColor: "#2E4711", shapeGroup: "oval" },
  "Burmese Grape / Lotkon": { plantTypeId: "Burmese Grape / Lotkon", emoji: "🟡", primaryColor: "#E2C44F", bgColor: "rgba(226, 196, 79, 0.2)", outlineColor: "#91791F", shapeGroup: "cluster" },
  "Elephant Apple / Chalta": { plantTypeId: "Elephant Apple / Chalta", emoji: "🍏", primaryColor: "#9AB547", bgColor: "rgba(154, 181, 71, 0.2)", outlineColor: "#576A1C", shapeGroup: "round" },
  "Monkey Jack / Deua": { plantTypeId: "Monkey Jack / Deua", emoji: "🍈", primaryColor: "#C1AC4D", bgColor: "rgba(193, 172, 77, 0.2)", outlineColor: "#7A6A23", shapeGroup: "round" },
  "Wax Apple / Jamrul": { plantTypeId: "Wax Apple / Jamrul", emoji: "🍐", primaryColor: "#DDAFCC", bgColor: "rgba(221, 175, 204, 0.2)", outlineColor: "#93597D", shapeGroup: "fig" },
  "Rose Apple / Golap Jam": { plantTypeId: "Rose Apple / Golap Jam", emoji: "🌸", primaryColor: "#EAC2E4", bgColor: "rgba(234, 194, 228, 0.2)", outlineColor: "#9E6496", shapeGroup: "flower" },
  "Sapodilla / Sofeda": { plantTypeId: "Sapodilla / Sofeda", emoji: "🥔", primaryColor: "#B5926B", bgColor: "rgba(181, 146, 107, 0.2)", outlineColor: "#58422A", shapeGroup: "round" },
  "Pomelo / Batabi Lebu": { plantTypeId: "Pomelo / Batabi Lebu", emoji: "🍈", primaryColor: "#B1D164", bgColor: "rgba(177, 209, 100, 0.2)", outlineColor: "#617A27", shapeGroup: "citrus" },
  "Malta / Malta": { plantTypeId: "Malta / Malta", emoji: "🍊", primaryColor: "#EDB941", bgColor: "rgba(237, 185, 65, 0.2)", outlineColor: "#9E7112", shapeGroup: "citrus" },
  "Dragon Fruit / Dragon Fol": { plantTypeId: "Dragon Fruit / Dragon Fol", emoji: "🐉", primaryColor: "#DE4377", secondaryColor: "#9CC240", bgColor: "rgba(222, 67, 119, 0.2)", outlineColor: "#8D1B43", shapeGroup: "spiky" },
  "Rambutan / Rambutan": { plantTypeId: "Rambutan / Rambutan", emoji: "🔴", primaryColor: "#E24F53", bgColor: "rgba(226, 79, 83, 0.2)", outlineColor: "#8F1E21", shapeGroup: "spiky" },
  "Longan / Ashfol": { plantTypeId: "Longan / Ashfol", emoji: "🫐", primaryColor: "#CBAA77", bgColor: "rgba(203, 170, 119, 0.2)", outlineColor: "#7E5C2A", shapeGroup: "cluster" },
  "Grape / Angur": { plantTypeId: "Grape / Angur", emoji: "🍇", primaryColor: "#8B4B9A", bgColor: "rgba(139, 75, 154, 0.2)", outlineColor: "#472152", shapeGroup: "cluster" },
  "Fig / Dumur": { plantTypeId: "Fig / Dumur", emoji: "🌰", primaryColor: "#673D54", bgColor: "rgba(103, 61, 84, 0.2)", outlineColor: "#2E1523", shapeGroup: "fig" },
  "Mulberry / Toot Fol": { plantTypeId: "Mulberry / Toot Fol", emoji: "🍇", primaryColor: "#C13E78", bgColor: "rgba(193, 62, 120, 0.2)", outlineColor: "#741B42", shapeGroup: "cluster" },
  "Bengal Currant / Karamcha": { plantTypeId: "Bengal Currant / Karamcha", emoji: "🍒", primaryColor: "#D63A5C", bgColor: "rgba(214, 58, 92, 0.2)", outlineColor: "#861831", shapeGroup: "berry" },
  "Phalsa / Falsa": { plantTypeId: "Phalsa / Falsa", emoji: "🫐", primaryColor: "#4A3258", bgColor: "rgba(74, 50, 88, 0.2)", outlineColor: "#22132A", shapeGroup: "berry" },
  "Passion Fruit / Passion Fol": { plantTypeId: "Passion Fruit / Passion Fol", emoji: "🌺", primaryColor: "#8C3C7B", secondaryColor: "#EAC358", bgColor: "rgba(140, 60, 123, 0.2)", outlineColor: "#47173D", shapeGroup: "round" },
  "Avocado / Avocado": { plantTypeId: "Avocado / Avocado", emoji: "🥑", primaryColor: "#6E9145", secondaryColor: "#D4C76C", bgColor: "rgba(110, 145, 69, 0.2)", outlineColor: "#324A16", shapeGroup: "oval" },
  "Bilimbi / Bilimbi": { plantTypeId: "Bilimbi / Bilimbi", emoji: "🥒", primaryColor: "#85B54A", bgColor: "rgba(133, 181, 74, 0.2)", outlineColor: "#44651D", shapeGroup: "long_fruit" }, // Changed to long_fruit or oval
  "Cashew Fruit / Kaju Fol": { plantTypeId: "Cashew Fruit / Kaju Fol", emoji: "🥜", primaryColor: "#D84A4A", secondaryColor: "#897151", bgColor: "rgba(216, 74, 74, 0.2)", outlineColor: "#832424", shapeGroup: "fig" },
  "Breadfruit / Ruti Fol": { plantTypeId: "Breadfruit / Ruti Fol", emoji: "🍈", primaryColor: "#9FB351", bgColor: "rgba(159, 179, 81, 0.2)", outlineColor: "#576620", shapeGroup: "spiky" },
  "Indian Persimmon / Gab": { plantTypeId: "Indian Persimmon / Gab", emoji: "🍎", primaryColor: "#A63D31", bgColor: "rgba(166, 61, 49, 0.2)", outlineColor: "#5F1B13", shapeGroup: "round" },
};
