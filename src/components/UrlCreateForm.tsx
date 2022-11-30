import { zodResolver } from "@hookform/resolvers/zod";
import { Url } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { urlInputSchema } from "../utils/validation";
import { CheckMarkIcon } from "./Icons";

type UrlFormData = z.infer<typeof urlInputSchema>;

const ErrorLabel: React.FC<{ message: string }> = ({ message }) => {
  return (
    <label className="pl-1 text-start text-xs text-red-500">{message}</label>
  );
};

const UrlFormSubmitButton: React.FC<{
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
}> = (props) => {
  return (
    <button
      type="submit"
      className={`btn btn-primary gap-x-1 ${
        props.isSubmitting ? "loading" : ""
      }`}
    >
      {!props.isSubmitting && props.isSubmitSuccessful && (
        <span className="text-green-500">
          <CheckMarkIcon />
        </span>
      )}
      Add URL
    </button>
  );
};

export const UrlCreateForm: React.FC<{ onCreate: (url: Url) => any }> = ({
  onCreate,
}) => {
  const {
    register,
    handleSubmit: handleSubmitWrapper,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<UrlFormData>({ resolver: zodResolver(urlInputSchema) });

  const urlCreateMutation = trpc.url.create.useMutation();

  const handleSubmit = async (data: UrlFormData) => {
    try {
      const url = await urlCreateMutation.mutateAsync(data);
      onCreate(url);
    } catch (e: any) {
      if (e.meta.response.status === 409) {
        setError("name", { message: e.message });
      }
    }
  };

  return (
    <div className="flex w-full flex-col rounded-xl border-2 border-zinc-700 bg-zinc-800 p-2">
      <form
        onSubmit={handleSubmitWrapper(handleSubmit as any)}
        className="flex w-full flex-col md:flex-row"
      >
        <div className="flex w-full flex-col md:w-4/6">
          <input
            {...register("url")}
            className="input rounded-none bg-transparent px-1 focus:outline-none"
            placeholder="https://"
          />
          {errors.url?.message && <ErrorLabel message={errors.url.message} />}
        </div>
        <div className="mb-2 flex w-full flex-col md:mb-0 md:w-2/6">
          <input
            {...register("name")}
            className="input rounded-none bg-transparent px-1 focus:outline-none"
            placeholder="Enter name"
          />
          {errors.name?.message && <ErrorLabel message={errors.name.message} />}
        </div>
        <UrlFormSubmitButton
          isSubmitting={isSubmitting}
          isSubmitSuccessful={isSubmitSuccessful}
        />
      </form>
    </div>
  );
};
