---
title: Atomic Design と Web Components の統合
description: Atomic Design の階層構造 (Atoms, Molecules, Organisms, Templates, Pages) と Web Components を統合した設計手法を解説。Shadow DOM によるカプセル化、BEM との併用、CSS Variables によるテーマ管理、TypeScript による型安全な実装を含む実践的な開発パターンを紹介します。
---

# Atomic Design と Web Components の統合

## はじめに
UI コンポーネント設計において Atomic Design と Web Components の統合は、再利用性と一貫性の高いシステムを構築するのに効果的です。この記事では、TypeScript を活用した実装方法と設計方針について解説します。

## 🔹 基本概念

### Atomic Design の5つの階層
| 階層 | 説明 | Web Components での表現 |
|---|---|---|
| **Atoms（原子）** | 最小単位のUI要素（ボタン、入力フィールドなど） | `<atom-button>`, `<atom-input>` |
| **Molecules（分子）** | Atomsを組み合わせた小さな機能単位 | `<molecule-form-group>`, `<molecule-card>` |
| **Organisms（有機体）** | Moleculesを組み合わせた複雑な機能 | `<organism-header>`, `<organism-footer>` |
| **Templates（テンプレート）** | ページのレイアウト構造 | `<template-page-layout>` |
| **Pages（ページ）** | 実際のコンテンツを持つページ | `<page-home>`, `<page-about>` |

### Web Components の基本概念
Web Components は再利用可能なカスタム要素を作成するための標準技術で、以下の主要技術で構成されます。

- **Custom Elements**: 独自のHTMLタグを定義
- **Shadow DOM**: スタイルと構造をカプセル化
- **HTML Templates**: 再利用可能な構造を定義
- **Slots**: 外部からコンテンツを注入

## 📌 Atoms の実装例
```typescript
// atomic-design/atoms/atom-button.ts
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
                ? 'background-color: var(--primary-color, #0066cc); color: white;'
                : 'background-color: var(--secondary-color, #f0f0f0); color: #333;'
            }
          }
        </style>
        <button><slot>${label}</slot></button>
      `;
    }
  }
}

customElements.define('atom-button', AtomButton);
```
### Atoms　レベルでの利用
```html
<atom-button></atom-button>
<atom-button label="クリアボタン" variant="etc"></atom-button>
```


## 📌 Molecules の実装例
```typescript
// atomic-design/molecules/molecule-search-form.ts
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
            bubbles: true,
            composed: true
          })
        );
      });
    }
  }
}

customElements.define('molecule-search-form', MoleculeSearchForm);
```

### Moleculesレベルでの利用

```html
<molecule-search-form></molecule-search-form>
<script>
  document.addEventListener('search', (value) => {
    console.log(value.detail);
  });
</script>
```

```sh
{query: '入力した値'}
```

## 📌 Organisms の実装例
```typescript
// atomic-design/organisms/organism-header.ts
class OrganismHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--header-bg, #f8f9fa);
          padding: 10px 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
        .nav {
          display: flex;
          gap: 16px;
        }
      </style>
      <header class="header">
        <div class="logo">
          <slot name="logo">ロゴ</slot>
        </div>
        <div class="search">
          <molecule-search-form></molecule-search-form>
        </div>
        <nav class="nav">
          <slot name="nav-items"></slot>
        </nav>
      </header>
    `;
  }
}

customElements.define('organism-header', OrganismHeader);
```

### Organismsレベルでの利用
```html
<organism-header></organism-header>
<script>
  document.addEventListener('search', (value) => {
    console.log(value.detail);
  });
</script>
```

## 📌 Templates の実装例
```typescript
// atomic-design/templates/template-page-layout.ts
class TemplatePageLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        main {
          flex: 1;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
      </style>
      <organism-header>
        <span slot="logo"><slot name="site-logo">サイト名</slot></span>
        <slot name="nav-items" slot="nav-items"></slot>
      </organism-header>
      <main>
        <slot></slot>
      </main>
      <organism-footer>
        <slot name="footer-content" slot="content"></slot>
      </organism-footer>
    `;
  }
}

customElements.define('template-page-layout', TemplatePageLayout);
```

## 📌 Pages の実装例（実際のアプリケーションでの使用例）
```html
<!-- index.html -->
<template-page-layout>
  <img slot="site-logo" src="logo.png" alt="サイトロゴ">
  <atom-button slot="nav-items">ホーム</atom-button>
  <atom-button slot="nav-items">製品</atom-button>
  <atom-button slot="nav-items">お問い合わせ</atom-button>
  
  <h1>ホームページ</h1>
  <p>このページはAtomicデザインとWeb Componentsを活用しています。</p>
  
  <organism-product-list></organism-product-list>
  
  <div slot="footer-content">
    <p>© 2023 Example Company</p>
  </div>
