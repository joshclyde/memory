import { useMultiState, MultiStateKey } from "src/composables/useMultiState";

type Status = null | "PENDING" | "COMPLETE";

interface FormState<ValuesState> {
  values: ValuesState;
  status: Status;
  success: Record<string, string>;
  error: null | string;
}

export const isStatusPending = (status: Status): status is "PENDING" =>
  status === "PENDING";

export const useFormMultiState = <ValuesState>(
  createFormState: (key: MultiStateKey) => ValuesState,
  /*
    I thought about passing states to the submit function,
    but I realized that the function can kinda access it although
    it is a bit odd.
  */
  submit: (key: MultiStateKey) => Promise<string>
) => {
  const multiState = useMultiState<FormState<ValuesState>>((key) => {
    return {
      values: createFormState(key),
      status: null,
      success: {},
      error: null,
    };
  });

  const onSubmit = async (key: MultiStateKey) => {
    // Ensure we don't submit while a submission is currently in progress
    if (!isStatusPending(multiState.states[key].status)) {
      multiState.states[key].status = "PENDING";
      multiState.states[key].error = null;
      try {
        const message = await submit(key);
        const timeoutId = String(
          setTimeout(() => {
            delete multiState.states[key].success[timeoutId];
          }, 3000)
        );
        multiState.states[key].success[timeoutId] = message;
      } catch (e) {
        console.error(`An error occured.`);
        multiState.states[key].error = "Error!!"; // TODO: better error message
      }
      multiState.states[key].status = "COMPLETE"; // TODO: what should I do when the submission is complete?
    }
  };
  return {
    ...multiState,
    onSubmit,
  };
};
