# ライフサイクルメソッドと型安全なイベント処理

Web Components のカスタム要素は、DOM のライフサイクルに応じて特定のメソッドが呼ばれる **ライフサイクルメソッド** を持っています。  
また、これに加えて **カスタムイベント** を発火・監視することで、他の要素との通信も可能です。  
特に TypeScript を使用することで、ライフサイクルイベントも型安全に管理できます。

## 🔹 ライフサイクルメソッドとイベント処理
以下は、Custom Element のライフサイクルに対応するメソッドです。  
それぞれのタイミングで、型安全なイベントを発火させることが可能です。

| メソッド | 説明  | イベント発火例 | 一般的な用途 |
|---|---|---|---|
| `connectedCallback()`   | 要素が DOM ツリーに追加されたときに呼ばれる  | `"component-mounted"` | 初期化、APIデータ取得開始、イベントリスナー登録 |
| `disconnectedCallback()`| 要素が DOM ツリーから削除されたときに呼ばれる   | `"component-unmounted"` | リソース解放、イベントリスナー削除、タイマー停止 |
| `adoptedCallback()` | 要素が他のドキュメントに移動されたときに呼ばれる   | `"component-moved"` | クロスフレーム状態の同期、移動後の再初期化 |
| `attributeChangedCallback()` | 要素の監視対象の属性が変更されたときに呼ばれる  | `"attribute-changed"` | UI更新、内部状態の同期、変更通知 |

## 🔹 型安全なイベントをライフサイクルで発火

```typescript
// イベントの詳細情報の型定義
interface ComponentEventDetail {
  message: string;
  timestamp: number;
  source?: string; // オプショナルな追加情報
}

class LifecycleComponent extends HTMLElement {
  // 監視する属性を定義
  static get observedAttributes(): string[] {
    return ['data-status'];
  }

  connectedCallback(): void {
    console.log("要素が追加されました");
    
    // 必要なDOMの初期化
    this.render();
    
    // イベントリスナーの設定
    this.setupEventListeners();
    
    // コンポーネントマウント通知
    this.emitEvent('component-mounted', 'Component Mounted');
    
    // 非同期データ取得の例
    this.fetchInitialData().catch(error => {
      console.error("初期データの取得に失敗:", error);
    });
  }

  disconnectedCallback(): void {
    console.log("要素が削除されました");
    
    // リスナーのクリーンアップ
    this.removeEventListeners();
    
    // タイマーやインターバルの停止
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    
    // アンマウント通知
    this.emitEvent('component-unmounted', 'Component Unmounted');
  }
  
  adoptedCallback(): void {
    console.log("要素が他のドキュメントに移動されました");
    
    // 新しいドキュメントでの再初期化が必要な場合
    this.resetState();
    
    // 移動通知
    this.emitEvent('component-moved', 'Component Moved to Different Document');
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // 値が実際に変更された場合のみ処理
    if (oldValue === newValue) return;
    
    console.log(`属性 ${name} が ${oldValue} から ${newValue} に変更されました`);
    
    try {
      // 値に基づく内部状態の更新
      if (name === 'data-status') {
        this.updateStatus(newValue);
      }
      
      // 変更通知
      this.emitEvent('attribute-changed', `Attribute ${name} changed`);
    } catch (error) {
      console.error(`属性値の処理中にエラーが発生しました: ${error}`);
      // エラーイベントを発火する
      this.emitEvent('component-error', `Error processing attribute: ${error}`, 'attribute-error');
    }
  }

  // 共通化されたイベント発火処理
  private emitEvent(eventName: string, message: string, source: string = 'lifecycle'): void {
    try {
      this.dispatchEvent(
        new CustomEvent<ComponentEventDetail>(eventName, {
          detail: {
            message,
            timestamp: Date.now(),
            source
          },
          bubbles: true,
          composed: true, // Shadow DOM の境界を越えて伝播
        })
      );
    } catch (error) {
      console.error(`イベント発火中にエラーが発生: ${error}`);
    }
  }
  
  // 以下は実装例のためのヘルパーメソッド
  private _interval: number | null = null;
  
  private render(): void {
    // UIの初期レンダリング
  }
  
  private setupEventListeners(): void {
    // イベントリスナーの設定
  }
  
  private removeEventListeners(): void {
    // イベントリスナーの削除
  }
  
  private resetState(): void {
    // 状態のリセット処理
  }
  
  private updateStatus(newValue: string | null): void {
    // ステータスの更新処理
  }
  
  private async fetchInitialData(): Promise<void> {
    // 非同期データ取得の例
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }
      const data = await response.json();
      // データの処理
    } catch (error) {
      // エラーハンドリング
      this.emitEvent('data-error', `Data fetch failed: ${error}`, 'api');
      throw error; // 呼び出し元でもエラーを処理できるよう再スロー
    }
  }
}

customElements.define('lifecycle-component', LifecycleComponent);
```

