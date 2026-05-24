import RehypeView from "@/components/views/rehype";

export default async function Page() {
  return <RehypeView locale="ja" />;
}

export const getConfig = async () => ({ render: "static" }) as const;
