import React, { useState, useEffect } from 'react';
import SymptomInputSelector from '../components/SymptomInputSelector';
import SymptomInput from '../components/SymptomInput';
import ChatbotSymptomInput from '../components/ChatbotSymptomInput';
import ChecklistSymptomInput from '../components/ChecklistSymptomInput';
import RecommendationResult from '../components/RecommendationResult';
import UserProfile from '../components/UserProfile';
import LegalDisclaimerModal from '../components/LegalDisclaimerModal';
import { MedicalRecommendation, UserProfile as UserProfileType, RiskAssessment } from '../types/medical';
import { User } from 'lucide-react';

const Index = () => {
  const [recommendation, setRecommendation] = useState<MedicalRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedInputMethod, setSelectedInputMethod] = useState<'text' | 'chatbot' | 'checklist' | null>(null);
  const [showLegalDisclaimer, setShowLegalDisclaimer] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType>({
    allergies: [],
    conditions: [],
    medications: []
  });

  // 로컬 스토리지에서 사용자 프로필 불러오기 및 법적 고지 확인
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // 법적 고지 동의 여부 확인
    const hasAcceptedDisclaimer = localStorage.getItem('hasAcceptedLegalDisclaimer');
    if (!hasAcceptedDisclaimer) {
      setShowLegalDisclaimer(true);
    }
  }, []);

  // 법적 고지 동의 처리
  const handleLegalDisclaimerAccept = () => {
    localStorage.setItem('hasAcceptedLegalDisclaimer', 'true');
    setShowLegalDisclaimer(false);
  };

  // 사용자 프로필 저장
  const handleProfileUpdate = (profile: UserProfileType) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const handleSymptomSubmit = (symptoms: string) => {
    setIsLoading(true);
    
    // 증상 분석 시뮬레이션 (실제로는 AI API 호출)
    setTimeout(() => {
      const result = analyzeSymptoms(symptoms, userProfile);
      setRecommendation(result);
      setIsLoading(false);
    }, 1500);
  };

  const analyzeRisk = (symptoms: string): RiskAssessment => {
    const lowerSymptoms = symptoms.toLowerCase();
    
    // 고위험 증상 키워드
    const highRiskKeywords = [
      '가슴', '심장', '숨', '호흡', '의식', '실신', '경련', '발작', 
      '출혈', '토혈', '혈변', '극심한', '극도로', '심각한', '응급'
    ];
    
    // 중위험 증상 키워드
    const mediumRiskKeywords = [
      '고열', '39도', '40도', '탈수', '지속적', '악화', '심한', '격렬한'
    ];

    const hasHighRisk = highRiskKeywords.some(keyword => lowerSymptoms.includes(keyword));
    const hasMediumRisk = mediumRiskKeywords.some(keyword => lowerSymptoms.includes(keyword));

    if (hasHighRisk) {
      return {
        level: 'high',
        title: '즉시 응급실 방문 필요',
        description: '입력하신 증상은 응급상황일 가능성이 높습니다. 지체하지 마시고 즉시 응급실을 방문하거나 119에 신고하세요.',
        action: '지금 즉시 가까운 응급실을 방문하거나 119에 신고하세요.',
        emergency: {
          message: '응급상황이 의심됩니다. 즉시 전문의료진의 도움을 받으세요.',
          hospitals: [
            {
              name: '삼성서울병원 응급실',
              distance: '850m',
              address: '서울시 강남구 일원로 81',
              phone: '02-3410-2114',
              lat: 37.4886, 
              lng: 127.0856
            },
            {
              name: '강남세브란스병원 응급실',
              distance: '1.2km',
              address: '서울시 강남구 언주로 211',
              phone: '02-2019-3333',
              lat: 37.5198,
              lng: 127.0473
            }
          ]
        }
      };
    } else if (hasMediumRisk) {
      return {
        level: 'medium',
        title: '주의 깊은 관찰과 빠른 대처 필요',
        description: '증상이 악화되거나 지속될 경우 병원 방문을 고려하세요. 응급실까지는 아니지만 주의가 필요합니다.',
        action: '증상 경과를 지켜보시고, 악화되면 병원을 방문하세요.'
      };
    } else {
      return {
        level: 'low',
        title: '경미한 증상',
        description: '일반적인 증상으로 보입니다. 적절한 휴식과 함께 일반의약품으로 관리 가능합니다.',
        action: '충분한 휴식과 함께 추천 약물을 고려해보세요.'
      };
    }
  };

  const analyzeSymptoms = (symptoms: string, profile: UserProfileType): MedicalRecommendation => {
    const lowerSymptoms = symptoms.toLowerCase();
    const riskAssessment = analyzeRisk(symptoms);
    
    // 고위험인 경우 약 추천 없이 응급실 안내만
    if (riskAssessment.level === 'high') {
      return {
        symptoms,
        riskAssessment
      };
    }

    // 개인 맞춤 경고 생성
    const personalizedWarnings: string[] = [];
    
    // 장염 증상 분석
    if (lowerSymptoms.includes('배') && (lowerSymptoms.includes('아프') || lowerSymptoms.includes('통증')) && lowerSymptoms.includes('열')) {
      const medicines = [
        { 
          name: '스멕타', 
          effect: '설사 증상 완화 및 장 보호', 
          price: '8,000원',
          contraindications: []
        },
        { 
          name: '타이레놀', 
          effect: '발열 및 통증 완화', 
          price: '6,500원',
          contraindications: ['아세트아미노펜']
        }
      ];

      // 알레르기 필터링
      const safeMedicines = medicines.filter(medicine => 
        !medicine.contraindications?.some(contraindication => 
          profile.allergies.some(allergy => 
            allergy.toLowerCase().includes(contraindication.toLowerCase())
          )
        )
      );

      // 알레르기 경고
      if (safeMedicines.length < medicines.length) {
        personalizedWarnings.push('프로필의 알레르기 정보에 따라 일부 약물이 제외되었습니다.');
      }

      return {
        symptoms,
        riskAssessment,
        disease: '장염',
        description: '식중독이나 바이러스로 인한 장염이 의심됩니다.',
        alternativeDiseases: [
          { name: '식중독', probability: '30%', description: '상한 음식 섭취로 인한 급성 위장 장애' },
          { name: '위장 감기', probability: '25%', description: '바이러스성 위장관염으로 구토와 설사 동반' },
          { name: '과민성 대장 증후군', probability: '15%', description: '스트레스나 특정 음식으로 인한 장 기능 이상' }
        ],
        medicines: safeMedicines,
        personalizedWarnings,
        salesLocations: [
          { 
            id: '1',
            name: '튼튼약국', 
            type: 'pharmacy',
            distance: '250m', 
            address: '서울시 강남구 삼성동 159-1', 
            lat: 37.5088, 
            lng: 127.0594,
            phone: '02-555-1234',
            operatingHours: '09:00 ~ 19:00',
            isOpen: true,
            currentStatus: '운영 중'
          },
          { 
            id: '2',
            name: 'GS25 삼성점', 
            type: 'convenience_store',
            distance: '180m', 
            address: '서울시 강남구 삼성동 159-5', 
            lat: 37.5091, 
            lng: 127.0591,
            phone: '02-555-2345',
            operatingHours: '24시간',
            isOpen: true,
            currentStatus: '운영 중'
          },
          { 
            id: '3',
            name: '희망약국', 
            type: 'pharmacy',
            distance: '400m', 
            address: '서울시 강남구 삼성동 161-5', 
            lat: 37.5095, 
            lng: 127.0601,
            phone: '02-555-3456',
            operatingHours: '09:00 ~ 18:00',
            isOpen: true,
            currentStatus: '운영 중'
          },
          {
            id: '4',
            name: '쿠팡',
            type: 'online_store',
            operatingHours: '24시간 주문 가능',
            isOpen: true,
            currentStatus: '주문 가능',
            url: 'https://www.coupang.com/np/search?q=스멕타',
            deliveryInfo: '로켓배송 (당일/익일 배송)'
          },
          {
            id: '5',
            name: '올리브영 온라인몰',
            type: 'online_store',
            operatingHours: '24시간 주문 가능',
            isOpen: true,
            currentStatus: '주문 가능',
            url: 'https://www.oliveyoung.co.kr/store/search/getSearch.do?query=타이레놀',
            deliveryInfo: '무료배송 (2만원 이상)'
          }
        ]
      };
    } 
    // 두통 증상 분석
    else if (lowerSymptoms.includes('머리') && lowerSymptoms.includes('아프')) {
      const medicines = [
        { 
          name: '타이레놀', 
          effect: '두통 및 통증 완화', 
          price: '6,500원',
          contraindications: ['아세트아미노펜']
        },
        { 
          name: '낙센', 
          effect: '염증성 두통 완화', 
          price: '12,000원',
          contraindications: ['이부프로펜', 'NSAIDs']
        }
      ];

      const safeMedicines = medicines.filter(medicine => 
        !medicine.contraindications?.some(contraindication => 
          profile.allergies.some(allergy => 
            allergy.toLowerCase().includes(contraindication.toLowerCase())
          )
        )
      );

      if (safeMedicines.length < medicines.length) {
        personalizedWarnings.push('프로필의 알레르기 정보에 따라 일부 약물이 제외되었습니다.');
      }

      return {
        symptoms,
        riskAssessment,
        disease: '긴장성 두통',
        description: '스트레스나 피로로 인한 긴장성 두통이 의심됩니다.',
        alternativeDiseases: [
          { name: '편두통', probability: '35%', description: '혈관성 두통으로 맥박에 맞춰 욱신거리는 통증' },
          { name: '군발성 두통', probability: '20%', description: '일정 기간 동안 집중적으로 발생하는 심한 두통' },
          { name: '목 근육 경직', probability: '25%', description: '목과 어깨 근육 긴장으로 인한 연관 두통' }
        ],
        medicines: safeMedicines,
        personalizedWarnings,
        salesLocations: [
          { 
            id: '1',
            name: '튼튼약국', 
            type: 'pharmacy',
            distance: '250m', 
            address: '서울시 강남구 삼성동 159-1', 
            lat: 37.5088, 
            lng: 127.0594,
            phone: '02-555-1234',
            operatingHours: '09:00 ~ 19:00',
            isOpen: true,
            currentStatus: '운영 중'
          },
          { 
            id: '4',
            name: 'CU 삼성역점', 
            type: 'convenience_store',
            distance: '320m', 
            address: '서울시 강남구 삼성동 162-3', 
            lat: 37.5098, 
            lng: 127.0598,
            phone: '02-555-4567',
            operatingHours: '24시간',
            isOpen: true,
            currentStatus: '운영 중'
          }
        ]
      };
    } 
    // 감기 증상 분석
    else if (lowerSymptoms.includes('기침') || lowerSymptoms.includes('목')) {
      return {
        symptoms,
        riskAssessment,
        disease: '감기 (상기도 감염)',
        description: '바이러스성 상기도 감염(감기)이 의심됩니다.',
        alternativeDiseases: [
          { name: '인후염', probability: '40%', description: '목구멍 염증으로 인한 통증과 기침' },
          { name: '기관지염', probability: '25%', description: '기관지 염증으로 인한 지속적인 기침' },
          { name: '알레르기성 비염', probability: '20%', description: '알레르기 반응으로 인한 기침과 콧물' }
        ],
        medicines: [
          { name: '판피린', effect: '감기 증상 종합 완화', price: '9,800원' },
          { name: '스트렙실', effect: '목 통증 및 염증 완화', price: '7,200원' }
        ],
        salesLocations: [
          { 
            id: '3',
            name: '희망약국', 
            type: 'pharmacy',
            distance: '400m', 
            address: '서울시 강남구 삼성동 161-5', 
            lat: 37.5095, 
            lng: 127.0601,
            phone: '02-555-3456',
            operatingHours: '09:00 ~ 18:00',
            isOpen: true,
            currentStatus: '운영 중'
          },
          { 
            id: '5',
            name: '세븐일레븐 삼성점', 
            type: 'convenience_store',
            distance: '280m', 
            address: '서울시 강남구 삼성동 160-2', 
            lat: 37.5092, 
            lng: 127.0596,
            phone: '02-555-5678',
            operatingHours: '24시간',
            isOpen: true,
            currentStatus: '운영 중'
          }
        ]
      };
    } 
    // 기타 증상
    else {
      return {
        symptoms,
        riskAssessment,
        disease: '일반적인 컨디션 난조',
        description: '충분한 휴식과 수분 섭취가 필요해 보입니다.',
        alternativeDiseases: [
          { name: '만성 피로 증후군', probability: '30%', description: '장기간 지속되는 피로와 무기력감' },
          { name: '스트레스성 신체화 장애', probability: '25%', description: '정신적 스트레스가 신체 증상으로 나타나는 상태' },
          { name: '영양 결핍', probability: '20%', description: '필수 영양소 부족으로 인한 전반적 컨디션 저하' }
        ],
        medicines: [
          { name: '비타민C', effect: '면역력 강화 및 피로 회복', price: '15,000원' },
          { name: '종합비타민', effect: '전체적인 영양 보충', price: '18,000원' }
        ],
        salesLocations: [
          { 
            id: '2',
            name: 'GS25 삼성점', 
            type: 'convenience_store',
            distance: '180m', 
            address: '서울시 강남구 삼성동 159-5', 
            lat: 37.5091, 
            lng: 127.0591,
            phone: '02-555-2345',
            operatingHours: '24시간',
            isOpen: true,
            currentStatus: '운영 중'
          },
          { 
            id: '1',
            name: '튼튼약국', 
            type: 'pharmacy',
            distance: '250m', 
            address: '서울시 강남구 삼성동 159-1', 
            lat: 37.5088, 
            lng: 127.0594,
            phone: '02-555-1234',
            operatingHours: '09:00 ~ 19:00',
            isOpen: true,
            currentStatus: '운영 중'
          }
        ]
      };
    }
  };

  const handleReset = () => {
    setRecommendation(null);
    setSelectedInputMethod(null);
  };

  const handleMethodSelect = (method: 'text' | 'chatbot' | 'checklist') => {
    setSelectedInputMethod(method);
  };

  const handleBackToSelector = () => {
    setSelectedInputMethod(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <h1 className="text-4xl font-bold text-teal-800">
              💊 스마트 약 추천 앱 v2.2
            </h1>
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              건강 프로필
            </button>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            다양한 입력 방식으로 증상을 알려주시면, 안전한 분석과 개인 맞춤형 약 추천, 주변 판매처 정보를 제공합니다.
          </p>
          
          {/* 프로필 요약 */}
          {(userProfile.allergies.length > 0 || userProfile.conditions.length > 0) && (
            <div className="mt-6 max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600 mb-2">현재 설정된 프로필:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {userProfile.allergies.map((allergy, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-600 rounded-full">
                    알레르기: {allergy}
                  </span>
                ))}
                {userProfile.conditions.map((condition, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                    기저질환: {condition}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-4xl mx-auto">
          {!recommendation ? (
            <>
              {!selectedInputMethod ? (
                <SymptomInputSelector onMethodSelect={handleMethodSelect} />
              ) : selectedInputMethod === 'text' ? (
                <SymptomInput onSubmit={handleSymptomSubmit} isLoading={isLoading} onBack={handleBackToSelector} />
              ) : selectedInputMethod === 'chatbot' ? (
                <ChatbotSymptomInput onComplete={handleSymptomSubmit} isLoading={isLoading} onBack={handleBackToSelector} />
              ) : selectedInputMethod === 'checklist' ? (
                <ChecklistSymptomInput onComplete={handleSymptomSubmit} isLoading={isLoading} onBack={handleBackToSelector} />
              ) : null}
            </>
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
                ⚠️ v2.2 주요 개선사항
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="mb-2">
                  <strong>본 서비스는 참고용 데모 애플리케이션</strong>입니다. 
                  실제 의학적 진단을 대체할 수 없으며, 심각한 증상이 지속되거나 악화될 경우 반드시 전문의와 상담하시기 바랍니다.
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>서비스 이용 전 필수 법적 고지 및 동의 시스템</li>
                  <li>온라인 구매처 추가 (쿠팡, 올리브영 등)</li>
                  <li>개선된 판매처 정보 표시 (오프라인/온라인 구분)</li>
                  <li>준비 중: AI 기반 증상 분석 (Gemini API)</li>
                  <li>준비 중: 실시간 위치 기반 지도 서비스</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 법적 고지 모달 */}
      <LegalDisclaimerModal 
        isOpen={showLegalDisclaimer}
        onAccept={handleLegalDisclaimerAccept}
      />

      {/* 사용자 프로필 모달 */}
      {showProfile && (
        <UserProfile
          profile={userProfile}
          onProfileUpdate={handleProfileUpdate}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default Index;