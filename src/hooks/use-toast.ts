import { toast } from "sonner";

export const useToast = () => {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
      duration?: number;
    }) => {
      if (props.variant === "destructive") {
        toast.error(props.title || props.description || "Error", {
          description:
            props.title && props.description ? props.description : undefined,
          duration: props.duration,
        });
      } else {
        toast.success(props.title || props.description || "Success", {
          description:
            props.title && props.description ? props.description : undefined,
          duration: props.duration,
        });
      }
    },
  };
};
