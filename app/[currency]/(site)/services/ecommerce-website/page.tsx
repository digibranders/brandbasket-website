import type { Metadata } from "next";
import type { ReactElement } from "react";
import { EcommercePage } from "@/components/services/EcommercePage";
import { currencyParam } from "@/lib/currency";
import { pageMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(ROUTES.ecommerce);

export default async function Page({ params }: { readonly params: Promise<{ readonly currency: string }> }): Promise<ReactElement> {
  return <EcommercePage currency={await currencyParam(params)} />;
}
