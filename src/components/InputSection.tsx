import React from 'react';
import { Users } from 'lucide-react';
import { FamilyData } from '../App';
import { ParentType } from '../utils/timeCalculations';

interface InputSectionProps {
  familyData: FamilyData;
  setFamilyData: React.Dispatch<React.SetStateAction<FamilyData>>;
}

const InputSection: React.FC<InputSectionProps> = ({ familyData, setFamilyData }) => {
  const handleNumberOfChildrenChange = (value: string) => {
    const count = parseInt(value) || 0;
    setFamilyData(prev => ({
      ...prev,
      numberOfChildren: value,
      children: Array(count).fill({
        birthYear: '',
        daycareUsed: false,
        daycareStartAge: '1',
        daycareEndAge: '5',
      }),
    }));
  };

  const handleChildChange = (index: number, field: keyof FamilyData['children'][0], value: string | boolean) => {
    setFamilyData(prev => {
      const newChildren = [...prev.children];
      newChildren[index] = {
        ...newChildren[index],
        [field]: value,
      };
      return {
        ...prev,
        children: newChildren,
      };
    });
  };

  const handleParentTypeChange = (value: ParentType) => {
    setFamilyData(prev => ({ ...prev, parentType: value }));
  };

  return (
    <div className="border-2 border-slate-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-6 w-6 text-slate-600" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-gray-900">Family Information</h2>
      </div>

      <div className="space-y-6">
        {/* Parent Type */}
        <div>
          <label htmlFor="parentType" className="block text-sm font-medium text-gray-700">
            Parent Type
          </label>
          <select
            id="parentType"
            value={familyData.parentType}
            onChange={(e) => handleParentTypeChange(e.target.value as ParentType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 rounded-md"
          >
            <option value={ParentType.StayAtHome}>Stay at Home</option>
            <option value={ParentType.FullTimeWork}>Full Time Work</option>
            <option value={ParentType.PartTimeWork}>Part Time Work</option>
            <option value={ParentType.RemoteFullTime}>Remote Full Time</option>
            <option value={ParentType.RemotePartTime}>Remote Part Time</option>
            <option value={ParentType.Flexible}>Flexible</option>
          </select>
        </div>

        {/* Paternal Leave Duration */}
        <div>
          <label htmlFor="paternalLeaveDuration" className="block text-sm font-medium text-gray-700">
            Parental Leave Duration (years)
          </label>
          <input
            type="number"
            id="paternalLeaveDuration"
            value={familyData.paternalLeaveDuration}
            onChange={(e) => setFamilyData(prev => ({ ...prev, paternalLeaveDuration: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            placeholder="e.g., 1"
            step="0.1"
            min="0"
            max="3"
          />
        </div>

        {/* Parent's Birth Year */}
        <div>
          <label htmlFor="parentBirthYear" className="block text-sm font-medium text-gray-700">
            Parent's Birth Year
          </label>
          <input
            type="number"
            id="parentBirthYear"
            value={familyData.parentBirthYear}
            onChange={(e) => setFamilyData(prev => ({ ...prev, parentBirthYear: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            placeholder="e.g., 1980"
          />
        </div>

        {/* Number of Children */}
        <div>
          <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-700">
            Number of Children
          </label>
          <input
            type="number"
            id="numberOfChildren"
            value={familyData.numberOfChildren}
            onChange={(e) => handleNumberOfChildrenChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            min="1"
            max="10"
            placeholder="e.g., 2"
          />
        </div>

        {/* Children Information */}
        {familyData.children.map((child, index) => (
          <div key={index} className="space-y-4 p-4 border border-slate-200 rounded-md">
            <h3 className="font-medium text-gray-900">Child {index + 1}</h3>
            
            {/* Birth Year */}
            <div>
              <label htmlFor={`childBirthYear${index}`} className="block text-sm font-medium text-gray-700">
                Birth Year
              </label>
              <input
                type="number"
                id={`childBirthYear${index}`}
                value={child.birthYear}
                onChange={(e) => handleChildChange(index, 'birthYear', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                placeholder={`e.g., ${new Date().getFullYear() - 5}`}
              />
            </div>

            {/* Daycare Options */}
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`daycareUsed${index}`}
                  checked={child.daycareUsed}
                  onChange={(e) => handleChildChange(index, 'daycareUsed', e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor={`daycareUsed${index}`} className="ml-2 block text-sm text-gray-700">
                  Uses Daycare
                </label>
              </div>

              {child.daycareUsed && (
                <>
                  <div>
                    <label htmlFor={`daycareStartAge${index}`} className="block text-sm font-medium text-gray-700">
                      Daycare Start Age
                    </label>
                    <input
                      type="number"
                      id={`daycareStartAge${index}`}
                      value={child.daycareStartAge}
                      onChange={(e) => handleChildChange(index, 'daycareStartAge', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                      min="0"
                      max="5"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label htmlFor={`daycareEndAge${index}`} className="block text-sm font-medium text-gray-700">
                      Daycare End Age
                    </label>
                    <input
                      type="number"
                      id={`daycareEndAge${index}`}
                      value={child.daycareEndAge}
                      onChange={(e) => handleChildChange(index, 'daycareEndAge', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                      min="1"
                      max="6"
                      step="0.5"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Update button style to teal for emphasis */}
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors">
          Add Child
        </button>
      </div>
    </div>
  );
};

export default InputSection;