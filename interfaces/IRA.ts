import { OutputType } from "@/enums/OutputType";

export interface IRA {
  id: string;
  name: string;
  outputs: IRAOutput[];

  location: {
    lat: number;
    long: number;
  };
}

interface IRAOutput {
  type: OutputType;
  value: string;
}
