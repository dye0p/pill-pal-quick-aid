import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({ isOpen, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 mr-3" />
            <div>
              <h2 className="text-xl font-bold">중요한 안내사항</h2>
              <p className="text-red-100 text-sm mt-1">서비스 이용 전 필수 확인</p>
            </div>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ⚠️ 의료 서비스 이용 안내
            </h3>
            
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p className="font-medium text-yellow-800 mb-2">본 서비스의 한계</p>
                <ul className="space-y-1 text-yellow-700">
                  <li>• 본 앱이 제공하는 정보는 <strong>의학적 진단이나 처방을 대체할 수 없습니다</strong></li>
                  <li>• 모든 내용은 <strong>참고용으로만</strong> 활용해야 합니다</li>
                  <li>• AI 분석 결과는 완전하지 않을 수 있습니다</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                <p className="font-medium text-red-800 mb-2">반드시 지켜야 할 사항</p>
                <ul className="space-y-1 text-red-700">
                  <li>• 모든 의료적 판단은 <strong>반드시 전문 의사 또는 약사와 상의</strong>해야 합니다</li>
                  <li>• 심각한 증상이나 응급상황 시 <strong>즉시 병원 방문</strong>이 필요합니다</li>
                  <li>• 약물 복용 전 <strong>전문가와 상담</strong>하시기 바랍니다</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                <p className="font-medium text-blue-800 mb-2">서비스 목적</p>
                <p className="text-blue-700">
                  본 앱은 <strong>예비 정보 제공 및 의료 접근성 향상</strong>을 위한 보조 도구입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 동의 버튼 */}
          <button
            onClick={onAccept}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
          >
            <Check className="h-5 w-5" />
            <span>위 내용을 모두 확인했으며, 동의하고 시작하기</span>
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            동의 후 앱의 모든 기능을 이용하실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimerModal;