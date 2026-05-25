export default async function Page() {
  return <main>PTPT_SINGLE_ROUTE_TEST — if this is server-rendered, RSC works.</main>;
}

export const getConfig = async () => ({ render: "static" }) as const;
