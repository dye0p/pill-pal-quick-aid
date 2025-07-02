import React from 'react';
import { MessageCircle, FileText, CheckSquare } from 'lucide-react';

interface SymptomInputSelectorProps {
  onMethodSelect: (method: 'text' | 'chatbot' | 'checklist') => void;
}

const SymptomInputSelector: React.FC<SymptomInputSelectorProps> = ({ onMethodSelect }) => {
  const inputMethods = [
    {
      id: 'text' as const,
      title: '자유 텍스트 입력',
      description: '내 증상을 자유롭게 서술해요',
      icon: FileText,
      targetUser: '자신의 상태를 명확하게 표현할 수 있는 사용자',
      color: 'teal',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      hoverColor: 'hover:bg-teal-100'
    },
    {
      id: 'chatbot' as const,
      title: '챗봇과 대화하기',
      description: '질문에 답하며 차근차근 알아가요',
      icon: MessageCircle,
      targetUser: '무엇부터 말해야 할지 막막한 사용자',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'checklist' as const,
      title: '증상 체크리스트',
      description: '목록에서 해당하는 증상을 선택해요',
      icon: CheckSquare,
      targetUser: '시각적으로 확인하며 선택하고 싶은 사용자',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          증상 입력 방법을 선택해주세요
        </h2>
        <p className="text-gray-600">
          가장 편한 방법으로 증상을 알려주시면, 개인 맞춤형 분석을 제공해드립니다.
        </p>
      </div>

      <div className="space-y-4">
        {inputMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              className={`w-full p-6 border-2 rounded-xl transition-all duration-200 text-left ${method.bgColor} ${method.borderColor} ${method.hoverColor} hover:shadow-md transform hover:scale-[1.02]`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${method.bgColor} border ${method.borderColor}`}>
                  <Icon className={`h-6 w-6 ${method.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {method.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    💡 {method.targetUser}
                  </p>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          💡 선택한 방법으로 입력이 완료되면, 동일한 분석 과정을 거쳐 맞춤형 결과를 제공합니다.
        </p>
      </div>
    </div>
  );
};

export default SymptomInputSelector;