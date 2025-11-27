import { Camera, ClipboardList, List, Settings, Wrench } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MainMenuProps {
  onNavigate: (screen: 'camera' | 'job' | 'result' | 'service' | 'settings') => void;
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  const menuItems = [
    {
      id: 'camera',
      label: 'カメラコントロール',
      icon: Camera,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'job',
      label: 'ジョブセレクト',
      icon: ClipboardList,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 'result',
      label: '結果リスト',
      icon: List,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      id: 'service',
      label: 'サービスモード',
      icon: Wrench,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      id: 'settings',
      label: '設定',
      icon: Settings,
      color: 'bg-slate-600 hover:bg-slate-700',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="mb-12">
        <h1 className="text-center mb-2">産業用カメラ検査システム</h1>
        <p className="text-slate-400 text-center">Camera Inspection System v1.0</p>
      </div>

      <Card className="p-8 bg-slate-800 border-slate-700">
        <div className="grid grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`h-32 flex flex-col items-center justify-center gap-3 ${item.color} transition-all`}
              >
                <Icon className="w-12 h-12" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      <div className="mt-8 text-slate-500">
        <p>画面サイズ: 1920 × 1080</p>
      </div>
    </div>
  );
}
