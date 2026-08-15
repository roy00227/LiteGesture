let isGesturing = false;
let startX = 0;
let startY = 0;
let gesture = "";
let lastDir = "";
let wheelUsed = false;
let wheelCooldown = false;
const WHEEL_COOLDOWN_MS = 150; // 連続発火するwheelイベントを1操作1回に間引く間隔

// 設定（chrome.storage.sync）から読み込む値。読み込み完了までは common.js のデフォルトを使う。
let gestureMap = DEFAULT_GESTURE_MAP;
let wheelInverted = DEFAULT_WHEEL_INVERTED;
let gestureButton = DEFAULT_GESTURE_BUTTON; // "right" | "left"
let minDistance = DEFAULT_MIN_DISTANCE; // ジェスチャーと判定する最小移動距離(px)
let showTrail = DEFAULT_SHOW_TRAIL;

chrome.storage.sync.get(
  {
    gestureMap: DEFAULT_GESTURE_MAP,
    wheelInverted: DEFAULT_WHEEL_INVERTED,
    gestureButton: DEFAULT_GESTURE_BUTTON,
    minDistance: DEFAULT_MIN_DISTANCE,
    showTrail: DEFAULT_SHOW_TRAIL,
  },
  (result) => {
    gestureMap = result.gestureMap;
    wheelInverted = result.wheelInverted;
    gestureButton = result.gestureButton;
    minDistance = result.minDistance;
    showTrail = result.showTrail;
  }
);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (changes.gestureMap) gestureMap = changes.gestureMap.newValue;
  if (changes.wheelInverted) wheelInverted = changes.wheelInverted.newValue;
  if (changes.gestureButton) gestureButton = changes.gestureButton.newValue;
  if (changes.minDistance) minDistance = changes.minDistance.newValue;
  if (changes.showTrail) showTrail = changes.showTrail.newValue;
});

function getGestureButtonCode() {
  return gestureButton === "left" ? 0 : 2; // 0 = 左クリック, 2 = 右クリック
}

// ジェスチャーの軌跡を表示するcanvasオーバーレイ
let trailCanvas = null;
let trailCtx = null;
let trailPoints = [];
let trailCorners = []; // 方向が認識された地点（矢印記号を表示する）

function ensureTrailCanvas() {
  if (trailCanvas) return;
  trailCanvas = document.createElement("canvas");
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
  Object.assign(trailCanvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "2147483647",
  });
  document.documentElement.appendChild(trailCanvas);
  trailCtx = trailCanvas.getContext("2d");
}

function removeTrailCanvas() {
  if (trailCanvas) {
    trailCanvas.remove();
    trailCanvas = null;
    trailCtx = null;
  }
  trailPoints = [];
  trailCorners = [];
}

function drawTrail() {
  if (!trailCtx || trailPoints.length === 0) return;

  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  trailCtx.lineWidth = 4;
  trailCtx.strokeStyle = "rgba(42, 99, 199, 0.85)";
  trailCtx.lineCap = "round";
  trailCtx.lineJoin = "round";
  trailCtx.beginPath();
  trailCtx.moveTo(trailPoints[0].x, trailPoints[0].y);
  for (let i = 1; i < trailPoints.length; i++) {
    trailCtx.lineTo(trailPoints[i].x, trailPoints[i].y);
  }
  trailCtx.stroke();

  trailCtx.fillStyle = "rgba(42, 99, 199, 0.85)";
  trailCtx.beginPath();
  trailCtx.arc(trailPoints[0].x, trailPoints[0].y, 6, 0, Math.PI * 2);
  trailCtx.fill();

  trailCtx.font = "bold 32px sans-serif";
  trailCtx.textAlign = "center";
  trailCtx.textBaseline = "middle";
  trailCtx.lineWidth = 4;
  trailCtx.strokeStyle = "rgba(0, 0, 0, 0.55)";
  trailCtx.fillStyle = "white";
  for (const corner of trailCorners) {
    trailCtx.strokeText(corner.symbol, corner.x, corner.y);
    trailCtx.fillText(corner.symbol, corner.x, corner.y);
  }
}

