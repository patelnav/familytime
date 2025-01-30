# Family Time Guide

A tool that visualizes the time parents spend with their children throughout their parenting journey. The algorithm takes into account various real-world factors to provide a realistic estimation of daily active and passive time spent with children.

## How It Works

### Time Calculation Factors

The algorithm considers several key factors that influence the time spent with children:

#### Parent Variables
- **Work Schedule**: Different work arrangements (full-time, part-time, remote, flexible)
- **Commute Time**: Varies by work type (0-1.5 hours per day)
- **Parental Leave**: Initial period of intensive care
- **Essential Activities**: Time for parent's basic needs (1.5 hours daily)

#### Child Variables
- **Age-Based Sleep Needs**: From 16 hours (newborn) to 8 hours (teenager)
- **Developmental Stages**: 
  - Infancy (0-1 years)
  - Toddler (2-4 years)
  - Early Childhood (5-7 years)
  - Middle Childhood (8-12 years)
  - Adolescence (13-17 years)

#### Care Arrangements
- **Daycare**: Typical 8am-5pm schedule
- **School Stages**: From preschool through high school
- **Multiple Children**: Accounts for divided attention and overlapping time

### Time Categories

The algorithm calculates two types of time:

1. **Active Hours**: Direct interaction and focused attention
   - Higher during parental leave (up to 14 hours)
   - Varies by parent type (e.g., stay-at-home vs. full-time work)
   - Adjusted for daycare/school hours
   - Considers overlapping time with multiple children

2. **Weekend Hours**: Different calculation for weekend time
   - More available hours due to no work
   - Varies by child's age and schooling stage
   - Accounts for group activities and shared time

### Multiple Children Adjustments

The algorithm uses a sophisticated approach to handle time with multiple children:

1. **Base Time Calculation**:
   - First child receives full calculated hours
   - Additional children don't simply add their full hours (avoiding unrealistic totals)

2. **Overlapping Time**:
   - Recognizes that many activities can be done with multiple children simultaneously
   - Base time is set by the child requiring the most attention
   - Additional children add incremental time rather than full hours

3. **Age-Based Factors**:
   - Young children (infants/toddlers):
     - First child sets the base time
     - Each additional young child adds 30% more time
   - Older children:
     - First child sets the base time
     - Each additional older child adds 20% more time

4. **Weekend Adjustments**:
   - Base weekend time set by the most time-intensive child
   - Additional children add 25% more time each
   - Accounts for group activities and shared experiences

### Daily Time Constraints

The calculations respect realistic daily constraints:
- 24-hour day
- Parent's sleep (8 hours)
- Work hours (varies by parent type)
- Commute time (varies by work arrangement)
- Essential activities (1.5 hours)

### Special Considerations

1. **Daycare Impact**:
   - Morning routine (1.5-2 hours)
   - Evening routine (3-4 hours)
   - Varies by child's age and parent type

2. **Age-Based Attention**:
   - Infants: Maximum available wake hours
   - Toddlers: High attention needs
   - School-age: Balanced with educational activities
   - Teenagers: More independent time

3. **Passive Time**:
   - Night feedings for infants (up to 30% of sleep time)
   - Gradual reduction as children age
   - Background presence and supervision

The visualization shows both weekday and weekend hours over time, providing a comprehensive view of the parenting journey from pre-birth planning through the children's journey to adulthood. 