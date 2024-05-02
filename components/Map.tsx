import { IRA } from "@/interfaces/IRA";
import Image from "next/image";
export default function Map({ iras }: { iras: IRA[] }) {
  return <Image src={"/map.png"} width={1001} height={780} alt="image" />;
}
