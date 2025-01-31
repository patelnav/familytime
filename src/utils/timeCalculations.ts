// Constants for daily time allocation
export const HOURS_IN_DAY = 24;
export const PARENT_SLEEP_HOURS = 8;
export const PATERNAL_LEAVE_DURATION_DEFAULT = 1;
export const DAYCARE_DEFAULT_START_AGE = 1;
export const DAYCARE_DEFAULT_END_AGE = 5;

// Approximate sleep needs based on child's age
export const CHILD_SLEEP_HOURS: { [age: number]: number } = {
  0: 16, // Newborn
  1: 14,
  2: 12,
  3: 12,
  4: 12,
  5: 11,
  6: 11,
  7: 10,
  8: 10,
  9: 10,
  10: 10,
  11: 10,
  12: 10,
  13: 9,
  14: 9,
  15: 9,
  16: 9,
  17: 9,
  18: 8,
};

// Define age groups
export enum ChildAgeGroup {
  NotBornYet = "NotBornYet",
  Infancy = "Infancy",
  Toddler = "Toddler",
  EarlyChildhood = "EarlyChildhood",
  MiddleChildhood = "MiddleChildhood",
  Adolescence = "Adolescence",
  Adulthood = "Adulthood",
}

export enum SchoolingStage {
  PreSchool = "PreSchool",
  Kindergarten = "Kindergarten",
  Elementary = "Elementary",
  MiddleSchool = "MiddleSchool",
  HighSchool = "HighSchool",
  PostHighSchool = "PostHighSchool",
}

// Define parent types
export enum ParentType {
  StayAtHome = "StayAtHome",
  FullTimeWork = "FullTimeWork",
  PartTimeWork = "PartTimeWork",
  RemoteFullTime = "RemoteFullTime",
  RemotePartTime = "RemotePartTime",
  Flexible = "Flexible",
}

export interface Child {
  birthYear: number;
  daycareUsed: boolean;
  daycareStartAge?: number;
  daycareEndAge?: number;
}

export interface TimeSpent {
  year: number;
  weekdayHours: string;
  weekendHours: string;
}

// Function to determine the age group of a child
export const getChildAgeGroup = (childAge: number): ChildAgeGroup => {
  if (childAge < 0) return ChildAgeGroup.NotBornYet;
  if (childAge <= 1) return ChildAgeGroup.Infancy;
  if (childAge <= 4) return ChildAgeGroup.Toddler;
  if (childAge <= 7) return ChildAgeGroup.EarlyChildhood;
  if (childAge <= 12) return ChildAgeGroup.MiddleChildhood;
  if (childAge <= 17) return ChildAgeGroup.Adolescence;
  return ChildAgeGroup.Adulthood;
};

// Function to determine the schooling stage
export const getSchoolingStage = (childAge: number): SchoolingStage => {
  if (childAge <= 3) return SchoolingStage.PreSchool;
  if (childAge <= 5) return SchoolingStage.Kindergarten;
  if (childAge <= 11) return SchoolingStage.Elementary;
  if (childAge <= 14) return SchoolingStage.MiddleSchool;
  if (childAge <= 17) return SchoolingStage.HighSchool;
  return SchoolingStage.PostHighSchool;
};

// Add these constants at the top
const WORK_HOURS: { [key in ParentType]: number } = {
  [ParentType.StayAtHome]: 0,
  [ParentType.FullTimeWork]: 9,  // 8 hours + 1 hour lunch
  [ParentType.PartTimeWork]: 5,
  [ParentType.RemoteFullTime]: 8,
  [ParentType.RemotePartTime]: 4,
  [ParentType.Flexible]: 6
};

const COMMUTE_HOURS: { [key in ParentType]: number } = {
  [ParentType.StayAtHome]: 0,
  [ParentType.FullTimeWork]: 1.5,
  [ParentType.PartTimeWork]: 1.5,
  [ParentType.RemoteFullTime]: 0,
  [ParentType.RemotePartTime]: 0,
  [ParentType.Flexible]: 0.5
};

// Get available hours after work and commute
const getAvailableHours = (parentType: ParentType): number => {
  return HOURS_IN_DAY - PARENT_SLEEP_HOURS - WORK_HOURS[parentType] - COMMUTE_HOURS[parentType];
};

