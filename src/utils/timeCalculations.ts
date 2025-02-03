// Constants for daily time allocation
export const HOURS_IN_DAY = 24;
export const PARENT_SLEEP_HOURS_DEFAULT = 8;
export const PATERNAL_LEAVE_DURATION_DEFAULT = 1;
export const DAYCARE_DEFAULT_START_AGE = 1;  // Minimum daycare start age
export const DAYCARE_DEFAULT_END_AGE = 6;    // End daycare at start of elementary school

// Parent sleep hours based on youngest child's age
export const PARENT_SLEEP_HOURS: { [age: number]: number } = {
  0: 6,  // Newborn phase: heavily disrupted sleep
  1: 6.5, // Still getting up for feedings
  2: 7,  // Starting to get more sleep
  3: 7.5, // Sleep improving
  4: 8,  // Back to normal sleep
};

// Get parent sleep hours based on youngest child's age
export const getParentSleepHours = (childAges: number[]): number => {
  if (childAges.length === 0) return PARENT_SLEEP_HOURS_DEFAULT;
  const youngestAge = Math.min(...childAges);
  if (youngestAge < 0) return PARENT_SLEEP_HOURS_DEFAULT;
  
  // Find the closest age bracket
  const age = Math.floor(youngestAge);
  return PARENT_SLEEP_HOURS[age] ?? PARENT_SLEEP_HOURS_DEFAULT;
};

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
  if (childAge < 1) return ChildAgeGroup.Infancy;       // 0–1
  if (childAge < 3) return ChildAgeGroup.Toddler;       // 1–3
  if (childAge < 6) return ChildAgeGroup.EarlyChildhood; // 3–6 (preschool)
  if (childAge < 12) return ChildAgeGroup.MiddleChildhood; // 6–12
  if (childAge < 18) return ChildAgeGroup.Adolescence;    // 12-18
  return ChildAgeGroup.Adulthood;                         // 18+
};

