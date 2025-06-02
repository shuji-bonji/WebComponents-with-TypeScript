---
title: Unit Test（単体テスト）
description: Web Components のユニットテストを Vitest および Web Test Runner を用いて実装する方法と選定基準を解説。
---
# Unit Test

Web Components のユニットテストを行うために、`Vitest` と `Web Test Runner` の両方のテスト手法を採用しています。  
各テストツールは、用途に応じて適切に選択できます。

## Vitest を使ったユニットテスト
`Vitest` は、Vite と統合された高速なテストランナーです。  
Vite の開発サーバー上で実行されるため、DOM の操作や Shadow DOM のテストがシームレスに行えます。

### サンプルコード
#### sample-component.ts
```typescript
export class SampleComponent extends HTMLElement {
  static get observedAttributes() {
    return ['message'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<p>Hello, World!</p>`;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'message') {
      this.shadowRoot!.querySelector('p')!.textContent = newValue;
    }
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

  it('初期状態で "Hello, World!" と表示されること', () => {
    const p = element.shadowRoot!.querySelector('p');
    expect(p?.textContent).toBe('Hello, World!');
  });

  it('属性が変更された場合、内容が更新されること', () => {
    element.setAttribute('message', 'Hello, Vitest!');
    const p = element.shadowRoot!.querySelector('p');
    expect(p?.textContent).toBe('Hello, Vitest!');
  });
});
```


## Web Test Runner を使ったユニットテスト
`Web Test Runner` は、ブラウザネイティブな動作をテストするためのツールです。  
実際のブラウザ上で動作するため、リアルな DOM 操作や CSS の動作確認が可能です。

### サンプルコード
#### sample-component.ts
```typescript
export class SampleComponent extends HTMLElement {
  static get observedAttributes() {
    return ['message'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<p>Hello, World!</p>`;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'message') {
      this.shadowRoot!.querySelector('p')!.textContent = newValue;
    }
  }
}

customElements.define('sample-component', SampleComponent);
```

#### sample-component.test.ts
```typescript
import { fixture, expect, html } from '@open-wc/testing';
import './sample-component';

describe('SampleComponent', () => {
  it('初期状態で "Hello, World!" と表示されること', async () => {
    const el = await fixture(html`<sample-component></sample-component>`);
    const p = el.shadowRoot!.querySelector('p');
    expect(p?.textContent).to.equal('Hello, World!');
  });

  it('属性が変更された場合、内容が更新されること', async () => {
    const el = await fixture(html`<sample-component message="Hello, Web Test Runner!"></sample-component>`);
    const p = el.shadowRoot!.querySelector('p');
    expect(p?.textContent).to.equal('Hello, Web Test Runner!');
  });
});
```

## 選定基準
| テストフレームワーク  | 特徴                                      | 用途                               |
|------------------|-----------------------------------------|----------------------------------|
| **Vitest**     | Vite に統合された超高速テストランナー。Shadow DOM の操作が容易。 | ロジックテスト、軽量なユニットテスト |
| **Web Test Runner** | 実ブラウザで実行し、レンダリング結果も確認可能。                 | UI の確認、スタイルの検証          |


**参考リポジトリ**
- Vitest: [typescript-webcomponents-starter-kit](https://github.com/shuji-bonji/typescript-webcomponents-starter-kit)
- Web Test Runner: [typescript-webcomponents-web-test-runner](https://github.com/shuji-bonji/typescript-webcomponents-web-test-runner)
