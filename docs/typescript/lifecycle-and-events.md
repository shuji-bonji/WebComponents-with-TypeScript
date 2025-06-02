---
title: ライフサイクルメソッドと型安全なイベント処理
description: TypeScript を活用し、カスタム要素のライフサイクルメソッドと型安全なイベント処理を実装する手法を具体例とともに解説します。
---


# ライフサイクルメソッドと型安全なイベント処理

このページでは TypeScript を使って Web Components のライフサイクルメソッドと型安全なイベント処理の実装方法を解説します。  
基本的なライフサイクルメソッドの使い方から、TypeScript の型定義を活かしたイベント発火の例までを詳しく説明します。

## 🔹 **基本のライフサイクルメソッド**
カスタム要素は以下の 4 つのライフサイクルメソッドを持ちます。詳細な説明は [Custom Element のライフサイクル](../concepts/custom-element-lifecycle) を参照してください。  
ここでは、TypeScript を使った実装例にフォーカスします。

```typescript
export class LifecycleComponent extends HTMLElement {
  connectedCallback(): void {
    console.log('要素が追加されました');
    this.emitEvent('component-mounted', 'Component Mounted');
  }

  disconnectedCallback(): void {
    console.log('要素が削除されました');
    this.emitEvent('component-unmounted', 'Component Unmounted');
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    console.log(
      `属性 ${name} が ${oldValue} から ${newValue} に変更されました`
    );
    this.emitEvent('attribute-changed', `Attribute ${name} changed`);
  }

  private emitEvent(eventName: string, message: string): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
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



## 🔹 **型安全なイベント発火**
TypeScript を活用すると、イベントの詳細も型定義で安全に扱えます。

```typescript
import type { FormSubmitDetail } from '../types';

