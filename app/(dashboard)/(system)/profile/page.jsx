import ProfileForm from "@/components/ui/Profile/Profile";
import React from "react";

export const metadata = {
  title: {
    default: "Perfil",
  },
};

async function Page() {
  return <ProfileForm />;
}

export default Page;
