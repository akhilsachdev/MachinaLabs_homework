import Image from "next/image";
import { Inter } from "next/font/google";
import FileTree from "@/components/FileTree";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <FileTree />
  );
}
