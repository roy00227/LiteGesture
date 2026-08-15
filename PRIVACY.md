# Privacy Policy / プライバシーポリシー

_Last updated: 2026-08-15_

## English

**LiteGesture** does not collect, store, or transmit any personal data, browsing history, or page content to the developer or any third party.

All settings you configure (which action is assigned to which mouse gesture, your chosen gesture button, wheel direction, and display language) are stored only in your browser via the `chrome.storage.sync` API. This data stays within your own Google account's Chrome sync and is never sent to any server operated by the developer.

### Permissions used

| Permission | Why it's needed |
|---|---|
| `tabs` | To close, reload, duplicate, and switch between your own open tabs when you perform the corresponding gesture. |
| `sessions` | To restore your most recently closed tab when you use the "restore tab" gesture. |
| `storage` | To save your gesture settings locally (and sync them via your Google account) so they persist between browser sessions and devices. |
| Content script on all sites (`<all_urls>`) | To detect your mouse movements and wheel input on any page you visit, so gestures work everywhere. The script only listens for mouse/wheel events — it does not read, collect, or transmit the content of any page. |

No analytics, tracking, or advertising code is included in this extension.

If you have questions about this policy, please contact the developer through the extension's support page on the Chrome Web Store.

---

## 日本語

**LiteGesture** は、個人情報・閲覧履歴・ページの内容などを一切収集・保存・送信しません。

設定画面で変更する内容（各ジェスチャーに割り当てるアクション、ジェスチャー開始ボタン、ホイールの方向、表示言語）は、`chrome.storage.sync` を使ってブラウザ内にのみ保存されます。このデータはご自身のGoogleアカウントのChrome同期の範囲内にとどまり、開発者が運営するサーバーなどに送信されることはありません。

### 使用している権限

| 権限 | 理由 |
|---|---|
| `tabs` | ジェスチャーに応じて、ご自身が開いているタブを閉じる・更新・複製・切り替えるため。 |
| `sessions` | 「閉じたタブを復元」ジェスチャーで、直前に閉じたタブを復元するため。 |
| `storage` | ジェスチャー設定をブラウザ内に保存し（Googleアカウント経由で同期し）、次回起動時にも設定を保持するため。 |
| 全サイトへのコンテンツスクリプト（`<all_urls>`） | どのウェブサイトを閲覧していてもマウスジェスチャーが使えるようにするため。マウス・ホイールの操作イベントのみを検知しており、ページの内容を読み取ったり収集・送信したりすることはありません。 |

アクセス解析・トラッキング・広告関連のコードは一切含まれていません。

本ポリシーについてご質問がある場合は、Chromeウェブストアの拡張機能ページにあるサポート欄よりご連絡ください。
