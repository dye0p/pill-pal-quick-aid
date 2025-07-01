
import React, { useState } from 'react';

interface SymptomInputProps {
  onSubmit: (symptoms: string) => void;
  isLoading: boolean;
}

const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit, isLoading }) => {
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onSubmit(symptoms.trim());
    }
  };

  const exampleSymptoms = [
    "어제 뭘 잘못 먹었는지 계속 배가 아프고, 몸에서 열이나. 몸에 힘도 없어.",
    "머리가 너무 아프고 어지러워. 목과 어깨도 뻣뻣해.",
    "기침이 계속 나오고 목이 따가워. 몸살기가 있는 것 같아."
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          증상을 자세히 알려주세요
        </h2>
        <p className="text-gray-600">
          현재 느끼고 있는 증상을 구체적으로 입력해주시면, 적절한 약물을 추천해드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
            증상 설명
          </label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="예: 어제부터 배가 아프고 열이 나며, 몸에 힘이 없습니다..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all duration-200"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={!symptoms.trim() || isLoading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>분석 중...</span>
            </div>
          ) : (
            '증상 분석하기'
          )}
        </button>
      </form>

      {/* 예시 증상들 */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">💡 입력 예시</h3>
        <div className="space-y-2">
          {exampleSymptoms.map((example, index) => (
            <button
              key={index}
              onClick={() => setSymptoms(example)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200"
              disabled={isLoading}
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SymptomInput;
