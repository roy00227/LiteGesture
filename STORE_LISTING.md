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

LiteGesture lets you control your browser with simple mouse gestures instead of reaching for the keyboard or menus.

**Features**
- Hold down a mouse button (right-click or left-click, your choice) and move the mouse to trigger an action
- Fully customizable: assign any action to any 1- or 2-direction gesture
- Built-in actions: Back, Forward, Scroll to Top/Bottom, Close Tab, Reload Page, Duplicate Tab, Restore Closed Tab, Next/Previous Tab
- Hold the gesture button and spin the mouse wheel to switch tabs continuously (direction can be inverted)
- Settings are saved to your Google account via Chrome sync, so they follow you across devices
- English and Japanese interface, switchable anytime from the options page
- No data collection, no tracking, no ads — everything runs locally in your browser

**How to use**
1. Open the extension's options page
2. Choose your gesture button (right-click or left-click)
3. Assign a 1st and (optionally) 2nd direction to each action
4. Press and hold your gesture button on any page, move the mouse, and release

## Detailed description (日本語)

LiteGestureは、右クリック（または左クリック）を押しながらマウスを動かすだけで、ブラウザをキーボードやメニュー操作なしで直感的にコントロールできる拡張機能です。

**主な機能**
- ジェスチャーを開始するボタンは右クリック・左クリックから選択可能
- 各アクションに割り当てる方向（1本目・2本目）は自由にカスタマイズ可能
- 対応アクション：戻る・進む・ページ最上部/最下部へスクロール・タブを閉じる・ページ更新・タブを複製・閉じたタブを復元・次/前のタブへ移動
- ジェスチャーボタンを押したままホイールを回すと、タブを連続で切り替え可能（上下反転設定あり）
- 設定はGoogleアカウント経由でChrome同期されるので、他の端末でも同じ設定を利用可能
- 設定画面は日本語・英語をワンクリックで切り替え可能
- データ収集・トラッキング・広告は一切なし。すべてブラウザ内で完結

**使い方**
1. 拡張機能のオプションページを開く
2. ジェスチャーを開始するボタン（右クリック／左クリック）を選ぶ
3. 各アクションに1本目・2本目の方向を割り当てる
4. 好きなページでボタンを押しながらマウスを動かし、離すとジェスチャーが実行される

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
