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
interface FormSubmitDetail {
  formData: Record<string, string>;
  submittedAt: Date;
}

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
  </head>
  <body>
    <h2>Lifecycle Component</h2>
    <lifecycle-component></lifecycle-component>

    <h2>Form Component</h2>
    <form-component></form-component>

    <h2>Two-Way Component</h2>
    <two-way-component value="Initial Value"></two-way-component>
    <button id="change-value">Change Value</button>

    <h2>Event Logs</h2>
    <div
      id="event-log"
      style="height: 200px; overflow-y: auto; border: 1px solid #ccc"
    ></div>

    <script type="module" src="/src/main.ts"></script>
    <script>
      const logElement = document.getElementById('event-log');

      function logEvent(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        logElement.appendChild(logEntry);
      }

      document
        .querySelector('lifecycle-component')
        ?.addEventListener('component-mounted', () => {
          logEvent('LifecycleComponent Mounted');
        });

      document
        .querySelector('lifecycle-component')
        ?.addEventListener('component-unmounted', () => {
          logEvent('LifecycleComponent Unmounted');
        });

      document
        .querySelector('form-component')
        ?.addEventListener('form-submit', (event) => {
          logEvent(
            `Form Submitted with Data: ${JSON.stringify(event.detail.formData)}`
          );
        });

      const twoWayComponent = document.querySelector('two-way-component');
      twoWayComponent?.addEventListener('value-changed', (event) => {
        logEvent(`TwoWayComponent Value Changed: ${event.detail}`);
      });

      document.getElementById('change-value')?.addEventListener('click', () => {
        if (twoWayComponent) {
          twoWayComponent.value = 'Updated Value';
        }
      });
    </script>
  </body>
</html>
```

#### main.ts
```ts
// main.ts
import './components/LifecycleComponent';
import './components/FormComponent';
import './components/TwoWayComponent';
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
