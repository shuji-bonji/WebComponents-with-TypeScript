# Atomic Design と Web Components

Atomic Design は、UI コンポーネントを以下の 5 つの階層で整理する設計手法です。

1. Atoms（原子）
2. Molecules（分子）
3. Organisms（有機体）
4. Templates（テンプレート）
5. Pages（ページ）


## Atoms（原子）
最も小さい単位の UI 要素です。ボタン、インプット、ラベル、アイコンなどが含まれます。  
Web Components では、`<button>`, `<input>` のようなカスタム要素として表現します。

### 実装例: `<custom-button>`
```typescript
class CustomButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        button {
          background-color: var(--button-bg, #007bff);
          color: var(--button-color, white);
          padding: 10px 20px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }
      </style>
      <button><slot></slot></button>
    `;
  }
}

customElements.define('custom-button', CustomButton);
```

```html
<custom-button>クリック</custom-button>
```


## Molecules（分子）
Atoms を組み合わせて、少し複雑な UI 要素を形成します。  
例えば、ラベルと入力フィールドを組み合わせたフォームグループなどです。

### 実装例: `<custom-input-group>`
```typescript
class CustomInputGroup extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .input-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }
      </style>
      <div class="input-group">
        <label><slot name="label"></slot></label>
        <input type="text" />
      </div>
    `;
  }
}

customElements.define('custom-input-group', CustomInputGroup);
```

```html
<custom-input-group>
  <span slot="label">名前:</span>
</custom-input-group>
```


## Organisms（有機体）
Molecules を複数組み合わせて、より複雑なコンポーネントを作成します。  
例えば、ナビゲーションバーや検索フォームなどです。

### 実装例: `<custom-search-bar>`
```typescript
class CustomSearchBar extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .search-bar {
          display: flex;
          gap: 8px;
        }
      </style>
      <div class="search-bar">
        <custom-input-group>
          <span slot="label">検索:</span>
        </custom-input-group>
        <custom-button>検索</custom-button>
      </div>
    `;
  }
}

customElements.define('custom-search-bar', CustomSearchBar);
```

```html
<custom-search-bar></custom-search-bar>
```


## Templates（テンプレート）
Organisms をレイアウトに配置し、ページの構造を定義します。  
ここでは、レイアウト全体の骨組みを構築します。

### 実装例: `<custom-page-layout>`
```typescript
class CustomPageLayout extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .layout {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 16px;
          padding: 20px;
        }
      </style>
      <div class="layout">
        <aside>
          <slot name="sidebar"></slot>
        </aside>
        <main>
          <slot name="content"></slot>
        </main>
      </div>
    `;
  }
}

customElements.define('custom-page-layout', CustomPageLayout);
```

```html
<custom-page-layout>
  <div slot="sidebar">
    <custom-button>メニュー1</custom-button>
    <custom-button>メニュー2</custom-button>
  </div>
  <div slot="content">
    <custom-search-bar></custom-search-bar>
  </div>
</custom-page-layout>
```


## Pages（ページ）
Templates に具体的なデータを流し込み、ページ全体を完成させます。  
ここで初めて動的なデータをレンダリングし、UI として完成します。

```html
<custom-page-layout>
  <div slot="sidebar">
    <custom-button>ホーム</custom-button>
    <custom-button>設定</custom-button>
    <custom-button>ログアウト</custom-button>
  </div>
  <div slot="content">
    <custom-search-bar></custom-search-bar>
  </div>
</custom-page-layout>
```


## まとめ
- Atoms: 最小単位の UI コンポーネント
- Molecules: Atoms の組み合わせ
- Organisms: Molecules の集合で独立した UI を提供
- Templates: レイアウトを形成する構造
- Pages: テンプレートにデータを流し込み、完成したページ

Web Components と Atomic Design を組み合わせることで、再利用性と保守性の高いコンポーネント設計が可能になります。
