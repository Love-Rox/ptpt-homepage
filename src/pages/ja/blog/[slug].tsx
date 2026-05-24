import type { PageProps } from "waku/router";
import BlogPostView from "@/components/views/blog-post";

export default async function Page({ slug }: PageProps<"/ja/blog/[slug]">) {
  return <BlogPostView locale="ja" slug={slug} />;
}

export const getConfig = async () => ({ render: "dynamic" }) as const;
