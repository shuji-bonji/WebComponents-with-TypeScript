# TypeScript で Web Components
TypeScriptでの利用を前提とした、Web Components の学び場です。

> [!IMPORTANT]
> この「TypeScript で Web Components」プロジェクトは、人間のエンジニア（@shuji-bonji）と生成AI（ChatGPT, Claude）との協働によって作成されています。
> 本プロジェクトは、「人とAIによる共創型教材」のモデルケースを目指しています。


## AIとの共創プロセス
コンテンツの構造設計、コード例の最終確認、専門的な技術レビューは人間が担当し、初期ドラフトの作成や内容の拡充にはAIを活用しています。

人間のエンジニアと**生成AI**の協働によって制作された、共創型の学習リソースです。
- 各ドキュメント・サンプルコードは、生成AIの支援によって草稿を作成
- 人間が技術的正確性・表現の自然さを確認し、レビュー・修正を加えています
- この教材は、AIを単なるツールではなく、知的パートナーとして捉える実践の一例です

この協働プロセスにより、より包括的で理解しやすいドキュメントの提供を目指しています。

## ⚠️ 重要なお知らせ
**GitHub公式リポジトリ以外のミラーサイトは利用しないでください。**  
本プロジェクトの正規リポジトリは以下のURLのみです：
- 正規リポジトリ: https://github.com/shuji-bonji/WebComponents-with-TypeScript/

偽サイトやミラーサイトにご注意ください。

## 環境構築

```sh
npm install
```

## ライブ編集反映（ホットリロードあり）
文書作成中に利用します。
```sh
npm run dev
```

## 本番ビルド

```sh
npm run build
```

## ビルド後の確認（Viteサーバー）
`npm run build` で生成されたHTMLをローカルで Viteサーバーを使って確認します。  
本番デプロイ前に確認したい時に利用します。
```sh
npm run preview
```

## ビルド後の確認（静的サーバー）
ビルド済みHTMLの静的配信	Nodeのserve-static的な仕組みで動作、軽量・高速だがホットリロードなし。  
生成されたHTMLを確認したい場合に利用します。（軽くて速い）

```sh
npm run serve
```

## ライセンス

このプロジェクトは [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.ja) ライセンスのもとで公開されています。
