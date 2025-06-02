---
title: Web Components とは？
description: Web Components の構成技術やメリット、仕組み、TypeScriptとの相性を体系的に解説。カスタム要素、Shadow DOM、テンプレートなどの要素がどのように連携するかを理解できます。
---
# Web Componentsとは？

**Web Components** とは、HTML・CSS・JavaScript の標準技術だけを使って、**再利用可能な UI コンポーネント**を構築するための仕組みです。これは単なるライブラリやフレームワークではなく、**ブラウザネイティブの標準仕様**として開発されています。

## 🔹 なぜ Web Components なのか？

現代のWeb開発では、UI部品の再利用性が重要な課題となっています。従来は各種フレームワーク（React, Angular, Vueなど）がそれぞれ独自の方法でコンポーネント化を実現してきましたが、以下の課題がありました。

### 課題

1. **フレームワーク間の互換性がない** - React で作ったコンポーネントは Vue では直接使えない
2. **フレームワークの寿命に依存** - フレームワークが更新・廃止されると、コンポーネントも書き直しが必要
3. **学習コストの高さ** - 各フレームワーク特有の概念やAPI、ライフサイクルを学ぶ必要がある

Web Components はこれらの課題を解決するために生まれた**標準技術**で、以下のメリットがあります。

### メリット
- **フレームワーク非依存** - どのフレームワークでも利用可能、または単体で動作
- **将来的な互換性** - W3C標準であるため、ブラウザが対応する限り動作し続ける
- **技術的負債の低減** - 標準技術のため、特定のライブラリやフレームワークの知識が不要

## 🔹 主な構成要素（仕様）

Web Components は次の5つの仕様を中心に構成されています。

|要素|説明|
|---|---|
|[Custom Elements](./custom-elements)|任意の名前で HTML 要素を定義できる仕組み。独自タグ（例：`<my-button>`）を作成可能|
|[Shadow DOM](./shadow-dom)|コンポーネント内部に閉じた DOM ツリーとスタイルスコープを提供し、外部のCSSやJSとの干渉を防ぎます。|
|[HTML Templates](./html-templates)|`<template>` 要素によって再利用可能な DOM 構造を定義し、動的に展開可能にする|
|[Slot](../typescript/slots-and-projection.md)|外部から内部へコンテンツを差し込む透過的な挿入ポイントを提供。Reactの`children`に類似|
|[ES Modules](./es-modules)|モジュール単位でコードを分割・管理する標準仕様。Web Components の再利用を促進する|

> [!NOTE]
> Web Components の 5 本柱として **ES Modules** を含みます。  
> モジュール化することで Web Components の再利用性を高め、依存関係の解決を行います。  
> 現在では JavaScript の標準として広く普及していますが、Web Components の一部として位置づけます。

## 🔹 Web Components の動作原理

Web Components の基本的な動作原理を理解するには、以下の流れを把握すると良いでしょう。

1. **カスタム要素の定義** - `customElements.define()` で HTML 要素を拡張したクラスを登録
2. **Shadow DOM のアタッチ** - カプセル化された DOM ツリーを作成し、スタイルの分離を実現
3. **テンプレートの利用** - 再利用可能な DOM 構造を定義し、複製して使用
4. **スロットによるコンテンツ投影** - 外部から渡されたコンテンツを内部構造に挿入

以下は、これらの要素を組み合わせた簡単な例です。

```html
<!-- HTMLテンプレートの定義 -->
<template id="my-button-template">
  <style>
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
  <button><slot>Click me</slot></button>
</template>

<script>
  class MyButton extends HTMLElement {
    constructor() {
      super();
      // Shadow DOMを作成
      const shadow = this.attachShadow({mode: 'open'});
      
      // テンプレートを複製して追加
      const template = document.getElementById('my-button-template');
      shadow.appendChild(template.content.cloneNode(true));
    }
  }
  
  // カスタム要素として登録
  customElements.define('my-button', MyButton);
</script>

<!-- 使用例 -->
<my-button>送信する</my-button>
```

## 🔹 Web 標準技術としての位置づけ

Web Components は、W3CおよびWHATWGにより標準化された技術であり、最新のブラウザで広くサポートされています。以下は公式リファレンスです。

