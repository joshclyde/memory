import { ref } from "vue";

type Status = null | "PENDING" | "SUCCESS" | "ERROR";

export const isStatusPending = (status: Status): status is "PENDING" =>
  status === "PENDING";

export const useAsyncStatus = <T extends Array<any>>(
  asyncFunction: (...args: T) => Promise<void>
) => {
  const status = ref<Status>(null);
  const error = ref<null | string>(null);
  const wrapper = async (...args: T) => {
    // Ensure we don't submit while a submission is currently in progress
    if (!isStatusPending(status.value)) {
      status.value = "PENDING";
      error.value = null;
      try {
        await asyncFunction(...args);
        status.value = "SUCCESS";
      } catch (e) {
        status.value = "ERROR";
        error.value = "Error!!"; // TODO: better error message
      }
    }
  };
  return {
    status,
    error,
    wrapper,
  };
};
