# ガイド目次

このページでは、「TypeScript で Web Components を学ぶ」ための学習ガイドの全体像を示します。以下の各セクションは、段階的に理解と実装を深めていくために構成されています。


## 1. 基本知識

- [WebComponentsとは？](./concepts/webcomponents-overview)
- [Custom Elements](./concepts/custom-elements)
- [Custom Element のライフサイクル](./concepts/custom-element-lifecycle) 
- [Shadow DOM](./concepts/shadow-dom)
- [HTML Templates](./concepts/html-templates)
- [Template と Slot の連携](./concepts/template-slot-integration)
- [ES Modules](./concepts/es-modules)
- [Web標準としての位置づけ](./concepts/standards-position)
- [TypeScriptを使う理由とメリット](./concepts/why-typescript)


## 2. TypeScriptで Web Components の実装方法

- [Web Component の実装フロー](./typescript/webcomponent-implementation-flow)
- [Custom Elementsの実装](./typescript/custom-element-implementation)
- [ライフサイクルメソッドと型安全なイベント処理](./typescript/lifecycle-and-events)
- [Shadow DOM構造をTSで記述](./typescript/shadow-dom-in-ts)
- [属性とプロパティのバインディング](./typescript/attribute-property-binding)
<!-- - [props/attributesのバインディングと型変換](./typescript/props-and-attributes) -->
- [slotsとcontentの投影](./typescript/slots-and-projection)


## 3. CSS設計とベストプラクティス
- [BEM（Block Element Modifier）設計の基本](./css/bem-overview)
- [Host-based CSS と Shadow DOM](./css/host-based-css-shadow-dom)
- [Scoped CSS と Shadow DOM](./css/scoped-css-shadow-dom)
- [CSS Variables を用いたテーマ管理](./css/css-variables-theming)

## 4. ユースケース別パターン集

- [入力部品（`<ts-input>`）](./patterns/ts-input)
- [ボタン／トグル（`<ts-toggle>`）](./patterns/ts-toggle)
- [状態を持つ部品とステート管理](./patterns/stateful-components)
- [ストリーム連携（RxJSとの統合）](./patterns/rxjs-integration)
- [イベント発火とカスタムイベントの型定義](./patterns/custom-events)


## 5. テストとデバッグ

- [Unit Test（Vitest / Web Test Runner）](./testing/unit-testing)
- [Shadow DOM内の要素テスト](./testing/shadow-dom-testing)
- [E2Eテスト事例（Playwrightなど）](./testing/e2e-testing)


## 6. 実践アーキテクチャ

<!-- - [PWAとの連携（Service Worker含む）](./architecture/pwa-integration)
- [State管理（VanillaJS or RxJS）](./architecture/state-management)
- [Storybookによるドキュメント化](./architecture/storybook-docs)
- [デザインとの共存（SCSS / CSS-in-JS）](./architecture/css-strategy)
- [Atomic Design と Web Components の統合](./architecture/atomic-design-with-webcomponents) -->


## 7. 補足情報

<!-- - [Litなどのライブラリとの比較](./extras/lit-vs-native)
- [他のframeworkとの共存](./extras/framework-integration)
- [ポータビリティとWeb標準主義](./extras/portability-and-standards)
- [TSでの属性→プロパティ型変換Tips](./extras/ts-attribute-tips) -->