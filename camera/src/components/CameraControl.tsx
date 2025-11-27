import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, List, Play, Square, ZoomIn, Save, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockSpecimens, type Specimen } from '../lib/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CameraControlProps {
  onNavigate: (screen: 'menu' | 'result', specimenId?: string) => void;
  initialSpecimenId?: string | null;
}

export function CameraControl({ onNavigate, initialSpecimenId }: CameraControlProps) {
  const [specimens] = useState<Specimen[]>(mockSpecimens);
  const [currentSpecimenId, setCurrentSpecimenId] = useState(
    initialSpecimenId || specimens[0].id
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [overlayEnabled, setOverlayEnabled] = useState(true);

  const currentSpecimen = specimens.find(s => s.id === currentSpecimenId) || specimens[0];
  const currentImage = currentSpecimen.images[currentImageIndex];
  const currentResult = currentSpecimen.results.find(r => r.imageId === currentImage.id);

  const totalImages = currentSpecimen.images.length;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  };

  const handleStartCapture = () => {
    setIsCapturing(true);
    // モック: 自動で画像を切り替えて撮影シミュレーション
    setCurrentImageIndex(0);
  };

  const handleStopCapture = () => {
    setIsCapturing(false);
  };

  const handleSpecimenChange = (specimenId: string) => {
    setCurrentSpecimenId(specimenId);
    setCurrentImageIndex(0);
  };

  useEffect(() => {
    if (isCapturing) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => {
          if (prev < totalImages - 1) {
            return prev + 1;
          } else {
            setIsCapturing(false);
            return prev;
          }
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isCapturing, totalImages]);

  const getJudgeColor = (judge: string) => {
    switch (judge) {
      case 'OK':
        return 'bg-green-600';
      case 'NG':
        return 'bg-red-600';
      case 'WARNING':
        return 'bg-yellow-600';
      default:
        return 'bg-slate-600';
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigate('menu')}
            variant="outline"
            className="bg-slate-800 border-slate-700"
          >
            <Home className="w-4 h-4 mr-2" />
            メインメニュー
          </Button>
          <h1>カメラコントロール</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {isCapturing ? (
            <Button onClick={handleStopCapture} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              停止
            </Button>
          ) : (
            <Button onClick={handleStartCapture} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              撮影開始
            </Button>
          )}
          
          <Select value="job_default">
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
              <SelectValue placeholder="ジョブ選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="job_default">標準検査</SelectItem>
              <SelectItem value="job_high_precision">高精度検査</SelectItem>
              <SelectItem value="job_quick">クイック検査</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => onNavigate('result')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <List className="w-4 h-4 mr-2" />
            結果リストへ
          </Button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-3 gap-6">
        {/* 左カラム: 画像表示 */}
        <div className="col-span-2">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-slate-400">撮影対象: </span>
                <span>{currentSpecimen.name}</span>
                <span className="ml-4 text-slate-400">
                  (Image {currentImageIndex + 1} / {totalImages})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOverlayEnabled(!overlayEnabled)}
                  className="bg-slate-700 border-slate-600"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {overlayEnabled ? 'オーバーレイON' : 'オーバーレイOFF'}
                </Button>
              </div>
            </div>

            {/* 画像表示エリア */}
            <div className="relative bg-slate-950 rounded-lg overflow-hidden aspect-[4/3] mb-4">
              <ImageWithFallback
                src={currentImage.url}
                alt={`${currentSpecimen.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* オーバーレイ表示 */}
              {overlayEnabled && currentResult && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* 検出位置のマーカー */}
                  <div
                    className="absolute w-16 h-16 border-2 border-cyan-400 rounded-full animate-pulse"
                    style={{
                      left: `${(currentResult.x / 300) * 100}%`,
                      top: `${(currentResult.y / 200) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* 座標表示 */}
                  <div className="absolute top-4 left-4 bg-black/70 px-3 py-2 rounded">
                    <p className="text-cyan-400">
                      X: {currentResult.x.toFixed(1)} / Y: {currentResult.y.toFixed(1)}
                    </p>
                  </div>
                  
                  {/* 判定結果 */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getJudgeColor(currentResult.judge)} text-white px-4 py-2`}>
                      {currentResult.judge}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* 画像ナビゲーション */}
            <div className="flex items-center justify-between">
              <Button
                onClick={handlePrevImage}
                variant="outline"
                className="bg-slate-700 border-slate-600"
                disabled={isCapturing}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                前の画像
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">ID:</span>
                <span className="font-mono">{currentImage.id}</span>
              </div>

              <Button
                onClick={handleNextImage}
                variant="outline"
                className="bg-slate-700 border-slate-600"
                disabled={isCapturing}
              >
                次の画像
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* 右カラム: 結果表示 */}
        <div className="space-y-6">
          {/* 検体切替 */}
          <Card className="p-4 bg-slate-800 border-slate-700">
            <label className="block text-slate-400 mb-2">検体切替</label>
            <Select value={currentSpecimenId} onValueChange={handleSpecimenChange}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {specimens.map((specimen) => (
                  <SelectItem key={specimen.id} value={specimen.id}>
                    {specimen.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* 検査結果 */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h3 className="mb-4 pb-2 border-b border-slate-700">検査結果</h3>
            
            {currentResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">判定:</span>
                  <Badge className={`${getJudgeColor(currentResult.judge)} text-white px-4 py-1`}>
                    {currentResult.judge}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-400">X座標</div>
                    <div className="font-mono">{currentResult.x.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Y座標</div>
                    <div className="font-mono">{currentResult.y.toFixed(1)}</div>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400">スコア</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-cyan-500 h-2 rounded-full transition-all"
                        style={{ width: `${currentResult.score}%` }}
                      ></div>
                    </div>
                    <span className="font-mono">{currentResult.score.toFixed(1)}%</span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400">QRコード</div>
                  <div className="font-mono bg-slate-900 p-2 rounded mt-1">
                    {currentResult.qrCode}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="text-slate-400">画像ID</div>
                  <div className="font-mono">{currentResult.imageId}</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">
                結果データがありません
              </div>
            )}
          </Card>

          {/* クイックアクション */}
          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-slate-700 border-slate-600">
                <ZoomIn className="w-4 h-4 mr-2" />
                画像を拡大
              </Button>
              <Button variant="outline" className="w-full bg-slate-700 border-slate-600">
                <Save className="w-4 h-4 mr-2" />
                結果を保存
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
