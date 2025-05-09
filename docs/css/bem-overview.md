# BEM概要と実践パターン

BEM（Block Element Modifier）は、CSSの命名規則として広く採用されているメソドロジーで、コンポーネント指向のWebデザインにおいて特に効果を発揮します。Web Componentsと組み合わせることで、さらに強力な開発体験が得られます。

## 🔹 BEMの基本概念

BEMは3つの主要コンセプトから構成されています。

| 要素 | 説明 | 例 |
|---|---|---|
| **Block** | 独立して意味を持つUI部品。再利用可能なコンポーネント単位 | `.card`, `.navbar`, `.button` |
| **Element**  | Blockの一部として機能し、独立しては存在できない要素 | `.card__title`, `.navbar__item`, `.button__icon` |
| **Modifier** | BlockまたはElementの見た目や振る舞いのバリエーション  | `.card--featured`, `.button--primary`, `.navbar__item--active` |

## 🔹 命名規則の詳細

BEMの命名規則は、以下のフォーマットで記述します。

```
.block{}
.block__element{}
.block--modifier{}
.block__element--modifier{}
```

### 📌 Block (ブロック)
- 機能的に独立した意味を持つコンポーネント
- プレフィックスなしで直接命名
- キャメルケースや複数単語の場合はハイフンで区切る

```css
.search-form {
  /* スタイル */
}

.user-profile {
  /* スタイル */
}
```

### 📌 Element (要素)
- Blockに属する子要素
- 「__」（ダブルアンダースコア）でBlockと接続
- Elementは常にBlockの一部であり、Blockからは分離できない

```css
.search-form__input {
  /* スタイル */
}

.user-profile__avatar {
  /* スタイル */
}
```

### 📌 Modifier (修飾子)
- BlockやElementの状態・バリエーション
- 「--」（ダブルハイフン）で接続
- 基本的なスタイルに対する変更のみを担当

```css
.button--primary {
  /* スタイル */
}

.search-form__button--disabled {
  /* スタイル */
}
```

## 🔹 BEMの実践パターン

### 📌 基本的な使用パターン

```html
<div class="card">
  <h2 class="card__title">カードのタイトル</h2>
  <p class="card__content">カードの内容...</p>
  <button class="card__button card__button--primary">詳細を見る</button>
</div>
```

```css
.card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
}

.card__title {
  font-size: 18px;
  margin-bottom: 8px;
}

.card__content {
  color: #666;
  margin-bottom: 16px;
}

.card__button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}

.card__button--primary {
  background-color: #007bff;
  color: white;
}
```

### 📌 複数の修飾子を持つ要素

複数の修飾子を組み合わせることもできます。

```html
<button class="button button--large button--primary">送信する</button>
```

```css
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}

.button--large {
  padding: 12px 24px;
  font-size: 16px;
}

.button--primary {
  background-color: #007bff;
  color: white;
}
```

### 📌 ネストされたブロック

ブロック内にブロックが存在する場合（ネスト）、階層構造を作らないことがBEMの特徴です。

```html
<div class="card">
  <div class="user-profile">
    <img class="user-profile__avatar" src="avatar.jpg">
    <span class="user-profile__name">ユーザー名</span>
  </div>
  <p class="card__content">コンテンツ...</p>
</div>
```

```css
/* 各ブロックは独立して定義 */
.card {
  padding: 16px;
  border: 1px solid #ddd;
}

.card__content {
  margin-top: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-profile__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.user-profile__name {
  margin-left: 8px;
}
```

## 🔹 Web Componentsでの効果的なBEM活用

Shadow DOMを使用するWeb Componentsでは、BEMの利点をさらに活かすことができます。Shadow DOM内でスコープが分離されるため、Block名はコンポーネントの内部でのみ有効となります。

### 📌 Shadow DOM内でのBEM

```typescript
class UserCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    shadow.innerHTML = `
      <style>
        /* Block */
        .user-card {
          display: flex;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        /* Elements */
        .user-card__avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
        }
        
        .user-card__info {
          margin-left: 16px;
        }
        
        .user-card__name {
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 8px 0;
        }
        
        .user-card__role {
          color: #666;
          margin: 0;
        }
        
        /* Modifiers */
        .user-card--premium .user-card__name {
          color: #ffc107;
        }
      </style>
      
      <div class="user-card ${this.hasAttribute('premium') ? 'user-card--premium' : ''}">
        <img class="user-card__avatar" src="${this.getAttribute('avatar') || 'default.jpg'}">
        <div class="user-card__info">
          <h3 class="user-card__name">${this.getAttribute('name') || 'ユーザー名'}</h3>
          <p class="user-card__role">${this.getAttribute('role') || '役職なし'}</p>
        </div>
      </div>
    `;
  }
}

customElements.define('user-card', UserCard);
```

```html
<!-- 通常のユーザーカード -->
<user-card name="山田太郎" role="開発者" avatar="yamada.jpg"></user-card>

<!-- プレミアムユーザーカード -->
<user-card name="佐藤花子" role="デザイナー" avatar="sato.jpg" premium></user-card>
```

### 📌 Host要素とBEMの組み合わせ

Shadow DOM内では、`:host`疑似クラスを使ってホスト要素自体にスタイルを適用できます。BEMの考え方と組み合わせることで、より一貫性のあるスタイリングが可能になります。

