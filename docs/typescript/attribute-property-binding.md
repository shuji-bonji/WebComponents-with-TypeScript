---
title: 属性とプロパティのバインディング
description: Web Components における Attribute と Property の違い、同期メカニズム、リフレクティブ属性の実装方法を TypeScript で解説。observedAttributes、getter/setter の活用により型安全なデータバインディングを実現します。
---

# 属性とプロパティのバインディング

Web Components において、**プロパティ (Property)** と **属性 (Attribute)** は要素の状態管理に重要な役割を持ちます。  
しかし、これらは似ているようで異なる特性を持っており、正しく理解することで効率的なデータバインディングが可能になります。  

## 🔹 **プロパティ (Property) と属性 (Attribute) の違い**
| 特徴          | プロパティ (Property)                       | 属性 (Attribute)                    |
|---------------|-------------------------------------------|------------------------------------|
| データ型       | 任意の型が使用可能（オブジェクトも可）          | 文字列のみ                          |
| JavaScript 操作 | `element.propertyName`                     | `element.setAttribute()`           |
| 初期値設定    | クラス定義内で設定                           | HTML 内のタグで設定                 |
| リアクティブ性  | DOM の更新には即時反映される                 | DOM 更新には再レンダリングが必要     |
| 参照方法      | `element.propertyName`                      | `element.getAttribute()`           |

### 📌 **例: プロパティと属性の違い**
```ts
class PropertyAttributeExample extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <p>属性: <span id="attr"></span></p>
      <p>プロパティ: <span id="prop"></span></p>
    `;
  }

  connectedCallback() {
    // 初期化
    this.render();
  }

  static get observedAttributes() {
    return ['data-name'];
  }

  attributeChangedCallback() {
    this.render();
  }

  // プロパティの定義
  get name() {
    return this.getAttribute('data-name');
  }

  set name(value: string | null) {
    if (value) {
      this.setAttribute('data-name', value);
    } else {
      this.removeAttribute('data-name');
    }
  }

  render() {
    this.shadowRoot!.getElementById('attr')!.textContent = this.getAttribute('data-name') ?? '未設定';
    this.shadowRoot!.getElementById('prop')!.textContent = this.name ?? '未設定';
  }
}

customElements.define('property-attribute-example', PropertyAttributeExample);
```

```html
<property-attribute-example data-name="初期値"></property-attribute-example>
```

### 📌 **HTML での操作**
```html
<script>
  const element = document.querySelector('property-attribute-example');
  element.setAttribute('data-name', '属性更新');
  element.name = 'プロパティ更新';
</script>
```

## 🔹 **プロパティと属性の同期**
プロパティと属性は独立していますが、明示的に同期させることが可能です。  
一般的なパターンとして以下があります：

1. **属性変更 → プロパティへ同期**
    - `attributeChangedCallback` 内で同期を行う

2. **プロパティ変更 → 属性へ同期**
    - `set` の中で `setAttribute` を呼び出す

### 📌 **プロパティと属性の同期例**
```ts
class SyncExample extends HTMLElement {
  static get observedAttributes() {
    return ['title'];
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(value: string | null) {
    if (value) {
      this.setAttribute('title', value);
    } else {
      this.removeAttribute('title');
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(`${name} が ${oldValue} から ${newValue} に変更されました`);
  }
}

customElements.define('sync-example', SyncExample);
```

```html
<sync-example title="初期タイトル"></sync-example>

<script>
  const element = document.querySelector('sync-example');
  element.title = "プロパティからの更新"; // 属性も更新される
  element.setAttribute('title', "属性からの更新"); // プロパティも更新される
</script>
```

## 🔹 **リフレクティブ属性 (Reflective Attributes)**
プロパティが変更されたときに自動的に属性へ反映される場合、  
これを **リフレクティブ属性** と呼びます。

- `checked`, `disabled`, `value` などはネイティブにリフレクトされる
- カスタム要素の場合は手動でリフレクトする必要がある

### 📌 **リフレクトの実装**
```ts
class ReflectiveExample extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  get active() {
    return this.hasAttribute('active');
  }

  set active(value: boolean) {
    if (value) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(`リフレクトされた属性 ${name}: ${newValue}`);
  }
}

customElements.define('reflective-example', ReflectiveExample);
```

```html
<reflective-example></reflective-example>

<script>
  const element = document.querySelector('reflective-example');
  element.active = true;   // 属性が追加される
  element.active = false;  // 属性が削除される
</script>
```

## 🔹 **まとめ**
- **プロパティ** は JavaScript 内部のデータで、オブジェクトも保持可能
- **属性** は HTML のデータで、文字列のみ
- `attributeChangedCallback` を使って同期が可能
- Reflective 属性は手動で同期する必要がある

---