import ChangePassword from "@/components/ui/ChangePassword/ChangePassword";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Operator, Role, User } from "@/database/models";

export const metadata = {
  title: {
    default: "Cambiar Contraseña",
  },
};

async function Page() {
  const data = await getServerSession(authOptions);
  const user = await User.unscoped().findByPk(data?.user?.id, {
    include: Role,
  });
  return <ChangePassword user={user.get({ plain: true })} />;
}

export default Page;
