import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Dashboard from "@/components/ui/Dashboard/Dashboard";
import {
  Container,
  ContainerMatch,
  ServiceOrder,
  User,
} from "@/database/models";
import { toFormatContainer, toFormatDateTime } from "@/helpers/helper";
import { getServerSession } from "next-auth";
export const metadata = {
  title: {
    default: "Inicio",
  },
};

async function Page() {
  const { user } = await getServerSession(authOptions);

  const li = await ContainerMatch.findAll({
    include: [
      {
        required: true,
        model: Container,
        include: [
          { model: ServiceOrder, where: { operatorId: user?.operatorId } },
        ],
      },
      {
        model: User,
      },
    ],
    limit: 5,
    order: [[`createdAt`, "DESC"]],
  });

  const p_li = JSON.parse(JSON.stringify(li));

  const test = await fetch(`http://sai.puertocolumbo.com:8080/XPS/login.jsp`);
  const response = await test.text();

  return (
    <Dashboard
      test={response}
      data={{
        lastInscriptions: p_li.map((x) => [
          toFormatContainer(x.container.name),
          x.user.name,
          x.user.dni,
          x.plateNumber,
          toFormatDateTime(x.container.matchDate),
        ]),
      }}
    />
  );
}

export default Page;
