export interface ImageData {
  id: string;
  index: number;
  url: string;
}

export interface InspectionResult {
  imageId: string;
  x: number;
  y: number;
  score: number;
  judge: 'OK' | 'NG' | 'WARNING';
  qrCode: string;
}

export interface Specimen {
  id: string;
  name: string;
  images: ImageData[];
  results: InspectionResult[];
  timestamp: Date;
}

// モックデータの生成
const generateMockImages = (specimenId: string, count: number): ImageData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${specimenId}_img_${String(i + 1).padStart(2, '0')}`,
    index: i + 1,
    url: `https://images.unsplash.com/photo-1581093458791-9d42e6c6e6f3?w=800&h=600&fit=crop&q=80&sig=${specimenId}-${i}`,
  }));
};

const generateMockResult = (imageId: string, index: number): InspectionResult => {
  const judges: ('OK' | 'NG' | 'WARNING')[] = ['OK', 'OK', 'OK', 'OK', 'WARNING', 'NG'];
  const randomJudge = judges[Math.floor(Math.random() * judges.length)];
  
  return {
    imageId,
    x: 100 + Math.random() * 200,
    y: 50 + Math.random() * 150,
    score: 85 + Math.random() * 15,
    judge: randomJudge,
    qrCode: `QR${String(index).padStart(3, '0')}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  };
};

export const mockSpecimens: Specimen[] = [
  {
    id: 'specimen_001',
    name: '検体001',
    images: generateMockImages('specimen_001', 10),
    results: [],
    timestamp: new Date(2025, 10, 14, 9, 30),
  },
  {
    id: 'specimen_002',
    name: '検体002',
    images: generateMockImages('specimen_002', 10),
    results: [],
    timestamp: new Date(2025, 10, 14, 10, 15),
  },
  {
    id: 'specimen_003',
    name: '検体003',
    images: generateMockImages('specimen_003', 8),
    results: [],
    timestamp: new Date(2025, 10, 14, 11, 20),
  },
  {
    id: 'specimen_004',
    name: '検体004',
    images: generateMockImages('specimen_004', 12),
    results: [],
    timestamp: new Date(2025, 10, 14, 13, 45),
  },
  {
    id: 'specimen_005',
    name: '検体005',
    images: generateMockImages('specimen_005', 10),
    results: [],
    timestamp: new Date(2025, 10, 14, 14, 30),
  },
];

// 結果を生成
mockSpecimens.forEach(specimen => {
  specimen.results = specimen.images.map((img, idx) => 
    generateMockResult(img.id, idx)
  );
});
