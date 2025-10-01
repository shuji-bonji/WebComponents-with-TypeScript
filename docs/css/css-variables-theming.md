---
title: CSS変数とテーマの管理
description: CSS カスタムプロパティ (CSS Variables) を活用した Web Components のテーマ管理手法を解説。Shadow DOM 内外でのスタイル継承、ダークモードの実装、:host 疑似クラスの活用により、柔軟で一貫性のあるテーマ設計を実現します。
---

# CSS 変数とテーマの管理

CSS 変数（カスタムプロパティ）は、CSS のスタイルを動的に変更できる強力な手法です。Web Components と組み合わせることで、テーマの切り替えやダークモードの実装が容易になります。

## 🔹 CSS 変数の基本
CSS 変数は `--` をプレフィックスとして宣言し、`var()` 関数を使って参照します。

```css
/* 変数の定義 */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size: 16px;
}

/* 変数の使用 */
.button {
  background-color: var(--primary-color);
  font-size: var(--font-size);
}

.button--secondary {
  background-color: var(--secondary-color);
}
```

## 🔹 テーマの管理
CSS 変数を活用することで、簡単にテーマの切り替えが可能です。

```css
/* デフォルトテーマ */
:root {
  --background-color: #ffffff;
  --text-color: #333333;
}

/* ダークテーマ */
body.dark-mode {
  --background-color: #1e1e1e;
  --text-color: #ffffff;
}

/* 適用 */
body {
  background-color: var(--background-color);
  color: var(--text-color);
}
```

ボタンのクリックでテーマを切り替える例。

```html
<button onclick="toggleTheme()">テーマ切り替え</button>

<script>
  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
  }
</script>
```

## 🔹 Web Components と CSS 変数
Web Components の Shadow DOM 内でも CSS 変数は有効です。  
`<custom-button>` の例を見てみましょう。

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
          border: none;
          border-radius: 4px;
          font-size: var(--button-font-size, 16px);
        }
      </style>
      <button>クリック</button>
    `;
  }
}

customElements.define('custom-button', CustomButton);
```

グローバルでテーマを切り替えると、Web Component 内部も自動的に更新されます。

```html
<custom-button></custom-button>

<button onclick="document.documentElement.style.setProperty('--button-bg', '#28a745')">
  ボタンの色を変更
</button>
```

## 🔹 グローバルテーマの定義
`--theme-dark` と `--theme-light` を定義しておくことで、どの Web Component でもテーマ変更が反映されます。

```css
:root {
  --theme-primary: #007bff;
  --theme-secondary: #6c757d;
  --theme-background: #ffffff;
  --theme-text: #333333;
}

body.dark-mode {
  --theme-primary: #1e88e5;
  --theme-secondary: #424242;
  --theme-background: #121212;
  --theme-text: #e0e0e0;
}
```

## 🔹 Web Components 内でのテーマ適用
Web Components 内では、`:host` を使ってホスト要素全体のスタイルを適用できます。

```typescript
class ThemedCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--theme-background);
          color: var(--theme-text);
          border: 1px solid var(--theme-primary);
          padding: 16px;
          border-radius: 8px;
        }
      </style>
      <div>
        <h3>タイトル</h3>
        <p>これはテーマ対応のカードです。</p>
      </div>
    `;
  }
}

customElements.define('themed-card', ThemedCard);
```

## 🔹 動的なテーマ切り替え
Web Components 内でも動的なテーマの変更が可能です。

```html
<themed-card></themed-card>
<button onclick="toggleTheme()">テーマ切り替え</button>

<script>
  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
  }
</script>
```

## 🔹 まとめ
- CSS 変数はテーマの管理を簡単にし、Web Components の Shadow DOM 内でも有効
- グローバル変数を使うことで、全体のテーマ統一が可能
- `:host` を使うことで Web Components 内でも外部のテーマを反映
- テーマの切り替えは JavaScript から動的に可能
