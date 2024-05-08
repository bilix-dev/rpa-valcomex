import { hasAccess } from "@/helpers/helper";
import { useSession } from "next-auth/react";

const useAuth = (opts = {}) => {
  const session = useSession(opts);
  return {
    ...session,
    userId: session?.data?.user?.id,
    operatorId: session?.data?.user?.operatorId,
    hasRoleAccess: hasAccess(session?.data?.user?.role),
  };
};

export default useAuth;
