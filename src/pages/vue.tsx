import VueView from "@/components/views/vue";

export default async function Page() {
  return <VueView locale="en" />;
}

export const getConfig = async () => ({ render: "static" }) as const;
