import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Dashboard from "@/components/ui/Dashboard/Dashboard";
import { Tatc, Tstc, User, UserLogin } from "@/database/models";
import { getServerSession } from "next-auth";
import { Op, Sequelize } from "sequelize";

export const metadata = {
  title: {
    default: "Inicio",
  },
};

async function StarterPage() {
  const { user } = await getServerSession(authOptions);

  return <Dashboard />;
}

export default StarterPage;
