# Chrome Web Store Listing Draft

## Store name
LiteGesture

## Short description (English, max 132 characters)
Customizable mouse gestures for tabs & navigation: close, reload, duplicate, switch tabs, go back/forward, and more.

(132-char check: count before submitting — trim if the dashboard flags it as too long.)

## Short description (日本語)
右クリック＋マウスの動きで、戻る・進む・タブを閉じる・複製・切替などを実行。すべて自分好みに割り当て変更できます。

---

## Detailed description (English)

LiteGesture lets you fly through the browser with your mouse — no keyboard or menus needed.

Hold your gesture button (right-click or left-click) and flick the mouse to go back, close a tab, switch tabs, and more.

- Fully customizable: any action, any 1- or 2-direction gesture
- Spin the wheel while holding your gesture button to cycle through tabs
- 100% local — no data collection, no tracking, no ads

**Built-in actions**
Back, Forward, Scroll to Top/Bottom, Close Tab, Reload, Duplicate Tab, Restore Closed Tab, Next/Previous Tab

## Detailed description (日本語)

LiteGestureは、キーボードやメニューを使わず、マウスジェスチャーだけでブラウザを操作できる拡張機能です。

ジェスチャーボタン（右クリック／左クリック）を押しながらマウスを動かすだけで、戻る・タブを閉じる・タブ切替などを実行できます。

- すべてのジェスチャーを自由にカスタマイズ可能
- ボタンを押したままホイールを回してタブを連続切替
- 完全ローカル動作——データ収集・トラッキング・広告なし

**対応アクション**
戻る、進む、ページ最上部/最下部へスクロール、タブを閉じる、ページ更新、タブを複製、閉じたタブを復元、次/前のタブへ移動

---

## Single purpose description (for the review form, English)
LiteGesture allows users to perform common browser navigation actions (back, forward, scroll, close/reload/duplicate a tab, switch tabs, restore a closed tab) by making mouse gestures and using the mouse wheel while holding a chosen mouse button.

## Permission justifications (for the review form, English)

- **tabs**: Needed to close, reload, duplicate, and switch between the user's own tabs in response to a recognized gesture.
- **sessions**: Needed to restore the user's most recently closed tab via the "restore tab" gesture.
- **storage**: Needed to save the user's gesture-to-action mapping and preferences (via chrome.storage.sync) so they persist across sessions and devices.
- **Host permission `<all_urls>` (content script)**: Needed so the extension can detect mouse gestures on any site the user visits. The content script only reads mouse/wheel event coordinates; it never reads or transmits page content.

## Privacy policy URL
_(Fill in once PRIVACY.md is published — e.g. hosted via GitHub Pages or linked directly to the GitHub blob view of PRIVACY.md.)_
