import Cookies from "cookies";
import { nanoid } from "nanoid/async";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { LoadingPlaceholder } from "../components/Placeholders";
import { UrlCreateForm } from "../components/UrlCreateForm";
import { UrlTable } from "../components/UrlTable";
import { prisma } from "../server/db/client";
import { userIdCookieKey } from "../utils/constants";
import { trpc } from "../utils/trpc";

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { isLoading, data, refetch } = trpc.url.getAll.useQuery();

  const refetchUrls = () => refetch();

  return (
    <>
      <Head>
        <title>Surler</title>
        <meta name="description" content="Simple url shortener application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative z-50 mx-auto max-w-[1280px]">
        <nav className="flex flex-row px-[2rem] py-4">
          <span className="text-4xl font-extrabold text-white">surler</span>
        </nav>
        <main className="flex flex-col gap-y-4  p-[2rem]">
          <UrlCreateForm onCreate={refetchUrls} />
          {isLoading ? (
            <LoadingPlaceholder />
          ) : (
            <UrlTable urls={data!} onRemove={refetchUrls} />
          )}
        </main>
      </div>
    </>
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