### 📌 イベントリスナーの設定
発火されたカスタムイベントは型安全に受け取ることが可能です。

```typescript
// イベントリスナーの型安全な設定
document.addEventListener('component-mounted', (event: Event) => {
  // 型アサーションを使用してイベントオブジェクトを適切な型に変換
  const customEvent = event as CustomEvent<ComponentEventDetail>;
  
  // 型安全にアクセス可能
  console.log(customEvent.detail.message);   // "Component Mounted"
  console.log(customEvent.detail.timestamp); // タイムスタンプが表示される
  console.log(customEvent.detail.source);    // "lifecycle"
});

document.addEventListener('attribute-changed', (event: Event) => {
  const customEvent = event as CustomEvent<ComponentEventDetail>;
  console.log(customEvent.detail.message);
});

// エラーハンドリングの例
document.addEventListener('component-error', (event: Event) => {
  const customEvent = event as CustomEvent<ComponentEventDetail>;
  console.error(`エラーが発生しました: ${customEvent.detail.message}`);
  // UIにエラーメッセージを表示するなどの処理
});
```

## 🔹 ライフサイクルメソッドの適切な活用例

### 📌  connectedCallback の実践的な使用法

```typescript
class DataComponent extends HTMLElement {
  private _resizeObserver: ResizeObserver | null = null;
  
  connectedCallback(): void {
    // 1. Shadow DOMの初期化
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.render();
    }
    
    // 2. イベントリスナーの設定
    this.shadowRoot?.querySelector('.button')?.addEventListener(
      'click', this.handleClick.bind(this)
    );
    
    // 3. ResizeObserverなどのAPIの初期化
    this._resizeObserver = new ResizeObserver(entries => {
      // サイズ変更時の処理
      this.handleResize(entries);
    });
    this._resizeObserver.observe(this);
    
    // 4. 非同期データの読み込み
    this.loadData();
    
    // 5. 初期状態をイベントで通知
    this.dispatchEvent(new CustomEvent('ready', {
      bubbles: true,
      composed: true
    }));
  }
  
  private handleClick(e: Event): void {
    // クリックイベント処理
  }
  
  private handleResize(entries: ResizeObserverEntry[]): void {
    // リサイズ処理
  }
  
  private render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <div class="container">
        <button class="button">Click Me</button>
        <div class="content"></div>
      </div>
    `;
  }
  
  private async loadData(): Promise<void> {
    try {
      // データ取得処理
    } catch (error) {
      console.error('データ読み込みエラー:', error);
    }
  }
}

customElements.define('data-component', DataComponent);
```

### 📌  disconnectedCallback でのリソース解放

```typescript
class StreamComponent extends HTMLElement {
  private _stream: ReadableStream | null = null;
  private _reader: ReadableStreamDefaultReader | null = null;
  private _abortController: AbortController | null = null;
  
  async connectedCallback(): Promise<void> {
    // ストリームの初期化
    this._abortController = new AbortController();
    try {
      this._stream = await this.createStream(this._abortController.signal);
      this._reader = this._stream.getReader();
      this.startReading();
    } catch (error) {
      console.error('ストリーム初期化エラー:', error);
    }
  }
  
  disconnectedCallback(): void {
    // ストリームのクリーンアップ
    if (this._reader) {
      this._reader.cancel().catch(err => console.error('Reader cancel error:', err));
      this._reader = null;
    }
    
    // AbortControllerでの処理中断
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = null;
    }
    
    this._stream = null;
    
    console.log('ストリームコンポーネントのリソースを解放しました');
  }
  
  private async createStream(signal: AbortSignal): Promise<ReadableStream> {
    // ストリームの作成処理（例）
    return new ReadableStream({
      start(controller) {
        // ストリーム初期化処理
      }
    });
  }
  
  private async startReading(): Promise<void> {
    // ストリームからの読み取り処理
  }
}

customElements.define('stream-component', StreamComponent);
```

### 📌  attributeChangedCallback での状態管理とエラーハンドリング

```typescript
type StatusType = 'idle' | 'loading' | 'success' | 'error';

