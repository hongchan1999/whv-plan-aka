export interface WorkItem {
  id: string;
  title: string;
  salaryRange: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  area: string;
  eligible88: boolean;
  source: string;
  workingHours?: string;
  dateRange?: string; // when to when
  natureOfBusiness?: string;
  description?: string;
  workingDays?: string;
  goldReward?: number;
  xpReward?: number;
}

export interface HostelItem {
  id: string;
  name: string;
  amount: string;
  area: string;
  rating: number;
  source: string;
}

export interface CostOfLivingItem {
  id: string;
  area: string;
  food: string;
  transportPublic: string;
  transportCarRental: string;
  transportCarPurchase: string;
}

export interface JourneyItem {
  id: string;
  author: string;
  platform: string;
  duration: string;
  earningsAmount: number;
  earningsCurrency: string;
  jobs: string[];
  travelLocations: string[];
  summary: string;
  sourceUrl?: string;
}

export interface AnalysisResult {
  id?: string;
  title?: string;
  destination?: string;
  coordinatesOrAddress?: string;
  costs?: string;
  sentimentScore?: number;
  sentimentReasoning?: string;
  prosAndCons?: string[];
  hardWorkSuitable?: boolean;
  visaExtension?: boolean;
  careerAdvice?: string;
  logistics?: string;
}
