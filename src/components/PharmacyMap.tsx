
import React, { useEffect, useRef } from 'react';
import { Pharmacy } from '../types/medical';

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  selectedPharmacy: number | null;
  onPharmacySelect: (index: number) => void;
}

const PharmacyMap: React.FC<PharmacyMapProps> = ({ 
  pharmacies, 
  selectedPharmacy, 
  onPharmacySelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    // 카카오 맵 스크립트 로드
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_API_KEY&autoload=false`;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      } else {
        // 카카오 맵 API가 없는 경우 대체 지도 표시
        initializeFallbackMap();
      }
    };

    script.onerror = () => {
      // API 로드 실패 시 대체 지도 표시
      initializeFallbackMap();
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedPharmacy !== null && markers.current[selectedPharmacy]) {
      // 선택된 약국으로 지도 중심 이동
      const selectedMarker = markers.current[selectedPharmacy];
      if (mapInstance.current && selectedMarker) {
        mapInstance.current.setCenter(selectedMarker.getPosition());
      }
    }
  }, [selectedPharmacy]);

  const initializeMap = () => {
    if (!mapRef.current || !window.kakao) return;

    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5089, 127.0594), // 삼성동 중심
      level: 3
    };

    const map = new window.kakao.maps.Map(container, options);
    mapInstance.current = map;

    // 마커 생성
    markers.current = pharmacies.map((pharmacy, index) => {
      const markerPosition = new window.kakao.maps.LatLng(pharmacy.lat, pharmacy.lng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map
      });

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;width:150px;">
          <strong>${pharmacy.name}</strong><br/>
          ${pharmacy.distance}<br/>
          <span style="color:#0891b2;">${pharmacy.address}</span>
        </div>`
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onPharmacySelect(index);
        infowindow.open(map, marker);
      });

      return marker;
    });
  };

  const initializeFallbackMap = () => {
    // API가 없는 경우 정적 지도 이미지 표시
    if (!mapRef.current) return;

    mapRef.current.innerHTML = `
      <div class="w-full h-full bg-gray-100 flex items-center justify-center relative">
        <div class="text-center">
          <div class="text-4xl mb-4">🗺️</div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">삼성동 약국 위치</h3>
          <div class="space-y-2 text-sm">
            ${pharmacies.map((pharmacy, index) => `
              <div class="flex items-center justify-between p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-50 ${selectedPharmacy === index ? 'border-2 border-teal-500' : ''}" 
                   onclick="handlePharmacyClick(${index})">
                <div>
                  <strong>${pharmacy.name}</strong><br/>
                  <span class="text-gray-600">${pharmacy.address}</span>
                </div>
                <span class="text-teal-600 font-bold">${pharmacy.distance}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // 전역 함수로 클릭 핸들러 등록
    (window as any).handlePharmacyClick = (index: number) => {
      onPharmacySelect(index);
    };
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-gray-100 rounded-lg"
      style={{ minHeight: '300px' }}
    />
  );
};

export default PharmacyMap;
