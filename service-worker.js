chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  const windowId = sender.tab?.windowId;

  switch (message.action) {
    case "CLOSE_TAB":
      if (tabId) chrome.tabs.remove(tabId);
      break;

    case "RELOAD_TAB":
      if (tabId) chrome.tabs.reload(tabId);
      break;

    case "DUPLICATE_TAB":
      if (tabId) chrome.tabs.duplicate(tabId);
      break;

    case "RESTORE_TAB":
      // 最後に閉じたタブを復元
      chrome.sessions.restore();
      break;

    case "PREV_TAB":
      // 左のタブへ移動
      shiftTab(windowId, -1);
      break;

    case "NEXT_TAB":
      // 右のタブへ移動
      shiftTab(windowId, 1);
      break;
  }
});

// 直近でアクティブにしたタブIDをウィンドウごとに記憶する。
// chrome.tabs.query の active フラグは chrome.tabs.update 直後だと
// 反映が間に合わないことがあり、それが連続タブ移動の失敗の原因になっていたため、
// クエリの active フラグに頼らずここで自前管理する。
const lastActiveTabId = new Map(); // windowId -> tabId

chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  lastActiveTabId.set(windowId, tabId);
});

chrome.tabs.onRemoved.addListener((tabId, { windowId }) => {
  if (lastActiveTabId.get(windowId) === tabId) {
    lastActiveTabId.delete(windowId);
  }
});

// ウィンドウごとに直列実行するためのキュー
// （前の移動が完全に終わる前に次を処理すると計算がズレるため）
const shiftQueues = new Map();

function shiftTab(windowId, direction) {
  const prev = shiftQueues.get(windowId) || Promise.resolve();
  const next = prev.then(() => doShiftTab(windowId, direction)).catch(() => {});
  shiftQueues.set(windowId, next);
  return next;
}

// タブ移動の計算処理
async function doShiftTab(windowId, direction) {
  const tabs = await chrome.tabs.query({ windowId });
  if (tabs.length <= 1) return;

  // 配列の並び順がindexと一致するとは限らないため、明示的にindex順へ揃える
  tabs.sort((a, b) => a.index - b.index);

  // 自前管理しているタブIDを優先。見つからない場合のみクエリのactiveフラグを使う
  const cachedTabId = lastActiveTabId.get(windowId);
  let currentIndex = tabs.findIndex((t) => t.id === cachedTabId);
  if (currentIndex === -1) currentIndex = tabs.findIndex((t) => t.active);
  if (currentIndex === -1) return;

  // ループ移動（端に行ったら反対側へ）
  const targetTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];

  // 反映待ちせず即座に基準を更新しておく（次の呼び出しがこの値を参照する）
  lastActiveTabId.set(windowId, targetTab.id);
  await chrome.tabs.update(targetTab.id, { active: true });
}