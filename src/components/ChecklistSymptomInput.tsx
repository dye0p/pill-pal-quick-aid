import React, { useState } from 'react';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';

interface SymptomCategory {
  id: string;
  name: string;
  icon: string;
  symptoms: string[];
}

interface ChecklistSymptomInputProps {
  onComplete: (symptoms: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ChecklistSymptomInput: React.FC<ChecklistSymptomInputProps> = ({ 
  onComplete, 
  onBack, 
  isLoading 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<{[key: string]: string[]}>({});

  const symptomCategories: SymptomCategory[] = [
    {
      id: 'respiratory',
      name: '호흡기',
      icon: '🫁',
      symptoms: ['기침', '콧물', '코막힘', '가래', '인후통', '목 따가움', '목 쉼', '가슴 답답함']
    },
    {
      id: 'digestive',
      name: '소화기',
      icon: '🍽️',
      symptoms: ['복통', '설사', '변비', '메스꺼움', '구토', '소화불량', '속쓰림', '식욕부진']
    },
    {
      id: 'headache',
      name: '두통/발열',
      icon: '🤕',
      symptoms: ['두통', '편두통', '발열', '오한', '어지러움', '현기증', '목 경직', '눈 피로']
    },
    {
      id: 'musculoskeletal',
      name: '근육/관절',
      icon: '🦴',
      symptoms: ['근육통', '관절통', '어깨 결림', '목 결림', '허리 통증', '무릎 통증', '손목 통증', '발목 통증']
    },
    {
      id: 'skin',
      name: '피부',
      icon: '🧴',
      symptoms: ['발진', '가려움', '두드러기', '건조함', '붓기', '상처', '멍', '화상']
    },
    {
      id: 'general',
      name: '전신증상',
      icon: '😷',
      symptoms: ['피로감', '무기력', '불면증', '식은땀', '체중감소', '체중증가', '갈증', '빈뇨']
    }
  ];

  const toggleSymptom = (categoryId: string, symptom: string) => {
    setSelectedSymptoms(prev => {
      const categorySymptoms = prev[categoryId] || [];
      const newSymptoms = categorySymptoms.includes(symptom)
        ? categorySymptoms.filter(s => s !== symptom)
        : [...categorySymptoms, symptom];
      
      return {
        ...prev,
        [categoryId]: newSymptoms
      };
    });
  };

  const getTotalSelectedCount = () => {
    return Object.values(selectedSymptoms).flat().length;
  };

  const generateSymptomsText = () => {
    const allSymptoms: string[] = [];
    Object.entries(selectedSymptoms).forEach(([categoryId, symptoms]) => {
      if (symptoms.length > 0) {
        const category = symptomCategories.find(c => c.id === categoryId);
        symptoms.forEach(symptom => {
          allSymptoms.push(`${category?.name} - ${symptom}`);
        });
      }
    });
    
    return allSymptoms.length > 0 
      ? `다음 증상들이 있습니다: ${allSymptoms.join(', ')}`
      : '선택된 증상이 없습니다.';
  };

  const handleComplete = () => {
    const symptomsText = generateSymptomsText();
    onComplete(symptomsText);
  };

  const renderCategoryView = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        해당하는 증상 카테고리를 선택하세요
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {symptomCategories.map((category) => {
          const categorySymptomCount = selectedSymptoms[category.id]?.length || 0;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{category.name}</h4>
                    <p className="text-sm text-gray-500">
                      {category.symptoms.length}개 증상 항목
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {categorySymptomCount > 0 && (
                    <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full mr-2">
                      {categorySymptomCount}개 선택
                    </span>
                  )}
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSymptomView = () => {
    const category = symptomCategories.find(c => c.id === selectedCategory);
    if (!category) return null;

    const categorySymptoms = selectedSymptoms[category.id] || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <span className="text-2xl mr-3">{category.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{category.name} 증상</h3>
              <p className="text-sm text-gray-500">해당하는 증상을 모두 선택하세요</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {category.symptoms.map((symptom) => {
            const isSelected = categorySymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                onClick={() => toggleSymptom(category.id, symptom)}
                className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 text-purple-800'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{symptom}</span>
                  {isSelected && (
                    <Check className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {categorySymptoms.length > 0 && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              <strong>{category.name}</strong>에서 {categorySymptoms.length}개 증상을 선택했습니다: {categorySymptoms.join(', ')}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            disabled={isLoading}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">증상 체크리스트</h2>
            <p className="text-sm text-gray-500">해당하는 증상을 선택해주세요</p>
          </div>
        </div>
        
        {getTotalSelectedCount() > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">총 선택된 증상</p>
            <p className="text-lg font-semibold text-purple-600">{getTotalSelectedCount()}개</p>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="min-h-[400px]">
        {!selectedCategory ? renderCategoryView() : renderSymptomView()}
      </div>

      {/* 하단 버튼 */}
      <div className="mt-6 pt-4 border-t">
        {getTotalSelectedCount() > 0 ? (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">선택된 증상 요약:</h4>
              <p className="text-sm text-gray-600">{generateSymptomsText()}</p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedSymptoms({})}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                전체 초기화
              </button>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? '분석 중...' : '증상 분석하기'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-gray-500">증상을 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistSymptomInput;