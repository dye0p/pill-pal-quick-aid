
import React, { useEffect, useRef } from 'react';
import { SalesLocation } from '../types/medical';

// Kakao Map API 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

interface PharmacyMapProps {
  salesLocations: SalesLocation[];
  selectedLocation: number | null;
  onLocationSelect: (index: number) => void;
}

const PharmacyMap: React.FC<PharmacyMapProps> = ({ 
  salesLocations, 
  selectedLocation, 
  onLocationSelect 
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
    if (selectedLocation !== null && markers.current[selectedLocation]) {
      // 선택된 판매처로 지도 중심 이동
      const selectedMarker = markers.current[selectedLocation];
      if (mapInstance.current && selectedMarker) {
        mapInstance.current.setCenter(selectedMarker.getPosition());
      }
    }
  }, [selectedLocation]);

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
    markers.current = salesLocations.map((location, index) => {
      const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map
      });

      // 인포윈도우 생성
      const typeText = location.type === 'pharmacy' ? '약국' : '편의점';
      const statusColor = location.isOpen ? '#10b981' : '#ef4444';
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;width:180px;">
          <strong>${location.name}</strong> <span style="color:#6b7280;">(${typeText})</span><br/>
          ${location.distance}<br/>
          <span style="color:${statusColor};">${location.currentStatus}</span><br/>
          <span style="color:#0891b2;">${location.address}</span><br/>
          <span style="color:#6b7280;">${location.phone}</span>
        </div>`
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onLocationSelect(index);
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
          <h3 class="text-lg font-semibold text-gray-700 mb-2">삼성동 약국/편의점 위치</h3>
          <div class="space-y-2 text-sm">
            ${salesLocations.map((location, index) => `
              <div class="flex items-center justify-between p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-50 ${selectedLocation === index ? 'border-2 border-teal-500' : ''}" 
                   onclick="handleLocationClick(${index})">
                <div>
                  <strong>${location.name}</strong> <span class="text-gray-500">(${location.type === 'pharmacy' ? '약국' : '편의점'})</span><br/>
                  <span class="text-gray-600">${location.address}</span><br/>
                  <span class="${location.isOpen ? 'text-green-600' : 'text-red-600'}">${location.currentStatus}</span>
                </div>
                <span class="text-teal-600 font-bold">${location.distance}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // 전역 함수로 클릭 핸들러 등록
    (window as any).handleLocationClick = (index: number) => {
      onLocationSelect(index);
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