class StatusIndicator extends HTMLElement {
  private _status: StatusType = 'idle';
  
  static get observedAttributes(): string[] {
    return ['status', 'message'];
  }
  
  // ゲッターとセッター
  get status(): StatusType {
    return this._status;
  }
  
  set status(value: StatusType) {
    // 型の検証
    if (!['idle', 'loading', 'success', 'error'].includes(value)) {
      throw new Error(`Invalid status value: ${value}`);
    }
    this._status = value;
    this.setAttribute('status', value);
  }
  
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    
    // エラーハンドリングを含む属性処理
    try {
      if (name === 'status') {
        // 型の検証
        if (newValue && ['idle', 'loading', 'success', 'error'].includes(newValue)) {
          this._status = newValue as StatusType;
          this.updateVisuals();
        } else {
          console.warn(`無効なステータス値です: ${newValue}`);
          // デフォルト値に戻す
          this.setAttribute('status', this._status);
        }
      } else if (name === 'message') {
        this.updateMessage(newValue || '');
      }
    } catch (error) {
      console.error(`属性の処理中にエラーが発生しました: ${error}`);
      // エラー状態を表示
      this._status = 'error';
      this.updateVisuals();
    }
  }
  
  private updateVisuals(): void {
    // ステータスに応じたビジュアルの更新
    const container = this.shadowRoot?.querySelector('.container');
    if (container) {
      // 以前のステータスクラスをすべて削除
      container.classList.remove('idle', 'loading', 'success', 'error');
      // 新しいステータスクラスを追加
      container.classList.add(this._status);
    }
  }
  
  private updateMessage(message: string): void {
    // メッセージの更新処理
  }
}

customElements.define('status-indicator', StatusIndicator);
```

### 📌  adoptedCallback の実際の使用例

```typescript
class CrossFrameComponent extends HTMLElement {
  // コンポーネントの状態
  private _state = {
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
    frameIdentifier: ''
  };
  
  connectedCallback(): void {
    this._state.frameIdentifier = this.getFrameIdentifier();
    this.render();
  }
  
  adoptedCallback(): void {
    // フレーム間移動時の処理
    const oldFrameId = this._state.frameIdentifier;
    const newFrameId = this.getFrameIdentifier();
    
    console.log(`コンポーネントが移動しました: ${oldFrameId} -> ${newFrameId}`);
    
    // 状態の更新
    this._state.frameIdentifier = newFrameId;
    this._state.updatedAt = new Date();
    
    // 新しいフレームで再レンダリング
    this.render();
    
    // 移動イベントの発火
    this.dispatchEvent(new CustomEvent('frame-adoption', {
      detail: {
        previousFrame: oldFrameId,
        currentFrame: newFrameId,
        componentId: this._state.id,
        timestamp: this._state.updatedAt
      },
      bubbles: true,
      composed: true
    }));
  }
  
  // 現在のフレームの識別子を取得
  private getFrameIdentifier(): string {
    try {
      // iframeの場合はtitle、name、URLなどで識別
      if (window !== window.parent) {
        return document.title || location.href || 'unknown-frame';
      }
      return 'main-document';
    } catch (e) {
      // クロスオリジンエラーの場合
      return 'cross-origin-frame';
    }
  }
  
  private render(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    
    this.shadowRoot!.innerHTML = `
      <style>
        .container {
          border: 1px solid #ccc;
          padding: 10px;
        }
      </style>
      <div class="container">
        <p>コンポーネントID: ${this._state.id}</p>
        <p>現在のフレーム: ${this._state.frameIdentifier}</p>
        <p>最終更新: ${this._state.updatedAt.toLocaleString()}</p>
      </div>
    `;
  }
}

customElements.define('cross-frame-component', CrossFrameComponent);
```

## 🔹 非同期処理とライフサイクルメソッド

ライフサイクルメソッドで非同期処理を行う場合の注意点と実装パターンです。

```typescript
class AsyncComponent extends HTMLElement {
  private _abortController: AbortController | null = null;
  private _loading: boolean = false;
  
