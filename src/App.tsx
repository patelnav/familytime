import { useState, useEffect } from 'react';
import { Clock, Github } from 'lucide-react';
import InputSection from './components/InputSection';
import VisualizationSection from './components/VisualizationSection';
import { ParentType } from './utils/timeCalculations';

export interface FamilyData {
  parentBirthYear: string;
  numberOfChildren: string;
  children: {
    birthYear: string;
    daycareUsed: boolean;
    daycareStartAge?: string;
    daycareEndAge?: string;
  }[];
  parentType: ParentType;
  paternalLeaveDuration: string;
}

// Function to encode family data to URL hash
const encodeFamilyData = (data: FamilyData): string => {
  const params = new URLSearchParams();
  
  // Encode basic fields
  if (data.parentBirthYear) params.set('parentBirthYear', data.parentBirthYear);
  if (data.numberOfChildren) params.set('numberOfChildren', data.numberOfChildren);
  if (data.parentType) params.set('parentType', data.parentType);
  if (data.paternalLeaveDuration) params.set('paternalLeaveDuration', data.paternalLeaveDuration);
  
  // Encode children data
  data.children.forEach((child, index) => {
    if (child.birthYear) params.set(`child${index}BirthYear`, child.birthYear);
    params.set(`child${index}Daycare`, child.daycareUsed.toString());
    if (child.daycareStartAge) params.set(`child${index}DaycareStart`, child.daycareStartAge);
    if (child.daycareEndAge) params.set(`child${index}DaycareEnd`, child.daycareEndAge);
  });
  
  return `#${params.toString()}`;
};

// Function to decode family data from URL hash
const decodeFamilyData = (hash: string): FamilyData | null => {
  try {
    const params = new URLSearchParams(hash.replace('#', ''));
    
    // Initialize with current data structure to prevent resets
    const data: FamilyData = {
      parentBirthYear: params.get('parentBirthYear') || '',
      numberOfChildren: params.get('numberOfChildren') || '',
      parentType: (params.get('parentType') as ParentType) || ParentType.FullTimeWork,
      paternalLeaveDuration: params.get('paternalLeaveDuration') || '1',
      children: []
    };
    
    // Get number of children from URL or calculate from child parameters
    const numChildren = parseInt(data.numberOfChildren) || 0;
    
    // Decode children data
    for (let i = 0; i < numChildren; i++) {
      const birthYear = params.get(`child${i}BirthYear`) || '';
      const daycareUsed = params.get(`child${i}Daycare`) === 'true';
      const daycareStartAge = params.get(`child${i}DaycareStart`) || '1';
      const daycareEndAge = params.get(`child${i}DaycareEnd`) || '5';
      
      data.children.push({
        birthYear,
        daycareUsed,
        daycareStartAge,
        daycareEndAge
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error decoding family data:', error);
    return null;
  }
};

// Default family data
const defaultFamilyData: FamilyData = {
  parentBirthYear: '',
  numberOfChildren: '',
  children: [],
  parentType: ParentType.FullTimeWork,
  paternalLeaveDuration: '1',
};

function App() {
  const [familyData, setFamilyData] = useState<FamilyData>(() => {
    // Try to load initial data from URL hash
    if (window.location.hash) {
      const decoded = decodeFamilyData(window.location.hash);
      if (decoded) {
        return decoded;
      }
    }
    return defaultFamilyData;
  });

  // Update URL hash when family data changes, but debounce it to prevent too frequent updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newHash = encodeFamilyData(familyData);
      // Only update if hash is different to prevent unnecessary history entries
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [familyData]);

  // Listen for hash changes (e.g., when user uses browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const decoded = decodeFamilyData(window.location.hash);
        if (decoded) {
          setFamilyData(prev => ({
            ...prev,
            ...decoded,
            // Preserve any existing children data structure
            children: decoded.children.map((child, i) => ({
              ...prev.children[i],
              ...child
            }))
          }));
        }
      } else {
        setFamilyData(defaultFamilyData);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-gray-900">Family Time Guide</h1>
            </div>
            <nav className="flex items-center space-x-2" aria-label="Main navigation">
              <a 
                href="https://github.com/yourusername/familytime.guide" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                aria-label="View source code on GitHub"
              >
                <Github className="h-5 w-5" />
                <span>Source</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Input Section */}
          <div className="lg:col-span-4">
            <InputSection familyData={familyData} setFamilyData={setFamilyData} />
          </div>

          {/* Main Content Area - Visualization */}
          <div className="lg:col-span-8">
            <VisualizationSection familyData={familyData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;