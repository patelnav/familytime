# Family Time Guide

<div align="center">
  <img src="logo.png" alt="Family Time Guide Logo" width="100" height="100">
  <p><em>Visualizing the precious moments spent with your children</em></p>
</div>

A tool that visualizes the time parents spend with their children throughout their parenting journey. The algorithm takes into account various real-world factors to provide a realistic estimation of daily active and passive time spent with children.

## Branding

The Family Time Guide uses a simple, clean design featuring a book with an information icon, symbolizing both the educational journey of parenting and the guidance this tool provides. The mint green color scheme (#4FD1C5) represents growth, harmony, and the fresh perspective this tool brings to understanding family time.

## How It Works

### Time Calculation Factors

The algorithm considers several key factors that influence the time spent with children:

#### Parent Variables
- **Work Hours**: Varies by parent type
  - Stay at Home: 0 hours
  - Full Time Work: 9 hours (including lunch)
  - Part Time Work: 5 hours
  - Remote Full Time: 8 hours
  - Remote Part Time: 4 hours
  - Flexible: 6 hours
- **Commute Time**: Varies by work type
  - Stay at Home: 0 hours
  - Full Time Work: 1.5 hours
  - Part Time Work: 1.5 hours
  - Remote Work: 0 hours
  - Flexible: 0.5 hours
- **Parental Leave**: Configurable duration (default: 1 year)
- **Essential Activities**: 1.5 hours daily for basic needs

#### Child Variables
- **Age-Based Sleep Needs**:
  - Newborn: 16 hours
  - Age 1: 14 hours
  - Ages 2-4: 12 hours
  - Ages 5-6: 11 hours
  - Ages 7-12: 10 hours
  - Ages 13-17: 9 hours
  - Age 18+: 8 hours

#### Developmental Stages
- **Infancy** (0-1 years)
- **Toddler** (2-4 years)
- **Early Childhood** (5-7 years)
- **Middle Childhood** (8-12 years)
- **Adolescence** (13-17 years)
- **Adulthood** (18+ years)

#### Schooling Stages
- **PreSchool** (≤3 years)
- **Kindergarten** (4-5 years)
- **Elementary** (6-11 years)
- **Middle School** (12-14 years)
- **High School** (15-17 years)
- **Post High School** (18+ years)

### Time Categories

The algorithm calculates two types of time:

1. **Active Hours**: Direct interaction and focused attention
   - **During Parental Leave**: Maximum child wake hours minus essential activities
   - **Infants/Toddlers without Daycare**: All available parent hours minus essential activities
   - **With Daycare**:
     - Infants: 5-6 hours (morning/evening routines)
     - Toddlers: 4-5 hours
     - Older Children: 3-4 hours
   - **Base Active Hours by Age Group**:
     - Infancy: Up to 12 hours
     - Toddler: Up to 10 hours
     - Early Childhood: 6 hours
     - Middle Childhood: 4 hours
     - Adolescence: 3 hours
     - Adulthood: 1 hour

2. **Weekend Hours**: Based on schooling stage
   - PreSchool: 6 hours
   - Kindergarten: 5 hours
   - Elementary: 4 hours
   - Middle School: 3 hours
   - High School: 2.5 hours
   - Post High School: 1 hour

### Multiple Children Adjustments

1. **Weekday Time**:
   - First child receives full calculated hours
   - Additional young children (infants/toddlers): 30% more time each
   - Additional older children: 20% more time each
   - Minimum multiplier: 0.4 (ensures minimum attention)

2. **Weekend Time**:
   - First child sets base weekend hours
   - Each additional child adds 25% more time
   - Accounts for shared activities

### Passive Time Calculation

- **Infancy**: Up to 30% of sleep time (max 6 hours)
- **Toddler**: Up to 20% of sleep time (max 3 hours)
- **Early Childhood**: 1.5 hours
- **Middle Childhood**: 1 hour
- **Adolescence**: 0.5 hours

The visualization shows both weekday and weekend hours over time, with ranges to account for variability in daily schedules. The timeline spans from 2 years before the first child's birth through 20 years after the last child's birth, providing a comprehensive view of the parenting journey. 