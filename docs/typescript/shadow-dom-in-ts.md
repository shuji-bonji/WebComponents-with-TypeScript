---
title: Shadow DOM の利用と型安全な操作
description: TypeScript を使って Shadow DOM を操作する方法を基礎から解説。open/closed モード、slot、イベント伝播、ライフサイクルとの統合まで網羅。
---


# Shadow DOM の利用と型安全な操作

Shadow DOM は、Web Components の強力な機能の一つで、  
要素の内部構造を外部のスタイルや JavaScript からカプセル化します。  
これにより、外部の影響を受けず、再利用性と安全性の高い UI コンポーネントを構築できます。  


## 🔹 Shadow DOM の基本
Shadow DOM はカプセル化された DOM の一部であり、通常の DOM ツリーとは独立しています。  

### 作成手順

1. 要素のインスタンス生成  
2. `attachShadow` メソッドを使用して Shadow Root を作成  
3. Shadow DOM 内に要素を追加  


### 📌 基本的な実装例
```ts
class MyShadowComponent extends HTMLElement {
  constructor() {
    super();
    // Shadow Root の生成
    const shadow = this.attachShadow({ mode: 'open' });

    // Shadow DOM 内部の構造
    shadow.innerHTML = `
      <style>
        p {
          color: blue;
          font-size: 18px;
        }
      </style>
      <p>これは Shadow DOM 内の要素です。</p>
    `;
  }
}

customElements.define('my-shadow-component', MyShadowComponent);
```

```html
<my-shadow-component></my-shadow-component>
```


### 📌 mode の違い
| モード | 説明                                  | アクセス |
|--------|-------------------------------------|---------|
| `open` | JavaScript から `shadowRoot` にアクセス可能 | ✅ |
| `closed` | `shadowRoot` へのアクセスが封鎖される    | ❌ |


### 📌 Shadow DOM の DOM 操作
Shadow DOM 内部の要素は `shadowRoot.querySelector` でアクセスできます。

```ts
const component = document.querySelector('my-shadow-component') as MyShadowComponent;
const shadowRoot = component.shadowRoot;

if (shadowRoot) {
  const paragraph = shadowRoot.querySelector('p');
  if (paragraph) {
    paragraph.textContent = "更新されました！";
  }
}
```

## 🔹 open モードの Shadow DOM　の作成

```ts
class MyOpenComponent extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM を open モードでアタッチ
    const shadow = this.attachShadow({ mode: 'open' });

    // 内部の HTML 構造を追加
    shadow.innerHTML = `
      <style>
        p {
          color: blue;
        }
      </style>
      <p>これは Shadow DOM 内のテキストです。</p>
    `;
  }
}

// カスタム要素の登録
customElements.define('my-open-component', MyOpenComponent);
```

```html
<my-open-component></my-open-component>
```

## 🔹 closed　モードの Shadow DOM　の作成
```ts
class MyClosedComponent extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM を closed モードでアタッチ
    this.attachShadow({ mode: 'closed' });

    // 内部の HTML 構造を追加
    this.shadowRoot.innerHTML = `
      <style>
        p {
          color: red;
        }
      </style>
      <p>これは Shadow DOM 内のテキストです。</p>
    `;
  }
}

// カスタム要素の登録
customElements.define('my-closed-component', MyClosedComponent);
```

### ポイント
- `mode: 'closed'` にした場合、`shadowRoot` は外部から参照できません。
- DevTools でも中身は見えますが、直接操作はできません。


## 🔹 Shadow DOM の擬似ライフサイクル

Shadow DOM 自体にはネイティブなライフサイクルメソッドは存在しませんが、以下のような **擬似的なライフサイクル** の流れがあります。

| タイミング              | 説明                                                     |
|----------------------|--------------------------------------------------------|
| **attachShadow()**  | Shadow DOM の初期化。Shadow Root が生成される。                   |
| **connectedCallback** | Custom Element の接続時に Shadow DOM 内部の要素が描画される。    |
| **slotchange**      | `<slot>` 内のコンテンツが変更されたときに発火する。            |
| **disconnectedCallback** | Custom Element の切断時に内部の Shadow DOM も破棄される。 |

