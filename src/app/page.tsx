import { redirect } from "next/navigation";

export default function Page() {
  redirect("/build");
  return <html>
    <body>
      <div> home page </div>
    </body>
  </html>;
}