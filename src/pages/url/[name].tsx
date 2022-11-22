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

  return {
    redirect: { destination: url ? url.sourceUrl : "/", permanent: false },
  };
};

export default UrlPage;
