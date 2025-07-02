import React, { useState, useEffect } from 'react';
import { UserProfile as UserProfileType } from '../types/medical';
import { X, User, AlertTriangle, Pill } from 'lucide-react';

interface UserProfileProps {
  profile: UserProfileType;
  onProfileUpdate: (profile: UserProfileType) => void;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile, onProfileUpdate, onClose }) => {
  const [formData, setFormData] = useState<UserProfileType>(profile);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(formData);
    onClose();
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(a => a !== allergy)
    });
  };

  const addCondition = () => {
    if (newCondition.trim() && !formData.conditions.includes(newCondition.trim())) {
      setFormData({
        ...formData,
        conditions: [...formData.conditions, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter(c => c !== condition)
    });
  };

  const addMedication = () => {
    if (newMedication.trim() && !formData.medications.includes(newMedication.trim())) {
      setFormData({
        ...formData,
        medications: [...formData.medications, newMedication.trim()]
      });
      setNewMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter(m => m !== medication)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center">
            <User className="h-6 w-6 text-teal-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">나의 건강 프로필</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  키 (cm)
                </label>
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    height: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="170"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  체중 (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    weight: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="70"
                />
              </div>
            </div>
          </div>

          {/* 알레르기 정보 */}
          <div>
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">알레르기 정보</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="예: 아스피린, 이부프로펜"
                />
                <button
                  type="button"
                  onClick={addAllergy}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(allergy)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 기저질환 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">기저질환</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="예: 고혈압, 당뇨병"
                />
                <button
                  type="button"
                  onClick={addCondition}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.conditions.map((condition, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeCondition(condition)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 현재 복용 약물 */}
          <div>
            <div className="flex items-center mb-4">
              <Pill className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">현재 복용 약물</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="예: 혈압약, 감기약"
                />
                <button
                  type="button"
                  onClick={addMedication}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.medications.map((medication, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {medication}
                    <button
                      type="button"
                      onClick={() => removeMedication(medication)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;