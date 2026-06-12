export interface CompanionDef {
  id: string;
  name: string;
  banglaName: string;
  unlockConditionStr: string;
}

export const COMPANIONS: CompanionDef[] = [
  { id: 'projapoti', name: 'Butterfly', banglaName: 'Projapoti', unlockConditionStr: 'Complete your first 7-day streak' },
  { id: 'moumachhi', name: 'Honeybee', banglaName: 'Moumachhi', unlockConditionStr: 'Complete 25 total check-ins' },
  { id: 'ladybug', name: 'Ladybug', banglaName: 'Ladybug', unlockConditionStr: 'Grow your first plant to stage 6' },
  { id: 'chorui', name: 'Sparrow', banglaName: 'Chorui', unlockConditionStr: 'Reach Level 10' },
  { id: 'tuntuni', name: 'Tailorbird', banglaName: 'Tuntuni', unlockConditionStr: 'Complete 15 perfect garden days' },
  { id: 'phoring', name: 'Dragonfly', banglaName: 'Phoring', unlockConditionStr: 'Complete a 7-day Garden Challenge' },
  { id: 'doel', name: 'Doel', banglaName: 'Doel', unlockConditionStr: '30-day streak on any habit' },
  { id: 'jonaki', name: 'Firefly swarm', banglaName: 'Jonaki', unlockConditionStr: 'Complete habits 10 evenings (after 7 PM)' },
  { id: 'bang', name: 'Frog', banglaName: 'Bang', unlockConditionStr: 'Complete all habits on 5 rainy-season days' },
  { id: 'shalik', name: 'Myna', banglaName: 'Shalik', unlockConditionStr: 'Resist bad habits 25 times (Pest system)' },
  { id: 'machranga', name: 'Kingfisher', banglaName: 'Machranga', unlockConditionStr: 'Maintain 3 habits simultaneously for 30 days' },
  { id: 'pecha', name: 'Owl', banglaName: 'Pecha', unlockConditionStr: 'Complete habits 15 nights (after 10 PM)' },
];
