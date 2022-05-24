export interface StateComputedFields {
  createdDate: string;
  lastModified: string;
}

export interface StateTagUserInput {
  name: string;
}

export interface StateTag extends StateTagUserInput, StateComputedFields {}

export interface StateFlashcardUserInput {
  front: string;
  back: string;
  tags: Array<string>;
}

export interface StateFlashcard
  extends StateFlashcardUserInput,
    StateComputedFields {}