# 🚀 **OpenHealth**

**AIヘルスアシスタント | あなたのデータで動作、ローカルで実行**

---

<p align="center">
  <img src="/intro/openhealth.gif" alt="OpenHealth デモ">
</p>

## 🌟 概要

OpenHealthは、**あなたの健康データを管理**するお手伝いをします。AIとあなたの個人健康情報を活用し、
OpenHealthはプライベートでローカルで実行されるアシスタントを提供し、健康をより良く理解し管理することを支援します。

---

## ✨ プロジェクトの特徴

- 📊 **集中化された健康データ入力：** すべての健康データを一箇所で簡単に統合
- 🛠️ **スマート解析：** 健康データを自動的に解析し、構造化されたデータファイルを生成
- 🤝 **文脈に基づく会話：** GPT駆動のAIとのパーソナライズされた対話のために構造化データを活用

---

## 📥 サポートされているデータソースと言語モデル

| **追加可能なデータソース** | **サポートされている言語モデル** |
|--------------------------|--------------------------------|
| 血液検査結果              | LLaMA,DeepSeek-V3               |
| 健康診断データ            | GPT,Claude,Gemini               |
| 個人の身体情報            |                                |
| 家族歴                    |                                |
| 症状                      |                                |

---

## 🤔 OpenHealthを作った理由

- 💡 **あなたの健康はあなたの責任です。**
- ✅ 真の健康管理は**あなたのデータ** + **インテリジェンス**を組み合わせ、洞察を実行可能な計画に変換します。
- 🧠 AIは長期的な健康管理を効果的に導き、支援する偏りのないツールとして機能します。

---

## 🗺️ プロジェクト図

```plaintext
健康データ入力 --> データ解析モジュール --> 構造化データファイル --> GPT統合
```

> **注意:** データ解析機能は現在、別のPythonサーバーで実装されており、将来的にTypeScriptへの移行を予定しています。

## はじめに

## ⚙️ OpenHealthの実行方法

このプロジェクトはNode.jsを使用して構築されています。以下の手順に従って、OpenHealthをローカルで設定し実行してください：

1. **リポジトリのクローン：**

   ```bash
   git clone https://github.com/OpenHealthForAll/open-health.git
   cd open-health
   ```

2. **依存関係のインストール：**

   ```bash
   npm install
   ```

3. **.envファイルの設定:**

   プロジェクトのルートに`.env`ファイルを作成し、以下の内容を追加してください:
   ```bash
   DATABASE_URL="postgres://postgres:mysecretpassword@localhost:5432/open-health"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **PostgreSQLの設定:**

   Dockerを使用してPostgreSQLを実行します:

   ```bash
   # PostgreSQLコンテナの起動
   docker run -p 5432:5432 --name open-health -e POSTGRES_PASSWORD=mysecretpassword -d postgres
   ```

   コンテナの状態を確認:
   ```bash
   docker ps
   ```

5. **アプリケーションの起動:**

   ```bash
   npm run dev
   ```

4. **OpenHealthへのアクセス：**
   ブラウザを開き、`http://localhost:3000`にアクセスしてOpenHealthの使用を開始してください。

---

## 🌐 コミュニティとサポート

Redditで連絡してください：[マイプロフィール](https://www.reddit.com/user/Dry_Steak30/) 