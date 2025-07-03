import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SymptomAnalysisRequest {
  symptoms: string;
  userProfile?: {
    height?: number;
    weight?: number;
    allergies: string[];
    conditions: string[];
    medications: string[];
  };
}

interface MedicalRecommendation {
  symptoms: string;
  riskAssessment: {
    level: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: string;
    emergency?: {
      message: string;
      hospitals: Array<{
        name: string;
        distance: string;
        address: string;
        phone: string;
        lat: number;
        lng: number;
      }>;
    };
  };
  disease?: string;
  description?: string;
  alternativeDiseases?: Array<{
    name: string;
    probability: string;
    description: string;
  }>;
  medicines?: Array<{
    name: string;
    effect: string;
    price: string;
    contraindications?: string[];
    interactions?: string[];
  }>;
  salesLocations?: Array<{
    id: string;
    name: string;
    type: 'pharmacy' | 'convenience_store' | 'online_store';
    distance?: string;
    address?: string;
    lat?: number;
    lng?: number;
    phone?: string;
    operatingHours: string;
    isOpen: boolean;
    currentStatus: string;
    url?: string;
    deliveryInfo?: string;
  }>;
  personalizedWarnings?: string[];
}

const serve_handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, userProfile }: SymptomAnalysisRequest = await req.json();

    console.log('Analyzing symptoms:', symptoms);
    console.log('User profile:', userProfile);

    // Gemini AI API 호출을 위한 프롬프트 구성
    const prompt = `
당신은 의료 전문 AI입니다. 다음 증상을 분석하고 JSON 형식으로 응답해주세요.

증상: "${symptoms}"

${userProfile ? `
사용자 프로필:
- 키: ${userProfile.height || '미제공'}cm
- 몸무게: ${userProfile.weight || '미제공'}kg
- 알레르기: ${userProfile.allergies.length > 0 ? userProfile.allergies.join(', ') : '없음'}
- 기저질환: ${userProfile.conditions.length > 0 ? userProfile.conditions.join(', ') : '없음'}
- 복용 중인 약물: ${userProfile.medications.length > 0 ? userProfile.medications.join(', ') : '없음'}
` : ''}

다음 JSON 구조로 정확히 응답해주세요:

{
  "riskLevel": "high" | "medium" | "low",
  "riskTitle": "위험도 제목",
  "riskDescription": "위험도 설명",
  "riskAction": "권장 조치사항",
  "disease": "주요 예상 질병명",
  "diseaseDescription": "질병 설명",
  "alternativeDiseases": [
    {
      "name": "질병명",
      "probability": "확률 (예: 30%)",
      "description": "간단한 설명"
    }
  ],
  "medicines": [
    {
      "name": "약물명",
      "effect": "효과",
      "price": "가격대",
      "contraindications": ["금기사항1", "금기사항2"]
    }
  ],
  "personalizedWarnings": ["개인 맞춤 경고사항"],
  "needsEmergency": true | false
}

규칙:
1. 심각한 증상(심장마비, 뇌졸중, 심한 복통 등)은 riskLevel을 "high"로 설정
2. 일반의약품만 추천 (처방전 필요 없는 약물)
3. 사용자 프로필의 알레르기, 기저질환, 복용약물을 고려하여 personalizedWarnings 생성
4. needsEmergency가 true면 응급의료기관 정보가 필요함을 의미
5. 한국어로 응답
6. JSON 형식만 반환 (다른 텍스트 포함하지 말 것)
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiData = await response.json();
    console.log('Gemini response:', geminiData);

    const generatedText = geminiData.candidates[0]?.content?.parts[0]?.text;
    if (!generatedText) {
      throw new Error('No content generated from Gemini');
    }

    // JSON 파싱
    let analysisResult;
    try {
      // ```json으로 감싸진 경우 처리
      const jsonText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // 응급상황 시 병원 정보 추가
    let emergencyHospitals = [];
    if (analysisResult.needsEmergency) {
      emergencyHospitals = [
        {
          name: "삼성서울병원 응급의료센터",
          distance: "1.2km",
          address: "서울특별시 강남구 일원로 81",
          phone: "02-3410-2114",
          lat: 37.4881,
          lng: 127.0854
        },
        {
          name: "강남세브란스병원 응급실",
          distance: "2.1km", 
          address: "서울특별시 강남구 언주로 211",
          phone: "02-2019-3333",
          lat: 37.5197,
          lng: 127.0378
        },
        {
          name: "서울아산병원 응급의료센터",
          distance: "8.5km",
          address: "서울특별시 송파구 올림픽로43길 88",
          phone: "02-3010-3333",
          lat: 37.5259,
          lng: 127.1058
        }
      ];
    }

    // 판매처 정보 추가
    const salesLocations = [
      {
        id: "pharmacy1",
        name: "삼성동 온누리약국",
        type: "pharmacy" as const,
        distance: "350m",
        address: "서울특별시 강남구 봉은사로 524",
        lat: 37.5089,
        lng: 127.0594,
        phone: "02-552-7890",
        operatingHours: "평일 09:00-22:00, 토요일 09:00-18:00",
        isOpen: true,
        currentStatus: "운영 중"
      },
      {
        id: "pharmacy2", 
        name: "코엑스몰 약국",
        type: "pharmacy" as const,
        distance: "450m",
        address: "서울특별시 강남구 영동대로 513",
        lat: 37.5115,
        lng: 127.0590,
        phone: "02-6002-5678",
        operatingHours: "매일 10:00-22:00",
        isOpen: true,
        currentStatus: "운영 중"
      },
      {
        id: "convenience1",
        name: "CU 삼성동점",
        type: "convenience_store" as const,
        distance: "200m",
        address: "서울특별시 강남구 테헤란로 518",
        lat: 37.5075,
        lng: 127.0582,
        phone: "02-555-1234",
        operatingHours: "24시간",
        isOpen: true,
        currentStatus: "운영 중"
      },
      {
        id: "online1",
        name: "온라인약국 헬스케어",
        type: "online_store" as const,
        operatingHours: "24시간 주문 가능",
        isOpen: true,
        currentStatus: "주문 가능",
        url: "https://www.healthcare.co.kr",
        deliveryInfo: "당일배송 (오후 2시 이전 주문시)"
      }
    ];

    // 최종 응답 구성
    const recommendation: MedicalRecommendation = {
      symptoms,
      riskAssessment: {
        level: analysisResult.riskLevel,
        title: analysisResult.riskTitle,
        description: analysisResult.riskDescription,
        action: analysisResult.riskAction,
        ...(analysisResult.needsEmergency && {
          emergency: {
            message: "즉시 응급의료기관을 방문하세요.",
            hospitals: emergencyHospitals
          }
        })
      },
      disease: analysisResult.disease,
      description: analysisResult.diseaseDescription,
      alternativeDiseases: analysisResult.alternativeDiseases || [],
      medicines: analysisResult.medicines || [],
      salesLocations,
      personalizedWarnings: analysisResult.personalizedWarnings || []
    };

    console.log('Final recommendation:', recommendation);

    return new Response(JSON.stringify(recommendation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Gemini AI 분석 중 오류가 발생했습니다.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(serve_handler);