// Function to determine the schooling stage
export const getSchoolingStage = (childAge: number): SchoolingStage => {
  if (childAge < 3) return SchoolingStage.PreSchool;      // 0-3: Pre-preschool/daycare
  if (childAge < 6) return SchoolingStage.Kindergarten;   // 3-6: Preschool/kindergarten
  if (childAge < 12) return SchoolingStage.Elementary;    // 6-12: Elementary school
  if (childAge < 15) return SchoolingStage.MiddleSchool;  // 12-15: Middle school
  if (childAge < 18) return SchoolingStage.HighSchool;    // 15-18: High school
  return SchoolingStage.PostHighSchool;                   // 18+: Post high school
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
const getAvailableHours = (parentType: ParentType, childAges: number[]): number => {
  const parentSleepHours = getParentSleepHours(childAges);
  return HOURS_IN_DAY - parentSleepHours - WORK_HOURS[parentType] - COMMUTE_HOURS[parentType];
};

// Base hours by age group (before work/daycare adjustments)
export const baseActiveHours: { [key in ChildAgeGroup]: number } = {
  [ChildAgeGroup.NotBornYet]: 0,
  [ChildAgeGroup.Infancy]: 12,     // Peak hours for infant care
  [ChildAgeGroup.Toddler]: 11,     // Slightly less for toddlers
  [ChildAgeGroup.EarlyChildhood]: 8,
  [ChildAgeGroup.MiddleChildhood]: 6,
  [ChildAgeGroup.Adolescence]: 4,
  [ChildAgeGroup.Adulthood]: 0,    // Adult children (18+)
};

// Get active hours per child
export const getActiveHoursPerChild = (
  childAge: number,
  parentType: ParentType,
  isParentalLeave: boolean,
  isDaycare: boolean,
  childIndex: number = 0,
  allChildAges: number[] = [],
  paternalLeaveDuration: number = PATERNAL_LEAVE_DURATION_DEFAULT
): number => {
  const ageGroup = getChildAgeGroup(childAge);
  const childSleepHours = CHILD_SLEEP_HOURS[Math.min(Math.floor(childAge), 18)];
  const childWakeHours = HOURS_IN_DAY - childSleepHours;
  const parentSleepHours = getParentSleepHours(allChildAges);
  
  // Essential parent activities (eating, hygiene, etc.)
  const ESSENTIAL_PARENT_HOURS = 1.5;
  
  // During parental leave
  if (isParentalLeave) {
    // You're with the child during all their wake hours, minus essential activities
    const maxHours = Math.min(childWakeHours, HOURS_IN_DAY - parentSleepHours - ESSENTIAL_PARENT_HOURS);
    // Gradually increase hours over first month
    const monthFraction = (childAge * 12) % 1;
    if (monthFraction < 1/12) { // First month
      return maxHours * (0.7 + (0.3 * (monthFraction * 12))); // Start at 70% and ramp up
    }
    
    // Add smooth transition at the end of parental leave
    const monthsBeforeLeaveEnd = paternalLeaveDuration - childAge;
    if (monthsBeforeLeaveEnd <= 0.25) { // Last 3 months of leave
      let activeHours = baseActiveHours[ageGroup];
      if (!isDaycare && parentType !== ParentType.StayAtHome) {
        const availableHours = getAvailableHours(parentType, allChildAges);
        activeHours = Math.min(activeHours, availableHours - ESSENTIAL_PARENT_HOURS);
      }
      const transitionProgress = (0.25 - monthsBeforeLeaveEnd) / 0.25; // 0 to 1 over last 3 months
      return maxHours * (1 - transitionProgress) + activeHours * transitionProgress;
    }
    
    return maxHours;
  }

  let activeHours = baseActiveHours[ageGroup];

  // Smooth transition between age groups
  if (ageGroup === ChildAgeGroup.Infancy && childAge > 0.75) {
    // Start transitioning to toddler hours in last quarter of infancy
    const transitionProgress = (childAge - 0.75) * 4; // 0 to 1 over last quarter
    activeHours = baseActiveHours[ChildAgeGroup.Infancy] * (1 - transitionProgress) +
                 baseActiveHours[ChildAgeGroup.Toddler] * transitionProgress;
  }

  // First adjust for daycare (applies to all parent types)
  if (!isParentalLeave && isDaycare) {
    // Base daycare hours (before work adjustment)
    const daycareBaseHours: { [key in ChildAgeGroup]: number } = {
      [ChildAgeGroup.NotBornYet]: 0,
      [ChildAgeGroup.Infancy]: 7,    // More hours for stay-at-home parents
      [ChildAgeGroup.Toddler]: 6,    // Slightly less for toddlers
      [ChildAgeGroup.EarlyChildhood]: 5,
      [ChildAgeGroup.MiddleChildhood]: 0,  // No daycare after early childhood
      [ChildAgeGroup.Adolescence]: 0,
      [ChildAgeGroup.Adulthood]: 0,
    };

    activeHours = daycareBaseHours[ageGroup];

    // Further reduce hours for working parents
    if (parentType !== ParentType.StayAtHome) {
      switch (ageGroup) {
        case ChildAgeGroup.Infancy:
          activeHours = 5;  // Morning routine + evening routine
          break;
        case ChildAgeGroup.Toddler:
          activeHours = 4.5;  // Slightly shorter routines
          break;
        case ChildAgeGroup.EarlyChildhood:
          activeHours = 4;  // Standard morning/evening pattern
          break;
        default:
          activeHours = 0;  // No daycare hours after early childhood
      }
    }
  } else if (!isParentalLeave && parentType !== ParentType.StayAtHome) {
    // Not in daycare but parent works - limited by available hours
    const availableHours = getAvailableHours(parentType, allChildAges);
    activeHours = Math.min(activeHours, availableHours - ESSENTIAL_PARENT_HOURS);
  }

  // Apply multiple children reduction
  if (childIndex > 0) {
    const reductionFactor = ageGroup === ChildAgeGroup.Infancy || ageGroup === ChildAgeGroup.Toddler
      ? 0.4  // 40% reduction per additional young child
      : 0.5; // 50% reduction per additional older child
    
    const multiChildMultiplier = 1 - (childIndex * reductionFactor);
    activeHours *= Math.max(0, multiChildMultiplier); // Only prevent negative hours
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

// Get active hours per child for weekends
const getWeekendActiveHoursPerChild = (
  childAge: number,
  parentType: ParentType,
  isParentalLeave: boolean,
  isDaycare: boolean,
  childIndex: number = 0,
  allChildAges: number[] = []
): number => {
  const ageGroup = getChildAgeGroup(childAge);
  const parentSleepHours = getParentSleepHours(allChildAges);
  
  // Essential parent activities (eating, hygiene, etc.) - slightly more on weekends
  const ESSENTIAL_PARENT_HOURS = 2;
  
  // Base weekend hours - more time available since no work
  const baseWeekendHours: { [key in ChildAgeGroup]: number } = {
    [ChildAgeGroup.NotBornYet]: 0,
    [ChildAgeGroup.Infancy]: 14,     // Most of wake hours
    [ChildAgeGroup.Toddler]: 12,     // Slightly less as they need independent play
    [ChildAgeGroup.EarlyChildhood]: 10,
    [ChildAgeGroup.MiddleChildhood]: 8,
    [ChildAgeGroup.Adolescence]: 6,
    [ChildAgeGroup.Adulthood]: 0,
  };

  // During parental leave - similar to weekdays since every day is the same
  if (isParentalLeave) {
    return getActiveHoursPerChild(childAge, parentType, isParentalLeave, isDaycare, childIndex, allChildAges);
  }

  let activeHours = baseWeekendHours[ageGroup];

  // Cap at available wake hours
  const maxPossibleHours = HOURS_IN_DAY - parentSleepHours - ESSENTIAL_PARENT_HOURS;
  activeHours = Math.min(activeHours, maxPossibleHours);

  // Daycare doesn't affect weekend hours
  
  // Apply multiple children reduction
  if (childIndex > 0) {
    const reductionFactor = ageGroup === ChildAgeGroup.Infancy || ageGroup === ChildAgeGroup.Toddler
      ? 0.4  // 40% reduction per additional young child
      : 0.5; // 50% reduction per additional older child
    
    const multiChildMultiplier = 1 - (childIndex * reductionFactor);
    activeHours *= Math.max(0, multiChildMultiplier); // Only prevent negative hours
  }

  return parseFloat(activeHours.toFixed(2));
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
  const firstChildBirthYear = Math.min(...children.map(c => Math.floor(c.birthYear)));
  const lastChildBirthYear = Math.max(...children.map(c => Math.floor(c.birthYear)));

  const startYear = firstChildBirthYear - 2; // Start two years before first child
  const endYear = lastChildBirthYear + 20;

  for (let year = startYear; year <= endYear; year++) {
    let totalWeekdayHours = 0;
    let totalWeekendHours = 0;

    // Calculate child ages for this year
    const childAges = children.map(child => {
      const birthYear = Math.floor(child.birthYear);
      return year - birthYear;
    });

    // Check if all children are not born yet
    const allChildrenNotBornYet = childAges.every(age => age < 0);
    
    if (allChildrenNotBornYet) {
      // Before any children are born, set hours to 0
      data.push({
        year,
        weekdayHours: "0",
        weekendHours: "0"
      });
      continue;
    }

    // Calculate hours for each child
    children.forEach((child, index) => {
      const birthYear = Math.floor(child.birthYear);
      const childAge = year - birthYear;
      
      if (childAge < 0) return;

      // Check if child is in daycare for this year
      const isDaycare = child.daycareUsed &&
        childAge >= (child.daycareStartAge ?? DAYCARE_DEFAULT_START_AGE) &&
        childAge < (child.daycareEndAge ?? DAYCARE_DEFAULT_END_AGE);

      // Check if parent is on parental leave for this child
      const isParentalLeave = childAge >= 0 && childAge < paternalLeaveDuration;

      // Calculate base hours for this child
      const baseHours = getActiveHoursPerChild(childAge, parentType, isParentalLeave, isDaycare, index, childAges, paternalLeaveDuration);
      const passiveHours = getPassiveHoursPerChild(childAge);

      // For weekdays (reduced by work)
      const weekdayHours = baseHours + (passiveHours * 0.7);
      
      // For weekends (full attention possible)
      const weekendHours = getWeekendActiveHoursPerChild(childAge, parentType, isParentalLeave, isDaycare, index, childAges) + passiveHours;

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