> [!NOTE]
> Shadow DOM は Custom Elements によって管理され、独自のライフサイクルは持ちません。  
> その代わり、Custom Elements のライフサイクルメソッド (`connectedCallback` など) を通じて Shadow DOM の操作が行われます。

### 📌 例: Shadow DOM の擬似ライフサイクル
以下の例では、Shadow DOM 内の構造が変化した場合にイベントが発生する様子を示します。

```ts
class MyComponent extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM を open モードでアタッチ
    const shadow = this.attachShadow({ mode: 'open' });

    // Shadow DOM 内部の構造
    shadow.innerHTML = `
      <style>
        p {
          color: blue;
        }
      </style>
      <slot></slot>
    `;

    // スロットの変更を検知するイベントリスナー
    shadow.querySelector('slot')?.addEventListener('slotchange', () => {
      console.log('スロットの内容が変更されました');
    });
  }

  connectedCallback() {
    console.log('Custom Element が DOM に追加されました');
  }

  disconnectedCallback() {
    console.log('Custom Element が DOM から削除されました');
  }
}

customElements.define('my-component', MyComponent);
```

```html
<my-component>
  <p>スロットの初期コンテンツ</p>
</my-component>

<script>
  // 2秒後にスロットの内容を変更
  setTimeout(() => {
    const element = document.querySelector('my-component');
    element.innerHTML = '<p>新しいコンテンツ</p>';
  }, 2000);
</script>
```


### 📝 説明
1. `attachShadow()`  
   - Shadow DOM が初期化され、`<slot>` 要素が生成されます。

2. `connectedCallback()`  
   - カスタム要素が DOM に追加された時点で Shadow DOM の内容も表示されます。

3. `slotchange` イベント  
   - `<slot>` の内容が変化した場合に自動で発火します。  
   - コンテンツの挿入や変更も検知します。

4. `disconnectedCallback()`  
   - DOM から削除されると、Shadow DOM 内部も破棄されます。


## 🔹 イベント処理と Shadow DOM
通常のイベントも Shadow DOM 内で発火しますが、  
外部の DOM には伝搬しないデフォルト設定になっています。  
伝搬させたい場合は `composed: true` を指定します。

```ts
class EventShadowComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <button id="fireEvent">イベント発火</button>
    `;

    shadow.getElementById('fireEvent')?.addEventListener('click', () => {
      const event = new CustomEvent('shadow-click', {
        detail: { message: "ボタンがクリックされました" },
        bubbles: true,
        composed: true // <- これで Shadow DOM を越えて伝搬
      });
      this.dispatchEvent(event);
    });
  }
}

customElements.define('event-shadow-component', EventShadowComponent);
```


### 📌 イベントリスナー
外部の DOM からもイベントをキャッチできます。

```html
<event-shadow-component></event-shadow-component>

<script>
  document.addEventListener('shadow-click', (event) => {
    const customEvent = event as CustomEvent<{ message: string }>;
    console.log(customEvent.detail.message); // "ボタンがクリックされました"
  });
</script>
```


## 🔹 Slot の利用
Shadow DOM 内に外部の要素を挿入するために `<slot>` を利用します。

```ts
class SlotComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <div>
        <slot name="header"></slot>
        <p>固定の内容です</p>
        <slot name="footer"></slot>
      </div>
    `;
  }
}

customElements.define('slot-component', SlotComponent);
```

```html
<slot-component>
  <h1 slot="header">ヘッダーの内容</h1><!-- この内容はスロットに挿入されます。 -->
  <footer slot="footer">フッターの内容</footer><!-- この内容はスロットに挿入されます。 -->
</slot-component>
```

### 説明
- `slot-component` の内部に定義された `<slot>` は、Light DOM 内の `<h>`や`footer` 要素を投影します。  
- 投影された内容は Shadow DOM のスコープ内でスタイルが適用されます。

### 📌 表示結果
```
ヘッダーの内容
固定の内容です
フッターの内容
```


## 🔹 まとめ
- Shadow DOM を使うことで外部の影響を受けない安全なコンポーネントを作成できる
- `mode` の違いによって外部からのアクセス可否を切り替え可能
- `composed: true` を使うことでイベントの伝搬も制御可能
- `<slot>` を利用することで外部から内容を動的に注入できる
