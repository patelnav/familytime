import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { FamilyData } from '../App';
import { calculateTimeSpent, TimeSpent } from '../utils/timeCalculations';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VisualizationSectionProps {
  familyData: FamilyData;
}

const VisualizationSection: React.FC<VisualizationSectionProps> = ({ familyData }) => {
  const [timeData, setTimeData] = useState<TimeSpent[]>([]);

  useEffect(() => {
    // Validate parent birth year
    const parentBirthYear = parseInt(familyData.parentBirthYear);
    if (isNaN(parentBirthYear)) return;

    // Validate children's birth years and filter out invalid ones
    const validChildren = familyData.children
      .filter(child => {
        const birthYear = parseInt(child.birthYear);
        return !isNaN(birthYear) && birthYear > 1900 && birthYear <= new Date().getFullYear() + 1;
      })
      .map(child => ({
        birthYear: parseInt(child.birthYear),
        daycareUsed: child.daycareUsed,
        daycareStartAge: child.daycareStartAge ? parseFloat(child.daycareStartAge) : undefined,
        daycareEndAge: child.daycareEndAge ? parseFloat(child.daycareEndAge) : undefined,
      }));

    if (validChildren.length === 0) {
      setTimeData([]);
      return;
    }

    const paternalLeaveDuration = parseFloat(familyData.paternalLeaveDuration) || 1;
    const data = calculateTimeSpent(parentBirthYear, validChildren, familyData.parentType, paternalLeaveDuration);
    setTimeData(data);
  }, [familyData]);

  const chartData = {
    labels: timeData.map(d => {
      const parentAge = d.year - parseInt(familyData.parentBirthYear);
      return `${d.year} (Age ${parentAge})`;
    }),
    datasets: [
      {
        label: 'Weekday Hours',
        data: timeData.map(d => parseFloat(d.weekdayHours)),
        borderColor: 'rgb(71, 85, 105)',
        backgroundColor: 'rgba(71, 85, 105, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Weekend Hours',
        data: timeData.map(d => parseFloat(d.weekendHours)),
        borderColor: 'rgb(148, 163, 184)',
        backgroundColor: 'rgba(148, 163, 184, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Family Time Over Your Parenting Journey',
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const year = timeData[dataIndex].year;
            const parentAge = year - parseInt(familyData.parentBirthYear);
            return `${year} (Parent Age: ${parentAge})`;
          },
          label: (context: any) => {
            const dataIndex = context.dataIndex;
            const datasetLabel = context.dataset.label;
            const year = timeData[dataIndex].year;
            
            // Calculate child ages for this point and only include born children
            const childAges = familyData.children
              .filter(child => {
                const birthYear = parseInt(child.birthYear);
                return !isNaN(birthYear) && birthYear > 1900 && birthYear <= new Date().getFullYear() + 1;
              })
              .map(child => {
                const birthYear = Math.floor(parseInt(child.birthYear));
                const ageInYears = year - birthYear;
                
                if (ageInYears < 0) return null;

                return {
                  name: child.name || `Child ${familyData.children.indexOf(child) + 1}`,
                  ageStr: `${ageInYears}y`
                };
              })
              .filter(child => child !== null)
              .map(child => `${child!.name}: ${child!.ageStr}`);

            const childAgesStr = childAges.length > 0 ? childAges.join(', ') : 'No children born yet';
            
            if (datasetLabel === 'Weekday Hours') {
              return [`Weekdays: ${timeData[dataIndex].weekdayHours}`, childAgesStr];
            } else {
              return [`Weekends: ${timeData[dataIndex].weekendHours}`, childAgesStr];
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 24, // Show full 24 hours
        title: {
          display: true,
          text: 'Hours per Day',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Year (Parent Age)',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 15, // Reduced from 20 to account for longer labels
          font: {
            size: 11, // Slightly smaller font to fit more text
          },
        },
      },
    },
  };

  return (
    <div className="h-full border-2 border-slate-200 rounded-lg p-3">
      <div className="flex items-center space-x-2 mb-2">
        <BarChart3 className="h-4 w-4 text-slate-600" aria-hidden="true" />
        <h2 className="text-base font-semibold text-gray-900">Time Visualization</h2>
      </div>

      {timeData.length > 0 ? (
        <div className="h-[calc(100%-2rem)]">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-slate-200 rounded-md">
          Enter your information to see the time visualization
        </div>
      )}
    </div>
  );
};

export default VisualizationSection;