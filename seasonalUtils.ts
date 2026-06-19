import { getMonth, getDate } from 'date-fns';

export type BengaliSeason = 'Bashonto' | 'Grishmo' | 'Borsha' | 'Sharat' | 'Hemanto' | 'Sheet';

export function getBengaliSeason(date: Date = new Date()): BengaliSeason {
    const m = getMonth(date);
    const d = getDate(date);
    
    // Bashonto (Spring): Mid-February to Mid-April
    if ((m === 1 && d >= 15) || m === 2 || (m === 3 && d < 15)) return "Bashonto";
    // Grishmo (Summer): Mid-April to Mid-June
    if ((m === 3 && d >= 15) || m === 4 || (m === 5 && d < 15)) return "Grishmo";
    // Borsha (Monsoon): Mid-June to Mid-August
    if ((m === 5 && d >= 15) || m === 6 || (m === 7 && d < 15)) return "Borsha";
    // Sharat (Autumn): Mid-August to Mid-October
    if ((m === 7 && d >= 15) || m === 8 || (m === 9 && d < 15)) return "Sharat";
    // Hemanto (Late Autumn): Mid-October to Mid-December
    if ((m === 9 && d >= 15) || m === 10 || (m === 11 && d < 15)) return "Hemanto";
    // Sheet (Winter): Mid-December to Mid-February
    return "Sheet";
}

export function getSeasonThemeClasses(season: BengaliSeason): string {
    switch (season) {
        case 'Bashonto':
            return 'bg-gradient-to-b from-[#FFF5F2] to-[#FFFAF0] border-[#FFB2A6]/20';
        case 'Grishmo':
            return 'bg-gradient-to-b from-[#FFF9E6] to-[#FFF0D4] border-[#FFCC66]/20';
        case 'Borsha':
            return 'bg-gradient-to-b from-[#F2F7F9] to-[#E6F0F5] border-[#99BBDD]/20';
        case 'Sharat':
            return 'bg-gradient-to-b from-[#F9FBFA] to-[#F2F7F4] border-[#A3CFC0]/20';
        case 'Hemanto':
            return 'bg-gradient-to-b from-[#FCF7F2] to-[#F5EAD4] border-[#D4A373]/20';
        case 'Sheet':
            return 'bg-gradient-to-b from-[#F4F4F9] to-[#EBEBF2] border-[#C2C2D6]/20';
    }
}
