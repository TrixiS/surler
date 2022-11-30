import { Url } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { CheckMarkIcon } from "./Icons";
import { Placeholder } from "./Placeholders";

const createUrlHref = (urlName: string) => {
  const url = new URL(`./url/${urlName}`, window.location.href);
  return url.href;
};

const NoUrlsPlaceholder = () => {
  return (
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
  );
};

const CopyUrlButton: React.FC<{ url: Url }> = ({ url }) => {
  const [isCopied, setIsCopied] = useState(false);
  const href = createUrlHref(url.name);

  if (isCopied) {
    return (
      <span className="text-primary">
        <CheckMarkIcon />
      </span>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 hover:cursor-pointer hover:text-primary"
      onClick={() => {
        navigator.clipboard.writeText(href);
        setIsCopied(true);
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
      />
    </svg>
  );
};

const UrlToggleButton: React.FC<{ url: Url }> = ({ url }) => {
  const toggleUrlMutation = trpc.url.toggle.useMutation();
  const isEnabled = toggleUrlMutation.data?.enabled ?? url.enabled;

  const handleChange = () => toggleUrlMutation.mutate({ urlName: url.name });

  return (
    <label className="swap">
      <input type="checkbox" checked={isEnabled} onChange={handleChange} />
      <div className="swap-on">ON</div>
      <div className="swap-off">OFF</div>
    </label>
  );
};

export const UrlTable: React.FC<{ urls: Url[] }> = ({ urls }) => {
  return (
    <table className="flex w-full flex-col rounded-xl border-2 border-zinc-700 bg-zinc-800">
      {urls.length > 0 ? (
        <tbody className="flex flex-col divide-y divide-dashed divide-zinc-700">
          {urls.map((url) => (
            <tr className="inline-flex p-4 font-normal">
              <td className="text-normal flex w-full flex-col place-items-center">
                <CopyUrlButton url={url} />
              </td>
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
                <UrlToggleButton url={url} />
              </td>
            </tr>
          ))}
        </tbody>
      ) : (
        <NoUrlsPlaceholder />
      )}
    </table>
  );
};
