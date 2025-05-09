# ES Modules

**ES Modules (ECMAScript Modules)** は、JavaScript の標準的なモジュールシステムです。  
従来の CommonJS や AMD（Asynchronous Module Definition） とは異なり、ネイティブサポートによりブラウザ上で直接動作し、依存関係の管理が簡潔になっています。


## 🔹 基本構文
ES Modules は、ファイルごとにモジュールとして認識され、他のファイルと依存関係を持ちます。  
以下は、基本的なエクスポートとインポートの例です。


### 📌 export 文
外部から使用したい関数やオブジェクトを `export` で公開します。

```ts
// utils.ts
export const sum = (a: number, b: number): number => {
  return a + b;
};

export const multiply = (a: number, b: number): number => {
  return a * b;
};
```

### 📌 import 文
エクスポートされた関数やオブジェクトは、他のモジュールから `import` で利用できます。

```ts
// main.ts
import { sum, multiply } from './utils';

console.log(sum(5, 3));      // 8
console.log(multiply(5, 3)); // 15
```


## 🔹 デフォルトエクスポート
モジュールは一つのデフォルトエクスポートを持つことができ、  
名前を指定せずにインポートできます。

```ts
// logger.ts
const logMessage = (message: string): void => {
  console.log(`LOG: ${message}`);
};

export default logMessage;
```

```ts
// main.ts
import logMessage from './logger';

logMessage("Hello, ES Modules!"); // LOG: Hello, ES Modules!
```


## 🔹 再エクスポート
複数のモジュールをまとめて再エクスポートすることが可能です。

```ts
// math.ts
export * from './utils';
export { default as logMessage } from './logger';
```

```ts
// main.ts
import { sum, multiply, logMessage } from './math';

sum(10, 20);         // 30
multiply(10, 20);    // 200
logMessage("Success!"); // LOG: Success!
```


## 🔹 動的インポート
ES Modules では、条件に応じて動的にモジュールを読み込むことが可能です。  
この方法は非同期処理として動作し、必要な時だけモジュールを取得します。

```ts
// main.ts
const loadModule = async () => {
  const { sum } = await import('./utils');
  console.log(sum(5, 7)); // 12
};

loadModule();
```

### 特徴
- `import()` は Promise を返す。
- 実行時に動的にロードされるため、初期ロードのパフォーマンス向上につながる。


## 🔹 ES Modules の利点
1. **ネイティブサポート**  
   - ブラウザ、Node.js ともに標準対応

2. **スコープの分離**  
   - モジュールは独自のスコープを持つため、グローバルな汚染がない

3. **遅延ロード**  
   - 必要な時にモジュールを取得できる（Dynamic Import）

4. **ツリ―シェイキング対応**  
   - 使用されていないエクスポートは自動的に削除される


## 🔹 Web Components との相性
Web Components を ES Modules と一緒に使用することで、  
独立したカプセル化されたコンポーネントを効率的に管理できます。

### 📌 **例: Web Components の登録**
```ts
// my-component.ts
export class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<p>Hello, Web Component!</p>`;
  }
}

customElements.define('my-component', MyComponent);
```

```ts
// main.ts
import { MyComponent } from './my-component';

document.body.appendChild(new MyComponent());
```


## 🔹 まとめ
- ES Modules は標準的なモジュール管理方法
- モジュールの独立性を保ちつつ再利用可能
- 動的インポートによりパフォーマンス最適化も可能
- Web Components との相性も良い
