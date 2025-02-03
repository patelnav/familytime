import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { FamilyData } from '../App';
import { 
  calculateTimeSpent, 
  TimeSpent, 
  ChildAgeGroup, 
  getChildAgeGroup,
  baseActiveHours 
} from '../utils/timeCalculations';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Define stage colors with intensity based on baseActiveHours
const getStageColor = (stage: ChildAgeGroup) => {
  const maxHours = Math.max(...(Object.values(baseActiveHours) as number[]));
  const hours = baseActiveHours[stage];
  const intensity = hours / maxHours; // 0 to 1

  // For NotBornYet, keep it gray
  if (stage === ChildAgeGroup.NotBornYet) {
    return '#e5e7eb';
  }

  // Use HSL to maintain hue but vary lightness based on intensity
  // h: 160 (mint green), s: 70%, l: varies from 85% (light) to 45% (dark) based on intensity
  const lightness = 85 - (intensity * 40);
  return `hsl(160, 70%, ${lightness}%)`;
};

const stageColors = Object.fromEntries(
  Object.values(ChildAgeGroup).map(stage => [stage, getStageColor(stage)])
);

// Register the annotation plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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

  const chartData: ChartData<'line'> = {
    labels: timeData.map(d => {
      const parentAge = d.year - parseInt(familyData.parentBirthYear);
      return `${d.year} (Age ${parentAge})`;
    }),
    datasets: [
      {
        label: 'Weekday Hours',
        data: timeData.map(d => parseFloat(d.weekdayHours)),
        borderColor: '#4FD1C5',
        backgroundColor: 'rgba(79, 209, 197, 0.5)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Weekend Hours',
        data: timeData.map(d => parseFloat(d.weekendHours)),
        borderColor: '#805AD5',
        backgroundColor: 'rgba(128, 90, 213, 0.5)',
        tension: 0.4,
        yAxisID: 'y',
      }
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Family Time Over Your Parenting Journey',
      },
      tooltip: {
        callbacks: {
          title(context) {
            const dataIndex = context[0].dataIndex;
            const year = timeData[dataIndex].year;
            const parentAge = year - parseInt(familyData.parentBirthYear);
            return `${year} (Parent Age: ${parentAge})`;
          },
          label(context) {
            const dataIndex = context.dataIndex;
            const datasetLabel = context.dataset.label || '';
            const hours = Math.round(parseFloat(timeData[dataIndex][datasetLabel === 'Weekday Hours' ? 'weekdayHours' : 'weekendHours']));
            return datasetLabel === 'Weekday Hours' 
              ? `Weekdays: ${hours}`
              : `Weekends: ${hours}`;
          },
          afterLabel(context) {
            // Only show child ages after the last dataset's label
            if (context.datasetIndex === context.chart.data.datasets.length - 1) {
              const dataIndex = context.dataIndex;
              const year = timeData[dataIndex].year;
              
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
                .filter((child): child is NonNullable<typeof child> => child !== null)
                .map(child => `${child.name}: ${child.ageStr}`);

              return childAges.length > 0 ? childAges.join(', ') : 'No children born yet';
            }
            return '';  // Return empty string instead of null
          }
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        max: 24,
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
          maxTicksLimit: 15,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Function to render child life stage bars
  const renderLifeStages = () => {
    if (timeData.length === 0) return null;

    const years = timeData.map(d => d.year);

    return (
      <div className="mb-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Child Life Stages</h3>
        {familyData.children.map((child, index) => {
          const birthYear = parseInt(child.birthYear);
          if (isNaN(birthYear)) return null;

          // Calculate position and width relative to the timeline
          const stages = years.map(year => {
            const age = year - birthYear;
            return getChildAgeGroup(age);
          });

          return (
            <div key={index} className="relative h-6">
              <div className="absolute inset-0 flex items-center">
                {/* Label */}
                <div className="w-24 text-sm text-gray-600 truncate pr-2">
                  {child.name || `Child ${index + 1}`}
                </div>
                {/* Stage bars */}
                <div className="flex-1 flex">
                  {stages.map((stage, i) => {
                    const year = years[i];
                    const isFirstYear = i === 0;
                    const currentStage = stage;
                    const prevStage = isFirstYear ? null : stages[i - 1];
                    
                    // Only render when stage changes or it's the first year
                    if (isFirstYear || currentStage !== prevStage) {
                      // Count consecutive years with same stage
                      let stageLength = 1;
                      for (let j = i + 1; j < stages.length; j++) {
                        if (stages[j] === currentStage) {
                          stageLength++;
                        } else {
                          break;
                        }
                      }
                      
                      const width = `${(stageLength / stages.length) * 100}%`;
                      
                      return (
                        <div
                          key={`${year}-${stage}`}
                          className="h-4 first:rounded-l last:rounded-r border-r border-white"
                          style={{
                            width,
                            backgroundColor: stageColors[stage],
                          }}
                          title={`${stage} (${year} - ${year + stageLength - 1})`}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs pt-1">
          {Object.entries(stageColors).map(([stage, color]) => (
            stage !== ChildAgeGroup.NotBornYet && (
              <div key={stage} className="flex items-center">
                <div
                  className="w-3 h-3 rounded mr-1"
                  style={{ backgroundColor: color }}
                />
                <span>{stage}</span>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full border-2 border-slate-200 rounded-lg p-3 flex flex-col">
      <div className="flex items-center space-x-2 mb-2 flex-shrink-0">
        <BarChart3 className="h-4 w-4 text-slate-600" aria-hidden="true" />
        <h2 className="text-base font-semibold text-gray-900">Time Visualization</h2>
      </div>

      {timeData.length > 0 ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-shrink-0">
            {renderLifeStages()}
          </div>
          <div className="flex-1 min-h-0">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center text-gray-500 border border-slate-200 rounded-md">
          Enter your information to see the time visualization
        </div>
      )}
    </div>
  );
};

export default VisualizationSection;