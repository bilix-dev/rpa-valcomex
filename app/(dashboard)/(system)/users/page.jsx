import User from "@/components/ui/User/User";

export const metadata = {
  title: {
    default: "Usuarios",
  },
};

export default async function Page() {
  return <User />;
}
