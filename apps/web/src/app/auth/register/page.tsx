import { redirect } from "next/navigation";

export default function RegisterRedirect() {
  redirect("/workspace/new");
}
