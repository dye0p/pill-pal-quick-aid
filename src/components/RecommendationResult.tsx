import React, { useState } from 'react';
import { MedicalRecommendation } from '../types/medical';
import { AlertTriangle, Hospital, Info } from 'lucide-react';

interface RecommendationResultProps {
  recommendation: MedicalRecommendation;
  onReset: () => void;
}

const RecommendationResult: React.FC<RecommendationResultProps> = ({ 
  recommendation, 
  onReset 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  // 응급상황 처리
  if (recommendation.riskAssessment.level === 'high') {
    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-red-600">긴급 상황 안내</h2>
            <button
              onClick={onReset}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              새로 검색하기
            </button>
          </div>
        </div>

        {/* 입력한 증상 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">입력하신 증상</h3>
              <p className="text-gray-600">증상 분석 기준</p>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <p className="text-blue-800 leading-relaxed">"{recommendation.symptoms}"</p>
          </div>
        </div>

        {/* 위험도 경고 */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-12 w-12 mr-4" />
            <div>
              <h3 className="text-2xl font-bold">{recommendation.riskAssessment.title}</h3>
              <p className="text-red-100 mt-1">위험도: {recommendation.riskAssessment.level === 'high' ? '높음' : recommendation.riskAssessment.level}</p>
            </div>
          </div>
          
          <div className="bg-red-600 bg-opacity-50 rounded-lg p-6 mb-6">
            <p className="text-lg leading-relaxed mb-4">{recommendation.riskAssessment.description}</p>
            <p className="text-xl font-semibold">{recommendation.riskAssessment.action}</p>
          </div>

          {recommendation.riskAssessment.emergency && (
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Hospital className="h-5 w-5 mr-2" />
                가까운 응급의료기관
              </h4>
              <div className="grid gap-3">
                {recommendation.riskAssessment.emergency.hospitals.map((hospital, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold text-lg">{hospital.name}</h5>
                        <p className="text-red-100">{hospital.address}</p>
                        <p className="text-red-100">📞 {hospital.phone}</p>
                      </div>
                      <span className="text-white font-bold bg-red-500 px-3 py-1 rounded-full">
                        {hospital.distance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 면책 조항 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm p-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-yellow-400 mr-3 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ 중요한 안내사항
              </h3>
              <p className="text-sm text-yellow-700">
                본 서비스는 의학적 진단이 아니며, 참고용으로만 사용해야 합니다. 
                정확한 진단과 치료는 반드시 의사 또는 약사와 상의하십시오.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 일반적인 추천 결과 (중간/낮은 위험도)
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-teal-800">분석 결과</h2>
          <button
            onClick={onReset}
            className="px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors duration-200"
          >
            새로 검색하기
          </button>
        </div>
      </div>

      {/* 입력한 증상 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">입력하신 증상</h3>
            <p className="text-gray-600">증상 분석 기준</p>
          </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <p className="text-blue-800 leading-relaxed">"{recommendation.symptoms}"</p>
        </div>
      </div>

      {/* 위험도 평가 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
            recommendation.riskAssessment.level === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <span className="text-2xl">
              {recommendation.riskAssessment.level === 'medium' ? '⚠️' : '✅'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">위험도 평가</h3>
            <p className="text-gray-600">
              위험도: <span className={`font-semibold ${
                recommendation.riskAssessment.level === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {recommendation.riskAssessment.level === 'medium' ? '중간' : '낮음'}
              </span>
            </p>
          </div>
        </div>
        <div className={`border-l-4 p-4 rounded-lg ${
          recommendation.riskAssessment.level === 'medium' 
            ? 'bg-yellow-50 border-yellow-400' 
            : 'bg-green-50 border-green-400'
        }`}>
          <h4 className={`text-lg font-semibold mb-2 ${
            recommendation.riskAssessment.level === 'medium' ? 'text-yellow-800' : 'text-green-800'
          }`}>
            {recommendation.riskAssessment.title}
          </h4>
          <p className={`${
            recommendation.riskAssessment.level === 'medium' ? 'text-yellow-700' : 'text-green-700'
          }`}>
            {recommendation.riskAssessment.description}
          </p>
        </div>
      </div>

      {/* 예상 질병 */}
      {recommendation.disease && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">주요 예상 질병</h3>
              <p className="text-gray-600">증상 기반 분석 결과</p>
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-red-800 mb-2">
              {recommendation.disease}
            </h4>
            <p className="text-red-700">{recommendation.description}</p>
          </div>
        </div>
      )}

      {/* 기타 예상 질병 */}
      {recommendation.alternativeDiseases && recommendation.alternativeDiseases.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">기타 가능성 있는 질병</h3>
              <p className="text-gray-600">추가 고려사항</p>
            </div>
          </div>
          <div className="space-y-3">
            {recommendation.alternativeDiseases.map((disease, index) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-md font-semibold text-orange-800">
                    {disease.name}
                  </h4>
                  <span className="text-orange-600 font-bold text-sm bg-orange-100 px-2 py-1 rounded">
                    {disease.probability}
                  </span>
                </div>
                <p className="text-orange-700 text-sm">{disease.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 개인 맞춤 경고 */}
      {recommendation.personalizedWarnings && recommendation.personalizedWarnings.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">개인 맞춤 주의사항</h3>
              <p className="text-gray-600">프로필 기반 경고</p>
            </div>
          </div>
          <div className="space-y-2">
            {recommendation.personalizedWarnings.map((warning, index) => (
              <div key={index} className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                <p className="text-red-700 font-medium">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 추천 약물 */}
      {recommendation.medicines && recommendation.medicines.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">💊</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">추천 약물</h3>
              <p className="text-gray-600">일반의약품 추천</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendation.medicines.map((medicine, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {medicine.name}
                  </h4>
                  <span className="text-teal-600 font-bold text-sm bg-teal-50 px-2 py-1 rounded">
                    {medicine.price}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{medicine.effect}</p>
                
                {/* 금기사항 표시 */}
                {medicine.contraindications && medicine.contraindications.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                    <span className="text-red-600 font-medium">주의: </span>
                    <span className="text-red-600">{medicine.contraindications.join(', ')} 알레르기가 있는 경우 복용하지 마세요</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 주변 판매처 */}
      {recommendation.salesLocations && recommendation.salesLocations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">주변 판매처</h3>
              <p className="text-gray-600">약국 및 편의점 안내</p>
            </div>
          </div>

          {/* 판매처 목록 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {recommendation.salesLocations.map((location, index) => (
              <div 
                key={index} 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedLocation === index 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-300'
                }`}
                onClick={() => setSelectedLocation(selectedLocation === index ? null : index)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <h4 className="text-lg font-semibold text-gray-800 mr-2">
                      {location.name}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      location.type === 'pharmacy' 
                        ? 'bg-blue-100 text-blue-800' 
                        : location.type === 'convenience_store'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {location.type === 'pharmacy' ? '약국' : location.type === 'convenience_store' ? '편의점' : '온라인'}
                    </span>
                  </div>
                  {location.distance && (
                    <span className="text-teal-600 font-bold text-sm">
                      {location.distance}
                    </span>
                  )}
                </div>
                
                {location.address && (
                  <p className="text-gray-600 text-sm mb-2">{location.address}</p>
                )}
                
                {location.type === 'online_store' ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-500">🚚 {location.deliveryInfo}</p>
                    <p className="text-gray-500">🕒 {location.operatingHours}</p>
                    <div className="flex justify-between items-center">
                      {location.url && (
                        <a
                          href={location.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          🛒 바로가기
                        </a>
                      )}
                      <span className={`font-medium ${
                        location.isOpen ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {location.currentStatus}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      {location.phone && <p className="text-gray-500">📞 {location.phone}</p>}
                      <p className="text-gray-500">🕒 {location.operatingHours}</p>
                    </div>
                    <span className={`font-medium ${
                      location.isOpen ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {location.currentStatus}
                    </span>
                  </div>
                )}
                
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  추천 약물 재고 보유
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 구매 안내 */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-3">🛒 구매 안내</h3>
        <div className="space-y-2 text-sm">
          <p>• 추천된 약물은 모두 일반의약품으로 처방전 없이 구매 가능합니다.</p>
          <p>• 약사와 상담 후 구매하시기를 권장합니다.</p>
          <p>• 복용 전 용법·용량을 반드시 확인하세요.</p>
          <p>• 증상이 지속되거나 악화될 경우 전문의와 상담하세요.</p>
        </div>
      </div>

      {/* 면책 조항 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm p-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-yellow-400 mr-3 mt-1" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              ⚠️ 중요한 안내사항
            </h3>
            <p className="text-sm text-yellow-700">
              본 서비스는 의학적 진단이 아니며, 참고용으로만 사용해야 합니다. 
              정확한 진단과 치료는 반드시 의사 또는 약사와 상의하십시오.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResult;