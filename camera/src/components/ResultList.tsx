import { useState } from 'react';
import { Home, ChevronRight, Calendar, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { mockSpecimens, type Specimen } from '../lib/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ResultListProps {
  onNavigate: (screen: 'menu' | 'camera', specimenId?: string) => void;
}

export function ResultList({ onNavigate }: ResultListProps) {
  const [specimens] = useState<Specimen[]>(mockSpecimens);

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

  const getSpecimenSummary = (specimen: Specimen) => {
    const okCount = specimen.results.filter(r => r.judge === 'OK').length;
    const ngCount = specimen.results.filter(r => r.judge === 'NG').length;
    const warningCount = specimen.results.filter(r => r.judge === 'WARNING').length;
    
    return { okCount, ngCount, warningCount, total: specimen.results.length };
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigate('menu')}
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300 border-gray-300"
          >
            <Home className="w-4 h-4 mr-2" />
            メインメニュー
          </Button>
          <h1>検査結果一覧</h1>
        </div>
        
        <div className="flex items-center gap-4 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('ja-JP')}</span>
        </div>
      </div>

      {/* サマリー統計 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white border-gray-300 shadow">
          <div className="text-gray-500 mb-1">総検体数</div>
          <div className="flex items-end gap-2">
            <span className="text-black">{specimens.length}</span>
            <span className="text-gray-500">件</span>
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border-green-300 shadow">
          <div className="text-green-700 mb-1">OK</div>
          <div className="flex items-end gap-2">
            <span className="text-green-700">
              {specimens.reduce((sum, s) => sum + getSpecimenSummary(s).okCount, 0)}
            </span>
            <span className="text-gray-500">枚</span>
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50 border-yellow-300 shadow">
          <div className="text-yellow-700 mb-1">WARNING</div>
          <div className="flex items-end gap-2">
            <span className="text-yellow-700">
              {specimens.reduce((sum, s) => sum + getSpecimenSummary(s).warningCount, 0)}
            </span>
            <span className="text-gray-500">枚</span>
          </div>
        </Card>
        <Card className="p-4 bg-red-50 border-red-300 shadow">
          <div className="text-red-700 mb-1">NG</div>
          <div className="flex items-end gap-2">
            <span className="text-red-700">
              {specimens.reduce((sum, s) => sum + getSpecimenSummary(s).ngCount, 0)}
            </span>
            <span className="text-gray-500">枚</span>
          </div>
        </Card>
      </div>

      {/* 検体リスト */}
      <div className="space-y-4">
        {specimens.map((specimen) => {
          const summary = getSpecimenSummary(specimen);
          
          return (
            <Card key={specimen.id} className="p-6 bg-white border-gray-300 shadow">
              <div className="flex items-start gap-6">
                {/* サムネイル画像 */}
                <div className="flex-shrink-0">
                  <div className="grid grid-cols-5 gap-2">
                    {specimen.images.slice(0, 5).map((image) => {
                      const result = specimen.results.find(r => r.imageId === image.id);
                      return (
                        <div key={image.id} className="relative group">
                          <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden border border-gray-200">
                            <ImageWithFallback
                              src={image.url}
                              alt={`${specimen.name} - ${image.index}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {result && (
                            <Badge
                              className={`absolute -top-1 -right-1 ${getJudgeColor(result.judge)} text-white px-1 py-0 text-xs`}
                            >
                              {result.judge}
                            </Badge>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                            #{image.index}
                          </div>
                        </div>
                      );
                    })}
                    {specimen.images.length > 5 && (
                      <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                        <div className="text-center text-gray-500">
                          <Image className="w-6 h-6 mx-auto mb-1" />
                          <div className="text-xs">+{specimen.images.length - 5}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 検体情報 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="mb-1 text-black">{specimen.name}</h3>
                      <div className="text-gray-500 flex items-center gap-4">
                        <span>撮影日時: {specimen.timestamp.toLocaleString('ja-JP')}</span>
                        <span>画像数: {specimen.images.length}枚</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => onNavigate('camera', specimen.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-black border border-gray-300"
                    >
                      詳細を見る
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* 結果サマリー */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-100 p-3 rounded border border-gray-200">
                      <div className="text-gray-500 text-xs mb-1">総数</div>
                      <div className="text-black">{summary.total}枚</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <div className="text-green-700 text-xs mb-1">OK</div>
                      <div className="text-green-700">{summary.okCount}枚</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <div className="text-yellow-700 text-xs mb-1">WARNING</div>
                      <div className="text-yellow-700">{summary.warningCount}枚</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <div className="text-red-700 text-xs mb-1">NG</div>
                      <div className="text-red-700">{summary.ngCount}枚</div>
                    </div>
                  </div>

                  {/* 合格率バー */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">合格率</span>
                      <span className="text-black">{((summary.okCount / summary.total) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="h-full flex">
                        <div
                          className="bg-green-600"
                          style={{ width: `${(summary.okCount / summary.total) * 100}%` }}
                        ></div>
                        <div
                          className="bg-yellow-600"
                          style={{ width: `${(summary.warningCount / summary.total) * 100}%` }}
                        ></div>
                        <div
                          className="bg-red-600"
                          style={{ width: `${(summary.ngCount / summary.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
