// src/components/ui/Skeleton.jsx

// ─── Base pulse block ─────────────────────────────────────────────────────────
export const Skeleton = ({
  className = "",
  style = {},
}) => (
  <div
    className={`
      bg-stone-200 dark:bg-stone-700
      rounded-lg
      animate-pulse
      ${className}
    `}
    style={style}
  />
);

// ─── Sweet card skeleton ──────────────────────────────────────────────────────
export const SweetCardSkeleton = () => (
  <div
    className="
      bg-white dark:bg-stone-800
      rounded-2xl border border-stone-200 dark:border-stone-700
      overflow-hidden
    "
  >
    {/* Emoji / image area */}
    <Skeleton className="h-40 w-full rounded-none" />

    <div className="p-4 space-y-3">

      {/* Category badge */}
      <Skeleton className="h-4 w-16 rounded-full" />

      {/* Sweet name */}
      <Skeleton className="h-5 w-3/4" />

      {/* Description */}
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />

      {/* Price row */}
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>

      {/* Button */}
      <Skeleton className="h-10 w-full rounded-xl mt-1" />

    </div>
  </div>
);

// ─── Search bar skeleton ──────────────────────────────────────────────────────
export const SearchBarSkeleton = () => (
  <Skeleton className="h-11 w-full max-w-lg rounded-xl" />
);

// ─── Category filter skeleton ─────────────────────────────────────────────────
export const CategoryFilterSkeleton = () => (
  <div className="flex gap-2 overflow-hidden">
    {[80, 100, 72, 112, 88, 96].map((w, i) => (
      <Skeleton
        key={i}
        className="h-9 rounded-xl flex-shrink-0"
        style={{ width: `${w}px` }}
      />
    ))}
  </div>
);

// ─── Page header skeleton ─────────────────────────────────────────────────────
export const PageHeaderSkeleton = () => (
  <div className="flex items-center justify-between">
    <div className="space-y-2">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-28" />
    </div>

    <Skeleton className="h-10 w-32 rounded-xl" />
  </div>
);

// ─── Admin stat card skeleton ─────────────────────────────────────────────────
export const StatCardSkeleton = () => (
  <div
    className="
      bg-white dark:bg-stone-800
      border border-stone-200 dark:border-stone-700
      rounded-2xl
      p-5
      space-y-3
    "
  >
    <Skeleton className="h-4 w-24" />

    <Skeleton className="h-8 w-20" />

    <Skeleton className="h-3 w-32" />
  </div>
);

// ─── Admin table row skeleton ────────────────────────────────────────────────
export const TableRowSkeleton = () => (
  <tr
    style={{
      borderBottom: "1px solid #e7e5e4",
    }}
  >
    <td style={{ padding: "16px" }}>
      <Skeleton className="h-4 w-28" />
    </td>

    <td style={{ padding: "16px" }}>
      <Skeleton className="h-4 w-20" />
    </td>

    <td style={{ padding: "16px" }}>
      <Skeleton className="h-4 w-16" />
    </td>

    <td style={{ padding: "16px" }}>
      <Skeleton className="h-8 w-24 rounded-lg" />
    </td>
  </tr>
);