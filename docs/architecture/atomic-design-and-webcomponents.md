# Atomic Design と Web Components の連携

## はじめに

近年、UI コンポーネント設計において **Atomic Design** と **Web Components** の統合が注目されています。  
Atomic Design はコンポーネントの階層化を促進し、再利用性と一貫性を高めます。一方で、Web Components は標準化された方法でカプセル化された UI 要素を提供し、JavaScript フレームワークに依存せず利用できます。

この二つの技術を連携させることで、堅牢かつ拡張性の高いデザインシステムが構築可能です。


## Atomic Design の基本概念

**Atomic Design** は、UI を以下の 5 つの階層に分けて設計する手法です。

|階層|説明|
|---|---|
|**Atoms<br>(原子)**|<ul><li>基本的な HTML 要素（例：ボタン、入力フィールド、ラベル）</li><li>スタイルやイベントの管理も個別に行う</li></ul>|
|**Molecules<br>(分子)**|<ul><li>複数の Atoms を組み合わせた小さな機能単位（例：検索フォーム）</li><li>イベントの伝播やデータの管理が行われる</li></ul>|
|**Organisms<br>(有機体)**|<ul><li>複数の Molecules と Atoms を組み合わせた複雑な UI 構造<br>（例：ナビゲーションバー）</li><li>ページ内の独立したセクションを形成する</li></ul>|
|**Templates<br>(テンプレート)**|<ul><li>Organisms を組み合わせてページのレイアウトを定義する静的な構造</li><li>データは持たず、配置の構造だけを持つ</li></ul>|
|**Pages<br>(ページ)**|<ul><li>Templates にデータを注入した実際に表示されるページ</li><li>データが流し込まれ、動的なレンダリングが行われる</li></ul>|


## Web Components の基本概念

何度かご紹介してますが、一方 **Web Components** は、ブラウザ標準で提供される以下の 3 つの主要技術で構成されます。

|主要技術|説明|
|---|---|
|**Custom Elements**|独自の HTML タグを作成し、再利用可能な要素を定義できる|
|**Shadow DOM**|スタイルや構造のカプセル化が可能。外部のスタイルやスクリプトからの影響を受けない|
|**HTML Templates**|再利用可能な構造をテンプレートとして定義し、インスタンス化できる|

## Web Components と Atomic Design の関係

Web Components は再利用可能なカスタム要素を作成するための Web 標準技術です。  
Atomic Design と Web Components は相性が良く、以下のように対応付けられます。

| Atomic Design | Web Components の役割                       |
|---------------|-------------------------------------------|
| Atoms         | `<atom-button>`, `<atom-input>`, `<atom-icon>` |
| Molecules     | `<molecule-search-form>`, `<molecule-card>`    |
| Organisms     | `<organism-navbar>`, `<organism-footer>`       |
| Templates     | `<template-layout>`, `<template-grid>`         |
| Pages         | `<page-home>`, `<page-about>`                  |


## 実装例

### Atoms
```typescript
// Atom: ボタンコンポーネント
class AtomButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'label'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const label = this.getAttribute('label') || 'ボタン';

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          button {
            padding: 8px 16px;
            border-radius: 4px;
            font-family: sans-serif;
            cursor: pointer;
            ${
              variant === 'primary'
                ? 'background-color: #0066cc; color: white;'
                : ''
            }
            ${
              variant === 'secondary'
                ? 'background-color: #f0f0f0; color: #333;'
                : ''
            }
          }
        </style>
        <button>${label}</button>
      `;
    }
  }
}

customElements.define('atom-button', AtomButton);
```

### Molecules
```typescript
// Molecule: 検索フォームコンポーネント
class MoleculeSearchForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <style>
          .search-form {
            display: flex;
            gap: 8px;
          }
          input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            flex-grow: 1;
          }
        </style>
        <div class="search-form">
          <input type="text" placeholder="検索...">
          <atom-button label="検索"></atom-button>
        </div>
      `;
  }

  addEventListeners() {
    const button = this.shadowRoot?.querySelector('atom-button');
    const input = this.shadowRoot?.querySelector('input');

    if (button) {
      button.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('search', {
            detail: { query: input?.value },
          })
        );
      });
    }
  }
}

customElements.define('molecule-search-form', MoleculeSearchForm);
```


## 課題と制約
1. **コンポーネントの境界が曖昧**  
   - 例：`<icon-button>` は Atom か Molecule か？定義がチーム内で一致しない場合、設計がブレる
2. **デザインシステムとの競合**  
   - Material Design などと整合性を取るのが難しい場合がある
3. **Shadow DOM の制約**  
   - スタイルのカプセル化が一方で全体のテーマ変更を難しくする


## モダンな解決策
1. **Component-Driven Development (CDD)**  
   - Storybook を使った開発で、Atomic Design の制約を取り除きつつ再利用性を高める

2. **Design Tokens の活用**  
   - カラー、フォント、スペースなどの共通スタイルをトークン化し、各 Web Component で再利用

3. **Micro Frontends の適用**  
   - Web Components を分割し、独立したマイクロアプリケーションとしてデプロイする


## まとめ
Atomic Design と Web Components は、モダンな UI 設計の基盤として非常に相性が良いです。  
デザインシステムの進化とモダンフロントエンドの成長に伴い、柔軟な設計を求められていますが、  
Component-Driven Development や Design Tokens を駆使することで、その課題を解決できます。