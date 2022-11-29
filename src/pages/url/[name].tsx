import { GetServerSideProps, NextPage } from "next";

const UrlPage: NextPage = () => {
  return <div>Its impossible to get there</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const urlName = ctx.params?.name;

  if (!urlName || Array.isArray(urlName)) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const url = await prisma.url.findFirst({ where: { name: urlName } });

  if (!url) {
    return {
      redirect: { destination: "/", permanent: false },
    };
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
