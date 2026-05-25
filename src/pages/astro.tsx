import AstroView from "@/components/views/astro";

export default async function Page() {
  return <AstroView locale="en" />;
}

export const getConfig = async () => ({ render: "static" }) as const;