  async connectedCallback(): Promise<void> {
    // 新しいAbortControllerを作成
    this._abortController = new AbortController();
    const { signal } = this._abortController;
    
    // 初期レンダリング（ローディング状態）
    this.renderLoading();
    
    try {
      // 非同期処理の開始
      this._loading = true;
      const data = await this.fetchData(signal);
      
      // コンポーネントがまだDOMに存在するか確認
      if (!this.isConnected) {
        console.log('コンポーネントはすでにDOMから削除されています');
        return;
      }
      
      // データの処理とレンダリング
      this.renderData(data);
    } catch (error) {
      // AbortErrorは通常のエラーとして扱わない
      if (error.name === 'AbortError') {
        console.log('データ取得がキャンセルされました');
        return;
      }
      
      console.error('データ取得エラー:', error);
      
      // エラー状態のレンダリング（コンポーネントがまだ接続されている場合）
      if (this.isConnected) {
        this.renderError(error);
      }
    } finally {
      this._loading = false;
    }
  }
  
  disconnectedCallback(): void {
    // 実行中の非同期処理をキャンセル
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = null;
    }
  }
  
  private async fetchData(signal: AbortSignal): Promise<any> {
    // 実際のデータ取得処理
    const response = await fetch('https://api.example.com/data', { signal });
    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status}`);
    }
    return response.json();
  }
  
  private renderLoading(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    
    this.shadowRoot!.innerHTML = `
      <div class="loading">
        <p>データを読み込み中...</p>
      </div>
    `;
  }
  
  private renderData(data: any): void {
    if (!this.shadowRoot) return;
    
    // データ表示用のHTMLを生成
    this.shadowRoot.innerHTML = `
      <div class="data-container">
        <h3>${data.title || 'データ'}</h3>
        <div class="content">${data.content || ''}</div>
      </div>
    `;
  }
  
  private renderError(error: Error): void {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <div class="error">
        <p>エラーが発生しました: ${error.message}</p>
        <button class="retry">再試行</button>
      </div>
    `;
    
    // 再試行ボタンのイベントリスナー
    this.shadowRoot.querySelector('.retry')?.addEventListener('click', () => {
      this.connectedCallback();
    });
  }
}

customElements.define('async-component', AsyncComponent);
```

## 🔹 パフォーマンス最適化

ライフサイクルメソッドとイベント処理でのパフォーマンス最適化テクニックです。

```typescript
class OptimizedComponent extends HTMLElement {
  // 変更検知用のプロパティ
  private _lastRender: Record<string, any> = {};
  private _renderScheduled: boolean = false;
  private _debouncedEvents: Map<string, number> = new Map();
  
  connectedCallback(): void {
    // 初期レンダリング
    this.render();
    
    // ライトウェイトなイベントリスナー
    this.shadowRoot?.addEventListener('click', this.handleEvents);
  }
  
  disconnectedCallback(): void {
    // イベントリスナーの削除
    this.shadowRoot?.removeEventListener('click', this.handleEvents);
    
    // 保留中のタイマーをクリア
    this._debouncedEvents.forEach(timerId => {
      window.clearTimeout(timerId);
    });
    this._debouncedEvents.clear();
  }
  
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    
    // 状態更新
    this.updateState(name, newValue);
    
    // レンダリングをスケジュール（複数の属性変更を一度にまとめる）
    this.scheduleRender();
  }
  
  // イベント委任パターンで効率化
  private handleEvents = (e: Event): void => {
    const target = e.target as HTMLElement;
    
    // データ属性でターゲットを特定
    if (target.matches('[data-action]')) {
      const action = target.dataset.action;
      
      switch (action) {
        case 'increment':
          this.increment();
          break;
        case 'decrement':
          this.decrement();
          break;
        // 他のアクション
      }
    }
  }
  
  // デバウンスされたレンダリングスケジューリング
  private scheduleRender(): void {
    if (this._renderScheduled) return;
    
    this._renderScheduled = true;
    
    // requestAnimationFrameを使用した最適化
    requestAnimationFrame(() => {
      this.render();
      this._renderScheduled = false;
    });
  }
  
  // デバウンスされたイベント発火
  private emitDebounced(eventName: string, detail: any, delay: number = 100): void {
    // 既存のタイマーをクリア
    if (this._debouncedEvents.has(eventName)) {
      window.clearTimeout(this._debouncedEvents.get(eventName));
    }
    
    // 新しいタイマーを設定
    const timerId = window.setTimeout(() => {
      this.dispatchEvent(new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true
      }));
      this._debouncedEvents.delete(eventName);
    }, delay);
    
    this._debouncedEvents.set(eventName, timerId);
  }
  
  // 差分ベースのレンダリング
  private render(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.createInitialDOM();
    }
    
    // 現在の状態
    const currentState = this.getState();
    
    // 差分に基づいて必要な部分だけ更新
    for (const [key, value] of Object.entries(currentState)) {
      if (this._lastRender[key] !== value) {
        this.updateDOM(key, value);
        this._lastRender[key] = value;
      }
    }
  }
  
  // その他のヘルパーメソッド
  private createInitialDOM(): void {
    // 初期DOMの構築
  }
  
  private updateDOM(key: string, value: any): void {
    // 特定の要素だけを更新
  }
  
  private updateState(name: string, value: string | null): void {
    // 状態の更新処理
  }
  
  private getState(): Record<string, any> {
    // 現在の状態を返す
    return {};
  }
  
  private increment(): void {
    // インクリメント処理
  }
  
  private decrement(): void {
    // デクリメント処理
  }
}

