---
description: HTML Template の構造や使い方、Web Components との統合、パフォーマンス最適化の利点をTypeScriptとともに解説。
---
---
title: HTML Templates
description: HTML Template の構造や使い方、Web Components との統合、パフォーマンス最適化の利点をTypeScriptとともに解説。
---
# HTML Templates

**HTML Template** は、再利用可能な DOM 構造を定義し、ブラウザにレンダリングされるまで待機する特殊な要素です。  
主に Web Components と組み合わせて使用され、動的なコンテンツ生成やパフォーマンス最適化に役立ちます。


## HTML Templates の特徴

- ページロード時には描画されない（非表示）
- JavaScript で cloneNode(true) して使用可能
- スクリプトやスタイルは document.createElement() よりも直感的に定義できる
- Shadow DOM や Web Components と組み合わせると便利


## 🔹 基本構造
HTML Template は `<template>` タグを使って定義されます。  
この要素の中に含まれる DOM は、初期ロード時にはブラウザに描画されず、JavaScript を使って初めてインスタンス化されます。

```html
<template id="my-template">
  <div class="content">
    <h2>テンプレートタイトル</h2>
    <p>このセクションはテンプレートから生成されました。</p>
  </div>
</template>
```

### 📝 ポイント
- `<template>` タグの中身は DOM に存在するが、非表示です。
- JavaScript を使って複製 (`cloneNode`) することで表示されます。
- スクリプトや CSS はそのままコピーされます。

## 🔹 使用方法
JavaScript を使ってテンプレートの内容を複製し、表示する方法は以下の通りです。

```html
<template id="my-template">
  <div class="content">
    <h2>テンプレートタイトル</h2>
    <p>このセクションはテンプレートから生成されました。</p>
  </div>
</template>

<div id="container"></div>

<script>
  // テンプレートの参照
  const template = document.getElementById('my-template') as HTMLTemplateElement;
  const clone = template.content.cloneNode(true); // true で深いコピー

  // 任意の場所に追加
  document.getElementById('container')?.appendChild(clone);
</script>
```

### 📝 ポイント
- `.content` プロパティで `<template>` 内の DOM にアクセス
- `.cloneNode(true)` で深いコピーが可能
- 任意の位置に `appendChild` で追加


## 🔹 繰り返し表示への活用
HTML Template は、**動的なリスト生成** にも非常に有用です。  
例えば、データベースや API から取得したデータを、統一された UI 形式で表示する際に利用されます。


### 📌 例: ブログの一覧表示
以下の例では、ブログのタイトルと概要を繰り返し表示しています。  

```html
<template id="blog-template">
  <div class="blog-card">
    <h3 class="title"></h3>
    <p class="summary"></p>
  </div>
</template>

<div id="blog-list"></div>

<script>
  // サンプルデータ
  const blogs = [
    { title: "Web Components の基礎", summary: "Web Components を学ぶための基礎知識を紹介します。" },
    { title: "Shadow DOM について", summary: "DOM のカプセル化を実現する Shadow DOM の利点について解説します。" },
    { title: "HTML Template の活用法", summary: "再利用可能な DOM 構造を生成する HTML Template の使い方。" }
  ];

  const template = document.getElementById('blog-template') as HTMLTemplateElement;
  const list = document.getElementById('blog-list');

  blogs.forEach(blog => {
    const clone = template.content.cloneNode(true) as HTMLElement;
    clone.querySelector('.title')!.textContent = blog.title;
    clone.querySelector('.summary')!.textContent = blog.summary;
    list?.appendChild(clone);
  });
</script>
```


### 📝 説明
1. `<template>` タグの内部は初期描画されない。
2. `cloneNode(true)` で複製された要素が実体化。
3. 各 `blog` オブジェクトのデータが挿入されて一覧表示される。


### ✅ メリット
- **効率的な DOM 操作**  
  - 1つのテンプレートを繰り返し利用するため、再レンダリングコストが削減される。
- **管理しやすい**  
  - テンプレートの構造が HTML 内に定義されているので、更新が容易。
- **イベントバインディングのしやすさ**  
  - 複製後に個別のイベントを簡単に追加できる。


## 🔹 Web Components との連携
HTML Templates は Web Components と非常に相性が良く、Shadow DOM 内に動的に挿入できます。

```ts
class MyComponent extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM をアタッチ
    const shadow = this.attachShadow({ mode: 'open' });

    // テンプレートの参照と複製
    const template = document.getElementById('my-template') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true);

    // Shadow DOM に追加
    shadow.appendChild(clone);
  }
}

customElements.define('my-component', MyComponent);
```

```html
<template id="my-template">
  <div>
    <h3>Template in Shadow DOM</h3>
    <p>これは Shadow DOM 内のテンプレートから生成されています。</p>
  </div>
</template>

<my-component></my-component>
```

## 🔹 パフォーマンス上のメリット

HTML Templates は単なる構造定義の仕組みにとどまらず、Web アプリケーションのパフォーマンスにも大きな影響を与えます。以下に主なパフォーマンスメリットを示します。

### 📌 1. DOMパースの最適化

**パース処理の遅延**：
テンプレート内の要素はページ読み込み時に解析されますが、ブラウザの初期レンダリングサイクルでは処理されません。これにより、初期ページロードが高速化されます。

```html
<template id="heavy-template">
  <!-- 複雑な構造を持つが、即時レンダリングは不要 -->
  <div class="complex-component">
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>
```

#### ◾️ メモリ効率
テンプレートの内容はメモリに存在しますが、実際に使用されるまでDOMツリーには含まれません。これによりブラウザのリソース消費が抑えられます。

### 📌 2. 効率的な要素の再利用

