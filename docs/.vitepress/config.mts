import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid';

// https://vitepress.dev/reference/site-config
// export default defineConfig({
  export default withMermaid({
  title: "Web Components with TypeScript",
  description: "TypeScript で Web Components を学ぶ",
  base: '/WebComponents-with-TypeScript/',
  lang: 'ja',
  head: [
    // Open Graph
    ['meta', { property: 'og:title', content: 'Web Components with TypeScript' }],
    ['meta', { property: 'og:description', content: 'TypeScript で Web Components' }],
    [
      'meta',
      {
        property: 'og:image',
        content:
          'https://shuji-bonji.github.io/WebComponents-with-TypeScript/images/logo.webp',
      },
    ],
    [
      'meta',
      {
        property: 'og:url',
        content: 'https://shuji-bonji.github.io/WebComponents-with-TypeScript/',
      },
    ],
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Web Components with TypeScript' }],
    ['meta', { name: 'twitter:description', content: 'TypeScript で Web Components' }],
    [
      'meta',
      {
        name: 'twitter:image',
        content:
          'https://shuji-bonji.github.io/WebComponents-with-TypeScript/images/logo.webp',
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'はじめに', link: '/introduction' },
      { text: 'ガイド', link: '/guide' },
    ],

    sidebar: [
      { text: 'はじめに', link: '/introduction' },
      {
        text: '基本知識',
        items: [
          { text: 'WebComponentsとは？', link: '/concepts/webcomponents-overview' },
          { text: 'Custom Elements', link: '/concepts/custom-elements' },
          { text: 'Custom Element のライフサイクル', link: '/concepts/custom-element-lifecycle' }, 
          { text: 'Shadow DOM', link: '/concepts/shadow-dom' },
          { text: 'HTML Templates', link: '/concepts/html-templates' },
          { text: 'Template と Slot の連携', link: '/concepts/template-slot-integration' },
          { text: 'ES Modules', link: '/concepts/es-modules' },
          { text: 'Web標準としての位置づけ', link: '/concepts/standards-position' },
          { text: 'TypeScriptを使う理由とメリット', link: '/concepts/why-typescript' },
        ]
      },
      {
        text: 'TypeScriptで Web Components の実装方法',
        items: [
          { text: 'Web Component の実装フロー', link: '/typescript/webcomponent-implementation-flow' },
          { text: 'Custom Elementsの実装', link: '/typescript/custom-element-implementation' },
          { text: 'ライフサイクルメソッドと型安全なイベント処理', link: '/typescript/lifecycle-and-events' },
          { text: 'Shadow DOM構造をTSで記述', link: '/typescript/shadow-dom-in-ts' },
          { text: '属性とプロパティのバインディング', link: '/typescript/attribute-property-binding' },
          { text: 'slotsとcontentの投影', link: '/typescript/slots-and-projection' },
        ]
      },
      {
        text: 'CSS設計とベストプラクティス',
        items: [
          { text: 'BEM（Block Element Modifier）設計の基本', link: '/css/bem-overview' },
          { text: 'Scoped CSS と Shadow DOM', link: '/css/scoped-css-shadow-dom' },
          { text: 'CSS Variables を用いたテーマ管理', link: '/css/css-variables-theming' },
          { text: 'Web Components と Atomic Design の連携', link: '/css/atomic-design-with-webcomponents' },
        ]
      },
      {
        text: 'ユースケース別パターン集',
        items: [
          { text: '入力部品（<ts-input>）', link: '/patterns/ts-input' },
          { text: 'ボタン／トグル（<ts-toggle>）', link: '/patterns/ts-toggle' },
          { text: '状態を持つ部品とステート管理', link: '/patterns/stateful-components' },
          { text: 'ストリーム連携（RxJSとの統合）', link: '/patterns/rxjs-integration' },
          { text: 'イベント発火とカスタムイベントの型定義', link: '/patterns/custom-events' },
        ]
      },
      {
        text: 'テストとデバッグ',
        items: [
          { text: 'Unit Test（Jest / Web Test Runner）', link: '/testing/unit-testing' },
          { text: 'Shadow DOM内の要素テスト', link: '/testing/shadow-dom-testing' },
          { text: 'E2Eテスト事例（Playwrightなど）', link: '/testing/e2e-testing' },
        ]
      },
      {
        text: '実践アーキテクチャ',
        items: [
          { text: 'PWAとの連携（Service Worker含む）', link: '/architecture/pwa-integration' },
          { text: 'State管理（VanillaJS or RxJS）', link: '/architecture/state-management' },
          { text: 'Storybookによるドキュメント化', link: '/architecture/storybook-docs' },
          { text: 'デザインとの共存（SCSS / CSS-in-JS）', link: '/architecture/css-strategy' },
          { text: 'Atomic Design と Web Components の連携', link: '/architecture/atomic-design-and-webcomponents' },
        ]
      },
      {
        text: '補足情報',
        items: [
          { text: 'Litなどのライブラリとの比較', link: '/extras/lit-vs-native' },
          { text: '他のframeworkとの共存', link: '/extras/framework-integration' },
          { text: 'ポータビリティとWeb標準主義', link: '/extras/portability-and-standards' },
          { text: 'TSでの属性→プロパティ型変換Tips', link: '/extras/ts-attribute-tips' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shuji-bonji/WebComponents-with-TypeScript' }
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the CC-BY-4.0 license.',
      copyright: 'Copyright © 2025 shuji-bonji',
    },
  },
  sitemap: {
    hostname: 'https://shuji-bonji.github.io/RxJS-with-TypeScript/',
  },
})
