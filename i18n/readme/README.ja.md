# 🚀 **OpenHealth**

**AIヘルスアシスタント | あなたのデータで動作、ローカルで実行**

---

<p align="center">
  <img src="/intro/openhealth.avif" alt="OpenHealth デモ">
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

1. **リポジトリのクローン:**
   ```bash
   git clone https://github.com/OpenHealthForAll/open-health.git
   cd open-health
   ```

2. **セットアップと実行:**
   ```bash
   # 環境設定ファイルをコピー
   cp .env.example .env

   # .envファイルにAPIキーを追加:
   # UPSTAGE_API_KEY - パース用（https://www.upstage.ai でカード登録なしで$10のクレジットが取得可能）
   # OPENAI_API_KEY - 高度なパース機能のため

   # Docker Composeでアプリケーションを起動
   docker compose --env-file .env up
   ```

   既存ユーザーの場合:
   ```bash
   docker compose --env-file .env up --build
   ```

3. **OpenHealthへのアクセス:**
   ブラウザで `http://localhost:3000` にアクセスしてOpenHealthを開始します。

> **注意:** システムはパースとLLMの2つの主要コンポーネントで構成されています。現在、パースはUpstageとOpenAI APIを使用しており（テストで最高のパフォーマンスを示しました）、ローカルパーサーも近日追加予定です。LLMコンポーネントはOllamaを使用して完全にローカルで実行できます。

> **注意:** DockerでOllamaを使用する場合、Ollama APIエンドポイントを次のように設定してください: `http://docker.for.mac.localhost:11434/`

---

## 🌐 コミュニティとサポート

Redditで連絡してください：[マイプロフィール](https://www.reddit.com/user/Dry_Steak30/) 