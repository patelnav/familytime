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
    if (familyData.parentBirthYear && familyData.children.length > 0) {
      const parentBirthYear = parseInt(familyData.parentBirthYear);
      const children = familyData.children
        .filter(child => child.birthYear !== '')
        .map(child => ({
          birthYear: parseInt(child.birthYear),
          daycareUsed: child.daycareUsed,
          daycareStartAge: child.daycareStartAge ? parseFloat(child.daycareStartAge) : undefined,
          daycareEndAge: child.daycareEndAge ? parseFloat(child.daycareEndAge) : undefined,
        }));

      const paternalLeaveDuration = parseFloat(familyData.paternalLeaveDuration) || 1;
      const data = calculateTimeSpent(parentBirthYear, children, familyData.parentType, paternalLeaveDuration);
      setTimeData(data);
    }
  }, [familyData]);

  const chartData = {
    labels: timeData.map(d => {
      const parentAge = d.year - parseInt(familyData.parentBirthYear);
      return `${d.year} (Age ${parentAge})`;
    }),
    datasets: [
      {
        label: 'Weekday Hours',
        data: timeData.map(d => {
          const [min] = d.weekdayHours.split('–');
          return parseFloat(min);
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Weekend Hours',
        data: timeData.map(d => {
          const [min] = d.weekendHours.split('–');
          return parseFloat(min);
        }),
        borderColor: 'rgb(147, 197, 253)',
        backgroundColor: 'rgba(147, 197, 253, 0.5)',
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
          label: (context: any) => {
            const dataIndex = context.dataIndex;
            const datasetLabel = context.dataset.label;
            if (datasetLabel === 'Weekday Hours') {
              return `Weekdays: ${timeData[dataIndex].weekdayHours}`;
            } else {
              return `Weekends: ${timeData[dataIndex].weekendHours}`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 16, // Max available hours (24 - 8 sleep hours)
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="h-6 w-6 text-indigo-600" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-gray-900">Time Visualization</h2>
      </div>

      {timeData.length > 0 ? (
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Enter your information to see the time visualization
        </div>
      )}
    </div>
  );
};

export default VisualizationSection;