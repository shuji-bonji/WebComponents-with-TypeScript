# TS Input パターン

## はじめに
Web Components の設計において、入力要素は多くの場面で使用されます。特にフォーム入力や検索バー、フィルター機能など、ユーザーからの入力を受け取るためのインターフェースとして `TS Input` パターンは重要です。

このドキュメントでは、以下の内容について解説します。

- TS Input の基本実装
- 属性とプロパティのバインディング
- カスタムイベントの発行
- スタイリングの方法
- 再利用性と拡張性の考慮


## 🔹 基本実装
`TS Input` は `<ts-input>` というカスタム要素として実装され、Shadow DOM を用いてスタイルのカプセル化を行います。

```typescript
// patterns/ts-input.ts
class TSInput extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'placeholder', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      const input = this.shadowRoot?.querySelector('input');
      if (name === 'value' && input) {
        input.value = newValue;
      }
    }
  }

  get value() {
    return this.getAttribute('value') ?? '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      input.value = val;
    }
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--input-border-color, #ccc);
          border-radius: 4px;
          font-size: 14px;
        }
        input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
      </style>
      <input 
        type="text"
        placeholder="${this.getAttribute('placeholder') ?? ''}"
        value="${this.value}"
        ${this.hasAttribute('disabled') ? 'disabled' : ''}
      />
    `;
  }

  addEventListeners() {
    const input = this.shadowRoot?.querySelector('input');
    input?.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.value = target.value;
      this.dispatchEvent(
        new CustomEvent('input-change', {
          detail: { value: target.value },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define('ts-input', TSInput);
```


## 🔹 使用例
以下のように `<ts-input>` を使うことで、フォームや検索バーなどを簡単に構築できます。

```html
<ts-input placeholder="検索キーワードを入力..." value="初期値"></ts-input>

<script>
  const input = document.querySelector('ts-input');
  input.addEventListener('input-change', (event) => {
    console.log('入力された値:', event.detail.value);
  });
</script>
```


## 🔹 属性とプロパティのバインディング
`<ts-input>` は以下の属性をサポートします：

| 属性         | 説明                       | デフォルト |
|--------------|--------------------------|-----------|
| `value`     | 入力の現在の値            | `''`      |
| `placeholder` | プレースホルダーテキスト  | `''`      |
| `disabled`  | 入力の無効化               | `false`   |

属性の変更は自動的に反映され、内部の `<input>` 要素にも伝搬します。


## 🔹 カスタムイベントの発行
ユーザーの入力時に `input-change` イベントが発火されます。

- **イベント名:** `input-change`
- **バブリング:** Yes
- **composed:** Yes
- **詳細:** 
  - `detail.value`: 現在の入力値


## 🔹 スタイリングのカスタマイズ
Shadow DOM を用いているため、外部のスタイルは基本的に影響しません。ただし、CSS Variables を使ってテーマを変更することが可能です。

```css
/* グローバルCSSで定義 */
:root {
  --input-border-color: #007acc;
}
```


## 🔹 拡張性と再利用性
このパターンは以下の拡張性を持っています：

1. **カスタムバリデーション**:
   - `<ts-input required pattern="[A-Za-z]+">` のように標準の HTML5 機能を活用できます。

2. **フォームの連携**:
   - 親の `<form>` 要素と連携し、フォームの送信時にデータを含めることができます。

3. **再利用性の向上**:
   - 独立したカプセル化により、他の Web Components と安全に組み合わせて利用可能です。


## 🔹 まとめ
- `<ts-input>` は再利用性と拡張性に優れたカスタム入力要素です。
- Shadow DOM によりスタイルは完全にカプセル化され、他のコンポーネントの影響を受けません。
- カスタムイベントにより、リアルタイムなデータ反映が可能です。