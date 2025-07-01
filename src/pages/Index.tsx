
import React, { useState } from 'react';
import SymptomInput from '../components/SymptomInput';
import RecommendationResult from '../components/RecommendationResult';
import { MedicalRecommendation } from '../types/medical';

const Index = () => {
  const [recommendation, setRecommendation] = useState<MedicalRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSymptomSubmit = (symptoms: string) => {
    setIsLoading(true);
    
    // 증상 분석 시뮬레이션 (실제로는 AI API 호출)
    setTimeout(() => {
      const result = analyzeSymptoms(symptoms);
      setRecommendation(result);
      setIsLoading(false);
    }, 1500);
  };

  const analyzeSymptoms = (symptoms: string): MedicalRecommendation => {
    const lowerSymptoms = symptoms.toLowerCase();
    
    // 간단한 키워드 기반 분석
    if (lowerSymptoms.includes('배') && (lowerSymptoms.includes('아프') || lowerSymptoms.includes('통증')) && lowerSymptoms.includes('열')) {
      return {
        disease: '장염',
        description: '식중독이나 바이러스로 인한 장염이 의심됩니다.',
        medicines: [
          { name: '스멕타', effect: '설사 증상 완화 및 장 보호', price: '8,000원' },
          { name: '타이레놀', effect: '발열 및 통증 완화', price: '6,500원' }
        ],
        pharmacies: [
          { name: '튼튼약국', distance: '250m', address: '서울시 강남구 삼성동 159-1', lat: 37.5088, lng: 127.0594 },
          { name: '희망약국', distance: '400m', address: '서울시 강남구 삼성동 161-5', lat: 37.5095, lng: 127.0601 },
          { name: '건강약국', distance: '650m', address: '서울시 강남구 삼성동 168-2', lat: 37.5102, lng: 127.0588 }
        ]
      };
    } else if (lowerSymptoms.includes('머리') && lowerSymptoms.includes('아프')) {
      return {
        disease: '두통',
        description: '스트레스나 피로로 인한 긴장성 두통이 의심됩니다.',
        medicines: [
          { name: '타이레놀', effect: '두통 및 통증 완화', price: '6,500원' },
          { name: '낙센', effect: '염증성 두통 완화', price: '12,000원' }
        ],
        pharmacies: [
          { name: '튼튼약국', distance: '250m', address: '서울시 강남구 삼성동 159-1', lat: 37.5088, lng: 127.0594 },
          { name: '희망약국', distance: '400m', address: '서울시 강남구 삼성동 161-5', lat: 37.5095, lng: 127.0601 }
        ]
      };
    } else if (lowerSymptoms.includes('기침') || lowerSymptoms.includes('목')) {
      return {
        disease: '감기',
        description: '바이러스성 상기도 감염(감기)이 의심됩니다.',
        medicines: [
          { name: '판피린', effect: '감기 증상 종합 완화', price: '9,800원' },
          { name: '스트렙실', effect: '목 통증 및 염증 완화', price: '7,200원' }
        ],
        pharmacies: [
          { name: '건강약국', distance: '650m', address: '서울시 강남구 삼성동 168-2', lat: 37.5102, lng: 127.0588 },
          { name: '튼튼약국', distance: '250m', address: '서울시 강남구 삼성동 159-1', lat: 37.5088, lng: 127.0594 }
        ]
      };
    } else {
      return {
        disease: '일반적인 컨디션 난조',
        description: '충분한 휴식과 수분 섭취가 필요해 보입니다.',
        medicines: [
          { name: '비타민C', effect: '면역력 강화 및 피로 회복', price: '15,000원' },
          { name: '종합비타민', effect: '전체적인 영양 보충', price: '18,000원' }
        ],
        pharmacies: [
          { name: '희망약국', distance: '400m', address: '서울시 강남구 삼성동 161-5', lat: 37.5095, lng: 127.0601 },
          { name: '튼튼약국', distance: '250m', address: '서울시 강남구 삼성동 159-1', lat: 37.5088, lng: 127.0594 }
        ]
      };
    }
  };

  const handleReset = () => {
    setRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-800 mb-4">
            💊 스마트 약 추천 앱
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            증상을 입력하면 예상 질병과 적절한 일반의약품, 그리고 주변 약국 정보를 한 번에 제공합니다.
          </p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-4xl mx-auto">
          {!recommendation ? (
            <SymptomInput onSubmit={handleSymptomSubmit} isLoading={isLoading} />
          ) : (
            <RecommendationResult 
              recommendation={recommendation} 
              onReset={handleReset}
            />
          )}
        </div>

        {/* 주의사항 */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                ⚠️ 중요한 안내사항
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  본 서비스는 <strong>참고용 데모 애플리케이션</strong>입니다. 
                  실제 의학적 진단을 대체할 수 없으며, 심각한 증상이 지속되거나 악화될 경우 반드시 전문의와 상담하시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
