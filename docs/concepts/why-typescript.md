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

## 🔹 TypeScriptによる Web Components の実践的な例

### 📌 属性と型の連携: 厳格な型チェック付き属性

以下の例では、カスタム要素の属性に厳格な型チェックを適用する方法を示します。

```typescript
// 有効なステータス値をリテラル型として定義
type StatusType = 'success' | 'warning' | 'error' | 'info';

class StatusIndicator extends HTMLElement {
  // 監視する属性を定義
  static get observedAttributes(): string[] {
    return ['status', 'message'];
  }
  
  // プライベートプロパティ
  private _status: StatusType = 'info';
  
  // TypeScriptのゲッターで型安全な属性アクセスを提供
  get status(): StatusType {
    // 属性値を取得し型安全に変換
    const attrValue = this.getAttribute('status');
    // 有効な値のみを許可
    if (attrValue === 'success' || 
        attrValue === 'warning' || 
        attrValue === 'error' || 
        attrValue === 'info') {
      return attrValue;
    }
    // 無効な値の場合はデフォルト値を返す
    return 'info';
  }
  
  // TypeScriptのセッターで型安全な属性設定を提供
  set status(value: StatusType) {
    // 型システムによりvalue引数は有効な値のみ受け付ける
    this._status = value;
    this.setAttribute('status', value);
  }
  
  // メッセージ属性のゲッター/セッター
  get message(): string {
    return this.getAttribute('message') || '';
  }
  
  set message(value: string) {
    this.setAttribute('message', value);
  }
  
  // 属性変更時のコールバック
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    // レンダリングを更新
    this.render();
  }
  
  // コンポーネントがDOMに接続された時
  connectedCallback(): void {
    this.render();
  }
  
  // レンダリングメソッド
  private render(): void {
    // statusプロパティは型安全なため、ここでは有効な値のみを持つ
    const statusClass = `indicator--${this.status}`;
    
    this.innerHTML = `
      <div class="indicator ${statusClass}">
        <span class="indicator__icon"></span>
        <span class="indicator__message">${this.message}</span>
      </div>
    `;
  }
}

customElements.define('status-indicator', StatusIndicator);

// 使用例
const indicator = document.createElement('status-indicator') as StatusIndicator;
indicator.status = 'success'; // ✓ 有効
indicator.message = 'Operation completed!';

// TypeScriptによる型チェック
// indicator.status = 'pending'; // ❌ エラー: 'pending'は StatusType ではありません
```

この例では、`StatusType` という型を使用して、`status` 属性に許可される値を制限しています。TypeScriptは、無効な値が割り当てられようとした場合にコンパイル時にエラーを表示します。

### 📌 複雑なデータ構造を持つ属性の型安全な処理

Webコンポーネントで複雑なデータ構造を扱う場合の型安全な実装例を示します。

```typescript
// ユーザー情報の型定義
interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  lastActive?: Date;
}

class UserCard extends HTMLElement {
  // プライベートフィールド
  private _userData: UserData | null = null;
  
  // 監視する属性
  static get observedAttributes(): string[] {
    return ['user-data'];
  }
  
  // ユーザーデータのゲッター
  get userData(): UserData | null {
    return this._userData;
  }
  
  // ユーザーデータのセッター - 型安全
  set userData(data: UserData | null) {
    this._userData = data;
    
    // データをJSON文字列として属性に保存
    if (data) {
      // Dateオブジェクトを特別に処理
      const serializedData = JSON.stringify(data, (key, value) => {
        if (key === 'lastActive' && value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      this.setAttribute('user-data', serializedData);
    } else {
      this.removeAttribute('user-data');
    }
  }
  
  // 属性が変更された時
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'user-data' && newValue !== oldValue) {
      try {
        // JSON文字列からオブジェクトへ変換
        const parsed = JSON.parse(newValue);
        
        // lastActiveを日付オブジェクトに戻す
        if (parsed.lastActive) {
          parsed.lastActive = new Date(parsed.lastActive);
        }
        
        // 型チェック関数 - ランタイムで型を確認
        if (this.isValidUserData(parsed)) {
          this._userData = parsed;
          this.render();
        } else {
          console.error('Invalid user data structure:', parsed);
        }
      } catch (e) {
        console.error('Failed to parse user-data attribute:', e);
      }
    }
  }
  
  // ランタイム型チェック
  private isValidUserData(data: any): data is UserData {
    return (
      typeof data === 'object' &&
      typeof data.id === 'number' &&
      typeof data.name === 'string' &&
      typeof data.email === 'string' &&
      (data.role === 'admin' || data.role === 'editor' || data.role === 'viewer') &&
      (data.lastActive === undefined || data.lastActive instanceof Date)
    );
  }
  
  connectedCallback(): void {
    this.render();
  }
  
  // レンダリングメソッド
  private render(): void {
    if (!this._userData) {
      this.innerHTML = `<div class="user-card--empty">No user data available</div>`;
      return;
    }
    
    // ユーザーデータを使用して表示
    const roleClass = `user-card__role--${this._userData.role}`;
    const lastActiveFormatted = this._userData.lastActive 
      ? this._userData.lastActive.toLocaleDateString() 
      : 'Never';
    
    this.innerHTML = `
      <div class="user-card">
        <h3 class="user-card__name">${this._userData.name}</h3>
        <div class="user-card__email">${this._userData.email}</div>
        <div class="user-card__role ${roleClass}">${this._userData.role}</div>
        <div class="user-card__activity">Last active: ${lastActiveFormatted}</div>
      </div>
    `;
  }
}

customElements.define('user-card', UserCard);

// 使用例
const userCard = document.createElement('user-card') as UserCard;

// 型安全なオブジェクト設定
userCard.userData = {
  id: 42,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  role: 'admin',
  lastActive: new Date()
};

// 以下はTypeScriptが型エラーを検出
// userCard.userData = {
//   id: 43,
//   name: 'Bob Smith',
//   email: 'bob@example.com',
//   role: 'guest'  // ❌ 'guest'は許可された役割ではありません
// };
```

