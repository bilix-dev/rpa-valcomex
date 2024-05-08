import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { GRANTS, dateDiff, hasAccess } from "./helpers/helper";
import { menuItems } from "./constant/data";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(req) {
    //Solo redireccionar si token existe
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/api") || pathname.startsWith("/assets")) {
      return NextResponse.next();
    }

    if (token && pathname.startsWith("/auth")) {
      return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
    }

    const expiredPassword = token?.expiration
      ? dateDiff(new Date(), new Date(token?.expiration)) < 0
      : false;

    //Si la contraseña esta expirada, redireccionar a reset password
    if (expiredPassword && !pathname.startsWith("/reset-password")) {
      return NextResponse.redirect(`${req.nextUrl.origin}/reset-password`);
    }

    //Si contraseña no esta expirada, redireccionar a home
    if (!expiredPassword && pathname.endsWith("/reset-password")) {
      return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
    }

    // if (
    //   token == null &&
    //   pathname.startsWith("/api") &&
    //   !pathname.startsWith("/api/auth") &&
    //   !pathname.startsWith("/api/external") &&
    //   !pathname.startsWith("/api/register") &&
    //   !pathname.startsWith("/api/reset")
    // )
    //   return NextResponse.json(
    //     { status: 1, message: "No autorizado" },
    //     { status: 401 }
    //   );

    // if (pathname.startsWith("/api/external")) {
    //   try {
    //     const external_token = req.headers.get("Authorization").split(" ")[1];
    //     await jose.jwtVerify(
    //       external_token,
    //       new TextEncoder().encode(
    //         pathname.startsWith("/api/external/login")
    //           ? process.env.NEXTAUTH_EXTERNAL_SECRET
    //           : process.env.NEXTAUTH_SECRET
    //       )
    //     );
    //   } catch (e) {
    //     return NextResponse.json(
    //       { status: 1, message: "No autorizado" },
    //       { status: 401 }
    //     );
    //   }
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const path = pathname.split("/")[1];
        //Siempre aceptar para que entre al middleware
        if (
          path == "auth" ||
          path == "reset-password" ||
          path == "register" ||
          path == "assets" ||
          path == "api"
        ) {
          return true;
        }

        //Verificar ruta base
        if (path == "profile" || path == "dashboard") return token != null;

        const grant = menuItems.some((x) =>
          x.child?.some((y) => y.grant == pathname.substring(1))
        );

        //verificar permiso por ruta inicial
        return grant
          ? hasAccess(token?.role)(pathname.substring(1), GRANTS.view)
          : true;
      },
    },
  }
);

export const config = {
  matcher: ["/auth/:path*", "/:path*"],
};
