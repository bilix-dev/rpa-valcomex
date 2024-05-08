import ChangePassword from "@/components/ui/ChangePassword/ChangePassword";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Operator, User } from "@/database/models";

export const metadata = {
  title: {
    default: "Cambiar Contraseña",
  },
};

async function Page() {
  const data = await getServerSession(authOptions);
  const user = await User.unscoped().findByPk(data?.user?.id);
  const operator = await Operator.unscoped().findByPk(data?.user?.operatorId);
  return (
    <ChangePassword
      user={user.get({ plain: true })}
      operator={operator.get({ plain: true })}
    />
  );
}

export default Page;
