# なぜ TypeScript で Web Components を学ぶのか？

Web Components は、独立した UI コンポーネントを作成し、再利用性やカプセル化を提供する強力な技術です。  
しかし、純粋な JavaScript だけで開発すると、次のような問題に直面することがあります。

## 🔹 JavaScript の課題
1. **型安全性の欠如**
   - JavaScript は動的型付けの言語であり、実行時まで型の不整合が検出されない
   - プロパティやメソッドの存在を事前に保証できない

   ```js
   // JavaScript の例
   const user = { name: "Alice" };
   console.log(user.age); // undefined
   ```

2. **コードの可読性と保守性**
   - 大規模なアプリケーションになると、依存関係やメソッドの用途が不明確になる
   - 関数の戻り値や引数の型が曖昧なため、エディター補完が十分に機能しない

   ```js
   // JavaScript の関数
   function add(a, b) {
     return a + b; // 型チェックがないため、予期せぬエラーが発生する可能性
   }
   add(10, "20"); // "1020"
   ```

3. **IDE のサポートが限定的**
   - 型推論がないため、エディターの補完や警告が限定的
   - インターフェースの自動生成や構造の解析が難しい

## 🔹 TypeScript の強み
TypeScript は JavaScript のスーパーセットとして設計され、以下の特長を提供します。

### 📌 型安全性
コンパイル時に型チェックを行うため、実行前に多くのエラーを検知できます。  
コードの信頼性が向上し、リファクタリングも安全に行えます。

```ts
// TypeScript の例
type User = {
  name: string;
  age: number;
};

const user: User = { name: "Alice", age: 25 };
console.log(user.age); // 25
```

### 📌 コードの予測性
メソッドやプロパティの型定義が明確なため、開発中の補完機能が強力になります。

```ts
// 補完機能が有効
user.age = "twenty"; // ❌ エラー: string は number に代入できません
```

### 📌 IDE の強力なサポート
- VSCode などの IDE では型推論が効き、開発効率が向上
- インテリセンスにより、メソッドの引数や戻り値が自動的に表示される

### 📌 リファクタリングの容易さ
- プロパティ名の変更やメソッドのシグネチャ変更も自動補完
- 依存関係がすべて型で解決されるため、影響範囲が明確

```ts
// プロパティ名の変更例
type User = {
  firstName: string;
  lastName: string;
};

const user: User = { firstName: "Alice", lastName: "Smith" };
user.firstName = "Bob"; // 自動補完が効く
```

## 🔹 Web Components 開発との相性
Web Components の開発において、TypeScript の型安全性は非常に強力です。

1. **Custom Elements の定義**  
   - クラスベースのコンポーネント定義が自然に行える
   - Shadow DOM の型定義もサポートされる

   ```ts
   class MyComponent extends HTMLElement {
     constructor() {
       super();
       const shadow = this.attachShadow({ mode: "open" });
       shadow.innerHTML = `<p>Hello, TypeScript!</p>`;
     }
   }

   customElements.define("my-component", MyComponent);
   ```

2. **イベントの型定義**
   - カスタムイベントや標準イベントも型で管理できる

   ```ts
   const event = new CustomEvent<string>("my-event", {
     detail: "Hello World"
   });

   document.addEventListener("my-event", (e: CustomEvent<string>) => {
     console.log(e.detail); // "Hello World"
   });

   document.dispatchEvent(event);
   ```

3. **属性の型付け**
   - プロパティと属性の同期を型安全に行える

   ```ts
   class MyInput extends HTMLElement {
     static get observedAttributes() {
       return ["value"];
     }

     get value(): string {
       return this.getAttribute("value") ?? "";
     }

     set value(newValue: string) {
       this.setAttribute("value", newValue);
     }
   }

   customElements.define("my-input", MyInput);
   ```

## 🔹 TypeScriptによる Web Components の具体的なメリット

### 📌 属性と型の連携
HTML属性からTypeScriptの型へ安全な変換を保証できます。不正な値が設定された場合、コンパイル時に検出可能です。

