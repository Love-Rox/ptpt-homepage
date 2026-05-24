import ErrorPage from "@/components/common/error-page";

export default function NotFound() {
  return (
    <ErrorPage
      lang="en"
      code="404"
      title="Page not found"
      message="The page you requested doesn't exist or has been moved."
    />
  );
}

export const getConfig = async () => ({ render: "static" }) as const;
