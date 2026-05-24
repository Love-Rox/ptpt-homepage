import BlogIndexView from "@/components/views/blog-index";

export default async function Page() {
  return <BlogIndexView locale="ja" />;
}

export const getConfig = async () => ({ render: "dynamic" }) as const;
