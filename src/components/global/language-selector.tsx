"use client";

import {
  MenuTrigger,
  Button,
  Popover,
  Menu,
  MenuItem,
  // 必要な場合はI18nProviderから現在のロケールを取得できますが、
  // Wakuではpropsで渡す方がシンプルです
} from "react-aria-components";
// import { GlobeIcon } from '@heroicons/react/24/outline'; // 例: アイコンのインポート

// サポートする言語と表示名
const languages = [
  { id: "ja", name: "日本語" },
  { id: "en", name: "English" },
];

interface LanguageSelectorProps {
  currentLang: string;
  // Wakuのルーティングに合わせて、言語変更時に実行するコールバック関数を想定
  onLanguageChange: (langId: string) => void;
}

export const LanguageSelector = ({ currentLang, onLanguageChange }: LanguageSelectorProps) => {
  // 現在選択されている言語のオブジェクトを取得
  const selectedLang = languages.find((lang) => lang.id === currentLang) ?? languages[0]!;

  return (
    <MenuTrigger>
      {/* トリガーとなるボタン (現在選択されている言語を表示) */}
      <Button
        className="flex items-center gap-2 p-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 shadow hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="言語選択"
      >
        {/* <GlobeIcon className="w-5 h-5" /> */}
        <span className="font-medium">{selectedLang.name}</span>
      </Button>

      {/* メニューの表示を制御する Popover */}
      <Popover placement="bottom end" className="w-40">
        {/* メニュー本体 */}
        <Menu
          className="border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 shadow-lg p-1 min-w-[150px]"
          // キーボード操作やマウス選択時の動作
          onAction={(key) => onLanguageChange(key as string)}
          // 初期選択状態のキー（現在選択中の言語）
          selectedKeys={[selectedLang.id]}
          selectionMode="single" // 単一選択モード
        >
          {/* 言語リストの MenuItem を生成 */}
          {languages.map((lang) => (
            <MenuItem
              key={lang.id}
              id={lang.id}
              textValue={lang.name}
              className={({ isFocused, isSelected }) =>
                `p-2 rounded-md cursor-pointer flex items-center justify-between ${isFocused ? "bg-primary-100 dark:bg-slate-700" : ""} ${isSelected ? "font-bold text-primary-600 dark:text-primary-400" : "text-slate-700 dark:text-slate-200"}`
              }
            >
              {({ isSelected }) => (
                <>
                  <span>{lang.name}</span>
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </>
              )}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
