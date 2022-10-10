import Cookies from "cookies";
import { nanoid } from "nanoid/async";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { prisma } from "../server/db/client";
import { userIdCookieKey } from "../utils/constants";
import { UrlCreateForm } from "../components/UrlCreateForm";

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Head>
        <title>Surler</title>
        <meta name="description" content="Simple url shortener application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        Your user ID is {props.userId}
        <UrlCreateForm />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  userId: string;
}> = async ({ req, res }) => {
  if (req.cookies[userIdCookieKey]) {
    return { props: { userId: req.cookies[userIdCookieKey] } };
  }

  const userId = await nanoid();
  await prisma.user.create({ data: { id: userId } });

  const cookies = new Cookies(req, res);
  cookies.set(userIdCookieKey, userId, { httpOnly: true, expires: undefined });

  return { props: { userId } };
};

export default Home;
