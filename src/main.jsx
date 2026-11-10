import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Camera,
  Check,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import "./styles.css";

const missions = [
  ["한 발로 폴짝폴짝 뛰기", "🦩"],
  ["두 발로 모아서 콩콩 뛰기", "👟"],
  ["친구랑 손잡고 같이 뛰기", "👫"],
  ["개구리처럼 폴짝 뛰기", "🐸"],
  ["토끼처럼 귀 쫑긋하며 뛰기", "🐰"],
  ["양 손을 번쩍 들고 뛰기", "🙌"],
  ["캥거루처럼 길게 뛰기", "🦘"],
  ["제자리에서 높이 뛰기", "🚀"],
  ["옆으로 폴짝폴짝 뛰기", "🦀"],
  ["빙글빙글 돌면서 뛰기", "🌀"],
  ["소리 안 나게 살금살금 뛰기", "🤫"],
  ["발을 넓게 벌렸다 오므리며 뛰기", "🤸"],
  ["뒤로 한 걸음씩 뛰기", "🔙"],
  ["펭귄처럼 뒤뚱뒤뚱 뛰기", "🐧"],
  ["고릴라처럼 가슴 치며 뛰기", "🦍"],
  ["하늘까지 닿을 듯이 점프!", "☁️"],
  ["한 발 들고 멈췄다가 뛰기", "🧘"],
  ["엉덩이를 실룩거리며 뛰기", "🍑"],
  ["발끝으로만 톡톡 뛰기", "🩰"],
  ["뒤꿈치로 툭툭 뛰기", "🦶"],
  ["아기 코끼리처럼 쿵쿵 뛰기", "🐘"],
  ["나비처럼 가볍게 뛰기", "🦋"],
  ["한 발씩 번갈아가며 뛰기", "🏃"],
  ["손뼉 치며 폴짝 뛰기", "👏"],
  ["발차기하듯이 앞으로 뛰기", "🥋"],
  ["무릎을 가슴까지 올리며 뛰기", "⬆️"],
  ["허리에 손을 얹고 뛰기", "💃"],
  ["수영하는 것처럼 팔 저으며 뛰기", "🏊"],
  ["비행기처럼 팔 벌리고 뛰기", "✈️"],
  ["제일 멋진 포즈로 점프!", "⭐"],
].map(([text, emoji], index) => ({ id: index + 1, text, emoji }));

function CameraView() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  const startCamera = useCallback(async () => {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setError("");
    } catch (cameraError) {
      console.error("Camera access error:", cameraError);
      setError("카메라를 켤 수 없어요. 권한을 확인해주세요!");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, [startCamera]);

  return (
    <div className="camera">
      {error ? (
        <div className="camera-error">
          <Camera size={64} />
          <p>{error}</p>
          <button className="retry-button" onClick={startCamera}>
            다시 시도하기
          </button>
        </div>
      ) : (
        <video ref={videoRef} autoPlay playsInline muted />
      )}
      <button
        className="camera-refresh"
        onClick={startCamera}
        aria-label="카메라 다시 켜기"
      >
        <RefreshCw />
      </button>
    </div>
  );
}

function MissionHeader({ mission, progress }) {
  return (
    <header className="header">
      <div className="mission-row">
        <div className="desktop-progress">{progress} / {missions.length}</div>
        <div className="mission-title">
          <div className="mission-emoji">{mission.emoji}</div>
          <div className="title-copy">
            <h2>{mission.text}</h2>
            <p>즐겁게 뛰어보아요!</p>
          </div>
        </div>
        <div className="mobile-progress">{progress}/{missions.length}</div>
        <div className="header-spacer" />
      </div>
      <div className="credit">made by gemidain</div>
    </header>
  );
}

function Completion({ onRestart }) {
  return (
    <div className="completion">
      <div className="trophy-wrap">
        <div className="trophy-glow" />
        <Trophy className="trophy" />
      </div>
      <div className="completion-copy">
        <h1>미션 성공!</h1>
        <p>
          와우! 30가지 미션을 모두 마쳤어요!
          <br />
          우리 친구 정말 대단해요! 🏆
        </p>
      </div>
      <button className="restart-button" onClick={onRestart}>
        <RotateCcw />
        다시 하기
      </button>
      <Star className="spark star-one" />
      <Star className="spark star-two" />
      <Star className="spark star-three" />
      <Star className="spark star-four" />
      <Sparkles className="corner-spark top-spark" />
      <Sparkles className="corner-spark bottom-spark" />
    </div>
  );
}

function App() {
  const [index, setIndex] = useState(0);
  const [praise, setPraise] = useState(null);
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);

  const finishMission = () => {
    if (busy) return;
    setBusy(true);
    setPraise({ emoji: "✨", message: "미션성공!" });
    window.setTimeout(() => {
      setPraise(null);
      setBusy(false);
      if (index < missions.length - 1) setIndex((current) => current + 1);
      else setComplete(true);
    }, 3000);
  };

  const restart = () => {
    setIndex(0);
    setPraise(null);
    setBusy(false);
    setComplete(false);
  };

  if (complete) return <Completion onRestart={restart} />;

  return (
    <main className="app">
      <MissionHeader mission={missions[index]} progress={index + 1} />
      <section className="camera-section">
        <CameraView />
        <div className="success-wrap">
          <button
            className={`success-button${busy ? " is-busy" : ""}`}
            onClick={finishMission}
            disabled={busy}
            aria-label="미션 성공"
          >
            <Check />
          </button>
          <span>성공!</span>
        </div>
      </section>

      {praise && (
        <div className="praise-overlay">
          <div className="praise-card">
            <div className="praise-emoji">{praise.emoji}</div>
            <h3>{praise.message}</h3>
          </div>
        </div>
      )}

      <div className="brand-pill">
        <span><Check /></span>
        <h1>폴짝 미션</h1>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