```typescript
class ToggleSwitch extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        /* ホスト要素(Block)のスタイル */
        :host {
          display: inline-block;
          font-family: sans-serif;
        }
        
        /* 修飾子によるホスト要素のバリエーション */
        :host(.toggle--large) .toggle__slider {
          width: 60px;
          height: 34px;
        }

        :host(.toggle--large) .toggle__slider--checked:before {
          transform: translateX(24px);
        }

        :host(.toggle--large) .toggle__slider:before {
          position: absolute;
          content: "";
          height: 28px;
          width: 28px;
          top: 3px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          border-radius: 50%;
          transition: .4s;
        }
        
        :host(.toggle--disabled) {
          opacity: 0.5;
          pointer-events: none;
        }
        
        /* Block内のElement */
        .toggle__container {
          position: relative;
          display: inline-block;
        }
        
        .toggle__slider {
          position: relative;
          display: block;
          width: 40px;
          height: 24px;
          background-color: #ccc;
          border-radius: 34px;
          transition: .4s;
        }
        
        .toggle__slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          border-radius: 50%;
          transition: .4s;
        }
        
        /* Element Modifierの組み合わせ */
        .toggle__slider--checked {
          background-color: #2196F3;
        }
        
        .toggle__slider--checked:before {
          transform: translateX(16px);
        }
      </style>
      
      <div class="toggle__container">
        <span class="toggle__slider ${
          this.hasAttribute('checked') ? 'toggle__slider--checked' : ''
        }"></span>
      </div>
    `;

    // トグル機能の実装
    const slider = shadow.querySelector('.toggle__slider');
    slider?.addEventListener('click', () => {
      slider.classList.toggle('toggle__slider--checked');
      this.toggleAttribute('checked');
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { checked: this.hasAttribute('checked') },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define('toggle-switch', ToggleSwitch);

```

```html
<!-- 通常のトグルスイッチ -->
<toggle-switch></toggle-switch>

<!-- 大きめのトグルスイッチ -->
<toggle-switch class="toggle--large"></toggle-switch>

<!-- 無効化されたトグルスイッチ -->
<toggle-switch class="toggle--disabled"></toggle-switch>
```

## 🔹 BEMの高度な使い方

### 📌 Mix（ミックス）パターン

複数のブロックの性質を持つ要素を表現する場合、クラスを併記します。

```html
<div class="card user-profile">
  <!-- カードかつユーザープロファイルとしての性質を持つ -->
</div>
```

### 📌 ベーステーマとバリエーション

#### 共通のコンポーネントに対して異なるテーマを適用する場合

```html
<div class="button button--theme-dark button--size-large">
  ダークテーマのボタン
</div>
```

```css
.button {
  /* 共通のボタンスタイル */
}

.button--theme-dark {
  background-color: #333;
  color: #fff;
}

.button--theme-light {
  background-color: #f0f0f0;
  color: #333;
}

.button--size-large {
  padding: 12px 24px;
  font-size: 16px;
}
```

### 📌 状態変化の表現

要素の状態変化をModifierで表現することで、JavaScriptとの連携がしやすくなります。

```html
<div class="dropdown">
  <button class="dropdown__toggle">メニュー</button>
  <ul class="dropdown__menu dropdown__menu--hidden">
    <li class="dropdown__item">項目1</li>
    <li class="dropdown__item dropdown__item--active">項目2</li>
    <li class="dropdown__item">項目3</li>
  </ul>
</div>
```

```javascript
// JavaScriptでの状態操作
const toggle = document.querySelector('.dropdown__toggle');
const menu = document.querySelector('.dropdown__menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('dropdown__menu--hidden');
});
```

## 🔹 BEMの長所と短所

| ✅ 長所                              | ⚠️ 短所                              |
| -------------------------------- | -------------------------------- |
| 明確な構造化で読みやすい            | 複雑なコンポーネントではクラス名が長くなる |
| スコープが分離され、名前衝突がない  | HTMLが冗長に見える場合がある             |
| 再利用性が高く、メンテナンスが容易   | 学習コストが高く、初学者には難しく見える     |
| Shadow DOM と相性が良い           | 過剰な分類を行うと、CSS が複雑になる       |

## 🔹 Web Componentsとの補完関係

BEMとWeb Componentsは互いの短所を補完する関係にあります。

| Web Componentsの特性 | BEMの補完点 |
|-------------------|------------|
| Shadow DOMによるスコープ分離 | クラス命名の衝突回避が不要に |
| 再利用可能なコンポーネント | 内部構造の統一された命名 |
| カスタム要素の自己完結性 | 要素間の関係性を明示 |

### 📌 実装方針

1. **Shadow DOM内でのBEM**
   - Shadow DOM内部でBEMを使用し、内部構造を整理
   - コンポーネント内部のスタイル管理に使用

2. **Light DOMでのBEM**
   - 全体のレイアウトや複数コンポーネントの関係性を表現
   - コンポーネント間の位置関係やバリエーションを管理

## 🔹 まとめ：BEMの思想とWeb Componentsの統合

BEMは単なる命名規則以上に、**コンポーネント指向の設計思想**を反映しています。Web Componentsと組み合わせることで、その思想をより強力に実装できます。

- **独立性と再利用性**: BEMの「Block」概念とWeb Componentsの「Custom Element」は共通の目標を持つ
- **構造の明確化**: Shadow DOM内でもBEMを使うことで、DOM構造の意図が明確になる
- **変更容易性**: 修飾子(Modifier)によって状態やバリエーションを管理しやすくなる

最終的に、BEMとWeb Componentsを組み合わせることで、**メンテナンス性に優れた拡張しやすいUI設計**が可能になります。特にチーム開発において、一貫性のある命名規則と独立したコンポーネント設計は大きな価値をもたらします。