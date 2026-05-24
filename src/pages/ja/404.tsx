import ErrorPage from "@/components/common/error-page";

export default function NotFound() {
  return (
    <ErrorPage
      lang="ja"
      code="404"
      title="ページが見つかりません"
      message="お探しのページは存在しないか、移動した可能性があります。"
    />
  );
}

export const getConfig = async () => ({ render: "static" }) as const;
