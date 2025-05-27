import { APIClient } from "simpu-api-sdk";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const simpuClient = new APIClient({
  ai: "",
  apps: "",
  graph: "",
  report: "",
  events: "",
  payment: "",
  notification: "",
  "apps-action": "",
  "knowledge-base": "",
  core: process.env.NEXT_PUBLIC_CORE_API_URL ?? "",
  core: process.env.NEXT_PUBLIC_SIMPU_CORE_API_URL ?? "",
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: { error: "/login", signIn: "/login", signOut: "/login" },
  callbacks: {
    async jwt({ token, trigger, session, user }: any) {
      if (user) {
        token.user = user;
      }

      if (trigger === "update") {
        token.user = session.user;
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user = token.user;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: {
          type: "email",
          label: "username",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const payload = {
            username: credentials?.username ?? "",
            password: credentials?.password ?? "",
          };
          const { user: auth, token, organisations } =
            //@ts-ignore
            await simpuClient.auth.login(payload);

          if (!organisations.length) {
            throw new Error(
              "Unable to login. We couldn't find any workspace for this email."
            );
          }

          //@ts-ignore
          simpuClient.headers = {
            Authorization: token,
            organisationID: organisations?.[0]?.id,
          };

          const { profile } = await simpuClient.profile.getProfile();

          const businessHoursData =
            await simpuClient.inbox.business_hours.getBusinessHoursSettings();

          if (!businessHoursData) {
            await simpuClient.inbox.business_hours.upsertBusinessHoursSettings({
              schedules: {},
              is_enabled: false,
              timezone: "Africa/Lagos",
              message:
                "We are currently closed. Our business hours are Monday to Friday, 9 AM to 5 PM.",
            });
          }

          return {
            auth,
            token,
            profile,
            id: auth.id,
            image: profile.image,
            name: `${profile.first_name} ${profile.last_name}`,
          };
        } catch (error: any) {
          throw new Error(error?.response?.data.message);
        }
      },
    }),
  ],
});
