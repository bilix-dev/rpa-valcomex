import NextAuth from "next-auth/next";
import bcrypt from "bcrypt";
import SequelizeAdapter from "@auth/sequelize-adapter";
import connection from "@/database/connection";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  User,
  Role,
  Grant,
  VerificationToken,
  Operator,
  UserLogin,
} from "@/database/models";

const findLoggedUserByPk = async (id) =>
  User.findByPk(id, {
    include: [
      { model: Operator },
      {
        model: Role,
        include: [
          {
            model: Grant,
          },
        ],
      },
    ],
  });

export const authOptions = {
  adapter: SequelizeAdapter(connection, {
    models: {
      User,
      VerificationToken,
    },
  }),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        userName: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { userName, password } = credentials;

        if (!userName || !password) return null;

        const user = await User.findOne({
          where: {
            userName,
          },
          include: [
            {
              required: true,
              model: Operator,
            },
          ],
        });

        const expired = user.operator.expiration
          ? new Date() > user.operator.expiration
          : false;

        if (!user || !user.status || !user.operator.status || expired)
          return null;

        const compare = await bcrypt.compare(password, user.hashedPassword);
        if (!compare) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const { id, userName, expiration, operatorId, role, status, operator } =
          await findLoggedUserByPk(user.id);
        const expired = operator.expiration
          ? new Date() > operator.expiration
          : false;

        //Guarda ultimo logeo
        await UserLogin.create({ userId: id });

        return {
          ...token,
          id,
          userName,
          operatorId,
          role,
          expiration,
          valid: status && operator.status && !expired,
        };
      } else {
        const { name, expiration, role, status, operator } =
          await findLoggedUserByPk(
            trigger == "update" && session?.userId ? session.userId : token.id
          );
        const expired = operator.expiration
          ? new Date() > operator.expiration
          : false;
        return {
          ...token,
          name,
          expiration,
          role,
          valid: status && operator.status && !expired,
        };
      }
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          userName: token.userName,
          name: token.name,
          email: token.email,
          id: token.id,
          expiration: token.expiration,
          operatorId: token.operatorId,
          role: token.role?.get({ plain: true }),
          valid: token.valid,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV == "development" ? true : false,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
