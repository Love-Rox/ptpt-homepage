"use client";

import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

const languages = [
  { id: "ja", name: "日本語" },
  { id: "en", name: "English" },
];

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (langId: string) => void;
}

export const LanguageSelector = ({ currentLang, onLanguageChange }: LanguageSelectorProps) => {
  const selectedLang = languages.find((lang) => lang.id === currentLang) ?? languages[0]!;

  return (
    <MenuTrigger>
      <Button
        className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[12px] text-ink-mute border border-rule hover:text-ink hover:border-rule-strong transition-colors"
        aria-label="Language"
      >
        <span>{selectedLang.name}</span>
        <span aria-hidden="true" className="text-[9px] text-shu">
          ▾
        </span>
      </Button>

      <Popover placement="bottom end" className="w-40">
        <Menu
          className="bg-ground-card border border-rule p-1 min-w-[150px] shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
          onAction={(key) => onLanguageChange(key as string)}
          selectedKeys={[selectedLang.id]}
          selectionMode="single"
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.id}
              id={lang.id}
              textValue={lang.name}
              className={({ isFocused, isSelected }) =>
                `px-2.5 py-2 cursor-pointer flex items-center justify-between font-gothic text-[13px] outline-none transition-colors ${
                  isFocused ? "bg-shu-wash text-ink" : ""
                } ${isSelected ? "text-shu font-semibold" : "text-ink-mute"}`
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
                      className="w-4 h-4"
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