- [Custom Elements - MDN](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements)
- [Shadow DOM - MDN](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_shadow_DOM)
- [HTML Templates - MDN](https://developer.mozilla.org/ja/docs/Web/HTML/Element/template)
- [Slot - MDN](https://developer.mozilla.org/ja/docs/Web/HTML/Element/slot)
- [ES Modules - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules)

## 🔹 TypeScript との相性

Web Components は JavaScript で実装可能ですが、TypeScript を使うことで以下のメリットが得られます。

- **型安全性** - プロパティや属性、イベントの型を明示的に定義可能
- **IDE サポート** - コード補完やリファクタリングのサポートが強化される
- **クラスベースの設計** - TypeScript のクラス構文が Web Components のクラスベース実装と自然に統合
- **インターフェースと抽象化** - 共通のインターフェースを定義し、一貫性のあるコンポーネント設計が可能

```typescript
// TypeScriptによるWeb Componentの実装例
interface ButtonOptions {
  type: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

class TypedButton extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'disabled'];
  }
  
  // 型付きのプロパティ
  private _options: ButtonOptions = {
    type: 'primary',
    disabled: false
  };
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  // 型安全なアクセサ
  get type(): 'primary' | 'secondary' | 'danger' {
    return this._options.type;
  }
  
  set type(value: 'primary' | 'secondary' | 'danger') {
    this._options.type = value;
    this.setAttribute('type', value);
    this.render();
  }
  
  get disabled(): boolean {
    return !!this._options.disabled;
  }
  
  set disabled(value: boolean) {
    this._options.disabled = value;
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
    this.render();
  }
  
  // ライフサイクルメソッド
  connectedCallback() {
    this.render();
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'type' && newValue) {
      this._options.type = newValue as 'primary' | 'secondary' | 'danger';
    } else if (name === 'disabled') {
      this._options.disabled = newValue !== null;
    }
    this.render();
  }
  
  // レンダリングメソッド
  private render() {
    if (!this.shadowRoot) return;
    
    const buttonClass = `button button--${this.type}`;
    const disabledAttr = this.disabled ? 'disabled' : '';
    
    this.shadowRoot.innerHTML = `
      <style>
        .button {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }
        .button--primary { background-color: #4285f4; color: white; }
        .button--secondary { background-color: #f1f1f1; color: #333; }
        .button--danger { background-color: #ea4335; color: white; }
        .button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
      </style>
      <button class="${buttonClass}" ${disabledAttr}>
        <slot></slot>
      </button>
    `;
  }
}

// カスタム要素の登録
customElements.define('typed-button', TypedButton);
```

## 🔹 Web Componentsの活用のメリット

- **フレームワーク非依存**: どんな環境でも使える
- **再利用性と移植性**: 他プロジェクトにそのまま移植可能
- **カプセル化**: CSSやDOMの影響を外部と切り離せる
- **保守性**: 各コンポーネントが独立して管理可能
- **標準仕様**: 特定のフレームワークやライブラリの寿命に依存しない
- **パフォーマンス**: 軽量かつネイティブに近い実行速度

## 🔹 Web Componentsの活用例

- **マイクロフロントエンド**: 異なるフレームワークで開発されたアプリケーション間での共通UIコンポーネント
- **デザインシステム**: 組織全体で共有される一貫性のあるUIコンポーネントライブラリ
- **サードパーティウィジェット**: 外部サイトに埋め込むウィジェット（チャット、決済フォームなど）
- **PWA（Progressive Web Apps）**: オフライン機能を持つ高性能Webアプリのコンポーネント
- **CMS拡張**: Wordpress、Drupalなどのコンテンツ管理システムのカスタム要素

## 🔹 Web Componentsの開発アプローチ

Web Componentsは以下のようなアプローチで開発できます。

1. **ピュアなVanilla JS/TS** - フレームワークなしで直接Web Components APIを使用
2. **軽量ライブラリの活用** - [Lit](https://lit.dev/)などのヘルパーライブラリを使用
3. **ハイブリッドアプローチ** - 既存のフレームワーク（Angular, React, Vue）と併用

このドキュメントでは主に1つ目のアプローチに焦点を当て、純粋なTypeScriptによる実装を学びます。

## 🔹 注意点と課題

- **ブラウザサポート** - 最新のブラウザはほぼすべて対応していますが、IE11などの古いブラウザでは[ポリフィル](https://github.com/webcomponents/polyfills)が必要
- **アクセシビリティ** - カスタム要素を作る際はWAI-ARIAガイドラインに従う必要あり
- **フォーム統合** - ネイティブフォーム要素との統合には追加の実装が必要
- **SEO対応** - Shadow DOMの内容はデフォルトでクローラーに見えにくいため、SSRなどの対策が必要な場合も

## 🔹 まとめ

Web Componentsは、標準的なWeb技術を用いた再利用可能なUIコンポーネントを作成するための強力な仕組みです。TypeScriptと組み合わせることで、型安全で保守性の高いコンポーネントライブラリを構築できます。フレームワークに依存しない特性により、長期的な技術投資としても価値があります。

このサイトでは、TypeScriptを活用したWeb Componentsの基礎から応用まで、実践的なアプローチで学んでいきます。次のセクションでは、各構成要素の詳細な実装方法について解説します。