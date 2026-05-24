import RehypeView from "@/components/views/rehype";

export default async function Page() {
  return <RehypeView locale="en" />;
}

export const getConfig = async () => ({ render: "static" }) as const;
