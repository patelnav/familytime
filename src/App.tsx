import { useState, useEffect } from 'react';
import { Github } from 'lucide-react';
import InputSection from './components/InputSection';
import VisualizationSection from './components/VisualizationSection';
import { ParentType } from './utils/timeCalculations';

export interface FamilyData {
  parentBirthYear: string;
  children: {
    name: string;
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
  if (data.parentType) params.set('parentType', data.parentType);
  if (data.paternalLeaveDuration) params.set('paternalLeaveDuration', data.paternalLeaveDuration);
  
  // Encode children data
  data.children.forEach((child, index) => {
    if (child.name) params.set(`child${index}Name`, child.name);
    if (child.birthYear) params.set(`child${index}BirthYear`, child.birthYear);
    params.set(`child${index}Daycare`, child.daycareUsed.toString());
    if (child.daycareStartAge) params.set(`child${index}DaycareStart`, child.daycareStartAge);
    if (child.daycareEndAge) params.set(`child${index}DaycareEnd`, child.daycareEndAge);
  });
  
  return `#${params.toString()}`;
};

// Function to decode family data from URL hash
const decodeFamilyData = (hash: string): FamilyData => {
  const params = new URLSearchParams(hash.replace('#', ''));
  const data: FamilyData = {
    parentBirthYear: params.get('parentBirthYear') || '',
    parentType: (params.get('parentType') as ParentType) || ParentType.FullTimeWork,
    paternalLeaveDuration: params.get('paternalLeaveDuration') || '1',
    children: []
  };

  // Find all children by looking for birthYear parameters
  let index = 0;
  while (params.has(`child${index}BirthYear`)) {
    data.children.push({
      name: params.get(`child${index}Name`) || '',
      birthYear: params.get(`child${index}BirthYear`) || '',
      daycareUsed: params.get(`child${index}Daycare`) === 'true',
      daycareStartAge: params.get(`child${index}DaycareStart`) || undefined,
      daycareEndAge: params.get(`child${index}DaycareEnd`) || undefined,
    });
    index++;
  }

  return data;
};

// Default family data
const defaultFamilyData: FamilyData = {
  parentBirthYear: '',
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
    <div className="h-screen overflow-hidden bg-white">
      <main className="h-full max-w-[98%] mx-auto px-2 sm:px-3 py-3">
        {/* Centered Title with Logo */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center space-x-2">
            <img src="/logo.png" alt="Family Time Guide Logo" className="h-6 w-6" />
            <h1 className="text-xl font-bold text-teal-700">Family Time Guide</h1>
          </div>
          <a 
            href="https://github.com/patelnav/familytime" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800"
            aria-label="View source code on GitHub"
          >
            <Github className="h-3 w-3 mr-1" />
            <span>Source</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-4rem)]">
          {/* Left Sidebar - Input Section */}
          <div className="lg:col-span-3 overflow-auto">
            <InputSection familyData={familyData} setFamilyData={setFamilyData} />
          </div>

          {/* Main Content Area - Visualization */}
          <div className="lg:col-span-9 overflow-hidden">
            <VisualizationSection familyData={familyData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;