```typescript
// 属性の型安全な使用例
class SizeComponent extends HTMLElement {
  // リテラル型で明示的に許容値を定義
  get size(): 'small' | 'medium' | 'large' {
    const size = this.getAttribute('size');
    return (size === 'small' || size === 'large') ? size : 'medium';
  }
  
  connectedCallback() {
    // 型に基づいたスタイル適用
    this.classList.add(`size-${this.size}`);
  }
}
```

### 📌 イベントの型定義
カスタムイベントにも詳細な型付けが可能になり、イベントデータの構造が明確になります。利用側でも型の恩恵を受けられます。

```typescript
// 型付きカスタムイベント
interface ToggleEventDetail {
  checked: boolean;
  timestamp: number;
}

class ToggleSwitch extends HTMLElement {
  private toggleState() {
    const isChecked = this.hasAttribute('checked');
    
    // イベント発火
    this.dispatchEvent(new CustomEvent<ToggleEventDetail>('toggle', {
      detail: { 
        checked: !isChecked,
        timestamp: Date.now() 
      },
      bubbles: true
    }));
    
    // 状態の更新
    if (isChecked) {
      this.removeAttribute('checked');
    } else {
      this.setAttribute('checked', '');
    }
  }
}

// イベントリスナー側での型安全な受け取り
document.querySelector('toggle-switch')?.addEventListener('toggle', 
  (e: CustomEvent<ToggleEventDetail>) => {
    console.log(`状態: ${e.detail.checked}, 時刻: ${e.detail.timestamp}`);
  }
);
```

### 📌 Shadow DOMの型付け
Shadow DOM内の要素に対しても型安全な操作が可能となり、要素の存在チェックや型キャストが簡潔に記述できます。

```typescript
// Shadow DOM内の要素への型安全なアクセス
class TypedComponent extends HTMLElement {
  private updateButton(label: string): void {
    const button = this.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    
    if (button) {
      button.textContent = label;
      button.addEventListener('click', this.handleClick);
    } else {
      console.warn('Button element not found in shadow DOM');
    }
  }
  
  private handleClick = (e: MouseEvent): void => {
    // 型付きのイベントオブジェクト
    const target = e.currentTarget as HTMLButtonElement;
    console.log(`Button clicked: ${target.textContent}`);
  }
}
```

### 📌 継承と合成を活用した再利用可能なコンポーネント
抽象クラスやインターフェースを使った基底コンポーネントの作成により、共通の機能をベースクラスに集約し、派生クラスで拡張できます。

```typescript
// 基本的なフォーム要素の抽象クラス
abstract class BaseFormElement extends HTMLElement {
  abstract validate(): boolean;
  abstract getValue(): string;
  
  // 共通メソッド
  reportValidity(): void {
    const isValid = this.validate();
    
    if (!isValid) {
      this.classList.add('invalid');
      this.dispatchEvent(new CustomEvent('invalid', {
        bubbles: true
      }));
    } else {
      this.classList.remove('invalid');
    }
  }
}

// 具体的な実装
class CustomInput extends BaseFormElement {
  validate(): boolean {
    const input = this.shadowRoot?.querySelector('input');
    // 具体的な検証ロジック
    return input?.value.length > 0 ?? false;
  }
  
  getValue(): string {
    return this.shadowRoot?.querySelector('input')?.value || '';
  }
  
  // 独自の追加機能
  clear(): void {
    const input = this.shadowRoot?.querySelector('input');
    if (input) input.value = '';
  }
}

customElements.define('custom-input', CustomInput);
```

## 🔹 まとめ
- TypeScript は Web Components の開発を型安全にし、バグの発生を未然に防ぎます。
- カスタム要素の定義、イベントの管理、属性のバインディングすべてが型で保証されるため、開発効率が向上します。
- 継承や抽象化などのオブジェクト指向パターンを活用して、再利用可能なコンポーネントライブラリを構築できます。
- Shadow DOM内の操作も型安全に行えるため、より堅牢なコンポーネントを実装できます。
- また、リファクタリングも安全かつ効率的に行えるため、大規模プロジェクトでも安心して採用できます。