// アクションID → 実際の処理
const ACTION_HANDLERS = {
  BACK: () => history.back(),
  FORWARD: () => history.forward(),
  SCROLL_TOP: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  SCROLL_BOTTOM: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
  CLOSE_TAB: () => chrome.runtime.sendMessage({ action: "CLOSE_TAB" }),
  RELOAD_TAB: () => chrome.runtime.sendMessage({ action: "RELOAD_TAB" }),
  DUPLICATE_TAB: () => chrome.runtime.sendMessage({ action: "DUPLICATE_TAB" }),
  RESTORE_TAB: () => chrome.runtime.sendMessage({ action: "RESTORE_TAB" }),
  NEXT_TAB: () => chrome.runtime.sendMessage({ action: "NEXT_TAB" }),
  PREV_TAB: () => chrome.runtime.sendMessage({ action: "PREV_TAB" }),
};

// ジェスチャーボタン押し下げ：起点座標の記録
window.addEventListener('mousedown', (e) => {
  if (e.button === getGestureButtonCode()) {
    isGesturing = true;
    startX = e.clientX;
    startY = e.clientY;
    gesture = "";
    lastDir = "";
    wheelUsed = false;

    if (showTrail) {
      ensureTrailCanvas();
      trailPoints = [{ x: e.clientX, y: e.clientY }];
      trailCorners = [];
      drawTrail();
    }
  }
}, true);

// ジェスチャーボタン押下中のホイール回転：連続でタブを左右移動
window.addEventListener('wheel', (e) => {
  if (!isGesturing) return;

  e.preventDefault();
  wheelUsed = true;
  gesture = ""; // ホイール操作時は通常のジェスチャーを無効化
  removeTrailCanvas(); // タブ切り替えに切り替わったので軌跡表示は消す

  if (wheelCooldown) return; // トラックパッド等の多重発火を間引く
  wheelCooldown = true;
  setTimeout(() => { wheelCooldown = false; }, WHEEL_COOLDOWN_MS);

  let direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
  if (wheelInverted) direction = -direction;

  if (direction > 0) {
    chrome.runtime.sendMessage({ action: "NEXT_TAB" });
  } else if (direction < 0) {
    chrome.runtime.sendMessage({ action: "PREV_TAB" });
  }
}, { capture: true, passive: false });

// マウス移動：方向の判定（上下左右、複数ストロークを連結）
window.addEventListener('mousemove', (e) => {
  if (!isGesturing) return;
  if (wheelUsed) return; // ホイールでタブ移動した後は、離す直前の微小な動きを別ジェスチャーとして拾わない

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  if (showTrail) trailPoints.push({ x: e.clientX, y: e.clientY });

  if (Math.hypot(dx, dy) > minDistance) {
    let dir;
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? "R" : "L"; // Right / Left
    } else {
      dir = dy > 0 ? "D" : "U"; // Down / Up
    }

    if (dir !== lastDir) {
      gesture += dir;
      lastDir = dir;
      if (showTrail) trailCorners.push({ x: e.clientX, y: e.clientY, symbol: DIRECTIONS[dir] });
    }

    // 次のストロークを判定するため起点をリセット
    startX = e.clientX;
    startY = e.clientY;
  }

  if (showTrail) drawTrail();

  // 左クリックの場合、ドラッグによるテキスト選択の開始を防ぐ
  if (gestureButton === "left") {
    e.preventDefault();
  }
}, true);

// ジェスチャーボタンを離す：ジェスチャー実行
window.addEventListener('mouseup', (e) => {
  if (e.button === getGestureButtonCode() && isGesturing) {
    isGesturing = false;

    if (gesture !== "" && !wheelUsed) {
      executeGesture(gesture);
    }
    removeTrailCanvas();
  }
}, true);

// ウィンドウ外でボタンを離す等でmouseupが来なかった場合の保険
window.addEventListener('blur', () => {
  if (isGesturing) {
    isGesturing = false;
    removeTrailCanvas();
  }
});

// 右クリックがジェスチャーボタンの場合：ジェスチャー・ホイール操作後のコンテキストメニューを打ち消す
window.addEventListener('contextmenu', (e) => {
  if (gesture !== "" || wheelUsed) {
    e.preventDefault();
    e.stopPropagation();
    gesture = "";
    wheelUsed = false;
  }
}, true);

// 左クリックがジェスチャーボタンの場合：ジェスチャー・ホイール操作後のクリック（リンク遷移等）を打ち消す
window.addEventListener('click', (e) => {
  if (gestureButton === "left" && (gesture !== "" || wheelUsed)) {
    e.preventDefault();
    e.stopPropagation();
    gesture = "";
    wheelUsed = false;
  }
}, true);

// コマンドの割り当て（設定画面で変更した gestureMap に従う）
function executeGesture(cmd) {
  const action = gestureMap[cmd];
  const handler = ACTION_HANDLERS[action];
  if (handler) handler();
}
