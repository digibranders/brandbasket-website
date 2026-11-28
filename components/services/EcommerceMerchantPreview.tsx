"use client";

import { Archive, ClipboardText, Package, Storefront } from "@phosphor-icons/react";
import { type ReactElement, useId, useState } from "react";
import { ECOMMERCE_MERCHANT_PREVIEW } from "@/content/ecommerce";

const VIEW_ICONS = { orders: ClipboardText, products: Package, stock: Archive } as const;

type MerchantView = (typeof ECOMMERCE_MERCHANT_PREVIEW.views)[number];

export function EcommerceMerchantPreview(): ReactElement {
  const [view, setView] = useState<MerchantView>(ECOMMERCE_MERCHANT_PREVIEW.views[0]);
  const panelId = useId();
  const titleId = useId();

  return (
    <div className="ecommerce-merchant-preview">
      <div className="ecommerce-merchant-bar">
        <span className="ecommerce-merchant-store"><Storefront size={21} weight="duotone" aria-hidden="true" />{ECOMMERCE_MERCHANT_PREVIEW.store}</span>
        <span className="ecommerce-merchant-caption">Sample dashboard</span>
      </div>
      <div className="ecommerce-merchant-views" role="group" aria-label="Dashboard views">
        {ECOMMERCE_MERCHANT_PREVIEW.views.map((option) => {
          const Icon = VIEW_ICONS[option.id];
          return (
            <button key={option.id} type="button" aria-pressed={view.id === option.id} aria-controls={panelId} onClick={() => setView(option)}>
              <Icon size={19} weight="duotone" aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </div>
      <div id={panelId} className="ecommerce-merchant-panel">
        <div className="ecommerce-merchant-panel-heading">
          <h3 id={titleId} aria-live="polite">{view.title}</h3>
          <p>{view.detail}</p>
        </div>
        <table aria-labelledby={titleId}>
          <thead><tr>{view.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody key={view.id}>
            {view.rows.map(({ name, detail, value, status, tone }) => (
              <tr key={name}>
                <th scope="row"><strong>{name}</strong><span>{detail}</span></th>
                <td>{value}</td>
                <td><span className="ecommerce-merchant-status" data-tone={tone}>{status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
