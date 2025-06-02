---
title: Stateful Components パターン
description: 内部状態を持つ Web Components の設計手法と、属性との同期、イベント発火、再利用可能な構造の作り方を実例で解説。
---

# Stateful Components パターン

## はじめに
Web Components の設計において、状態（state）を管理するコンポーネントは、動的な UI の構築に欠かせません。  
`Stateful Components` は内部状態を持ち、ユーザーのアクションや外部からのプロパティ変更に応じて自律的に動作します。

このドキュメントでは、以下の内容について解説します。

- Stateful Components の基本実装
- 内部状態の管理
- 外部プロパティとの同期
- イベント通知とリアクティブな更新
- ベストプラクティスと拡張性の考慮


## 🔹 基本実装
`Stateful Components` は `<stateful-counter>` というカスタム要素として実装され、内部状態を持ち、Shadow DOM を用いてスタイルのカプセル化を行います。

```typescript
// patterns/stateful-counter.ts
class StatefulCounter extends HTMLElement {
  private _count: number = 0;

  static get observedAttributes() {
    return ['count'];
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
    if (oldValue !== newValue && name === 'count') {
      this._count = Number(newValue);
      this.update();
    }
  }

  get count() {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
    this.setAttribute('count', value.toString());
    this.update();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .counter {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        button {
          padding: 5px 10px;
          border: 1px solid #ccc;
          background-color: #f5f5f5;
          cursor: pointer;
        }
        span {
          font-size: 16px;
        }
      </style>

      <div class="counter">
        <button id="decrement">-</button>
        <span id="value">${this._count}</span>
        <button id="increment">+</button>
      </div>
    `;
  }

  update() {
    const valueDisplay = this.shadowRoot?.querySelector('#value');
    if (valueDisplay) {
      valueDisplay.textContent = this._count.toString();
    }
  }

  addEventListeners() {
    const incrementButton = this.shadowRoot?.querySelector('#increment');
    const decrementButton = this.shadowRoot?.querySelector('#decrement');

    incrementButton?.addEventListener('click', () => {
      this.count += 1;
      this.dispatchEvent(new CustomEvent('count-change', {
        detail: { count: this._count },
        bubbles: true,
        composed: true
      }));
    });

    decrementButton?.addEventListener('click', () => {
      this.count -= 1;
      this.dispatchEvent(new CustomEvent('count-change', {
        detail: { count: this._count },
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('stateful-counter', StatefulCounter);
```


## 🔹 使用例
以下のように `<stateful-counter>` を使うことで、カウントの増減が自動で行われ、イベントも発火されます。

```html
<stateful-counter count="5"></stateful-counter>

<script>
  const counter = document.querySelector('stateful-counter');
  counter.addEventListener('count-change', (event) => {
    console.log('カウントの状態:', event.detail.count);
  });
</script>
```


## 🔹 属性とプロパティのバインディング
`<stateful-counter>` は以下の属性をサポートします。

| 属性      | 説明                   | デフォルト |
|------------|----------------------|-----------|
| `count`    | 現在のカウント数       | `0`       |


## 🔹 カスタムイベントの発行
カウントが変更された時に `count-change` イベントが発火されます。

- **イベント名:** `count-change`
- **バブリング:** Yes
- **composed:** Yes
- **詳細:** 
  - `detail.count`: 現在のカウント数


## 🔹 内部状態の管理
Stateful Components は内部状態 `_count` を管理します。  
内部状態は外部からの変更（`setAttribute`）や、ボタンのクリックによって更新され、即座に表示へ反映されます。

- 内部状態の変更時には `update()` を呼び出し、表示を即座に更新
- イベント発火により、外部に変更を通知


## 🔹 拡張性と再利用性
このパターンは以下の拡張性を持っています。

1. **カスタムバリデーション**:
   - 最大値や最小値の制限、負の値の無効化など、カスタム検証ロジックを追加できます。

2. **外部同期**:
   - 親コンポーネントと同期させて、複数のカウンタを連動させることが可能です。

3. **再利用性の向上**:
   - 独立したカプセル化により、他の Web Components と安全に組み合わせて利用できます。


## 🔹 まとめ
- `<stateful-counter>` は内部状態を持ち、状態の変更を自律的に管理するコンポーネントです。
- Shadow DOM によるスタイルのカプセル化と、リアルタイムな表示更新を実現します。
- カスタムイベントにより、外部との同期が簡単に行われます。
