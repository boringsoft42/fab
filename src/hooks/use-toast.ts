import { toast } from &ldquo;sonner&rdquo;;

export const useToast = () => {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: &ldquo;default&rdquo; | &ldquo;destructive&rdquo;;
      duration?: number;
    }) => {
      if (props.variant === &ldquo;destructive&rdquo;) {
        toast.error(props.title || props.description || &ldquo;Error&rdquo;, {
          description:
            props.title && props.description ? props.description : undefined,
          duration: props.duration,
        });
      } else {
        toast.success(props.title || props.description || &ldquo;Success&rdquo;, {
          description:
            props.title && props.description ? props.description : undefined,
          duration: props.duration,
        });
      }
    },
  };
};
