export default function PageHero({
  eyebrow, greeting, title, subtitle, rates, children, }) {
  return (
    <div className="page-hero fade-in-up">
      <div>
        {eyebrow && <div className = "page-hero__eyebrow">{eyebrow}</div>}
        {greeting && <div className = "page-hero__greeting">{greeting}</div>}
        <h1 className = "page-hero__title">{title}</h1>
        {subtitle && <div className = "page-hero__subtitle">{subtitle}</div>}
      </div>
      <div className = "d-flex align-items-end gap-3 flex-wrap">
        {rates?.map((r, i) => (
          <div key={i} className = "rate-pill fade-in-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
            <span className = "rate-pill__label">{r.label}</span>
            <span className = "rate-pill__value">{r.value}</span>
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}
