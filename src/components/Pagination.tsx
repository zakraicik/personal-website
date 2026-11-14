import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export function Pagination({ page, pages, onChange, item = "page" }: {
  page: number; pages: number; onChange: (page: number) => void; item?: string;
}) {
  return <div className="pagination">
    <span className="mono">{item} {page + 1} / {pages}</span>
    <div><button className="pager-button" disabled={page === 0} aria-label={`Previous ${item}`} onClick={() => onChange(page - 1)}><HiChevronLeft aria-hidden="true" /></button>
      <button className="pager-button" disabled={page >= pages - 1} aria-label={`Next ${item}`} onClick={() => onChange(page + 1)}><HiChevronRight aria-hidden="true" /></button></div>
  </div>;
}
