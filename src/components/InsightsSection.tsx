import React from 'react';
import { Lightbulb } from 'lucide-react';
import { FamilyData } from '../App';
import { ParentType, getChildAgeGroup, ChildAgeGroup } from '../utils/timeCalculations';

interface InsightsSectionProps {
  familyData: FamilyData;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ familyData }) => {
  const generateInsights = () => {
    if (!familyData.parentBirthYear || !familyData.children.length) {
      return [];
    }

    const insights: string[] = [];
    const currentYear = new Date().getFullYear();
    const parentAge = currentYear - parseInt(familyData.parentBirthYear);

    // Parent Type Insights
    switch (familyData.parentType) {
      case ParentType.StayAtHome:
        insights.push("As a stay-at-home parent, you'll have the most flexibility to maximize quality time with your children, especially during their early years.");
        break;
      case ParentType.FullTimeWork:
        insights.push("Working full-time means being strategic about quality time. Consider establishing strong morning and evening routines to maximize engagement.");
        break;
      case ParentType.RemoteFullTime:
        insights.push("Remote work offers unique opportunities to blend work and family time. You can save commute time and be more present for key moments.");
        break;
      case ParentType.RemotePartTime:
        insights.push("Your part-time remote schedule provides a good balance of focused work time and family engagement.");
        break;
      case ParentType.Flexible:
        insights.push("A flexible schedule allows you to adapt to your children's changing needs and important milestones.");
        break;
    }

    // Parental Leave Insights
    const parentalLeave = parseFloat(familyData.paternalLeaveDuration);
    if (parentalLeave > 1) {
      insights.push(`Your extended parental leave of ${parentalLeave} years provides crucial bonding time during the early developmental stages.`);
    } else if (parentalLeave < 1) {
      insights.push("Consider ways to maximize bonding time during your shorter parental leave period.");
    }

    // Child Age-based Insights
    familyData.children.forEach((child, index) => {
      if (!child.birthYear) return;
      
      const childAge = currentYear - parseInt(child.birthYear);
      const ageGroup = getChildAgeGroup(childAge);
      
      switch (ageGroup) {
        case ChildAgeGroup.Infancy:
          insights.push(`Child ${index + 1} is in infancy - this is a critical period for attachment and development.`);
          if (!child.daycareUsed) {
            insights.push(`Consider introducing structured activities for Child ${index + 1} to support social development.`);
          }
          break;
        case ChildAgeGroup.Toddler:
          if (child.daycareUsed) {
            insights.push(`Daycare provides important socialization for Child ${index + 1} during the toddler years.`);
          }
          break;
        case ChildAgeGroup.EarlyChildhood:
          insights.push(`Focus on educational activities and skill development for Child ${index + 1} during these formative years.`);
          break;
        case ChildAgeGroup.MiddleChildhood:
          insights.push(`Balance academic support with extracurricular activities for Child ${index + 1}.`);
          break;
        case ChildAgeGroup.Adolescence:
          insights.push(`Maintain open communication and support independence for Child ${index + 1} during teenage years.`);
          break;
      }
    });

    // Multiple Children Insights
    if (familyData.children.length > 1) {
      insights.push("With multiple children, consider scheduling one-on-one time with each child to maintain individual connections.");
      insights.push("Look for activities that can engage children of different ages together.");
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="border-2 border-slate-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lightbulb className="h-6 w-6 text-slate-600" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-gray-900">Insights & Recommendations</h2>
      </div>

      {insights.length > 0 ? (
        <ul className="space-y-4">
          {insights.map((insight, index) => (
            <li key={index} className="flex space-x-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-slate-600" />
              <p className="text-gray-700">{insight}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-slate-200 rounded-md">
          Enter family information to see insights
        </div>
      )}
    </div>
  );
};

export default InsightsSection;