// Get active hours per child
export const getActiveHoursPerChild = (
  childAge: number,
  parentType: ParentType,
  isParentalLeave: boolean,
  isDaycare: boolean,
  childIndex: number = 0
): number => {
  const ageGroup = getChildAgeGroup(childAge);
  const childSleepHours = CHILD_SLEEP_HOURS[Math.min(Math.floor(childAge), 18)];
  const childWakeHours = HOURS_IN_DAY - childSleepHours;
  
  // Essential parent activities (eating, hygiene, etc.)
  const ESSENTIAL_PARENT_HOURS = 1.5;
  
  // During parental leave
  if (isParentalLeave) {
    // You're with the child during all their wake hours, minus essential activities
    return Math.min(childWakeHours, HOURS_IN_DAY - PARENT_SLEEP_HOURS - ESSENTIAL_PARENT_HOURS);
  }

  // For infants and toddlers not in daycare
  if ((ageGroup === ChildAgeGroup.Infancy || ageGroup === ChildAgeGroup.Toddler) && !isDaycare) {
    const availableHours = getAvailableHours(parentType);
    // You're with them during all available hours
    return Math.min(childWakeHours, availableHours - ESSENTIAL_PARENT_HOURS);
  }

  // For daycare scenarios
  if (isDaycare) {
    const availableHours = getAvailableHours(parentType);
    
    if (ageGroup === ChildAgeGroup.Infancy) {
      // Morning routine (1.5-2 hrs) + evening routine (3-4 hrs)
      return parentType === ParentType.StayAtHome ? 6 : Math.min(5, availableHours);
    } else if (ageGroup === ChildAgeGroup.Toddler) {
      // Slightly less intensive routines
      return parentType === ParentType.StayAtHome ? 5 : Math.min(4, availableHours);
    } else {
      // Older children
      return parentType === ParentType.StayAtHome ? 4 : Math.min(3, availableHours);
    }
  }

  // For other cases (school-age children, etc.)
  const baseActiveHours: { [key in ChildAgeGroup]: number } = {
    [ChildAgeGroup.NotBornYet]: 0,
    [ChildAgeGroup.Infancy]: Math.min(childWakeHours, 12),
    [ChildAgeGroup.Toddler]: Math.min(childWakeHours, 10),
    [ChildAgeGroup.EarlyChildhood]: 6,
    [ChildAgeGroup.MiddleChildhood]: 4,
    [ChildAgeGroup.Adolescence]: 3,
    [ChildAgeGroup.Adulthood]: 1,
  };

  let activeHours = Math.min(baseActiveHours[ageGroup], getAvailableHours(parentType) - ESSENTIAL_PARENT_HOURS);

  // Apply multiple children reduction with more nuanced approach
  if (childIndex > 0) {
    // Less reduction for infants/toddlers as they need more individual attention
    const reductionFactor = ageGroup === ChildAgeGroup.Infancy || ageGroup === ChildAgeGroup.Toddler
      ? 0.2  // 20% reduction per additional young child
      : 0.3; // 30% reduction per additional older child
    
    const multiChildMultiplier = Math.max(0.4, 1 - (childIndex * reductionFactor));
    activeHours *= multiChildMultiplier;
  }

  return parseFloat(activeHours.toFixed(2));
};

// Update passive hours calculation
export const getPassiveHoursPerChild = (childAge: number): number => {
  if (childAge < 0) return 0;

  const ageGroup = getChildAgeGroup(childAge);
  const childSleepHours = CHILD_SLEEP_HOURS[Math.min(Math.floor(childAge), 18)];

  switch (ageGroup) {
    case ChildAgeGroup.Infancy:
      // Account for night feedings/changes
      return Math.min(6, childSleepHours * 0.3); // Up to 30% of sleep time
    case ChildAgeGroup.Toddler:
      return Math.min(3, childSleepHours * 0.2); // Up to 20% of sleep time
    case ChildAgeGroup.EarlyChildhood:
      return 1.5;
    case ChildAgeGroup.MiddleChildhood:
      return 1;
    case ChildAgeGroup.Adolescence:
      return 0.5;
    default:
      return 0;
  }
};

// Calculate time spent with children
export const calculateTimeSpent = (
  _parentBirthYear: number,
  children: Child[],
  parentType: ParentType,
  paternalLeaveDuration: number = PATERNAL_LEAVE_DURATION_DEFAULT
): TimeSpent[] => {
  const data: TimeSpent[] = [];

  // Find the range of years to display
  const firstChildBirthYear = Math.min(...children.map(c => c.birthYear));
  const lastChildBirthYear = Math.max(...children.map(c => c.birthYear));
  const startYear = firstChildBirthYear - 2;
  const endYear = lastChildBirthYear + 20;

  for (let year = startYear; year <= endYear; year++) {
    let totalWeekdayHours = 0;
    let totalWeekendHours = 0;
    let maxSingleChildWeekday = 0;
    let maxSingleChildWeekend = 0;

    // Calculate hours for each child
    children.forEach((child, index) => {
      const childAge = year - child.birthYear;
      if (childAge < 0) return;

      // Check if child is in daycare for this year
      const isDaycare = child.daycareUsed &&
        childAge >= (child.daycareStartAge ?? DAYCARE_DEFAULT_START_AGE) &&
        childAge <= (child.daycareEndAge ?? DAYCARE_DEFAULT_END_AGE);

      // Check if parent is on parental leave for this child
      const isParentalLeave = childAge >= 0 && childAge < paternalLeaveDuration;

      // Calculate base hours for this child
      const baseHours = getActiveHoursPerChild(childAge, parentType, isParentalLeave, isDaycare);
      const passiveHours = getPassiveHoursPerChild(childAge);

      // For weekdays (reduced by work)
      const weekdayHours = baseHours + (passiveHours * 0.7);
      maxSingleChildWeekday = Math.max(maxSingleChildWeekday, weekdayHours);
      
      // For weekends (full attention possible)
      const weekendHours = Math.min(baseHours * 1.2, HOURS_IN_DAY - PARENT_SLEEP_HOURS) + (passiveHours * 0.3);
      maxSingleChildWeekend = Math.max(maxSingleChildWeekend, weekendHours);

      // Add additional hours for overlapping time, but with diminishing returns
      if (index > 0) {
        const overlapFactor = Math.max(0.3, 1 / (index + 1));
        totalWeekdayHours += weekdayHours * overlapFactor;
        totalWeekendHours += weekendHours * overlapFactor;
      } else {
        totalWeekdayHours = weekdayHours;
        totalWeekendHours = weekendHours;
      }
    });

    // Format the hours ranges
    const weekdayHours = `${totalWeekdayHours.toFixed(1)}`;
    const weekendHours = `${totalWeekendHours.toFixed(1)}`;

    data.push({
      year,
      weekdayHours,
      weekendHours,
    });
  }

  return data;
}; 