import ErrorPage from "@/components/common/error-page";

export default function NotFound() {
  return (
    <ErrorPage
      lang="en"
      code="404"
      title="Flight not found"
      message="This destination isn't on the board — the page may have departed or never existed."
    />
  );
}

export const getConfig = async () => ({ render: "static" }) as const;