</template-page-layout>
```

## 🔹 CSS 設計とスタイリング戦略

### BEM と Shadow DOM の併用
Shadow DOM ではスコープが分離されるため、BEM（Block Element Modifier）の命名規則を簡略化して使用できます。

```typescript
// Shadow DOM内でのBEM
this.shadowRoot!.innerHTML = `
  <style>
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .card__title {
      font-size: 18px;
    }
    
    .card__content {
      padding: 16px;
    }
    
    .card--featured {
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
  </style>
  <div class="card ${this.hasAttribute('featured') ? 'card--featured' : ''}">
    <h2 class="card__title"><slot name="title">タイトル</slot></h2>
    <div class="card__content">
      <slot>コンテンツがありません</slot>
    </div>
  </div>
`;
```

### CSS Variables による統一的なテーマ管理
グローバルなテーマ変数を定義し、各コンポーネントでそれを参照する方法。

```css
/* theme.css */
:root {
  /* カラーパレット */
  --color-primary: #0066cc;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  
  /* タイポグラフィ */
  --font-size-small: 14px;
  --font-size-medium: 16px;
  --font-size-large: 18px;
  --font-size-xlarge: 24px;
  
  /* スペーシング */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* アニメーション */
  --transition-speed: 0.3s;
}

/* ダークモード */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #4a9eff;
    --color-secondary: #a0a0a0;
    /* 他の変数も同様に定義 */
  }
}
```

このCSSを読み込んで、各Web Componentで利用。

```typescript
render() {
  this.shadowRoot!.innerHTML = `
    <style>
      button {
        background-color: var(--color-primary);
        color: white;
        padding: var(--space-sm) var(--space-md);
        font-size: var(--font-size-medium);
        transition: all var(--transition-speed);
      }
      
      button:hover {
        background-color: var(--color-secondary);
      }
    </style>
    <button><slot></slot></button>
  `;
}
```

## 🔹 効果的なディレクトリ構成

```
/src
├── /components
│   ├── /atoms
│   │   ├── atom-button.ts
│   │   ├── atom-input.ts
│   │   └── atom-icon.ts
│   ├── /molecules
│   │   ├── molecule-form-group.ts
│   │   └── molecule-card.ts
│   ├── /organisms
│   │   ├── organism-header.ts
│   │   └── organism-sidebar.ts
│   └── /templates
│       └── template-page-layout.ts
├── /styles
│   ├── theme.css
│   └── variables.css
├── /utils
│   ├── component-base.ts  // 共通の基底クラス
│   └── event-bus.ts       // コンポーネント間通信
└── index.ts
```

## 🔹 設計指針と実装のベストプラクティス

### 1. 単一責任の原則（SRP）
各コンポーネントは単一の責任を持つべきです。

```typescript
// ✅ 良い例: 単一の責任
class AtomTooltip extends HTMLElement {
  // ツールチップの表示/非表示のみを担当
}

// ❌ 悪い例: 複数の責任
class AtomButtonWithTooltip extends HTMLElement {
  // ボタンの機能とツールチップの両方を管理（責任が複数）
}
```

### 2. コンポーネントの独立性
各コンポーネントは独立して機能し、外部依存を最小限にすべきです。

```typescript
// ✅ 良い例: 独立したコンポーネント
class AtomButton extends HTMLElement {
  render() {
    // 内部でのみ状態を管理
  }
}