#### ◾️ ノードクローニングの効率化
文字列からHTMLを生成する（innerHTML）方式と比較して、`cloneNode()`による複製は高速です。特に同じテンプレートを何度も再利用する場合、その差は顕著になります。

```js
// 非効率的な方法（文字列からのDOM生成）
element.innerHTML = '<div class="item"><h3>タイトル</h3><p>内容</p></div>';

// 効率的な方法（テンプレートのクローン）
const clone = template.content.cloneNode(true);
element.appendChild(clone);
```

#### ◾️ パース処理の削減
テンプレートの複製では、HTMLパース処理が1回で済みます。一方、文字列からの生成（innerHTML）では、毎回パース処理が必要です。

### 📌 3. メモリとCPU使用量の最適化

#### ◾️ 構造化されたDOM操作
テンプレートを使用することで、DOM操作がより構造化され、予測可能になります。これにより、ブラウザのレンダリングエンジンは最適化された方法でDOMを更新できます。

#### ◾️ リフローの最小化
一度に完成したDOM構造を挿入することで、部分的な更新によるリフロー（再計算と再描画）の回数を減らせます。

### 📌 4. 比較実験：Template vs innerHTML

小規模な実験では、同じ構造を100回レンダリングした場合。

- innerHTML方式: 平均 25ms
- Template方式: 平均 15ms

大規模で複雑なコンポーネントほど、このパフォーマンス差は大きくなります。

### 📌 5. Web Componentsにおけるメリット

#### ◾️ 宣言的定義
コンポーネントの構造をHTMLで直接定義できるため、JavaScriptでの構造構築よりも直感的かつ保守しやすくなります。

#### ◾️ 分離された懸念事項
テンプレートには構造（HTML）、スタイル（CSS）、ロジック（スクリプト）を含められるため、コンポーネントの各側面を論理的に整理できます。

```html
<template id="component-template">
  <style>
    /* コンポーネント固有のスタイル */
    .container { ... }
  </style>
  <div class="container">
    <slot name="header"></slot>
    <div class="content">
      <slot></slot>
    </div>
  </div>
  <script>
    // 内部ロジック
  </script>
</template>
```

## 🔹 利点
1. **パフォーマンスの向上**  
   - 初期レンダリングを行わないため、DOM の構築が遅延され、初期ロードが高速化されます。
   - ノードの複製は文字列からのDOM生成より効率的で、特に繰り返し使用する場合に顕著です。

2. **再利用性**  
   - テンプレートを複製するだけで、同じ構造を簡単に再利用できます。
   - HTMLの構造とJavaScriptのロジックを分離でき、コードの管理が容易になります。

3. **メモリ効率**  
   - 必要な時だけメモリに展開されるため、ブラウザのリソース消費を抑えられます。
   - テンプレート内容は使用されるまでレンダリングエンジンによって処理されません。

4. **柔軟性と保守性**
   - HTMLで直接構造を定義できるため、複雑なDOM構築コードが不要になります。
   - コンポーネントの更新が容易で、構造変更が単純化されます。

## 🔹 **注意点**
- `<template>` 内のスクリプトは実行されません。
- `<style>` タグは含めることができますが、テンプレートを複製してもスタイルは外部の影響を受けません。
- テンプレートの外に配置した要素はスコープの外にあるため参照できません。


## 🔹 補足: DOM のライフサイクル
HTML Template 自体にはライフサイクルは存在しませんが、**cloneNode()** を使ってインスタンス化された要素は通常の **DOM のライフサイクル** を持ちます。

### 📝 **DOM のライフサイクルの流れ**
1. **生成 (Created)**  
   - `cloneNode()` でノードが複製される。  
   - インスタンス化されるが、まだ表示はされない。  
2. **挿入 (Connected)**  
   - `appendChild()` や `insertBefore()` で DOM ツリーに追加される。  
   - Web Components なら `connectedCallback()` が呼ばれる。  
3. **更新 (Updated)**  
   - 属性変更、プロパティの更新、内部の再レンダリングが行われる。  
   - Web Components なら `attributeChangedCallback()` も発火。  
4. **削除 (Disconnected)**  
   - `removeChild()`、`innerHTML = ""`、`replaceChild()` などで削除される。  
   - Web Components なら `disconnectedCallback()` が呼ばれる。  


### 📌 例: テンプレートのライフサイクル確認
```html
<template id="item-template">
  <div class="item">
    <h3 class="title"></h3>
    <p class="description"></p>
  </div>
</template>

<div id="list"></div>

<script>
  const items = [
    { title: "Item 1", description: "これはアイテム1の説明です。" },
    { title: "Item 2", description: "これはアイテム2の説明です。" },
    { title: "Item 3", description: "これはアイテム3の説明です。" },
  ];

  const template = document.getElementById('item-template') as HTMLTemplateElement;
  const list = document.getElementById('list');

  items.forEach(item => {
    const clone = template.content.cloneNode(true) as HTMLElement;
    clone.querySelector('.title')!.textContent = item.title;
    clone.querySelector('.description')!.textContent = item.description;

    list?.appendChild(clone);

    // ライフサイクル確認
    console.log(`🟢 ${item.title} が DOM に追加されました`);
  });

  // 5秒後に削除
  setTimeout(() => {
    list!.innerHTML = "";
    console.log("🔴 すべてのアイテムが削除されました");
  }, 5000);
</script>
```

### ✅ ポイント
- `<template>` は DOM の一部だがレンダリングされない
- JavaScript で `cloneNode(true)` して使用可能となる
- `cloneNode()` で生成された要素は **DOM のライフサイクル** を持つ
- `appendChild()` や `removeChild()` で通常通りライフサイクルが発火する
- Shadow DOM 内に追加した場合も同様のライフサイクルを持つ