import ReactView from "@/components/views/react";

export default async function Page() {
  return <ReactView locale="ja" />;
}

export const getConfig = async () => ({ render: "static" }) as const;
