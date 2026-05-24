import DemoView from "@/components/views/demo";

export default async function Page() {
  return <DemoView locale="en" />;
}

export const getConfig = async () => ({ render: "static" }) as const;
