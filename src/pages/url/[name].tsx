import { GetServerSideProps, NextPage } from "next";

const UrlPage: NextPage = () => {
  return <div>Its impossible to get there</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const urlName = ctx.params?.name;
  const homeRedirect = {
    redirect: { destination: "/", permanent: false },
  };

  if (!urlName || Array.isArray(urlName)) {
    return homeRedirect;
  }

  const url = await prisma.url.findFirst({ where: { name: urlName } });

  if (!url?.enabled) {
    return homeRedirect;
  }

  await prisma.url.update({
    where: { name: url.name },
    data: { clickCount: { increment: 1 } },
  });

  return {
    redirect: { destination: url.sourceUrl, permanent: false },
  };
};

export default UrlPage;
