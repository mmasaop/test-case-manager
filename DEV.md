# MDXテストケース管理アプリ開発計画

## プロジェクト概要
ローカルのMDX形式テストケースを編集・閲覧できるWebアプリケーション

### 技術スタック
- **フロントエンド**: Vite + React + TypeScript
- **UIライブラリ**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **MDXエディタ**: @mdx-js/react + CodeMirror or Monaco Editor
- **ファイルシステム**: File System Access API
- **状態管理**: Zustand or Jotai
- **ルーティング**: React Router

## 機能要件

### 必須機能
1. **ファイルシステム操作**
   - ローカルフォルダの選択（File System Access API）
   - フォルダ構造の表示（ツリービュー）
   - MDXファイルの読み込み
   - MDXファイルの保存

2. **MDX編集機能**
   - リアルタイムプレビュー（分割画面）
   - シンタックスハイライト
   - MDXコンポーネントのサポート
   - 画像・添付ファイルの参照

3. **テストケース管理**
   - フォルダ構造に基づく階層表示
   - テストケースの検索機能
   - パンくずリストによるナビゲーション
   - 最近開いたファイルの履歴

4. **フォルダ構造**
   ```
   test-cases/
   ├── type001/
   │   ├── subtype/
   │   │   ├── 0001/
   │   │   │   ├── case.mdx
   │   │   │   └── image.png
   │   │   └── 0002/
   │   │       └── case.mdx
   │   └── another-subtype/
   └── type002/
   ```

## 開発フェーズ

### Phase 1: 基盤構築（1日目）
1. Vite + React + TypeScriptプロジェクトの初期化
2. shadcn/uiのセットアップ
3. 基本的なレイアウト構造（サイドバー + メインエリア）
4. File System Access APIの導入と動作確認

### Phase 2: ファイルシステム機能（2日目）
1. フォルダ選択機能
2. ファイルツリーコンポーネント
3. MDXファイルの読み込み機能
4. ファイル保存機能

### Phase 3: MDXエディタ実装（3-4日目）
1. MDXエディタコンポーネント（CodeMirror/Monaco）
2. リアルタイムプレビュー機能
3. 分割画面レイアウト
4. MDXコンポーネントのレンダリング

### Phase 4: 拡張機能（5日目）
1. 検索機能の実装
2. ファイル履歴機能
3. パンくずリストナビゲーション
4. キーボードショートカット

### Phase 5: UI/UX改善（6日目）
1. ダークモード対応
2. レスポンシブデザイン
3. エラーハンドリング
4. パフォーマンス最適化

## ディレクトリ構造
```
test-case-manager/
├── src/
│   ├── components/
│   │   ├── FileTree/
│   │   ├── MdxEditor/
│   │   ├── Preview/
│   │   ├── Layout/
│   │   └── ui/           # shadcn/uiコンポーネント
│   ├── hooks/
│   │   ├── useFileSystem.ts
│   │   ├── useMdxEditor.ts
│   │   └── useSearch.ts
│   ├── lib/
│   │   ├── fileSystem.ts
│   │   └── mdxProcessor.ts
│   ├── types/
│   │   └── index.ts
│   ├── stores/
│   │   └── fileStore.ts
│   └── App.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 技術的な考慮事項

### File System Access API
- Chrome/Edge 136+でサポート
- ユーザーの明示的な許可が必要
- フォールバック: input[type="file"]での単一ファイル選択

### MDXエディタ実装方針
**CodeMirror 6を採用**
- 軽量で高速
- 豊富な拡張機能
- MDX用の言語サポートあり
- Zennライクなエディタ体験を実現

### UI/UXデザイン（Zenn参考）
1. **エディタレイアウト**
   - 左側：CodeMirrorエディタ
   - 右側：リアルタイムプレビュー
   - 分割バーでリサイズ可能

2. **エディタ機能**
   - Markdownツールバー（太字、斜体、リンク、画像など）
   - ショートカットキー対応
   - 自動保存機能
   - Undo/Redo

3. **プレビュー機能**
   - スクロール同期
   - MDXコンポーネントのレンダリング
   - コードハイライト（Prism.js）
   - 数式表示（KaTeX）

### パフォーマンス対策
- 仮想スクロールでファイルツリーを最適化
- MDXのコンパイルをWebWorkerで実行
- ファイルの遅延読み込み

## 開発ガイドライン

### TDD実践
- Vitest + React Testing Library
- ファイルシステム操作のモック
- MDXレンダリングのテスト

### アクセシビリティ
- キーボードナビゲーション
- スクリーンリーダー対応
- 適切なARIA属性

## 次のステップ
1. プロジェクトの初期化
2. 基本レイアウトの実装
3. File System Access APIの統合

## 更新履歴
- 2025-01-14: MDX版として再作成