customElements.define('optimized-component', OptimizedComponent);
```

## 🔹 デバッグとトラブルシューティング

ライフサイクルメソッドのデバッグとトラブルシューティングに役立つパターンです。

```typescript
class DebuggableComponent extends HTMLElement {
  // デバッグモードの設定
  private get isDebugMode(): boolean {
    return this.hasAttribute('debug') || 
           localStorage.getItem('component-debug') === 'true';
  }
  
  constructor() {
    super();
    this.logLifecycle('constructor');
  }
  
  connectedCallback(): void {
    this.logLifecycle('connectedCallback');
    this.logDOM('Initial DOM state');
    
    try {
      this.render();
    } catch (error) {
      this.logError('Render error', error);
    }
  }
  
  disconnectedCallback(): void {
    this.logLifecycle('disconnectedCallback');
  }
  
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.logLifecycle(`attributeChangedCallback: ${name} = ${oldValue} -> ${newValue}`);
    
    try {
      // 処理...
    } catch (error) {
      this.logError(`Error processing attribute ${name}`, error);
    }
  }
  
  // デバッグ用メソッド
  private logLifecycle(message: string): void {
    if (this.isDebugMode) {
      console.log(`[${this.tagName}] 🔄 ${message}`);
    }
  }
  
  private logEvent(eventName: string, detail?: any): void {
    if (this.isDebugMode) {
      console.log(`[${this.tagName}] 📣 Event: ${eventName}`, detail || '');
    }
  }
  
  private logError(message: string, error: any): void {
    console.error(`[${this.tagName}] ❌ ${message}:`, error);
    
    // デバッグモードでは詳細情報を表示
    if (this.isDebugMode) {
      const errorElement = document.createElement('div');
      errorElement.classList.add('component-error');
      errorElement.style.color = 'red';
      errorElement.style.padding = '10px';
      errorElement.style.border = '1px solid red';
      errorElement.innerHTML = `
        <h4>Component Error</h4>
        <p>${message}</p>
        <pre>${error?.stack || error}</pre>
      `;
      
      // エラー情報を表示
      this.appendChild(errorElement);
    }
  }
  
  private logDOM(label: string): void {
    if (this.isDebugMode) {
      console.log(`[${this.tagName}] 🔍 ${label}:`, this.outerHTML);
    }
  }
  
  // カスタムイベント発火とロギング
  protected emitEvent<T>(eventName: string, detail: T): void {
    this.logEvent(eventName, detail);
    
    this.dispatchEvent(new CustomEvent<T>(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }
  
  // レンダリング
  private render(): void {
    // レンダリング処理...
    this.logDOM('After render');
  }
}

customElements.define('debuggable-component', DebuggableComponent);
```

## 🔹 ライフサイクルの流れとイベント

1. **connectedCallback()** : DOM に追加された瞬間、"component-mounted" が発火
   ```
   初期化 → レンダリング → イベントリスナー設定 → データ取得
   ```

2. **attributeChangedCallback()** : 監視対象の属性が変更されると "attribute-changed" が発火
   ```
   属性変更 → 値の検証 → 内部状態の更新 → UI更新
   ```

3. **disconnectedCallback()**  : DOM から削除された瞬間、"component-unmounted" が発火
   ```
   イベントリスナー解除 → タイマー停止 → リソース解放
   ```

## 🔹 まとめ
- ライフサイクルメソッドごとに型安全なイベント発火が可能
- DOM の変化に応じてリアルタイムでイベントが伝搬される
- `CustomEvent` と TypeScript の型注釈を活用することで厳密な型安全が確保される
- エラーハンドリングと非同期処理を適切に組み合わせることで堅牢なコンポーネントを構築可能
- パフォーマンス最適化とデバッグ技術を活用することで実用的なWeb Componentsを開発できる