import { headers } from "next/headers";

export default async function Page({
  params
}: {
  params: { domain: string; slug?: string[] }
}) {
  const host = (await headers()).get("host");

  return <html>
    <body>
      <div> default page { host } </div>
    </body>
    </html>
}
