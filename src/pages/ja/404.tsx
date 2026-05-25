import ErrorPage from "@/components/common/error-page";

export default function NotFound() {
  return (
    <ErrorPage
      lang="ja"
      code="404"
      title="この便は見つかりません"
      message="お探しの行き先は案内板にありません。ページは出発済みか、元々存在しない可能性があります。"
    />
  );
}

export const getConfig = async () => ({ render: "static" }) as const;
