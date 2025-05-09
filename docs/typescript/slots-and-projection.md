# Slots と Content Projection の型付け

## 概要
`<slot>` 要素は、親要素から子要素へのコンテンツ投影（Content Projection）を可能にし、Web Component の柔軟な再利用を実現します。  
TypeScript を使うことで、型安全なスロット操作が可能になります。

## 基本構造
以下は基本的なスロットの例です。

```html
<my-card>
  <h2 slot="header">タイトル</h2>
  <p slot="content">これは内容です。</p>
</my-card>
```

```typescript
// MyCard.ts
class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        ::slotted(h2) {
          color: #007acc;
        }
      </style>
      <slot name="header"></slot>
      <slot name="content"></slot>
    `;
  }
}

customElements.define('my-card', MyCard);
```

## デフォルトスロットと名前付きスロット
- **デフォルトスロット**：名前がないスロット
- **名前付きスロット**：`name` 属性で識別されるスロット

```html
<my-card>
  <p>これはデフォルトスロットに表示されます。</p>
  <p slot="content">これは名前付きスロットに表示されます。</p>
</my-card>
```

## TypeScript による型付け
スロットの型を明確にすることで、IDE の補完機能が強化されます。

```typescript
const header = this.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement;
header.addEventListener('slotchange', () => {
  const nodes = header.assignedNodes({ flatten: true });
  console.log(nodes); // slot 内のノードがリストアップされる
});
```

## 複数スロットの管理
複数のスロットを扱う場合も、名前付きスロットで簡単に管理できます。

```typescript
class AdvancedCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <slot name="header"></slot>
      <slot name="content"></slot>
      <slot name="footer"></slot>
    `;
  }
}

customElements.define('advanced-card', AdvancedCard);
```

```html
<advanced-card>
  <h2 slot="header">ヘッダー</h2>
  <p slot="content">コンテンツ部分</p>
  <footer slot="footer">フッター部分</footer>
</advanced-card>
```

## 注意点
1. **スロット内のスタイル適用**
   - Shadow DOM の影響で、外部 CSS は影響を受けない。
   - スロット化された要素には `::slotted` セレクターを使用。

2. **動的スロットの制御**
   - 動的にスロットの内容を変更する場合、`slotchange` イベントのハンドリングが必要。

## まとめ
- Web Components のスロットは、外部からのコンテンツ挿入を安全に行う手段です。
- TypeScript の型付けで開発効率が上がり、IDE の補完が強化されます。
- 名前付きスロットとデフォルトスロットの使い分けで、複雑なレイアウトも容易に実現できます。
