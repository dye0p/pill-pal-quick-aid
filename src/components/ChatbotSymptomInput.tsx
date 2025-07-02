import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, ArrowLeft } from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'bot' | 'user';
  message: string;
  options?: string[];
  timestamp: Date;
}

interface ChatbotSymptomInputProps {
  onComplete: (symptoms: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ChatbotSymptomInput: React.FC<ChatbotSymptomInputProps> = ({ 
  onComplete, 
  onBack, 
  isLoading 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedInfo, setCollectedInfo] = useState<{
    mainSymptom: string;
    duration: string;
    severity: string;
    additionalSymptoms: string[];
    location?: string;
  }>({
    mainSymptom: '',
    duration: '',
    severity: '',
    additionalSymptoms: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatSteps = [
    {
      question: "안녕하세요! 💊 스마트 약 추천 챗봇입니다. 오늘 어디가 가장 불편하신가요?",
      options: ["머리", "목/인후", "가슴/호흡", "배/소화기", "기타 부위"],
      type: 'mainSymptom' as const
    },
    {
      question: "언제부터 이런 증상이 있으셨나요?",
      options: ["방금 전부터", "몇 시간 전부터", "어제부터", "며칠 전부터", "일주일 이상"],
      type: 'duration' as const
    },
    {
      question: "증상의 정도는 어떠신가요?",
      options: ["매우 심함", "심함", "보통", "가벼움", "매우 가벼움"],
      type: 'severity' as const
    },
    {
      question: "다른 동반 증상이 있으신가요? (해당하는 것을 모두 말씀해주세요)",
      options: ["발열", "오한", "메스꺼움", "어지러움", "피로감", "없음"],
      type: 'additionalSymptoms' as const,
      multiSelect: true
    }
  ];

  useEffect(() => {
    // 첫 번째 질문 시작
    const initialMessage: ChatMessage = {
      id: 0,
      type: 'bot',
      message: chatSteps[0].question,
      options: chatSteps[0].options,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOptionClick = (option: string) => {
    const currentStepData = chatSteps[currentStep];
    
    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: messages.length,
      type: 'user',
      message: option,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // 정보 수집
    const newCollectedInfo = { ...collectedInfo };
    
    if (currentStepData.type === 'mainSymptom') {
      newCollectedInfo.mainSymptom = option;
    } else if (currentStepData.type === 'duration') {
      newCollectedInfo.duration = option;
    } else if (currentStepData.type === 'severity') {
      newCollectedInfo.severity = option;
    } else if (currentStepData.type === 'additionalSymptoms') {
      if (option === '없음') {
        newCollectedInfo.additionalSymptoms = [];
      } else {
        if (!newCollectedInfo.additionalSymptoms.includes(option)) {
          newCollectedInfo.additionalSymptoms = [...newCollectedInfo.additionalSymptoms, option];
        }
      }
    }

    setCollectedInfo(newCollectedInfo);

    // 다음 단계로 이동 또는 완료
    setTimeout(() => {
      if (currentStep < chatSteps.length - 1) {
        const nextStep = currentStep + 1;
        const botMessage: ChatMessage = {
          id: messages.length + 1,
          type: 'bot',
          message: chatSteps[nextStep].question,
          options: chatSteps[nextStep].options,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setCurrentStep(nextStep);
      } else {
        // 마지막 단계 - 정보 요약 및 완료
        const summary = generateSummary(newCollectedInfo);
        const summaryMessage: ChatMessage = {
          id: messages.length + 1,
          type: 'bot',
          message: `정보를 정리해드릴게요.\n\n${summary}\n\n이 내용으로 분석을 시작할까요?`,
          options: ['네, 분석 시작', '다시 입력하기'],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, summaryMessage]);
        setCurrentStep(currentStep + 1);
      }
    }, 1000);
  };

  const generateSummary = (info: typeof collectedInfo): string => {
    let summary = `📍 주요 증상: ${info.mainSymptom} 부위 불편감\n`;
    summary += `⏰ 지속 기간: ${info.duration}\n`;
    summary += `🌡️ 심각도: ${info.severity}\n`;
    
    if (info.additionalSymptoms.length > 0) {
      summary += `➕ 동반 증상: ${info.additionalSymptoms.join(', ')}`;
    } else {
      summary += `➕ 동반 증상: 없음`;
    }
    
    return summary;
  };

  const handleComplete = (confirm: boolean) => {
    if (confirm) {
      const symptomsText = `${collectedInfo.mainSymptom} 부위가 ${collectedInfo.duration} ${collectedInfo.severity} 수준으로 아픔. 동반 증상: ${collectedInfo.additionalSymptoms.length > 0 ? collectedInfo.additionalSymptoms.join(', ') : '없음'}`;
      onComplete(symptomsText);
    } else {
      // 다시 시작
      setMessages([]);
      setCurrentStep(0);
      setCollectedInfo({
        mainSymptom: '',
        duration: '',
        severity: '',
        additionalSymptoms: []
      });
      setTimeout(() => {
        const initialMessage: ChatMessage = {
          id: 0,
          type: 'bot',
          message: chatSteps[0].question,
          options: chatSteps[0].options,
          timestamp: new Date()
        };
        setMessages([initialMessage]);
      }, 500);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleOptionClick(currentInput.trim());
      setCurrentInput('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[600px] flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            disabled={isLoading}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">증상 분석 챗봇</h2>
              <p className="text-sm text-gray-500">질문에 답하며 증상을 알려주세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-teal-100 ml-2' : 'bg-blue-100 mr-2'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-teal-600" />
                ) : (
                  <Bot className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="whitespace-pre-line">{message.message}</p>
                </div>
                {message.options && message.type === 'bot' && (
                  <div className="mt-2 space-y-1">
                    {message.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (currentStep >= chatSteps.length) {
                            handleComplete(option === '네, 분석 시작');
                          } else {
                            handleOptionClick(option);
                          }
                        }}
                        disabled={isLoading}
                        className="block w-full text-left p-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 텍스트 입력 영역 */}
      {currentStep < chatSteps.length && (
        <form onSubmit={handleTextSubmit} className="flex gap-2 border-t pt-4">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="직접 입력하거나 위 옵션을 선택하세요..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!currentInput.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatbotSymptomInput;