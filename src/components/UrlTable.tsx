import { Url } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { CheckMarkIcon } from "./Icons";
import { Placeholder } from "./Placeholders";

// TODO: remove url button
type OnRemoveCallback = (url: Url) => any;

const createUrlHref = (urlName: string) => {
  const url = new URL(`./url/${urlName}`, window.location.href);
  return url.href;
};

const wrapHref = (href: string) => {
  const url = new URL(href);
  return url.host;
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

  const handleClick = () => {
    navigator.clipboard.writeText(href);
    setIsCopied(true);

    const isCopiedExpirationTimeoutMs = 5000;

    setTimeout(() => {
      setIsCopied(false);
    }, isCopiedExpirationTimeoutMs);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 hover:cursor-pointer hover:text-primary"
      onClick={handleClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
      />
    </svg>
  );
};

export const RemoveUrlButton: React.FC<{
  url: Url;
  onRemove: OnRemoveCallback;
}> = ({ url, onRemove }) => {
  const removeUrlMutation = trpc.url.remove.useMutation();

  const handleClick = async () => {
    await removeUrlMutation.mutateAsync({ urlName: url.name });
    onRemove(url);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 hover:text-red-600"
      onClick={handleClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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
      <div className="swap-on -mb-1">ON</div>
      <div className="swap-off -mb-1">OFF</div>
    </label>
  );
};

export const UrlTable: React.FC<{
  urls: Url[];
  onRemove: OnRemoveCallback;
}> = ({ urls, onRemove }) => {
  return (
    <div className="flex w-full flex-col overflow-auto rounded-xl border-2 border-zinc-700 bg-zinc-800 p-1">
      <table className="table-auto">
        {urls.length > 0 ? (
          <tbody className="w-full divide-y divide-dashed divide-zinc-700">
            {urls.map((url) => (
              <tr>
                <td className="p-4">
                  <div className="flex flex-row gap-x-2">
                    <CopyUrlButton url={url} />
                    <RemoveUrlButton url={url} onRemove={onRemove} />
                  </div>
                </td>
                <td className="p-4 text-white">{url.name}</td>
                <td>
                  <a className="p-4 hover:underline" href={url.sourceUrl}>
                    {wrapHref(url.sourceUrl)}
                  </a>
                </td>
                <td className="p-4">{url.clickCount}</td>
                <td className="p-4">
                  <UrlToggleButton url={url} />
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <NoUrlsPlaceholder />
        )}
      </table>
    </div>
  );
};
