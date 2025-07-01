
import React, { useState } from 'react';
import PharmacyMap from './PharmacyMap';
import { MedicalRecommendation } from '../types/medical';

interface RecommendationResultProps {
  recommendation: MedicalRecommendation;
  onReset: () => void;
}

const RecommendationResult: React.FC<RecommendationResultProps> = ({ 
  recommendation, 
  onReset 
}) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<number | null>(null);

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

      {/* 예상 질병 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">🏥</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">예상 질병</h3>
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

      {/* 추천 약물 */}
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
              <p className="text-gray-600 text-sm">{medicine.effect}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 주변 약국 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">📍</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">주변 약국</h3>
            <p className="text-gray-600">재고 보유 약국 안내</p>
          </div>
        </div>

        {/* 약국 목록 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {recommendation.pharmacies.map((pharmacy, index) => (
            <div 
              key={index} 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedPharmacy === index 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-gray-200 hover:border-teal-300'
              }`}
              onClick={() => setSelectedPharmacy(selectedPharmacy === index ? null : index)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  {pharmacy.name}
                </h4>
                <span className="text-teal-600 font-bold text-sm">
                  {pharmacy.distance}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{pharmacy.address}</p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                추천 약물 재고 보유
              </div>
            </div>
          ))}
        </div>

        {/* 지도 */}
        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <PharmacyMap 
            pharmacies={recommendation.pharmacies}
            selectedPharmacy={selectedPharmacy}
            onPharmacySelect={setSelectedPharmacy}
          />
        </div>
      </div>

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
    </div>
  );
};

export default RecommendationResult;
