# Custom Events パターン

## はじめに
Web Components の開発において、内部状態の変更やユーザーアクションを外部に通知する方法として **カスタムイベント** を使用します。  
カスタムイベントは標準の DOM イベント（`click`, `input`, `change` など）とは異なり、開発者が任意のタイミングで発火でき、詳細な情報を外部へ伝達できます。

このドキュメントでは、以下の内容について解説します。

- カスタムイベントの基本概念
- Web Components での発火とリスニング
- イベントのバブリングとスコーピング
- 実装例とベストプラクティス


## 🔹 カスタムイベントの基本概念
カスタムイベントは、`CustomEvent` インターフェースを使用して作成されます。

### 基本構文
```typescript
const event = new CustomEvent('イベント名', {
  detail: {
    key: 'value',
    anotherKey: 42
  },
  bubbles: true,      // バブリングするか
  composed: true      // Shadow DOM を超えて伝搬するか
});

element.dispatchEvent(event);
```

| オプション | 説明 | デフォルト |
|---|---|---|
| `detail`| イベント発火時に渡したい情報 | `{}`|
| `bubbles` | イベントがバブリングするか | `false` |
| `composed`| Shadow DOM の外側に伝搬するか | `false` |


## 🔹 Web Components とカスタムイベント
Web Components 内部で発生した状態の変更や、ユーザーアクションに応じてカスタムイベントを発火することで、外部コンポーネントや親要素に変更を伝えることができます。

### 実装例
以下はカスタムボタン `<custom-button>` を作成し、クリック時にカスタムイベント `custom-click` を発火する例です。

```typescript
// patterns/custom-button.ts
class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        button {
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
        }
      </style>
      <button>Click me</button>
    `;
  }

  addEventListeners() {
    const button = this.shadowRoot?.querySelector('button');
    button?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('custom-click', {
        detail: {
          message: 'Button clicked!',
          timestamp: Date.now()
        },
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('custom-button', CustomButton);
```

## 🔹 使用例
以下のように `<custom-button>` を使うことで、クリック時にカスタムイベントが発火され、外部から受け取ることができます。

```html
<custom-button></custom-button>

<script>
  const button = document.querySelector('custom-button');
  button.addEventListener('custom-click', (event) => {
    console.log('イベントが発火されました:', event.detail.message);
    console.log('タイムスタンプ:', event.detail.timestamp);
  });
</script>
```

## 🔹 イベントのバブリングとスコーピング
カスタムイベントは `bubbles` と `composed` のフラグを使用して、スコープを制御できます。

| 設定 | 説明 |
|---|---|
| `bubbles` | イベントが親要素へバブリングするか（`false` の場合、現在の要素に留まる） |
| `composed` | Shadow DOM の外側に伝搬するか（`false` の場合、Shadow DOM 内に留まる） |

### 例: Shadow DOM を超えるイベント伝搬
```html
<parent-element>
  <custom-button></custom-button>
</parent-element>
```

```typescript
// 親要素でイベントを受け取る
document.querySelector('parent-element')?.addEventListener('custom-click', (event) => {
  console.log('Shadow DOM を超えてイベントを受信:', event.detail);
});
```

## 🔹 ベストプラクティス
1. **イベント名は一意にする**
   - グローバルなネームスペースを汚染しないよう、ユニークなイベント名にする。
   - 例: `user-profile-update` や `dropdown-item-selected`

2. **バブリングとスコーピングの意識**
   - 外部で処理する必要がない場合、`bubbles` や `composed` を無効にすることで、意図しないイベント発火を防ぐ。

3. **イベントオブジェクトは詳細に**
   - `detail` オブジェクトには、関連するデータを明確に定義する。
   - 例: `id`, `status`, `timestamp` など。

## 🔹 まとめ
- カスタムイベントは Web Components の内部状態を外部へ通知する強力な手段です。
- `bubbles` と `composed` の設定でスコープを細かく制御できます。
- `CustomEvent` によって、任意のデータを含めて外部に伝搬可能です。