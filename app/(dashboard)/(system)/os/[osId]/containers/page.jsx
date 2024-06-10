import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Container from "@/components/ui/Container/Container";
import { GRANTS, hasAccess } from "@/helpers/helper";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export const metadata = {
  title: {
    default: "Contenedores",
  },
};

async function Page() {
  const { user } = await getServerSession(authOptions);
  if (!hasAccess(user?.role)("os", GRANTS.view)) return notFound();
  return <Container />;
}

export default Page;
