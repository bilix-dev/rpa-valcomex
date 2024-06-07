import LoadingIcon from "@/components/ui/LoadingIcon";
import Tooltip from "@/components/ui/Tooltip";
import useSWRDelete from "@/hooks/useSWRDelete";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

export const DeleteModal = ({ url, key = [], mutation }) => {
  const { isMutating, trigger } = useSWRDelete(url);
  const { mutate } = useSWRConfig();
  return (
    <Tooltip content="Borrar" placement="top" arrow animation="fade">
      <button
        disabled={isMutating}
        className="action-btn  btn-danger"
        type="button"
        onClick={async () => {
          const result = await trigger();
          if (!result) {
            toast.warning(
              "No se puede eliminar un registro que ya fue utilizado."
            );
          } else mutation ? mutation() : await mutate(key);
        }}
      >
        <LoadingIcon icon="heroicons:trash" isLoading={isMutating} />
      </button>
    </Tooltip>
  );
};
