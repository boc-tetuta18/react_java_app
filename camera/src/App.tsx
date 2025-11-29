import { useState } from "react";
import { MainMenu } from "./components/MainMenu";
import { CameraControl } from "./components/CameraControl";
import { ResultList } from "./components/ResultList";

type Screen =
  | "menu"
  | "camera"
  | "result"
  | "job"
  | "service"
  | "settings";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("menu");
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<
    string | null
  >(null);

  const navigateTo = (screen: Screen, specimenId?: string) => {
    setCurrentScreen(screen);
    if (specimenId !== undefined) {
      setSelectedSpecimenId(specimenId);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {currentScreen === "menu" && (
        <MainMenu onNavigate={navigateTo} />
      )}
      {currentScreen === "camera" && (
        <CameraControl
          onNavigate={navigateTo}
          initialSpecimenId={selectedSpecimenId}
        />
      )}
      {currentScreen === "result" && (
        <ResultList onNavigate={navigateTo} />
      )}
      {currentScreen === "job" && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="mb-4">ジョブセレクト</h1>
            <button
              onClick={() => navigateTo("menu")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              メニューに戻る
            </button>
          </div>
        </div>
      )}
      {currentScreen === "service" && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="mb-4">サービスモード</h1>
            <button
              onClick={() => navigateTo("menu")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              メニューに戻る
            </button>
          </div>
        </div>
      )}
      {currentScreen === "settings" && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="mb-4">設定</h1>
            <button
              onClick={() => navigateTo("menu")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              メニューに戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}