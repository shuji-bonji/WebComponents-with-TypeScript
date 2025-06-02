---
title: Shadow DOM のテスト
description: Web Components における Shadow DOM 内部のテスト手法を、要素取得・スロット検証・スタイル構造などの観点から紹介。
---
# Shadow DOM のテスト

Shadow DOM 内部の要素のテストを行うには、通常の DOM と異なる注意点があります。Shadow DOM は外部から直接アクセスできないため、テストには特別な方法が必要です。

## 1️⃣ 基本的なテスト方法

以下の例では、Shadow DOM 内の要素を正しく取得し、値を検証しています。

#### sample-component.ts
```typescript
export class SampleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <p id="message">Hello, Shadow DOM!</p>
    `;
  }
}
customElements.define('sample-component', SampleComponent);
```

#### sample-component.test.ts
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import type { SampleComponent } from './sample-component';

describe('SampleComponent', () => {
  let element: SampleComponent;

  beforeEach(() => {
    document.body.innerHTML = `<sample-component></sample-component>`;
    element = document.querySelector('sample-component') as SampleComponent;
  });

  it('Shadow DOM 内の要素が正しく取得できること', () => {
    const p = element.shadowRoot!.querySelector('#message');
    expect(p?.textContent).toBe('Hello, Shadow DOM!');
  });
});
```

## 2️⃣ Shadow DOM のスコープ検証
Shadow DOM 内のスタイルやスコープもテストできます。例えば、スタイルの適用が正しいかどうかを確認します。

#### styled-component.ts
```typescript
export class StyledComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        p {
          color: red;
        }
      </style>
      <p id="styled-message">Styled Text</p>
    `;
  }
}
customElements.define('styled-component', StyledComponent);
```

#### styled-component.test.ts
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StyledComponent } from './styled-component';

// カスタム要素が登録済みかをチェック
if (!customElements.get('styled-component')) {
  customElements.define('styled-component', StyledComponent);
}

describe('StyledComponent', () => {
  let element: StyledComponent;

  beforeEach(() => {
    // 直接インスタンス化する
    element = new StyledComponent();
    document.body.appendChild(element);
    
    // コンポーネントの初期化を待つ
    return new Promise(resolve => setTimeout(resolve, 0));
  });

  it('Shadow DOMが存在すること', () => {
    expect(element.shadowRoot).not.toBeNull();
  });

  it('Shadow DOM内の要素が正しいこと', () => {
    const p = element.shadowRoot?.querySelector('#styled-message');
    expect(p).not.toBeNull();
    expect(p?.textContent).toBe('Styled Text');
  });

  // スタイルについては直接検証が難しいので、構造のみ検証
  it('スタイル要素が存在すること', () => {
    const style = element.shadowRoot?.querySelector('style');
    expect(style).not.toBeNull();
  });

  afterEach(() => {
    document.body.removeChild(element);
  });
});
```

## 3️⃣ Slots のテスト
Shadow DOM 内に `<slot>` を使ってスロット化された要素も検証できます。

#### slotted-component.ts
```typescript
export class SlottedComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <slot></slot>
    `;
  }
}
customElements.define('slotted-component', SlottedComponent);
```

#### slotted-component.test.ts
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import './slotted-component';

describe('SlottedComponent', () => {
  let element: SlottedComponent;

  beforeEach(() => {
    document.body.innerHTML = `<slotted-component><p>Slot Content</p></slotted-component>`;
    element = document.querySelector('slotted-component') as SlottedComponent;
  });

  it('スロット内の要素が正しく表示されること', () => {
    const slotContent = element.querySelector('p');
    expect(slotContent?.textContent).toBe('Slot Content');
  });
});
```

## ✅ まとめ
- Shadow DOM 内の要素は通常の DOM 操作とは異なり、`shadowRoot` を経由してアクセス。
- Scoped CSS の検証も可能。
- Slots の内容もテスト対象に含められる。

**参考:**  
- [シャドウ DOM の使用](https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_shadow_DOM)