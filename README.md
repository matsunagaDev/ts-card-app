# TS Card App

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"/></a>&nbsp 
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/Chakra_UI-319795?style=flat-square&logo=chakraui&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white"/></a>&nbsp 
</p>

ユーザー情報とスキルを管理するシンプルな名刺アプリケーションです。
React + TypeScript + Supabase で構築されています。

![スクリーンショット](./assets/images/card-app-home.png)

## 機能

- ユーザー名刺の登録・表示・編集
- ユーザースキルの管理
- SNS 情報の連携（GitHub, Qiita, X）
- 自動データクリーンアップ（前日登録したユーザーデータ）

## 技術スタック

- **フロントエンド**: React 19, TypeScript, Chakra UI
- **状態管理**: React Hook Form
- **ルーティング**: React Router v6
- **バックエンド**: Supabase
- **テスト**: Jest, Testing Library
- **CI/CD**: GitHub Actions

## セットアップ

### 必要条件

- Node.js (バージョン 20)
- npm または yarn
- Supabase アカウント

### インストール

1. リポジトリをクローンする

```bash
git clone https://github.com/yourusername/ts-card-app.git
cd ts-card-app
```

2. 依存関係をインストールする

```bash
npm install
```

3. 環境変数を設定する

`.env` ファイルを作成し、以下の内容を設定します：

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 開発サーバーを起動する

```bash
npm run dev
```

### データベース設定

![スクリーンショット](./assets/images/supabase-schema-card-app.png)

## 使用方法

### 名刺の閲覧

1. ホーム画面で名刺 ID を入力
2. 「名刺を見る」ボタンをクリック

### 名刺の登録

1. ホーム画面で「新規登録」をクリック
2. 必要情報を入力（英単語 ID、名前、自己紹介、スキル）
3. オプションで SNS アカウントを入力
4. 「登録」ボタンをクリック

### 名刺の編集

1. 名刺表示画面で「編集」ボタンをクリック
2. 情報を編集
3. 「更新」ボタンをクリック

## プロジェクト構造

```
ts-card-app/
├── .github/           # GitHub Actions設定
├── batch/             # バッチ処理スクリプト
├── public/            # 静的ファイル
└── src/
    ├── __tests__/     # テストファイル
    ├── components/    # Reactコンポーネント
    ├── domain/        # ドメインモデル・型定義
    ├── lib/           # ビジネスロジック
    ├── utils/         # ユーティリティ関数
    └── validations/   # バリデーションスキーマ
```

## テスト

テストを実行するには：

```bash
npm run test
```

## バッチ処理

前日登録したユーザーデータを、毎日 AM6:00 に自動的に削除するバッチ処理があります。

手動でバッチを実行するには以下を実行してください。

```bash
npx tsx ./batch/index.ts
```
