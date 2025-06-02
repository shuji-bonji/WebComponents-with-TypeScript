---
title: E2Eテスト（End-to-End Testing）
description: Playwright による Web Components の E2E テスト手法を解説。レンダリング、Shadow DOM、コンポーネント間連携の検証例を含む。
---

# E2Eテスト（End-to-End Testing）

このセクションでは、Web Components を対象とした E2E テストの実装方法について解説します。主に [Playwright](https://playwright.dev/) を使用して、実際のブラウザ環境での操作を自動化し、コンポーネントの正しい動作を検証します。


## 1. E2E テストとは？

E2E（End-to-End）テストは、アプリケーション全体をエンドユーザーの視点からシミュレートし、システムの動作を検証する手法です。  
Web Components の場合、カスタム要素の表示、操作、イベント発火が期待通りに動作するかを確認します。


## 2. Playwright のセットアップ

以下のコマンドで Playwright をインストールします。

```bash
npm install -D playwright
```

初期セットアップを行います。

```bash
npx playwright install
```


## 3. 基本的なテストの実装

基本的な E2E テストは以下のように実装できます。

```ts
import { test, expect } from '@playwright/test';

test('WebComponentのレンダリングテスト', async ({ page }) => {
  await page.goto('https://localhost:3000');
  const element = await page.$('my-web-component');
  expect(element).not.toBeNull();
});
```

- `page.goto`: 指定した URL にアクセスします。
- `$`: 要素をセレクタで取得します。


## 4. Shadow DOM のテスト

Shadow DOM 内の要素を取得するには、`shadowRoot` を経由します。

```ts
test('Shadow DOM 内のテキスト確認', async ({ page }) => {
  await page.goto('https://localhost:3000');
  const element = await page.$('my-web-component');
  const shadowContent = await element.evaluate((el) => el.shadowRoot?.querySelector('p')?.textContent);
  expect(shadowContent).toBe('Hello World');
});
```


## 5. 複数コンポーネントの相互作用テスト

複数の Web Components が相互に動作するケースもテストできます。

```ts
test('複数コンポーネントの連携テスト', async ({ page }) => {
  await page.goto('https://localhost:3000');
  const button = await page.$('my-button');
  await button.click();
  const message = await page.$('my-message');
  const text = await message.textContent();
  expect(text).toBe('Button Clicked!');
});
```


## 6. CI/CD への統合

GitHub Actions の例です：

```yaml
name: E2E Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run start &
      - run: npx playwright test
```


## 7. ベストプラクティス

- コンポーネント単位でテストを細かく行う
- Shadow DOM 内部の操作は `evaluate` を使う
- CI/CD の自動テストでフルテストを行う

以上で E2E テストの基本的な実装が完了です。
次のステップとして、複雑な相互作用や動的なイベントの検証を行っていきます。
