&ldquo;use client&rdquo;

// Inspired by react-hot-toast library
import * as React from &ldquo;react&rdquo;

import type {
  ToastActionElement,
  ToastProps,
} from &ldquo;@/components/ui/toast&rdquo;

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Replace the actionTypes object with an enum
enum ActionType {
  ADD_TOAST = &ldquo;ADD_TOAST&rdquo;,
  UPDATE_TOAST = &ldquo;UPDATE_TOAST&rdquo;,
  DISMISS_TOAST = &ldquo;DISMISS_TOAST&rdquo;,
  REMOVE_TOAST = &ldquo;REMOVE_TOAST&rdquo;,
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Update the Action type to use the enum
type Action =
  | {
      type: ActionType.ADD_TOAST;
      toast: ToasterToast;
    }
  | {
      type: ActionType.UPDATE_TOAST;
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType.DISMISS_TOAST;
      toastId?: ToasterToast[&ldquo;id&rdquo;];
    }
  | {
      type: ActionType.REMOVE_TOAST;
      toastId?: ToasterToast[&ldquo;id&rdquo;];
    };

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: ActionType.REMOVE_TOAST,
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Update the reducer cases
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case ActionType.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case ActionType.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case ActionType.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, &ldquo;id&rdquo;>

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: ActionType.UPDATE_TOAST,
      toast: { ...props, id },
    });
  const dismiss = () =>
    dispatch({ type: ActionType.DISMISS_TOAST, toastId: id });

  dispatch({
    type: ActionType.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      }

export { useToast, toast }
