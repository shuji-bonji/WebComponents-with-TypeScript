---
title: TS Toggle パターン
description: ON/OFF スイッチとしての `<ts-toggle>` の構造、状態管理、イベント発火、テーマカスタマイズ、アクセシビリティを含めた設計を解説。
---
---
title: プロジェクト構成
description: Web Components プロジェクトにおけるディレクトリ構成やファイル分割のベストプラクティスを紹介。保守性とスケーラビリティを両立する設計。
---

# TS Toggle パターン

## はじめに
`TS Toggle` は Web Components を活用して、シンプルで拡張性のあるトグルスイッチ（ON/OFF）を提供するコンポーネントです。  
多くの UI で使用されるトグルスイッチをカスタム要素として独立させ、再利用性とスタイルのカプセル化を実現しています。

このドキュメントでは、以下の内容について解説します。

- TS Toggle の基本実装
- 属性とプロパティのバインディング
- カスタムイベントの発行
- スタイリングの方法
- 再利用性と拡張性の考慮


## 🔹 基本実装
`TS Toggle` は `<ts-toggle>` というカスタム要素として実装され、Shadow DOM を用いてスタイルのカプセル化を行います。

```typescript
// patterns/ts-toggle.ts
class TSToggle extends HTMLElement {
  static get observedAttributes() {
    return ['checked', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();

    // 初期状態の反映
    if (this.checked) {
      const toggle = this.shadowRoot?.querySelector('.toggle');
      toggle?.classList.add('checked');
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      const toggle = this.shadowRoot?.querySelector('.toggle');
      const toggleIsChecked = name === 'checked' && toggle;
      if (toggleIsChecked) {
        this.checked
          ? toggle.classList.add('checked')
          : toggle.classList.remove('checked');
      }
    }
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value: boolean) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .toggle {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
        }

        .switch {
          width: 40px;
          height: 20px;
          background-color: var(--toggle-off-color, #ccc);
          border-radius: 20px;
          position: relative;
          transition: background-color 0.3s;
        }

        .checked .switch {
          background-color: var(--toggle-on-color, #4CAF50);
        }

        .knob {
          width: 18px;
          height: 18px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 1px;
          left: 1px;
          transition: left 0.3s;
        }

        .checked .knob {
          left: 20px;
        }

        :host([disabled]) .toggle {
          cursor: not-allowed;
          opacity: 0.5;
        }
      </style>

      <div class="toggle">
        <div class="switch">
          <div class="knob"></div>
        </div>
      </div>
    `;
  }

  addEventListeners() {
    if (!this.hasAttribute('disabled')) {
      const toggle = this.shadowRoot?.querySelector('.toggle');
      toggle?.addEventListener('click', () => {
        toggle.classList.toggle('checked');
        this.checked = !this.checked;
        this.dispatchEvent(
          new CustomEvent('toggle-change', {
            detail: { checked: this.checked },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }
}

customElements.define('ts-toggle', TSToggle);

```


## 🔹 使用例
以下のように `<ts-toggle>` を使うことで、ON/OFF のトグルスイッチを簡単に実装できます。

```html
<ts-toggle></ts-toggle>

<script>
  const toggle = document.querySelector('ts-toggle');
  toggle.addEventListener('toggle-change', (event) => {
    console.log('トグルの状態:', event.detail.checked);
  });
</script>
```


## 🔹 属性とプロパティのバインディング
`<ts-toggle>` は以下の属性をサポートします：

| 属性         | 説明                         | デフォルト |
|--------------|----------------------------|-----------|
| `checked`   | トグルの現在の状態 (ON/OFF)   | `false`   |
| `disabled`  | トグルの無効化               | `false`   |


## 🔹 カスタムイベントの発行
トグルの状態が変更された時に `toggle-change` イベントが発火されます。

- **イベント名:** `toggle-change`
- **バブリング:** Yes
- **composed:** Yes
- **詳細:** 
  - `detail.checked`: 現在のトグルの状態 (true / false)


## 🔹 スタイリングのカスタマイズ
Shadow DOM によってスタイルはカプセル化されていますが、CSS カスタムプロパティで色の変更が可能です。

```css
:root {
  --toggle-on-color: #4CAF50;
  --toggle-off-color: #ccc;
}
```


## 🔹 拡張性と再利用性
このパターンは以下の拡張性を持っています：

1. **ARIA サポート**:
   - `role="switch"` や `aria-checked` を追加することで、アクセシビリティの向上が可能です。

2. **フォーム連携**:
   - `<form>` 内で使用すると、フォームの送信時に状態を反映できます。

3. **再利用性の向上**:
   - 独立したカプセル化により、他の Web Components と安全に組み合わせて利用可能です。


## 🔹 まとめ
- `<ts-toggle>` は再利用性と拡張性に優れたカスタムトグルスイッチです。
- Shadow DOM によりスタイルは完全にカプセル化され、他のコンポーネントの影響を受けません。
- カスタムイベントにより、状態変更のハンドリングが容易です。