import { headers } from "next/headers";

export default async function Page({
  params
}: {
  params: { domain: string; slug?: string[] }
}) {
  const host = (await headers()).get("host");

  return <div>Hello basic from { host } </div>;
}