この例では、複雑なオブジェクト構造を持つ属性を型安全に扱う方法を示しています。TypeScriptのインターフェースを使用して、必要なデータ構造を定義し、静的な型チェックと動的な検証の両方を実装しています。

### 📌 型安全なカスタムイベント

Web Componentsでカスタムイベントを型安全に定義して使用する例です。

```typescript
// イベントデータの型定義
interface SelectEventDetail {
  selectedId: number;
  selectedValue: string;
  multiSelect: boolean;
}

class TypedSelect extends HTMLElement {
  // 選択可能な項目の型
  private _items: Array<{ id: number, value: string }> = [];
  private _multiSelect: boolean = false;
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  // 監視する属性
  static get observedAttributes(): string[] {
    return ['items', 'multi-select'];
  }
  
  // 属性が変更された時
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'items' && newValue !== oldValue) {
      try {
        this._items = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Invalid items JSON:', e);
      }
    } else if (name === 'multi-select') {
      this._multiSelect = newValue !== null;
      this.render();
    }
  }
  
  // 項目をプログラム的に設定
  set items(items: Array<{ id: number, value: string }>) {
    this._items = items;
    this.setAttribute('items', JSON.stringify(items));
  }
  
  get items(): Array<{ id: number, value: string }> {
    return this._items;
  }
  
  // 複数選択を有効/無効に設定
  set multiSelect(enable: boolean) {
    this._multiSelect = enable;
    if (enable) {
      this.setAttribute('multi-select', '');
    } else {
      this.removeAttribute('multi-select');
    }
  }
  
  get multiSelect(): boolean {
    return this._multiSelect;
  }
  
  connectedCallback(): void {
    this.render();
    
    // イベントリスナーを追加
    this.shadowRoot?.addEventListener('click', this.handleItemClick.bind(this));
  }
  
  // 型安全な選択イベント発火メソッド
  private fireSelectEvent(item: { id: number, value: string }): void {
    // 型安全なカスタムイベントを作成
    const selectEvent = new CustomEvent<SelectEventDetail>('item-select', {
      bubbles: true,
      composed: true, // Shadow DOMの境界を越えてイベントを伝播
      detail: {
        selectedId: item.id,
        selectedValue: item.value,
        multiSelect: this._multiSelect
      }
    });
    
    // イベント発火
    this.dispatchEvent(selectEvent);
  }
  
  // クリックイベントハンドラ
  private handleItemClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('select-item')) {
      const itemId = Number(target.dataset.id);
      const item = this._items.find(i => i.id === itemId);
      
      if (item) {
        this.fireSelectEvent(item);
        
        // 選択状態を視覚的に更新
        if (!this._multiSelect) {
          // 単一選択の場合は他の選択を解除
          this.shadowRoot?.querySelectorAll('.select-item--selected')
            .forEach(el => el.classList.remove('select-item--selected'));
        }
        
        target.classList.toggle('select-item--selected');
      }
    }
  }
  
  private render(): void {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <style>
        .select-container {
          border: 1px solid #ccc;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .select-item {
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .select-item:hover {
          background-color: #f5f5f5;
        }
        
        .select-item--selected {
          background-color: #e0f7fa;
          font-weight: bold;
        }
      </style>
      
      <div class="select-container">
        ${this._items.map(item => `
          <div class="select-item" data-id="${item.id}">
            ${item.value}
          </div>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('typed-select', TypedSelect);

// 使用例 - TypeScriptによる型安全なイベントリスニング
const select = document.createElement('typed-select') as TypedSelect;

// 型安全なデータ設定
select.items = [
  { id: 1, value: 'Option 1' },
  { id: 2, value: 'Option 2' },
  { id: 3, value: 'Option 3' }
];

document.body.appendChild(select);

// 型安全なイベントリスナー
select.addEventListener('item-select', (event: Event) => {
  // 型アサーションでイベントの型を指定
  const typedEvent = event as CustomEvent<SelectEventDetail>;
  
  // 型安全にイベントデータにアクセス
  console.log(`Selected: ${typedEvent.detail.selectedValue} (ID: ${typedEvent.detail.selectedId})`);
  console.log(`Multi-select mode: ${typedEvent.detail.multiSelect}`);
  
  // TypeScriptの自動補完が機能
  // 存在しないプロパティにはアクセスできない
  // console.log(typedEvent.detail.nonExistentProperty); // ❌ コンパイルエラー
});
```

この例では、カスタムイベントに対して型定義を適用し、イベントリスナー内でも型安全にデータにアクセスする方法を示しています。TypeScriptのジェネリック型を使用して`CustomEvent`の`detail`プロパティの型を定義することで、型安全性と自動補完が確保されます。

## 🔹 まとめ
- TypeScript は Web Components の開発を型安全にし、バグの発生を未然に防ぎます。
- カスタム要素の定義、イベントの管理、属性のバインディングすべてが型で保証されるため、開発効率が向上します。
- 継承や抽象化などのオブジェクト指向パターンを活用して、再利用可能なコンポーネントライブラリを構築できます。
- 実践的な例で示したように、複雑なデータ構造や属性の制約なども型システムで表現でき、堅牢なコンポーネント設計が可能になります。
- カスタムイベントの型定義により、コンポーネント間の通信も安全に行えます。

TypeScriptを活用することで、Web Componentsはより確実で保守性の高い実装となり、大規模なプロジェクトでも安心して採用できるようになります。