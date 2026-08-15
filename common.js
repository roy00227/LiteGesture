// ジェスチャー設定の共通定義（content.js / options.js の両方から読み込む）

// ジェスチャーを構成する方向（1本目・2本目それぞれこの中から選ぶ）。矢印記号は言語共通。
const DIRECTIONS = { U: "↑", D: "↓", L: "←", R: "→" };

// 割り当て可能なアクションのID一覧（表示順）
const ACTION_IDS = [
  "BACK",
  "FORWARD",
  "SCROLL_TOP",
  "SCROLL_BOTTOM",
  "CLOSE_TAB",
  "RELOAD_TAB",
  "DUPLICATE_TAB",
  "RESTORE_TAB",
  "NEXT_TAB",
  "PREV_TAB",
];

// ジェスチャーを開始するマウスボタン
const GESTURE_BUTTON_IDS = ["right", "left"];
const DEFAULT_GESTURE_BUTTON = "right";

// ホイールでのタブ移動を上下反転するかどうかの初期値
const DEFAULT_WHEEL_INVERTED = false;

// ジェスチャーと判定する最小移動距離(px)の初期値
const DEFAULT_MIN_DISTANCE = 30;
const MIN_DISTANCE_RANGE = { min: 10, max: 100 };

// 画面にジェスチャーの軌跡・矢印を表示するかどうかの初期値
const DEFAULT_SHOW_TRAIL = true;

// 設定画面の表示言語
const DEFAULT_UI_LANGUAGE = "en";

// 初期設定
const DEFAULT_GESTURE_MAP = {
  L: "BACK",
  R: "FORWARD",
  U: "SCROLL_TOP",
  D: "SCROLL_BOTTOM",
  DR: "CLOSE_TAB",
  UD: "RELOAD_TAB",
  DU: "DUPLICATE_TAB",
};

// 設定画面の表示テキスト（日本語 / 英語）
const TRANSLATIONS = {
  en: {
    pageTitle: "Mouse Gesture Settings",
    note: [
      "Choose the button that starts a gesture, and set the mouse movement (1st and 2nd direction) for each action.",
      "Leaving the 2nd direction as “Nothing” makes it a single-direction gesture.",
      "The same combination can't be assigned to two actions.",
      "The wheel (while holding the gesture button) is fixed to switching tabs.",
    ],
    tableHeaders: { action: "Action", dir1: "1st", dir2: "2nd" },
    actions: {
      BACK: "Back",
      FORWARD: "Forward",
      SCROLL_TOP: "Scroll to Top",
      SCROLL_BOTTOM: "Scroll to Bottom",
      CLOSE_TAB: "Close Tab",
      RELOAD_TAB: "Reload Page",
      DUPLICATE_TAB: "Duplicate Tab",
      RESTORE_TAB: "Restore Closed Tab",
      NEXT_TAB: "Next Tab",
      PREV_TAB: "Previous Tab",
    },
    gestureButtons: { right: "Right Click", left: "Left Click" },
    dirPlaceholder: "Nothing",
    dir1Title: "1st direction (Nothing = unset)",
    dir2Title: "2nd direction (Nothing = single-direction gesture)",
    wheelInvertLabel: "Invert wheel tab switching (scroll up = next tab)",
    minDistanceLabel: "Minimum movement to trigger a gesture (px)",
    showTrailLabel: "Show gesture trail and direction arrows on screen",
    saveButton: "Save",
    resetButton: "Reset to Default",
    statusSaved: "Saved",
    statusReset: "Reset to default",
    statusConflict: "The same gesture is assigned to more than one action",
  },
  ja: {
    pageTitle: "マウスジェスチャー設定",
    note: [
      "ジェスチャーを開始するボタンと、各アクションに割り当てるマウスの動き（1本目・2本目の方向）を決めてください。",
      "2本目は「なし」のままだと1方向だけのジェスチャーになります。",
      "同じ組み合わせを複数のアクションには割り当てられません。",
      "ホイール（ジェスチャーボタン押下中）はタブ移動に固定されています。",
    ],
    tableHeaders: { action: "アクション", dir1: "1本目", dir2: "2本目" },
    actions: {
      BACK: "戻る",
      FORWARD: "進む",
      SCROLL_TOP: "ページ最上部へ",
      SCROLL_BOTTOM: "ページ最下部へ",
      CLOSE_TAB: "タブを閉じる",
      RELOAD_TAB: "ページを更新",
      DUPLICATE_TAB: "タブを複製",
      RESTORE_TAB: "閉じたタブを復元",
      NEXT_TAB: "右のタブへ移動",
      PREV_TAB: "左のタブへ移動",
    },
    gestureButtons: { right: "右クリック", left: "左クリック" },
    dirPlaceholder: "なし",
    dir1Title: "1本目の方向（なし＝未設定）",
    dir2Title: "2本目の方向（なし＝1方向だけのジェスチャー）",
    wheelInvertLabel: "ホイールでのタブ移動を上下反転する（上回転＝右のタブへ）",
    minDistanceLabel: "ジェスチャーと判定する最小移動距離（px）",
    showTrailLabel: "画面にジェスチャーの軌跡と方向の矢印を表示する",
    saveButton: "保存",
    resetButton: "初期設定に戻す",
    statusSaved: "保存しました",
    statusReset: "初期設定に戻しました",
    statusConflict: "同じ組み合わせが複数のアクションに割り当てられています",
  },
};
