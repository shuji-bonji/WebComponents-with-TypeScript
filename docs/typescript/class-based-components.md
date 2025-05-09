# クラスベースの Custom Elements の実装

Web Components の主要な要素である **Custom Elements** は、クラスベースの構文を使用して定義されます。ここでは、**Autonomous Custom Elements** と **Customized Built-in Elements** の両方について、TypeScript を活用した実装を学びます。

## 🔹 Autonomous Custom Elements
独自の HTML タグとして定義され、他の HTML 要素に依存しないカスタム要素です。
`HTMLElement` を直接拡張し、新しいタグ名を定義します。

```ts
// Autonomous Custom Element の例
class MyButton extends HTMLElement {
  constructor() {
    super();
    console.log("Autonomous Custom Element が生成されました");
  }
}

customElements.define('my-button', MyButton);
```

```html
<my-button></my-button>
```

## 🔹 Customized Built-in Elements

既存の HTML 要素を拡張し、追加の機能を持たせるカスタム要素です。  
登録時に `extends` を指定し、使用する場合は `is` 属性を付けて宣言します。

例として `<button>` 要素を拡張します。


```ts
// Customized Built-in Element の例
class FancyButton extends HTMLButtonElement {
  constructor() {
    super();
    this.style.backgroundColor = "lightblue";
    this.textContent = "拡張されたボタン";
  }
}

customElements.define('fancy-button', FancyButton, { extends: 'button' });
```

```html
<button is="fancy-button"></button>
```

Autonomous と Customized は登録方法や使用方法が異なりますが、どちらもクラスベースで拡張し、DOM に追加して利用します。

## 🔹 HTMLElement の拡張とカスタマイズ

既存の HTMLElement を拡張して独自の機能を持つカスタム要素を作成できます。  
以下は、要素のライフサイクルメソッドを活用し、イベント発火を共通化した例です。

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

  adoptedCallback() {
    console.log("他のドキュメントに移動されました");
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

```html
<lifecycle-component data-status="active"></lifecycle-component>
```

## 🔹　カスタム要素タグの利用方法

HTML 要素の拡張には主に **2 つのパターン** があります。

| パターン |  使用例  |
|---|---|
| Autonomous Custom Elements  | `<my-button></my-button>` |
| Customized Built-in Elements | `<button is="fancy-button"></button>` |


## 🔹 DOM への追加方

Custom Elements は `customElements.define()` を使って登録します。  
Autonomous と Customized では若干異なるので注意が必要です。

### 📌 Autonomous Custom Elements

直接 `document.createElement()` で生成できます。

```ts
const myButton = document.createElement('my-button');
document.body.appendChild(myButton);
```

### 📌 Customized Built-in Elements

`createElement` の第二引数に `{ is: 'fancy-button' }` を渡す必要があります。

```ts
const fancyButton = document.createElement('button', { is: 'fancy-button' });
document.body.appendChild(fancyButton);
```

## 🔹 Shadow DOM の利用

`Shadow DOM` は要素の内部構造を外部からカプセル化する技術です。  
Shadow DOM を使うことで、スタイルのカプセル化や内部構造の隠蔽が可能になります。

```ts
class MyShadowComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        p {
          color: blue;
        }
      </style>
      <p>Shadow DOM の中です。</p>
    `;
  }
}

customElements.define('my-shadow-component', MyShadowComponent);
```

```html
<my-shadow-component></my-shadow-component>
```

### 📌 特徴
- 外部の CSS の影響を受けない
- コンポーネントの内部を安全にカプセル化
- Slot と組み合わせて柔軟なレンダリングが可能


## まとめ
- Autonomous と Customized の 2 種類の Custom Elements がある
- Shadow DOM を使うことでスタイルをカプセル化
- ライフサイクルメソッドで動的な DOM 変更に対応可能