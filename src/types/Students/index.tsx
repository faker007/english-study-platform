import { IStudentGroup } from "../../api/models";
import { FILTER_SEARCH_TYPES } from "../../constants/Students";

export type FilterSearchType = keyof typeof FILTER_SEARCH_TYPES;

interface IFilterDefaultProps {
  group: unknown;
  searchQuery: string;
  searchType: FilterSearchType;
}

export interface IFilterProps extends IFilterDefaultProps {
  group: IStudentGroup | null;
}

export interface IFilterForm extends IFilterDefaultProps {
  group: string;
}

export interface IRefetchState {
  refetch: () => Promise<void>;
}
