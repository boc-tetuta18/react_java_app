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
          <h1>検査結果一覧</h1>
        </div>
        
        <div className="flex items-center gap-4 text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('ja-JP')}</span>
        </div>
      </div>

      {/* サマリー統計 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-slate-400 mb-1">総検体数</div>
          <div className="flex items-end gap-2">
            <span>{specimens.length}</span>
            <span className="text-slate-400">件</span>
          </div>
        </Card>
        <Card className="p-4 bg-green-900/30 border-green-700">
          <div className="text-green-400 mb-1">OK</div>
          <div className="flex items-end gap-2">
            <span className="text-green-400">
              {specimens.reduce((sum, s) => sum + getSpecimenSummary(s).okCount, 0)}
            </span>
            <span className="text-slate-400">枚</span>
          </div>
        </Card>
        <Card className="p-4 bg-yellow-900/30 border-yellow-700">
          <div className="text-yellow-400 mb-1">WARNING</div>
          <div className="flex items-end gap-2">
            <span className="text-yellow-400">
              {specimens.reduce((sum, s) => sum + getSpecimenSummary(s).warningCount, 0)}
            </span>
            <span className="text-slate-400">枚</span>
          </div>
        </Card>
        <Card className="p-4 bg-red-900/30 border-red-700">
          <div className="text-red-400 mb-1">NG</div>
          <div className="flex items-end gap-2">
            <span className="text-red-400">
              {specimens.reduce((sum, s) => sum + getSpecimenSummary(s).ngCount, 0)}
            </span>
            <span className="text-slate-400">枚</span>
          </div>
        </Card>
      </div>

      {/* 検体リスト */}
      <div className="space-y-4">
        {specimens.map((specimen) => {
          const summary = getSpecimenSummary(specimen);
          
          return (
            <Card key={specimen.id} className="p-6 bg-slate-800 border-slate-700">
              <div className="flex items-start gap-6">
                {/* サムネイル画像 */}
                <div className="flex-shrink-0">
                  <div className="grid grid-cols-5 gap-2">
                    {specimen.images.slice(0, 5).map((image) => {
                      const result = specimen.results.find(r => r.imageId === image.id);
                      return (
                        <div key={image.id} className="relative group">
                          <div className="w-24 h-24 bg-slate-900 rounded overflow-hidden">
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
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            #{image.index}
                          </div>
                        </div>
                      );
                    })}
                    {specimen.images.length > 5 && (
                      <div className="w-24 h-24 bg-slate-900 rounded flex items-center justify-center">
                        <div className="text-center text-slate-400">
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
                      <h3 className="mb-1">{specimen.name}</h3>
                      <div className="text-slate-400 flex items-center gap-4">
                        <span>撮影日時: {specimen.timestamp.toLocaleString('ja-JP')}</span>
                        <span>画像数: {specimen.images.length}枚</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => onNavigate('camera', specimen.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      詳細を見る
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* 結果サマリー */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-900 p-3 rounded">
                      <div className="text-slate-400 text-xs mb-1">総数</div>
                      <div>{summary.total}枚</div>
                    </div>
                    <div className="bg-green-900/30 p-3 rounded">
                      <div className="text-green-400 text-xs mb-1">OK</div>
                      <div className="text-green-400">{summary.okCount}枚</div>
                    </div>
                    <div className="bg-yellow-900/30 p-3 rounded">
                      <div className="text-yellow-400 text-xs mb-1">WARNING</div>
                      <div className="text-yellow-400">{summary.warningCount}枚</div>
                    </div>
                    <div className="bg-red-900/30 p-3 rounded">
                      <div className="text-red-400 text-xs mb-1">NG</div>
                      <div className="text-red-400">{summary.ngCount}枚</div>
                    </div>
                  </div>

                  {/* 合格率バー */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">合格率</span>
                      <span>{((summary.okCount / summary.total) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
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
