---
description: Custom Elements の基本構造と定義方法、命名規則、使用例についてTypeScriptで実践的に学ぶガイド。
---

# Custom Elements

**Custom Elements** は、Web Components を構成する主要な仕様の1つであり、**独自の HTML タグ（カスタム要素）を定義できる仕組み**です。  
HTML の拡張として、自分だけのタグを作成し、DOM に追加できるため、  
再利用性が高く、保守性の良い UI コンポーネントの作成が可能です。


> [!NOTE]
> **補足: HTML タグ、要素、HTMLElement の違い**
> 
> | 概念 | 説明 | 例  |
> |---|---|---|
> | **タグ**    | HTML のマークアップに使用する要素の宣言部分<br> `<p>`, `<div>`, `<my-element>` など | `<my-element></my-element>` |
> | **要素**    | タグとその内部のコンテンツを含む、HTML ドキュメント内の構造体 | `<p>これは段落です。</p>` |
> | **HTMLElement** | JavaScript で操作するためのオブジェクト。`document.createElement`で生成される | `const el = document.createElement('div');` |
> 
> - タグは「定義された要素」を HTML マークアップに表現するもの。
> - 要素はタグ＋コンテンツ。
> - HTMLElement は要素を操作するための JavaScript オブジェクト。
> - カスタム要素は「クラス → タグ → 要素」の流れで生成される。


## 🔹 なぜ Custom Elements が重要か？

- UI部品をカプセル化し、再利用可能な形で構築できる
- HTMLタグのように直感的に使える
- フレームワークに依存しないため、他のプロジェクトやツールでもそのまま利用できる
- テンプレート、Shadow DOM、イベントなど他の仕様と組み合わせることで、**自己完結型のコンポーネント**を実現できる


## 🔹 カスタム要素の生成フロー
1. **クラスの定義**  
   - `HTMLElement` を拡張して、カスタム要素のクラスを作成する。
   
2. **タグの登録**  
   - `customElements.define('my-custom-element', MyCustomElement);` を使ってタグを登録する。

3. **HTML 内でタグを使う**  
   - `<my-custom-element></my-custom-element>` として直接マークアップに使用できる。


## 🔹 カスタム要素のクラス定義
まず、最も基本的な Custom Element の実装例を示します。  
以下は `MyCustomElement.ts` の実装例です。

```ts
// MyCustomElement.ts
class MyCustomElement extends HTMLElement {
  constructor() {
    super(); // 親クラスのコンストラクタ呼び出し
    this.attachShadow({ mode: "open" }); // Shadow DOM の作成
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        p {
          color: blue;
          font-size: 20px;
        }
      </style>
      <p>Hello, Web Component!</p>
    `;
  }
}

// カスタム要素の登録
customElements.define('my-custom-element', MyCustomElement);
```

## 🔹 カスタム要素の登録
カスタム要素を使うためには、`customElements.define()` を用いてタグ名とクラスを関連付ける必要があります。

```ts
customElements.define('my-custom-element', MyCustomElement);
```

| 引数 | 説明 |
|-------|------|
| `'my-custom-element'` | カスタム要素のタグ名 |
| `MyCustomElement` | 定義するクラス |

## 🔹 カスタム要素をDOMへ追加
カスタム要素は登録後、HTML 内で次のように利用できます。

### 📌 HTML への直接宣言

```html
<my-custom-element></my-custom-element>
```

### 📌 JavaScript での動的生成
```ts
const myElement = document.createElement('my-custom-element');
document.body.appendChild(myElement);
```

## 🔹 カスタム要素の命名規則
- カスタム要素のタグ名は **ハイフン (`-`) を含む** 必要があります。
- これは標準の HTML タグとの衝突を避けるための仕様です。

| 正しい例 | 説明 |
|-----------|---------|
| `<my-component>` | ハイフンが含まれているので有効 |
| `<custom-button>` | 有効なタグ名 |  
| `<button-custom>` | 有効なタグ名 |

| 間違った例 | 説明 |
|-----------|---------|
| `<mycomponent>` | ハイフンが含まれていないので無効 |
| `<custombutton>` | 無効なタグ名 |
| `<header>` | 標準タグと衝突するので無効 |


## 🔹 主な構成要素との関係
Custom Elements は、以下の仕様と組み合わせて使われることで、真に再利用可能な Web UI 部品として機能します。

- [Shadow DOM](/concepts/shadow-dom.md)
- [HTML Templates](/concepts/html-templates.md)
- [Slot](/typescript/slots-and-projection.md)


## 🔹 カスタム要素の種類
Web Components のカスタム要素には、以下の 2 種類があります。

- **Autonomous Custom Elements**: 完全に新しいタグ名として定義される要素です。
- **Customized Built-in Elements**: 既存の HTML 要素を拡張して新しい機能を追加する要素です。

詳細な実装については [Custom Elementsの実装](../typescript/custom-element-implementation.md) を参照してください。


## 🔹 まとめ
- Custom Elements は HTML を拡張し、独自の UI 部品を作成する技術です。
- Autonomous と Customized の 2 種類が存在します。
- `customElements.define()` を使って登録後、HTML 内や JavaScript で利用可能です。
- 他の Web Components の仕様（Shadow DOM、HTML Templates、Slot）と密接に連携できます。
