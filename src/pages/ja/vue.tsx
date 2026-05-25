import VueView from "@/components/views/vue";

export default async function Page() {
  return <VueView locale="ja" />;
}

export const getConfig = async () => ({ render: "static" }) as const;