// ❌ 悪い例: 外部依存が強い
class DependentButton extends HTMLElement {
  connectedCallback() {
    // グローバル変数や他のコンポーネントに直接依存
    window.appState.registerButton(this);
  }
}
```

### 3. データフロー管理
親から子へのデータの流れを明確にすることで、予測可能なコンポーネント挙動を実現します。

```typescript
// 属性を通じたデータフロー
class MoleculeProductCard extends HTMLElement {
  static get observedAttributes() {
    return ['product-id', 'product-name', 'price'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }
}

// 使用例
document.querySelector('molecule-product-card').setAttribute('product-name', '新製品');
```

### 4. Design Tokens の活用
デザイン値を抽象化して一元管理することで、一貫性のあるUIを構築します。

```typescript
// utils/design-tokens.ts
export const DesignTokens = {
  colors: {
    primary: 'var(--color-primary, #0066cc)',
    secondary: 'var(--color-secondary, #6c757d)'
  },
  spacing: {
    small: 'var(--space-sm, 8px)',
    medium: 'var(--space-md, 16px)'
  }
};

// コンポーネントでの使用
import { DesignTokens } from '../utils/design-tokens';

class AtomButton extends HTMLElement {
  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        button {
          background-color: ${DesignTokens.colors.primary};
          padding: ${DesignTokens.spacing.small} ${DesignTokens.spacing.medium};
        }
      </style>
      <button><slot></slot></button>
    `;
  }
}
```

## 🔹 課題と解決策

### 課題1: Shadow DOM によるスタイル分離の制約
**問題**: Shadow DOM のカプセル化により、グローバルテーマの適用が難しくなる

**解決策**: CSS Variables を活用して、Shadow DOM の境界を越えたスタイリングを実現

```typescript
// グローバルテーマを参照するコンポーネント
class ThemedComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          /* ホスト要素にグローバル変数を適用 */
          background-color: var(--theme-background, white);
          color: var(--theme-text, black);
        }
      </style>
      <div>
        <slot></slot>
      </div>
    `;
  }
}
```

### 課題2: コンポーネント間通信の複雑さ
**問題**: 複数のコンポーネント間でのデータ共有やイベント伝搬が複雑になりがち

**解決策**: イベントバスパターンやカスタムイベントを活用した型安全な通信

```typescript
// utils/event-bus.ts
type EventCallback<T = any> = (data: T) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();
  
  on<T>(event: string, callback: EventCallback<T>): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }
  
  emit<T>(event: string, data: T): void {
    if (!this.events.has(event)) return;
    this.events.get(event)!.forEach(callback => callback(data));
  }
  
  off(event: string, callback?: EventCallback): void {
    if (!callback) {
      this.events.delete(event);
      return;
    }
    
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export const eventBus = new EventBus();

// コンポーネントでの使用
import { eventBus } from '../utils/event-bus';

// 送信側
class SenderComponent extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', () => {
      eventBus.emit('item-selected', { id: 123, name: 'テスト商品' });
    });
  }
}

// 受信側
class ReceiverComponent extends HTMLElement {
  connectedCallback() {
    eventBus.on('item-selected', (data) => {
      console.log(`選択された商品: ${data.name}`);
    });
  }
  
  disconnectedCallback() {
    // コンポーネント削除時にリスナーをクリーンアップ
    eventBus.off('item-selected');
  }
}
```

### 課題3: コンポーネントの境界決定
**問題**: Atom、Molecule、Organismなどの境界が曖昧になりがち

**解決策**: 明確な責任分担と関心事の分離に基づいた基準を設定

```typescript
// コンポーネント境界の基準例
/**
 * Atoms:
 * - 単一の責任を持つ
 * - 他のコンポーネントに依存しない
 * - 入力やアクションなど基本的なUIを表現
 */
class AtomInput extends HTMLElement { /* ... */ }

/**
 * Molecules:
 * - 複数のAtomsを組み合わせる
 * - 特定の機能単位を表現
 * - 内部状態を管理することがある
 */
class MoleculeFormField extends HTMLElement {
  // AtomLabelとAtomInputを組み合わせて、ラベル付きフォームフィールドを作成
}

/**
 * Organisms:
 * - 複数のMoleculesを組み合わせる
 * - 複雑な機能ユニットを表現
 * - ビジネスロジックとの接点を持つことがある
 */
class OrganismLoginForm extends HTMLElement {
  // MoleculeFormFieldを組み合わせてログインフォームを作成
  // ログイン処理のイベント発火なども担当
}
```

## 🔹 モダンな統合アプローチ: Component-Driven Development

Atomic Design と Web Components を効果的に統合するアプローチとして、Component-Driven Development (CDD) を活用できます。

1. **Storybookによるコンポーネントカタログ作成**
   - 各コンポーネントを独立して開発・テスト・ドキュメント化
   - [Storybook for Web Components](https://storybook.js.org/docs/web-components/get-started/introduction)

2. **Design Tokensシステムの構築**
   - 色、サイズ、間隔などのデザイン値を一元管理
   - コードとデザインツール間の一貫性を確保

3. **テストとアクセシビリティの自動化**
   - Jest + Testing Libraryによるコンポーネントテスト
   - axeによるアクセシビリティチェック

## 🔹 まとめ

Atomic Design と Web Components の統合は、以下の利点をもたらします。

- **再利用性**: カプセル化されたコンポーネントの体系的な構築
- **一貫性**: デザインシステムとの緊密な統合
- **保守性**: 明確な責任分離と構造化
- **拡張性**: フレームワークに依存しない標準技術の活用

TypeScript を活用することで、型安全性とコード補完の恩恵も得られ、より堅牢なコンポーネントライブラリの構築が可能になります。

最後に、Web Components と Atomic Design の組み合わせは単なる技術的な選択ではなく、持続可能な UI 開発のための思想と実践です。明確な構造化と標準技術の活用により、長期的なメンテナンス性を確保しつつ、一貫性のあるユーザー体験を提供することができます。
