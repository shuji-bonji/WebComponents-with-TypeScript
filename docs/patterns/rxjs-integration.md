---
title: RxJS Integration パターン
description: RxJS を Web Components に統合することで実現できるリアクティブな状態管理と非同期処理の実装パターンを解説。
---

# RxJS Integration パターン

## はじめに
Web Components の設計において、非同期処理やリアクティブなデータフローを効率的に管理するために **RxJS** を統合するパターンは非常に有用です。  
RxJS は、データストリーム（Observable）を活用し、イベントの管理、非同期データ処理、状態管理を簡潔に行うことができます。

このドキュメントでは、以下の内容について解説します。

- RxJS の基本概念
- Web Components と RxJS の連携
- データストリームの購読と更新
- イベントのリアクティブな処理
- 実装例とベストプラクティス


## 🔹 RxJS の基本概念
RxJS はリアクティブプログラミングのためのライブラリであり、**Observable**、**Observer**、**Subscription** という 3 つの主要な概念に基づいて動作します。

- **Observable**：データのストリームを表現するもの
- **Observer**：ストリームを監視し、データが流れてきたときに処理を行うもの
- **Subscription**：ストリームを監視するための接続を管理


## 🔹 Web Components と RxJS の連携
Web Components 内で RxJS を使うことで、外部との非同期通信やイベント処理をより直感的に記述できます。  
以下の例では、カスタム要素 `<rxjs-counter>` を実装し、RxJS を用いてカウントをリアクティブに更新します。


## 🔹 基本実装
`RxjsCounter` は `<rxjs-counter>` というカスタム要素として実装され、内部で RxJS の Observable を使用してカウントの増減をリアクティブに管理します。

```typescript
// patterns/rxjs-counter.ts
import { fromEvent, merge, Observable } from 'rxjs';
import { mapTo, scan, startWith } from 'rxjs/operators';

class RxjsCounter extends HTMLElement {
  private _count$: Observable<number> | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initializeObservables();
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
        <span id="value">0</span>
        <button id="increment">+</button>
      </div>
    `;
  }

  initializeObservables() {
    const incrementButton = this.shadowRoot?.querySelector('#increment')!;
    const decrementButton = this.shadowRoot?.querySelector('#decrement')!;
    const valueDisplay = this.shadowRoot?.querySelector('#value')!;

    const increment$ = fromEvent(incrementButton, 'click').pipe(mapTo(1));
    const decrement$ = fromEvent(decrementButton, 'click').pipe(mapTo(-1));

    this._count$ = merge(increment$, decrement$).pipe(
      startWith(0),
      scan((acc, value) => acc + value, 0)
    );

    this._count$.subscribe((value) => {
      valueDisplay.textContent = value.toString();
      this.dispatchEvent(
        new CustomEvent('rxjs-count-change', {
          detail: { count: value },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define('rxjs-counter', RxjsCounter);
```


## 🔹 使用例
以下のように `<rxjs-counter>` を使うことで、カウントの増減が RxJS によって管理され、イベントも発火されます。

```html
<rxjs-counter></rxjs-counter>

<script>
  const counter = document.querySelector('rxjs-counter');
  counter.addEventListener('rxjs-count-change', (event) => {
    console.log('現在のカウント:', event.detail.count);
  });
</script>
```


## 🔹 属性とプロパティのバインディング
`<rxjs-counter>` は内部で Observable を使うため、直接の属性は持ちません。  
ただし、外部からのプロパティ設定は可能です。

| プロパティ  | 説明                | デフォルト |
|-------------|---------------------|-----------|
| `count`    | 現在のカウント数    | `0`       |


## 🔹 カスタムイベントの発行
カウントが変更された時に `rxjs-count-change` イベントが発火されます。

- **イベント名:** `rxjs-count-change`
- **バブリング:** Yes
- **composed:** Yes
- **詳細:** 
   - `detail.count`: 現在のカウント数


## 🔹 内部状態の管理
内部状態は RxJS の Observable によって管理され、リアクティブな更新が行われます。  
`scan` 演算子により、前回の状態に増減を適用し、現在の状態を計算します。


## 🔹 拡張性と再利用性
このパターンは以下の拡張性を持っています。

1. **リアルタイム通信**:
   - WebSocket などのリアルタイムなストリームをそのまま購読可能

2. **複数イベントの統合**:
   - RxJS の `merge` を使って複数のイベントを一つのストリームに統合

3. **非同期処理との相性**:
   - 非同期の API コールともシームレスに連携可能


## 🔹 まとめ
- `<rxjs-counter>` は RxJS を内部で利用し、リアクティブなカウンタを実装しています。
- Observable による非同期処理とデータフロー管理が行われ、リアルタイムな更新が可能です。
- 複数のイベントを統合して扱うことで、コードのシンプル化と保守性が向上します。
