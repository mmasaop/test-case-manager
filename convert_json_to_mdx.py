#!/usr/bin/env python3
import json
import os
import re
from pathlib import Path

def clean_filename(title):
    """ファイル名として使える文字列に変換"""
    # 日本語を維持しつつ、ファイル名に使えない文字を除去
    filename = re.sub(r'[<>:"/\\|?*]', '_', title)
    filename = filename.strip()
    # 長すぎる場合は切り詰める
    if len(filename) > 100:
        filename = filename[:100]
    return filename

def convert_suite_to_mdx(suite, parent_path=""):
    """テストスイートをMDX形式に変換"""
    suite_title = clean_filename(suite['title'])
    suite_path = os.path.join(parent_path, suite_title)
    
    # スイートディレクトリを作成
    os.makedirs(os.path.join("test-cases2", suite_path), exist_ok=True)
    
    # スイートの説明をREADME.mdとして作成
    if suite.get('description') or suite.get('preconditions'):
        readme_content = f"# {suite['title']}\n\n"
        if suite.get('description'):
            readme_content += f"{suite['description']}\n\n"
        if suite.get('preconditions'):
            readme_content += f"## 前提条件\n\n{suite['preconditions']}\n"
        
        with open(os.path.join("test-cases2", suite_path, "README.md"), 'w', encoding='utf-8') as f:
            f.write(readme_content)
    
    # テストケースを処理
    if 'cases' in suite:
        for idx, case in enumerate(suite['cases'], 1):
            case_dir = os.path.join(suite_path, f"{idx:04d}")
            os.makedirs(os.path.join("test-cases2", case_dir), exist_ok=True)
            
            # MDXコンテンツを生成
            mdx_content = f"# {case['title']}\n\n"
            
            # メタ情報
            if case.get('custom_fields'):
                for field in case['custom_fields']:
                    if field.get('value'):
                        mdx_content += f"**{field['title']}**: {field['value']}\n\n"
            
            if case.get('priority') and case['priority'] != 'undefined':
                mdx_content += f"**優先度**: {case['priority']}\n\n"
            
            if case.get('severity'):
                mdx_content += f"**重要度**: {case['severity']}\n\n"
            
            if case.get('description'):
                mdx_content += f"## 説明\n\n{case['description']}\n\n"
            
            if case.get('preconditions'):
                mdx_content += f"## 前提条件\n\n{case['preconditions']}\n\n"
            
            # テストステップ
            if case.get('steps'):
                mdx_content += "## テストステップ\n\n"
                for step in case['steps']:
                    mdx_content += f"### ステップ {step['position']}\n\n"
                    mdx_content += f"**操作**: {step['action']}\n\n"
                    if step.get('expected_result'):
                        mdx_content += f"**期待結果**:\n{step['expected_result']}\n\n"
                    if step.get('data'):
                        mdx_content += f"**データ**: {step['data']}\n\n"
            
            if case.get('postconditions'):
                mdx_content += f"## 事後条件\n\n{case['postconditions']}\n\n"
            
            # MDXファイルを保存
            with open(os.path.join("test-cases2", case_dir, "case.mdx"), 'w', encoding='utf-8') as f:
                f.write(mdx_content)
    
    # サブスイートを処理
    if 'suites' in suite:
        for sub_suite in suite['suites']:
            convert_suite_to_mdx(sub_suite, suite_path)

def main():
    # JSONファイルを読み込む
    with open('ROBASIC-2025-07-15.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # ルートスイートを処理
    if 'suites' in data:
        for suite in data['suites']:
            convert_suite_to_mdx(suite)
    
    print("変換が完了しました。test-cases2ディレクトリを確認してください。")

if __name__ == "__main__":
    main()