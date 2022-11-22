import { trpc } from "../utils/trpc";

const Placeholder: React.FC<{ icon: React.ReactNode; message: string }> = ({
  icon,
  message,
}) => {
  return (
    <div className="flex w-full flex-col place-items-center p-6">
      {icon}
      <p className="text-md uppercase leading-tight">{message}</p>
    </div>
  );
};

export const UrlTable: React.FC = () => {
  const { isLoading, data } = trpc.url.getAll.useQuery();

  if (isLoading) {
    return (
      <Placeholder
        message="Loading..."
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="-mt-2 h-24 w-24 animate-spin"
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
    );
  }

  return (
    <table className="flex w-full flex-col rounded-xl border-2 border-zinc-700 bg-zinc-800">
      {isLoading ? (
        <Placeholder
          message="Loading..."
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-2 h-24 w-24 animate-spin"
            >
              <path
                fillRule="evenodd"
                d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      ) : data?.length ? (
        <tbody className="flex flex-col divide-y divide-dashed divide-zinc-700">
          {data.map((url) => (
            <tr className="inline-flex p-4 font-normal">
              <td className="flex w-full flex-col place-items-center text-white">
                {url.name}
              </td>
              <td className="flex w-full flex-col place-items-center">
                <a className="hover:underline" href={url.sourceUrl}>
                  {url.sourceUrl}
                </a>
              </td>
              <td className="flex w-full flex-col place-items-center">
                {url.clickCount}
              </td>
              <td className="flex w-full flex-col place-items-center">
                {/* TODO: handle swap change */}
                <label className="swap">
                  <input type="checkbox" defaultChecked={url.enabled} />
                  <div className="swap-on">ON</div>
                  <div className="swap-off">OFF</div>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      ) : (
        <Placeholder
          message="No urls"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-2 h-24 w-24"
            >
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
              <path
                fillRule="evenodd"
                d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      )}
    </table>
  );
};
