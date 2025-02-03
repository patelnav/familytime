# Family Time Guide

<div align="center">
  <img src="logo.png" alt="Family Time Guide Logo" width="100" height="100">
  <p><em>Visualizing the precious moments spent with your children</em></p>
</div>

A tool that visualizes the time parents spend with their children throughout their parenting journey. The algorithm takes into account various real-world factors to provide a realistic estimation of daily hours spent with children, showing both weekday and weekend patterns on a yearly basis.

## Features

- **Yearly Timeline**: Shows time spent with children from two years before first child's birth through 20 years after last child's birth
- **Weekday/Weekend Split**: Separate calculations for weekday and weekend hours to reflect different schedules
- **Multiple Children**: Accounts for overlapping time and shared activities with multiple children
- **Work Pattern Support**: Accommodates various work arrangements from stay-at-home to flexible schedules
- **Shareable Results**: Results can be shared via URL, preserving all input data

## Branding

The Family Time Guide uses a simple, clean design featuring a book with an information icon, symbolizing both the educational journey of parenting and the guidance this tool provides. The mint green color scheme (#4FD1C5) represents growth, harmony, and the fresh perspective this tool brings to understanding family time.

## How It Works

### Time Calculation Factors

The algorithm considers several key factors that influence the time spent with children:

#### Parent Variables
- **Work Hours**: Varies by parent type
  - Stay at Home: 0 hours
  - Full Time Work: 9 hours (including 1 hour lunch)
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
- **Parent Sleep Hours**: Adjusts based on youngest child's age
  - Newborn (0): 6 hours
  - Age 1: 6.5 hours
  - Age 2: 7 hours
  - Age 3: 7.5 hours
  - Age 4+: 8 hours
- **Essential Activities**: 1.5 hours daily for basic needs (2 hours on weekends)

#### Child Variables
- **Age-Based Sleep Needs**:
  - Newborn (0): 16 hours
  - Age 1: 14 hours
  - Ages 2-4: 12 hours
  - Ages 5-6: 11 hours
  - Ages 7-12: 10 hours
  - Ages 13-17: 9 hours
  - Age 18+: 8 hours

#### Developmental Stages
- **Infancy** (0-1 years): Newborns and young babies
- **Toddler** (1-3 years): Early walking and talking phase
- **Early Childhood** (3-6 years): Preschool and kindergarten years
- **Middle Childhood** (6-12 years): Elementary school years
- **Adolescence** (12-18 years): Teen years through high school
- **Adulthood** (18+ years): Young adults

#### Schooling Stages
- **PreSchool** (0-3 years): Pre-preschool and daycare age
- **Kindergarten** (3-6 years): Preschool and kindergarten
- **Elementary** (6-12 years): Elementary school years
- **Middle School** (12-15 years): Middle school/junior high
- **High School** (15-18 years): High school years
- **Post High School** (18+ years): College and beyond

### Time Categories

The algorithm calculates active interaction time based on several factors:

#### Base Active Hours by Age Group
- **Infancy**: 12 hours
- **Toddler**: 11 hours
- **Early Childhood**: 8 hours
- **Middle Childhood**: 6 hours
- **Adolescence**: 4 hours
- **Adulthood**: 0 hours (18+ years)

#### Parental Leave Period
- Based on child's wake hours and parent's available time
- Gradual ramp-up during first month
- Smooth transition back to regular schedule in final months

#### Daycare Adjustments
When daycare is used (ages 1-6):
- **Stay-at-home Parents**:
  - Infancy: 7 hours
  - Toddler: 6 hours
  - Early Childhood: 5 hours
- **Working Parents**:
  - Infancy: 5 hours (morning + evening routines)
  - Toddler: 4.5 hours
  - Early Childhood: 4 hours

### Multiple Children Adjustments

For each additional child:
- Young children (infants/toddlers): 40% reduction in individual time
- Older children: 50% reduction in individual time
- No minimum cap (reductions can go up to 100%)

Examples:
- Second child gets 60% (infants) or 50% (older) of base hours
- Third child gets 20% (infants) or 0% (older) of base hours
- Fourth+ children effectively get 0 hours due to 100%+ reduction

This models the reality that:
- Each additional child significantly reduces individual attention time
- Younger children maintain more individual time than older ones
- Beyond three children, direct individual time becomes minimal

### Age Transitions

The algorithm includes smooth transitions:
- Between parental leave and regular schedule
- Between age groups (e.g., infancy to toddler)
- Adjusts for first month after birth

The visualization shows how these factors combine to create a realistic picture of parenting time throughout the years, accounting for both regular patterns and major transitions in children's lives. 