export class FormComponent extends HTMLElement {
  connectedCallback(): void {
    const form = document.createElement('form');
    form.innerHTML = `
      <input type="text" name="username" placeholder="Username" />
      <button type="submit">Submit</button>
    `;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      this.emitFormSubmitEvent(formData);
    });

    this.appendChild(form);
  }

  private emitFormSubmitEvent(formData: FormData): void {
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    this.dispatchEvent(
      new CustomEvent<FormSubmitDetail>('form-submit', {
        detail: {
          formData: data,
          submittedAt: new Date(),
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('form-component', FormComponent);
```


## 🔹 **応用例**
### 📌 双方向データバインディング
- `attributeChangedCallback` を使ってプロパティと属性を同期
- 型安全なイベント発火で状態を他の要素に伝達

```typescript
export class TwoWayComponent extends HTMLElement {
  static get observedAttributes() {
    return ['value'];
  }

  get value(): string {
    return this.getAttribute('value') ?? '';
  }

  set value(newValue: string) {
    this.setAttribute('value', newValue);
    this.emitChangeEvent(newValue);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue !== newValue) {
      console.log(`Value changed: ${oldValue} -> ${newValue}`);
    }
  }

  private emitChangeEvent(value: string): void {
    this.dispatchEvent(
      new CustomEvent<string>('value-changed', {
        detail: value,
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('two-way-component', TwoWayComponent);
```


## 📌 Lifecycle Component、　Form Component、Two-Way Component　の利用


#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TypeScript WebComponents Starter Kit</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      section {
        margin-bottom: 30px;
        padding: 15px;
        border: 1px solid #eee;
        border-radius: 5px;
      }
      h2 {
        margin-top: 0;
        color: #333;
      }
      #event-log {
        height: 200px;
        overflow-y: auto;
        border: 1px solid #ccc;
        padding: 10px;
        background-color: #f9f9f9;
        font-family: monospace;
      }
      button {
        margin-right: 10px;
        padding: 5px 10px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <h1>Web Components Lifecycle & Events Demo</h1>

    <section>
      <h2>Lifecycle Component</h2>
      <lifecycle-component data-status="initial"></lifecycle-component>
      <div class="controls">
        <button id="add-component">コンポーネント追加</button>
        <button id="remove-component">コンポーネント削除</button>
      </div>
      <div id="dynamic-container"></div>
    </section>

    <section>
      <h2>Form Component</h2>
      <form-component></form-component>
    </section>

    <section>
      <h2>Two-Way Component</h2>
      <two-way-component value="Initial Value"></two-way-component>
      <button id="change-value">値を変更</button>
    </section>

    <section>
      <h2>Event Logs</h2>
      <div id="event-log"></div>
    </section>

    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

```

#### types.ts
```ts
// types.ts
// LifecycleComponent のイベント詳細型定義
export interface ComponentEventDetail {
  message: string;
  timestamp: number;
  source?: string;
}

// FormComponent のイベント詳細型定義
export interface FormSubmitDetail {
  formData: Record<string, string>;
  submittedAt: Date;
}
```

#### main.ts
```ts
// main.ts
import './components/LifecycleComponent';
import './components/FormComponent';
import './components/TwoWayComponent';
import type { ComponentEventDetail, FormSubmitDetail } from './types';

// DOM読み込み後に実行
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  addDemoComponents();
});

function setupEventListeners(): void {
  const logElement = document.getElementById('event-log');

  function logEvent(message: string): void {
    if (!logElement) return;

    const logEntry = document.createElement('div');
    logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    logElement.appendChild(logEntry);

    // 自動スクロール
    logElement.scrollTop = logElement.scrollHeight;
  }

  // LifecycleComponent のイベントリスナー
  document.addEventListener('component-mounted', (event: Event) => {
    const customEvent = event as CustomEvent<ComponentEventDetail>;
    logEvent(`LifecycleComponent Mounted: ${customEvent.detail.message}`);
  });

  document.addEventListener('component-unmounted', (event: Event) => {
    const customEvent = event as CustomEvent<ComponentEventDetail>;
    logEvent(`LifecycleComponent Unmounted: ${customEvent.detail.message}`);
  });

  document.addEventListener('attribute-changed', (event: Event) => {
    const customEvent = event as CustomEvent<ComponentEventDetail>;
    logEvent(`Attribute Changed: ${customEvent.detail.message}`);
  });

  // FormComponent のイベントリスナー
  document.addEventListener('form-submit', (event: Event) => {
    const customEvent = event as CustomEvent<FormSubmitDetail>;
    logEvent(
      `Form Submitted with Data: ${JSON.stringify(customEvent.detail.formData)}`
    );
  });

  // TwoWayComponent のイベントリスナー
  document.addEventListener('value-changed', (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    logEvent(`TwoWayComponent Value Changed: ${customEvent.detail}`);
  });

  // ボタンのイベントリスナー
  const changeValueButton = document.getElementById('change-value');
  if (changeValueButton) {
    changeValueButton.addEventListener('click', () => {
      const twoWayComponent = document.querySelector('two-way-component');
      if (twoWayComponent) {
        (twoWayComponent as any).value = 'Updated Value';
      }
    });
  }

  // 動的にコンポーネントを追加/削除するボタン
  const addComponentButton = document.getElementById('add-component');
  if (addComponentButton) {
    addComponentButton.addEventListener('click', () => {
      const container = document.getElementById('dynamic-container');
      if (container) {
        const lifecycleComponent = document.createElement(
          'lifecycle-component'
        );
        lifecycleComponent.setAttribute('data-status', 'new');
        container.appendChild(lifecycleComponent);
        logEvent('LifecycleComponent が動的に追加されました');
      }
    });
  }

  const removeComponentButton = document.getElementById('remove-component');
  if (removeComponentButton) {
    removeComponentButton.addEventListener('click', () => {
      const container = document.getElementById('dynamic-container');
      const component = container?.querySelector('lifecycle-component');
      if (component) {
        component.remove();
        logEvent('LifecycleComponent が動的に削除されました');
      }
    });
  }
}

function addDemoComponents(): void {
  // 必要に応じて動的にコンポーネントを追加
  // この例では、すべてのコンポーネントがHTMLに直接宣言されていると仮定
}
```

## 🔹 **デバッグとトラブルシューティング**
1. **イベントが発火しない場合**:
   - `bubbles` と `composed` が正しく指定されているか確認。
   - `CustomEvent` の型が正しいか確認。

2. **メモリリークの防止**:
   - `disconnectedCallback` でイベントリスナーの解除を確実に行う。
   - タイマーやインターバルの停止も忘れずに。

3. **イベント解除のベストプラクティス**:
   - 以下のようにリスナー登録時に `disconnectedCallback` で解除。

   ```typescript
   connectedCallback(): void {
     this.addEventListener('click', this.handleClick);
   }

   disconnectedCallback(): void {
     this.removeEventListener('click', this.handleClick);
   }

   private handleClick = (event: Event): void => {
     console.log("クリックされました");
   }
   ```

## 🔹 **まとめ**
- ライフサイクルメソッドの理解と活用で、イベント駆動型の UI 設計が容易になる。
- TypeScript を使うことでイベントの型安全性が確保され、予期せぬエラーを防げる。
- 双方向データバインディングや応用的なイベント設計も型定義で整然と管理可能。

上記の内容で、`lifecycle-and-events.md` は「TypeScript での型安全なライフサイクル管理とイベント処理」に特化したページになります。  
実装例をコンパクトにまとめ、型安全な設計を意識した構造です。
