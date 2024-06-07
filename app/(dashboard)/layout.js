import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Operator, Rpa, User } from "@/database/models";
import DashboardRoot from "./DashboardRoot";
import { AuthProvider } from "@/context/AuthProvider";

export default async function DashboardLayout({ children }) {
  const data = await getServerSession(authOptions);
  const user = await User.unscoped().findByPk(data.user?.id);
  const operator = await Operator.findByPk(data.user?.operatorId, {
    include: [
      {
        model: Rpa,
      },
    ],
  });

  return (
    <AuthProvider
      user={user.get({ plain: true })}
      operator={operator.get({ plain: true })}
    >
      <DashboardRoot>{children}</DashboardRoot>
    </AuthProvider>
  );
}
