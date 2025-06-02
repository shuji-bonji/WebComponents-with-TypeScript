---
title: Template と Slot の連携
description: Web Components におけるテンプレートとスロットの使い分けと連携方法を解説。再利用性とカプセル化を高める設計を学びます。
---
# Template と Slot の連携

Web Components の開発において、`<template>` と `<slot>` はそれぞれ独自の役割を持ちますが、組み合わせることで非常に強力な再利用性とカプセル化を実現できます。ここでは、その連携方法について詳しく解説します。

## Template と Slot の違い

| 特徴             | `<template>`                      | `<slot>`                         |
|------------------|----------------------------------|----------------------------------|
| **目的**        | 再利用可能な DOM 構造の定義       | Shadow DOM 内へのコンテンツ挿入  |
| **描画時期**    | JavaScript で複製された時のみ     | 親コンポーネントがレンダリングされた時 |
| **制御**        | 完全にスクリプト制御              | 子要素を親コンポーネントに委譲    |

## Template の基本構造

`<template>` タグは、HTML 内に再利用可能な構造を定義し、初期ロード時には描画されません。

```html
<template id="card-template">
  <div class="card">
    <slot name="header"></slot>
    <p>これはテンプレートの内容です。</p>
    <slot name="footer"></slot>
  </div>
</template>
```

- `<slot>` は後から挿入される内容の「受け皿」を示します。
- `<template>` 内に配置されているが、表示されるのはインスタンス化された時のみです。

## Template の複製と Shadow DOM への展開

```ts
class MyCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // テンプレートの取得と複製
    const template = document.getElementById('card-template') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true);

    // Shadow DOM に追加
    shadow.appendChild(clone);
  }
}

customElements.define('my-card', MyCard);
```

```html
<template id="card-template">
  <div class="card">
    <slot name="header"></slot>
    <p>これはテンプレートの内容です。</p>
    <slot name="footer"></slot>
  </div>
</template>

<my-card>
  <span slot="header">ヘッダーコンテンツ</span>
  <span slot="footer">フッターコンテンツ</span>
</my-card>
```

## 実行結果
```
[ShadowRoot]
  <div class="card">
    <span slot="header">ヘッダーコンテンツ</span>
    <p>これはテンプレートの内容です。</p>
    <span slot="footer">フッターコンテンツ</span>
  </div>
```

`<slot>` 要素は、`<my-card>` の子要素として渡された `<span>` タグを受け取り、Shadow DOM 内に適切に展開します。

## ポイント
1. `<template>` は Shadow DOM の一部として再利用可能な構造を提供
2. `<slot>` は外部の要素を Shadow DOM 内に注入
3. `<template>` の内容は `cloneNode` によって複製され、Shadow DOM 内に表示

