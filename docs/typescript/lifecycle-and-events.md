# ライフサイクルメソッドと型安全なイベント処理

Web Components のカスタム要素は、DOM のライフサイクルに応じて特定のメソッドが呼ばれる **ライフサイクルメソッド** を持っています。  
また、これに加えて **カスタムイベント** を発火・監視することで、他の要素との通信も可能です。  
特に TypeScript を使用することで、ライフサイクルイベントも型安全に管理できます。

## 🔹 ライフサイクルメソッドとイベント処理
以下は、Custom Element のライフサイクルに対応するメソッドです。  
それぞれのタイミングで、型安全なイベントを発火させることが可能です。

| メソッド | 説明  | イベント発火例 |
|---|---|---|
| `connectedCallback()`   | 要素が DOM ツリーに追加されたときに呼ばれる  | `"component-mounted"` |
| `disconnectedCallback()`| 要素が DOM ツリーから削除されたときに呼ばれる   | `"component-unmounted"` |
| `adoptedCallback()` | 要素が他のドキュメントに移動されたときに呼ばれる   | `"component-moved"` |
| `attributeChangedCallback()` | 要素の監視対象の属性が変更されたときに呼ばれる  | `"attribute-changed"` |

## 📌 例: 型安全なイベントをライフサイクルで発火

```typescript
interface ComponentEventDetail {
  message: string;
  timestamp: number;
}

class LifecycleComponent extends HTMLElement {
  static get observedAttributes() {
    return ['data-status'];
  }

  connectedCallback() {
    console.log("要素が追加されました");
    this.emitEvent('component-mounted', 'Component Mounted');
  }

  disconnectedCallback() {
    console.log("要素が削除されました");
    this.emitEvent('component-unmounted', 'Component Unmounted');
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(`属性 ${name} が ${oldValue} から ${newValue} に変更されました`);
    this.emitEvent('attribute-changed', `Attribute ${name} changed`);
  }

  // 共通化されたイベント発火処理
  private emitEvent(eventName: string, message: string) {
    this.dispatchEvent(
      new CustomEvent<ComponentEventDetail>(eventName, {
        detail: {
          message,
          timestamp: Date.now(),
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('lifecycle-component', LifecycleComponent);
```

### 📌 イベントリスナーの設定
発火されたカスタムイベントは型安全に受け取ることが可能です。

```typescript
document.addEventListener('component-mounted', (event) => {
  const customEvent = event as CustomEvent<ComponentEventDetail>;
  console.log(customEvent.detail.message);   // "Component Mounted"
  console.log(customEvent.detail.timestamp); // タイムスタンプが表示される
});

document.addEventListener('attribute-changed', (event) => {
  const customEvent = event as CustomEvent<ComponentEventDetail>;
  console.log(customEvent.detail.message);
});
```

## 🔹 ライフサイクルの流れとイベント

1. **connectedCallback()**  
   ➡️ DOM に追加された瞬間、"component-mounted" が発火

2. **attributeChangedCallback()**  
   ➡️ 監視対象の属性が変更されると "attribute-changed" が発火

3. **disconnectedCallback()**  
   ➡️ DOM から削除された瞬間、"component-unmounted" が発火

## 🔹 まとめ
- ライフサイクルメソッドごとに型安全なイベント発火が可能
- DOM の変化に応じてリアルタイムでイベントが伝搬される
- イベントは `CustomEvent` と TypeScript の型注釈を活用することで厳密な型安全が確保される
