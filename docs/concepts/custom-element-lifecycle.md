# Custom Element のライフサイクル

`Custom Elements` は DOM に追加・削除されたり、属性が変更されたときに特定の処理を行うことができます。  
これを可能にするのが **ライフサイクルメソッド** です。  
ライフサイクルメソッドは、Web Components が動的に生成、更新、破棄されるタイミングで自動的に呼び出されます。


## 🔹 主なライフサイクルメソッド
| メソッド | 説明 |
|---|---|
| `connectedCallback()`       | 要素が DOM ツリーに追加されたときに呼ばれる |
| `disconnectedCallback()`    | 要素が DOM ツリーから削除されたときに呼ばれる |
| `adoptedCallback()`         | 要素が他のドキュメントに移動されたときに呼ばれる |
| `attributeChangedCallback()` | 要素の監視対象の属性が変更されたときに呼ばれる |

## 📌 connectedCallback()
このメソッドは、カスタム要素が DOM ツリーに追加された際に呼ばれます。  

### 主な用途
- 要素の初期化
- イベントリスナーの登録
- API 呼び出しの開始

```ts
class ConnectedComponent extends HTMLElement {
  connectedCallback() {
    console.log("要素が DOM に追加されました");
    this.innerHTML = `<p>初期化完了</p>`;
  }
}

customElements.define('connected-component', ConnectedComponent);
```

```html
<connected-component></connected-component>
```


## 📌 disconnectedCallback()
このメソッドは、要素が DOM ツリーから削除された際に呼ばれます。  

### 主な用途
- イベントリスナーの解除
- タイマーやインターバルのクリア
- リソースの解放

```ts
class DisconnectedComponent extends HTMLElement {
  private timer: number;

  connectedCallback() {
    this.timer = setInterval(() => {
      console.log("動作中...");
    }, 1000);
  }

  disconnectedCallback() {
    console.log("要素が DOM から削除されました");
    clearInterval(this.timer);
  }
}

customElements.define('disconnected-component', DisconnectedComponent);
```

```html
<disconnected-component></disconnected-component>
```


## 📌 adoptedCallback()
このメソッドは、要素が別の `Document` に移動された際に呼ばれます。  
通常の開発では多く使用されませんが、`iframe` の中に移動された場合や、`document.adoptNode()` によって移動されたときに発火します。

```ts
class AdoptedComponent extends HTMLElement {
  adoptedCallback() {
    console.log("他のドキュメントに移動されました");
  }
}

customElements.define('adopted-component', AdoptedComponent);
```


## 📌 attributeChangedCallback()
このメソッドは、要素の属性が変更されたときに発火します。  
監視する属性は **observedAttributes** のゲッターで定義する必要があります。

```ts
class AttributeComponent extends HTMLElement {
  static get observedAttributes() {
    return ['color', 'size'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(`属性 ${name} が ${oldValue} から ${newValue} に変更されました`);
    this.style.color = name === 'color' ? newValue : this.style.color;
    this.style.fontSize = name === 'size' ? `${newValue}px` : this.style.fontSize;
  }
}

customElements.define('attribute-component', AttributeComponent);
```

```html
<attribute-component color="red" size="20"></attribute-component>
```

## 🔹 ライフサイクル図

カスタム要素のライフサイクルには、実装の順序によって異なるケースも存在します。以下は、一般的なライフサイクルのフローを示しています。

```mermaid
stateDiagram-v2
    [*] --> created : constructor()
    created --> connected : DOMに接続
    connected --> attributeChanged : 属性が変更される
    attributeChanged --> connected
    connected --> disconnected : DOMから削除
    disconnected --> connected : DOMに再接続
    connected --> adopted : 新しいドキュメントに移動
    adopted --> connected
    disconnected --> [*]

    note right of connected
        connectedCallback()
    end note

    note right of disconnected
        disconnectedCallback()
    end note

    note right of adopted
        adoptedCallback()
    end note

    note right of attributeChanged
        attributeChangedCallback()
    end note 
```

### カスタム要素の状態遷移の説明
|状態|説明|
|---|---|
|**Created**|要素が`constructor`を通じて作成された状態<br>この時点ではDOMに接続されていない|
|**Connected**|要素がDOMツリーに追加された状態<br>**このタイミングで `connectedCallback()` が呼ばれる**|
|**AttributeChanged**|`observedAttributes`で監視している属性が変更された状態<br>**このタイミングで `attributeChangedCallback()` が呼ばれる**|
|**Disconnected**|要素がDOMツリーから削除された状態<br>**このタイミングで `disconnectedCallback()` が呼ばれる**|
|**Adopted**|要素が別のDocumentに移動された状態<br>**このタイミングで `adoptedCallback()` が呼ばれる**|


## 🔹 まとめ
- Custom Elements はライフサイクルメソッドを持ち、DOM の変更に応じて処理を行える。
- `connectedCallback` と `disconnectedCallback` は主にイベントリスナーの登録・解除に使われる。
- `attributeChangedCallback` は監視する属性を明示的に設定する必要がある。
- ライフサイクルを理解することで、より効率的で管理しやすいコンポーネント設計が可能。
