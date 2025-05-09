# Web Componentsとは？

**Web Components** とは、HTML・CSS・JavaScript の標準技術だけを使って、**再利用可能な UI コンポーネント**を構築するための仕組みです。


## 🔹 なぜ Web Components なのか？

これまで、Web アプリケーションで UI を部品化するには、各種フレームワーク（React, Angular, Vueなど）に依存する必要がありました。しかし、フレームワークが異なると再利用性に限界があり、メンテナンスや移行が難しくなります。

Web Components はこの課題に対し、**ブラウザに標準搭載された仕組みで UI の再利用を実現する**技術です。


## 🔹 主な構成要素（仕様）

Web Components は次の4つの仕様を中心に構成されています。

|要素|説明|
|---|---|
|[Custom Elements](./custom-elements)|任意の名前で HTML 要素を定義できる仕組み。独自タグ（例：`<my-button>`）を作成可能|
|[Shadow DOM](./shadow-dom)|コンポーネント内部に閉じた DOM ツリーとスタイルスコープを提供し、外部のCSSやJSとの干渉を防義ます。|
|[HTML Templates](./html-templates)|`<template>` 要素によって再利用可能な DOM 構造を定義し、動的に展開可能にする|
|[Slot](./slot)|外部から内部へコンテンツを差し込む透過的な挿入ポイントを提供。Reactの`children`に類似|

> [!NOTE]
> かつては Web Components の 4 本柱の一つとして **ES Modules** が紹介されていましたが、現在では JavaScript の標準として広く普及しています。
> そのため、Web Components 固有の構成要素としては「Slot」が主要なポジションを担うようになりました。
> ただし、Web Components をモジュール化して再利用する場合、`ES Modules` は引き続き重要な技術です。


## 🔹 Web 標準技術としての位置づけ

Web Components は、W3CおよびWHATWGにより標準化された技術であり、最新のブラウザで広くサポートされています。以下は公式リファレンスです。

- [Custom Elements - MDN](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements)
- [Shadow DOM - MDN](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_shadow_DOM)
- [HTML Templates - MDN](https://developer.mozilla.org/ja/docs/Web/HTML/Element/template)
- [Slot - MDN](https://developer.mozilla.org/ja/docs/Web/HTML/Element/slot)


## 🔹 主なメリット

- **フレームワーク非依存**: どんな環境でも使える
- **再利用性と移植性**: 他プロジェクトにそのまま移植可能
- **カプセル化**: CSSやDOMの影響を外部と切り離せる
- **保守性**: 各コンポーネントが独立して管理可能


## 🔹 Web Componentsの活用例

- フレームワーク混在のマイクロフロントエンド
- PWAや軽量なSPAの再利用UI部品
- Design System（社内共通UIパーツ集）
- Markdownや静的サイトに組み込む動的UI


## 🔹 注意点と課題

- 古いブラウザ（IEなど）ではサポートされていません（→ ポリフィルが必要）
- Shadow DOM によるスタイル分離に慣れる必要がある
- 型安全や補完を活かすためには **TypeScriptとの併用が強く推奨**

