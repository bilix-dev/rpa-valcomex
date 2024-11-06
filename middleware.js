import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { GRANTS, dateDiff, hasAccess } from "./helpers/helper";
import { menuItems } from "./constant/data";
import * as jose from "jose";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(req) {
    //Solo redireccionar si token existe
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/assets")) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api")) {
      if (!token) {
        if (
          !(
            pathname.startsWith("/api/external") ||
            pathname.startsWith("/api/auth") ||
            pathname.startsWith("/api/register") ||
            pathname.startsWith("/api/reset") ||
            pathname.startsWith("/api/mobile")
          )
        ) {
          return NextResponse.json(
            { error: "Usuario no autorizado" },
            { status: 401 }
          );
        }
      }

      //Si es una api de aplicacion movil (si tiene o no token es lo mismo)
      if (pathname.startsWith("/api/mobile")) {
        if (!pathname.startsWith("/api/mobile/auth")) {
          try {
            const requestHeaders = new Headers(req.headers);
            const authorization = requestHeaders.get("authorization");
            const jwt = authorization.split(" ")[1];

            const { payload } = await jose.jwtVerify(
              jwt,
              new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
            );
            requestHeaders.delete("authorization");
            requestHeaders.set("userId", payload.identifier.userId);
            requestHeaders.set("operatorId", payload.identifier.operatorId);
            requestHeaders.set("userName", payload.identifier.userName);
            return NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            });
          } catch (e) {
            return NextResponse.json({ error: e.message }, { status: 401 });
          }
        }
      }

      return NextResponse.next();
    }

    if (token && pathname.startsWith("/auth")) {
      return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
    }

    const expiredPassword =
      token?.user_expires && token?.expiration
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
