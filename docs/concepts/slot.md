# Slot

**Slot** は、Web Components の Shadow DOM 内に外部のコンテンツを注入するための特殊な要素です。  
主に再利用可能なコンポーネント設計を実現するために利用され、構造と内容を分離する役割を担います。

> [!IMPORTANT]
> Slot は Custom Element 内部の Shadow DOM においてのみ機能する仕様です。  
> つまり、Shadow DOM は Custom Elements なしでも使えますが、Slotは Custom Elements の内部に Shadow DOM を組み込んだ場合 のみ動作します。
> |ケース|Shadow DOM|Slot 使用|
> |---|---|---|
> |Custom Element と一緒に使う|✅|✅|
> |普通の HTML 要素に使う|✅|❌|

## 🔹　Slotの主な特徴

- カスタム要素の内部（シャドウ DOM）に外部からコンテンツを挿入できる
- スロットにはデフォルトのコンテンツを設定できる
- 複数のスロット（名前付きスロット）を定義できる
- CSS ::slotted() 疑似クラスを使ってスロットのスタイルを適用できる

## Slot の利点

- Web Components 内で柔軟なカスタマイズを可能にする
- カプセル化されたコンポーネントを作りつつ、外部からのコンテンツ変更を許容
- ::slotted() を使ってスロットの内容にスタイルを適用できる
- デフォルトのコンテンツを設定できるので、スロットが空でも問題ない

## 🔹 基本構造
`<slot>` タグは Shadow DOM 内に配置され、外部から渡された要素が表示される場所を示します。  
デフォルトの構造は次のようになります。

```html
<template id="my-template">
  <div class="card">
    <slot></slot>
  </div>
</template>
```

### 📌 使用例
```ts
class MyCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // テンプレートの取得と複製
    const template = document.getElementById('my-template') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true);

    // Shadow DOM に追加
    shadow.appendChild(clone);
  }
}

customElements.define('my-card', MyCard);
```

```html
<template id="my-template">
  <div class="card">
    <slot></slot>
  </div>
</template>

<my-card>
  <p>これはスロットに挿入されたコンテンツです。</p>
</my-card>
```

## 🔹 **名前付き Slot**
`<slot>` 要素は `name` 属性を持つことで、複数のスロットを区別することができます。  
これにより、特定の位置に指定されたコンテンツを挿入できます。

### 📌 **例: 名前付き Slot**
```html
<template id="named-template">
  <div class="card">
    <header>
      <slot name="header"></slot>
    </header>
    <section>
      <slot></slot> <!-- デフォルトスロット -->
    </section>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<my-card>
  <h1 slot="header">ヘッダー部分</h1>
  <p>これはデフォルトのスロットです。</p>
  <p slot="footer">フッター部分</p>
</my-card>
```

**実行結果**
```
<header>
  <h1>ヘッダー部分</h1>
</header>
<section>
  <p>これはデフォルトのスロットです。</p>
</section>
<footer>
  <p>フッター部分</p>
</footer>
```

## 🔹 **デフォルトコンテンツ**
`<slot>` 内に要素が渡されなかった場合、**デフォルトの内容** を表示させることができます。

### 📌 **例: デフォルトコンテンツ**
```html
<template id="default-template">
  <div class="card">
    <slot>デフォルトのコンテンツです</slot>
  </div>
</template>

<my-card></my-card>
```

**実行結果**
```
<div class="card">
  デフォルトのコンテンツです
</div>
```

## 🔹 **Slot の変更検知**
`slotchange` イベントを使うことで、スロット内のコンテンツ変更を検知できます。

### 📌 **例: slotchange の利用**
```ts
class MyCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const template = document.getElementById('named-template') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true);

    shadow.appendChild(clone);

    const slot = shadow.querySelector('slot');
    slot?.addEventListener('slotchange', () => {
      console.log('スロットの内容が変更されました');
    });
  }
}

customElements.define('my-card', MyCard);
```

## 制約

- スロット内の要素はシャドウ DOM 内の CSS の影響を受けない（::slotted() が必要）
- スロットに JavaScript で直接値を入れることはできない（親要素を変更する必要がある）
- スロットの再配置はできない（動的にスロットを変更するには slot 属性を変更する必要がある）

## 🔹 **まとめ**
- `<slot>` を使うことで外部からのコンテンツ注入が簡単になる
- 名前付きスロットで特定の場所への挿入が可能
- デフォルトコンテンツで空の状態もカバー
- `slotchange` イベントで動的な変更を検知できる

